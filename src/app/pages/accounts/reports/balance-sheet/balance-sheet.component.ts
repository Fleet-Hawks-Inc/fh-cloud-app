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
    currentAssetDebitTotalCAD = 0;
    currentAssetCreditTotalCAD = 0;
    currentAssetDebitTotalUSD = 0;
    currentAssetCreditTotalUSD = 0;

    //Inventory Assets Total CAD USD
    inventoryAssetDebitTotalCAD = 0;
    inventoryAssetCreditTotalCAD = 0;
    inventoryAssetDebitTotalUSD = 0;
    inventoryAssetCreditTotalUSD = 0;

    //Capital Assets Total CAD USD
    capitalAssetDebitTotalCAD = 0;
    capitalAssetCreditTotalCAD = 0;
    capitalAssetDebitTotalUSD = 0;
    capitalAssetCreditTotalUSD = 0;

    //Other Non Current Assets Total CAD USD
    ONCAssetDebitTotalCAD = 0;
    ONCAssetCreditTotalCAD = 0;
    ONCAssetDebitTotalUSD = 0;
    ONCAssetCreditTotalUSD = 0;

    //Total of All Assets CAD USD
    totalAssetsDebitCAD = 0;
    totalAssetsCreditCAD = 0;
    totalAssetsDebitUSD = 0;
    totalAssetsCreditUSD = 0;

    //Current Liability Total CAD USD
    totalCurrentLiabilityDebitCAD = 0;
    totalCurrentLiabilityCreditCAD = 0;
    totalCurrentLiabilityDebitUSD = 0;
    totalCurrentLiabilityCreditUSD = 0;

    //Long Term Liabilities Total CAD USD
    totalLongTermLiabilityDebitCAD = 0;
    totalLongTermLiabilityCreditCAD = 0;
    totalLongTermLiabilityDebitUSD = 0;
    totalLongTermLiabilityCreditUSD = 0;

    //Total of all liability
    totalLiabilityDebitCAD = 0;
    totalLiabilityCreditCAD = 0;
    totalLiabilityDebitUSD = 0;
    totalLiabilityCreditUSD = 0;

    //Share Capital Total CAD USD
    totalShareCapitalDebitCAD = 0;
    totalShareCapitalCreditCAD = 0;
    totalShareCapitalDebitUSD = 0;
    totalShareCapitalCreditUSD = 0;

    //Retained Earnings Total CAD USD
    totalRetainedEarningsDebitCAD = 0;
    totalRetainedEarningsCreditCAD = 0;
    totalRetainedEarningsDebitUSD = 0;
    totalRetainedEarningsCreditUSD = 0;

    //Total of All Equities
    totalEquityDebitCAD = 0
    totalEquityCreditCAD = 0;
    totalEquityDebitUSD = 0;
    totalEquityCreditUSD = 0;

    //Total of All Equities and Liabilities
    totalLiabilityEquityDebitCAD = 0;
    totalLiabilityEquityCreditCAD = 0;
    totalLiabilityEquityDebitUSD = 0;
    totalLiabilityEquityCreditUSD = 0;

    constructor(private accountService: AccountService, private toaster: ToastrService) { }
    ngOnInit() {
        this.filter.endDate = moment().format("YYYY-MM-DD");
        this.filter.startDate = moment().subtract(15, 'day').format('YYYY-MM-DD');
        this.fetchBalence();
    }



    async fetchBalence(refresh?: boolean) {
        if (this.lastItemSK !== 'end') {
            this.accountService.getData(`chartAc/get/balence/report/${this.currency}/?lastKey=${this.lastItemSK}&start=${this.filter.startDate}&end=${this.filter.endDate}&date=${this.datee}`)
                .subscribe(async (result: any) => {
                    if (result.data.length === 0) {
                        this.dataMessage = Constants.NO_RECORDS_FOUND;
                    }
                    if (result.data.length > 0) {
                        result.data.map((v) => {
                            this.accounts.push(v);
                            this.accounts = _.sortBy(this.accounts, ['accountNo'])
                        })
                        this.lastItemSK = result.lastKey;
                        if (this.lastItemSK !== result.lastKey) {
                            this.lastItemSK = 'end';
                        }


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
                        var sortClass = _.chain(this.accounts).groupBy('subAcClass').map((value, key) => ({ subAcClass: key, account: value })).value()
                        for (let i = 0; i < sortClass.length; i++) {
                            if (sortClass[i].subAcClass == 'inventory') {
                                this.sortInventoryAssets = sortClass[i].account;
                            }
                            if (sortClass[i].subAcClass == 'capital asset') {
                                this.sortCapitalAsset = sortClass[i].account;
                            }
                            if (sortClass[i].subAcClass == 'other non-current asset') {
                                this.sortONCAsset = sortClass[i].account;
                            }
                            if (sortClass[i].subAcClass == 'share capital') {
                                this.scEquity = sortClass[i].account;
                            }
                            if (sortClass[i].subAcClass == 'retained earnings') {
                                this.retainedEarnings = sortClass[i].account;
                            }
                            if (sortClass[i].subAcClass == 'long term debt') {
                                this.ltLiability = sortClass[i].account;
                            }
                        }

                        //Sorting Current Assets
                        var sortAssets = _.chain(this.accounts).groupBy('accountClass').map((value, key) => ({ accountClass: key, account: value })).value()
                        for (let i = 0; i < sortAssets.length; i++) {
                            if (sortAssets[i].accountClass == 'ASSET') {
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
                                console.log('current assets', this.sortOtherCurrentAssets)
                            }
                        }


                        //Sorting Current Liabilities.
                        var sortLiability = _.chain(this.accounts).groupBy('accountClass').map((value, key) => ({ accountClass: key, account: value })).value()
                        for (let i = 0; i < sortAssets.length; i++) {
                            if (sortAssets[i].accountClass == 'LIABILITY') {
                                this.currLiability = sortAssets[i].account;
                                this.accounts = _.filter(this.accounts, function (o) {
                                    return o.subAcClass != 'long term debt';
                                });
                                console.log('current assets', this.currLiability)
                            }
                        }

                        //Calculation Current Assets 
                        for (let i = 0; i < this.sortOtherCurrentAssets.length; i++) {
                            if (this.currTab === 'CAD') {
                                this.currency = 'CAD'
                                if (this.sortOtherCurrentAssets[i].debit != null) {
                                    this.currentAssetDebitTotalCAD += parseFloat(this.sortOtherCurrentAssets[i].debit);
                                }
                                if (this.sortOtherCurrentAssets[i].credit != null) {
                                    this.currentAssetCreditTotalCAD += parseFloat(this.sortOtherCurrentAssets[i].credit);
                                }
                            }
                        }
                        for (let i = 0; i < this.sortOtherCurrentAssets.length; i++) {
                            if (this.currTab === 'USD') {
                                this.currency = 'USD'
                                if (this.sortOtherCurrentAssets[i].debit != null) {
                                    this.currentAssetDebitTotalUSD += parseFloat(this.sortOtherCurrentAssets[i].debit);
                                }
                                if (this.sortOtherCurrentAssets[i].credit != null) {
                                    this.currentAssetCreditTotalUSD += parseFloat(this.sortOtherCurrentAssets[i].credit);
                                }
                            }
                        }
                        //Calculation Inventory Assets 
                        for (let i = 0; i < this.sortInventoryAssets.length; i++) {
                            if (this.currTab === 'CAD') {
                                this.currency = 'CAD'
                                if (this.sortInventoryAssets[i].debit != null) {
                                    this.inventoryAssetDebitTotalCAD += parseFloat(this.sortInventoryAssets[i].debit);
                                }
                                if (this.sortInventoryAssets[i].credit != null) {
                                    this.inventoryAssetCreditTotalCAD += parseFloat(this.sortInventoryAssets[i].credit);
                                }
                            }
                        }
                        for (let i = 0; i < this.sortInventoryAssets.length; i++) {
                            if (this.currTab === 'USD') {
                                this.currency = 'USD'
                                if (this.sortInventoryAssets[i].debit != null) {
                                    this.inventoryAssetDebitTotalUSD += parseFloat(this.sortInventoryAssets[i].debit);
                                }
                                if (this.sortInventoryAssets[i].credit != null) {
                                    this.inventoryAssetCreditTotalUSD += parseFloat(this.sortInventoryAssets[i].credit);
                                }
                            }
                        }
                        //Calculation Capital Assets 
                        for (let i = 0; i < this.sortCapitalAsset.length; i++) {
                            if (this.currTab === 'CAD') {
                                this.currency = 'CAD'
                                if (this.sortCapitalAsset[i].debit != null) {
                                    this.capitalAssetDebitTotalCAD += parseFloat(this.sortCapitalAsset[i].debit);
                                }
                                if (this.sortCapitalAsset[i].credit != null) {
                                    this.capitalAssetCreditTotalCAD += parseFloat(this.sortCapitalAsset[i].credit);
                                }
                            }
                        }
                        for (let i = 0; i < this.sortCapitalAsset.length; i++) {
                            if (this.currTab === 'USD') {
                                this.currency = 'USD'
                                if (this.sortCapitalAsset[i].debit != null) {
                                    this.capitalAssetDebitTotalUSD += parseFloat(this.sortCapitalAsset[i].debit);
                                }
                                if (this.sortCapitalAsset[i].credit != null) {
                                    this.capitalAssetCreditTotalUSD += parseFloat(this.sortCapitalAsset[i].credit);
                                }
                            }
                        }
                        //Calculation Other Non-Current Assets 
                        for (let i = 0; i < this.sortONCAsset.length; i++) {
                            if (this.currTab === 'CAD') {
                                this.currency = 'CAD'
                                if (this.sortONCAsset[i].debit != null) {
                                    this.ONCAssetDebitTotalCAD += parseFloat(this.sortONCAsset[i].debit);
                                }
                                if (this.sortONCAsset[i].credit != null) {
                                    this.ONCAssetCreditTotalCAD += parseFloat(this.sortONCAsset[i].credit);
                                }
                            }
                        }
                        for (let i = 0; i < this.sortONCAsset.length; i++) {
                            if (this.currTab === 'USD') {
                                this.currency = 'USD'
                                if (this.sortONCAsset[i].debit != null) {
                                    this.ONCAssetDebitTotalUSD += parseFloat(this.sortONCAsset[i].debit);
                                }
                                if (this.sortONCAsset[i].credit != null) {
                                    this.ONCAssetCreditTotalUSD += parseFloat(this.sortONCAsset[i].credit);
                                }
                            }
                        }
                        //Total of All Assets CAD USD
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD';
                            this.totalAssetsDebitCAD = this.currentAssetDebitTotalCAD + this.inventoryAssetDebitTotalCAD + this.capitalAssetDebitTotalCAD + this.ONCAssetDebitTotalCAD;
                            this.totalAssetsCreditCAD = this.currentAssetCreditTotalCAD + this.inventoryAssetCreditTotalCAD + this.capitalAssetCreditTotalCAD + this.ONCAssetCreditTotalCAD;
                        }
                        if (this.currTab === 'USD') {
                            this.currency = 'USD';
                            this.totalAssetsDebitUSD = this.currentAssetDebitTotalUSD + this.inventoryAssetDebitTotalUSD + this.capitalAssetDebitTotalUSD + this.ONCAssetDebitTotalUSD;
                            this.totalAssetsCreditUSD = this.currentAssetCreditTotalUSD + this.inventoryAssetCreditTotalUSD + this.capitalAssetCreditTotalUSD + this.ONCAssetCreditTotalUSD;
                        }
                        //Calculation current Liabilities
                        for (let i = 0; i < this.currLiability.length; i++) {
                            if (this.currTab === 'CAD') {
                                this.currency = 'CAD'
                                if (this.currLiability[i].debit != null) {
                                    this.totalCurrentLiabilityDebitCAD += parseFloat(this.currLiability[i].debit);
                                }
                                if (this.currLiability[i].credit != null) {
                                    this.totalCurrentLiabilityCreditCAD += parseFloat(this.currLiability[i].credit);
                                }
                            }
                        }
                        for (let i = 0; i < this.currLiability.length; i++) {
                            if (this.currTab === 'USD') {
                                this.currency = 'USD'
                                if (this.currLiability[i].debit != null) {
                                    this.totalCurrentLiabilityDebitUSD += parseFloat(this.currLiability[i].debit);
                                }
                                if (this.currLiability[i].credit != null) {
                                    this.totalCurrentLiabilityCreditUSD += parseFloat(this.currLiability[i].credit);
                                }
                            }
                        }
                        //Calculation Long Term Liabilities
                        for (let i = 0; i < this.ltLiability.length; i++) {
                            if (this.currTab === 'CAD') {
                                this.currency = 'CAD'
                                if (this.ltLiability[i].debit != null) {
                                    this.totalLongTermLiabilityDebitCAD += parseFloat(this.ltLiability[i].debit);
                                }
                                if (this.ltLiability[i].credit != null) {
                                    this.totalLongTermLiabilityCreditCAD += parseFloat(this.ltLiability[i].credit);
                                }
                            }
                        }
                        for (let i = 0; i < this.ltLiability.length; i++) {
                            if (this.currTab === 'USD') {
                                this.currency = 'USD'
                                if (this.ltLiability[i].debit != null) {
                                    this.totalLongTermLiabilityDebitUSD += parseFloat(this.ltLiability[i].debit);
                                }
                                if (this.ltLiability[i].credit != null) {
                                    this.totalLongTermLiabilityCreditUSD += parseFloat(this.ltLiability[i].credit);
                                }
                            }
                        }
                        //Total of All Liabilities CAD USD
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD';
                            this.totalLiabilityDebitCAD = this.totalCurrentLiabilityDebitCAD + this.totalLongTermLiabilityDebitCAD;
                            this.totalLiabilityCreditCAD = this.totalCurrentLiabilityCreditCAD + this.totalLongTermLiabilityCreditCAD;
                        }
                        if (this.currTab === 'USD') {
                            this.currency = 'USD';
                            this.totalLiabilityDebitUSD = this.totalCurrentLiabilityDebitUSD + this.totalLongTermLiabilityDebitUSD;
                            this.totalLiabilityCreditUSD = this.totalCurrentLiabilityCreditUSD + this.totalLongTermLiabilityCreditUSD;
                        }
                        //Calculation Share Capital Equity
                        for (let i = 0; i < this.scEquity.length; i++) {
                            if (this.currTab === 'CAD') {
                                this.currency = 'CAD'
                                if (this.scEquity[i].debit != null) {
                                    this.totalShareCapitalDebitCAD += parseFloat(this.scEquity[i].debit);
                                }
                                if (this.scEquity[i].credit != null) {
                                    this.totalShareCapitalCreditCAD += parseFloat(this.scEquity[i].credit);
                                }
                            }
                        }
                        for (let i = 0; i < this.scEquity.length; i++) {
                            if (this.currTab === 'USD') {
                                this.currency = 'USD'
                                if (this.scEquity[i].debit != null) {
                                    this.totalShareCapitalDebitUSD += parseFloat(this.scEquity[i].debit);
                                }
                                if (this.scEquity[i].credit != null) {
                                    this.totalShareCapitalCreditUSD += parseFloat(this.scEquity[i].credit);
                                }
                            }
                        }
                        //Calculation Retained Earnings Equity
                        for (let i = 0; i < this.retainedEarnings.length; i++) {
                            if (this.currTab === 'CAD') {
                                this.currency = 'CAD'
                                if (this.retainedEarnings[i].debit != null) {
                                    this.totalRetainedEarningsDebitCAD += parseFloat(this.retainedEarnings[i].debit);
                                }
                                if (this.retainedEarnings[i].credit != null) {
                                    this.totalRetainedEarningsCreditCAD += parseFloat(this.retainedEarnings[i].credit);
                                }
                            }
                        }
                        for (let i = 0; i < this.retainedEarnings.length; i++) {
                            if (this.currTab === 'USD') {
                                this.currency = 'USD'
                                if (this.retainedEarnings[i].debit != null) {
                                    this.totalRetainedEarningsDebitUSD += parseFloat(this.retainedEarnings[i].debit);
                                }
                                if (this.retainedEarnings[i].credit != null) {
                                    this.totalRetainedEarningsCreditUSD += parseFloat(this.retainedEarnings[i].credit);
                                }
                            }
                        }
                        //Total of All Equities CAD USD
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD';
                            this.totalEquityDebitCAD = this.totalShareCapitalDebitCAD + this.totalRetainedEarningsDebitCAD;
                            this.totalEquityCreditCAD = this.totalShareCapitalCreditCAD + this.totalRetainedEarningsCreditCAD;
                        }
                        if (this.currTab === 'USD') {
                            this.currency = 'USD';
                            this.totalEquityDebitUSD = this.totalShareCapitalDebitUSD + this.totalRetainedEarningsDebitUSD;
                            this.totalEquityCreditUSD = this.totalShareCapitalCreditUSD + this.totalRetainedEarningsCreditUSD;
                        }
                        //Total of Equities and Liability CAD USD
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD';
                            this.totalLiabilityEquityDebitCAD = this.totalEquityDebitCAD + this.totalLiabilityDebitCAD;
                            this.totalLiabilityEquityCreditCAD = this.totalEquityCreditCAD + this.totalLiabilityCreditCAD;
                        }
                        if (this.currTab === 'USD') {
                            this.currency = 'USD';
                            this.totalLiabilityEquityDebitUSD = this.totalLiabilityDebitUSD + this.totalEquityDebitUSD;
                            this.totalLiabilityEquityCreditUSD = this.totalLiabilityCreditUSD + this.totalEquityCreditUSD;
                        }
                        this.loaded = true;
                    }
                });
        }
    }

    changeTab(type) {
        this.currTab = type;
        this.accounts = [];
        if (this.currTab === 'CAD') {
            this.currency = 'CAD'
            this.lastItemSK = '';
            this.fetchBalence();

        } else if (this.currTab === 'USD') {
            this.currency = 'USD'
            this.lastItemSK = '';
            this.fetchBalence();
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

    //export
    async generateCSV() {
        this.exportLoading = true;
        let dataObject = [];
        let csvArray = [];
        let provArray = [];
        try {
            if (this.sortOtherCurrentAssets.length > 0) {
                for (const element of this.sortOtherCurrentAssets) {
                    let obj = {}
                    obj['Account Number'] = element.accountNo
                    obj['Account Name'] = element.accountName
                    obj['Account Class'] = element.subAcClass
                    obj['Credit'] = element.credit
                    obj['Debit'] = element.debit
                    dataObject.push(obj)
                }
            }
            else {
                this.toaster.success("No Data Found")
                this.exportLoading = false
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
                link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}-invoice.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            this.exportLoading = false
            //}
            // else {
            //    this.toaster.error("No Data Found")
            //   this.exportLoading = false
            // }
        } catch (error) {
            this.exportLoading = false;

        }
    }
}
