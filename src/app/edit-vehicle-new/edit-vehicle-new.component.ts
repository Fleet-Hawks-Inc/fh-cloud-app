import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { ActivatedRoute } from "@angular/router";

declare var $: any;

@Component({
  selector: "app-edit-vehicle-new",
  templateUrl: "./edit-vehicle-new.component.html",
  styleUrls: ["./edit-vehicle-new.component.css"],
})
export class EditVehicleNewComponent implements OnInit {
  title = "Add Vehicles";
  activeTab = "details";

  /**
   * Quantum Prop
   */
  quantumsList = [];
  quantum = "";
  quantumSelected = "";

  /**
   * Vehicle Prop
   */
  vehicleID = "";
  vehicleName = "";
  VIN = "";
  year = "";
  make = "";
  model = "";
  state = "";
  plateNumber = "";
  serviceProgram = "";
  currentStatus = "";
  group = "";
  ownership = "";
  additionalDetails = {
    vehicleColor: "",
    bodyType: "",
    bodySubType: "",
  };
  lifeCycle = {
    estimatedServiceLifeInMonths: "",
    estimatedServiceLifeInMiles: "",
  };
  dimensions = {
    width: "",
    height: "",
    length: "",
    interiorVolume: "",
    passengerVolume: "",
    cargoVolume: "",
    groundClearance: "",
    badLength: "",
  };
  weight = {
    curbWeight: "",
    grossVehicleWeightRating: "",
  };
  performace = {
    towingCapacity: "",
    maxPayload: "",
  };
  fuelEconomy = {
    EPACity: "",
    EPAHighway: "",
    EPACombined: "",
  };
  fuel = {
    fuelType: "",
    fuelTank1Capacity: "",
    fuelTank2Capacity: "",
  };
  oilCapacity = "";
  features = {
    breakSystem: "",
    wheelBase: "",
    rearAxle: "",
    frontTyreType: "",
    frontTrackWidth: "",
    frontWheelDiameter: "",
    frontTyrePSI: "",
    rearTyreType: "",
    rearTrackWidth: "",
    rearWheelDiameter: "",
    rearTyrePSI: "",
  };
  settings = {
    primaryMeter: "",
    fuelUnit: "",
    measurementUnit: "",
  };
  safetyParameters = {
    hardBreakingParameters: "",
    hardAccelrationParameters: "",
    turningParameters: "",
  };

  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.vehicleID = this.route.snapshot.params["vehicleID"];

    this.apiService.getData("quantums").subscribe((result: any) => {
      this.quantumsList = result.Items;
    });

