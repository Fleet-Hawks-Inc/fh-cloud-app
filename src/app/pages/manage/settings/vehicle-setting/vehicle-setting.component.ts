import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import Constants from '../../constants';
import { ApiService } from '../../../../services';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-vehicle-setting',
  templateUrl: './vehicle-setting.component.html',
  styleUrls: ['./vehicle-setting.component.css']
})
export class VehicleSettingComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  vehicleNext = false;
  vehiclePrev = true;
  vehicleDraw = 0;
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';
  vehiclePrevEvauatedKeys = [''];
  vehicleStartPoint = 1;
  vehicleEndPoint = this.pageLength;
  vehicleID = '';
  currentStatus = null;
  vehicleIdentification = '';
  vehicles = [];
  suggestedVehicles = [];
  driversList: any = {};
  vehicleModelList: any = {};
  vehicleManufacturersList: any = {};
  getSuggestions = _.debounce(function(value) {

    value = value.toLowerCase();
    if (value !== '') {
      this.apiService
      .getData(`vehicles/deleted/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedVehicles = result;
      });
    } else {
      this.suggestedVehicles = [];
    }
  }, 800);
  constructor(private apiService: ApiService, private toastr: ToastrService,) { }

  ngOnInit() {
    this.fetchVehiclesCount();
    this.fetchDriversList();
  }
  fetchDriversList() {
    this.apiService.getData('drivers/get/list').subscribe((result: any) => {
      this.driversList = result;
    });
  }
  setVehicle(vehicleID, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleID = vehicleIdentification;
    this.suggestedVehicles = [];
  }
  fetchVehiclesCount() {
    this.apiService.getData('vehicles/get/deleted/count?vehicle=' + this.vehicleID ).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
        if (this.vehicleID !== '') {
          this.vehicleEndPoint = this.totalRecords;
        }

        this.initDataTable();
      },
    });
  }
  initDataTable() {
    this.apiService.getData('vehicles/fetch/deleted/records?vehicle=' + this.vehicleID + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedVehicles = [];
        this.getStartandEndVal();
        this.vehicles = result[`Items`];

        if(this.vehicleID !== '') {
          this.vehicleStartPoint = 1;
          this.vehicleEndPoint = this.totalRecords;
        }


        if (result[`LastEvaluatedKey`] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].vehicleSK.replace(/#/g, '--');
          this.vehicleNext = false;
          // for prev button
          if (!this.vehiclePrevEvauatedKeys.includes(lastEvalKey)) {
            this.vehiclePrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKey = lastEvalKey;

        } else {
          this.vehicleNext = true;
          this.lastEvaluatedKey = '';
          this.vehicleEndPoint = this.totalRecords;
        }

        if (this.totalRecords < this.vehicleEndPoint) {
          this.vehicleEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.vehicleDraw > 0) {
          this.vehiclePrev = false;
        } else {
          this.vehiclePrev = true;
        }
      });
  }
  getStartandEndVal() {
    this.vehicleStartPoint = this.vehicleDraw * this.pageLength + 1;
    this.vehicleEndPoint = this.vehicleStartPoint + this.pageLength - 1;
  }

  searchFilter() {
    if (this.vehicleIdentification !== '') {
      this.vehicleIdentification = this.vehicleIdentification.toLowerCase();
      if (this.vehicleID === '') {
        this.vehicleID = this.vehicleIdentification;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.vehicles = [];
      this.suggestedVehicles = [];
      this.fetchVehiclesCount();
    } else {
      return false;
    }
  }
  restoreVehicle(eventData) {
    if (confirm('Are you sure you want to restore?') === true) {
      this.apiService.deleteData(`vehicles/restore/${eventData.vehicleID}/${eventData.vehicleIdentification}`).subscribe((result: any) => {
        this.vehicles = [];
        this.vehicleDraw = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        this.fetchVehiclesCount();
        this.toastr.success('Vehicle restored successfully!');
      });
    }
  }
  resetFilter() {
    if (this.vehicleIdentification !== '') {
      this.vehicleID = '';
      this.suggestedVehicles = [];
      this.vehicleIdentification = '';
      this.currentStatus = null;
      this.vehicles = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchVehiclesCount();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  // next button func
  nextResults() {
    this.vehicleNext = true;
    this.vehiclePrev = true;
    this.vehicleDraw += 1;
    this.initDataTable();
  }

  // prev button func
  prevResults() {
    this.vehicleNext = true;
    this.vehiclePrev = true;
    this.vehicleDraw -= 1;
    this.lastEvaluatedKey = this.vehiclePrevEvauatedKeys[this.vehicleDraw];
    this.initDataTable();
  }

  resetCountResult() {
    this.vehicleStartPoint = 1;
    this.vehicleEndPoint = this.pageLength;
    this.vehicleDraw = 0;
  }

  refreshData() {
    this.vehicleID = '';
    this.suggestedVehicles = [];
    this.vehicleIdentification = '';
    this.currentStatus = null;
    this.vehicles = [];
    this.lastEvaluatedKey = '';
    this.dataMessage = Constants.FETCHING_DATA;
    this.fetchVehiclesCount();
    this.resetCountResult();
  }
}
