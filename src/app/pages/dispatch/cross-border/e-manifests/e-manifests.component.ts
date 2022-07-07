import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import Constants from '../../../fleet/constants';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { HttpClient } from '@angular/common/http';
import * as _ from "lodash";
import { Table } from 'primeng/table';
declare var $: any;
@Component({
  selector: 'app-e-manifests',
  templateUrl: './e-manifests.component.html',
  styleUrls: ['./e-manifests.component.css'],
})
export class EManifestsComponent implements OnInit {
  @ViewChild('dt') table: Table;
  loaded = false;

  ACE_Options = [
    { width: '6%', field: 'tripNo', header: 'Trip#' },
    { width: '8%', field: 'shipNo', header: 'Shipment#' },
    { width: '8%', field: 'shipType', header: 'Shipment Type' },
    { width: '13%', field: 'arrDateTime', header: 'Est. Arrival Date & Time' },
    { width: '10%', field: 'usPortOfArrival', header: 'US Port of Entry' },
    { width: '15%', field: 'drivers', header: 'Drivers' },
    { width: '8%', field: 'trailer', header: 'Trailer' },
    { width: '10%', field: 'assets', header: 'Assets' },
    { width: '10%', field: 'shippers', header: 'Consignor' },
    { width: '10%', field: 'receivers', header: 'Consignee' },
    { width: '6%', field: 'status', header: 'Status' },
  ]

  activeDiv = 'ace';
  dataMessage: string = Constants.FETCHING_DATA;
  dataMessageACI: string = Constants.FETCHING_DATA;
  ACEList = [];
  ACIList = [];
  aceSearch = '';
  aciSearch = '';
  vehicleID = '';
  vehicleIdentification: string;
  currentStatus = '';
  suggestedVehicles = [];
  vehicleIDACI = '';
  vehicleIdentificationACI: string;
  suggestedVehiclesACI = [];
  currentStatusACI = '';
  vehicles = [];
  vehiclesList: any = {};
  assetsList: any = {};
  driversList: any = {};
  contactList: any = {};
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';
  totalACIRecords = 20;
  pageLengthACI = 10;
  lastEvaluatedKeyACI = '';
  aceClass = 'active';
  aciClass = '';
  // Date related fields
  startDate = '';
  endDate = '';
  aciStartDate = '';
  aciEndDate = '';
  aciFromDate = '';
  aciToDate = '';
  fromDate = '';
  toDate = '';
  canadianPortsObjects: any = {};
  USPortsObjects: any = {};
  aceNext = false;
  acePrev = true;
  aceDraw = 0;
  acePrevEvauatedKeys = [''];
  aceStartPoint = 1;
  aceEndPoint = this.pageLength;
  aceShipmentTypeObjects: any = {};
  aciShipmentTypeObjects: any = {};
  aciNext = false;
  aciPrev = true;
  aciDraw = 0;
  aciPrevEvauatedKeys = [''];
  aciStartPoint = 1;
  aciEndPoint = this.pageLength;
  environment = environment.isFeatureEnabled;
  categoryFilter = [
    {
      'name': 'Driver',
      'value': 'driver'
    },
    {
      'name': 'Vehicle',
      'value': 'vehicle'
    },
    {
      'name': 'Port of entry',
      'value': 'entryPort'
    },
    {
      'name': 'Trip Number',
      'value': 'tripNumber'
    },
  ];
  filterCategory = null;
  aciFilterCategory = null;
  get = _.get;
  find = _.find;
  _selectedColumns: any[];

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.fetchVehiclesList();
    this.fetchAssetsList();
    this.fetchDriversList();
    this.fetchContactsList();

    this.initDataTable();
    this.fetchCanadianPorts();
    this.fetchUSPorts();
    this.fetchaceShipmentType();
    this.fetchaciShipmentType();

