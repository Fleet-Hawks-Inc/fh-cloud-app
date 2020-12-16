import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import Constants from '../../../constants';
declare var $: any;
@Component({
  selector: 'app-vehicle-renew-list',
  templateUrl: './vehicle-renew-list.component.html',
  styleUrls: ['./vehicle-renew-list.component.css']
})
export class VehicleRenewListComponent implements OnInit {
  public remindersData = [];
  dtOptions: any = {};
  vehicles = [];
  vehicleName: string;
  vehicleList: any = {};
  tasksList: any  = {};
  groups; any = {};
  group: string;
  subcribersArray = [];
  allRemindersData = [];
  vehicleIdentification = '';
  currentDate = moment();
  newData = [];
  suggestedVehicles = [];
  vehicleID = '';
  unitID = '';
  unitName = '';
  searchServiceTask = '';
  serviceTasks = [];
  filterStatus: string;
  constructor(private apiService: ApiService, private router: Router,private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchServiceTaks();
    this.fetchRenewals();
    this.fetchVehicles();
    this.fetchGroupsList();
    this.fetchVehicleList();
    this.fetchTasksList();
    
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }
  fetchGroupsList() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groups = result;
      //   console.log('Groups Data', this.groups);
    });
  }
  
  fetchServiceTaks() {
    let test = [];
    let taskType = 'vehicle';
    this.apiService.getData('tasks').subscribe((result: any) => {
      // this.apiService.getData(`tasks?taskType=${taskType}`).subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === 'vehicle');
    });    
  }
  fetchTasksList() {
    this.apiService.getData('tasks/get/list').subscribe((result: any) => {
      this.tasksList = result;
    });
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  } 
  setFilterStatus(val) {
    this.filterStatus = val;
  }
  fetchRenewals = async () => {
    this.remindersData = [];
    this.apiService.getData(`reminders?reminderIdentification=${this.vehicleID}&serviceTask=${this.searchServiceTask}`).subscribe({
      complete: () => {this.initDataTable(); },
      error: () => { },
      next: (result: any) => {
        this.allRemindersData = result.Items;
        for(let j=0; j < this.allRemindersData.length; j++) {
          let reminderStatus: string;
          if (this.allRemindersData[j].reminderType === 'vehicle') {
            const convertedDate = moment(this.allRemindersData[j].reminderTasks.dueDate,'DD-MM-YYYY');
            const remainingDays = convertedDate.diff(this.currentDate, 'days');
            if (remainingDays < 0 ) {
              reminderStatus = 'OVERDUE';
            }
            else if( remainingDays <= this.allRemindersData[j].reminderTasks.remindByDays &&  remainingDays >= 0) {
              reminderStatus = 'DUE SOON';
            }
            const data = {
              reminderID: this.allRemindersData[j].reminderID,
              reminderIdentification: this.allRemindersData[j].reminderIdentification,
              reminderTasks: {
                task: this.allRemindersData[j].reminderTasks.task,
                remindByDays: this.allRemindersData[j].reminderTasks.remindByDays,
                reminderStatus: reminderStatus,
                remainingDays: remainingDays,
                dueDate: this.allRemindersData[j].reminderTasks.dueDate,
              },
              subscribers : this.allRemindersData[j].subscribers,
             };
             this.remindersData.push(data); 
          }
        }
        if (this.filterStatus === Constants.OVERDUE) {
          this.remindersData = this.remindersData.filter((s: any) => s.reminderTasks.reminderStatus === this.filterStatus);
        }
        else if (this.filterStatus === Constants.DUE_SOON) {
          this.remindersData = this.remindersData.filter((s: any) => s.reminderTasks.reminderStatus === this.filterStatus);
        }
        else {
          this.remindersData = this.remindersData;
        }
      },
    });
  }
  deleteRenewal(entryID) {
    this.apiService
      .deleteData('reminders/' + entryID)
      .subscribe((result: any) => {
        this.fetchRenewals();
        this.toastr.success('Vehicle Renewal Deleted Successfully!');
               
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
