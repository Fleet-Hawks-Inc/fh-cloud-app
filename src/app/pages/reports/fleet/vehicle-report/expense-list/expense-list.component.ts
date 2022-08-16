import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from 'src/app/services/here-map.service';
import * as _ from 'lodash';
import * as moment from 'moment'
import { environment } from '../../../../../../environments/environment';
import { ApiService } from '../../../../../services';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Table } from 'primeng/table';
import { OnboardDefaultService } from '../../../../../services/onboard-default.service';
import Constants from 'src/app/pages/fleet/constants';
declare var $: any;
@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit {
  @ViewChild('dt') table: Table;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
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
  lastEvaluatedKey = '';
  disableSearch = false;
  vehicleTypeObects: any = {};
  lastItemSK = ''
  loaded = false
  isSearch = false;
  _selectedColumns: any[];
  driverOptions: any[];
  listView = true;
  visible = true;
  get = _.get;
  
   dataColumns = [
    {  field: 'vehicleIdentification', header: 'Vehicle Name/Number', type: "text" },
    {  field: 'VIN', header: 'VIN', type: "text" },
    {  field: 'startDate', header: 'Start Date', type: "text" },
    {  field: 'manufacturerID', header: 'Make', type: "text" },
    {  field: 'modelID', header: 'Model', type: "text" },
    {  field: 'year', header: 'Year', type: "text" },
    {  field: 'annualSafetyDate', header: 'Annual Safety Date', type: "text" },
    {  field: 'ownership', header: 'Ownership', type: "text" },
    {  field: 'driverList.driverID', header: 'Driver Assigned', type: 'text' },
    {  field: 'driverList.teamDriverID', header: 'Team Driver Assigned', type: 'text' },
    {  field: 'plateNumber', header: 'Plate Number', type: "text" },
    {  field: 'currentStatus', header: 'Status', type: 'text' },
  ];
    

  constructor(private apiService: ApiService, 
  private httpClient: HttpClient,
  private router: Router,
  protected _sanitizer: DomSanitizer,
  private toastr: ToastrService,
  private spinner: NgxSpinnerService,
  private hereMap: HereMapService,) {
  }
  
   async ngOnInit(): Promise<void> {
    this.fetchGroups();
    this.fetchDriversList();
    this.fetchVendorList();
    this.initDataTable();
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
            v.url = `/reports/fleet/vehicles/expense/${v.vehicleID}`;
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
  
  onScroll= async (event: any) =>{
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
   clear(table: Table) {
        table.clear();
    }

}