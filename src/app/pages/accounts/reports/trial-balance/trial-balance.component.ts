import { Component, OnInit } from '@angular/core';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService } from 'src/app/services/account.service';
import * as _ from 'lodash';
import { ToastrService } from "ngx-toastr";
import { $ } from 'protractor';
import * as moment from 'moment'


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
    result: any;


    constructor(private accountService: AccountService, private toaster: ToastrService) { }

    ngOnInit() {
        this.filter.endDate = moment().format("YYYY-MM-DD");
        this.filter.startDate = moment().subtract(15, 'day').format('YYYY-MM-DD');
        this.fetchAccounts();
        this.fetchAccountClassByIDs();
        this.getAcClasses();
    }


    async fetchAccounts(refresh?: boolean) {
        if (refresh === true) {
            this.lastItemSK = "";
            this.accounts = [];
        }
        if (this.lastItemSK !== "end") {
            this.accountService.getData(`chartAc/get/coa/${this.currency}/?lastKey=${this.lastItemSK}&start=${this.filter.startDate}&end=${this.filter.endDate}`)
                .subscribe(async (result: any) => {
                    if (result.data.length === 0) {
                        this.dataMessage = Constants.NO_RECORDS_FOUND;
                    }
                    if (result.data.length > 0) {
                        result.data.map((v) => {
                            this.accounts.push(v);
                        });
                        this.lastItemSK = result.lastKey;
                        const newArray: any = _.sortBy(this.accounts, ["accountNo"]);
                        this.accounts = newArray;
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
                        this.loaded = true;
                    }
                });
        }
    }


    //For Scrolling Page
    onScroll() {
        if (this.loaded) {
            this.isLoad = true;
            this.isLoadText = "Loading";
            this.fetchAccounts();
            this.lastItemSK = '';
        }
        this.loaded = false;
    }


    searchFilter() {
        if (this.filter.startDate !== null || this.filter.endDate !== null) {
            this.start = this.filter.startDate;
            this.end = this.filter.endDate;
            this.accounts = [];
            this.lastItemSK = '';
            this.dataMessage = Constants.FETCHING_DATA;
            this.fetchAccounts();
        }
    }



    resetFilter() {
        this.dataMessage = Constants.FETCHING_DATA;
        this.start = null;
        this.end = null;
        this.lastItemSK = "";
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
            this.lastItemSK = '';
            this.fetchAccounts();
        } else if (this.currTab === "USD") {
            this.currency = 'USD'
            this.lastItemSK = '';
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

                console.log('dataObject', dataObject);
                let headers = Object.keys(dataObject[0]).join(',')
                headers += '\n'
                csvArray.push(headers)
                for (const element of dataObject) {
                    let value = Object.values(element).join(',')
                    value += '\n'
                    csvArray.push(value)
                }
                console.log("csv", csvArray);
                const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8' })
                const link = document.createElement('a');
                if (link.download !== undefined) {
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}-invoice.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                console.log('Export', this.allExportData);
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