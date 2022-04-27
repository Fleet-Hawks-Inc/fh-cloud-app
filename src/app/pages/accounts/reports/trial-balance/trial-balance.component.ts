import { Component, OnInit } from '@angular/core';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService } from 'src/app/services/account.service';
import * as _ from 'lodash';
import { ToastrService } from "ngx-toastr";
import { $ } from 'protractor';
import * as moment from 'moment'
import { Router, ActivatedRoute, Params } from '@angular/router';




//import { AccountService } from 'src/app/services';

@Component({
    selector: 'app-trial-balance',
    templateUrl: './trial-balance.component.html',
    styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent implements OnInit {
    dataMessage = Constants.FETCHING_DATA;
    assetArr = [];
    liabilityArr = [];
    equityArr = [];
    revenueArr = [];
    accArray = []
    expenseArr = [];
    actName = null;
    actType = null;
    accounts: any = [];
    exportData = []
    public filter = {
        actType: null,
        actName: null,
        startDate: null,
        endDate: null,
    };
    end : '';
    start: '';
    datee = '';
    disableSearch = false;
    exportLoading = false;
    currTab = "CAD";
    isLoadText = "Load More...";
    isLoad = false;
    dateMinLimit = { year: 1950, month: 1, day: 1 };
    date = new Date();
    futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
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
    creTotal : any= [];
    debTotal :any = [];

    accountsClassObjects = {};
    coaData = {}
    mainactType: any;
    logDate: any;
    opnBalTypeCAD: string;
    tempResults = [];
    account: any;
    lastTimestamp: string;
    dataMsgCad: string;
    currency = 'CAD';
    transactionLogCAD = [];
    creditTotal = 0;
    result = [];
    startDate: string;
    public endDate: string;
    tempcredit :any= [];
    tempdebit :any=[];
    


    constructor(private accountService: AccountService, private toaster: ToastrService, private route: ActivatedRoute) { }
    ngOnInit() {
        this.filter.endDate = moment().format("YYYY-MM-DD");
        this.filter.startDate = moment().subtract(15, 'day').format('YYYY-MM-DD');
        this.fetchAccounts();
        this.fetchAccountClassByIDs();
        this.getAcClasses();
    }


    async fetchAccounts(refresh?: boolean) {
        if (refresh === true) {
            this.accounts = [];
        }
            this.accountService.getData(`chartAc/report/trialBalance/${this.currency}/?&start=${this.filter.startDate}&end=${this.filter.endDate}`)
                .subscribe(async (result: any) => {
                    if (result.data.length === 0) {
                        this.dataMessage = Constants.NO_RECORDS_FOUND;
                    }
                    if (result.data.length > 0) {
                        result.data.map((v) => {
                            this.accounts.push(v);
                         });
                         
                        const newArray: any = _.sortBy(this.accounts, ["accountNo"]);
                        this.accounts = newArray;
                        for(let i=0; i<this.accounts.length;i++){
                            if(this.accounts[i].debit === 0 || this.accounts[i].credit === 0) {
                                this.dataMessage = Constants.NO_RECORDS_FOUND;
                            }
                        }
                          for(let i = 0;i<this.accounts.length;i++)
                        {
                             if(this.currTab === 'CAD'){
                             this.currency = 'CAD';
                             this.accounts = _.filter(this.accounts, function(o){
                             return o.debit != '0'|| o.credit != '0';
                             })
                              
                             if(this.accounts[i].credit > this.accounts[i].debit) {
                                 this.tempcredit = this.accounts[i].credit - this.accounts[i].debit;
                                 this.accounts[i].credit = this.tempcredit;
                                this.accounts[i].debit = '0';
                             } else if(this.accounts[i].credit < this.accounts[i].debit) {
                                 this.tempdebit = this.accounts[i].debit - this.accounts[i].credit;
                                 this.accounts[i].debit = this.tempdebit;
                                 this.accounts[i].credit = '0';
                             }
                             }
                             
                            if(this.currTab === 'USD'){
                             this.currency = 'USD';
                             this.accounts = _.filter(this.accounts, function(o){
                             return o.debit != '0'|| o.credit != '0';
                             })
                             
                              if(this.accounts[i].credit > this.accounts[i].debit) {
                                 this.tempcredit = this.accounts[i].credit - this.accounts[i].debit;
                                 this.accounts[i].credit = this.tempcredit;
                                 this.accounts[i].debit = '0';
                                 
                             } else if(this.accounts[i].credit < this.accounts[i].debit) {
                                 this.tempdebit = this.accounts[i].debit - this.accounts[i].credit;
                                 this.accounts[i].debit = this.tempdebit;
                                 this.accounts[i].credit = '0';
                             }
                             }
                        }
                          for(let i=0;i<=this.accounts.length;i++) {
                              if(this.currTab === 'CAD') {
                                  this.currency = 'CAD';
                                      this.cadCreditTotal += parseFloat(this.accounts[i].credit);
                                      this.cadDebitTotal += parseFloat(this.accounts[i].debit);
                              }
                              if(this.currTab === 'USD') {
                                  this.currency = 'USD';
                                  this.usdCreditTotal += parseFloat(this.accounts[i].credit);
                                  this.usdDebitTotal += parseFloat(this.accounts[i].debit);
                              }
                         }
                    }
                    if (this.currTab === 'CAD') {
                             this.currency = 'CAD'
                    if(this.accounts.length === 0){
                      this.dataMessage = Constants.NO_RECORDS_FOUND;
                         }
                             }
                    if (this.currTab === 'USD') {
                        this.currency = 'USD'
                    if(this.accounts.length === 0){
                     this.dataMessage = Constants.NO_RECORDS_FOUND;
                           }
                         }
                });
               }
   
    searchFilter() { 
        if (this.filter.startDate !== null || this.filter.endDate !== null) {
           this.start = this.filter.startDate;
            this.end = this.filter.endDate;
          if (this.start > this.end) {
        this.toaster.error('Start Date should be less then end date.');
        return false;
          }
          else{
            this.cadDebitTotal = 0;
            this.cadCreditTotal = 0;
            this.usdDebitTotal = 0;
            this.usdCreditTotal = 0;
            this.accounts = [];
            this.creTotal = [];
            this.debTotal = [];
            this.dataMessage = Constants.FETCHING_DATA;
            this.fetchAccounts();
          }
        }
    }

    resetFilter() {
        this.dataMessage = Constants.FETCHING_DATA;
        this.filter.endDate = moment().format("YYYY-MM-DD");
        this.filter.startDate = moment().subtract(15, 'day').format('YYYY-MM-DD');
        this.cadDebitTotal = 0;
        this.cadCreditTotal = 0;
        this.usdDebitTotal = 0;
        this.usdCreditTotal = 0;
        this.accounts = [];
        this.creTotal = [];
        this.debTotal = [];
        this.fetchAccounts();
    }

    fetchAccountClassByIDs() {
        this.accountService
            .getData("chartAc/get/accountClass/list/all")
            .subscribe((result: any) => {
                this.accountsClassObjects = result;
            });
    }



    getAcClasses() {
        this.accountService.getData("chartAc/get/acClasses").subscribe((res) => {
            this.acClasses = res;
        });
    }
    refreshClass() {
        this.getAcClasses();
    }



    //For Switching Tab
    changeTab(type) {
        this.currTab = type;
        this.accounts = [];
        if (this.currTab === "CAD") {
            this.currency = 'CAD'
             this.cadDebitTotal = 0;
             this.cadCreditTotal = 0;
            this.fetchAccounts();
        } else if (this.currTab === "USD") {
            this.currency = 'USD'
            this.usdDebitTotal = 0;
            this.usdCreditTotal = 0;
            this.fetchAccounts();
        }
    }

    //For Generating CSV
    async generateCSV() {
        this.exportLoading = true;
        let dataObject = []
        let csvArray = []
        let provArray = [];
        try {
            if (this.accounts.length > 0) {
                for (const element of this.accounts) {
                     let obj = {}
                    obj["Account Number"] = element.accountNo
                    obj["Account Name"] = element.accountName
                    obj["Debit"] = element.debit === '0' ? '-': element.debit
                    obj["Credit"] = element.credit === '0' ? '-': element.credit
                    dataObject.push(obj)  
                }
                 let totObj = {
                    ["Debit"]  : 'Total' ,
                    ["Credit"] : " "
                 }
                  if(this.currency === 'CAD'){
                      totObj["Total1"] = this.cadDebitTotal.toFixed(2)
                      totObj["Total"] = this.cadCreditTotal.toFixed(2)
                      dataObject.push(totObj)
                 }
                else if(this.currency === 'USD') {
                      totObj["Total1"] = this.usdDebitTotal.toFixed(2)
                      totObj["Total"] = this.usdCreditTotal.toFixed(2)
                      dataObject.push(totObj)
                  }
                let headers = Object.keys(dataObject[0]).join(',')
                headers += '\n'
                csvArray.push(headers)
                for (const element of dataObject) {
                   let value = Object.values(element).join(',')
                    value += '\n'
                    csvArray.push(value)
                }
                const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8' })
                const link = document.createElement('a');
                if (link.download !== undefined) {
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}-trialBalance.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                this.exportLoading = false
            }
            else {
                this.toaster.error("No Records Found")
                this.exportLoading = false
            }
        } catch (error) {
            this.exportLoading = false;
        }
    }
}
