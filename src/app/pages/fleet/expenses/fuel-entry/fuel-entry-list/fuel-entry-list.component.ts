import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';


declare var $: any;

@Component({
  selector: 'app-fuel-entry-list',
  templateUrl: './fuel-entry-list.component.html',
  styleUrls: ['./fuel-entry-list.component.css'],
  providers: [DatePipe]
})
export class FuelEntryListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

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

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService) {
  }
  ngOnInit() {
    this.fuelEntriesCount();
    this.fetchVehicleList();
    this.fetchAssetList();
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
  }

  getAssetsSugg(value) {
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
      if(this.suggestedUnits.length == 0){
        this.unitID = '';
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
  // fuelEntries() {
  //   this.spinner.show(); // loader init
  //   this.apiService.getData('fuelEntries?unitID='+this.unitID+'&from='+this.start+'&to='+this.end).subscribe({
  //     complete: () => {},
  //     error: () => { },
  //     next: (result: any) => {
  //       this.spinner.hide(); // loader hide
  //       // this.fuelList = result.Items;
  //       this.totalRecords = result.Count;
  //     },
  //   });
  //   this.unitID = '';
  // }

  fuelEntriesCount() {
    this.apiService.getData('fuelEntries/get/count?unitID= ' + this.unitID + '&from=' +  this.start + '&to=' + this.end).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
        console.log('result', result);
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
      .getData(`fuelEntries/isDeleted/${entryID}/`+1)
      .subscribe((result: any) => {

        this.fuelList = [];
        this.fuelEntriesCount();
        this.rerender();
        this.toastr.success('Fuel Entry Deleted Successfully!');
      });
    }
  }

  initDataTable() {
    let current = this;
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ // sortable false
        { 'targets': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 'orderable': false },
      ],
      dom: 'lrtip',
      language: {
        'emptyTable': 'No records found'
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('fuelEntries/fetch-records?unitID='+this.unitID+'&from='+this.start+'&to='+this.end+ '&lastKey=' + this.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
          current.fuelList = resp['Items'];
          console.log('current.fuelList',current.fuelList);
          if (resp['LastEvaluatedKey'] !== undefined) {
            this.lastEvaluatedKey = resp['LastEvaluatedKey'].entryID;

          } else {
            this.lastEvaluatedKey = '';
          }

          callback({
            recordsTotal: current.totalRecords,
            recordsFiltered: current.totalRecords,
            data: []
          });
        });
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(status = ''): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      if (status === 'reset') {
        this.dtOptions.pageLength = this.totalRecords;
      } else {
        this.dtOptions.pageLength = 10;
      }
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  searchFilter() {
    if (this.unitID !== '' || this.fromDate !== '' || this.toDate !== '' || this.unitName !== '') {
      if(this.fromDate !== '') {
        this.start = this.fromDate.split('-').reverse().join('-');
      }
      if(this.toDate !== '') {
        this.end = this.toDate.split('-').reverse().join('-');
      }

      this.fuelList = [];
      this.fuelEntriesCount();
      this.rerender('reset');
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
      this.rerender();
    } else {
      return false;
    }
  }
}
