import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

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
      this.apiService.getData("geofences").subscribe({
        complete: () => {
          this.initDataTable();
        },
        error: () => {},
        next: (result: any) => {
          console.log(result);
          this.geofences = result.Items;
        },
      });
  }

  deleteGeofence(geofenceID) {
     /******** Clear DataTable ************/
     if ($.fn.DataTable.isDataTable("#datatable-default")) {
      $("#datatable-default").DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData('geofences/' + geofenceID)
      .subscribe((result: any) => {
        this.fetchGeofences();
      })
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
  
}
