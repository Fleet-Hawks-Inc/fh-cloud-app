import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  public remindersData = [];
  vehicles = [];
  vehicleIdentification = '';

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchReminders();
  }
  fetchVehicles(ID) {
    this.apiService.getData('vehicles/' + ID).subscribe((result: any) => {
      this.vehicles = result.Items;
      console.log('VEHICLES', this.vehicles);
      this.vehicleIdentification =  this.vehicles[0].vehicleIdentification;
     // console.log('vehicleId' , this.vehicleIdentification);
    });
  }
  fetchReminders = () => {
    this.apiService.getData('serviceReminder').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.remindersData = result.Items;
        console.log('Fetched data of service reminder', this.remindersData);
        this.fetchVehicles(this.remindersData[0].vehicleID);
      },
    });
  }


 deleteReminder(entryID) {
    this.apiService
      .deleteData('serviceReminder/' + entryID)
      .subscribe((result: any) => {
        this.fetchReminders ();
        this.toastr.success('Service Reminder Deleted Successfully!');
      });
  }
}
