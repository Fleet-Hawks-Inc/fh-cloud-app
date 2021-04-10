import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import  Constants  from '../../../fleet/constants';

declare var $: any;
@Component({
  selector: 'app-e-manifests',
  templateUrl: './e-manifests.component.html',
  styleUrls: ['./e-manifests.component.css'],
})
export class EManifestsComponent implements OnInit {

  activeDiv = 'ace';
  dataMessage: string = Constants.FETCHING_DATA;
  dataMessageACI: string = Constants.FETCHING_DATA;
  countries = [];
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
  consigneesList: any = {};
  shippersList: any = {};
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

  aceNext = false;
  acePrev = true;
  aceDraw = 0;
  acePrevEvauatedKeys = [''];
  aceStartPoint = 1;
  aceEndPoint = this.pageLength;

  aciNext = false;
  aciPrev = true;
  aciDraw = 0;
  aciPrevEvauatedKeys = [''];
  aciStartPoint = 1;
  aciEndPoint = this.pageLength;
  environment = environment.isFeatureEnabled;
  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.fetchCountries();
    this.ACEEntries();
    this.ACIEntries();
    this.fetchVehiclesList();
    this.fetchAssetsList();
    this.fetchShippersList();
    this.fetchDriversList();
    this.fetchConsigneesList();
    this.initDataTable();
    this.getACECount();
    this.getACICount();
    this.initDataTableACI();
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
  fetchConsigneesList() {
    this.apiService.getData('receivers/get/list').subscribe((result: any) => {
      this.consigneesList = result;
    });
  }
  fetchShippersList() {
    this.apiService.getData('shippers/get/list').subscribe((result: any) => {
      this.shippersList = result;
    });
  }
  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
    });
  }
  ACEEntries() {
    this.spinner.show(); // loader init
    this.apiService.getData('ACEeManifest').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
        this.spinner.hide(); // loader hide
      },
    });
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('ACEeManifest/fetch/records?vehicleID=' + this.vehicleID + '&aceSearch=' + this.aceSearch + '&fromDate='+this.fromDate +'&toDate='+this.toDate + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.ACEList = result[`Items`];
        if (this.vehicleID !== '' || this.aceSearch !== '' || this.fromDate != '' || this.toDate != '') {
          this.aceStartPoint = 1;
          this.aceEndPoint = this.totalRecords;
        }

        if (result[`LastEvaluatedKey`] !== undefined) {
          this.aceNext = false;
          // for prev button
          if (!this.acePrevEvauatedKeys.includes(result[`LastEvaluatedKey`].entryID)) {
            this.acePrevEvauatedKeys.push(result[`LastEvaluatedKey`].entryID);
          }
          this.lastEvaluatedKey = result[`LastEvaluatedKey`].entryID;

        } else {
          this.aceNext = true;
          this.lastEvaluatedKey = '';
          this.aceEndPoint = this.totalRecords;
        }

        if(this.totalRecords < this.aceEndPoint) {
          this.aceEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.aceDraw > 0) {
          this.acePrev = false;
        } else {
          this.acePrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  searchACEFilter() {
    if (
      this.vehicleID !== '' ||
      this.aceSearch !== '' ||
      this.fromDate !== '' ||
      this.toDate !== ''
    ) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.getACECount();
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetACEFilter() {
    if (
      this.vehicleID !== '' ||
      this.aceSearch !== '' ||
      this.fromDate !== '' ||
      this.toDate !== ''
    ) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.vehicleID = '';
      this.vehicleIdentification = '';
      this.currentStatus = '';
      this.aceSearch = '';
      this.fromDate = '';
      this.toDate = '';
      this.getACECount();
      this.initDataTable();
      this.resetCountResult('ace');
    } else {
      return false;
    }
  }
  deleteACEEntry(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
        .getData(`ACEeManifest/isDeleted/${entryID}/` + 1)
        .subscribe((result: any) => {
          this.dataMessage = Constants.FETCHING_DATA;
          this.aceDraw = 0;
          this.lastEvaluatedKey = '';
          this.getACECount();
          this.initDataTable();
          this.toastr.success('ACE eManifest Entry Deleted Successfully!');
        });
    }
  }

  // ACI operations
  ACIEntries() {
    // this.activeDiv = 'aci';
    this.spinner.show(); // loader init
    this.apiService.getData('ACIeManifest').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        // this.ACIList = result.Items;
        this.totalACIRecords = result.Count;
        this.spinner.hide(); // loader hide
      },
    });
  }

  initDataTableACI() {
    this.spinner.show();
    this.apiService.getData('ACIeManifest/fetch/records?vehicleID=' + this.vehicleID + '&aciSearch=' + this.aciSearch + '&fromDate='+this.aciFromDate +'&toDate='+this.aciToDate + '&lastKey=' + this.lastEvaluatedKeyACI)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessageACI = Constants.NO_RECORDS_FOUND;
        }
        this.ACIList = result[`Items`];
        if (this.vehicleID !== '' || this.aciSearch !== '' || this.aciFromDate != '' || this.aciToDate != '') {
          this.aciStartPoint = 1;
          this.aciEndPoint = this.totalACIRecords;
        }

        if (result[`LastEvaluatedKey`] !== undefined) {
          this.aciNext = false;
          // for prev button
          if (!this.aciPrevEvauatedKeys.includes(result[`LastEvaluatedKey`].entryID)) {
            this.aciPrevEvauatedKeys.push(result[`LastEvaluatedKey`].entryID);
          }
          this.lastEvaluatedKeyACI = result[`LastEvaluatedKey`].entryID;
        } else {
          this.aciNext = true;
          this.lastEvaluatedKeyACI = '';
          this.aciEndPoint = this.totalACIRecords;
        }

        if(this.totalACIRecords < this.aciEndPoint) {
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
      this.vehicleIDACI !== '' ||
      this.aciSearch !== '' ||
      this.aciFromDate !== '' ||
      this.aciToDate !== ''
    ) {
      this.getACICount();
      this.initDataTableACI();
      this.dataMessageACI = Constants.FETCHING_DATA;
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
      this.dataMessageACI = Constants.FETCHING_DATA;
      this.vehicleIDACI = '';
      this.vehicleIdentificationACI = '';
      this.aciSearch = '';
      this.aciFromDate = '';
      this.aciToDate = '';
      this.getACICount();
      this.initDataTableACI();
      this.resetCountResult('aci');
    } else {
      return false;
    }
  }

  deleteACIEntry(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
        .getData(`ACIeManifest/isDeleted/${entryID}/` + 1)
        .subscribe((result: any) => {
          this.dataMessageACI = Constants.FETCHING_DATA;
          this.aciDraw = 0;
          this.lastEvaluatedKeyACI = '';
          this.initDataTableACI();
          this.getACICount();
          this.toastr.success('ACI eManifest Entry Deleted Successfully!');
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

  getACECount() {
    this.apiService.getData('ACEeManifest/get/count?vehicleID=' + this.vehicleID + '&aceSearch=' + this.aceSearch + '&fromDate='+this.fromDate +'&toDate='+this.toDate).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
      },
    });
  }

  getACICount() {
    this.apiService.getData('ACIeManifest/get/count?vehicleID=' + this.vehicleID + '&aciSearch=' + this.aciSearch + '&fromDate='+this.aciFromDate +'&toDate='+this.aciToDate).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalACIRecords = result.Count;
      },
    });
  }

  getStartandEndVal(type) {
    if(type == 'ace') {
      this.aceStartPoint = this.aceDraw * this.pageLength + 1;
      this.aceEndPoint = this.aceStartPoint + this.pageLength - 1;
    } else {
      this.aciStartPoint = this.aciDraw * this.pageLength + 1;
      this.aciEndPoint = this.aciStartPoint + this.pageLength - 1;
    }
  }

  // next button func
  nextResults(type) {
    if(type == 'ace') {
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
    if(type == 'ace') {
      this.aceDraw -= 1;
      this.lastEvaluatedKey = this.acePrevEvauatedKeys[this.aceDraw];
      this.initDataTable();
      this.getStartandEndVal('ace');
    } else {
      this.aciDraw -= 1;
      this.lastEvaluatedKeyACI = this.aciPrevEvauatedKeys[this.aciDraw];
      this.initDataTable();
      this.getStartandEndVal('aci');
    }
  }

  resetCountResult(type) {
    if(type == 'ace') {
      this.aceStartPoint = 1;
      this.aceEndPoint = this.pageLength;
      this.aceDraw = 0;
    } else {
      this.aciStartPoint = 1;
      this.aciEndPoint = this.pageLength;
      this.aciDraw = 0;
    }
  }
}
