import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-trips-list',
  templateUrl: './trips-list.component.html',
  styleUrls: ['./trips-list.component.css']
})
export class TripsListComponent implements OnInit {
  title = 'Trips List';
  tripLists;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.fuelEntries();
  }

  fuelEntries() {
    this.apiService.getData('trips')
        .subscribe((result: any) => {
          console.log(result);
          this.tripLists = result.Items;
        });
  }



  deleteTrip(tripId) {
    this.apiService.deleteData('trips/' + tripId)
        .subscribe((result: any) => {
          this.fuelEntries();
        })
  }

}
