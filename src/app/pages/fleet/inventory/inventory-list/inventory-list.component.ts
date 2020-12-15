import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {

  items = [];
  itemGroups = {};
  vendors = {};
  warehouses = {};


  partNumber = '';
  partDetails = '';
  quantity = '';
  date = '';
  warehouseID1 = '';
  warehouseID2 = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchItems();
    this.fetchVendors();
    this.fetchItemGroups();
    this.fetchWarehouses();
  }


  fetchVendors(){
    this.apiService.getData(`vendors/get/list`).subscribe((result) => {
      this.vendors = result;
    })
  }

  fetchItemGroups(){
    this.apiService.getData(`itemGroups/get/list`).subscribe((result) => {
      this.itemGroups = result;
    })
  }


  openTransferModal(){
    $('#transferModal').modal('show');
  }

  fetchItems(){
    this.apiService.getData('items').subscribe((result) => {
      this.items = result.Items;
    })
  }

  fetchWarehouses(){
    this.apiService.getData('warehouses/get/list').subscribe((result: any) => {
      this.warehouses = result;
    });
  }


  deleteItem(itemID) {
    this.apiService
      .deleteData('items/' + itemID)
      .subscribe((result: any) => {
        this.fetchItems();
      });
  }
}
