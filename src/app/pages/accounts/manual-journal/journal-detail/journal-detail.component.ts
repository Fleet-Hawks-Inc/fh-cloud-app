import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-journal-detail',
  templateUrl: './journal-detail.component.html',
  styleUrls: ['./journal-detail.component.css']
})
export class JournalDetailComponent implements OnInit {

  journalID;
  journal;

  constructor(private accountService: AccountService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.journalID = this.route.snapshot.params['journalID'];
    this.fetchJournalByID();
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
          this.journal = result[0];
        }
      })
  }
}
