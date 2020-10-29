import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
})
export class AddItemComponent implements OnInit {
  title = 'Add Item';
  errors = {};
  form;
  concatArrayKeys = '';
  inventaryData = {
    uploadedPhotos: {},
    uploadedDocuments: {}
  };
  /**
   * Form props
   */
  itemName = '';
  description = '';
  defaultPurchasePrice = '';
  defaultPurchaseVendor = '';
  defaultTaxAccount = '';
  openingStock = '';
  vendors = [];
  taxAccounts = [];

  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchVendors();
    this.fetchAccounts();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  fetchVendors() {
    this.apiService.getData('vendors').subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }

  fetchAccounts() {
    this.apiService
      .getData(`accounts/accountType/Tax`)
      .subscribe((result: any) => {
        this.taxAccounts = result.Items;
      });
  }

  addItem() {
    console.log(this.inventaryData)
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    let data = {
      itemName: this.itemName,
      description: this.description,
      defaultPurchasePrice: this.defaultPurchasePrice,
      defaultPurchaseVendor: this.defaultPurchaseVendor,
      defaultTaxAccount: this.defaultTaxAccount,
      openingStock: this.openingStock,
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

              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[key] = val.message;
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
        this.Success = 'Item added successfully';

        this.itemName = '';
        this.description = '';
        this.defaultPurchasePrice = '';
        this.defaultPurchaseVendor = '';
        this.defaultTaxAccount = '';
        this.openingStock = '';
        this.vendors = [];
        this.taxAccounts = [];
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  concatArray(path) {
    this.concatArrayKeys = '';
    for (const i in path) {
      this.concatArrayKeys += path[i] + '.';
    }
    this.concatArrayKeys = this.concatArrayKeys.substring(
      0,
      this.concatArrayKeys.length - 1
    );
    return this.concatArrayKeys;
  }
}
