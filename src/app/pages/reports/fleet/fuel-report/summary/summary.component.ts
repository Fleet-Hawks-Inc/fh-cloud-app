import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { timeStamp } from 'console';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Constants from 'src/app/pages/fleet/constants';
import { result } from 'lodash';
import * as _ from 'lodash';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
    dataMessage: string = Constants.FETCHING_DATA;
    vehiclesList = [];
    vehicleList: any = {};
    vehicles = [];
    fuelList: any = [];
    unitID = null;
    assetUnitID = null;
    allAssets: any = [];
    vehicleID = '';
    vehicleIdentification = '';
    allVehicles = [];
    assetList: any = {};
    lastItemSK = '';
    loaded = false;
    currency = '';
    fuelCount = {
        cad_amount: 0,
        usd_amount: 0,
        l_quantity: 0,
        g_quantity: 0,
        }
    vehicleSet = []
    assetsSet = []
    exportList: any = [];


    startDate: '';
    endDate: '';
    start = null;
    end = null;
    dateMinLimit = { year: 1950, month: 1, day: 1 };
    date = new Date();
    futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
    fuelCountData = [];   
    fuelCostG = 0
    fuelCostL = 0
    fuelAmtCAD = 0
    fuelAmtUSD = 0
        
        
        
        
        
        
    constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.fetchFuelReport();
        this.fetchVehicleList();
        this.fetchAllVehicles();
        this.fetchAssetList();
        this.fetchAllAssets();
        this.fetchFuelCount();
    }

    fetchAssetList() {
        this.apiService.getData('assets/get/list').subscribe((result: any) => {
            this.assetList = result;
        });
    }

    fetchVehicleList() {
        this.apiService.getData(`vehicles/get/list`).subscribe((result: any) => {
            this.vehicleList = result;
        });
    }

    fetchAllAssets() {
        this.apiService.getData('assets/get/minor/details')
            .subscribe((result: any) => {
                this.assetsSet = result.Items;
            })
    }

    fetchAllVehicles() {
        this.apiService.getData('vehicles/list/minor').subscribe((result: any) => {
            result['Items'].map((v: any) => {
                if (v.isDeleted === 0) {
                    this.vehicleSet.push(v);
                }
            })
        });
    }

    fetchFuelCount() {
        this.apiService.getData('fuelEntries/fetch/fuel/count').subscribe((result: any) => {
            this.fuelCount = result;
        })
    }

    async fetchFuelReport(refresh?: boolean) {
        if (refresh === true) {
            this.lastItemSK = '';
            this.fuelList = []
        }
        if (this.lastItemSK !== 'end') {
            const result = await this.apiService.getData(`fuelEntries/fetch/fuel/report?unitID=${this.unitID}&asset=${this.assetUnitID}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}`).toPromise();
            if (result.Items.length == 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND
            }
            if (result.Items.length > 0) {
                if (result.LastEvaluatedKey !== undefined) {
                    this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].fuelSK);
                }
                else {
                    this.lastItemSK = 'end';
                }
                   result[`Items`].forEach(element => {
        let date: any = moment(element.data.date)
        if (element.data.time) {
          let time = moment(element.data.time, 'h mm a')
          date.set({
            hour: time.get('hour'),
            minute: time.get('minute')
          })
          date = date.format('MMM Do YYYY, h:mm a')
        }
        else {
          date = date.format('MMM Do YYYY')
        }
        element.dateTime = date
      });
             this.fuelList = this.fuelList.concat(result.Items);
             for(let i=0;i<this.fuelList.length;i++){
             this.fuelCountData.push(this.fuelList[i].data);
             }
             for(let j=0;j<this.fuelCountData.length;j++){
             if(this.fuelCountData[j].uom === 'G'){
             if(this.fuelCountData[j].qty > 0){
             this.fuelCostG = this.fuelCostG + Number(this.fuelCountData[j].qty)
             }
             }
             if(this.fuelCountData[j].uom === 'L'){
             if(this.fuelCountData[j].qty > 0){
             this.fuelCostL = this.fuelCostL + Number(this.fuelCountData[j].qty)
             }
             }
             console.log('CALG',this.fuelCostG);
             console.log('CALL',this.fuelCostL);
             if(this.fuelCountData[j].currency === 'CAD'){
             if(this.fuelCountData[j].amt > 0){
             this.fuelAmtCAD = this.fuelAmtCAD + Number(this.fuelCountData[j].amt)
             }
             }
             if(this.fuelCountData[j].currency === 'USD'){
             if(this.fuelCountData[j].amt > 0){
             this.fuelAmtUSD = this.fuelAmtUSD + Number(this.fuelCountData[j].amt)
             }
             }
             }
             this.loaded = true;
             console.log('Data',this.fuelCountData);
            }
        }
    }

    onScroll() {
        if (this.loaded) {
             this.fuelCountData = [];
             this.fuelCostG = 0;
             this.fuelCostL = 0;
             this.fuelAmtCAD = 0;
             this.fuelAmtUSD = 0;
             this.fetchFuelReport();
        }
        this.loaded = false;
    }
    searchFilter() {
        if (this.unitID !== null || this.assetUnitID !== null || this.start !== null || this.end !== null) {

            if (this.start != null && this.end == null) {
                this.toastr.error('Please select both start and end dates.');
                return false;
            }
            else if (this.start == null && this.end != null) {
                this.toastr.error('Please select both start and end dates.');
                return false;
            }
            else if (this.start > this.end) {
                this.toastr.error('Start Date should be less then end date.');
                return false;
            }
            else {
                this.dataMessage = Constants.FETCHING_DATA;
                this.fuelList = [];
                this.fuelCostG = 0
                this.fuelCostL = 0
                this.fuelAmtCAD = 0
                this.fuelAmtUSD = 0
                this.lastItemSK = '';
                this.fuelCountData = [];
                this.fetchFuelReport();
            }
        } else {
            return false;
        }
    }

  




    resetFilter() {
        if (this.unitID !== null || this.assetUnitID !== null || this.start !== null || this.end !== null) {
            this.unitID = null;
            this.assetUnitID = null;
            this.start = null;
            this.end = null;
            this.fuelList = [];
            this.fuelCountData = [];
            this.fuelCostG = 0
            this.fuelCostL = 0
            this.fuelAmtCAD = 0
            this.fuelAmtUSD = 0
            this.lastItemSK = '';
            this.dataMessage = Constants.FETCHING_DATA;
            this.fetchFuelReport();
        } else {
            return false;
        }
    }
 
    generateFuelCSV() {
        if (this.exportList.length > 0) {
            let dataObject = []
            let csvArray = []
            this.exportList.forEach(element => {
                let obj = {} 
                let retailCADTotal = [];
                let retailUSDTotal = [];
                if(element.data.currency === 'CAD'){
                retailCADTotal = element.data.amt
                }
                if(element.data.currency === 'USD'){
                retailUSDTotal = element.data.amt
                }
                obj['Date/Time'] = element.dateTime.replace(/, /g, ' &');                                                                          
                obj['Use Type'] = element.data.useType
                obj['Unit Name'] = this.assetList[element.unitID] || this.vehicleList[element.unitID]
                obj['Fuel Card#'] = element.data.cardNo
                obj['City'] = element.data.city
                obj['Fuel Type'] = element.data.type
                obj['Fuel Quantity'] = element.data.qty + " " 
                obj['Liters or Gallons'] = element.data.uom ==="L" ? 'LTR' : 'GL'
                obj['Odometer'] = element.data.odometer
                obj['Retail Price Per L'] = element.data.rPpu + ' ' + element.data.currency
                obj['Retail Amount Before Tax'] = element.data.rBeforeTax + ' ' + element.data.currency
                obj['Total Discount'] = element.data.discAmt
                obj['Retail Amount CAD'] = retailCADTotal
                obj['Retail Amount USD'] = retailUSDTotal
                dataObject.push(obj)
            });
            let headers = Object.keys(dataObject[0]).join(',')
            headers += '\n'
            csvArray.push(headers)
            dataObject.forEach(element => {
                let obj = Object.values(element).join(',')
                obj += '\n'
                csvArray.push(obj)
            });
            const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Fuel-Report.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        else {
            this.toastr.error("No Records found")
        }
    }

    getSetExport() {
        this.apiService.getData("fuelEntries/get/export").subscribe((result: any) => {
        result[`Items`].forEach(element => {
        let date: any = moment(element.data.date)
        if (element.data.time) {
          let time = moment(element.data.time, 'h mm a')
          date.set({
            hour: time.get('hour'),
            minute: time.get('minute')
          })
          date = date.format('MMM Do YYYY h:mm a')
        }
        else {
          date = date.format('MMM Do YYYY')
        }
        element.dateTime = date
      });    
            this.exportList = result.Items;
            this.generateFuelCSV();
        })
    }

    csvExport() {
        if (this.unitID !== null || this.assetUnitID !== null) {
            this.exportList = this.fuelList
            this.generateFuelCSV();
        } else {
            this.getSetExport();
        }
    }
}