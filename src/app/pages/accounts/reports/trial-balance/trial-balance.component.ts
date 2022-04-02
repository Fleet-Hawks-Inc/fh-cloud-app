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
    end: '';
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
                    for (let i = 0; i < this.accounts.length; i++) {
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD';
                            this.accounts = _.filter(this.accounts, function (o) {
                                return o.debit != '0' || o.credit != '0';
                            })
                        }
                        if (this.currTab === 'USD') {
                            this.currency = 'USD';
                            this.accounts = _.filter(this.accounts, function (o) {
                                return o.debit != '0' || o.credit != '0';
                            })
                        }
                    }
                    for (var i = 0; i < result.data.length; i++) {
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD'
                            if (result.data[i].debit != null) {
                                this.cadDebitTotal += parseFloat(result.data[i].debit);
                            }
                            if (result.data[i].credit != null) {
                                this.cadCreditTotal += parseFloat(result.data[i].credit);
                            }
                        }
                        if (this.currTab === 'USD') {
                            this.currency = 'USD'
                            if (result.data[i].debit != null) {
                                this.usdDebitTotal += parseFloat(result.data[i].debit);
                            }
                            if (result.data[i].credit != null) {
                                this.usdCreditTotal += parseFloat(result.data[i].credit);
                            }
                        }
                    }
                    this.accounts = _.filter(this.accounts, function (o) {
                        return o.actType != 'H';
                    });
                    this.accounts = _.filter(this.accounts, function (o) {
                        return o.actType != 'S';
                    });
                    this.accounts = _.filter(this.accounts, function (o) {
                        return o.actType != 'T';
                    });
                }
                if (this.currTab === 'CAD') {
                    this.currency = 'CAD'
                    if (this.accounts.length === 0) {
                        this.dataMessage = Constants.NO_RECORDS_FOUND;
                    }
                }
                if (this.currTab === 'USD') {
                    this.currency = 'USD'
                    if (this.accounts.length === 0) {
                        this.dataMessage = Constants.NO_RECORDS_FOUND;
                    }
                }

            });
    }



    searchFilter() {
        if (this.filter.startDate !== null || this.filter.endDate !== null) {
            this.start = this.filter.startDate;
            this.end = this.filter.endDate;
            this.cadDebitTotal = 0;
            this.cadCreditTotal = 0;
            this.usdDebitTotal = 0;
            this.usdCreditTotal = 0;
            this.accounts = [];
            this.dataMessage = Constants.FETCHING_DATA;
            this.fetchAccounts();
        }
    }



    resetFilter() {
        this.dataMessage = Constants.FETCHING_DATA;
        this.start = null;
        this.end = null;
        this.cadDebitTotal = 0;
        this.cadCreditTotal = 0;
        this.usdDebitTotal = 0;
        this.usdCreditTotal = 0;
        this.accounts = [];
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
                    obj["Account Name"] = element.accountName,
                        obj["Credit"] = element.credit
                    obj["Debit"] = element.debit
                    dataObject.push(obj)
                }
                let totObj = {

                    ["Credit"]: 'Total',
                    ["Debit"]: " "
                }
                if (this.currency === 'CAD') {
                    totObj["Total"] = this.cadCreditTotal
                    totObj["Total1"] = this.cadDebitTotal
                    dataObject.push(totObj)
                }
                else if (this.currency === 'USD') {
                    totObj["Total"] = this.usdCreditTotal
                    totObj["Total1"] = this.usdDebitTotal
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
                this.toaster.success("No Data Found")
                this.exportLoading = false
            }
        } catch (error) {
            this.exportLoading = false;
        }
    }
}