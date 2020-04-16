import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-items-list",
  templateUrl: "./items-list.component.html",
  styleUrls: ["./items-list.component.css"],
})
export class ItemsListComponent implements OnInit {
  title = "Items List";
  items = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems() {
    this.apiService.getData("items").subscribe((result: any) => {
      this.items = result.Items;
    });
  }

  deleteItem(itemID) {
    this.apiService.deleteData("items/" + itemID).subscribe((result: any) => {
      this.fetchItems();
    });
  }
}
