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
  editFuelEntry = () => {
    if (this.fuelCheckCount === 1) {
      this.router.navigateByUrl('/fleet/expenses/fuel/Edit-Fuel-Entry/' + this.selectedEntryID);
    } else {
      this.toastr.error('Please select only one entry!');
    }
  }
  // deleteFuelEntry = () => {
  //   const selectedEntries = this.fuelList.filter((product: any) => product.checked).map((p: any) => p.entryID);
  //   if (selectedEntries && selectedEntries.length > 0) {
  //     for (const i of selectedEntries) {
  //       this.apiService.deleteData('fuelEntries/' + i).subscribe((result: any) => {
  //         this.fuelEntries();
  //         this.toastr.success('Fuel Entry Deleted Successfully!');
  //       });
  //     }
  //   }
  // }
 // Count Checkboxes
 checkboxCount = (arr) => {
  this.fuelCheckCount = 0;
  arr.forEach(item => {
    console.log('item', item);
    console.log('array', arr);
    if (item.checked === true) {
      this.selectedEntryID = item.entryID;
      this.fuelCheckCount = this.fuelCheckCount + 1;
      console.log('check', arr.length, this.fuelCheckCount);
      if (arr.length === this.fuelCheckCount) {
        this.headCheckbox = true;
      }
    } else {
      this.headCheckbox = false;
    }
  });
}
// checked-unchecked all checkboxes
checkuncheckall = (ev) => {
  if (ev.target.checked === true) {
    this.isChecked = true;
  } else {
    this.isChecked = false;
  }
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
