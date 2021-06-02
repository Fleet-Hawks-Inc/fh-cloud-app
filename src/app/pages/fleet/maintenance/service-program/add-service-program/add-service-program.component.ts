import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ApiService, ListService} from '../../../../../services';
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
  vehicleModal: boolean = false;
  vehicles: any;
  tasks: any;
  programID = '';
  serviceData = {
    // programID: '',
    programName: '',
    description: '',
    vehicles: [],
    unselectedVehicles: [],
    serviceScheduleDetails: [{
      serviceTask: '',
      repeatByTime: '',
      repeatByTimeUnit: '',
      repeatByOdometer: '',
    }]
  };

  taskData = {
    taskType: 'service',
    taskName: '',
    description: '',

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

  selectedVehicles = [];
  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private listService: ListService
  ) {}


  ngOnInit() {
    this.programID = this.route.snapshot.params['programID'];
    if (this.programID) {
      this.pageTitle = 'Edit Service Program';
      this.fetchServiceByID();
    } else {
      this.pageTitle = 'New Service Program';
    }
    // this.fetchVehicles();
    this.listService.fetchTasks();
    this.listService.fetchVehicles();
    $(document).ready(() => {
      this.form = $('#form_, #form1_').validate();
    });

    this.tasks =  this.listService.tasksList;
    this.vehicles = this.listService.vehicleList;
  }


  ngAfterViewInit() {

  }

  addDocument() {
    this.serviceData.serviceScheduleDetails.push({
      serviceTask: '',
      repeatByTime: '',
      repeatByTimeUnit: '',
      repeatByOdometer: '',
    })

  }
  addServiceProgram() {

    this.hideErrors();
    this.apiService.postData('servicePrograms', this.serviceData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              // this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
        next: (res) => {
          this.response = res;
          this.toastr.success('Service added successfully');
          this.router.navigateByUrl('/fleet/maintenance/service-program/list');

        }
      });
  }

  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe({
      error: () => {},
      next: (result: any) => {
        this.vehicles = result.Items;
      },
    });
  }

  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error')
      });
    // this.vehicleForm.showErrors(this.errors);
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label')
      });
    this.errors = {};
  }

  fetchServiceByID() {
    // this.spinner.show(); // loader init
    this.apiService
      .getData('servicePrograms/' + this.programID)
      .subscribe((result: any) => {
        result = result.Items[0];

        this.serviceData['programID']= this.programID;
        this.serviceData.programName = result.programName;
        this.serviceData.description = result.description;
        this.serviceData.vehicles = result.vehicles;
        this.selectedVehicles = result.vehicles;
        let newTasks = [];
        for (var i = 0; i < result.serviceScheduleDetails.length; i++) {
          newTasks.push({
            serviceTask: result.serviceScheduleDetails[i].serviceTask,
            repeatByTime: result.serviceScheduleDetails[i].repeatByTime,
            repeatByTimeUnit: result.serviceScheduleDetails[i].repeatByTimeUnit,
            repeatByOdometer: result.serviceScheduleDetails[i].repeatByOdometer,
          });
        }
        this.serviceData.serviceScheduleDetails = newTasks;
        this.spinner.hide(); // hide loader
      });
  }

  /*
   * Update Service Program
  */
 updateServiceProgram() {
  this.hasError = false;
  this.hasSuccess = false;

  this.apiService.putData('servicePrograms', this.serviceData).subscribe({
    complete: () => { },
    error: (err) => {
      from(err.error)
        .pipe(
          map((val: any) => {
            // We Can Use This Method
            const key = val.message.match(/'([^']+)'/)[1];

            val.message = val.message.replace(/'.*'/, 'This Field');
            this.errors[key] = val.message;
          })
        )
        .subscribe({
          complete: () => {
            // this.throwErrors();
          },
          error: () => { },
          next: () => { },
        });
    },
    next: (res) => {
      this.response = res;
      this.hasSuccess = true;
      this.toastr.success('Service Updated Successfully');
      this.router.navigateByUrl('/fleet/maintenance/service-program/list');
    },
  });
}

  removeTasks(i) {
    this.serviceData.serviceScheduleDetails.splice(i, 1);
  }

  vehicleChange(vehicle) {
    console.log('this.se', this.serviceData.vehicles)
    if (this.selectedVehicles.includes(vehicle.value) ){
      this.serviceData.unselectedVehicles.push(vehicle.value)
    }
    console.log('this.se', this.serviceData.unselectedVehicles)
  }
}
