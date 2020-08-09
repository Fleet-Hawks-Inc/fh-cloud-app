import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';


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
  countryName: any = '';
  formattedFromDate: any = '';
  formattedToDate: any = '';
  fuelLists;
  defaultBindingsList = [
    { value: 1, label: 'Vilnius' },
    { value: 2, label: 'Kaunas' },
    { value: 3, label: 'Pavilnys' }
  ];
  constructor(
    private apiService: ApiService,
    private route: Router,
    private parserFormatter: NgbDateParserFormatter,
    private datePipe: DatePipe) {
  }
  ngOnInit() {
    this.fuelEntries();
    this.fetchVehicles();
    this.fetchCountries();
  }
  // Select All Checkboxes
  selectAllCheckbox() {

    $('.fuel_checkbox').prop('checked', $('#mainCheckbox').prop('checked'));
  }

  // For checking number of checked checkboxes for Edit operation
  checkBoxesLength() {
    const c1 = $('.fuel_checkbox:checked').length;
    if (c1 === 1) {
      this.entryId = $('.fuel_checkbox:checked').val();
      this.route.navigateByUrl('/fleet/expenses/fuel/Edit-Fuel-Entry/' + this.entryId);
    } else {
      alert('Select One Option for Editing');
    }
  }
  // For Delete Operation
  checkBoxesLengthDel() {

    const delcheckbox = $('.fuel_checkbox:checked').map(() => {
      return $(this).val();
    }).toArray();

    for (let i = 0; i <= delcheckbox.length; i++) {
      this.deleteFuelEntry(delcheckbox[i]);
    }
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fuelEntries() {
    this.apiService.getData('fuelEntries').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        console.log(result);
        this.fuelLists = result.Items;
        console.log(this.fuelLists);
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
  // getCountryName(ID){
  //  this.countryName  = this.countries.filter(function (el) {

  //     if(el.countryID  == ID){
  //       return  el.countryName;
  //     }
  //   });


  // }
  showTopValues() {

    const data = {
      fromDate: this.fromDate,
      toDate: this.toDate
    };
    console.log(this.formattedToDate);
    return;
  }

  deleteFuelEntry(assetId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData('fuelEntries/' + assetId)
      .subscribe((result: any) => {
        this.fuelEntries();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }


}
