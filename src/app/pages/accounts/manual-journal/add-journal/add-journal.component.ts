import { Component, OnInit } from '@angular/core';
import { ListService } from "../../../../services";
import { AccountService, ApiService } from '../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { Location } from '@angular/common';
declare var $: any;

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
    jrNo: null,
    txnDate: moment().format('YYYY-MM-DD'),
    referenceNo: '',
    currency: null,
    notes: '',
    details: [{
      accountID: null,
      description: '',
      contactID: null,
      debit: 0,
      credit: 0,
      creditDisabled: false,
      debitDisabled: false
    },
    {
      accountID: null,
      description: '',
      contactID: null,
      debit: 0,
      credit: 0,
      creditDisabled: false,
      debitDisabled: false
    }],
    debitTotalAmount: 0,
    creditTotalAmount: 0,
    attachments: [],
    transactionLog: [],
  };
  difference = 0;
  accounts: any = [];

  contacts: any = [];
  errors = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  submitDisabled = true;
  journalID;
  Asseturl = this.apiService.AssetUrl;
  carrierID = '';
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');
  existingDocs = [];
  documentSlides = [];
  uploadedDocs = [];

  constructor(private listService: ListService,private route: ActivatedRoute,
    private location: Location, private router: Router, private toaster: ToastrService, private accountService: AccountService, private apiService: ApiService, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.journalID = this.route.snapshot.params['journalID'];
    if(this.journalID != undefined) {
      this.fetchJournalByID();
      this.submitDisabled = false;
    }
    this.listService.fetchChartAccounts();
    this.listService.fetchCustomers();
    this.contacts = this.listService.customersList;
    this.accounts = this.listService.accountsList;
  }

  addMoreDetails() {
    let obj = {
      accountID: null,
      description: '',
      contactID: null,
      debit: 0,
      credit: 0,
      creditDisabled: false,
      debitDisabled: false
    };
    this.journal.details.push(obj);
  }

  deleteDetail(index) {
    this.journal.details.splice(index, 1);
    this.calculateTotal();
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
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
    console.log('this.journal', this.journal);
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for (let i = 0; i < this.uploadedDocs.length; i++) {
      formData.append('uploadedDocs', this.uploadedDocs[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.journal));

    this.accountService.postData('journal', formData, true).subscribe({
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
        if (result[0] !== undefined) {
          this.journal = result[0];
          this.journal.transactionLog = result[0].transactionLog;
          this.existingDocs = result[0].attachments;
          this.carrierID = result[0].carrierID;
          this.journal.details.map((k, index) => {
            let type = '';
            if (k.debit === 0) {
              type = 'credit';
            } else {
              type = 'debit';
            }
            this.disableOtherField(type, index);
          })

          if (result[0].attachments != undefined && result[0].attachments.length > 0) {
            result[0].attachments.map((x) => {
              let obj = {
                name: x,
                path: `${this.Asseturl}/${result[0].carrierID}/${x}`
              }
              this.documentSlides.push(obj);
            })
          }
        }
      })
  }


  updateJournal() {
    this.submitDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    this.journal.attachments = this.existingDocs;
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for (let i = 0; i < this.uploadedDocs.length; i++) {
      formData.append('uploadedDocs', this.uploadedDocs[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.journal));

    this.accountService.putData(`journal/${this.journalID}`, formData, true).subscribe({
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
        this.cancel();
      },
    });
  }

  fetchAccounts() {
    this.accountService.getData(`chartAc/fetch/list`)
      .subscribe((result: any) => {
        if (result[0] != undefined) {
          this.accounts = result;
        }
      });
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

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length - 1];
    this.pdfSrc = '';
    if (ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  deleteDocument(name: string, index: number) {
    this.accountService.deleteData(`journal/uploadDelete/${this.journalID}/${name}`).subscribe((result: any) => {
      this.existingDocs.splice(index, 1);
      this.documentSlides.splice(index, 1);
      this.toaster.success('Attachment deleted successfully.');
    });
  }

  /*
    * Selecting files before uploading
    */
  selectDocuments(event) {
    let files = [...event.target.files];

    for (let i = 0; i < files.length; i++) {
      this.uploadedDocs.push(files[i])
    }
  }

  disableOtherField(type, index) {
    if(type === 'debit') {
      if(this.journal.details[index].debit > 0) {
        this.journal.details[index].credit = 0;
        this.journal.details[index].creditDisabled = true;
      } else {
        this.journal.details[index].creditDisabled = false;
      }
    } else if (type === 'credit') {
      if(this.journal.details[index].credit > 0) {
        this.journal.details[index].debit = 0;
        this.journal.details[index].debitDisabled = true;
      } else {
        this.journal.details[index].debitDisabled = false;
      }
    }
  }
}
