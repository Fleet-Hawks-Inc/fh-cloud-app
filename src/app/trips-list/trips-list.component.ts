import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;
@Component({
  selector: "app-trips-list",
  templateUrl: "./trips-list.component.html",
  styleUrls: ["./trips-list.component.css"],
})
export class TripsListComponent implements OnInit {
  title = "Trips List";
  tripLists;
  // @ViewChild('FhDataTable', {static: false}) table;
  // dataTable: any;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.tripLists = [];
    this.tripEntries();
    $(document).ready(() => {});
  }

  tripEntries() {
    this.apiService.getData("trips").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.tripLists = result.Items;
      },
    });
  }

  deleteTrip(tripId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable("#datatable-default")) {
      $("#datatable-default").DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData("trips/" + tripId).subscribe((result: any) => {
      this.tripEntries();
    });
  }

  /********Initialize Datatable, Wait To Load Records First ********/
  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}
