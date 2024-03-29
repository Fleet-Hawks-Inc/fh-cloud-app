import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, ListService } from '../../../../../services';
import { NgForm } from "@angular/forms";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil
} from "rxjs/operators";
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalService } from "../../../../../services/modal.service";
import { RouteManagementServiceService } from "src/app/services/route-management-service.service";
import { UnsavedChangesComponent } from 'src/app/unsaved-changes/unsaved-changes.component';

declare var $: any;


@Component({
  selector: 'app-add-service-program',
  templateUrl: './add-service-program.component.html',
  styleUrls: ['./add-service-program.component.css']
})
export class AddServiceProgramComponent implements OnInit, AfterViewInit {
 @ViewChild('serviceProgramF') serviceProgramF: NgForm;
  takeUntil$ = new Subject();
  isSubmitted = false;
  pageTitle: string;
  vehicleModal: boolean = false;
  vehicles: any;
  tasks: any;
  programID = [];
  taskData: any = []
  sessionID: string;
  serviceData = {
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

  errors = {};
  form;






  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  submitDisabled = false;
  Error: string = '';
  Success: string = '';
  public programId;
  selectedVehicles = [];
  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private listService: ListService,
    private modalService: NgbModal,
    private modalServiceOwn: ModalService,
    private routerMgmtService: RouteManagementServiceService,
  ) { 
   
    this.sessionID = this.routerMgmtService.serviceLogSessionID;


  }
 


  async ngOnInit() {
    this.programID = this.route.snapshot.params['programID'];
    if (this.programID) {
      this.pageTitle = 'Edit Service Program';
      await this.fetchServiceByID();
    } else {
      this.pageTitle = 'New Service Program';
    }
    // this.fetchVehicles();
    this.listService.fetchTasks();
    this.listService.fetchVehicles();
    $(document).ready(() => {
      this.form = $('#form_, #form1_').validate();
    });

    this.taskData = this.listService.tasksList;
    let vehicleList = new Array<any>();
    this.getValidVehicles(vehicleList);
    this.vehicles = vehicleList;
    this.programId = this.route.snapshot.params['programId'];
    this.fetchServiceByID();
  }

  private getValidVehicles(vehicleList: any[]) {
    let ids = [];
    this.listService.vehicleList.forEach((element) => {
      element.forEach((element2) => {
        if (
          element2.vehicleIdentification &&
          element2.isDeleted === 1
        ) {
          if (this.selectedVehicles.includes(element2.vehicleID)) {
            let index = this.selectedVehicles.indexOf(element2.vehicleID);
            this.serviceData.vehicles.splice(index, 1);
          }
        }
        if (
          element2.vehicleIdentification &&
          element2.isDeleted === 0 &&
          !ids.includes(element2.vehicleID)
        ) {
          vehicleList.push(element2);
          ids.push(element2.vehicleID);
        }
      });
    });
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
    this.submitDisabled = true;
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
              this.throwErrors();
              this.submitDisabled = false;
            },
            error: () => {
              this.submitDisabled = true;
            },
            next: () => {

            },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;

        this.toastr.success('Service added successfully');
        this.router.navigateByUrl('/fleet/maintenance/service-program/list/${this.routerMgmtService.serviceLogUpdated()}');

      }
    });
  }

  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe({
      error: () => { },
      next: (result: any) => {
        this.vehicles = result.Items;
      },
    });
  }

  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        if (v === 'programName') {
          $('[name="' + v + '"]')
            .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
            .addClass('error')
        }
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
  async fetchServiceByID() {
    // this.spinner.show(); // loader init
    let result: any = await this.apiService
      .getData('servicePrograms/' + this.programID).toPromise();
    // .subscribe((result: any) => {
    result = result[0];
    this.serviceData['programID'] = this.programID;
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
  }

  /*
   * Update Service Program
  */
  updateServiceProgram() {
    this.hasError = false;
    this.hasSuccess = false;
    this.submitDisabled = true;
    this.apiService.putData(`servicePrograms/${this.programID}`, this.serviceData).subscribe({
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
              this.submitDisabled = false;
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.submitDisabled = false;
  
        this.toastr.success('Service Updated Successfully');
        this.router.navigateByUrl('/fleet/maintenance/service-program/list/${this.routerMgmtService.serviceLogUpdated()}');
      },
    });
  }

  removeTasks(i) {
    this.serviceData.serviceScheduleDetails.splice(i, 1);
  }

  vehicleChange(vehicle) {
    if (this.selectedVehicles.includes(vehicle.value)) {
      this.serviceData.unselectedVehicles.push(vehicle.value)
    }
  }

  getTasks() {
    this.listService.fetchTasks();
  }

  refreshVehicleData() {
    this.listService.fetchVehicles();
  }
}