    this.apiService
      .getData("vehicles/" + this.vehicleID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.vehicleName = result.vehicleName;
        this.VIN = result.VIN;
        this.year = result.year;
        this.make = result.make;
        this.model = result.model;
        this.state = result.state;
        this.plateNumber = result.plateNumber;
        this.serviceProgram = result.serviceProgram;
        this.currentStatus = result.currentStatus;
        this.group = result.group;
        this.ownership = result.ownership;
        this.additionalDetails.vehicleColor =
          result.additionalDetails.vehicleColor;
        this.additionalDetails.bodyType = result.additionalDetails.bodyType;
        (this.additionalDetails.bodySubType =
          result.additionalDetails.bodySubType),
          (this.lifeCycle.estimatedServiceLifeInMonths =
            result.lifeCycle.estimatedServiceLifeInMonths),
          (this.lifeCycle.estimatedServiceLifeInMiles =
            result.lifeCycle.estimatedServiceLifeInMiles);

        this.dimensions.width = result.dimensions.width;
        this.dimensions.height = result.dimensions.height;
        this.dimensions.length = result.dimensions.length;
        this.dimensions.interiorVolume = result.dimensions.interiorVolume;
        this.dimensions.passengerVolume = result.dimensions.passengerVolume;
        this.dimensions.cargoVolume = result.dimensions.cargoVolume;
        this.dimensions.groundClearance = result.dimensions.groundClearance;
        this.dimensions.badLength = result.dimensions.badLength;

        this.weight.curbWeight = result.weight.curbWeight;
        this.weight.grossVehicleWeightRating =
          result.weight.grossVehicleWeightRating;

        this.performace.towingCapacity = result.performace.towingCapacity;
        this.performace.maxPayload = result.performace.maxPayload;

        this.fuelEconomy.EPACity = result.fuelEconomy.EPACity;
        this.fuelEconomy.EPAHighway = result.fuelEconomy.EPAHighway;
        this.fuelEconomy.EPACombined = result.fuelEconomy.EPACombined;

        this.fuel.fuelType = result.fuel.fuelType;
        this.fuel.fuelTank1Capacity = result.fuel.fuelTank1Capacity;
        this.fuel.fuelTank2Capacity = result.fuel.fuelTank2Capacity;

        this.oilCapacity = result.oilCapacity;
        this.features.breakSystem = result.features.breakSystem;
        this.features.wheelBase = result.features.wheelBase;
        this.features.rearAxle = result.features.rearAxle;
        this.features.frontTyreType = result.features.frontTyreType;
        this.features.frontTrackWidth = result.features.frontTrackWidth;
        this.features.frontWheelDiameter = result.features.frontWheelDiameter;
        this.features.frontTyrePSI = result.features.frontTyrePSI;
        this.features.rearTyreType = result.features.rearTyreType;
        this.features.rearTrackWidth = result.features.rearTrackWidth;
        this.features.rearWheelDiameter = result.features.rearWheelDiameter;
        this.features.rearTyrePSI = result.features.rearTyrePSI;

        this.settings.primaryMeter = result.settings.primaryMeter;
        this.settings.fuelUnit = result.settings.fuelUnit;
        this.settings.measurementUnit = result.settings.measurementUnit;

        this.safetyParameters.hardBreakingParameters =
          result.safetyParameters.hardBreakingParameters;
        this.safetyParameters.hardAccelrationParameters =
          result.safetyParameters.hardAccelrationParameters;
        this.safetyParameters.turningParameters =
          result.safetyParameters.turningParameters;
        this.quantum = result.quantumInfo;

        $("#hardBreakingParametersValue").html(
          this.safetyParameters.hardBreakingParameters
        );
        $("#hardAccelrationParametersValue").html(
          this.safetyParameters.hardAccelrationParameters
        );
        $("#turningParametersValue").html(
          this.safetyParameters.turningParameters
        );
      });

    //console.log(this.vehicleID);
  }

  updateVehicle() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      vehicleID: this.vehicleID,
      vehicleName: this.vehicleName,
      VIN: this.VIN,
      year: this.year,
      make: this.make,
      model: this.model,
      state: this.state,
      plateNumber: this.plateNumber,
      serviceProgram: this.serviceProgram,
      currentStatus: this.currentStatus,
      group: this.group,
      ownership: this.ownership,
      additionalDetails: {
        vehicleColor: this.additionalDetails.vehicleColor,
        bodyType: this.additionalDetails.bodySubType,
        bodySubType: this.additionalDetails.bodySubType,
      },
      lifeCycle: {
        estimatedServiceLifeInMonths: this.lifeCycle
          .estimatedServiceLifeInMonths,
        estimatedServiceLifeInMiles: this.lifeCycle.estimatedServiceLifeInMiles,
      },
      dimensions: {
        width: this.dimensions.width,
        height: this.dimensions.height,
        length: this.dimensions.length,
        interiorVolume: this.dimensions.interiorVolume,
        passengerVolume: this.dimensions.passengerVolume,
        cargoVolume: this.dimensions.cargoVolume,
        groundClearance: this.dimensions.groundClearance,
        badLength: this.dimensions.badLength,
      },
      weight: {
        curbWeight: this.weight.curbWeight,
        grossVehicleWeightRating: this.weight.grossVehicleWeightRating,
      },
      performace: {
        towingCapacity: this.performace.towingCapacity,
        maxPayload: this.performace.maxPayload,
      },
      fuelEconomy: {
        EPACity: this.fuelEconomy.EPACity,
        EPAHighway: this.fuelEconomy.EPAHighway,
        EPACombined: this.fuelEconomy.EPACombined,
      },
      fuel: {
        fuelType: this.fuel.fuelType,
        fuelTank1Capacity: this.fuel.fuelTank1Capacity,
        fuelTank2Capacity: this.fuel.fuelTank2Capacity,
      },
      oilCapacity: this.oilCapacity,
      features: {
        breakSystem: this.features.breakSystem,
        wheelBase: this.features.wheelBase,
        rearAxle: this.features.rearAxle,
        frontTyreType: this.features.frontTyreType,
        frontTrackWidth: this.features.frontTrackWidth,
        frontWheelDiameter: this.features.frontWheelDiameter,
        frontTyrePSI: this.features.frontTyrePSI,
        rearTyreType: this.features.rearTyreType,
        rearTrackWidth: this.features.rearTrackWidth,
        rearWheelDiameter: this.features.rearWheelDiameter,
        rearTyrePSI: this.features.rearTyreType,
      },
      settings: {
        primaryMeter: this.settings.primaryMeter,
        fuelUnit: this.settings.fuelUnit,
        measurementUnit: this.settings.measurementUnit,
      },
      safetyParameters: {
        hardBreakingParameters: this.safetyParameters.hardBreakingParameters,
        hardAccelrationParameters: this.safetyParameters
          .hardAccelrationParameters,
        turningParameters: this.safetyParameters.turningParameters,
      },
      quantumInfo: this.quantum,
    };

    this.apiService.putData("vehicles", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Vehicle Updated successfully";
      },
    });
  }

  new_details() {
    this.activeTab = "details";
    document.getElementById("vehicle_new_details").style.display = "block";
    document.getElementById("vehicle_new_lifecycle").style.display = "none";
    document.getElementById("vehicle_new_specifications").style.display =
      "none";
    document.getElementById("vehicle_new_fluids").style.display = "none";
    document.getElementById("vehicle_new_wheels").style.display = "none";
    document.getElementById("vehicle_new_settings").style.display = "none";
  }
  new_lifecycle() {
    this.activeTab = "lifeCycle";
    document.getElementById("vehicle_new_details").style.display = "none";
    document.getElementById("vehicle_new_lifecycle").style.display = "block";
    document.getElementById("vehicle_new_specifications").style.display =
      "none";
    document.getElementById("vehicle_new_fluids").style.display = "none";
    document.getElementById("vehicle_new_wheels").style.display = "none";
    document.getElementById("vehicle_new_settings").style.display = "none";
  }
  new_specifications() {
    this.activeTab = "specifications";
    document.getElementById("vehicle_new_details").style.display = "none";
    document.getElementById("vehicle_new_lifecycle").style.display = "none";
    document.getElementById("vehicle_new_specifications").style.display =
      "block";
    document.getElementById("vehicle_new_fluids").style.display = "none";
    document.getElementById("vehicle_new_wheels").style.display = "none";
    document.getElementById("vehicle_new_settings").style.display = "none";
  }
  new_fluids() {
    this.activeTab = "fluids";
    document.getElementById("vehicle_new_details").style.display = "none";
    document.getElementById("vehicle_new_lifecycle").style.display = "none";
    document.getElementById("vehicle_new_specifications").style.display =
      "none";
    document.getElementById("vehicle_new_fluids").style.display = "block";
    document.getElementById("vehicle_new_wheels").style.display = "none";
    document.getElementById("vehicle_new_settings").style.display = "none";
  }
  new_wheels() {
    this.activeTab = "wheel&Tyres";
    document.getElementById("vehicle_new_details").style.display = "none";
    document.getElementById("vehicle_new_lifecycle").style.display = "none";
    document.getElementById("vehicle_new_specifications").style.display =
      "none";
    document.getElementById("vehicle_new_fluids").style.display = "none";
    document.getElementById("vehicle_new_wheels").style.display = "block";
    document.getElementById("vehicle_new_settings").style.display = "none";
  }
  new_engine() {
    document.getElementById("vehicle_new_details").style.display = "none";
    document.getElementById("vehicle_new_lifecycle").style.display = "none";
    document.getElementById("vehicle_new_specifications").style.display =
      "none";
    document.getElementById("vehicle_new_fluids").style.display = "none";
    document.getElementById("vehicle_new_wheels").style.display = "none";
    document.getElementById("vehicle_new_settings").style.display = "none";
  }
  new_settings() {
    this.activeTab = "settings";
    document.getElementById("vehicle_new_details").style.display = "none";
    document.getElementById("vehicle_new_lifecycle").style.display = "none";
    document.getElementById("vehicle_new_specifications").style.display =
      "none";
    document.getElementById("vehicle_new_fluids").style.display = "none";
    document.getElementById("vehicle_new_wheels").style.display = "none";
    document.getElementById("vehicle_new_settings").style.display = "block";
  }

  onChangePrimaryMeter(value: any) {
    this.settings.primaryMeter = value;
    console.log(value);
    console.log(this.settings);
  }

  onChangeFuelUnit(value: any) {
    this.settings.fuelUnit = value;
  }

  onChangeMeasurementUnit(value: any) {
    this.settings.measurementUnit = value;
  }

  onChangeHardBreakingParameters(value: any) {
    this.safetyParameters.hardBreakingParameters = value;
    console.log(value);
    $("#hardBreakingParametersValue").html(value);
  }

  onChangeAccelrationParameters(value: any) {
    this.safetyParameters.hardAccelrationParameters = value;
    $("#hardAccelrationParametersValue").html(value);
  }

  onChangeturningParameters(value: any) {
    this.safetyParameters.turningParameters = value;
    $("#turningParametersValue").html(value);
  }
  quantumModal() {
    $(document).ready(function () {
      $("#quantumModal").modal("show");
    });
  }

  onChange(newValue) {
    this.quantum = newValue;
  }
}
