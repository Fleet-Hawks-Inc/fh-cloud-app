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
  allRemindersData = [];
  vehicleIdentification = '';
  subscribedUsersArray = [];
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchReminders();
    this.fetchVehicles();
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
    this.vehicles = result.Items;
    });
  }
  getVehicleName(ID) {
    let vehicle = this.vehicles.filter(v => v.vehicleID === ID);
    let vehicleName = (vehicle[0].vehicleIdentification);
    return vehicleName;
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
        this.fetchReminders ();
      });
  }
  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
