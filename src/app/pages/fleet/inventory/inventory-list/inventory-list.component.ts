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
  vendors = [];
  itemGroups = [];
  warehouses = [];


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
  }


  fetchVendors(){
    this.apiService.getData(`vendors`).subscribe((result) => {
      this.vendors = result.Items;
    })
  }

  fetchItemGroups(){
    this.apiService.getData(`itemGroups`).subscribe((result) => {
      this.itemGroups = result.Items;
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
    this.apiService.getData('warehouses').subscribe((result: any) => {
      this.warehouses = result.Items;
    });
  }


}
