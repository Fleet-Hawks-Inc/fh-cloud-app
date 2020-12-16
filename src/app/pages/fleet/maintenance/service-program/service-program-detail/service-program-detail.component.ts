import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../../../services';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import {Title} from "@angular/platform-browser";
declare var $: any;

@Component({
  selector: 'app-service-program-detail',
  templateUrl: './service-program-detail.component.html',
  styleUrls: ['./service-program-detail.component.css']
})
export class ServiceProgramDetailComponent implements OnInit {
  Title = 'Add';
  allVehicles = [];
  private programs;
  private vehicles;
  private programID;
  private tasks;
  programData = {};
  vehicleData = [];
  errors: any;
  form;
  vehiclesObject: any = {};

  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.programID = this.route.snapshot.params['programID'];
    this.fetchProgramByID();
    this.fetchAllVehiclesIDs();
    this.fetchAllVehicles();

    $(document).ready(() => {
      this.form = $('#vehicleForm, #taskForm').validate();
    });
  }

  fetchProgramByID() {
    this.spinner.show(); // loader init
    this.apiService.getData(`servicePrograms/${this.programID}`).subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        console.log(result);
        this.programs = result.Items;
        this.vehicles = this.programs[0]['vehicles'];
        this.tasks = this.programs[0]['serviceScheduleDetails'];
        this.spinner.hide(); // loader hide
      },
    });
  }

  remove(arr, i) {
    if (arr === 'task') {
      if (confirm('Are you sure you want to delete?') === true) {
        this.tasks.splice(i, 1);
        this.updateServiceProgram();
      }
    } else {
      if (confirm('Are you sure you want to delete?') === true) {
        this.vehicles.splice(i, 1);
        this.updateServiceProgram();
        this.fetchAllVehicles();
      }
    }
  }

  /*
   * Update Service Program
  */
  updateServiceProgram() {
      // console.log('this.programs', this.programs);
      let newProgram = Object.assign({}, ...this.programs);
      delete newProgram.carrierID;
      delete newProgram.timeModified;
      // console.log('newProgram', newProgram);
      
      this.apiService.putData('servicePrograms', newProgram).subscribe({
        complete: () => { },
        error: (err) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                const path = val.path;
                // We Can Use This Method
                const key = val.message.match(/'([^']+)'/)[1];
                console.log(key);
                val.message = val.message.replace(/'.*'/, 'This Field');
                this.errors[key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.toastr.success('Service Updated Successfully');
          $('#editServiceScheduleModal').modal('hide');
        },
      });
  

  }

  throwErrors() {
    console.log(this.errors);
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
    // this.vehicleForm.showErrors(this.errors);
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label');
      });
    this.errors = {};
  }
  
  editTask(task, i) {
    console.log('edittask', task);
    this.Title = 'Edit';
    $('#editServiceScheduleModal').modal('show');

    console.log('programs', this.programs);
    this.programData['serviceTask'] = task.serviceTask;
    this.programData['repeatByTime'] = task.repeatByTime;
    this.programData['repeatByTimeUnit'] = task.repeatByTimeUnit;
    this.programData['repeatByOdometer'] = task.repeatByOdometer;

    this.programs[0].serviceScheduleDetails[i] = this.programData;
  }

  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/get/list')
      .subscribe((result: any) => {
        this.vehiclesObject = result;
      });
  }

  fetchAllVehicles() {
    this.apiService.getData('vehicles')
      .subscribe((result: any) => {
        this.allVehicles = [];
        this.updateVehicles(result.Items, this.programs[0].vehicles);
        // console.log('allVehicle', this.allVehicles);
      });
  }

  updateVehicles(vehiclesArr, serviceArr) {
    vehiclesArr.filter(element => {
      if (!serviceArr.includes(element.vehicleID)) {
        // console.log('not includes');
        this.allVehicles.push(element);
      }
    });
  }
  addServiceProgram() {
    // console.log('prog', this.programData);
    this.programs[0].serviceScheduleDetails.push(this.programData);
    this.updateServiceProgram();
    $('#editServiceScheduleModal').modal('hide');
  }

  addVehicle() {
    this.vehicleData.filter(element => {
      if (!this.programs[0].vehicles.includes(element)) {
        // console.log('element', element);
        this.programs[0].vehicles.push(element);
        $('#addVehicleModal').modal('hide');
        this.fetchAllVehicles();
      };
    });
    this.vehicleData = [];
    this.updateServiceProgram();
  }
}
