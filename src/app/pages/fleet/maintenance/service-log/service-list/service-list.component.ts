import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  title = 'Service Logs';
  logs = [];

  suggestedVehicles = [];
  vehicleID = '';
  currentStatus = '';
  vehicleIdentification = '';

  constructor(
      private apiService: ApiService,
      private router: Router,
      private spinner: NgxSpinnerService
    ) {}

  ngOnInit() {
    this.fetchLogs();
  }

  getSuggestions(value) {
    this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedVehicles = result.Items;
        if(this.suggestedVehicles.length == 0){
          this.vehicleID = '';
        }
      });
  }

  setVehicle(vehicleID, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleID = vehicleID;

    this.suggestedVehicles = [];
  }


  fetchLogs() {
    this.spinner.show(); // loader init
    this.apiService.getData(`serviceLogs?vehicleID=${this.vehicleID}`).subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        this.logs = result.Items;
        console.log('this.logs', this.logs);
        this.spinner.hide(); // loader hide
      },
    });
  }

  deleteProgram(logId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData('servicePrograms/' + logId)
      .subscribe((result: any) => {
        this.fetchLogs();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }

}
