import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
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
  vehicleList: any;
  groups = [];
  allRemindersData = [];
  vehicleIdentification = '';
  unitID = '';
  unitName = '';
  suggestedUnits = [];
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchReminders();
    this.fetchVehicles();
    this.fetchGroups();
    this.fetchVehicleList();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
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
  fetchGroups() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groups = result;
      //   console.log('Groups Data', this.groups);
    });
  }

  getLengthOfArray(arr: any[]) {
    return arr.length;
  }
  // fetchReminders = () => {
  //   this.apiService.getData('reminders').subscribe({
  //     complete: () => {this.initDataTable(); },
  //     error: () => { },
  //     next: (result: any) => {
  //       this.allRemindersData = result.Items;
  //       for (let i = 0; i < this.allRemindersData.length; i++) {
  //         if (this.allRemindersData[i].reminderType === 'service') {
  //           this.remindersData.push(this.allRemindersData[i]);
  //         }
  //       }
  //       console.log('Service Reminder array', this.remindersData);
  //     },
  //   });
  // }
  fetchReminders() {
    this.apiService.getData(`reminders?reminderIdentification=${this.unitID}`).subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        this.allRemindersData = result.Items;
        console.log('reminders data', this.allRemindersData);
        for (let i = 0; i < this.allRemindersData.length; i++) {
          if (this.allRemindersData[i].reminderType === 'service') {
            this.remindersData.push(this.allRemindersData[i]);
          }
        }
        console.log('Service Reminder array', this.remindersData);
      },
    });
}
setUnit(unitID, unitName) {
  this.unitName = unitName;
  this.unitID = unitID;

  this.suggestedUnits = [];
}
getSuggestions(value) {
  this.suggestedUnits = [];
  this.apiService
    .getData(`vehicles/suggestion/${value}`)
    .subscribe((result) => {
      result = result.Items;

      for(let i = 0; i < result.length; i++){
        this.suggestedUnits.push({
          unitID: result[i].vehicleID,
          unitName: result[i].vehicleIdentification
        });
      }
    });
}
  deleteReminder(entryID) {
    this.apiService
      .deleteData('reminders/' + entryID)
      .subscribe((result: any) => {
        this.fetchReminders();
        this.toastr.success('Service Reminder Deleted Successfully!');
      });
  }
  resolveReminder(ID) {
    window.localStorage.setItem('reminderVehicleLocalID', ID);
    this.router.navigateByUrl('/fleet/maintenance/service-log/add-service');
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
