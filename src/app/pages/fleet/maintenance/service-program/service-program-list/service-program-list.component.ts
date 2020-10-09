import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-service-program-list',
  templateUrl: './service-program-list.component.html',
  styleUrls: ['./service-program-list.component.css'],
})
export class ServiceProgramListComponent implements OnInit {
  title = 'Service Program List';
  programs;

  constructor(
      private apiService: ApiService,
      private router: Router,
      private spinner: NgxSpinnerService
    ) {}

  ngOnInit() {
    this.fetchPrograms();
  }

  fetchPrograms() {
    this.spinner.show(); // loader init
    this.apiService.getData('servicePrograms').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.programs = result.Items;
        this.spinner.hide(); // loader hide
      },
    });
  }

  deleteProgram(programId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData('servicePrograms/' + programId)
      .subscribe((result: any) => {
        this.fetchPrograms();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
