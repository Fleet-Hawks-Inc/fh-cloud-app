import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import  Constants  from '../../../fleet/constants';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.css']
}) 
export class JournalListComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  journals = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  filter = {
    amount: '',
    startDate: null,
    endDate: null,
  }

  constructor(private toaster: ToastrService, private accountService: AccountService) { }

  ngOnInit() {
    this.fetchJournals();
  }

  fetchJournals() {
    this.accountService.getData(`journal/paging?amount=${this.filter.amount}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}`)
      .subscribe((result: any) => {
        if(result.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.journals = result;
      })
  }

  deleteJournal(journalID) {
    this.accountService.getData(`journal/delete/${journalID}`)
      .subscribe((result: any) => {
        this.fetchJournals();
        this.toaster.success('Manual journal deleted successfully.');
      })
  }

  searchFilter() {
    if(this.filter.amount !== '' || this.filter.endDate !== null || this.filter.startDate !== null) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchJournals();
    }
  }

  resetFilter() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      amount: '',
      startDate: null,
      endDate: null
    }
    this.fetchJournals();

  }
}
