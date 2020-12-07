import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import * as moment from 'moment';
declare var $: any;
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  public remindersData = [];
  dtOptions: any = {};
  vehicles = [];
  reminderIdentification = '';
  reminderID = '';
  task: string;
  vehicleList: any = {};
  groups: any = {};
  serviceLogs: [];
  allRemindersData = [];
  vehicleIdentification = '';
  unitID = '';
  unitName = '';
  suggestedUnits = [];
  currentDate = moment();
  currentOdometer = 12500;
  taskName: string;
  newData = [];
  suggestedVehicles = [];
  vehicleID = '';
  serviceTasks = [];
  tasksList = [];
  searchServiceTask = '';
  filterStatus = 'OVERDUE';
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchServiceLogs();
    this.fetchReminders();
    this.fetchGroups();
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
  fetchGroups() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groups = result;
    });
  }
  fetchServiceLogs() {
    this.apiService.getData('serviceLogs').subscribe((result: any) => {
      this.serviceLogs = result.Items;
    });
  }
  fetchServiceTaks() {
    this.apiService.getData('tasks').subscribe((result: any) => {
      this.serviceTasks = result.Items;
    });
  }
fetchReminders = async () => {
   console.log('serach service task', this.searchServiceTask);
   this.allRemindersData = [];
   this.remindersData = [];
   this.apiService.getData(`reminders?reminderIdentification=${this.vehicleID}&serviceTask=${this.searchServiceTask}`).subscribe({
    // this.apiService.getData(`reminders`).subscribe({
    complete: () => {this.initDataTable(); },
    error: () => { },
    next: (result: any) => {
      this.allRemindersData = result.Items;
      for(let j=0; j < this.allRemindersData.length; j++) {
        if (this.allRemindersData[j].reminderType === 'service') {
          // USE BELOW LOGIC TO FETCH REMINDERS INSTEAD OF ISSUES
          // const issueId = 'b81aba00-1066-11eb-a5d6-113a0b66f655';
          // const selectedIssues: any = this.serviceLogs.filter( (s: any) =>  s.selectedIssues.some((issue: any) => issue === issueId));
          // console.log('selected issues', selectedIssues);
          // const lastCompleted = selectedIssues[0].completionDate;
          const lastCompleted = '18-11-2020';
          console.log('last completed', lastCompleted);
          // const serviceOdometer = +selectedIssues[0].odometer;
          const serviceOdometer = 3400;
          console.log('service odometer', serviceOdometer);
          const convertedDate = moment(lastCompleted, 'DD/MM/YYYY').add(this.allRemindersData[j].reminderTasks.remindByDays,'days');
          const remainingDays = convertedDate.diff(this.currentDate, 'days');
          const remainingMiles = (serviceOdometer + (+this.allRemindersData[j].reminderTasks.odometer)) - this.currentOdometer;
          console.log('odometer', remainingMiles);
          const data = {
            reminderID: this.allRemindersData[j].reminderID,
            reminderIdentification: this.allRemindersData[j].reminderIdentification,
            reminderTasks: {
              task: this.allRemindersData[j].reminderTasks.task,
              remindByDays: this.allRemindersData[j].reminderTasks.remindByDays,
              remainingDays: remainingDays,
              odometer: this.allRemindersData[j].reminderTasks.odometer,
              remainingMiles: remainingMiles
            },
            subscribers : this.allRemindersData[j].subscribers,
            lastCompleted: lastCompleted,
          };
          this.remindersData.push(data);
        }
      }
      console.log('new data', this.remindersData);
    },
  });
}
setVehicle(vehicleID, vehicleIdentification) {
  this.vehicleIdentification = vehicleIdentification;
  this.vehicleID = vehicleID;
  this.suggestedVehicles = [];
}
getSuggestions(value) {
  this.apiService
    .getData(`vehicles/suggestion/${value}`)
    .subscribe((result) => {
      this.suggestedVehicles = result.Items;
      if (this.suggestedVehicles.length === 0) {
        this.vehicleID = '';
      }
    });
}
  deleteReminder(entryID) {
    this.apiService
      .deleteData('reminders/' + entryID)
      .subscribe((result: any) => {
        this.toastr.success('Service Reminder Deleted Successfully!');
        this.fetchReminders();
      });
  }
  resolveReminder(ID) {
    window.localStorage.setItem('reminderVehicleLocalID', ID);
    this.router.navigateByUrl('/fleet/maintenance/service-log/add-service');
  }
  initDataTable() {
    this.dtOptions = {
      dom: 'lrtip', // lrtip to hide search field
      processing: true,
      columnDefs: [
          {
              targets: 0,
              className: 'noVis'
          },
          {
              targets: 1,
              className: 'noVis'
          },
          {
              targets: 2,
              className: 'noVis'
          },
          {
              targets: 3,
              className: 'noVis'
          },
          {
              targets: 4,
              className: 'noVis'
          }
      ],
      colReorder: {
        fixedColumnsLeft: 1
      },
      buttons: [
        'colvis',
      ],
    };
  }
}
