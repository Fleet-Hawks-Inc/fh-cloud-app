import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import Constants from 'src/app/pages/fleet/constants';
import { result } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment'
@Component({
    selector: 'app-driver-summary',
    templateUrl: './driver-summary.component.html',
    styleUrls: ['./driver-summary.component.css']
})
export class DriverSummaryComponent implements OnInit {
    dataMessage: string = Constants.FETCHING_DATA;
    drivers: any = [];
    activeDrivers = 0;
    inActiveDrivers = 0;
    totalDriversCount = 0;
    driverID = '';
    firstName = '';
    lastName = '';
    searchValue = '';
    driverStatus = '';
    driverName = '';
    lastItemSK = '';
    disableSearch = false;
    loaded = false;
    constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) { }
    ngOnInit() {
        this.countDrivers();
        this.fetchPagination();
    }
    fetchDrivers() {
        this.inActiveDrivers = 0;
        this.activeDrivers = 0;
        this.apiService.getData(`drivers/fetch/summary/list?name=${this.driverName}&driverStatus=${this.driverStatus}`).subscribe((result: any) => {
            for (let i = 0; i < result.Items.length; i++) {
                const drivers = result.Items[i];
            }
            this.drivers = result.Items;
        })
    }
    async fetchPagination(refresh?: boolean) {
        if (refresh === true) {
            this.lastItemSK = '';
            this.drivers = [];
        }
        if (this.lastItemSK !== 'end') {
            const result = await this.apiService.getData(`drivers/paging/list?lastKey=${this.lastItemSK}`).toPromise();
            this.dataMessage = Constants.FETCHING_DATA;
            if (result.Items.length === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND;
            }
            if (result.Items.length > 0) {
                if (result.LastEvaluatedKey !== undefined) {
                    this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].driverSK);
                }
                else {
                    this.lastItemSK = 'end'
                }
                this.drivers = this.drivers.concat(result.Items);
                this.loaded = true;
            }
        }
    }
    onScroll() {
        if (this.loaded) {
            this.fetchPagination();
        }
        this.loaded = false;
    }
    countDrivers() {
        this.apiService.getData(`drivers`).subscribe((result: any) => {
            this.totalDriversCount = result.Count;
            if (this.totalDriversCount == 0)
                this.dataMessage = Constants.NO_RECORDS_FOUND;
            result.Items.forEach(element => {
                if (element.driverStatus == "active")
                    this.activeDrivers++;
                if (element.driverStatus == "inActive")
                    this.inActiveDrivers++;
            })
        })
    }
    searchDriver() {
        if (this.driverName !== '' || this.driverStatus !== '') {
            this.driverName = this.driverName.toLowerCase();
            this.disableSearch = true;
            this.drivers = [];
            this.dataMessage = Constants.FETCHING_DATA;
            this.countDrivers();
            this.fetchDrivers();
        }
        else {
            return false;
        }
    }
    resetDriver() {
        if (this.driverName !== '' || this.driverStatus !== '' || this.lastItemSK !== '') {
            this.drivers = [];
            this.driverStatus = '';
            this.driverName = '';
            this.lastItemSK = '';
            this.disableSearch = true;
            this.dataMessage = Constants.FETCHING_DATA;
            this.fetchDrivers();
            this.countDrivers();
        }
        else {
            return false;
        }
    }
    generateDriverCSV() {
        if (this.drivers.length > 0) {
            let dataObject = []
            let csvArray = []
            this.drivers.forEach(element => {
                let obj = {}
                obj["Name"] = element.firstName
                obj["Email"] = element.email
                obj["driverType"] = element.driverType
                obj["Date of Birth"] = element.DOB + " " + element.DOB
                obj["Gender"] = element.gender
                obj["CDL#"] = element.CDL_Number
                obj["Phone"] = element.phone
                obj["Status"] = element.driverStatus
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
                link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Driver-Report.csv`);
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
