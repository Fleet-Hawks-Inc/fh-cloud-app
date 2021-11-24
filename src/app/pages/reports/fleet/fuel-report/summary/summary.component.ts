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
    currency = 0;
    fuelCount = {
        cad_amount: 0,
        usd_amount: 0,
        l_quantity: 0,
        g_quantity: 0,
        fuel_Odometer: '',
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
                this.lastItemSK = '';
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

    getSetExport() {
        this.apiService.getData("fuelEntries/get/export?type=unitID").subscribe((result: any) => {
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