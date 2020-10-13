import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: 'app-inventory-stock-statement',
  templateUrl: './inventory-stock-statement.component.html',
  styleUrls: ['./inventory-stock-statement.component.css']
})
export class InventoryStockStatementComponent implements OnInit {
  title = "Stock Statement";
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

}
