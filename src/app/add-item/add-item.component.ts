import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  title = "Add Item";

  /**
   * Form props
   */
  itemName = "";
  description = "";
  defaultPurchasePrice = "";
  defaultPurchaseVendor = "";
  defaultTaxAccount = "";
  openingStock = "";
  vendors = [];
  /**
   * Form errors props
   */
  validationErrors = {
    itemName: {
      error: false
    },
    description: {
      error: false
    },
    defaultPurchasePrice: {
      error: false
    },
    defaultPurchaseVendor: {
      error: false
    },
    defaultTaxAccount: {
      error: false
    },
    openingStock: {
      error: false
    }
  }
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchVendors();
  }

  fetchVendors(){
    this.apiService.getData('vendors')
    .subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }

  addItem() {
    this.hasError = false;
    this.hasSuccess = false;

    let data = {
      itemName: this.itemName,
      description: this.description,
      defaultPurchasePrice: this.defaultPurchasePrice,
      defaultPurchaseVendor: this.defaultPurchaseVendor,
      defaultTaxAccount: this.defaultTaxAccount,
      openingStock: this.openingStock
    };
  
    this.apiService.postData("items", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.mapErrors(err.error);
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Item Added successfully";
        this.description = "";
        this.defaultPurchasePrice = "";
        this.defaultPurchaseVendor = "";
        this.defaultTaxAccount = "";
        this.openingStock = "";
      },
    });
  }

  mapErrors(errors) {
    for (var i = 0; i < errors.length; i++) {
      let key = errors[i].path;
      let length = key.length;

      //make array of message to remove the fieldName
      let message = errors[i].message.split(" ");
      delete message[0];

      //new message
      let modifiedMessage = `This field${message.join(" ")}`;

      if (length == 1) {
        //single object
        this.validationErrors[key[0]].error = true;
        this.validationErrors[key[0]].message = modifiedMessage;
      } else if (length == 2) {
        //two dimensional object
        this.validationErrors[key[0]][key[1]].error = true;
        this.validationErrors[key[0]][key[1]].message = modifiedMessage;
      }
    }
  }

  updateValidation(first, second = "") {
    if (second == "") {
      this.validationErrors[first].error = false;
    } else {
      this.validationErrors[first][second].error = false;
    }
  } 


}
