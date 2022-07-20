import { Component, OnInit,  Input, ViewChild } from '@angular/core';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService } from 'src/app/services/account.service';
import * as _ from 'lodash';
import { Table } from 'primeng/table';
import { ToastrService } from "ngx-toastr";
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
    currency = 'CAD';
    dataMessage = Constants.FETCHING_DATA;
    _selectedColumns: any[];
    dataColumns = [
    { width: '14%', field: 'accountNo', header: 'Account Number', type: "text" },
    { width: '14%', field: 'accountName', header: 'Account Name', type: "text" },
    { width: '14%', field: 'accountType', header: 'Account Type', type: "text" },
    { width: '14%', field: 'subAcClass', header: 'Account Class', type: "text" },
    { width: '14%', field: 'closingBalAmtCAD', header: 'Closing Balance CAD', type: "text" },
    { width: '14%', field: 'closingBalAmtUSD', header: 'Closing Balance USD', type: "text" },
  ];
    constructor(private accountService: AccountService, private toaster: ToastrService) { }
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


    async fetchBalance(refresh?: boolean) {
        this.accountService.getData(`chartAc/get/balance/report/${this.currency}/?start=${this.filter.startDate}&end=${this.filter.endDate}&date=${this.datee}`)
            .subscribe(async (result: any) => {
            if(result.data.length === 0){
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            }
                if (result.data.length > 0) {
                    result.data.map((v) => {
                        this.accounts.push(v);
                        this.accounts = _.sortBy(this.accounts, ['accountNo'])
                        console.log(this.accounts)
                    })
                }
            });
    }
}
