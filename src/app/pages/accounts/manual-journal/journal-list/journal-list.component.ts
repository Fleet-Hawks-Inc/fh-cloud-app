import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import Constants from '../../../fleet/constants';
import * as _ from "lodash";
import { Table } from 'primeng/table';
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
    jrNo: null,
    startDate: null,
    endDate: null,
  }
  lastItemSK = '';
  loaded = false;
  disableSearch = false;
  _selectedColumns: any[];
  dataColumns: any[];
  get = _.get;
  find = _.find;
  constructor(private toaster: ToastrService, private accountService: AccountService) { }

  ngOnInit() {
    this.fetchJournals();
    this.dataColumns = [
      { field: 'jrNo', header: 'Journal#', type: "text" },
      { field: 'txnDate', header: 'Journal Date', type: "text" },
      { field: 'referenceNo', header: 'Reference', type: "text" },
      { field: 'creditTotalAmount', header: 'Amount', type: "text" },
      { field: 'createdBy', header: 'Created By', type: "text" },
    ];
    this._selectedColumns = this.dataColumns;
    this.setToggleOptions()
  }
  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
  }

  async fetchJournals(refresh?: boolean) {
    let searchParam = null;
    if (refresh === true) {
      this.lastItemSK = '';
      this.journals = [];
    }
    if (this.lastItemSK !== 'end') {
      if (this.filter.jrNo !== null && this.filter.jrNo !== '') {
        searchParam = encodeURIComponent(`"${this.filter.jrNo}"`);
      } else {
        searchParam = null;
      }
      this.accountService.getData(`journal/paging?jrNo=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}`)
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.disableSearch = false;
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.loaded = true
          }
          if (result.length > 0) {
            this.disableSearch = false;
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
      this.accountService.deleteData(`journal/delete/${journalID}`)
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
    if (this.filter.jrNo !== null || this.filter.endDate !== null || this.filter.startDate !== null) {
      this.disableSearch = true;
      if (
        this.filter.startDate !== '' &&
        this.filter.endDate === ''
      ) {
        this.toaster.error('Please select both start and end dates.');
        return false;
      } else if (
        this.filter.startDate === '' &&
        this.filter.endDate !== ''
      ) {
        this.toaster.error('Please select both start and end dates.');
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toaster.error('Start date should be less then end date');
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
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      jrNo: null,
      startDate: null,
      endDate: null
    };
    this.lastItemSK = '';
    this.journals = [];
    this.fetchJournals();
  }

  onScroll() {
    if (this.loaded) {
      this.fetchJournals();
    }
    this.loaded = false;
  }
  clear(table: Table) {
    table.clear();
  }

  refreshData() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      jrNo: null,
      startDate: null,
      endDate: null
    };
    this.lastItemSK = '';
    this.journals = [];
    this.fetchJournals();
  }
}