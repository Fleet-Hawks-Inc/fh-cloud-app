import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-service-program-list',
  templateUrl: './service-program-list.component.html',
  styleUrls: ['./service-program-list.component.css'],
})
export class ServiceProgramListComponent implements OnInit {
  title = 'Service Program List';
  dtOptions: any = {};
  programs;

  programeName = '';

  constructor(
      private apiService: ApiService,
      private router: Router,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService
    ) {}

  ngOnInit() {
    this.fetchPrograms();
  }

  fetchPrograms() {
    this.spinner.show(); // loader init
    this.apiService.getData(`servicePrograms?programeName=${this.programeName}`).subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        this.programs = result.Items;
        console.log('this.programs', this.programs);
        this.spinner.hide(); // loader hide
      },
    });
  }

  deleteProgram(programId) {
    /******** Clear DataTable ************/
    // if ($.fn.DataTable.isDataTable('#datatable-default')) {
    //   $('#datatable-default').DataTable().clear().destroy();
    // }
    /******************************/
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .deleteData('servicePrograms/' + programId)
      .subscribe((result: any) => {
        this.fetchPrograms();
        this.toastr.success('Successfully Deleted');
      });
    }
    
  }

  // initDataTable() {
  //   timer(200).subscribe(() => {
  //     $('#datatable-default').DataTable();
  //   });
  // }

  initDataTable() {
    this.dtOptions = {
      searching: false,
      dom: 'Bfrtip', // lrtip to hide search field
      processing: true,
      
      buttons: [
        'colvis',
        'excel',
      ],
    };
  }
}
