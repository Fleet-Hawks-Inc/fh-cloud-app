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
    fuelList = [];
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
        des_quantityLTR: 0,
        des_quantityGL: 0,
        def_quantityLTR: 0,
        def_quantityGL: 0,
        gas_quantityLTR: 0,
        gas_quantityGL: 0,
        prop_quantityLTR: 0,
        prop_quantityGL: 0,
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

    fuelResult: any = [];
    fuelConsumeLTR = 0;
    fuelConsumeGL = 0;
    fuelCostCAD = 0;
    fuelCostUSD = 0;
    fuelCAD = [];
    fuelUSD = [];
    fuelData = [];
    searchActive = false;
    finalFuelRunningCAD = 0;
    finalFuelRunningUSD = 0;
    
    
    
    emptyVariable = [];
    fuelQtyLitres:any = [];
    fuelQtyGallons:any = [];
    fuelQty = [];
    emptyObject = [];
    
    
//Seprate For Disel,Propane,Gasoline,DEF    
fuelConsumeDis_LTR = 0;
fuelConsumeDis_GL = 0;

fuelConsumeProp_LTR = 0;
fuelConsumeProp_GL = 0;

fuelConsumeGas_LTR = 0;
fuelConsumeGas_GL = 0;

fuelConsumeDEF_LTR = 0;
fuelConsumeDEF_GL = 0;

//Final Fuel Running Total
disel_ConsumedLTR = 0;
disel_ConsumedGL = 0;

propane_ConsumedLTR = 0;
propane_ConsumedGL = 0;

gas_ConsumedLTR = 0;
gas_ConsumedGL = 0;

def_ConsumedLTR = 0;
def_ConsumedGL = 0;


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
            this.finalFuelRunningCAD = this.fuelCount.cad_amount;
            this.finalFuelRunningUSD = this.fuelCount.usd_amount;
            
            this.disel_ConsumedLTR = this.fuelCount.des_quantityLTR;
            this.disel_ConsumedGL = this.fuelCount.des_quantityGL;
            
            this.propane_ConsumedLTR = this.fuelCount.prop_quantityLTR;
            this.propane_ConsumedGL = this.fuelCount.prop_quantityGL;
            
            this.gas_ConsumedLTR = this.fuelCount.gas_quantityLTR;
            this.gas_ConsumedGL = this.fuelCount.gas_quantityGL;
            
            this.def_ConsumedLTR = this.fuelCount.def_quantityLTR;
            this.def_ConsumedGL = this.fuelCount.def_quantityGL;
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
                let date: any = moment(element.date)
                    if (element.time) {
                        let time = moment(element.time, 'h mm a')
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
                this.loaded = true;
                if (this.searchActive === true) {
                    this.calCulateAmt();
                    this.finalFuelRunningCAD = this.fuelCostCAD;
                    this.finalFuelRunningUSD = this.fuelCostUSD;
                }
                if (this.searchActive === true) {
                    this.calculateQTY();
                    
                    this.disel_ConsumedLTR = this.fuelConsumeDis_LTR;
                    this.disel_ConsumedGL = this.fuelConsumeDis_GL;
                    
                    this.propane_ConsumedLTR = this.fuelConsumeProp_LTR;
                    this.propane_ConsumedGL = this.fuelConsumeProp_GL;
                    
                    this.gas_ConsumedLTR = this.fuelConsumeGas_LTR;
                    this.gas_ConsumedGL = this.fuelConsumeGas_GL;
                    
                    this.def_ConsumedLTR = this.fuelConsumeDEF_LTR;
                    this.def_ConsumedGL = this.fuelConsumeDEF_GL;
                }
            }
        }
    }

    calCulateAmt() {
        this.fuelCAD = [];
        this.fuelUSD = [];
        this.fuelData = [];
        for (let i = 0; i < this.fuelList.length; i++) {
            this.fuelData.push(this.fuelList[i].data)
        }
        this.fuelData.map((e: any) => {
            if (e.currency === 'CAD') {
                this.fuelCAD.push(e);
            } else {
                this.fuelUSD.push(e);
            }
        })
        if (this.fuelCAD.length > 0 || this.fuelUSD.length > 0) {
            for (const element of this.fuelCAD) {
                this.fuelCostCAD = this.fuelCostCAD + Number(element.amt);
            }
            for (const element of this.fuelUSD) {
                this.fuelCostUSD = this.fuelCostUSD + Number(element.amt);
            }
        }
    }



    calculateQTY() {
        this.fuelQtyLitres = [];
        this.fuelQtyGallons = [];
        this.fuelQty = []
        for (let i = 0; i < this.fuelList.length; i++) {
            this.fuelQty.push(this.fuelList[i].data)
        }
        this.fuelQty.map((x: any) => {
            if (x.uom === 'L' || x.uom === 'litre') {
                this.fuelQtyLitres.push(x);
            } else {
                this.fuelQtyGallons.push(x);
            }
        })
        if(this.fuelQtyLitres.length > 0 || this.fuelQtyGallons.length > 0){
        
        for(const element of this.fuelQtyLitres){
        if(element.type === 'Diesel'){
        this.fuelConsumeDis_LTR = this.fuelConsumeDis_LTR + Number(element.qty);
        }
        if(element.type === 'DEF'){
        this.fuelConsumeDEF_LTR = this.fuelConsumeDEF_LTR + Number(element.qty);
        console.log(this.fuelConsumeDEF_LTR)
        }
        if(element.type === 'Gasoline'){
        this.fuelConsumeGas_LTR = this.fuelConsumeGas_LTR + Number(element.qty);
        }
        if(element.type === 'Propane'){
        this.fuelConsumeProp_LTR = this.fuelConsumeProp_LTR + Number(element.qty);
        }
        }
        
        
        for(const element of this.fuelQtyGallons){
        if(element.type === 'Diesel'){
        this.fuelConsumeDis_GL = this.fuelConsumeDis_GL + Number(element.qty);
        }
        
        if(element.type === 'DEF'){
        this.fuelConsumeDEF_GL = this.fuelConsumeDEF_GL + Number(element.qty);
        }
        
        if(element.type === 'Gasoline'){
        this.fuelConsumeGas_GL = this.fuelConsumeGas_GL + Number(element.qty);
        }
        
        if(element.type === 'Propane'){
        this.fuelConsumeProp_GL = this.fuelConsumeProp_GL + Number(element.qty);
        }
        }
        }
    }



