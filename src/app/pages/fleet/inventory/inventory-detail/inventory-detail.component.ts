import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../services";
import { ActivatedRoute, Router } from "@angular/router";
declare var $: any;
import { ToastrService } from "ngx-toastr";
import { environment } from '../../../../../environments/environment';

@Component({
  selector: "app-inventory-detail",
  templateUrl: "./inventory-detail.component.html",
  styleUrls: ["./inventory-detail.component.css"],
})
export class InventoryDetailComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  environment = environment.isFeatureEnabled;
  /**
   * form props
   */
  carrierID: string;
  itemID = "";
  partNumber = "";
  cost = "";
  costUnit = "";
  quantity = "";
  itemName = "";
  description = "";
  category = "";
  warehouseID = "";
  aisle = "";
  row = "";
  bin = "";
  warehouseVendorID = "";
  trackingQuantity = "";
  reorderPoint = "";
  reorderQuality = "";
  leadTime = "";
  preferredVendorID = "";
  days = "";
  time = "";
  notes = "";
  photos = [];
  documents = [];
  uploadedPhotos = [];
  uploadedDocs = [];
  vendors = {};
  itemGroups = {};
  warehouses = [];
  warehousesList: any = {};
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,

    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.itemID = this.route.snapshot.params[`itemID`];
    this.getInventory();
    this.fetchVendors();
    this.fetchWarehousesList();
  }

  fetchVendors() {
    this.apiService.getData(`contacts/get/list`).subscribe((result) => {
      this.vendors = result;
    });
  }


  fetchWarehouses() {
    this.apiService.getData(`items/get/itemqty/warehouses/` + this.partNumber).subscribe((result: any) => {
      this.warehouses = result.Items;
    });
  }
  fetchWarehousesList() {
    this.apiService.getData('items/get/list/warehouses').subscribe((result: any) => {
      this.warehousesList = result;
    });
  }
  getInventory() {
    this.apiService.getData(`items/` + this.itemID).subscribe((result: any) => {
      result = result.Items[0];
      this.carrierID = result.carrierID;
      this.partNumber = result.partNumber;
      this.cost = result.cost;
      this.costUnit = result.costUnit;
      this.quantity = result.quantity;
      this.itemName = result.itemName;
      this.description = result.description;
      this.category = result.category;
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
      this.uploadedPhotos = result.uploadedPhotos;
      this.uploadedDocs = result.uploadedDocs;
      if (
        result.uploadedPhotos != undefined &&
        result.uploadedPhotos.length > 0
      ) {
        this.photos = result.uploadedPhotos.map((x) => ({
          path: `${this.Asseturl}/${result.carrierID}/${x}`,
          name: x,
        }));
      }

      if (result.uploadedDocs != undefined && result.uploadedDocs.length > 0) {
        this.documents = result.uploadedDocs.map((x) => ({
          path: `${this.Asseturl}/${result.carrierID}/${x}`,
          name: x,
        }));
      }
      this.fetchWarehouses();
    });
  }

  delete(type: string, name: string) {
    this.apiService
      .deleteData(`items/uploadDelete/${this.itemID}/${type}/${name}`)
      .subscribe((result: any) => {
        this.getInventory();
      });
  }

  deleteItem() {
    this.apiService
      .deleteData(`items/` + this.itemID)
      .subscribe((result: any) => {
        this.toastr.success(`Item Deleted Successfully!`);
        this.router.navigateByUrl(`fleet/items/list`);
      });
  }
}
