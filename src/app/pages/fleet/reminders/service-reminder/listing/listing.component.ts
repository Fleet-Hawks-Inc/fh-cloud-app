import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
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
  serviceLogs:any = [];
  allRemindersData = [];
  vehicleIdentification = '';
  unitID = '';
  unitName = '';
  suggestedUnits = [];
  currentDate = moment();
  currentOdometer = 1500;
  taskName: string;
  newData = [];
  suggestedVehicles = [];
  vehicleID = '';
  serviceTasks = [];
  tasksList = [];
  searchServiceTask = '';
  filterStatus: string;
  inServiceOdometer: string;
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchServiceLogs();
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
    this.apiService.getData('serviceLogs').subscribe({
      complete: () => { this.fetchReminders(); },
      next: (result:any) => {
        this.serviceLogs = result.Items;
        console.log('servcie log', this.serviceLogs);
      }   
    });
    
      }
      setFilterStatus(val) {
        this.filterStatus = val;
      }
  fetchServiceTaks() {
    let test = [];
    let taskType = 'service';
    this.apiService.getData('tasks').subscribe((result: any) => {
      // this.apiService.getData(`tasks?taskType=${taskType}`).subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === 'service');
    });    
  }
  getVehicle(vehicleID) {
    this.apiService
      .getData('vehicles/' + vehicleID)
      .subscribe((result: any) => {
        result = result.Items[0];
          this.inServiceOdometer = result.lifeCycle.inServiceOdometer;  
          return result.lifeCycle.inServiceOdometer;   
      });
  }
  resolveReminder(unitID) {  
    let unitType = 'vehicle';
    const unit = {
      unitID:  unitID,
      unitType: unitType,
  }
  
  window.localStorage.setItem('reminderUnitID', JSON.stringify(unit));
  this.router.navigateByUrl('/fleet/maintenance/service-log/add-service');
  }
fetchReminders = async () => {
   this.allRemindersData = [];
   this.remindersData = [];
   let lastCompleted;
   let serviceOdometer = 0;
   this.apiService.getData(`reminders?reminderIdentification=${this.vehicleID}&serviceTask=${this.searchServiceTask}`).subscribe({
    // this.apiService.getData(`reminders`).subscribe({
    complete: () => {this.initDataTable(); },
    error: () => { },
    next: (result: any) => {
      this.allRemindersData = result.Items;
        for(let j=0; j < this.allRemindersData.length; j++) {
          let reminderStatus: string;
        if (this.allRemindersData[j].reminderType === 'service') {    
          for(let i = 0; i < this.serviceLogs.length; i++){
            for( let s=0; s < this.serviceLogs[i].allServiceTasks.serviceTaskList.length; s++) {
              // console.log('service task data', this.serviceLogs[i].allServiceTasks.serviceTaskList[s].reminderID);
               if(this.serviceLogs[i].allServiceTasks.serviceTaskList[s].reminderID === this.allRemindersData[j].reminderID){
                 console.log('got reminder id');           
                lastCompleted = this.serviceLogs[i].completionDate;
                serviceOdometer = +this.serviceLogs[i].odometer;
               }
               else {
                // serviceOdometer = this.getVehicle(this.allRemindersData[j].reminderIdentification);               
                lastCompleted = moment().subtract(7,'d').format('DD/MM/YYYY');
                serviceOdometer = this.allRemindersData[j].reminderTasks.odometer; 
               }              
            }
          }
          const convertedDate = moment(lastCompleted, 'DD/MM/YYYY').add(this.allRemindersData[j].reminderTasks.remindByDays,'days');
          const remainingDays = convertedDate.diff(this.currentDate, 'days');
           const remainingMiles = (serviceOdometer + (this.allRemindersData[j].reminderTasks.odometer)) - this.currentOdometer;
       
        if (remainingDays < 0) {
          reminderStatus = 'OVERDUE';
        }
        else if (remainingDays <= 7 && remainingDays >= 0) {
          reminderStatus = 'DUE SOON';
        }
          const data = {
            reminderID: this.allRemindersData[j].reminderID,
            reminderIdentification: this.allRemindersData[j].reminderIdentification,
            reminderTasks: {
              task: this.allRemindersData[j].reminderTasks.task,
              remindByDays: this.allRemindersData[j].reminderTasks.remindByDays,
              remainingDays: remainingDays,
              odometer: this.allRemindersData[j].reminderTasks.odometer,
              remainingMiles: remainingMiles,
              reminderStatus: reminderStatus,
            },
            subscribers : this.allRemindersData[j].subscribers,
            lastCompleted: lastCompleted,
          };
          this.remindersData.push(data);
        }
      }
      console.log('new data', this.remindersData);
      if (this.filterStatus === 'OVERDUE') {
        this.remindersData = this.remindersData.filter((s: any) => s.reminderTasks.reminderStatus === 'OVERDUE');
      }
      else if (this.filterStatus === 'DUE SOON') {
        this.remindersData = this.remindersData.filter((s: any) => s.reminderTasks.reminderStatus === 'DUE SOON');
      }
      else {
        this.remindersData = this.remindersData;
      }
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
