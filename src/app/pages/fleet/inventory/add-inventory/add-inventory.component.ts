import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css']
})
export class AddInventoryComponent implements OnInit {

  /**
   * form props
   */
  pageTitle = '';
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
  vendors = [];
  itemGroups = [];
  warehouses = [];


  /**
   * group props
   */
  groupName = '';
  groupDescription = '';
  groupForm = '';
  hasGroupSuccess = false;
  groupSuccess: string = '';

  /**
   * warehouse props
   */
  warehouseName = '';
  countryID = '';
  stateID = '';
  cityID = '';
  zipCode = '';
  address = '';
  warehoseForm = '';
  hasWarehouseSuccess = false;
  warehouseSuccess: string = '';


  countries = [];
  states = [];
  cities = [];

  errors = {};
  form;
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.itemID = this.route.snapshot.params['itemID'];
      console.log(this.itemID)
      if (this.itemID) {
        this.pageTitle = 'Edit Driver';
        this.getInventory();
      } else {
        this.pageTitle = 'Add Driver';
      }

    $(document).ready(() => {
      this.form = $('#form').validate();
      this.groupForm = $('#groupForm').validate();
      this.warehoseForm = $('#warehoseForm').validate();
    });
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

  ngOnInit() {
    this.fetchVendors();
    this.fetchItemGroups();
    this.fetchCountries();
    this.fetchWarehouses();
  }

  fetchWarehouses(){
    this.apiService.getData('warehouses').subscribe((result: any) => {
      this.warehouses = result.Items;
    });
  }

  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
    });
  }

  getStates() {
    this.apiService
      .getData('states/country/' + this.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  getCities() {
    this.apiService
      .getData('cities/state/' + this.stateID)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }

  showWarehoseModal(){
    $('#warehouseModal').modal('show');
  }

  showCategoryModal(){
    $('#categoryModal').modal('show');
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



  addInventory() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();

    const data = {
      partNumber: this.partNumber,
      cost: this.cost,
      costUnit: this.costUnit,
      quantity: this.quantity,
      name: this.name,
      description: this.description,
      categoryID: this.categoryID,
      warehouseID: this.warehouseID,
      aisle: this.aisle,
      row: this.row,
      bin: this.bin,
      warehouseVendorID: this.warehouseVendorID,
      trackingQuantity: this.trackingQuantity,
      reorderPoint: this.reorderPoint,
      reorderQuality: this.reorderQuality,
      leadTime: this.leadTime,
      preferredVendorID: this.preferredVendorID,
      days: this.days,
      time: this.time,
      notes: this.notes
    };

    this.apiService.postData('items', data).subscribe({
      complete: () => {},
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.partNumber = '';
        this.cost = '';
        this.costUnit = '';
        this.quantity = '';
        this.name = '';
        this.description = '';
        this.categoryID = '';
        this.warehouseID = '';
        this.aisle = '';
        this.row = '';
        this.bin = '';
        this.warehouseVendorID = '';
        this.trackingQuantity = '';
        this.reorderPoint = '';
        this.reorderQuality = '';
        this.leadTime = '';
        this.preferredVendorID = '';
        this.days = '';
        this.time = '';
        this.notes = '';
        this.Success = 'Inventory Added successfully';
      },
    });
  }

  throwErrors() {
    console.log(this.errors);
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error')
      });
    // this.vehicleForm.showErrors(this.errors);
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label')
      });
    this.errors = {};
  }

  addGroup() {
    this.hasGroupSuccess = false;
    this.hideErrors();

    const data = {
      groupName: this.groupName,
      groupDescription: this.groupDescription
    };

    this.apiService.postData('itemGroups', data).subscribe({
      complete: () => {},
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasGroupSuccess = true;
        this.groupSuccess = 'Group Added successfully';
        this.groupName = '';
        this.groupDescription = '';
        this.fetchItemGroups()
      },
    });
  }

  updateInventory() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();

    const data = {
      itemID: this.itemID,
      partNumber: this.partNumber,
      cost: this.cost,
      costUnit: this.costUnit,
      quantity: this.quantity,
      name: this.name,
      description: this.description,
      categoryID: this.categoryID,
      warehouseID: this.warehouseID,
      aisle: this.aisle,
      row: this.row,
      bin: this.bin,
      warehouseVendorID: this.warehouseVendorID,
      trackingQuantity: this.trackingQuantity,
      reorderPoint: this.reorderPoint,
      reorderQuality: this.reorderQuality,
      leadTime: this.leadTime,
      preferredVendorID: this.preferredVendorID,
      days: this.days,
      time: this.time,
      notes: this.notes,
    };

    // console.log(data);return false;
    this.apiService.putData('items', data).subscribe({
      complete: () => {},
      error: (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Inventory updated successfully';
      },
    });
  }
  
}


