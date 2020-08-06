import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../../../api.service";
import { Router } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
import { ToastrService } from 'ngx-toastr';
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
  assetsData = {
    assetDetails: {},
    insuranceDetails: {},
    uploadedPhotos: {},
    uploadedDocs: {}
  };

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
  inspectionFormID = "";

  quantum = "";
  quantumsList = [];
  /******************/

  countryID = "";
  countries = "";
  manufacturers = [];
  states = [];
  models = [];
  inspectionForms = [];
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router,private toastr: ToastrService) {}

  ngOnInit() {
    this.fetchQuantum();
    this.fetchManufactuer();
    this.fetchCountries();
    this.fetchInspectionForms();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  fetchQuantum() {
    this.apiService.getData("devices").subscribe((result: any) => {
      this.quantumsList = result.Items;
    });
  }

  fetchManufactuer() {
    this.apiService.getData("manufacturers").subscribe((result: any) => {
      this.manufacturers = result.Items;
    });
  }

  fetchInspectionForms() {
    this.apiService.getData("inspectionForms/type/Trailer").subscribe((result: any) => {
      this.inspectionForms = result.Items;
    });
  }

  getModels() {
    this.apiService
      .getData(`vehicleModels/manufacturer/${this.assetInfo.manufacturerID}`)
      .subscribe((result: any) => {
        console.log("manufac-id", result);
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
    console.log(this.quantumInfo);
  }

  addAsset() {
    console.log("assets", this.assetsData);
    this.errors = {};
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
      inspectionFormID : this.inspectionFormID
    };

    this.apiService.postData("assets", this.assetsData).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              console.log("val", val);
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
              this.Success = '';
            },
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.toastr.success('Driver added successfully');
        this.router.navigateByUrl('/fleet/assets/Assets-List');
        
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
