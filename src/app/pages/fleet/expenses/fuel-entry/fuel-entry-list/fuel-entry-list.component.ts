import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
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
  // fromDate: NgbDateStruct;
  // toDate: NgbDateStruct;
  fromDate: any = '';
  toDate: any = '';
  entryId = '';
  vehicles = [];
  vehicleList: any;
  tripList: any;
  assetList: any;
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
  // dtOptions: any = {};
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
    private route: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
  }
  ngOnInit() {
    this.fuelEntries();
    this.fetchVehicleList();
    this.fetchAssetList();
    this.fetchCountries();
    this.fetchTripList();
    this.initDataTable()
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
    this.suggestedUnits = [];
    this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        result = result.Items;

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
  fetchTripList() {
    this.apiService.getData('trips/get/list').subscribe((result: any) => {
      this.tripList = result;
    });
  }
  fuelEntries() {
    this.spinner.show(); // loader init
    this.apiService.getData(`fuelEntries`).subscribe({
      complete: () => {},
      error: () => { },
      next: (result: any) => {
        this.spinner.hide(); // loader hide
        // this.fuelList = result.Items; 
        this.totalRecords = result.Count;
      },
    });
    this.unitID = '';
  }
  getVehicleName(ID) {
    const vehicleName: any = this.vehicles.filter( (el) => {
      return el.vehicleID === ID;
    });
    return vehicleName.vehicleName;
  }
  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
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
      columnDefs: [ //sortable false
        { "targets": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32], "orderable": false },
      ],
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('fuelEntries/fetch-records?unitID='+this.unitID+'&from='+this.start+'&to='+this.end+ '&lastKey=' + this.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
          current.fuelList = resp['Items'];
          // current.fetchRenewals();
          // console.log(resp)
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
        console.log(this.start)
      }
      if(this.toDate !== '') {
        this.end = this.toDate.split('-').reverse().join('-');
        console.log(this.end)
      }
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
      this.rerender();
    } else {
      return false;
    }
  }
}
