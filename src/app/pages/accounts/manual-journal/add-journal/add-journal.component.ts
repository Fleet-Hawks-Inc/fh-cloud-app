import { Component, OnInit } from '@angular/core';
import { ListService } from "../../../../services";
import { AccountService } from '../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-journal',
  templateUrl: './add-journal.component.html',
  styleUrls: ['./add-journal.component.css']
})
export class AddJournalComponent implements OnInit {

  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  journal = {
    date: null,
    referenceNo: '',
    currency: null,
    notes: '',
    details: [{
      accountID: null,
      description: '',
      contactID: null,
      debit: 0,
      credit: 0
    },
    {
      accountID: null,
      description: '',
      contactID: null,
      debit: 0,
      credit: 0
    }],
    debitTotalAmount: 0,
    creditTotalAmount: 0,
  };
  difference = 0;
  accounts = [];

  contacts: any = [];
  errors = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  submitDisabled = true;
  journalID;

  constructor(private listService: ListService,private route: ActivatedRoute, private router: Router, private toaster: ToastrService, private accountService: AccountService) { }

  ngOnInit() {
    this.journalID = this.route.snapshot.params['journalID'];
    if(this.journalID != undefined) {
      this.fetchJournalByID();
      this.submitDisabled = false;
    }
    this.fetchAccounts();
    this.listService.fetchCustomers();
    this.contacts = this.listService.customersList;
  }

  addMoreDetails() {
    let obj = {
      accountID: null,
      description: '',
      contactID: null,
      debit: 0,
      credit: 0
    };
    this.journal.details.push(obj)
  }

  deleteDetail(index) {
    this.journal.details.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal() {
    this.journal.debitTotalAmount = 0;
    this.journal.creditTotalAmount = 0;
    this.difference = 0;

    for (let index = 0; index < this.journal.details.length; index++) {
      const element = this.journal.details[index];
      this.journal.debitTotalAmount += Number(element.debit);
      this.journal.creditTotalAmount += Number(element.credit);
    }

    this.difference = Math.abs(this.journal.debitTotalAmount - this.journal.creditTotalAmount);
    if(this.difference === 0) {
      this.submitDisabled = false;
    } else {
      this.submitDisabled = true;
    }
  }

  addJournal() {
    this.submitDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    this.accountService.postData('journal', this.journal).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.submitDisabled = false;
              // this.throwErrors();
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => {
            },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toaster.success('Manual journal added successfully.');
        this.router.navigateByUrl('/accounts/manual-journal/list');
      },
    });
  }

  fetchJournalByID() {
    this.accountService.getData(`journal/${this.journalID}`)
      .subscribe((result: any) => {
        if(result[0] != undefined) {
          delete result[0].created;
          delete result[0].accountSK;
          delete result[0].journalID;
          delete result[0].carrierID;
          delete result[0]._type;
          delete result[0].isDeleted;
          this.journal = result[0];
        }
      })
  }

  updateJournal() {
    this.submitDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    this.accountService.putData(`journal/${this.journalID}`, this.journal).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.submitDisabled = false;
              // this.throwErrors();
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => {
            },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toaster.success('Manual journal updated successfully.');
        this.router.navigateByUrl('/accounts/manual-journal/list');
      },
    });
  }

  fetchAccounts() {
    this.accountService.getData(`chartAc`)
      .subscribe((result: any) => {
        if (result[0] != undefined) {
          this.accounts = result;
        }
      })
  }

  checkSelectedAccount(accountID, selectedIndex) {
    let prevAccounts = [];
    this.journal.details.map((element, index) => {
      if(selectedIndex !== index && element.accountID !== null) {
        prevAccounts.push(element.accountID)
      }
      return true;
    });
    if(prevAccounts.includes(accountID)) {
      setTimeout(() => {
        this.journal.details[selectedIndex].accountID = null;
      });
      this.toaster.error('This bank account is already selected.');
      return false;
    }
  }
}
