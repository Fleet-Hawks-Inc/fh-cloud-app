import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { group } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
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
  constructor(private apiService: ApiService, private router: Router,private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchRenewals();
    this.fetchVehicles();
    this.fetchGroups();
    this.fetchVehicleList();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }
  fetchGroups() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groups = result;
      //   console.log('Groups Data', this.groups);
    });
  }
  // fetchVehicles(ID) {
  //   this.apiService.getData('vehicles/' + ID).subscribe((result: any) => {
  //   this.vehicles = result.Items;
  //   this.vehicleIdentification = this.vehicles[0].vehicleIdentification;
  //   });
  // }
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
 
  fetchRenewals = async () => {
    this.remindersData = [];
    this.apiService.getData(`reminders?reminderIdentification=${this.vehicleID}&serviceTask=${this.searchServiceTask}`).subscribe({
      complete: () => {this.initDataTable(); },
      error: () => { },
      next: (result: any) => {
        this.allRemindersData = result.Items;
        console.log(this.allRemindersData);
        for(let j=0; j < this.allRemindersData.length; j++) {
          let reminderStatus;
          if (this.allRemindersData[j].reminderType === 'vehicle') {
            const convertedDate = moment(this.allRemindersData[j].reminderTasks.dueDate,'DD-MM-YYYY');
            const remainingDays = convertedDate.diff(this.currentDate, 'days');
            if (remainingDays > this.allRemindersData[j].reminderTasks.remindByDays) {
              reminderStatus = '';
            }
            else if( remainingDays <= this.allRemindersData[j].reminderTasks.remindByDays &&  remainingDays >= 0) {
              reminderStatus = 'DUE SOON';
            }
            else{
              reminderStatus = 'OVERDUE';
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
        console.log('new data', this.remindersData);
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
      dom: 'Bfrtip', // lrtip to hide search field
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
