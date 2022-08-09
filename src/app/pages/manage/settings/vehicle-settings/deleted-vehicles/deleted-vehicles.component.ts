import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import Constants from '../../../constants';
import { ApiService } from '../../../../../services';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deleted-vehicles',
  templateUrl: './deleted-vehicles.component.html',
  styleUrls: ['./deleted-vehicles.component.css']
})
export class DeletedVehiclesComponent implements OnInit {

  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  lastEvaluatedKey = '';
  vehicleID = '';
  currentStatus = null;
  vehicleIdentification = '';
  vehicles = [];
  loaded = false;
  suggestedVehicles = [];
  driversList: any = {};
  vehicleModelList: any = {};
  vehicleManufacturersList: any = {};
  getSuggestions = _.debounce(function (value) {

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
    this.initDataTable();
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
  async initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      const result = await this.apiService.getData('vehicles/fetch/deleted/records?vehicle=' + this.vehicleID + '&vehStatus=' + this.currentStatus + '&lastKey=' + this.lastEvaluatedKey).toPromise();
      if (result.Items.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND
      }
      this.suggestedVehicles = [];
      if (result.Items.length > 0) {
        if (result.LastEvaluatedKey !== undefined) {
          this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].vehicleSK);
        }
        else {
          this.lastEvaluatedKey = 'end'
        }
        this.vehicles = this.vehicles.concat(result.Items);
        this.loaded = true;
      }
    }
  }
  onScroll() {
    if (this.loaded) {
      this.initDataTable();
    }
    this.loaded = false;
  }
  searchFilter() {
    if (this.vehicleIdentification !== '' || this.currentStatus !== null) {
      this.vehicleIdentification = this.vehicleIdentification.toLowerCase();
      if (this.vehicleID === '') {
        this.vehicleID = this.vehicleIdentification;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.vehicles = [];
      this.lastEvaluatedKey = '';
      this.initDataTable();
      this.suggestedVehicles = [];
    } else {
      return false;
    }
  }
  restoreVehicle(eventData) {
    if (confirm('Are you sure you want to restore?') === true) {
      this.apiService.deleteData(`vehicles/restore/${eventData.vehicleID}/${eventData.vehicleIdentification}`).subscribe((result: any) => {
        this.vehicles = [];
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        this.initDataTable();
        this.toastr.success('Vehicle restored successfully!');
      });
    }
  }
  resetFilter() {
    if (this.vehicleIdentification !== '' || this.currentStatus !== null) {
      this.vehicleID = '';
      this.suggestedVehicles = [];
      this.vehicleIdentification = '';
      this.lastEvaluatedKey = '';
      this.currentStatus = null;
      this.vehicles = [];
      this.initDataTable();
      this.dataMessage = Constants.FETCHING_DATA;
    } else {
      return false;
    }
  }
  refreshData() {
    this.vehicleID = '';
    this.suggestedVehicles = [];
    this.vehicleIdentification = '';
    this.currentStatus = null;
    this.vehicles = [];
    this.lastEvaluatedKey = '';
    this.dataMessage = Constants.FETCHING_DATA;
  }

}
