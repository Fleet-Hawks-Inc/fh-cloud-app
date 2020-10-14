import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-vehicle-renew-list',
  templateUrl: './vehicle-renew-list.component.html',
  styleUrls: ['./vehicle-renew-list.component.css']
})
export class VehicleRenewListComponent implements OnInit {
  public remindersData = [];
  vehicles = [];
  vehicleIdentification = '';
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchRenewals();
  }
  fetchVehicles(ID) {
    this.apiService.getData('vehicles/' + ID).subscribe((result: any) => {
      this.vehicles = result.Items;
      console.log('VEHICLES', this.vehicles);
      this.vehicleIdentification =  this.vehicles[0].vehicleIdentification;
     // console.log('vehicleId' , this.vehicleIdentification);
    });
  }
  getLengthOfArray(arr: any[]) {
    return arr.length;
  }
  fetchRenewals = () => {
    this.apiService.getData('reminders').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.remindersData = result.Items;
        console.log('Reminders Fetched Data', this.remindersData);
      //  this.fetchVehicles(this.remindersData[0].reminderIdentification);
      },
    });
  }
 deleteRenewal(entryID) {
    this.apiService
      .deleteData('reminders/' + entryID)
      .subscribe((result: any) => {
        this.fetchRenewals ();
        this.toastr.success('Vehicle Renewal Deleted Successfully!');
      });
  }
}
