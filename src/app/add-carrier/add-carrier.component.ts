import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../api.service";
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { Object } from "aws-sdk/clients/s3";
declare var $: any;

@Component({
  selector: "app-add-carrier",
  templateUrl: "./add-carrier.component.html",
  styleUrls: ["./add-carrier.component.css"],
})
export class AddCarrierComponent implements OnInit {
  title = "Add Carrier";
  activeTab = "company_settings";
  errors = {};
  form;
  concatArrayKeys = "";
  /********** Form Fields ***********/

  carrierName = "";
  taxID = "";
  companyNumber = "";
  address = {
    streetNo: "",
    streetName: "",
    cityID: "",
    stateID: "",
    zipCode: "",
    countryID: "",
  };
  superUserName = "";
  unitSettings = {
    distanceUnit: "",
    liquidUnit: "",
    locale: "",
    weightUnit: "",
    temperatureUnit: "",
  };
  assetSettings = {
    hardBreakingParameters: "",
    hardAccelerationParameters: "",
    corner: "",
    fuelTheftAlertParameters: "",
  };
  driverPerformance = {
    average: 20,
    HB: 20,
    HA: 20,
    corner: 20,
    HOSViolations: 20,
  };
  /******************/

  users = [];
  cities = [];
  states = [];
  countries = [];
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchCountries();
    this.fetchUsers();

    this.assetSettings.hardBreakingParameters = "6";
    this.assetSettings.hardAccelerationParameters = "6";
    this.assetSettings.corner = "6";
    this.assetSettings.fuelTheftAlertParameters = "6";

    $("#hardBreakingParametersValue").html(6);
    $("#hardAccelerationParametersValue").html(6);
    $("#cornerValue").html(6);
    $("#fuelTheftAlertParametersValue").html(6);

    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  fetchCountries() {
    this.apiService.getData("countries").subscribe((result: any) => {
      this.countries = result.Items;
    });
  }

  fetchUsers() {
    this.apiService.getData("users").subscribe((result: any) => {
      this.users = result.Items;
    });
  }

