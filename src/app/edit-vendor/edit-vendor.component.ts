import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.css']
})
export class EditVendorComponent implements OnInit {
  parentTitle = "Vendors";
  title = "Edit Vendor";

  /**
   * Form Props
   */
  vendorID = "";
  vendorName = "";
  vendorType = "";
  geoLocation = {
    latitude: "",
    longitude: "",
  };
  address = "";
  stateID = "";
  countryID = "";
  taxID = "";
  creditDays = "";
  timeCreated = "";

  countries = [];
  states = [];
  taxAccounts = [];

  /**
   * Form errors prop
   */
  validationErrors = {
    vendorName: {
      error: false,
    },
    vendorType: {
      error: false,
    },
    geoLocation: {
      latitude: {
        error: false,
      },
      longitude: {
        error: false,
      },
    },
    address: {
      error: false,
    },
    countryID: {
      error: false,
    },
    stateID: {
      error: false,
    },
    taxID: {
      error: false,
    },
    creditDays: {
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
    this.vendorID = this.route.snapshot.params["vendorID"];
    this.fetchCountries()
    this.fetchStates();
    this.fetchAccounts();
    this.fetchVendor();
  }

  fetchAccounts(){
    this.apiService.getData(`accounts/accountType/Tax`)
    .subscribe((result: any) => {
      this.taxAccounts = result.Items;
    });
  }

  fetchCountries(){
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  fetchStates(){
    this.apiService.getData('states')
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

    /**
   * fetch User data
   */
  fetchVendor() {
    this.apiService
      .getData(`vendors/${this.vendorID}`)
      .subscribe((result: any) => {
        result = result.Items[0];

        this.vendorName = result.vendorName;
        this.vendorType = result.vendorType;
        this.geoLocation = {
          latitude: result.geoLocation.latitude,
          longitude: result.geoLocation.longitude,
        };
        this.address = result.address;
        this.stateID = result.stateID;
        this.countryID = result.countryID;
        this.taxID = result.taxID;
        this.creditDays = result.creditDays;
        this.timeCreated = result.timeCreated;
      });
  }


  updateVendor() {
    let data = {
      vendorID: this.vendorID,
      vendorName: this.vendorName,
      vendorType: this.vendorType,
      geoLocation: {
        latitude: this.geoLocation.latitude,
        longitude: this.geoLocation.longitude,
      },
      address: this.address,
      stateID: this.stateID,
      countryID: this.countryID,
      taxID: this.taxID,
      creditDays: this.creditDays,
      timeCreated: this.timeCreated
    };

    this.apiService.putData("vendors", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.mapErrors(err.error);
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Vendor updated successfully";
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
