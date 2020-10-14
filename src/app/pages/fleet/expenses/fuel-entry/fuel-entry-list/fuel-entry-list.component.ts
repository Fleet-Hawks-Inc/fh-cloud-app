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
  constructor(
    private apiService: ApiService,
    private route: Router,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
  }
  ngOnInit() {
    this.fuelEntries();
    // this.fetchVehicles();
    this.fetchCountries();
  }

  // fetchVehicle(ID) {
  //   this.apiService.getData('vehicles/' + ID).subscribe((result: any) => {
  //     this.vehicles = result.Items;
  //     return this.vehicles[0].vehicleName;
  //   });
  // }
  fuelEntries() {
    this.apiService.getData('fuelEntries').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        console.log(result);
        this.fuelList = result.Items;
        console.log(this.fuelList);
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
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/
    this.apiService
      .deleteData('fuelEntries/' + entryID)
      .subscribe((result: any) => {
     //   this.spinner.show();
        this.fuelEntries();
        this.toastr.success('Fuel Entry Deleted Successfully!');        
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }


}
