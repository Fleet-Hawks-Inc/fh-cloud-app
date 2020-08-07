import { AfterViewInit, Component, OnInit } from "@angular/core";
import {Title} from "@angular/platform-browser";
import { ApiService } from "../../../api.service";
import { Router, ActivatedRoute } from "@angular/router";
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
  public assetID;
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
  constructor(private apiService: ApiService,private route: ActivatedRoute,private titleService:Title, private router: Router,private toastr: ToastrService) {
    
  }

  ngOnInit() {
    this.fetchQuantum();
    this.fetchManufactuer();
    this.fetchCountries();
    this.fetchInspectionForms();
    this.assetID = this.route.snapshot.params["assetID"];
    if(this.route.snapshot.params["assetID"]){
      this.titleService.setTitle("Update Asset");
      this.fetchAsset()
    } 
    
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

  fetchAsset() {
    this.apiService
      .getData("assets/" + this.assetID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log("assets", this.assetsData)
        console.log(result);
        this.assetsData['assetID'] = this.assetID;
        this.assetsData['assetName'] = result.assetName;
        this.assetsData['VIN'] = result.VIN;
        this.assetsData['assetDetails']['assetType'] = result.assetDetails.assetType;
        
        this.assetsData['assetDetails']['year'] = result.assetDetails.year;
        this.assetsData['assetDetails']['manufacturerID'] = result.assetDetails.manufacturerID;
        this.assetsData['assetDetails']['modelID'] = result.assetDetails.modelID;
        this.assetsData['assetDetails']['length'] = result.assetDetails.length;
        this.assetsData['assetDetails']['lengthType'] = result.assetDetails.lengthType;
        this.assetsData['assetDetails']['axle'] = result.assetDetails.axle;
        this.assetsData['assetDetails']['GVWR'] = result.assetDetails.GVWR;
        this.assetsData['assetDetails']['gvwrType'] = result.assetDetails.gvwrType;
        this.assetsData['assetDetails']['GAWR'] = result.assetDetails.GAWR;
        this.assetsData['assetDetails']['gawrType'] = result.assetDetails.gawrType;
        this.assetsData['assetDetails']['ownerShip'] = result.assetDetails.ownerShip;
        this.assetsData['assetDetails']['currentStatus'] = result.assetDetails.currentStatus;
        this.assetsData['assetDetails']['plateNumber'] = result.assetDetails.plateNumber;
        this.assetsData['assetDetails']['remarks'] = result.assetDetails.remarks;
        this.assetsData['insuranceDetails']['dateOfIssue'] = result.insuranceDetails.dateOfIssue;
        this.assetsData['insuranceDetails']['premiumAmount'] = result.insuranceDetails.premiumAmount;
        this.assetsData['insuranceDetails']['premiumCurrencyType'] = result.insuranceDetails.premiumCurrencyType;
        this.assetsData['insuranceDetails']['dateOfExpiry'] = result.insuranceDetails.dateOfExpiry;
        this.assetsData['insuranceDetails']['dateOfIssue'] = result.insuranceDetails.dateOfIssue;
        this.assetsData['insuranceDetails']['reminderBeforeExpiry'] = result.insuranceDetails.reminderBeforeExpiry;
        this.assetsData['insuranceDetails']['reminderType'] = result.insuranceDetails.reminderType;
        this.assetsData['insuranceDetails']['vendor'] = result.insuranceDetails.vendor;
        this.assetsData['insuranceDetails']['vendor'] = result.insuranceDetails.vendor;
        // this.assetsData['timeCreated'] = result.timeCreated;
        // this.assetsData['timeModified'] = result.timeModified;
        
        // this.assetInfo.manufacturerID = result.assetInfo.manufacturerID;
        // this.assetInfo.modelID = result.assetInfo.modelID;
        // this.length = result.length;
        // this.axle = result.axle;
        // this.GVWR = result.GVWR;
        // this.GAWR = result.GAWR;
        // this.license.countryID = result.license.countryID;
        // this.license.stateID = result.license.stateID;
        // this.license.plateNumber = result.license.plateNumber;
        // this.ownerShip = result.ownerShip;
        // this.remarks = result.remarks;
        // this.ownerShipStatus = result.ownerShipStatus;
        // this.quantumInfo.UID = result.quantumInfo.UID;
        // this.currentStatus = result.currentStatus;
        // this.timeCreated = result.timeCreated;
      });

  }

  updateAsset() {
    this.hasError = false;
    this.hasSuccess = false;

    console.log("log", this.assetsData)
    this.apiService.putData("assets", this.assetsData).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              console.log("val", val)
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
        console.log("res", res);
        this.response = res;
        this.hasSuccess = true;
        this.toastr.success('Asset updated successfully');
        this.router.navigateByUrl('/fleet/assets/Assets-List');
        this.Success = "";
      },
    });
  }
}
