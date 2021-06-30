import { Component, OnInit } from '@angular/core';
import { AccountService, ApiService } from '../../../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-journal-detail',
  templateUrl: './journal-detail.component.html',
  styleUrls: ['./journal-detail.component.css']
})
export class JournalDetailComponent implements OnInit {

  journalID;
  journal = {
    details: []
  };
  contacts = [];
  accounts = [];

  constructor(private accountService: AccountService, private router: Router, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    this.journalID = this.route.snapshot.params['journalID'];
    this.fetchJournalByID();
    this.fetchContacts();
    this.fetchAccounts();
  }

  fetchJournalByID() {
    this.accountService.getData(`journal/${this.journalID}`)
      .subscribe((result: any) => {
        if(result[0] != undefined) {
          this.journal = result[0];
        }
      })
  }

  fetchContacts() {
    this.apiService.getData(`contacts/get/list`)
      .subscribe((result: any) => {
        this.contacts = result;
      })
  }

  fetchAccounts() {
    this.accountService.getData(`chartAc/get/list/all`)
      .subscribe((result: any) => {
        this.accounts = result;
        console.log('this.accounts', this.accounts)
      })
  }
}
