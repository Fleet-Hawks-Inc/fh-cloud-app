import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../../../api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-edit-asset",
  templateUrl: "./edit-asset.component.html",
  styleUrls: ["./edit-asset.component.css"],
})
export class EditAssetComponent implements OnInit {
  title = "Edit Assets";
  errors = {};
  form;
  quantumSelected = '';

  /********** Form Fields ***********/
  assetID = "";
  assetName = "";
  VIN = "";
  assetType = "";
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

  countryID = "";
  countries = "";
  manufacturers = [];
  states = [];
  models = [];
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.assetID = this.route.snapshot.params["assetID"];
    this.fetchManufactuer();
    this.fetchCountries();
    this.apiService.getData("quantums").subscribe((result: any) => {
      this.quantumsList = result.Items;
    });

    this.fetchAsset();
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  getModels() {
    this.apiService
      .getData(`vehicleModels/manufacturer/${this.assetInfo.manufacturerID}`)
      .subscribe((result: any) => {
        this.models = result.Items;
      });
  }

  fetchCountries() {
    this.apiService.getData(`countries`).subscribe((result: any) => {
      this.countries = result.Items;
    });
  }

  getStates() {
    this.apiService
      .getData(`states/country/${this.countryID}`)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  fetchManufactuer() {
    this.apiService.getData("manufacturers").subscribe((result: any) => {
      this.manufacturers = result.Items;
    });
  }

  fetchState() {
    this.apiService.getData("states").subscribe((result: any) => {
      this.states = result.Items;
    });
  }

  fetchAsset() {
    this.apiService
      .getData("assets/" + this.assetID)
      .subscribe((result: any) => {
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

      setTimeout(() => {
        this.fillState();
        this.getModels();
      }, 2000);
  }

  quantumModal() {
    $(document).ready(function () {
      $("#modalAnim").modal("show");
    });
  }

  fillState() {
    this.apiService
      .getData("states/" + this.countryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.countryID = result.countryID;
      });

    setTimeout(() => {
      this.getStates();
    }, 2000);
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
      timeCreated: this.timeCreated,
    };

    this.apiService.putData("assets", data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              console.log(key);
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Asset updated successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
