import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import Constants from '../../../constants';
declare var $: any;
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  public remindersData = [];
  // dtOptions: any = {};
  vehicles = [];
  reminderIdentification = '';
  reminderID = '';
  task: string;
  vehicleList: any = {};
  groups: any = {};
  serviceLogs: any = [];
  allRemindersData = [];
  vehicleIdentification = '';
  unitID = '';
  unitName = '';
  suggestedUnits = [];
  currentDate = moment().format('YYYY-MM-DD');
  currentOdometer = 1500;
  taskName: string;
  newData = [];
  suggestedVehicles = [];
  vehicleID = null;
  serviceTasks = [];
  tasksList = [];
  searchServiceTask = null;
  filterStatus = null;
  inServiceOdometer: string;
  myMath = 'Math';
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  serviceNext = false;
  servicePrev = true;
  serviceDraw = 0;
  servicePrevEvauatedKeys = [''];
  serviceStartPoint = 1;
  serviceEndPoint = this.pageLength;
  allVehicles: any = [];
  users = [];
  loaded = false
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getRemindersCount();
    this.fetchTasksList();
    this.fetchVehicleList();
    this.fetchServiceTaks();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }

  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }

  fetchTasksList() {
    this.apiService.getData('tasks/get/list').subscribe((result: any) => {
      this.tasksList = result;
    });
  }

  setFilterStatus(val) {
    this.filterStatus = val;
  }

  fetchServiceTaks() {
    let test = [];
    this.apiService.getData('tasks').subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === 'service');
    });
  }

  resolveReminder(unitID) {
    let unitType = 'vehicle';
    const unit = {
      unitID: unitID,
      unitType: unitType,
    };
    window.localStorage.setItem('reminderUnitID', JSON.stringify(unit));
    this.router.navigateByUrl('/fleet/maintenance/service-log/add-service');
  }

  deleteReminder(eventData) {
    if (confirm('Are you sure you want to delete?') === true) {
      let record = {
        date: eventData.createdDate,
        time: eventData.createdTime,
        eventID: eventData.reminderID,
        type: eventData.type
      }
      this.apiService.deleteData(`reminders/delete/${eventData.reminderID}/${eventData.type}`).subscribe((result: any) => {
        this.remindersData = [];
        this.serviceDraw = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        this.getRemindersCount();
        this.toastr.success('Service Reminder Deleted Successfully!');
      });
    }
  }

  getRemindersCount() {
    this.apiService.getData('reminders/get/count?reminderIdentification=' + this.vehicleID + '&serviceTask=' + this.searchServiceTask + '&status=' + this.filterStatus + '&reminderType=service').subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.totalRecords = result.Count;

        if (this.vehicleID != null || this.searchServiceTask != null) {
          this.serviceEndPoint = this.totalRecords;
        }

        this.initDataTable();
      },
    });
  }

  initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService.getData('reminders/fetch/records?reminderIdentification=' + this.vehicleID + '&serviceTask=' + this.searchServiceTask + '&status=' + this.filterStatus + '&reminderType=service' + '&lastKey=' + this.lastEvaluatedKey)
        .subscribe((result: any) => {

          if (result.Items.length === 0) {

            this.dataMessage = Constants.NO_RECORDS_FOUND
          }
          if (result.Items.length > 0) {

            if (result.LastEvaluatedKey !== undefined) {
              this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].reminderSK);
            }
            else {
              this.lastEvaluatedKey = 'end'
            }
            this.remindersData = this.remindersData.concat(result.Items)

            this.loaded = true;
          }
        });
    }
  }
  onScroll() {
    if (this.loaded) {
      this.getRemindersCount();
    }
    this.loaded = false;
  }
  searchData() {
    if (this.searchServiceTask !== null || this.filterStatus !== null || this.vehicleID !== null) {
      this.remindersData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.lastEvaluatedKey = ''
      this.getRemindersCount();
    } else {
      return false;
    }
  }

  resetData() {
    if (this.searchServiceTask !== null || this.filterStatus !== null || this.vehicleID !== null) {
      this.vehicleID = null;
      this.vehicleIdentification = '';
      this.searchServiceTask = null;
      this.lastEvaluatedKey = ''
      this.filterStatus = null;
      this.remindersData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.getRemindersCount();
    } else {
      return false;
    }
  }

  sendEmailNotification(value) {
    console.log('value', value);
    if (value.status !== undefined && value.status !== '') {
      this.apiService.getData(`reminders/send/email-notification/${value.reminderID}?status=${value.status}`).subscribe((result) => {
        this.toastr.success('Email sent successfully');
      });
    } else {
      this.toastr.error('Service task is upto date');
      return false;
    }
  }

  refreshData() {
    this.vehicleID = null;
    this.vehicleIdentification = '';
    this.searchServiceTask = null;
    this.filterStatus = null;
    this.lastEvaluatedKey = '';
    this.remindersData = [];
    this.dataMessage = Constants.FETCHING_DATA;
    this.getRemindersCount();
  }
}
