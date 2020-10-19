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
  vehicles = [];
  groups = [];
  allRemindersData = [];
  vehicleIdentification = '';
  subscribedUsersArray = [];
  subcribersArray = [];
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchReminders();
    this.fetchVehicles();

    this.fetchGroups();

  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fetchGroups() {
    this.apiService.getData('groups').subscribe((result: any) => {
      this.groups = result.Items;
      //   console.log('Groups Data', this.groups);
    });
  }
  fetchGroups() {
    this.apiService.getData('groups').subscribe((result: any) => {
      this.groups = result.Items;
      //   console.log('Groups Data', this.groups);
    });
  }
  getVehicleName(ID) {
    let vehicle = [];
    vehicle = this.vehicles.filter((v: any) => v.vehicleID === ID);
    let vehicleName = (vehicle[0].vehicleIdentification);
    return vehicleName;
  }
  getSubscribers(arr: any[]) {
    this.subcribersArray = [];
    console.log('array', arr);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].subscriberType === 'user') {
        this.subcribersArray.push(arr[i].subscriberIdentification);
      }
      else {
        let test = this.groups.filter((g: any) => g.groupID === arr[i].subscriberIdentification);
        this.subcribersArray.push(test[0].groupName);
      }
    }
    return this.subcribersArray;
  }
  getLengthOfArray(arr: any[]) {
    return arr.length;
  }
  fetchReminders = () => {
    this.apiService.getData('reminders').subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.allRemindersData = result.Items;
        for (let i = 0; i < this.allRemindersData.length; i++) {
          if (this.allRemindersData[i].reminderType === 'service') {
            this.remindersData.push(this.allRemindersData[i]);
          }
        }
        console.log('Service Reminder array', this.remindersData);
      },
    });
  }


  deleteReminder(entryID) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/
    this.apiService
      .deleteData('reminders/' + entryID)
      .subscribe((result: any) => {
        this.toastr.success('Service Reminder Deleted Successfully!');
        this.fetchReminders();
      });
  }
  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
