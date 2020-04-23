import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { ActivatedRoute, Router } from "@angular/router";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: "app-edit-asset",
  templateUrl: "./edit-asset.component.html",
  styleUrls: ["./edit-asset.component.css"],
})
export class EditAssetComponent implements OnInit {
  title = "Edit Assets";

  /********** Form Fields ***********/
  assetID= "";
  assetName = "";
  VIN = "";
  assetType = "";
  year = "";
  assetInfo = {
    year: "",
    manufacturerID: "",
    modelID: "",
  };
  length: "";
  axle = "";
  GVWR = "";
  GAWR = "";
  license = {
    stateID: "",
    plateNumber: "",
  };

  ownerShip = "";
  remarks = "";
  ownerShipStatus = "";
  quantumInfo = {
    UID: "",
  };
  currentStatus = "";
  timeCreated = "";

  quantum = "";
  quantumsList = [];
  /******************/

  /**
   * Form errors prop
   */
  validationErrors = {
    assetName: {
      error: false,
    },
    VIN: {
      error: false,
    },
    assetType: {
      error: false,
    },
    assetInfo: {
      year: {
        error: false,
      },
      manufacturerID: {
        error: false,
      },
      modelID: {
        error: false,
      },
    },
    length: {
      error: false,
    },
    axle: {
      error: false,
    },
    GVWR: {
      error: false,
    },
    GAWR: {
      error: false,
    },
    license: {
      stateID: {
        error: false,
      },
      plateNumber: {
        error: false,
      },
    },
    ownerShip: {
      error: false,
    },
    remarks: {
      error: false,
    },
    ownerShipStatus: {
      error: false,
    },
    quantumInfo: {
      UID: {
        error: false,
      },
    },
    currentStatus: {
      error: false,
    },
  };

  countryID = "";
  countries = "";
  manufacturers = [];
  states = [];
  models = []
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.assetID = this.route.snapshot.params['assetID'];
    this.fetchManufactuer();
    this.fetchCountries();
    this.apiService.getData("quantums").subscribe((result: any) => {
      this.quantumsList = result.Items;
    });

    this.fetchAsset();
  }


  getModels(){
    this.apiService.getData(`models/manufacturerID/${this.assetInfo.manufacturerID}`)
    .subscribe((result: any) => {
      this.models = result.Items;
    });
  }

  fetchCountries(){
    this.apiService.getData(`countries`)
    .subscribe((result: any) => {
      this.countries = result.Items;
    });
  }

  getStates(){
    this.apiService.getData(`states/countryID/${this.countryID}`)
    .subscribe((result: any) => {
      this.states = result.Items;
    });
  }

  fetchManufactuer(){
    this.apiService.getData('manufacturers')
    .subscribe((result: any) => {
      this.manufacturers = result.Items;
    });
  }

  fetchModel(){
    this.apiService.getData('models')
    .subscribe((result: any) => {
      this.models = result.Items;
    });
  }

  fetchState(){
    this.apiService.getData('states')
    .subscribe((result: any) => {
      this.states = result.Items;
    });
  }


  fetchAsset() {
    this.apiService.getData("assets/" + this.assetID).subscribe((result: any) => {
      result = result.Items[0];
      
      this.assetName = result.assetName;
      this.VIN = result.VIN;
      this.assetType = result.assetType;
      this.assetInfo.year = result.assetInfo.year;
      this.assetInfo.manufacturerID = result.assetInfo.manufacturerID;
      this.assetInfo.modelID = result.assetInfo.modelID;
      this.length = result.length;
      this.axle = result.axle;
      this.GVWR = result.GVWR;
      this.GAWR = result.GAWR;
      this.license.stateID = result.license.stateID;
      this.license.plateNumber = result.license.plateNumber;
      this.ownerShip = result.ownerShip;
      this.remarks = result.remarks;
      this.ownerShipStatus = result.ownerShipStatus;
      this.quantumInfo.UID = result.quantumInfo.UID;
      this.currentStatus = result.currentStatus;
      this.timeCreated = result.timeCreated;
    });
  }


  quantumModal() {
    $(document).ready(function () {
      $("#modalAnim").modal("show");
    });
  }

  onChange(newValue) {
    this.quantum = newValue;
    this.quantumInfo.UID = newValue;
  }

  updateAsset() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      assetID: this.assetID,
      assetName: this.assetName,
      VIN: this.VIN,
      assetType: this.assetType,
      assetInfo: {
        year: this.assetInfo.year,
        manufacturerID: this.assetInfo.manufacturerID,
        modelID: this.assetInfo.modelID,
      },
      length: this.length,
      axle: this.axle,
      GVWR: this.GVWR,
      GAWR: this.GAWR,
      license: {
        stateID: this.license.stateID,
        plateNumber: this.license.plateNumber,
      },
      ownerShip: this.ownerShip,
      remarks: this.remarks,
      ownerShipStatus: this.ownerShipStatus,
      quantumInfo: {
        UID: this.quantumInfo.UID,
      },
      currentStatus: this.currentStatus,
      timeCreated: this.timeCreated
    };
    
    this.apiService.putData("assets", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.mapErrors(err.error);
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Asset updated successfully";
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
        this.validationErrors[key[0]].message = errors[i].message;
      } else if (length == 2) {
        //two dimensional object
        this.validationErrors[key[0]][key[1]].error = true;
        this.validationErrors[key[0]][key[1]].message = errors[i].message;
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
