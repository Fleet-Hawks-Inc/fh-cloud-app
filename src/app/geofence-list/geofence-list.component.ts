import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-geofence-list',
  templateUrl: './geofence-list.component.html',
  styleUrls: ['./geofence-list.component.css']
})
export class GeofenceListComponent implements OnInit {

  title = 'GeoFence List';
  geofences;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchGeofences();

  }

  fetchGeofences() {
    this.apiService.getData('geofences')
      .subscribe((result: any) => {
        this.geofences = result.Items;
      });
  }

  deleteGeofence(geofenceID) {
    this.apiService.deleteData('geofences/' + geofenceID)
      .subscribe((result: any) => {
        this.fetchGeofences();
      })
  }
}
