import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { group } from 'console';
@Component({
  selector: 'app-vehicle-renew-list',
  templateUrl: './vehicle-renew-list.component.html',
  styleUrls: ['./vehicle-renew-list.component.css']
})
export class VehicleRenewListComponent implements OnInit {
  public remindersData = [];
  vehicles = [];
  vehicleName: string;
  groups = [];
  group: string;
  subcribersArray = [];
  allRemindersData = [];
  vehicleIdentification = '';
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchRenewals();
    this.fetchVehicles();
    this.fetchGroups();
  }
  fetchGroups() {
    this.apiService.getData('groups').subscribe((result: any) => {
      this.groups = result.Items;
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
  getVehicleName(ID): string {
    let vehicle = this.vehicles.filter((v: any) => v.vehicleID === ID);
    let vehicleName = (vehicle[0].vehicleIdentification);
    return vehicleName;
  }
  getSubscribers(arr: any[]) {
    this.subcribersArray = [];
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
  fetchRenewals = () => {
    this.apiService.getData('reminders').subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.allRemindersData = result.Items;
        for (let i = 0; i < this.allRemindersData.length; i++) {
          if (this.allRemindersData[i].reminderType === 'vehicle') {
            this.remindersData.push(this.allRemindersData[i]);
          }
        }
        console.log('vehicle renewal array', this.remindersData);
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
}
