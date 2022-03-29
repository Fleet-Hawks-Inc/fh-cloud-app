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


    constructor(private accountService: AccountService, private toaster: ToastrService) { }
    ngOnInit() {
        this.filter.endDate = moment().format("YYYY-MM-DD");
        this.filter.startDate = moment().subtract(15, 'day').format('YYYY-MM-DD');
        this.fetchBalance();
    }



    async fetchBalance(refresh?: boolean) {
        this.accountService.getData(`chartAc/get/balance/report/${this.currency}/?start=${this.filter.startDate}&end=${this.filter.endDate}&date=${this.datee}`)
            .subscribe(async (result: any) => {
                if (result.data.length > 0) {
                    result.data.map((v) => {
                        this.accounts.push(v);
                        this.accounts = _.sortBy(this.accounts, ['accountNo'])
                    })
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
                    if (this.scEquity.length === 0) {
                        this.dataMessage = Constants.NO_RECORDS_FOUND;
                    }
                    if (this.sortInventoryAssets.length === 0) {
                        this.dataMessage = Constants.NO_RECORDS_FOUND;
                    }
                    if (this.sortCapitalAsset.length === 0) {
                        this.dataMessage = Constants.NO_RECORDS_FOUND;
                    }
                    if (this.retainedEarnings.length === 0) {
                        this.dataMessage = Constants.NO_RECORDS_FOUND;
                    }
                    if (this.ltLiability.length === 0) {
                        this.dataMessage = Constants.NO_RECORDS_FOUND;
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
                        }
                    }
                    if (this.sortOtherCurrentAssets.length === 0) {
                        this.dataMessage = Constants.NO_RECORDS_FOUND;
                    }
                    //Sorting Current Liabilities.
                    var sortLiability = _.chain(this.accounts).groupBy('accountClass').map((value, key) => ({ accountClass: key, account: value })).value()
                    for (let i = 0; i < sortAssets.length; i++) {
                        if (sortAssets[i].accountClass == 'LIABILITY') {
                            this.currLiability = sortAssets[i].account;
                            this.accounts = _.filter(this.accounts, function (o) {
                                return o.subAcClass != 'long term debt';
                            });
                        }
                    }
                    if (this.currLiability.length === 0) {
                        this.dataMessage = Constants.NO_RECORDS_FOUND;
                    }
                    //Calculation Current Assets 
                    for (let i = 0; i < this.sortOtherCurrentAssets.length; i++) {
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD'
                            if (this.sortOtherCurrentAssets[i].closingBalAmtCAD != null) {
                                this.currentAssetTotalCAD += parseFloat(this.sortOtherCurrentAssets[i].closingBalAmtCAD);
                            }
                        }
                        if (this.currTab === 'USD') {
                            this.currency = 'USD'
                            if (this.sortOtherCurrentAssets[i].closingBalAmtUSD != null) {
                                this.currentAssetTotalUSD += parseFloat(this.sortOtherCurrentAssets[i].closingBalAmtUSD);
                            }
                        }
                    }
                    //Calculation Inventory Assets 
                    for (let i = 0; i < this.sortInventoryAssets.length; i++) {
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD'
                            if (this.sortInventoryAssets[i].closingBalAmtCAD != null) {
                                this.inventoryAssetTotalCAD += parseFloat(this.sortInventoryAssets[i].closingBalAmtCAD);
                            }
                        }
                        if (this.currTab === 'USD') {
                            this.currency = 'USD'
                            if (this.sortInventoryAssets[i].closingBalAmtUSD != null) {
                                this.inventoryAssetTotalUSD += parseFloat(this.sortInventoryAssets[i].closingBalAmtUSD);
                            }
                        }
                    }
                    //Calculation Capital Assets 
                    for (let i = 0; i < this.sortCapitalAsset.length; i++) {
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD'
                            if (this.sortCapitalAsset[i].closingBalAmtCAD != null) {
                                this.capitalAssetTotalCAD += parseFloat(this.sortCapitalAsset[i].closingBalAmtCAD);
                            }
                        }
                        if (this.currTab === 'USD') {
                            this.currency = 'USD'
                            if (this.sortCapitalAsset[i].closingBalAmtUSD != null) {
                                this.capitalAssetTotalUSD += parseFloat(this.sortCapitalAsset[i].closingBalAmtUSD);
                            }
                        }
                    }

                    //Calculation Other Non-Current Assets 
                    for (let i = 0; i < this.sortONCAsset.length; i++) {
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD'
                            if (this.sortONCAsset[i].closingBalAmtCAD != null) {
                                this.ONCAssetTotalCAD += parseFloat(this.sortONCAsset[i].closingBalAmtCAD);
                            }
                        }
                        if (this.currTab === 'USD') {
                            this.currency = 'USD'
                            if (this.sortONCAsset[i].closingBalAmtUSD != null) {
                                this.ONCAssetTotalUSD += parseFloat(this.sortONCAsset[i].closingBalAmtUSD);
                            }
                        }

                    }

                    //Total of All Assets CAD USD
                    if (this.currTab === 'CAD') {
                        this.currency = 'CAD';
                        this.totalAssetsCAD = this.currentAssetTotalCAD + this.inventoryAssetTotalCAD + this.capitalAssetTotalCAD + this.ONCAssetTotalCAD;
                    }
                    if (this.currTab === 'USD') {
                        this.currency = 'USD';
                        this.totalAssetsUSD = this.currentAssetTotalUSD + this.inventoryAssetTotalUSD + this.capitalAssetTotalUSD + this.ONCAssetTotalUSD;
                    }


                    //Calculation current Liabilities
                    for (let i = 0; i < this.currLiability.length; i++) {
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD'
                            if (this.currLiability[i].closingBalAmtCAD != null) {
                                this.totalCurrentLiabilityCAD += parseFloat(this.currLiability[i].closingBalAmtCAD);
                            }
                        }
                        if (this.currTab === 'USD') {
                            this.currency = 'USD'
                            if (this.currLiability[i].closingBalAmtUSD != null) {
                                this.totalCurrentLiabilityUSD += parseFloat(this.currLiability[i].closingBalAmtUSD);
                            }
                        }
                    }

                    //Calculation Long Term Liabilities
                    for (let i = 0; i < this.ltLiability.length; i++) {
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD'
                            if (this.ltLiability[i].closingBalAmtCAD != null) {
                                this.totalLongTermLiabilityCAD += parseFloat(this.ltLiability[i].closingBalAmtCAD);
                            }
                        }
                        if (this.currTab === 'USD') {
                            this.currency = 'USD'
                            if (this.ltLiability[i].closingBalAmtUSD != null) {
                                this.totalLongTermLiabilityUSD += parseFloat(this.ltLiability[i].closingBalAmtUSD);
                            }
                        }
                    }

                    //Total of All Liabilities CAD USD
                    if (this.currTab === 'CAD') {
                        this.currency = 'CAD';
                        this.totalLiabilityCAD = this.totalCurrentLiabilityCAD + this.totalLongTermLiabilityCAD;
                    }
                    if (this.currTab === 'USD') {
                        this.currency = 'USD';
                        this.totalLiabilityUSD = this.totalCurrentLiabilityUSD + this.totalLongTermLiabilityUSD;
                    }
                    //Calculation Share Capital Equity
                    for (let i = 0; i < this.scEquity.length; i++) {
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD'
                            if (this.scEquity[i].closingBalAmtCAD != null) {
                                this.totalShareCapitalCAD += parseFloat(this.scEquity[i].closingBalAmtCAD);
                            }
                        }
                        if (this.currTab === 'USD') {
                            this.currency = 'USD'
                            if (this.scEquity[i].closingBalAmtUSD != null) {
                                this.totalShareCapitalUSD += parseFloat(this.scEquity[i].closingBalAmtUSD);
                            }
                        }
                    }



                    //Calculation Retained Earnings Equity
                    for (let i = 0; i < this.retainedEarnings.length; i++) {
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD'
                            if (this.retainedEarnings[i].closingBalAmtCAD != null) {
                                this.totalRetainedEarningsCAD += parseFloat(this.retainedEarnings[i].closingBalAmtCAD);
                            }
                        }
                        if (this.currTab === 'CAD') {
                            this.currency = 'CAD'
                            if (this.retainedEarnings[i].closingBalAmtUSD != null) {
                                this.totalRetainedEarningsUSD += parseFloat(this.retainedEarnings[i].closingBalAmtUSD);
                            }
                        }
                    }



                    //Total of All Equities CAD USD
                    if (this.currTab === 'CAD') {
                        this.currency = 'CAD';
                        this.totalEquityCAD = this.totalShareCapitalCAD + this.totalRetainedEarningsCAD;
                    }
                    if (this.currTab === 'USD') {
                        this.currency = 'USD';
                        this.totalEquityUSD = this.totalShareCapitalUSD + this.totalRetainedEarningsUSD;
                    }


                    //Total of Equities and Liability CAD USD
                    if (this.currTab === 'CAD') {
                        this.currency = 'CAD';
                        this.totalLiabilityEquityCAD = this.totalEquityCAD + this.totalLiabilityCAD;
                    }
                    if (this.currTab === 'USD') {
                        this.currency = 'USD';
                        this.totalLiabilityEquityUSD = this.totalLiabilityUSD + this.totalEquityUSD;
                    }
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
                    if (this.currTab === 'CAD') {
                        obj['Closing Balance'] = element.closingBalAmtCAD
                    }
                    else {
                        obj['Closing Balance'] = element.closingBalAmtUSD
                    }
                    dataObject.push(obj)
                }
                let totObj = {
                    ['Credit']: 'Total Current Assets',
                    ['Dummyy']: '',
                    ['Dummy']: '',
                }
                if (this.currency === 'CAD') {
                    totObj['Total'] = this.currentAssetTotalCAD
                    dataObject.push(totObj, '\n')
                }
                else if (this.currency === 'USD') {
                    totObj['Total'] = this.currentAssetTotalUSD
                    dataObject.push(totObj, '\n')
                }
            }

            //Inventory Assets
            if (this.sortInventoryAssets.length > 0) {
                for (const element of this.sortInventoryAssets) {
                    let obj2 = {}
                    obj2['Account Number'] = element.accountNo
                    obj2['Account Name'] = element.accountName
                    obj2['Account Class'] = element.subAcClass
                    if (this.currTab === 'CAD') {
                        obj2['Closing Balance'] = element.closingBalAmtCAD
                    }
                    else {
                        obj2['Closing Balance'] = element.closingBalAmtUSD
                    }
                    dataObject.push(obj2)
                }
                let totObj2 = {
                    ['Credit']: 'Total Inventory Assets',
                    ['Debit']: '',
                    ['Dummy']: '',
                }
                if (this.currency === 'CAD') {
                    totObj2['Total'] = this.inventoryAssetTotalCAD
                    dataObject.push(totObj2, '\n')
                }
                else if (this.currency === 'USD') {
                    totObj2['Total'] = this.inventoryAssetTotalUSD
                    dataObject.push(totObj2, '\n')
                }
            }

            // capital assets
            if (this.sortCapitalAsset.length > 0) {
                for (const element of this.sortCapitalAsset) {
                    let obj3 = {}
                    obj3['Account Number'] = element.accountNo
                    obj3['Account Name'] = element.accountName
                    obj3['Account Class'] = element.subAcClass
                    if (this.currTab === 'CAD') {
                        obj3['Closing Balance'] = element.closingBalAmtCAD
                    }
                    else {
                        obj3['Closing Balance'] = element.closingBalAmtUSD
                    }
                    dataObject.push(obj3)
                }
                let totObj3 = {
                    ['Credit']: 'Total Capital Assets',
                    ['Debit']: '',
                    ['Dummy']: '',
                }
                if (this.currency === 'CAD') {
                    totObj3['Total'] = this.capitalAssetTotalCAD
                    dataObject.push(totObj3, '\n')
                }
                else if (this.currency === 'USD') {
                    totObj3['Total'] = this.capitalAssetTotalUSD
                    dataObject.push(totObj3, '\n')
                }
            }

            // Other Non-Current Assets

            if (this.sortONCAsset.length > 0) {
                for (const element of this.sortONCAsset) {
                    let obj4 = {}
                    obj4['Account Number'] = element.accountNo
                    obj4['Account Name'] = element.accountName
                    obj4['Account Class'] = element.subAcClass
                    if (this.currTab === 'CAD') {
                        obj4['Closing Balance'] = element.closingBalAmtCAD
                    }
                    else {
                        obj4['Closing Balance'] = element.closingBalAmtUSD
                    }
                    dataObject.push(obj4)
                }
                let totObj4 = {
                    ['Credit']: 'Total Non-Current Assets',
                    ['Debit']: '',
                    ['Dummy']: '',
                }
                if (this.currency === 'CAD') {
                    totObj4['Total'] = this.ONCAssetTotalCAD
                    dataObject.push(totObj4, '\n')
                }
                else if (this.currency === 'USD') {
                    totObj4['Total'] = this.ONCAssetTotalUSD
                    dataObject.push(totObj4, '\n')
                }
            }

            //Total of all assets 
            let totObj5 = {
                ['Credit']: 'Total  Assets',
                ['Debit']: '',
                ['Dummy']: '',
            }
            if (this.currency === 'CAD') {
                totObj5['Total'] = this.totalAssetsCAD
                dataObject.push(totObj5, '\n')
            }
            else if (this.currency === 'USD') {
                totObj5['Total'] = this.totalAssetsUSD
                dataObject.push(totObj5, '\n')
            }


            // Current Liability
            if (this.currLiability.length > 0) {
                for (const element of this.currLiability) {
                    let obj5 = {}
                    obj5['Account Number'] = element.accountNo
                    obj5['Account Name'] = element.accountName
                    obj5['Account Class'] = element.subAcClass
                    if (this.currTab === 'CAD') {
                        obj5['Closing Balance'] = element.closingBalAmtCAD
                    }
                    else {
                        obj5['Closing Balance'] = element.closingBalAmtUSD
                    }
                    dataObject.push(obj5)
                }
                let totObj5 = {
                    ['Credit']: ' Total Current Liability',
                    ['Debit']: '',
                    ['Dummy']: '',
                }
                if (this.currency === 'CAD') {
                    totObj5['Total'] = this.totalCurrentLiabilityCAD
                    dataObject.push(totObj5, '\n')
                }
                else if (this.currency === 'USD') {
                    totObj5['Total'] = this.totalCurrentLiabilityUSD
                    dataObject.push(totObj5, '\n')
                }
            }

            // Long Term Liability
            if (this.ltLiability.length > 0) {
                for (const element of this.ltLiability) {
                    let obj6 = {}
                    obj6['Account Number'] = element.accountNo
                    obj6['Account Name'] = element.accountName
                    obj6['Account Class'] = element.subAcClass
                    if (this.currTab === 'CAD') {
                        obj6['Closing Balance'] = element.closingBalAmtCAD
                    }
                    else {
                        obj6['Closing Balance'] = element.closingBalAmtUSD
                    }
                    dataObject.push(obj6)
                }
                let totObj6 = {
                    ['Credit']: 'Total Long Term Liability',
                    ['Debit']: '',
                    ['Dummy']: '',
                }
                if (this.currency === 'CAD') {
                    totObj6['Total'] = this.totalLongTermLiabilityCAD
                    dataObject.push(totObj6, '\n')
                }
                else if (this.currency === 'USD') {
                    totObj6['Total'] = this.totalLongTermLiabilityUSD
                    dataObject.push(totObj6, '\n')
                }
            }

            //Total of all liability
            let totObjLiabilityTOT = {
                ['Credit']: 'Total  Liability',
                ['Debit']: '',
                ['Dummy']: '',
            }
            if (this.currency === 'CAD') {
                totObjLiabilityTOT['Total'] = this.totalLiabilityCAD
                dataObject.push(totObjLiabilityTOT, '\n')
            }
            else if (this.currency === 'USD') {
                totObjLiabilityTOT['Total'] = this.totalLiabilityUSD
                dataObject.push(totObjLiabilityTOT, '\n')
            }


            // Share Capital
            if (this.scEquity.length > 0) {
                for (const element of this.scEquity) {
                    let obj7 = {}
                    obj7['Account Number'] = element.accountNo
                    obj7['Account Name'] = element.accountName
                    obj7['Account Class'] = element.subAcClass
                    if (this.currTab === 'CAD') {
                        obj7['Closing Balance'] = element.closingBalAmtCAD
                    }
                    else {
                        obj7['Closing Balance'] = element.closingBalAmtUSD
                    }
                    dataObject.push(obj7)
                }
                let totObj7 = {
                    ['Credit']: 'Total Share Capital',
                    ['Debit']: '',
                    ['Dummy']: '',
                }
                if (this.currency === 'CAD') {
                    totObj7['Total'] = this.totalShareCapitalCAD
                    dataObject.push(totObj7, '\n')
                }
                else if (this.currency === 'USD') {
                    totObj7['Total'] = this.totalShareCapitalUSD
                    dataObject.push(totObj7, '\n')
                }
            }



            // Retained Earnings
            if (this.retainedEarnings.length > 0) {
                for (const element of this.retainedEarnings) {
                    let obj8 = {}
                    obj8['Account Number'] = element.accountNo
                    obj8['Account Name'] = element.accountName
                    obj8['Account Class'] = element.subAcClass
                    if (this.currTab === 'CAD') {
                        obj8['Closing Balance'] = element.closingBalAmtCAD
                    }
                    else {
                        obj8['Closing Balance'] = element.closingBalAmtUSD
                    }
                    dataObject.push(obj8)
                }
                let totObj8 = {
                    ['Credit']: 'Total Retained Earnings',
                    ['Debit']: '',
                    ['Dummy']: '',
                }
                if (this.currency === 'CAD') {
                    totObj8['Total'] = this.totalRetainedEarningsCAD
                    dataObject.push(totObj8, '\n')
                }
                else if (this.currency === 'USD') {
                    totObj8['Total'] = this.totalRetainedEarningsUSD
                    dataObject.push(totObj8, '\n')
                }
            }

            //Total Equities
            let totObjEquityTOT = {
                ['Credit']: 'Total  Equity',
                ['Debit']: '',
                ['Dummy']: '',
            }
            if (this.currency === 'CAD') {
                totObjEquityTOT['Total'] = this.totalEquityCAD
                dataObject.push(totObjEquityTOT, '\n')
            }
            else if (this.currency === 'USD') {
                totObjEquityTOT['Total'] = this.totalEquityUSD
                dataObject.push(totObjEquityTOT, '\n')
            }
            //Total Liability & Equity
            let totObjLiabilityEquityTOT = {
                ['Credit']: 'Total Liability & Equity',
                ['Debit']: '',
                ['Dummy']: '',
            }
            if (this.currency === 'CAD') {
                totObjLiabilityEquityTOT['Total'] = this.totalLiabilityEquityCAD
                dataObject.push(totObjLiabilityEquityTOT, '\n')
            }
            else if (this.currency === 'USD') {
                totObjLiabilityEquityTOT['Total'] = this.totalLiabilityEquityUSD
                dataObject.push(totObjLiabilityEquityTOT, '\n')
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
                link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}-balenceSheet.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            this.exportLoading = false
        } catch (error) {
            this.exportLoading = false;
        }
    }
}
