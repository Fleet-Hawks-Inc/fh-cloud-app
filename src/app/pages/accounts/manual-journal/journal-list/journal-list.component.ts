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
  lastItemSK = '';
  loaded = false;
  constructor(private toaster: ToastrService, private accountService: AccountService) { }

  ngOnInit() {
    this.fetchJournals();
  }

  async fetchJournals(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = '';
      this.journals = [];
    }
    if (this.lastItemSK !== 'end') {
      this.accountService.getData(`journal/paging?amount=${this.filter.amount}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}`)
        .subscribe(async(result: any) => {
          if (result.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          if(result.length > 0) {
            if (result[result.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(result[result.length - 1].sk);
            } else {
              this.lastItemSK = 'end';
            }

            result.map((v) => {
              this.journals.push(v);
            });
            this.loaded = true;
          }
      });
    }
  }

  deleteJournal(journalID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.accountService.getData(`journal/delete/${journalID}`)
      .subscribe((result: any) => {
        if (result !== undefined) {
          this.dataMessage = Constants.FETCHING_DATA;
          this.lastItemSK = '';
          this.journals = [];
          this.fetchJournals();
          this.toaster.success('Manual journal deleted successfully.');
        }
      });
    }
  }

  searchFilter() {
    if(this.filter.amount !== '' || this.filter.endDate !== null || this.filter.startDate !== null) {
      if (
        this.filter.startDate != "" &&
        this.filter.endDate == ""
      ) {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (
        this.filter.startDate == "" &&
        this.filter.endDate != ""
      ) {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toaster.error("Start date should be less then end date");
        return false;
      } else {
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastItemSK = '';
        this.journals = [];
        this.fetchJournals();
      }
    }
  }

  resetFilter() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      amount: '',
      startDate: null,
      endDate: null
    }
    this.lastItemSK = '';
    this.journals = [];
    this.fetchJournals();
  }

  onScroll() {
    if(this.loaded) {
    this.fetchJournals();
    }
  }
}
