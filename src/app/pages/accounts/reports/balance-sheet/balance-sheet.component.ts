import { Component, OnInit,  Input, ViewChild } from '@angular/core';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService } from 'src/app/services/account.service';
import * as _ from 'lodash';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr'
import { $ } from 'protractor';
import * as moment from 'moment'
@Component({
    selector: 'app-balance-sheet',
    templateUrl: './balance-sheet.component.html',
    styleUrls: ['./balance-sheet.component.css']
})
export class BalanceSheetComponent implements OnInit {
    @ViewChild('dt') table: Table;
    get = _.get;
    accounts: any = []
      filter = {
        actType: null,
        actName: null,
        startDate: null,
        endDate: null,
    };
    datee = '';
    loaded = false;
    dateMinLimit = { year: 1950, month: 1, day: 1 };
    date = new Date();
    futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
    currency = 'CAD';
    dataMessage = Constants.FETCHING_DATA;
    _selectedColumns: any[];
    dataColumns = [
    {  field: 'accountNo', header: 'Account Number', type: "text" },
    {  field: 'accountName', header: 'Account Name', type: "text" },
    {  field: 'accountType', header: 'Account Type', type: "text" },
    {  field: 'subAcClass', header: 'Account Class', type: "text" },
    {  field: 'closingBalAmtCAD', header: 'Closing Balance CAD', type: "text" },
    {  field: 'closingBalAmtUSD', header: 'Closing Balance USD', type: "text" },
  ];
    constructor(private accountService: AccountService, 
     private toastr: ToastrService,) { }
    ngOnInit() {
        this.filter.endDate = moment().format("YYYY-MM-DD");
        this.filter.startDate = moment().subtract(15, 'day').format('YYYY-MM-DD');
        this.fetchBalance();
        this.setToggleOptions();
    }


  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
  }

  searchFilter() {
    if (this.filter.startDate != null && this.filter.endDate != null) {
     if (this.filter.startDate != null && this.filter.endDate == null) {
     this.toastr.error('Please select both start and end dates.');
      return false;
     } else if (this.filter.startDate == null && this.filter.endDate != null) {
        this.toastr.error('Please select both start and end dates.');
        return false;
    } else if (this.filter.startDate > this.filter.endDate) {
                this.toastr.error('Start Date should be less then end date.');
         return false;
      } else {
         this.accounts = [];
         this.fetchBalance();
         this.dataMessage = Constants.FETCHING_DATA;
      }
    }
    else {
    return false;
    }
  }
 
  refreshData() {
  this.accounts = [];
   this.filter.endDate = moment().format("YYYY-MM-DD");
   this.filter.startDate = moment().subtract(15, 'day').format('YYYY-MM-DD');
   this.loaded = false;
   this.fetchBalance();
   this.dataMessage = Constants.FETCHING_DATA;
  }
    async fetchBalance(refresh?: boolean) {
        this.accountService.getData(`chartAc/get/balance/report/${this.currency}/?start=${this.filter.startDate}&end=${this.filter.endDate}&date=${this.datee}`)
            .subscribe(async (result: any) => {
            if(result.data.length === 0){
           
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            }
                if (result.data.length > 0) {
                    result.data.map((v) => {
                        this.accounts.push(v);
                        this.loaded = true;
                        this.accounts = _.sortBy(this.accounts, ['accountNo'])
                        console.log(this.accounts)
                    })
                }
            });
    }
        /**
     * Clears the table filters
     * @param table Table 
     */
    clear(table: Table) {
        table.clear();
    }

}
