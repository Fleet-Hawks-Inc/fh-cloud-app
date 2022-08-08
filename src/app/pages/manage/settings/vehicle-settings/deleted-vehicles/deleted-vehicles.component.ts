import { Component, OnInit, ViewChild, Input, ElementRef} from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import Constants from '../../../constants';
import { Router } from '@angular/router';
import { ApiService } from '../../../../../services';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgSelectComponent } from "@ng-select/ng-select";
import { Table } from 'primeng/table/table';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';





@Component({
  selector: 'app-deleted-vehicles',
  templateUrl: './deleted-vehicles.component.html',
  styleUrls: ['./deleted-vehicles.component.css']
})
export class DeletedVehiclesComponent implements OnInit {
  @ViewChild("dt") table: Table;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
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
  isSearch = false;
  get = _.get;
  visible = true;
  _selectedColumns: any[];
  vehStatus: any[];
  
   dataColumns = [
    {  field: 'vehicleIdentification', header: 'Name/Number', type: "text" },
    {  field: 'VIN', header: 'VIN', type: "text" },
    {  field: 'lifeCycle.startDate', header: 'Start Date', type: "text" },
    {  field: 'manufacturerID', header: 'Make', type: "text" },
    {  field: 'modelID', header: 'Model', type: "text" },
    {  field: 'year', header: 'Year', type: "text" },
    {  field: 'annualSafetyDate', header: 'Annual Safety Date', type: "text" },
    {  field: 'ownership', header: 'Ownership', type: "text" },
    {  field: 'driverName', header: 'Driver Assigned', type: 'text' },
    {  field: 'teamDriverName', header: 'Team Driver Assigned', type: 'text' },
    {  field: 'plateNumber', header: 'Plate Number', type: "text" },
    {  field: 'currentStatus', header: 'Status', type: 'text' },
  ];
  
  constructor(private apiService: ApiService, 
  private toastr: ToastrService,
  private router: Router, 
  private spinner: NgxSpinnerService,
  protected _sanitizer: DomSanitizer,
  private el: ElementRef,
  private modalService: NgbModal,
  ) { }

  async ngOnInit(): Promise<void> {
    this.fetchDriversList();
    this.setVehiclesOptions();
    this.setToggleOptions();
    await this.initDataTable();
  }
  
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
  
  
  setVehiclesOptions() {
    this.vehStatus = [
      { 'name': 'Active', 'value': 'active' },
      { 'name': 'Inactive', 'value': 'inActive' },
      { 'name': 'Out of Service', 'value': 'outOfService' },
      { 'name': 'Sold', 'value': 'sold' }
    ];
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
  onScroll = async (event: any) => {
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
    this.vehicles = [];
    this.vehicleID = '';
    this.suggestedVehicles = [];
    this.vehicleIdentification = '';
    this.currentStatus = null;
    this.lastEvaluatedKey = '';
    this.loaded = false;
    this.initDataTable();
    this.dataMessage = Constants.FETCHING_DATA;
  }

 clear(table: Table) {
        table.clear();
    }
}
