import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import Constants from '../../../fleet/constants';
import { HttpClient } from '@angular/common/http';
import * as _ from "lodash";
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-e-manifests',
  templateUrl: './e-manifests.component.html',
  styleUrls: ['./e-manifests.component.css'],

  providers: [ConfirmationService, MessageService]

})
export class EManifestsComponent implements OnInit {
  @ViewChild('dt') table: Table;
  loaded = false;

  ACE_Options = [
    { width: '6%', field: 'tripNumber', header: 'Trip#' },
    { width: '8%', field: 'shipments', header: 'Shipment#' },
    { width: '8%', field: 'shipTypes', header: 'Shipment Type' },
    { width: '13%', field: 'arrDateTime', header: 'Est. Arrival Date & Time' },
    { width: '15%', field: 'usPortOfArrival', header: 'US Port of Entry' },
    { width: '15%', field: 'drivers', header: 'Drivers' },
    { width: '8%', field: 'truck', header: 'Vehicle' },
    { width: '10%', field: 'assets', header: 'Assets' },
    { width: '10%', field: 'shippers', header: 'Consignor' },
    { width: '10%', field: 'receivers', header: 'Consignee' },
    { width: '10%', field: 'status', header: 'Status' },
  ]

  ACI_Options = [
    { width: '6%', field: 'tripNumber', header: 'Trip#' },
    { width: '8%', field: 'shipments', header: 'Shipment#' },
    { width: '8%', field: 'shipTypes', header: 'Shipment Type' },
    { width: '13%', field: 'arrDateTime', header: 'Est. Arrival Date & Time' },
    { width: '15%', field: 'POE', header: 'Canada Port of Entry' },
    { width: '15%', field: 'drivers', header: 'Drivers' },
    { width: '8%', field: 'truck', header: 'Vehicle' },
    { width: '10%', field: 'assets', header: 'Assets' },
    { width: '10%', field: 'shippers', header: 'Consignor' },
    { width: '10%', field: 'receivers', header: 'Consignee' },
    { width: '10%', field: 'status', header: 'Status' },
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
      'name': 'US Port of entry',
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
  _selectedColumns1: any[];

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.fetchUSPorts();

    this.fetchVehiclesList();
    this.fetchAssetsList();
    this.fetchDriversList();
    this.fetchContactsList();

    this.initACEData();
    this.initACIData();
    this.fetchCanadianPorts();
    this.fetchaceShipmentType();
    this.fetchaciShipmentType();

    this.setToggleOptions()
  }
  setToggleOptions() {
    this.aceColumns = this.ACE_Options;
    this.aciColumns = this.ACI_Options;
  }

  @Input() get aceColumns(): any[] {
    return this._selectedColumns;
  }

  set aceColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.ACE_Options.filter(col => val.includes(col));

  }

  @Input() get aciColumns(): any[] {
    return this._selectedColumns1;
  }

  set aciColumns(val: any[]) {
    //restore original order
    this._selectedColumns1 = this.ACI_Options.filter(col => val.includes(col));

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
  async fetchUSPorts() {
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
  clear(table: Table) {
    table.clear();
  }
  initACEData() {
    this.spinner.show();
    this.apiService.getData('eManifests/fetch/ace-list?aceSearch=' + this.aceSearch + '&fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&category=' + this.filterCategory + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if (result.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
          this.loaded = true;
        }
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            const element = result[i];
            element.arrDateTime = `${element.estimatedArrivalDate} ${element.estimatedArrivalTime}`;
            element.drivers = element.drivers.toString().toUpperCase();
            element.assets = element.assets.toString().toUpperCase();
            element.shipments = element.shipments.toString().toUpperCase();
            element.shipTypes = element.shipTypes.toString().toUpperCase();
            element.shippers = element.shippers.toString().toUpperCase();
            element.receivers = element.receivers.toString().toUpperCase();
            element.status = element.status.replaceAll('_', ' ');
            element.usPortOfArrival = `Code: ${element.usPortOfArrival}, Location: ${this.USPortsObjects[element.usPortOfArrival]}`;
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
        this.initACEData();
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
      this.initACEData();
    } else {
      return false;
    }
  }

  detailPage(type: string, id: string) {
    if (type == 'ace') {
      this.router.navigateByUrl(`/dispatch/cross-border/ace-details/${id}`)
    }
    if (type == 'aci') {
      this.router.navigateByUrl(`/dispatch/cross-border/aci-details/${id}`)
    }
  }
  deleteACEEntry(event: Event, mID: string) {
    try {
      this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          //confirm action
          this.messageService.add({
            severity: "info",
            summary: "Confirmed",
            detail: "ACE record deleted."
          });
          await this.deleteACE(mID);
        }
      });
    } catch (error) {

    }

  }



  async deleteACE(mID) {
    let result = await this.apiService.postData('eManifests/ace/delete', mID).toPromise();
    if (result) {
      this.initACEData();
    }

  }



  // ACI operations

  initACIData() {
    this.spinner.show();
    this.apiService.getData('eManifests/fetch/aci-list?aciSearch=' + this.aciSearch + '&fromDate=' + this.aciFromDate + '&toDate=' + this.aciToDate + '&category=' + this.aciFilterCategory + '&lastKey=' + this.lastEvaluatedKeyACI)
      .subscribe((result: any) => {
        if (result.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
          this.loaded = true;
        }
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            const element = result[i];
            element.arrDateTime = `${element.arvDate} ${element.arvTime}`;
            element.drivers = element.drivers.toString().toUpperCase();
            element.assets = element.assets.toString().toUpperCase();
            element.shipments = element.shipments.toString().toUpperCase();
            element.shipTypes = element.shipTypes.toString().toUpperCase();
            element.shippers = element.shippers.toString().toUpperCase();
            element.receivers = element.receivers.toString().toUpperCase();
            element.status = element.status.replaceAll('_', ' ');
            element.POE = `Code: ${element.POE}, Location: ${this.canadianPortsObjects[element.POE]}`;
          }
          this.ACIList = result;
          this.loaded = true;
        }

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
        this.initACIData();
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
      this.initACIData();
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
      this.initACEData();
      this.getStartandEndVal('ace');
    } else {
      this.aceDraw += 1;
      this.initACIData;
      this.getStartandEndVal('aci');
    }
  }

  // prev button func
  prevResults(type) {
    if (type == 'ace') {
      this.aceDraw -= 1;
      this.lastEvaluatedKey = this.acePrevEvauatedKeys[this.aceDraw];
      this.initACEData();
      this.getStartandEndVal('ace');
    } else {
      this.aciDraw -= 1;
      this.lastEvaluatedKeyACI = this.aciPrevEvauatedKeys[this.aciDraw];
      this.initACIData();
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

  refreshACE() {
    this.ACEList = [];
    this.lastEvaluatedKey = '';
    this.loaded = false;
    this.dataMessage = Constants.FETCHING_DATA;
    this.initACEData();
  }

  refreshACI() {
    this.ACIList = [];
    this.lastEvaluatedKey = '';
    this.loaded = false;
    this.dataMessage = Constants.FETCHING_DATA;
    this.initACIData();
  }
}
