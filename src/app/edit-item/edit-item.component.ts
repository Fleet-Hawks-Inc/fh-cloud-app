import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";

@Component({
  selector: "app-edit-item",
  templateUrl: "./edit-item.component.html",
  styleUrls: ["./edit-item.component.css"],
})
export class EditItemComponent implements OnInit {
  title = "Edit Item";

  /**
   * Form props
   */
  vendors: [];
  itemID = "";
  itemName = "";
  description = "";
  defaultPurchasePrice = "";
  defaultPurchaseVendor = "";
  defaultTaxAccount = "";
  openingStock = "";
  timeCreated = "";

  /**
   * Form errors props
   */
  validationErrors = {
    itemName: {
      error: false,
    },
    description: {
      error: false,
    },
    defaultPurchasePrice: {
      error: false,
    },
    defaultPurchaseVendor: {
      error: false,
    },
    defaultTaxAccount: {
      error: false,
    },
    openingStock: {
      error: false,
    },
  };
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}
  ngOnInit() {
    this.itemID = this.route.snapshot.params["itemID"];
    this.fetchVendors();
    this.fetchItem();
  }

  fetchVendors(){
    this.apiService.getData('vendors')
    .subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }

  fetchItem() {
    this.apiService.getData("items/" + this.itemID).subscribe((result: any) => {
      result = result.Items[0];

      this.itemID = result.itemID;
      this.itemName = result.itemName;
      this.defaultPurchasePrice = result.defaultPurchasePrice;
      this.defaultPurchaseVendor = result.defaultPurchaseVendor;
      this.defaultTaxAccount = result.defaultTaxAccount;
      this.description = result.description;
      this.openingStock = result.openingStock;
      this.timeCreated = result.timeCreated;
    });
  }

  updateItem() {
    this.hasError = false;
    this.hasSuccess = false;

    let data = {
      itemID: this.itemID,
      itemName: this.itemName,
      description: this.description,
      defaultPurchasePrice: this.defaultPurchasePrice,
      defaultPurchaseVendor: this.defaultPurchaseVendor,
      defaultTaxAccount: this.defaultTaxAccount,
      openingStock: this.openingStock,
      timeCreated: this.timeCreated,
    };

    this.apiService.putData("items", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.mapErrors(err.error);
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Item updated successfully";
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
