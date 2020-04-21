import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-vendor",
  templateUrl: "./add-vendor.component.html",
  styleUrls: ["./add-vendor.component.css"],
})
export class AddVendorComponent implements OnInit {
  parentTitle = "Vendors";
  title = "Add Vendor";

  /**
   * Form Props
   */
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


  countries = [];
  states = [];
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
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchCountries()
    this.fetchStates();
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

  addVendor() {
    let data = {
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
    };

    this.apiService.postData("vendors", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.mapErrors(err.error);
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Vendor Added successfully";
        this.vendorName = "";
        this.vendorType = "";
        this.geoLocation = {
          latitude: "",
          longitude: "",
        };
        this.address = "";
        this.stateID = "";
        this.countryID = "";
        this.taxID = "";
        this.creditDays = "";
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
    console.log(this.validationErrors);
  }

  updateValidation(first, second = "") {
    if (second == "") {
      this.validationErrors[first].error = false;
    } else {
      this.validationErrors[first][second].error = false;
    }
  }
}
