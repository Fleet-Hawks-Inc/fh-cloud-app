import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.css']
})
export class InventoryDetailComponent implements OnInit {
    /**
   * form props
   */
  itemID = '';
  partNumber = '';
  cost = '';
  costUnit = '';
  quantity = '';
  name = '';
  description = '';
  categoryID = '';
  warehouseID = '';
  aisle = '';
  row = '';
  bin = '';
  warehouseVendorID = '';
  trackingQuantity = '';
  reorderPoint = '';
  reorderQuality = '';
  leadTime = '';
  preferredVendorID = '';
  days = '';
  time = '';
  notes = '';
  photos = [];
  documents = [];

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.itemID = this.route.snapshot.params['itemID'];
    this.getInventory();
  }

  getInventory() {
    this.apiService.getData('items/' + this.itemID).subscribe((result: any) => {
      result = result.Items[0];

      this.partNumber = result.partNumber;
      this.cost = result.cost;
      this.costUnit = result.costUnit;
      this.quantity = result.quantity;
      this.name = result.name;
      this.description = result.description;
      this.categoryID = result.categoryID;
      this.warehouseID = result.warehouseID;
      this.aisle = result.aisle;
      this.row = result.row;
      this.bin = result.bin;
      this.warehouseVendorID = result.warehouseVendorID;
      this.trackingQuantity = result.trackingQuantity;
      this.reorderPoint = result.reorderPoint;
      this.reorderQuality = result.reorderQuality;
      this.leadTime = result.leadTime;
      this.preferredVendorID = result.preferredVendorID;
      this.days = result.days;
      this.time = result.time;
      this.notes = result.notes;
    });
  }

}
