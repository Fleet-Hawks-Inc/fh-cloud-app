import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-add-assets",
  templateUrl: "./add-assets.component.html",
  styleUrls: ["./add-assets.component.css"],
})
export class AddAssetsComponent implements OnInit {
  title = "Add Assets";
  errors = {};
  form;
  quantumSelected = '';

  /********** Form Fields ***********/
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
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchQuantum();
    this.fetchManufactuer();
    this.fetchCountries();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  fetchQuantum() {
    this.apiService.getData("quantums").subscribe((result: any) => {
      this.quantumsList = result.Items;
    });
  }

  fetchManufactuer() {
    this.apiService.getData("manufacturers").subscribe((result: any) => {
      this.manufacturers = result.Items;
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

  quantumModal() {
    $(document).ready(function () {
      $("#modalAnim").modal("show");
    });
  }

  onChange(newValue) {
    this.quantum = newValue;
    this.quantumInfo.UID = newValue;
  }

  addAsset() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      assetName: this.assetName,
      VIN: this.VIN,
      assetType: this.assetType,
      assetInfo: {
        year: this.assetInfo.year,
        manufacturerID: this.assetInfo.manufacturerID,
        modelID: this.assetInfo.manufacturerID,
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
    };

    this.apiService.postData("assets", data).subscribe({
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
        this.Success = "Asset added successfully";
        this.assetName = "";
        this.VIN = "";
        this.assetType = "";
        this.assetInfo.year = "";
        this.assetInfo.manufacturerID = "";
        this.assetInfo.modelID = "";
        this.length = "";
        this.axle = "";
        this.GVWR = "";
        this.GAWR = "";
        this.license.stateID = "";
        this.license.plateNumber = "";
        this.ownerShip = "";
        this.remarks = "";
        this.ownerShipStatus = "";
        this.quantumInfo.UID = "";
        this.currentStatus = "";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
