import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { ApiService, HereMapService } from 'src/app/services';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgSelectComponent } from "@ng-select/ng-select";
import { Table } from 'primeng/table';
import { OnboardDefaultService } from '../../../../../services/onboard-default.service';
import Constants from 'src/app/pages/fleet/constants';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  @ViewChild('dt') table: Table;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  environment = environment.isFeatureEnabled;
  liveModalTimeout: any;
  liveStreamVehicle: string;
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
  currentView = 'list';a
  totalRecords = 20;
  lastEvaluatedKey = '';
  disableSearch = false;
  vehicleTypeObects: any = {};
  lastItemSK = ''
  loaded = false
  visible = true;
  loadMsg: string = Constants.NO_LOAD_DATA;
  isSearch = false;
  get = _.get;
  _selectedColumns: any[];
  
  dataColumns = [
    { width: '8%', field: 'vehicleIdentification', header: 'Vehicle Name/Number', type: "text" },
    { width: '6%', field: 'VIN', header: 'VIN', type: "text" },
    { width: '5%', field: 'startDate', header: 'Start Date', type: "text" },
    { width: '5%', field: 'manufacturerID', header: 'Make', type: "text" },
    { width: '5%', field: 'modelID', header: 'Model', type: "text" },
    { width: '5%', field: 'year', header: 'Year', type: "text" },
    { width: '9%', field: 'annualSafetyDate', header: 'Annual Safety Date', type: "text" },
    { width: '7%', field: 'ownership', header: 'Ownership', type: "text" },
    { width: '8%', field: 'driverList.driverID', header: 'Driver Assigned', type: 'text' },
    { width: '10%', field: 'driverList.teamDriverID', header: 'Team Driver Assigned', type: 'text' },
    { width: '7%', field: 'plateNumber', header: 'Plate Number', type: "text" },
    { width: '5%', field: 'currentStatus', header: 'Status', type: 'text' },
  ];

  constructor(private apiService: ApiService,
  private httpClient: HttpClient,
  private router: Router,
  private toastr: ToastrService,
  private hereMap: HereMapService,
  private spinner: NgxSpinnerService,
  protected _sanitizer: DomSanitizer) {
  }
  
  async ngOnInit(): Promise<void> {
    this.fetchGroups();
    this.fetchDriversList();
    this.fetchVendorList();
    this.initDataTable()
    this.setToggleOptions();
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

  fetchDriversList() {
    this.apiService.getData('drivers/get/list').subscribe((result: any) => {
      this.driversList = result;
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
          if (result.data.length === 0) {
            this.disableSearch = false;
            this.loaded = true;
            this.dataMessage = Constants.NO_RECORDS_FOUND
          }
          result[`data`].map((v: any) => {
            v.url = `/reports/fleet/vehicles/activity/${v.vehicleID}`;
          })
          if (result.data.length > 0) {
            this.disableSearch = false;
            if (result.nextPage !== undefined) {
              this.lastEvaluatedKey = encodeURIComponent(result.nextPage);
            }
            else {
              this.lastEvaluatedKey = 'end'
            }
            this.vehicles = this.vehicles.concat(result.data)

            this.loaded = true;
          }
        });
    }
  }
  onScroll= async (event: any) => {
    if (this.loaded) {
      this.initDataTable();
    }
    this.loaded = false;
  }
  
   setToggleOptions() {
        this.selectedColumns = this.dataColumns;
    }
    
     @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));

  }
  
   

  searchFilter() {
    if (this.vehicleIdentification !== '' || this.currentStatus !== null) {
      this.vehicleIdentification = this.vehicleIdentification.toLowerCase();
      if (this.vehicleID == '') {
        this.vehicleID = this.vehicleIdentification;
      }
      this.disableSearch = true;
      this.dataMessage = Constants.FETCHING_DATA;
      this.vehicles = [];
      this.lastEvaluatedKey = ''
      this.suggestedVehicles = [];
      this.initDataTable();
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
    this.loaded = false;
    this.initDataTable();
    this.dataMessage = Constants.FETCHING_DATA;
  }
  
   clearVideoTimeout() {
    clearTimeout(this.liveModalTimeout);
  }
  
  clear(table: Table) {
        table.clear();
    }
  
  changeView() {
    if (this.currentView == 'list') {
      this.currentView = 'map'
      setTimeout(() => {
        this.hereMap.mapInit();
      }, 500);
    } else {
      this.currentView = 'list';
    }
  }

  resetFilter() {
    if (this.vehicleIdentification !== '' || this.currentStatus !== null) {
      this.disableSearch = true;
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
  
  generateCSV() {
    if (this.vehicles.length > 0) {
      let dataObject = []
      let csvArray = []
      this.vehicles.forEach(element => {
        let obj = {}
        obj["Vehicle Name/Number"] = element.vehicleIdentification
        obj["VIN"] = element.VIN
        obj["startDate"] = element.startDate
        obj["Make"] = element.manufacturerID
        obj["Model"] = element.modelID
        obj["Year"] = element.year
        obj["Annual Safety Date"] = element.annualSafetyDate
        obj["Ownership"] = element.ownership
        obj["Driver Assigned"] = this.driversList[element.driverID]
        obj["Team Driver Assigned"] = this.driversList[element.teamDriverID]
        obj["Plate Number"] = element.plateNumber
        obj["Status"] = element.currentStatus
        dataObject.push(obj)
      });
      let headers = Object.keys(dataObject[0]).join(',')
      headers += ' \n'
      csvArray.push(headers)
      dataObject.forEach(element => {
        let obj = Object.values(element).join(',')
        obj += ' \n'
        csvArray.push(obj)
      });
      const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Activity-Report.csv`);
        link.style.visibility = 'hidden';
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