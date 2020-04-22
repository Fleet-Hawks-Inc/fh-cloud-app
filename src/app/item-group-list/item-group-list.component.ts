import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-item-group-list",
  templateUrl: "./item-group-list.component.html",
  styleUrls: ["./item-group-list.component.css"],
})
export class ItemGroupListComponent implements OnInit {
  title = "Item Group List";
  itemGroups = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchItemGroups();
  }

  fetchItemGroups() {
    this.apiService.getData("itemGroups").subscribe((result: any) => {
      this.itemGroups = result.Items;
    });
  }

  deleteItemGroup(groupId) {
    this.apiService
      .deleteData("itemGroups/" + groupId)
      .subscribe((result: any) => {
        this.fetchItemGroups();
      });
  }
}
