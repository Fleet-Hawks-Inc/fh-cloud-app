import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


declare var $: any;

@Component({
  selector: 'app-fuel-entry-list',
  templateUrl: './fuel-entry-list.component.html',
  styleUrls: ['./fuel-entry-list.component.css'],
  providers: [DatePipe]
})
export class FuelEntryListComponent implements OnInit {
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
  fuelList;
  dtOptions: any = {};
  suggestedVehicles = [];
  vehicleID = '';
  amount = '';
  vehicleIdentification = '';

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
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }
  setVehicle(vehicleID, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleID = vehicleID;
    this.suggestedVehicles = [];
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
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
  fetchAssetList() {
    this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetList = result;
      console.log('asset list', this.assetList);
    });
  }
  fetchTripList() {
    this.apiService.getData('trips/get/list').subscribe((result: any) => {
      this.tripList = result;
    });
  }
  fuelEntries() {
    this.apiService.getData(`fuelEntries?amount=${this.amount}&from=${this.fromDate}&to=${this.toDate}`).subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        console.log(result);
        this.fuelList = result.Items;
        console.log('Fuel data', this.fuelList);
      },
    });
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
    console.log(this.formattedToDate);
    return;
  }
  deleteFuelEntry(entryID) {
    this.apiService
      .deleteData('fuelEntries/' + entryID)
      .subscribe((result: any) => {
     //   this.spinner.show();
        this.fuelEntries();
        this.toastr.success('Fuel Entry Deleted Successfully!');
      });
  }

  initDataTable() {
    this.dtOptions = {
      dom: 'lrtip', // lrtip to hide search field
      processing: true,
      columnDefs: [
          {
              targets: 0,
              className: 'noVis'
          },
          {
              targets: 1,
              className: 'noVis'
          },
          {
              targets: 2,
              className: 'noVis'
          },
          {
              targets: 3,
              className: 'noVis'
          },
          {
              targets: 4,
              className: 'noVis'
          }
      ],
      colReorder: {
        fixedColumnsLeft: 1
      },
      buttons: [
        'colvis',
      ],
    };
  }


}
