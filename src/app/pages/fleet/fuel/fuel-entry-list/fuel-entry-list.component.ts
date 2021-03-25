import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import  Constants  from '../../constants';
declare var $: any;

@Component({
  selector: 'app-fuel-entry-list',
  templateUrl: './fuel-entry-list.component.html',
  styleUrls: ['./fuel-entry-list.component.css'],
  providers: [DatePipe]
})
export class FuelEntryListComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  title = 'Fuel Entries List';
  fromDate: any = '';
  toDate: any = '';
  entryId = '';
  vehicles = [];
  vehicleList: any = {};
  tripList: any = {};
  assetList: any = {};
  driverList: any  = {};
  vendorList: any  = {};
  WEXCodeList: any  = {};
  fuelCodeList: any = {};
  countries = [];
  checked = false;
  isChecked = false;
  headCheckbox = false;
  selectedEntryID: any;
  fuelCheckCount = null;
  countryName: any = '';
  formattedFromDate: any = '';
  formattedToDate: any = '';
  fuelList = [];
  suggestedUnits = [];
  vehicleID = '';
  amount = '';
  vehicleIdentification = '';
  unitID = '';
  unitName: string;
  start: any = '';
  end: any = '';

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  fuelNext = false;
  fuelPrev = true;
  fuelDraw = 0;
  fuelPrevEvauatedKeys = [''];
  fuelStartPoint = 1;
  fuelEndPoint = this.pageLength;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }
  ngOnInit() {
    this.fuelEntriesCount();
    this.fetchVehicleList();
    this.fetchAssetList();
    this.fetchWEXCode();
    this.fetchFuelTypeList();
    this.fetchCountries();
    this.fetchTripList();
    this.fetchDriverList();
    this.initDataTable();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }
  setUnit(unitID, unitName) {
    this.unitName = unitName;
    this.unitID = unitID;
    this.suggestedUnits = [];
  }

  getSuggestions(value) {
    value = value.toLowerCase();
    if(value != '') { 
      this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        result = result.Items;
        this.suggestedUnits = [];
        for(let i = 0; i < result.length; i++){
          this.suggestedUnits.push({
            unitID: result[i].vehicleID,
            unitName: result[i].vehicleIdentification
          });
        }
        this.getAssetsSugg(value);
      });
    } else {
      this.suggestedUnits = [];
    }
  }

  getAssetsSugg(value) {
    value = value.toLowerCase();
    if(value != '') {
      this.apiService
      .getData(`assets/suggestion/${value}`)
      .subscribe((result) => {
        result = result.Items;
        for(let i = 0; i < result.length; i++){
          this.suggestedUnits.push({
            unitID: result[i].assetID,
            unitName: result[i].assetIdentification
          });
        }
      });
    } else {
      this.suggestedUnits = [];
    }
  }

  fetchVendorList() {
    this.apiService.getData('vendors/get/list').subscribe((result: any) => {
      this.vendorList = result;
    });
  }
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
  fetchAssetList() {
    this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetList = result;
    });
  }
  fetchDriverList() {
    this.apiService.getData('drivers/get/list').subscribe((result: any) => {
      this.driverList = result;
    });
  }
  fetchTripList() {
    this.apiService.getData('trips/get/list').subscribe((result: any) => {
      this.tripList = result;
    });
  }
  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
    });
  }
  fetchFuelTypeList() {
    this.apiService.getData('fuelTypes/get/list').subscribe((result: any) => {
      this.fuelCodeList = result;
    });
  }
  fetchWEXCode() {
    this.apiService.getData('fuelTypes/get/WEXCode').subscribe((result: any) => {
      this.WEXCodeList = result;
    });
  }
  fuelEntriesCount() {
    this.apiService.getData('fuelEntries/get/count?unitID=' + this.unitID + '&from=' + this.start + '&to=' + this.end).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
      },
    });
  }

  showTopValues() {

    const data = {
      fromDate: this.fromDate,
      toDate: this.toDate
    };
    return;
  }

  deleteFuelEntry(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`fuelEntries/isDeleted/${entryID}/` + 1)
      .subscribe((result: any) => {
        this.fuelList = [];
        this.fuelEntriesCount();
        this.initDataTable();
        this.toastr.success('Fuel Entry Deleted Successfully!');
      });
    }
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('fuelEntries/fetch/records?unitID=' + this.unitID + '&from=' + this.start + '&to=' + this.end + '&lastKey=' + this.lastEvaluatedKey).subscribe((result: any) => {
      if (result.Items.length == 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
      this.suggestedUnits = [];
      this.getStartandEndVal();

      this.fuelList = result[`Items`];
      if (this.unitID !== '') {
        this.fuelStartPoint = 1;
        this.fuelEndPoint = this.totalRecords;
      }

      if (result[`LastEvaluatedKey`] !== undefined) {
        this.fuelNext = false;
        // for prev button
        if (!this.fuelPrevEvauatedKeys.includes(result[`LastEvaluatedKey`].entryID)) {
          this.fuelPrevEvauatedKeys.push(result[`LastEvaluatedKey`].entryID);
        }
        this.lastEvaluatedKey = result[`LastEvaluatedKey`].entryID;

      } else {
        this.fuelNext = true;
        this.lastEvaluatedKey = '';
        this.fuelEndPoint = this.totalRecords;
      }

      // disable prev btn
      if (this.fuelDraw > 0) {
        this.fuelPrev = false;
      } else {
        this.fuelPrev = true;
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }

  searchFilter() {
    if (this.unitID !== '' || this.fromDate !== '' || this.toDate !== '' || this.unitName !== '') {
      if(this.fromDate !== '') {
        this.start = this.fromDate;
      }
      if(this.toDate !== '') {
        this.end = this.toDate;
      }

      this.fuelList = [];
      this.fuelEntriesCount();
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.unitID !== '' || this.fromDate !== '' || this.toDate !== '' || this.unitName !== '') {
      this.unitID = '';
      this.fromDate = '';
      this.toDate = '';
      this.unitName = '';
      this.start = '';
      this.end = '';

      this.fuelList = [];
      this.fuelEntriesCount();
      this.initDataTable();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  getStartandEndVal() {
    this.fuelStartPoint = this.fuelDraw * this.pageLength + 1;
    this.fuelEndPoint = this.fuelStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.fuelNext = true;
    this.fuelPrev = true;
    this.fuelDraw += 1;
    this.initDataTable();
    // this.getStartandEndVal();
  }

  // prev button func
  prevResults() {
    this.fuelNext = true;
    this.fuelPrev = true;
    this.fuelDraw -= 1;
    this.lastEvaluatedKey = this.fuelPrevEvauatedKeys[this.fuelDraw];
    this.initDataTable();
    // this.getStartandEndVal();
  }

  resetCountResult() {
    this.fuelStartPoint = 1;
    this.fuelEndPoint = this.pageLength;
    this.fuelDraw = 0;
  }
}
