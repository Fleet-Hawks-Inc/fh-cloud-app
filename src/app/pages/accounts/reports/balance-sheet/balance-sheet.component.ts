import { Component, OnInit } from '@angular/core';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService } from 'src/app/services/account.service';
import * as _ from 'lodash';
import { ToastrService } from "ngx-toastr";
import { $ } from 'protractor';
import * as moment from 'moment'
@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.css']
})
export class BalanceSheetComponent implements OnInit {
  dataMessage = Constants.FETCHING_DATA;
    mainArray = [];
    
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
    lastExportSk="";
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
    
     transactionLogCAD =[];
    creditTotal = 0;
    
  
    sortInventoryAssets:any = [];
    sortOtherCurrentAssets: any = [];
    sortCapitalAsset: any = [];
    sortONCAsset: any = [];
    currLiability: any = [];
    scEquity: any = [];
    retainedEarnings: any = [];
    ltLiability: any = [];
    
    
  constructor(private accountService: AccountService, private toaster: ToastrService) { }

  ngOnInit() {
  this.filter.endDate = moment().format("YYYY-MM-DD");
        this.filter.startDate = moment().subtract(15, 'day').format('YYYY-MM-DD');
   this.fetchBalence();
  }

    
    
    async fetchBalence(refresh?: boolean){
    if(this.lastItemSK !== 'end'){
    this.accountService.getData(`chartAc/get/balence/report/${this.currency}/?lastKey=${this.lastItemSK}&start=${this.filter.startDate}&end=${this.filter.endDate}&date=${this.datee}`)
    .subscribe(async(result: any) => {
     if(result.data.length === 0){
     this.dataMessage = Constants.NO_RECORDS_FOUND;
     }
     if(result.data.length > 0){
     result.data.map((v) => {
     this.accounts.push(v);
     this.accounts = _.sortBy(this.accounts, ['accountNo'])    
     })
     this.lastItemSK = result.lastKey;
     
      
                   //Filtering H , S , T , X Groups and Expence and Revenue
                    this.accounts = _.filter(this.accounts, function (o) {
                           return o.accountType != 'H';
                         });
                    this.accounts = _.filter(this.accounts, function (o) {
                           return o.accountType != 'S';
                         });
                    this.accounts = _.filter(this.accounts, function (o) {
                           return o.accountType != 'T';
                         });
                    this.accounts = _.filter(this.accounts, function (o) {
                           return o.accountType != 'X';
                         });
                    this.accounts = _.filter(this.accounts, function (o) {
                           return o.accountClass != 'REVENUE';
                         });
                    this.accounts = _.filter(this.accounts, function (o) {
                           return o.accountClass != 'EXPENSE';
                         });
      
      
      //Sorting other Assets,Liabilities and Equities.
      var sortClass = _.chain(this.accounts).groupBy('subAcClass').map((value, key) => ({subAcClass: key, account: value})).value()
      for(let i = 0;i<sortClass.length;i++){
      if(sortClass[i].subAcClass == 'inventory'){
      this.sortInventoryAssets = sortClass[i].account;
      }
      if(sortClass[i].subAcClass == 'capital asset'){
      this.sortCapitalAsset = sortClass[i].account;
      }
       if(sortClass[i].subAcClass == 'other non-current asset'){
      this.sortONCAsset = sortClass[i].account;
      }
      if(sortClass[i].subAcClass == 'share capital'){
      this.scEquity = sortClass[i].account;
      }
      if(sortClass[i].subAcClass == 'retained earnings'){
      this.retainedEarnings = sortClass[i].account;
      }
      if(sortClass[i].subAcClass == 'long term debt'){
      this.ltLiability = sortClass[i].account;
      }
      }
      
      //Sorting Current Assets
      var sortAssets = _.chain(this.accounts).groupBy('accountClass').map((value, key) => ({accountClass: key, account: value})).value()
      for(let i = 0;i<sortAssets.length;i++){
      if(sortAssets[i].accountClass == 'ASSET'){
      this.sortOtherCurrentAssets = sortAssets[i].account;
      this.sortOtherCurrentAssets = _.filter(this.sortOtherCurrentAssets, function (o) {
      return o.subAcClass != 'inventory';
      });
      this.sortOtherCurrentAssets = _.filter(this.sortOtherCurrentAssets, function (o) {
      return o.subAcClass != 'capital asset';
      });
      this.sortOtherCurrentAssets = _.filter(this.sortOtherCurrentAssets, function (o) {
      return o.subAcClass != 'other non-current asset';
      });
      this.sortOtherCurrentAssets = _.filter(this.sortOtherCurrentAssets, function (o) {
      return o.subAcClass != 'other current asset';
      });
      console.log('current assets',this.sortOtherCurrentAssets)
      }
      }
      
      //Sorting Current Liabilities.
      var sortLiability = _.chain(this.accounts).groupBy('accountClass').map((value, key) => ({accountClass: key, account: value})).value()
      for(let i = 0;i<sortAssets.length;i++){
      if(sortAssets[i].accountClass == 'LIABILITY'){
      this.currLiability = sortAssets[i].account;
      this.accounts = _.filter(this.accounts, function (o) {
      return o.subAcClass != 'long term debt';
      });
      console.log('current assets',this.currLiability)
      }
      }
      this.loaded = true;
      }
    });
    }
    }
    
    changeTab(type) {
    this.currTab = type;
    if (this.currTab === 'CAD') {
       // this.fetchBalence();
        
    } else if (this.currTab === 'USD') {
        //this.fetchBalence();
    }
    }
    
        //For Scrolling Page
    onScroll() {
        if (this.loaded) {
            this.isLoad = true;
            this.isLoadText = "Loading";
            this.fetchBalence();
            this.lastItemSK = '';
        }
        this.loaded = false;
    }
    
    }
  
