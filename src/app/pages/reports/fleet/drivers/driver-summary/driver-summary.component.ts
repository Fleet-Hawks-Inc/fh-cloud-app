import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import Constants from 'src/app/pages/fleet/constants';
import { result } from 'lodash';
import { timeStamp } from 'console';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from 'src/app/services/here-map.service';

import * as moment from 'moment'
import * as _ from 'lodash';
@Component({
    selector: 'app-driver-summary',
    templateUrl: './driver-summary.component.html',
    styleUrls: ['./driver-summary.component.css']
})
export class DriverSummaryComponent implements OnInit {
    dataMessage: string = Constants.FETCHING_DATA;
    drivers: any = [];
    driverID = '';
   firstName = '';
   lastName = '';
   middleName = '';
    driversCount = {
        total: '',
        active: '',
        inactive: '',
    };
    driverStatus = null;
    driverName = '';
    fullExportDriver:any = [];
    lastItemSK = '';
    suggestedDrivers = [];
    disableSearch = false;
    loaded = false;
    constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) { }
    ngOnInit() {
        this.fetchDriversCount();
        this.fetchPagination();
    }
    async fetchPagination(refresh?: boolean) {
        if (refresh === true) {
            this.lastItemSK = '';
            this.drivers = [];
        }
        if (this.lastItemSK !== 'end') {
            const result = await this.apiService.getData(`drivers/paging/list?name=${this.driverName}&driverStatus=${this.driverStatus}&lastKey=${this.lastItemSK}`).toPromise();
            if (result.Items.length === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND
            }
            this.suggestedDrivers = [];
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
    fetchDriversCount() {
        this.apiService.getData(`drivers/fetch/driverCount`).subscribe((result: any) => {
            this.driversCount = result;
        })
    }
  getSuggestions = _.debounce(function (value) {
    this.driverID = "";
    value = value.toLowerCase();
    if (value != "") {
      this.apiService
        .getData(`drivers/get/suggestions/${value}`)
        .subscribe((result) => {
          result.map((v) => {
            if (v.lastName == undefined) {
              v.lastName = "";
            }
            return v;
          });
          this.suggestedDrivers = result;
        });
    } else {
      this.suggestedDrivers = [];
    }
  }, 800);

  setDriver(driverID, firstName = "", lastName = "", middleName = "") {
    if (middleName !== "") {
      this.driverName = `${firstName} ${middleName} ${lastName}`;
      // this.driverID = driverID;
      this.driverID = `${firstName} ${middleName} ${lastName}`;
    } else {
      this.driverName = `${firstName} ${lastName}`;
      this.driverID = `${firstName} ${lastName}`;
    }

    this.suggestedDrivers = [];
  }
      searchDriver() {
        if (this.driverName !== '' || this.driverStatus !== null) 
        {
            this.driverName = this.driverName.toLowerCase();
               if (this.driverID == '') 
               {
               this.driverID = this.driverName;
                }
            this.drivers = [];
                        this.suggestedDrivers = [];
            this.lastItemSK = '';
            this.dataMessage = Constants.FETCHING_DATA;
            this.fetchPagination();
        }
        else {
            return false;
        }
    }
   
    
    resetDriver() {
        if (this.driverName !== '' || this.driverStatus !== null || this.lastItemSK !== '') {
            this.driverName = '';
            this.driverStatus = null;
            this.lastItemSK = '';
            this.drivers = [];
            this.dataMessage = Constants.FETCHING_DATA;
            this.suggestedDrivers = [];
            this.fetchPagination();
        }
        else {
            return false;
        }
    }
    generateDriverCSV() {
        if (this.fullExportDriver.length > 0) {
            let dataObject = []
            let csvArray = []
            this.fullExportDriver.forEach(element => {
                let obj = {}
                obj["Name"] = element.firstName + "  " + element.middleName + " " + element.lastName
                obj["Email"] = element.email
                obj["UserName"] = element.userName
                obj["driverType"] = element.driverType
                obj["Start Date"] = element.startDate ? element.startDate : '--'
                obj["Date of Birth"] = element.DOB
                obj["Gender"] = element.gender === "M" ? 'Male' : 'Female'
                obj["CDL#"] = element.CDL_Number
                obj["Licence Expiry"] = element.licenceDetails.licenceExpiry
                obj["Licence Province"] = element.licenceDetails.licStateName
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
    
    requiredExport() {
        this.apiService.getData(`drivers/get/getFull/export`).subscribe((result: any) => {
            this.fullExportDriver = result.Items;
            this.generateDriverCSV();
        })
    }

    requiredCSV() {
        if (this.driverName !== '' || this.driverStatus !== null) {
            this.fullExportDriver = this.drivers
            this.generateDriverCSV();
        } else {
            this.requiredExport();
        }
    }
}
