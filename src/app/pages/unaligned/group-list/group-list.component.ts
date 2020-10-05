import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.component.html",
  styleUrls: ["./group-list.component.css"],
})
export class GroupListComponent implements OnInit {
  title = "Group List";
  groups;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchGroups();
  }

  fetchGroups() {
    this.apiService.getData("groups").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.groups = result.Items;
      },
    });
  }

  deleteGroup(groupId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable("#datatable-default")) {
      $("#datatable-default").DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData("groups/" + groupId).subscribe((result: any) => {
      this.fetchGroups();
    });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}
