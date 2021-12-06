import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../environments/environment';
import { ApiService, HereMapService } from '../../../../../services';
import { OnboardDefaultService } from '../../../../../services/onboard-default.service';
import Constants from 'src/app/pages/fleet/constants';
declare var $: any;
@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  liveModalTimeout: any;
  liveStreamVehicle: string;
  environment = environment.isFeatureEnabled;
  url: any;
  dataMessage: string = Constants.FETCHING_DATA;
  title = 'Vehicle List';
  vehicles = [];
  suggestedVehicles = [];
  vehicleID = '';
  currentStatus = null;
  vehicleIdentification = '';
  allOptions: any = {};
  groupsList: any = {};
  vehicleModelList: any = {};
  vehicleManufacturersList: any = {};
  serviceProgramsList: any = {};
  driversList: any = {};
  vendorsList: any = {};
  currentView = 'list';

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  hideShow = {
    vin: true,
    vehicleName: true,
    vehicleType: true,
    make: true,
    model: true,
    lastLocation: true,
    trip: false,
    plateNo: true,
    fuelType: true,
    status: true,
    group: false,
    ownership: true,
    driver: true,
    serviceProgram: false,
    serviceDate: false,
    insuranceVendor: false,
    insuranceAmount: false,
    engineSummary: false,
    primaryMeter: false,
    fuelUnit: false,
    startDate: true,
    year: true,
    annualSafety: true,
    teamDriver: true
  }

  vehicleNext = false;
  vehiclePrev = true;
  vehicleDraw = 0;
  vehiclePrevEvauatedKeys = [''];
  vehicleStartPoint = 1;
  vehicleEndPoint = this.pageLength;
  vehicleTypeObects: any = {};
  lastItemSK = ''
  loaded = false

  constructor(private apiService: ApiService, private httpClient: HttpClient, private hereMap: HereMapService, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private onboard: OnboardDefaultService, protected _sanitizer: DomSanitizer, private modalService: NgbModal) {
  }


  ngOnInit() {

    this.onboard.checkInspectionForms();
    this.fetchGroups();
    // this.fetchVehicleModelList();
    // this.fetchVehicleManufacturerList();
    this.fetchDriversList();
    this.fetchServiceProgramsList();
    this.fetchVendorList();
    this.initDataTable()
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });

    this.httpClient.get('assets/vehicleType.json').subscribe((data: any) => {
      this.vehicleTypeObects = data.reduce((a: any, b: any) => {
        return a[b['code']] = b['name'], a;
      }, {});
    });

  }

  getSuggestions = _.debounce(function (value) {

    value = value.toLowerCase();
    if (value != '') {
      this.apiService
        .getData(`vehicles/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestedVehicles = result;
        });
    } else {
      this.suggestedVehicles = []
    }
  }, 800);

  fetchGroups() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groupsList = result;
    });
  }

  fetchVehicleModelList() {
    this.apiService.getData('vehicleModels/get/list').subscribe((result: any) => {
      this.vehicleModelList = result;
    });
  }

  // fetchVehicleManufacturerList() {
  //   this.apiService.getData('manufacturers/get/list').subscribe((result: any) => {
  //     this.vehicleManufacturersList = result;
  //   });
  // }

  fetchDriversList() {
    this.apiService.getData('drivers/get/list').subscribe((result: any) => {
      this.driversList = result;
    });
  }


  fetchServiceProgramsList() {
    this.apiService.getData('servicePrograms/get/list').subscribe((result: any) => {
      this.serviceProgramsList = result;
    });
  }

  fetchVendorList() {
    this.apiService.getData('contacts/get/list/vendor').subscribe((result: any) => {
      this.vendorsList = result;
    });
  }

  setVehicle(vehicleID, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleID = vehicleIdentification;
    this.suggestedVehicles = [];
  }

  initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService.getData('vehicles/fetch/records?vehicle=' + this.vehicleID + '&status=' + this.currentStatus + '&lastKey=' + this.lastEvaluatedKey)
        .subscribe(async (result: any) => {
          this.dataMessage = Constants.FETCHING_DATA
          if (result.Items.length === 0) {

            this.dataMessage = Constants.NO_RECORDS_FOUND
          }
          result[`Items`].map((v: any) => {
            v.url = `/reports/fleet/vehicles/activity/${v.vehicleID}`;
          })
          if (result.Items.length > 0) {

            if (result.LastEvaluatedKey !== undefined) {
              this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].vehicleSK);
            }
            else {
              this.lastEvaluatedKey = 'end'
            }
            this.vehicles = this.vehicles.concat(result.Items)

            this.loaded = true;
          }
        });
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
      if (this.vehicleID == '') {
        this.vehicleID = this.vehicleIdentification;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.vehicles = [];
      this.lastEvaluatedKey = ''
      this.suggestedVehicles = [];
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.vehicleIdentification !== '' || this.currentStatus !== null) {
      this.vehicleID = '';
      this.suggestedVehicles = [];
      this.vehicleIdentification = '';
      this.currentStatus = null;
      this.lastEvaluatedKey = ''
      this.vehicles = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.initDataTable();
    } else {
      return false;
    }
  }

}

