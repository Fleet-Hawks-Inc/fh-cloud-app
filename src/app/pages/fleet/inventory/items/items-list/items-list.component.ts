import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: "app-items-list",
  templateUrl: "./items-list.component.html",
  styleUrls: ["./items-list.component.css"],
})
export class ItemsListComponent implements OnInit {
  title = "Item List";
  items = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems() {
    this.apiService.getData("items").subscribe({
      complete: () => {
        // this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log("reslt", result)
        this.items = result.Items;
      },
    });
  }

  deleteItem(itemID) {
    
    this.apiService.deleteData("items/" + itemID).subscribe((result: any) => {
      
      this.fetchItems();
    });
  }

}
