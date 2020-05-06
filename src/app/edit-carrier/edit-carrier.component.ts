import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { Object } from "aws-sdk/clients/s3";
declare var $: any;

@Component({
  selector: "app-edit-carrier",
  templateUrl: "./edit-carrier.component.html",
  styleUrls: ["./edit-carrier.component.css"],
})
export class EditCarrierComponent implements OnInit {
  title = "Edit Carrier";
  activeTab = "company_settings";
  errors = {};
  form;
  concatArrayKeys = "";
  /********** Form Fields ***********/

  carrierID = "";
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
    average: 0,
    HB: 0,
    HA: 0,
    corner: 0,
    HOSViolations: 0,
  };
  timeCreated = "";
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

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.carrierID = this.route.snapshot.params["carrierID"];
    this.fetchCountries();
    this.fetchUsers();
    this.fetchCarrier();

    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  fetchCarrier() {
    this.apiService
      .getData("carriers/" + this.carrierID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log(result);

        this.carrierName = result.carrierName;
        this.taxID = result.taxID;
        this.companyNumber = result.companyNumber;
        this.address = result.address;
        this.address.streetNo = result.address.streetNo;
        this.address.streetName = result.address.streetName;
        this.address.cityID = result.address.cityID;
        this.address.stateID = result.address.stateID;
        this.address.zipCode = result.address.zipCode;
        this.address.countryID = result.address.countryID;

        this.superUserName = result.superUserName;

        this.unitSettings.distanceUnit = result.unitSettings.distanceUnit;
        this.unitSettings.liquidUnit = result.unitSettings.liquidUnit;
        this.unitSettings.locale = result.unitSettings.locale;
        this.unitSettings.weightUnit = result.unitSettings.weightUnit;
        this.unitSettings.temperatureUnit = result.unitSettings.temperatureUnit;

        this.assetSettings.hardBreakingParameters =
          result.assetSettings.hardBreakingParameters;
        this.assetSettings.hardAccelerationParameters =
          result.assetSettings.hardAccelerationParameters;
        this.assetSettings.corner = result.assetSettings.corner;
        this.assetSettings.fuelTheftAlertParameters =
          result.assetSettings.fuelTheftAlertParameters;

        this.driverPerformance.average = result.driverPerformance.average;
        this.driverPerformance.HB = result.driverPerformance.HB;
        this.driverPerformance.HA = result.driverPerformance.HA;
        this.driverPerformance.corner = result.driverPerformance.corner;
        this.driverPerformance.HOSViolations =
          result.driverPerformance.HOSViolations;
        this.timeCreated = result.timeCreated;
      });

    setTimeout(() => {
      $("#hardBreakingParametersValue").html(
        this.assetSettings.hardBreakingParameters
      );
      $("#hardAccelerationParametersValue").html(
        this.assetSettings.hardAccelerationParameters
      );
      $("#cornerValue").html(this.assetSettings.corner);
      $("#fuelTheftAlertParametersValue").html(
        this.assetSettings.fuelTheftAlertParameters
      );

      this.getStates();
    }, 1000);

    setTimeout(() => {
      this.getCities();
    }, 1000);
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

  updateCarrier() {
    this.hasError = false;
    this.hasSuccess = false;

    //total of driver performance must be equal to 100
    if (
      this.driverPerformance.average +
        this.driverPerformance.HB +
        this.driverPerformance.HA +
        this.driverPerformance.corner +
        this.driverPerformance.HOSViolations !=
      100
    ) {
      alert("Sum of driver performance must be 100");
      return false;
    }

    const data = {
      carrierID: this.carrierID,
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
      timeCreated: this.timeCreated,
    };
    console.log(data);
    //  return;
    this.apiService.putData("carriers", data).subscribe({
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
              this.throwErrors();
            },
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Carrier updated successfully";
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
