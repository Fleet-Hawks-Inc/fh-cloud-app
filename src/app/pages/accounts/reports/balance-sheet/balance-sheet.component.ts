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

    dataMessage = Constants.FETCHING_DATA;
    mainArray = [];
    allTotal = [];

    assetArr = [];
    liabilityArr = [];
    equityArr = [];
    revenueArr = [];
    accArray = []
    expenseArr = [];
    lastItemSK = "";
    actName = null;
    actType = null;
    accounts: any = [];
    exportData = []
    filter = {
        actType: null,
        actName: null,
        startDate: null,
        endDate: null,
    };
    datee = '';
    disableSearch = false;
    exportLoading = false;
    loaded = false;
    start = null;
    end = null;
    currTab = "CAD";
    isLoadText = "Load More...";
    isLoad = false;
    dateMinLimit = { year: 1950, month: 1, day: 1 };
    date = new Date();
    futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
    //deactivatePredefined = true;
    CAD = [];
    USD = [];
    actID = "";
    acClasses = [];
    totalUSD = 0;
    totalCUSD = 0;
    totalDCAD = 0;
    totalCCAD = 0
    allExportData = [];
    lastExportSk = "";
    data1 = [];
    cadDebitTotal = 0;
    cadCreditTotal = 0;
    usdDebitTotal = 0;
    usdCreditTotal = 0;

    accountsClassObjects = {};
    coaData = {}
    mainactType: any;
    logDate: any;
    opnBalTypeCAD: string;
    tempResults = [];
    account: any;
    lastTimestamp: string;
    lastKey: "";
    dataMsgCad: string;
    currency = 'CAD';


    transactionLogCAD = [];
    creditTotal = 0;


    sortInventoryAssets: any = [];
    sortOtherCurrentAssets: any = [];
    sortCapitalAsset: any = [];
    sortONCAsset: any = [];
    currLiability: any = [];
    scEquity: any = [];
    retainedEarnings: any = [];
    ltLiability: any = [];

    //Current Assets Total CAD USD
    currentAssetTotalCAD = 0;
    currentAssetCreditTotalCAD = 0;
    currentAssetTotalUSD = 0;
    currentAssetCreditTotalUSD = 0;

    //Inventory Assets Total CAD USD
    inventoryAssetTotalCAD = 0;
    inventoryAssetTotalUSD = 0;

    //Capital Assets Total CAD USD
    capitalAssetTotalCAD = 0;
    capitalAssetTotalUSD = 0;

    //Other Non Current Assets Total CAD USD
    ONCAssetTotalCAD = 0;
    ONCAssetTotalUSD = 0;

    //Total of All Assets CAD USD
    totalAssetsCAD = 0;
    totalAssetsUSD = 0;

    //Current Liability Total CAD USD
    totalCurrentLiabilityCAD = 0;
    totalCurrentLiabilityUSD = 0;

    //Long Term Liabilities Total CAD USD
    totalLongTermLiabilityCAD = 0;
    totalLongTermLiabilityUSD = 0;

    //Total of all liability
    totalLiabilityCAD = 0;
    totalLiabilityUSD = 0;

    //Share Capital Total CAD USD
    totalShareCapitalCAD = 0;
    totalShareCapitalUSD = 0;

    //Retained Earnings Total CAD USD
    totalRetainedEarningsCAD = 0;
    totalRetainedEarningsUSD = 0;

    //Total of All Equities
    totalEquityCAD = 0
    totalEquityUSD = 0;

    //Total of All Equities and Liabilities
    totalLiabilityEquityCAD = 0;
    totalLiabilityEquityUSD = 0;
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
                if (result.data.length > 0) {
                    result.data.map((v) => {
                        this.accounts.push(v);
                        this.accounts = _.sortBy(this.accounts, ['accountNo'])
                        console.log(this.accounts)
                    })
                }
            });
    }

    changeTab(type) {
        this.currTab = type;
        this.accounts = [];
        if (this.currTab === 'CAD') {
            this.currency = 'CAD'
            this.currentAssetTotalCAD = 0;
            this.currentAssetCreditTotalCAD = 0;
            this.totalCurrentLiabilityCAD = 0;
            this.inventoryAssetTotalCAD = 0;
            this.capitalAssetTotalCAD = 0;
            this.ONCAssetTotalCAD = 0;
            this.totalLongTermLiabilityCAD = 0;
            this.totalShareCapitalCAD = 0;
            this.totalRetainedEarningsCAD = 0;
            // this.lastItemSK = '';
            this.fetchBalance();
        } else if (this.currTab === 'USD') {
            this.currency = 'USD'
            this.currentAssetTotalUSD = 0;
            this.inventoryAssetTotalUSD = 0;
            this.totalCurrentLiabilityUSD = 0;
            this.capitalAssetTotalUSD = 0;
            this.ONCAssetTotalUSD = 0;
            this.totalLongTermLiabilityUSD = 0;
            this.totalShareCapitalUSD = 0;
            this.totalRetainedEarningsUSD = 0;
            // this.lastItemSK = '';
            this.fetchBalance();
        }
    }
}
