import { Component, OnInit, ElementRef } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Constants from '../../constants';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment'
import * as _ from 'lodash'
declare var $: any;

@Component({
  selector: 'app-fuel-entry-list',
  templateUrl: './fuel-entry-list.component.html',
  styleUrls: ['./fuel-entry-list.component.css'],
  providers: [DatePipe]
})
export class FuelEntryListComponent implements OnInit {

  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  title = 'Fuel Entries List';
  fromDate: any = '';
  toDate: any = '';
  fuelID = '';
  vehicles = [];
  vehicleList: any = {};
  tripList: any = {};
  assetList: any = {};
  driverList: any = {};
  vendorList: any = {};
  WEXCodeList: any = {};
  fuelCodeList: any = {};
  countries = [];
  checked = false;
  isChecked = false;
  headCheckbox = false;
  selectedfuelID: any;
  fuelCheckCount = null;
  countryName: any = '';
  formattedFromDate: any = '';
  formattedToDate: any = '';
  fuelList = [];
  suggestedUnits = [];
  vehicleID = '';
  amount = '';
  vehicleIdentification = '';
  unitID = null;
  assetUnitID = null;
  unitName: string;
  start: any = '';
  end: any = '';
  lastTimeCreated = ''
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  fuelNext = false;
  fuelPrev = true;
  fuelDraw = 0;
  fuelPrevEvauatedKeys = [''];
  fuelStartPoint = 1;
  fuelEndPoint = this.pageLength;
  allVehicles = [];
  allAssets: any = [];
  wexCategories: any = {};
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  readonly rowHeight = 70;
  readonly headerHeight = 70;
  pageLimit = 10
  loaded = false;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private httpClient: HttpClient,
    private el: ElementRef) {
  }
  ngOnInit() {
    this.fetchVendorList();
    // this.fuelEntriesCount();
    this.fetchVehicleList();
    this.fetchAssetList();
    this.fetchWEXCode();
    //this.fetchFuelTypeList();
    //this.fetchCountries();
    this.fetchTripList();
    this.fetchDriverList();
    this.fetchAllAssets();
    this.fetchAllVehicles();

    this.fetchWexCategories();
    this.initDataTable();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }
  onScroll(offsetY) {
    const viewHeight =
      this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;

    if (
      offsetY + viewHeight + this.fuelList.length * this.rowHeight
    ) {
      let limit = this.pageLimit;
      if (this.fuelList.length === 0) {
        const pageSize = Math.ceil(viewHeight / this.rowHeight);

        limit = Math.max(pageSize, this.pageLimit);
      }
      if (this.loaded) {
        this.initDataTable();
      }
      this.loaded = false;
    }
  }
  setUnit(unitID, unitName) {
    this.unitName = unitName;
    this.unitID = unitID;
    this.suggestedUnits = [];
  }

  fetchWexCategories() {
    this.httpClient.get('assets/jsonFiles/fuel/wexCategories.json').subscribe((result: any) => {

      this.wexCategories = result;
    })
  }
  getSuggestions(value) {
    value = value.toLowerCase();
    if (value != '') {
      this.apiService
        .getData(`vehicles/suggestion/${value}`)
        .subscribe((result) => {
          result = result.Items;
          this.suggestedUnits = [];
          for (let i = 0; i < result.length; i++) {
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
    if (value != '') {
      this.apiService
        .getData(`assets/suggestion/${value}`)
        .subscribe((result) => {
          result = result.Items;
          for (let i = 0; i < result.length; i++) {
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
    this.apiService.getData('vendors').subscribe((result: any) => {

      result.forEach(element => {
        this.vendorList[element.contactID] = element.companyName

      });
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
    this.httpClient.get('assets/jsonFiles/fuel/wexFuelType.json').subscribe((result: any) => {

      result.forEach(element => {
        this.WEXCodeList[element.code] = element.type
      });
    });
  }
  // fuelEntriesCount() {
  //   this.apiService.getData('fuelEntries/get/count?unitID=' + this.unitID + '&from=' + this.start + '&to=' + this.end + '&asset=' + this.assetUnitID).subscribe({
  //     complete: () => { },
  //     error: () => { },
  //     next: (result: any) => {
  //       this.totalRecords = result.Count;

  //       if (this.unitID != null || this.start != '' || this.end != '' || this.assetUnitID != null) {
  //         this.fuelEndPoint = this.totalRecords;
  //       }

  //       this.initDataTable();
  //     },
  //   });
  // }

  showTopValues() {

    const data = {
      fromDate: this.fromDate,
      toDate: this.toDate
    };
    return;
  }

  // deleteFuelEntry(fuelID) {
  //   if (confirm('Are you sure you want to delete?') === true) {
  //     this.apiService
  //     .getData(`fuelEntries/isDeleted/${fuelID}/` + 1)
  //     .subscribe((result: any) => {
  //       this.fuelList = [];
  //       this.fuelEntriesCount();
  //       this.initDataTable();
  //       this.fuelDraw = 0;
  //       this.dataMessage = Constants.FETCHING_DATA;
  //       this.lastEvaluatedKey = '';
  //       this.toastr.success('Fuel Entry Deleted Successfully!');
  //     });
  //   }
  // }
  deleteFuelEntry(eventData) {
    if (confirm('Are you sure you want to delete?') === true) {
      // let record = {
      //   date: eventData.createdDate,
      //   time: eventData.createdTime,
      //   eventID: eventData.fuelID
      // }
      this.apiService.deleteData(`fuelEntries/delete/${eventData.fuelID}`).subscribe((result: any) => {

        this.fuelList = [];
        this.fuelDraw = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        //this.fuelEntriesCount();
        this.toastr.success('Fuel Entry Deleted Successfully!');
      });
    }
  }
  initDataTable() {
    this.spinner.show();
    this.apiService.getData('fuelEntries/fetch/records?unitID=' + this.unitID + '&from=' + this.start + '&to=' + this.end + '&asset=' + this.assetUnitID + '&lastKey=' + this.lastEvaluatedKey + '&timeCreated=' + this.lastTimeCreated).subscribe((result: any) => {
      if (result.Items.length == 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
      this.suggestedUnits = [];
      // this.getStartandEndVal();
      result[`Items`].forEach(element => {


        let date: any = moment(element.data.date)
        if (element.data.time) {
          let time = moment(element.data.time, 'h mm a')
          date.set({
            hour: time.get('hour'),
            minute: time.get('minute')
          })
          date = date.format('MMM Do YYYY, h:mm a')
        }
        else {
          date = date.format('MMM Do YYYY')
        }
        element.dateTime = date

        // element.fuelTime=moment(element.fuelTime).format('h:mm a')

      });
      console.log(result)


      this.fuelList = this.fuelList.concat(_.orderBy(result.Items, [(obj) => new Date(obj.data.date)], ['desc']))
      console.log(this.fuelList)

      if (result.LastEvaluatedKey.fuelSK !== undefined) {
        // for prev button
        this.lastEvaluatedKey = encodeURIComponent(result.LastEvaluatedKey.fuelSK)
        if (result.LastEvaluatedKey.timeCreated !== undefined) {
          this.lastTimeCreated = result.LastEvaluatedKey.timeCreated
        }
        this.loaded = true
      } else {
        this.lastEvaluatedKey = '';
      }
    })
  }

  searchFilter() {
    if (this.fromDate !== '' || this.toDate !== '' || this.unitID !== null || this.assetUnitID !== null) {
      if (this.fromDate !== '') {
        this.start = this.fromDate;
      }
      if (this.toDate !== '') {
        this.end = this.toDate;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.fuelList = [];
      this.lastEvaluatedKey = ''
      this.initDataTable();
      //this.fuelEntriesCount();
    } else {
      return false;
    }
  }

  resetFilter() {
    this.unitID = null;
    this.fromDate = '';
    this.toDate = '';
    this.assetUnitID = null;
    this.start = '';
    this.end = '';
    this.dataMessage = Constants.FETCHING_DATA;
    this.fuelList = [];
    this.initDataTable();
    //this.fuelEntriesCount();
    //this.resetCountResult();

  }

  // getStartandEndVal() {
  //   this.fuelStartPoint = this.fuelDraw * this.pageLength + 1;
  //   this.fuelEndPoint = this.fuelStartPoint + this.pageLength - 1;
  // }

  // next button func
  nextResults() {
    this.fuelNext = true;
    this.fuelPrev = true;
    this.fuelDraw += 1;
    this.initDataTable();
    //this.getStartandEndVal();
  }

  // prev button func
  prevResults() {
    this.fuelNext = true;
    this.fuelPrev = true;
    this.fuelDraw -= 1;
    this.lastEvaluatedKey = this.fuelPrevEvauatedKeys[this.fuelDraw];
    this.initDataTable();
    //this.getStartandEndVal();
  }

  resetCountResult() {
    this.fuelStartPoint = 1;
    this.fuelEndPoint = this.pageLength;
    this.fuelDraw = 0;
  }

  fetchAllVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.allVehicles = result.Items;
    });
  }

  fetchAllAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      result.Items.forEach((e: any) => {
        if (e.assetType == 'reefer') {
          let obj = {
            assetID: e.assetID,
            assetIdentification: e.assetIdentification
          };
          this.allAssets.push(obj);
        }
      });
    });
  }

  refreshData() {
    this.unitID = null;
    this.fromDate = '';
    this.toDate = '';
    this.assetUnitID = null;
    this.start = '';
    this.end = '';
    this.lastEvaluatedKey = '';
    this.dataMessage = Constants.FETCHING_DATA;
    this.fuelList = [];
    // this.fuelEntriesCount();
    this.resetCountResult();
  }
}