/*
    calculateQTY() {
        this.fuelQtyLitres = [];
        this.fuelQtyGallons = [];
        this.fuelQty = []
        for (let i = 0; i < this.fuelList.length; i++) {
            this.fuelQty.push(this.fuelList[i].data)
        }
        this.fuelQty.map((x: any) => {
            if (x.uom === 'L' || x.uom === 'litre') {
                this.fuelQtyLitres.push(x);
            } else {
                this.fuelQtyGallons.push(x);
            }
        })
        if (this.fuelQtyLitres.length > 0 || this.fuelQtyGallons.length > 0) {
            for (const element of this.fuelQtyLitres) {
                this.fuelConsumeLTR = this.fuelConsumeLTR + Number(element.qty);
            }
            for (const element of this.fuelQtyGallons) {
                this.fuelConsumeGL = this.fuelConsumeGL + Number(element.qty);
            }
            for (const element of this.fuelQtyLitres) {
            if(element.type === 'Disel'){
            this.fuelConsumeDis_LTR = this.fuelConsumeDis_LTR + Number(element.qty);
            console.log('Disel LTR',this.fuelConsumeDis_LTR)
            }
            }
            for (const element of this.fuelQtyGallons) {
            if(element.type === 'Disel'){
            this.fuelConsumeDis_GL = this.fuelConsumeDis_GL + Number(element.qty);
            console.log('Disel GL',this.fuelConsumeDis_GL)
            }
            }
        }
    }
*/

    onScroll() {
        if (this.loaded === true) {
            this.fetchFuelReport();
            this.fuelCAD = [];
            this.fuelUSD = [];
            this.fuelQtyLitres = [];
            this.fuelQtyGallons = [];
            this.searchActive = false;
        }
        this.loaded = false;
    }
    searchFilter() {
        this.finalFuelRunningCAD = 0;
        this.finalFuelRunningUSD = 0;
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
                this.lastItemSK = '';
                this.searchActive = true;
                this.finalFuelRunningCAD = 0;
                this.finalFuelRunningUSD = 0;
                //this.finalFuelConsumedLTR = 0;
                //this.finalFuelConsumedGL = 0;
                
                this.disel_ConsumedLTR = 0;
                this.disel_ConsumedGL = 0;
                
                this.gas_ConsumedLTR = 0;
                this.gas_ConsumedGL = 0;
                
                this.propane_ConsumedLTR = 0;
                this.propane_ConsumedGL = 0;
                
                this.def_ConsumedLTR = 0;
                this.def_ConsumedGL = 0;
                
                this.fuelConsumeLTR = 0;
                this.fuelConsumeGL = 0;
                this.fuelCostCAD = 0;
                this.fuelCostUSD = 0;
                //this.finalFuelRunningCAD = this.fuelCount.cad_amount;
                //this.finalFuelRunningUSD = this.fuelCount.usd_amount;

                this.fuelCAD = [];
                this.fuelUSD = [];
                this.fuelQtyLitres = [];
                this.fuelQtyGallons = [];
                this.fuelList = [];
                this.fetchFuelReport();
            }
        }
        else {
            return false;
        }
    }

    resetFilter() {
        if (this.unitID !== null || this.assetUnitID !== null || this.start !== null || this.end !== null) {
            this.unitID = null;
            this.assetUnitID = null;
            this.start = null;
            this.end = null;
            this.searchActive = false;
            this.fuelCAD = [];
            this.fuelCostCAD = 0;
            this.fuelCostUSD = 0
            this.fuelUSD = [];
            this.fuelList = [];
            this.fetchFuelCount();
            this.fuelQtyLitres = [];
            this.fuelQtyGallons = [];
            this.finalFuelRunningCAD = 0;
            this.finalFuelRunningUSD = 0;
            //this.finalFuelConsumedLTR = 0;
            //this.finalFuelConsumedGL = 0;
            
            this.disel_ConsumedLTR = 0;
            this.disel_ConsumedGL = 0;
            
                this.gas_ConsumedLTR = 0;
                this.gas_ConsumedGL = 0;
                
                this.propane_ConsumedLTR = 0;
                this.propane_ConsumedGL = 0;
                
                this.def_ConsumedLTR = 0;
                this.def_ConsumedGL = 0;
            
            
            this.finalFuelRunningCAD = this.fuelCount.cad_amount;
            this.finalFuelRunningUSD = this.fuelCount.usd_amount;
            this.disel_ConsumedLTR = this.fuelCount.l_quantity;
            this.disel_ConsumedGL = this.fuelCount.g_quantity;
            this.lastItemSK = '';
            this.dataMessage = Constants.FETCHING_DATA;
            this.fetchFuelReport();
        } else {
            return false;
        }
    }

    generateFuelCSV() {
        if (this.exportList.length > 0) {
            let dataObject: any = []
            let csvArray = []
            
            this.exportList.forEach(element => {
                let obj = {}
                let retailCADTotal = [];
                let retailUSDTotal = [];
                if (element.data.currency === 'CAD') {
                    retailCADTotal = element.data.amt
                }
                if (element.data.currency === 'USD') {
                    retailUSDTotal = element.data.amt
                }
                obj['Date/Time'] = element.dateTime.replace(/, /g, ' &');
                obj['Use Type'] = element.data.useType
                obj['Unit Name'] = this.assetList[element.unitID] || this.vehicleList[element.unitID]
                obj['Fuel Card#'] = element.data.cardNo
                obj['City'] = element.data.city
                obj['Fuel Type'] = element.data.type.replace(/, /g, ' &');
                obj['Fuel Quantity'] = element.data.qty + ' '
                if (element.data.uom === 'L') {
                    obj['Liters or Gallons'] = element.data.uom === 'L' ? 'LTR' : null
                }
                if (element.data.uom === 'litre') {
                    obj['Liters or Gallons'] = element.data.uom === 'litre' ? 'LTR' : null
                }
                if (element.data.uom === 'G') {
                    obj['Liters or Gallons'] = element.data.uom === 'G' ? 'GL' : null
                }
                obj['Odometer'] = element.data.odometer
                obj['Retail Price Per L'] = element.data.rPpu
                obj['Retail Amount Before Tax'] = element.data.rBeforeTax
                obj['Total Discount'] = element.data.discAmt
                obj['Retail Amount'] = element.data.amt
                obj['Currency'] = element.data.currency
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
        if (this.unitID !== null || this.assetUnitID !== null || this.start !== null || this.end !== null) {
            this.searchActive = false
            this.exportList = this.fuelList
            this.generateFuelCSV();
        } else {
            this.getSetExport();
        }
    }
}