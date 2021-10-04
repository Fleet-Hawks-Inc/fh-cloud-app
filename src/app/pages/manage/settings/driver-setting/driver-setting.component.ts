import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../services';
import Constants from '../../constants';
import * as _ from 'lodash';
@Component({
  selector: 'app-driver-setting',
  templateUrl: './driver-setting.component.html',
  styleUrls: ['./driver-setting.component.css']
})
export class DriverSettingComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  driverID = '';
  driverName = '';
  totalRecords = 10;
  pageLength = 10;
  lastEvaluatedKey = '';
  currentStatus: any;
  driverNext = false;
  driverPrev = true;
  driverDraw = 0;
  driverPrevEvauatedKeys = [''];
  driverStartPoint = 1;
  driverEndPoint = this.pageLength;
  suggestedDrivers = [];
  driverType = null;
  drivers = [];
  getSuggestions = _.debounce(function (value) {
    this.driverID = '';
    value = value.toLowerCase();
    if (value !== '') {
      this.apiService
        .getData(`drivers/get/deleted/drivers/suggestions/${value}`)
        .subscribe((result) => {
          result.map((v) => {
            if (v.lastName === undefined) {
              v.lastName = '';
            }
            return v;
          });
          console.log('result', result);
          this.suggestedDrivers = result;
        });
    } else {
      this.suggestedDrivers = [];
    }
  }, 800);
  constructor( private apiService: ApiService, private toastr: ToastrService,) { }

  ngOnInit() {
    this.fetchDriversCount();
  }
  fetchDriversCount() {
    this.apiService.getData(`drivers/deleted/get/count?driver=${this.driverID}&type=${this.driverType}`).subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.totalRecords = result.Count;

        if (this.driverID !== '') {
          this.driverEndPoint = this.totalRecords;
        }
        this.initDataTable();
      },
    });
  }
  initDataTable() {
    this.apiService.getData(`drivers/deleted/fetch/records?driver=${this.driverID}&lastKey=${this.lastEvaluatedKey}&type=${this.driverType}`)
      .subscribe((result: any) => {
        console.log('result', result);
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        result.Items.map((v) => {
          v.url = `/fleet/drivers/detail/${v.driverID}`;
        });
        this.suggestedDrivers = [];
        this.getStartandEndVal();
        this.drivers = result[`Items`];
        if (this.driverID !== '') {
          this.driverStartPoint = 1;
          this.driverEndPoint = this.totalRecords;
        }
        if (result[`LastEvaluatedKey`] !== undefined) {
          const lastEvalKey = result[`LastEvaluatedKey`].driverSK.replace(/#/g, '--');
          this.driverNext = false;
          // for prev button
          if (!this.driverPrevEvauatedKeys.includes(lastEvalKey)) {
            this.driverPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKey = lastEvalKey;
        } else {
          this.driverNext = true;
          this.lastEvaluatedKey = '';
          this.driverEndPoint = this.totalRecords;
        }
        if (this.totalRecords < this.driverEndPoint) {
          this.driverEndPoint = this.totalRecords;
        }
        // disable prev btn
        if (this.driverDraw > 0) {
          this.driverPrev = false;
        } else {
          this.driverPrev = true;
        }
       // this.spinner.hide();
      }, err => {
      //  this.spinner.hide();
      });
  }
  getStartandEndVal() {
    this.driverStartPoint = this.driverDraw * this.pageLength + 1;
    this.driverEndPoint = this.driverStartPoint + this.pageLength - 1;
  }
    // next button func
    nextResults() {
      this.driverNext = true;
      this.driverPrev = true;
      this.driverDraw += 1;
      this.initDataTable();
    }

    // prev button func
    prevResults() {
      this.driverNext = true;
      this.driverPrev = true;
      this.driverDraw -= 1;
      this.lastEvaluatedKey = this.driverPrevEvauatedKeys[this.driverDraw];
      this.initDataTable();
    }

    resetCountResult() {
      this.driverStartPoint = 1;
      this.driverEndPoint = this.pageLength;
      this.driverDraw = 0;
    }

    refreshData() {
      this.drivers = [];
      this.driverID = '';
      this.driverName = '';
      this.driverType = null;
      this.lastEvaluatedKey = '';
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchDriversCount();
      this.driverDraw = 0;
      this.resetCountResult();
    }
    searchFilter() {
      if (this.driverName !== ''  || this.driverType !== null || this.driverType !== '') {
        this.driverName = this.driverName.toLowerCase();
        if (this.driverID === '') {
          this.driverID = this.driverName;
        }
        this.drivers = [];
        this.dataMessage = Constants.FETCHING_DATA;
        this.suggestedDrivers = [];
        this.fetchDriversCount();
      } else {
        return false;
      }
    }
    resetFilter() {
      if (this.driverName !== ''  || this.driverType !== null || this.driverType !== '') {
        this.drivers = [];
        this.driverID = '';
        this.driverName = '';
        this.driverType = null;
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchDriversCount();
        this.driverDraw = 0;
        this.resetCountResult();
      } else {
        return false;
      }
    }

    restoreDriver(eventData) {
      if (confirm('Are you sure you want to restore?') === true) {
        this.apiService.deleteData(`drivers/restore/driver/${eventData.driverID}/${eventData.firstName}/${eventData.lastName}/${eventData.userName}`).subscribe((result: any) => {
          this.drivers = [];
          this.driverDraw = 0;
          this.dataMessage = Constants.FETCHING_DATA;
          this.lastEvaluatedKey = '';
          this.fetchDriversCount();
          this.toastr.success('Driver is restored!');
        });
      }
    }


    setDriver(firstName, lastName) {
      this.driverName = firstName + ' ' + lastName;
      this.driverID = firstName + '-' + lastName;
      this.suggestedDrivers = [];
    }
}