    this.setToggleOptions()
  }
  setToggleOptions() {
    this.selectedColumns = this.ACE_Options;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.ACE_Options.filter(col => val.includes(col));

  }
  fetchaceShipmentType() {
    this.httpClient.get('assets/ACEShipmentType.json').subscribe((data: any) => {
      this.aceShipmentTypeObjects = data.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
      }, {});
    });
  }
  fetchaciShipmentType() {
    this.httpClient.get('assets/jsonFiles/ACIShipmentType.json').subscribe((data: any) => {
      this.aciShipmentTypeObjects = data.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
      }, {});
    });
  }
  getSuggestions(value) {
    this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedVehicles = result.Items;
        if (this.suggestedVehicles.length === 0) {
          this.vehicleID = '';
        }
      });
  }
  fetchUSPorts() {
    this.httpClient.get('assets/USports.json').subscribe((data: any) => {
      this.USPortsObjects = data.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`portOfEntry`], a;
      }, {});
    });

  }
  setVehicle(vehicleID, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleID = vehicleID;
    this.suggestedVehicles = [];
  }
  getSuggestionsACI(value) {
    this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedVehiclesACI = result.Items;
        if (this.suggestedVehiclesACI.length === 0) {
          this.vehicleIDACI = '';
        }
      });
  }
  setVehicleACI(vehicleID, vehicleIdentification) {
    this.vehicleIdentificationACI = vehicleIdentification;
    this.vehicleIDACI = vehicleID;
    this.suggestedVehiclesACI = [];
  }
  fetchVehiclesList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehiclesList = result;
    });
  }
  fetchAssetsList() {
    this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetsList = result;
    });
  }
  fetchDriversList() {
    this.apiService.getData('drivers/get/list').subscribe((result: any) => {
      this.driversList = result;
    });
  }
  fetchContactsList() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.contactList = result;
    });
  }
  fetchCanadianPorts() {
    this.httpClient.get('assets/canadianPorts.json').subscribe((data: any) => {
      this.canadianPortsObjects = data.reduce((a: any, b: any) => {
        return a[b[`number`]] = b[`name`], a;
      }, {});
    });
  }
  initDataTable() {
    this.spinner.show();
    this.apiService.getData('eManifests/fetch/ACErecords?aceSearch=' + this.aceSearch + '&fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&category=' + this.filterCategory + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if (result.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
          this.loaded = true;
        }
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            const element = result[i];
            element.arrDateTime = `${element.estimatedArrivalDate} ${element.estimatedArrivalTime}`;
            element.drivers = element.drivers.toString();
            element.assets = element.assets.toString();
            element.shippers = element.shippers.toString();
            element.receivers = element.receivers.toString();

          }
          this.ACEList = result;
          this.loaded = true;
        }

        // if (this.vehicleID !== '' || this.aceSearch !== '' || this.fromDate != '' || this.toDate != '') {
        //   this.aceStartPoint = 1;
        //   this.aceEndPoint = this.totalRecords;
        // }
        // if (result[`LastEvaluatedKey`] !== undefined) {
        //   const lastEvalKey = result[`LastEvaluatedKey`].emanifestSK.replace(/#/g, '--');
        //   this.aceNext = false;
        //   // for prev button
        //   if (!this.acePrevEvauatedKeys.includes(lastEvalKey)) {
        //     this.acePrevEvauatedKeys.push(lastEvalKey);
        //   }
        //   this.lastEvaluatedKey = lastEvalKey;
        // } else {
        //   this.aceNext = true;
        //   this.lastEvaluatedKey = '';
        //   this.aceEndPoint = this.totalRecords;
        // }
        // if (this.totalRecords < this.aceEndPoint) {
        //   this.aceEndPoint = this.totalRecords;
        // }
        // // disable prev btn
        // if (this.aceDraw > 0) {
        //   this.acePrev = false;
        // } else {
        //   this.acePrev = true;
        // }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  searchACEFilter() {
    if (
      this.aceSearch !== '' ||
      this.fromDate !== '' ||
      this.toDate !== '' || this.filterCategory != null
    ) {

      if (this.fromDate != '' && this.toDate == '') {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.fromDate == '' && this.toDate != '') {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.filterCategory != null && this.aceSearch == '') {
        this.toastr.error('Please enter search value.');
        return false;
      } else if (this.filterCategory != null && this.aceSearch == null) {
        this.toastr.error('Please select search value.');
        return false;
      } else {
        if (this.filterCategory == 'tripNumber') {
          this.aceSearch = this.aceSearch.toUpperCase();
        }
        this.ACEList = [];
        this.dataMessage = Constants.FETCHING_DATA;

      }
    } else {
      return false;
    }
  }

  resetACEFilter() {
    if (
      this.aceSearch !== '' ||
      this.fromDate !== '' ||
      this.toDate !== ''
    ) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.aceSearch = '';
      this.fromDate = '';
      this.toDate = '';
      this.ACEList = [];
      this.filterCategory = null;

      this.resetCountResult('ace');
    } else {
      return false;
    }
  }
  deleteACEEntry(eventData) {
    if (confirm('Are you sure you want to delete?') === true) {
      let record = {
        date: eventData.createdDate,
        time: eventData.createdTime,
        eventID: eventData.manifestID,
        status: eventData.currentStatus
      }
      this.apiService.postData('eManifests/delete/ACEmanifest', record).subscribe((result: any) => {
        this.aceDraw = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';

        this.toastr.success('Manifest Deleted Successfully!');
      });
    }
  }
  // ACI operations

  initDataTableACI() {
    this.spinner.show();
    this.apiService.getData('eManifests/fetch/ACIrecords?aciSearch=' + this.aciSearch + '&fromDate=' + this.aciFromDate + '&toDate=' + this.aciToDate + '&category=' + this.aciFilterCategory + '&lastKey=' + this.lastEvaluatedKeyACI)
      .subscribe((result: any) => {
        if (result.Items.length == 0) {
          this.dataMessageACI = Constants.NO_RECORDS_FOUND;
        }
        this.ACIList = result[`Items`];
        if (this.aciSearch !== '' || this.aciFromDate != '' || this.aciToDate != '' || this.aciFilterCategory != null) {
          this.aciStartPoint = 1;
          this.aciEndPoint = this.totalACIRecords;
        }

        if (result[`LastEvaluatedKey`] !== undefined) {
          const lastEvalKey = result[`LastEvaluatedKey`].emanifestSK.replace(/#/g, '--');
          this.aciNext = false;
          // for prev button
          if (!this.aciPrevEvauatedKeys.includes(lastEvalKey)) {
            this.aciPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKeyACI = lastEvalKey;
        } else {
          this.aciNext = true;
          this.lastEvaluatedKeyACI = '';
          this.aciEndPoint = this.totalACIRecords;
        }

        if (this.totalACIRecords < this.aciEndPoint) {
          this.aciEndPoint = this.totalACIRecords;
        }

        // disable prev btn
        if (this.aciDraw > 0) {
          this.aciPrev = false;
        } else {
          this.aciPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  searchACIFilter() {
    if (
      this.aciFilterCategory !== null ||
      this.aciSearch !== '' ||
      this.aciFromDate !== '' ||
      this.aciToDate !== ''
    ) {

      if (this.aciFromDate != '' && this.aciToDate == '') {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.aciFromDate == '' && this.aciToDate != '') {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.aciFilterCategory != null && this.aciSearch == '') {
        this.toastr.error('Please enter search value.');
        return false;
      } else if (this.aciFilterCategory != null && this.aciSearch == null) {
        this.toastr.error('Please select search value.');
        return false;
      } else {

        if (this.aciFilterCategory == 'tripNumber') {
          this.aciSearch = this.aciSearch.toUpperCase();
        }
        this.ACIList = [];
        this.initDataTableACI();
        this.dataMessageACI = Constants.FETCHING_DATA;
      }
    } else {
      return false;
    }
  }

  resetACIFilter() {
    if (
      this.vehicleIDACI !== '' ||
      this.aciSearch !== '' || this.aciFromDate !== '' ||
      this.aciToDate !== ''
    ) {
      this.ACIList = [];
      this.aciFilterCategory = null;
      this.dataMessageACI = Constants.FETCHING_DATA;
      this.aciSearch = '';
      this.aciFromDate = '';
      this.aciToDate = '';
      this.initDataTableACI();
      this.resetCountResult('aci');
    } else {
      return false;
    }
  }

  deleteACIEntry(eventData) {
    if (confirm('Are you sure you want to delete?') === true) {
      let record = {
        date: eventData.createdDate,
        time: eventData.createdTime,
        eventID: eventData.manifestID,
        status: eventData.currentStatus
      };
      this.apiService.postData('eManifests/delete/ACImanifest', record).subscribe((result: any) => {
        this.aciDraw = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        this.toastr.success('Manifest Deleted Successfully!');
      });
    }
  }

  changeTab(tabType) {
    this.activeDiv = tabType;
    if (tabType === 'ace') {
      this.aceClass = 'active';
      this.aciClass = '';
      $('#ace-emanifest').show();
      $('#aci-emanifest').hide();
    } else if (tabType === 'aci') {
      this.aceClass = '';
      this.aciClass = 'active';
      $('#ace-emanifest').hide();
      $('#aci-emanifest').show();
    }
  }


  getStartandEndVal(type) {
    if (type == 'ace') {
      this.aceStartPoint = this.aceDraw * this.pageLength + 1;
      this.aceEndPoint = this.aceStartPoint + this.pageLength - 1;
    } else {
      this.aciStartPoint = this.aciDraw * this.pageLength + 1;
      this.aciEndPoint = this.aciStartPoint + this.pageLength - 1;
    }
  }

  // next button func
  nextResults(type) {
    if (type == 'ace') {
      this.aceDraw += 1;
      this.initDataTable();
      this.getStartandEndVal('ace');
    } else {
      this.aceDraw += 1;
      this.initDataTableACI;
      this.getStartandEndVal('aci');
    }
  }

  // prev button func
  prevResults(type) {
    if (type == 'ace') {
      this.aceDraw -= 1;
      this.lastEvaluatedKey = this.acePrevEvauatedKeys[this.aceDraw];
      this.initDataTable();
      this.getStartandEndVal('ace');
    } else {
      this.aciDraw -= 1;
      this.lastEvaluatedKeyACI = this.aciPrevEvauatedKeys[this.aciDraw];
      this.initDataTableACI();
      this.getStartandEndVal('aci');
    }
  }

  resetCountResult(type) {
    if (type == 'ace') {
      this.aceStartPoint = 1;
      this.aceEndPoint = this.pageLength;
      this.aceDraw = 0;
    } else {
      this.aciStartPoint = 1;
      this.aciEndPoint = this.pageLength;
      this.aciDraw = 0;
    }
  }

  categoryChange(event, type) {
    if (event == 'driver' || event == 'vehicle' || event == 'entryPort') {
      if (type == 'ace') {
        this.aceSearch = null;
      } else {
        this.aciSearch = null;
      }
    } else {
      if (type == 'ace') {
        this.aceSearch = '';
      } else {
        this.aciSearch = '';
      }
    }
  }

  refreshData() {
    this.ACEList = [];
    this.lastEvaluatedKey = '';
    this.loaded = false;
    this.dataMessage = Constants.FETCHING_DATA;
    this.initDataTable();
  }
}
