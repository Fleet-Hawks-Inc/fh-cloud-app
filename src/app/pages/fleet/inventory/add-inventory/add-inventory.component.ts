import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css']
})
export class AddInventoryComponent implements OnInit {

  /**
   * form props
   */
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


  errors = {};
  form;
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
  }


  addInventory() {
    this.hasError = false;
    this.hasSuccess = false;
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
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/'([^']+)'/)[1];
              console.log(key);
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
              this.Success = '';
            },
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Inventory Added successfully';
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

}
