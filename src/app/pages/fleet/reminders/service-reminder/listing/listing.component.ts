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
  vehicleIdentification = '';
  subscribedUsersArray = [];
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchReminders();
  }
  fetchVehicles(ID) {
    this.apiService.getData('vehicles/' + ID).subscribe((result: any) => {
      this.vehicles = result.Items;
      console.log('VEHICLES', this.vehicles);
     return this.vehicles[0].vehicleIdentification;
     // console.log('vehicleId' , this.vehicleIdentification);
    });
  }

  getLengthOfArray(arr: any[]) {
    return arr.length;
  }
  fetchReminders = () => {
    this.apiService.getData('reminders').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.remindersData = result.Items;
        console.log('Fetched data of service reminder', this.remindersData);

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
