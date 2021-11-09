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
    [x: string]: any;
    vehiclesList = [];
    vehicleList: any = {};
    vehicles = [];
    fuelList = [];
    date = new Date();
    unitID = null;
    assetUnitID = null;
    allAssets: any = [];
    vehicleID = '';
    vehicleIdentification = '';
    allVehicles = [];
    assetList: any = {};
    end: any = '';
    lastItemSK = '';
    start: any = '';
    loaded = false;
    futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
    currency = 0;
    cad_amount = 0;
    usd_amount = 0;
    l_quantity = 0;
    g_quantity = 0;
    fuel_Odometer = '';

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
        this.apiService.getData('assets').subscribe((result: any) => {
            result.Items.forEach((e: any) => {
                if (e.assetType == 'reefer') {
                    let obj = {
                        assetID: e.assetID,
                        assetIdentification: e.assetIdentification
                    };
                    this.allAssets.push(obj);
                }
            });
        });
    }
    fetchAllVehicles() {
        this.apiService.getData('vehicles').subscribe((result: any) => {
            this.allVehicles = result.Items;
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
            const result = await this.apiService.getData(`fuelEntries/fetch/fuel/report?unitID=${this.unitID}&asset=${this.assetUnitID}&lastKey=${this.lastItemSK}`).toPromise();
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
                this.fuelList = this.fuelList.concat(result.Items);
                this.loaded = true;
            }
        }
    }

    onScroll() {
        if (this.loaded) {
            this.fetchFuelReport();
        }
        this.loaded = false;
    }
    searchFilter() {
        if (this.unitID !== null || this.assetUnitID !== null) {
            this.lastItemSK = '';
            this.fuelList = [];
            this.dataMessage = Constants.FETCHING_DATA;
            this.fetchFuelReport();
        } else {
            return false;
        }
    }
    resetFilter() {
        if (this.unitID !== null || this.assetUnitID !== null) {
            this.unitID = null;
            this.assetUnitID = null;
            this.fuelList = [];
            this.lastItemSK = '';
            this.dataMessage = Constants.FETCHING_DATA;
            this.fetchFuelReport();
        } else {
            return false;
        }
    }
    generateFuelCSV() {
        if (this.fuelList.length > 0) {
            let dataObject = []
            let csvArray = []
            this.fuelList.forEach(element => {
                let obj = {}
                obj["Date"] = element.data.date
                obj["Unit Name"] = this.assetList[element.unitID] || this.vehicleList[element.unitID]
                obj["Fuel Card#"] = element.data.cardNo
                obj["City"] = element.data.city
                obj["Fuel Quantity"] = element.data.qty
                obj["Use Type"] = element.data.useType
                obj["Odometer"] = element.data.odometer
                obj["Fuel Type"] = element.data.type
                obj["Total Discount"] = element.data.discAmt
                obj["Liters or Gallons"] = element.data.uom
                obj["Total Amount"] = element.data.amt
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
}