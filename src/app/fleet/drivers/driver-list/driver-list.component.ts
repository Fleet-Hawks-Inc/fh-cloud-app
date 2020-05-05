import { Component, OnInit } from "@angular/core";
import {ApiService} from '../../../api.service';
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: "app-driver-list",
  templateUrl: "./driver-list.component.html",
  styleUrls: ["./driver-list.component.css"],
})
export class DriverListComponent implements OnInit {
  title = "Driver List";
  users = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.apiService.getData("users/userType/driver").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.users = result.Items;
      },
    });
  }

  deleteUser(userName) {
     /******** Clear DataTable ************/
     if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
      }
      /******************************/

    this.apiService.deleteData("users/" + userName).subscribe((result: any) => {
      this.fetchUsers();
    });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}
