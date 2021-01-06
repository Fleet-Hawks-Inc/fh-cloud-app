import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
@Component({
  selector: 'app-e-manifests',
  templateUrl: './e-manifests.component.html',
  styleUrls: ['./e-manifests.component.css']
})
export class EManifestsComponent implements OnInit {
 activeDiv = 'ace';
 countries = [];
 ACEList = [];
 ACIList = [];
 vehiclesList: any = {};
  assetsList: any = {};
  driversList: any = {};
  consigneesList: any = {};
   constructor(  private apiService: ApiService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchCountries();
    this.ACEEntries();
    this.ACIEntries();
    this.fetchVehiclesList();
    this.fetchAssetsList();
    this.fetchDriversList();
    this.fetchConsigneesList();
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
      console.log('this.driversList ',this.driversList );
    });
  }
  fetchConsigneesList() {
    this.apiService.getData('receivers/get/list').subscribe((result: any) => {
      this.consigneesList = result;
      console.log('this.consigneesList ',this.consigneesList );
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
      error: () => { },
      next: (result: any) => {
        this.ACEList = result.Items;
        console.log('drivers',this.ACEList[0].drivers);
      },
    });
  }
  deleteACEEntry(entryID) {
    this.apiService
      .deleteData('ACEeManifest/' + entryID)
      .subscribe((result: any) => {
     //   this.spinner.show();
        this.ACEEntries();
        this.toastr.success('ACE eManifest Entry Deleted Successfully!');
      });
  }
  ACIEntries() {
    this.apiService.getData('ACIeManifest').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        this.ACIList = result.Items;
        console.log('ACI data', this.ACIList);
      },
    });
  }
  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
  deleteACIEntry(entryID) {
    this.apiService
      .deleteData('ACIeManifest/' + entryID)
      .subscribe((result: any) => {
     //   this.spinner.show();
        this.ACIEntries();
        this.toastr.success('ACI eManifest Entry Deleted Successfully!');
      });
  }
}
