import { Component, OnInit } from '@angular/core';
import { ListService } from "../../../../services";
import { AccountService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.css']
})
export class JournalListComponent implements OnInit {

  journals = [];
  constructor(private listService: ListService, private router: Router, private toaster: ToastrService, private accountService: AccountService) { }

  ngOnInit() {
    this.fetchJournals();
  }

  fetchJournals() {
    this.accountService.getData('journal')
      .subscribe((result: any) => {
        this.journals = result;
        console.log('this.journals', this.journals);
      })
  }

  deleteJournal(journalID) {
    this.accountService.getData(`journal/delete/${journalID}`)
      .subscribe((result: any) => {
        this.fetchJournals();
        this.toaster.success('Manual journal deleted successfully.');
      })
  }

}
