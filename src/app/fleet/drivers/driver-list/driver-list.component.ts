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
  defaultBindingsList = [
    { value: 1, label: 'Vilnius' },
    { value: 2, label: 'Kaunas' },
    { value: 3, label: 'Pavilnys', disabled: true }
];
 selectedCity = null;
   constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchUsers();
    this.selectedCity = this.defaultBindingsList[0];
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
      // $("#datatable-default").DataTable();
    });
  }
  showMap(){
    // $(document).ready(function(){
      $("#map_view").show();
   $("#list_view").hide();
   $("#map_view_btn").removeClass("btn-default").addClass("btn-success");
   $("#list_view_btn").removeClass("btn-success").addClass("btn-default");   
    // });
  }
  showList(){ 
    // $(document).ready(function(){
      $("#list_view").show();
      $("#map_view").hide();
      $("#list_view_btn").removeClass("btn-default").addClass("btn-success");
      $("#map_view_btn").removeClass("btn-success").addClass("btn-default");
  //  });
  }
}
