import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import Constants from 'src/app/pages/fleet/constants';
import { result } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
    dataMessage: string = Constants.FETCHING_DATA;
    vehicles: any = [];
    vehicleIdentification = '';
    vehicleManufacturersList: any = {};
    vehicleModelList: any = {};
    modelID: any = {};
    manufacturerID: any = {};
    createdTime: any = {};
    vehicleType: any = {};
    inActiveVehiclesCount = 0;
    activeVehiclesCount = 0;
    currentStatus = '';
    totalVehicleCount = 0;
    lastItemSK = '';
    loaded = false;

    constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }
    ngOnInit() {
        this.getVehiclePage();
        this.totalVehicle();
    }
    fetchVehiclesReport() {
        this.activeVehiclesCount = 0;
        this.inActiveVehiclesCount = 0;
        this.apiService.getData(`vehicles/fetch/summary/list?name=${this.vehicleIdentification}&currentStatus=${this.currentStatus}`).subscribe((result: any) => {
            for (let i = 0; i < result.Items.length; i++) {
                const vehicles = result.Items[i];
            }

            this.vehicles = result.Items;
        })
    }
    async getVehiclePage(refresh?: boolean) {
        if (refresh === true) {
            this.lastItemSK = '',
                this.vehicles = []
        }
        if (this.lastItemSK !== 'end') {
            const result = await this.apiService.getData(`vehicles/report/summary?lastKey=${this.lastItemSK}`).toPromise();
            this.dataMessage = Constants.FETCHING_DATA;
            if (result.Items.length === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND;
            }
            if (result.Items.length > 0) {

                if (result.LastEvaluatedKey !== undefined) {
                    this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].vehicleSK);
                }
                else {
                    this.lastItemSK = 'end'
                }
                this.vehicles = this.vehicles.concat(result.Items);
                this.loaded = true;
            }
        }
    }
    onScroll() {
        if (this.loaded) {
            this.getVehiclePage();
        }
        this.loaded = false;
    }
    totalVehicle() {
        this.apiService.getData(`vehicles`).subscribe((result: any) => {
            if (this.totalVehicleCount == 0)
                this.dataMessage = Constants.NO_RECORDS_FOUND;
            result.Items.forEach(element => {
                if (element.currentStatus == "active")
                    this.activeVehiclesCount++;
                if (element.currentStatus == "inActive")
                    this.inActiveVehiclesCount++;
                this.totalVehicleCount = result.Count;
            })
        })
    }
    searchVehicle() {
        if (this.vehicleIdentification !== '' || this.currentStatus !== '') {
            this.vehicleIdentification = this.vehicleIdentification.toLowerCase();
            this.currentStatus = this.currentStatus;
            this.vehicles = [];
            this.dataMessage = Constants.FETCHING_DATA;
            this.fetchVehiclesReport();
            this.totalVehicle();
        } else {
            return false;
        }
    }
    resetVehicle() {
        if (this.vehicleIdentification !== '' || this.currentStatus !== '' || this.lastItemSK) {
            this.vehicleIdentification = '';
            this.currentStatus = '';
            this.vehicles = [];
            this.dataMessage = Constants.FETCHING_DATA;
            this.fetchVehiclesReport();
            this.totalVehicle();
            this.getVehiclePage();
        }
        else {
            return false;
        }
    }
    generateVehicleCSV() {
        if (this.vehicles.length > 0) {
            let dataObject = []
            let csvArray = []
            this.vehicles.forEach(element => {
                let obj = {}
                obj["Vehicle Name"] = element.vehicleIdentification
                obj["VIN"] = element.vehicleID
                obj["Year"] = element.year
                obj["Make"] = element.manufacturerID
                obj["Model"] = element.modelID
                obj["Plate#"] = element.plateNumber
                obj["Status"] = element.currentStatus
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
                link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Vehicle-Report.csv`);
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