  getStates() {
    this.apiService
      .getData("states/country/" + this.address.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  getCities() {
    this.apiService
      .getData("cities/state/" + this.address.stateID)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }

  company_settings() {
    this.activeTab = "company_settings";
    $("#company_settings").show();
    $("#unit_settings, #asset_settings, #driver_performance").hide();
  }

  unit_settings() {
    this.activeTab = "unit_settings";
    $("#unit_settings").show();
    $("#company_settings, #asset_settings, #driver_performance").hide();
  }

  asset_settings() {
    this.activeTab = "asset_settings";
    $("#asset_settings").show();
    $("#company_settings, #unit_settings, #driver_performance").hide();
  }

  driver_performance() {
    this.activeTab = "driver_performance";
    $("#driver_performance").show();
    $("#company_settings, #asset_settings, #unit_settings").hide();
  }

  addCarrier() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    //total of driver performance must be equal to 100
    if (
      this.driverPerformance.average +
      this.driverPerformance.HB +
      this.driverPerformance.HA +
      this.driverPerformance.corner +
      this.driverPerformance.HOSViolations != 100
    ) {
      alert('Sum of driver performance must be 100')
      return false;
    }
    // console.log('----------------------');
    // console.log(this.carrierName);

    // if(!this.carrierName && !this.taxID && !this.companyNumber && !this.address.streetNo && !this.address.streetName && !this.address.cityID && !this.address.stateID && !this.address.zipCode && !this.address.countryID && !this.superUserName){
    //     return false;

    // } else if(!this.unitSettings.distanceUnit && !this.unitSettings.liquidUnit && !this.unitSettings.locale && !this.unitSettings.weightUnit && !this.unitSettings.temperatureUnit){
    //     this.unit_settings();
    //     return false;

    // } else if(!this.assetSettings.hardBreakingParameters && !this.assetSettings.hardAccelerationParameters && !this.assetSettings.corner && !this.assetSettings.fuelTheftAlertParameters){
    //       this.asset_settings();
    //       return false;
          
    // } else if(!this.driverPerformance.average && !this.driverPerformance.HB && !this.driverPerformance.HA && !this.driverPerformance.corner && !this.driverPerformance.HOSViolations){
    //   this.driver_performance();
    // }
    
    const data = {
      carrierName: this.carrierName,
      taxID: this.taxID,
      companyNumber: this.companyNumber,
      address: {
        streetNo: this.address.streetNo,
        streetName: this.address.streetName,
        cityID: this.address.cityID,
        stateID: this.address.stateID,
        zipCode: this.address.zipCode,
        countryID: this.address.countryID,
      },
      superUserName: this.superUserName,
      unitSettings: {
        distanceUnit: this.unitSettings.distanceUnit,
        liquidUnit: this.unitSettings.liquidUnit,
        locale: this.unitSettings.locale,
        weightUnit: this.unitSettings.weightUnit,
        temperatureUnit: this.unitSettings.temperatureUnit,
      },
      assetSettings: {
        hardBreakingParameters: this.assetSettings.hardBreakingParameters,
        hardAccelerationParameters: this.assetSettings
          .hardAccelerationParameters,
        corner: this.assetSettings.corner,
        fuelTheftAlertParameters: this.assetSettings.fuelTheftAlertParameters,
      },
      driverPerformance: {
        average: this.driverPerformance.average,
        HB: this.driverPerformance.HB,
        HA: this.driverPerformance.HA,
        corner: this.driverPerformance.corner,
        HOSViolations: this.driverPerformance.HOSViolations,
      },
    };
    //  console.log(data);return;
    this.apiService.postData("carriers", data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              console.log(this.errors);
              this.throwErrors();
              // console.log('-----------errore=======');
              // console.log(this.errors['carrierName']);

              if(this.errors['carrierName'] && this.errors['taxID'] && this.errors['companyNumber'] && this.errors['address.streetNo'] && this.errors['address.streetName'] && this.errors['address.cityID'] && this.errors['address.stateID'] && this.errors['address.zipCode'] && this.errors['address.countryID'] && this.errors['superUserName']){
                  this.company_settings();
                  // alert('stay here');
                  return false;
              } else if(this.errors['unitSettings.distanceUnit'] && this.errors['unitSettings.liquidUnit'] && this.errors['unitSettings.locale'] && this.errors['unitSettings.weightUnit'] && this.errors['unitSettings.temperatureUnit']){
                    this.unit_settings();
                    return false;
              } 
              // else if(this.errors['assetSettings.hardBreakingParameters'] && this.errors['assetSettings.hardAccelerationParameters'] && this.errors['assetSettings.corner'] && this.errors['assetSettings.fuelTheftAlertParameters']){
              //       this.asset_settings();
              //       return false;
                    
              // } else if(this.errors['driverPerformance.average'] && this.errors['driverPerformance.HB'] && this.errors['driverPerformance.HA'] && this.errors['driverPerformance.corner'] && this.errors['driverPerformance.HOSViolations']){
              //   this.driver_performance();
              // }
            },
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Carrier Added successfully";
        this.carrierName = "";
        this.taxID = "";
        this.companyNumber = "";
        this.address = {
          streetNo: "",
          streetName: "",
          cityID: "",
          stateID: "",
          zipCode: "",
          countryID: "",
        };
        this.superUserName = "";
        this.unitSettings = {
          distanceUnit: "",
          liquidUnit: "",
          locale: "",
          weightUnit: "",
          temperatureUnit: "",
        };
        this.assetSettings = {
          hardBreakingParameters: "",
          hardAccelerationParameters: "",
          corner: "",
          fuelTheftAlertParameters: "",
        };
        this.driverPerformance = {
          average: 20,
          HB: 20,
          HA: 20,
          corner: 20,
          HOSViolations: 20,
        };
      },
    });
  }

  onChangeHardBreakingParameters(value: any) {
    this.assetSettings.hardBreakingParameters = value;
    $("#hardBreakingParametersValue").html(value);
  }

  onChangeAccelrationParameters(value: any) {
    this.assetSettings.hardAccelerationParameters = value;
    $("#hardAccelerationParametersValue").html(value);
  }

  onChangeCorner(value: any) {
    this.assetSettings.corner = value;
    $("#cornerValue").html(value);
  }

  onChangeFuelTheftAlertParameters(value: any) {
    this.assetSettings.fuelTheftAlertParameters = value;
    $("#fuelTheftAlertParametersValue").html(value);
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  concatArray(path) {
    this.concatArrayKeys = "";
    for (const i in path) {
      this.concatArrayKeys += path[i] + ".";
    }
    this.concatArrayKeys = this.concatArrayKeys.substring(
      0,
      this.concatArrayKeys.length - 1
    );
    return this.concatArrayKeys;
  }
}
