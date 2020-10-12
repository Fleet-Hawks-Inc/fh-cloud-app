import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ApiService} from '../../../../../services';
import { map} from 'rxjs/operators';
import {from} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;


@Component({
  selector: 'app-add-service-program',
  templateUrl: './add-service-program.component.html',
  styleUrls: ['./add-service-program.component.css']
})
export class AddServiceProgramComponent implements OnInit, AfterViewInit {
  pageTitle: string;
  private vehicles;
  private programID;
  meterText = 'Miles';
  serviceData = {
    serviceScheduleDetails: {}
  };

  errors = {};
  form;

  /********** Form Fields ***********/

  // programName ='';
  // repeatByTime = '';
  // repeatByOdometer = '';
  // description = '';

  /******************/

  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}


  ngOnInit() {
    this.programID = this.route.snapshot.params['programID'];
    if (this.programID) {
      this.pageTitle = 'Edit Service Program';
      this.fetchServiceByID();
    } else {
      this.pageTitle = 'New Service Program';
    }
    this.fetchVehicles();
  }


  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  addServiceProgram() {
    console.log('service program', this.serviceData);
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    this.apiService.postData('servicePrograms', this.serviceData).subscribe({
        complete : () => {},
        error: (err) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                const path = val.path;
                // We Can Use This Method
                const key = val.message.match(/'([^']+)'/)[1];
                // console.log(key);
                // this.errors[key] = val.message;
                // Or We Can Use This One To Extract Key
                // const key = this.concatArray(path);
                // this.errors[this.concatArray(path)] = val.message;
                // if (key.length === 2) {
                // this.errors[val.context.key] = val.message;
                // } else {
                // this.errors[key] = val.message;
                // }
                val.message = val.message.replace(/'.*'/, 'This Field');
                this.errors[key] = val.message;
                // console.log(this.errors);
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
              },
              error: () => {},
              next: () => {},
            });
        },
        next: (res) => {
          // this.programName = '';
          // this.repeatByTime = '';
          // this.repeatByOdometer = '';
          // this.description = '';
          this.response = res;
          this.hasSuccess = true;
          // this.Success = 'Service Program Added successfully';
          this.toastr.success('Service added successfully');
          this.router.navigateByUrl('/fleet/maintenance/service-program/service-program-list');

        }
      });
  }

  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe({
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.vehicles = result.Items;
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  fetchServiceByID() {
    this.spinner.show(); // loader init
    this.apiService
      .getData('servicePrograms/' + this.programID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('result', result);
        this.serviceData['programName'] = result.programName;
        this.serviceData['description'] = result.description;
        this.serviceData.serviceScheduleDetails['repeatByTime'] = result.repeatByTime;
        this.serviceData.serviceScheduleDetails['repeatByTimeUnit'] = result.repeatByTimeUnit;
        this.serviceData.serviceScheduleDetails['repeatByOdometer'] = result.repeatByOdometer;
        
        this.serviceData.serviceScheduleDetails['serviceTasks'] = result.serviceTasks[0];
        this.spinner.hide(); // hide loader
      });
  }
  // addTasks() {
  //   $('.add-more').on('click', () => {
  //     let abc = $('.services-task__wrap').next('.row').clone();
  //     $('.services-task__wrap').append(abc);
  //   });
  // }

  // removeTasks(i) {
  //   console.log(this.serviceData.serviceScheduleDetails.length);
  //   this.serviceData.serviceScheduleDetails.splice(i, 1);
  // }


}
