import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-alert',
  templateUrl: './add-alert.component.html',
  styleUrls: ['./add-alert.component.css']
})
export class AddAlertComponent implements OnInit {
  alert = {};
  vehicles = [];
  groups = [];
  assets = [];
  users  = [];
  geofences = [];
  drivers = [];
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
              private location: Location) { }

  ngOnInit() {
    this.fetchVehicles();
    this.fetchGroups();
    this.fetchAssets();
    this.fetchUsers();
    this.fetchGeofences();
    this.fetchDrivers();
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fetchGroups() {
    this.apiService.getData('groups').subscribe((result: any) => {
      this.groups = result.Items;
    });
  }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
    });
  }
  fetchDrivers() {
    this.apiService.getData('drivers').subscribe((result: any) => {
      this.drivers = result.Items;
    });
  }
  fetchUsers() {
    this.apiService.getData('users').subscribe((result: any) => {
      this.users = result.Items;
    });
  }
  fetchGeofences() {
    this.apiService.getData('geofences').subscribe((result: any) => {
      this.geofences = result.Items;
    });
  }
  addAlert() {
  console.log('alert data', this.alert);
  }
}
