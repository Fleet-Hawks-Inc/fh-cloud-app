import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../api.service";
import { ActivatedRoute } from "@angular/router";

declare var $: any;

@Component({
  selector: "app-edit-vehicle-new",
  templateUrl: "./edit-vehicle-new.component.html",
  styleUrls: ["./edit-vehicle-new.component.css"],
})
export class EditVehicleNewComponent implements OnInit {
  title = "Edit Vehicle";
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
  basicPrimaryMeter = "";
  spRepeatTime = "";
  spRepeatTimeUnit = "";
  spRepeatOdometer = "";
  serviceProgramID = "";
  inspectionFormID = "";
  currentStatus = "";
  group = "";
 
  ownership = "";
  additionalDetails = {
    vehicleColor: "",
    bodyType: "",
    bodySubType: "",
    MSRP: "",
  };
  lifeCycle = {
    inServiceDate: "",
    inServiceOdometer: "",
    estimatedServiceLifeInMonths: "",
    estimatedServiceLifeInMiles: "",
    estimatedResaleValue: "",
    outServiceDate: "",
    outServiceOdometer: "",
  };
  dimensions = {
    width: "",
    height: "",
    length: "",
    interiorVolume: "",
    passengerVolume: "",
    cargoVolume: "",
    groundClearance: "",
    bedLength: ""
  };
  weight = {
    curbWeight: "",
    grossVehicleWeightRating: ""
  }
  performance = {
    towingCapacity: "",
    maxPayload: ""
  };
  insurance = {
    issueDate: "",
    premiumAmount: "",
    premiumAmountUnit: "",
    expiryDate: "",
    vendorID: "",
    reminderNumber: "",
    reminderNumberUnits: ""
  };
  fuelEconomy = {
    EPACity: "",
    EPAHighway: "",
    EPACombined: ""
  }
  fuel = {
    fuelType: "",
    fuelQuality: "",
    fuelTank1Capacity: "",
    fuelTank2Capacity: ""
  };
  oilCapacity = "";
  features = {
    numberOfTires: "",
    driveType: "",
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
    rearTyrePSI: ""
  };
  engine = {
    engineSummary: "",
    engineBrand: "",
    aspiration: "",
    blockType: "",
    bore: "",
    camType: "",
    stroke: "",
    valves: "",
    compression: "",
    cylinders: "",
    displacement: "",
    fuelInduction: "",
    fuelQuality: "",
    maxHP: "",
    maxTorque: "",
    redlineRPM: "",
  }
  transmission = {
    summary: "",
    brand: "",
    type: "",
    gears: "",
  };
  loan = {
    loanVendor: "",
    loanAmount: "",
    aspiration: "",
    annualPercentageRate: "",
    downPayment: "",
    loanDate: "",
    monthlyPayment: "",
    firstPaymentDate: "",
    numberofPayments: "",
    loanEndDate: "",
    accountNumber: "",
    generateExpenses: "",
    notes: ""
  };
  settings = {
    primaryMeter: "",
    fuelUnit: "",
    measurementUnit: ""
  };
  safetyParameters = {
    hardBreakingParameters: "",
    hardAccelrationParameters: "",
    turningParameters: ""
  };
  timeCreated = "";

  countryID = "";
  servicePrograms = [];
  inspectionForms = [];
  manufacturers = [];
  models = [];
  countries = [];
  states = [];
  groups = [];
  vendors = [];
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  result = {
    additionalDetails: {
      MSRP: "msrp674576",
      bodySubType: "Cargo",
      bodyType: "Full Size",
      vehicleColor: "white"
    },
    basicPrimaryMeter: "Kilometers",
    countryID: "8e8a0700-8979-11ea-94e8-ddabdd2e57f0",
    currentStatus: "Active",
    dimensions: {
      bedLength: "150",
      cargoVolume: "200",
      groundClearance: "60",
      height: "100",
      interiorVolume: "IV100",
      length: "200",
      passengerVolume: "Pjgj",
      width: "100"
    },
    vehicleName: "vehicle name",
    VIN: "1111",
    year: "1981",
    fuel: {
      fuelQuality: "Regular",
      fuelTank1Capacity: "200",
      fuelTank2Capacity: "150",
      fuelType: "CNG"
    },
    fuelEconomy: {
      EPACity: "23",
      EPACombined: "57",
      EPAHighway: "34",
    },
    insurance: {
      expiryDate: { year: 2022, month: 7, day: 30 },
      issueDate: { year: 2020, month: 8, day: 2 },
      premiumAmount: "67",
      premiumAmountUnit: "USD",
      reminderNumber: 34,
      reminderNumberUnits: "Day(s)",
      vendorID: "12ac0c10-9139-11ea-a5bf-c1c713a14945",
    },
    lifeCycle: {
      estimatedResaleValue: "230000",
      estimatedServiceLifeInMiles: "20000",
      estimatedServiceLifeInMonths: "200",
      inServiceDate: { year: 2020, month: 8, day: 2 },
      inServiceOdometer: "12000",
      outServiceDate: { year: 2020, month: 8, day: 9 },
      outServiceOdometer: "11000",
    },
    manufacturerID: "3b39cbd0-8f5f-11ea-b9cd-65629f8a2909",
    modelID: "66bea360-8f65-11ea-9fd7-cd9c4d0152ab",
    oilCapacity: "300",
    ownership: "Owned",
    performance: {
      maxPayload: "500",
      towingCapacity: "300"
    },
    plateNumber: "platenumner345",
    serviceProgramID: "26333b90-ac7e-11ea-861a-f98418d8ea05",
    spRepeatOdometer: "12000",
    spRepeatTime: 12,
    spRepeatTimeUnit: "Week(s)",
    stateID: "51a0ce90-897a-11ea-94e8-ddabdd2e57f0",
    groupID: "da0e0920-abd8-11ea-a3e2-011208633052",
    weight: {
      curbWeight: "200",
      grossVehicleWeightRating: "200"
    },
    features: {
      breakSystem: "Disc",
      driveType: "FWD",
      frontTrackWidth: "front track width",
      frontTyrePSI: "front PSI",
      frontTyreType: "front tire type",
      frontWheelDiameter: "100",
      numberOfTires: "18",
      rearAxle: "10",
      rearTrackWidth: "front track width",
      rearTyrePSI: "rear tire type",
      rearTyreType: "rear tire type",
      rearWheelDiameter: "100",
      wheelBase: "12"
    },
    engine: {
      aspiration: "Naturally Aspirated",
      blockType: "block type",
      bore: "bore",
      camType: "DOHC",
      compression: "compression",
      cylinders: "Cylinders",
      displacement: "Displacement",
      engineBrand: "engine brand",
      engineSummary: "engine summary",
      fuelInduction: "Common Rail Direct Injection",
      fuelQuality: "Regular",
      maxHP: "Max HP",
      maxTorque: "Max Torque",
      redlineRPM: "Redline RPM",
      stroke: "stroke",
      valves: "valves"
    },
    transmission: {
      brand: "Transmission Brand",
      gears: "Transmission Gears",
      summary: "Transmission Summary",
      type: "Automatic"
    },
    loan: {
      accountNumber: "123456788",
      annualPercentageRate: 10,
      aspiration: "loan aspiration",
      downPayment: "down payment ",
      firstPaymentDate: { year: 2020, month: 7, day: 9 },
      generateExpenses: "expenses",
      loanAmount: "5000",
      loanDate: { year: 2020, month: 7, day: 10 },
      loanEndDate: { year: 2020, month: 8, day: 19 },
      loanVendor: "61b8adc0-886c-11ea-9330-cff010647120",
      monthlyPayment: "monthly payment",
      notes: "these are notes about loan",
      numberofPayments: "10"
    },
    safetyParameters: {
      hardAccelrationParameters: "7",
      hardBreakingParameters: "7",
      turningParameters: "7",
    },
    settings: {
      fuelUnit: "gallon (US)",
      measurementUnit: "metric",
      primaryMeter: "miles",
    }
  }
  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    this.vehicleID = this.route.snapshot.params["vehicleID"];
    this.fetchServicePrograms();
    this.fetchInspectionForms();
    this.fetchManufacturers();
    this.fetchCountries();
    this.fetchGroups();
    this.fetchVendors();
    this.apiService.getData("devices").subscribe((result: any) => {
      this.quantumsList = result.Items;
    });

    // this.apiService
    //   .getData("vehicles/" + this.vehicleID)
    //   .subscribe((result: any) => {
    //     result = result.Items[0];
    this.vehicleName = this.result.vehicleName;
    this.VIN = this.result.VIN;
    this.year = this.result.year;
    this.make = this.result.manufacturerID;
    this.model = this.result.modelID;
    this.countryID = this.result.countryID;
    this.state = this.result.stateID;
    this.group = this.result.groupID;
    this.plateNumber = this.result.plateNumber;
    this.serviceProgramID = this.result.serviceProgramID;
    this.basicPrimaryMeter = this.result.basicPrimaryMeter;
    // this.inspectionFormID = this.result.inspectionFormID;
    this.currentStatus = this.result.currentStatus;
    // this.group = this.result.group;
    this.ownership = this.result.ownership;
    this.dimensions = {
      width: this.result.dimensions.width,
      height: this.result.dimensions.height,
      length: this.result.dimensions.length,
      interiorVolume: this.result.dimensions.interiorVolume,
      passengerVolume: this.result.dimensions.passengerVolume,
      cargoVolume: this.result.dimensions.cargoVolume,
      groundClearance: this.result.dimensions.groundClearance,
      bedLength: this.result.dimensions.bedLength,
    }
    this.additionalDetails = {
      vehicleColor: this.result.additionalDetails.vehicleColor,
      bodyType: this.result.additionalDetails.bodyType,
      bodySubType: this.result.additionalDetails.bodySubType,
      MSRP: this.result.additionalDetails.MSRP,
    }

    this.lifeCycle = {
      inServiceDate: this.result.lifeCycle.inServiceDate.toString(),
      inServiceOdometer: this.result.lifeCycle.inServiceOdometer,
      estimatedServiceLifeInMonths: this.result.lifeCycle.estimatedServiceLifeInMonths,
      estimatedServiceLifeInMiles: this.result.lifeCycle.estimatedServiceLifeInMiles,
      estimatedResaleValue: this.result.lifeCycle.estimatedResaleValue,
      outServiceDate: this.result.lifeCycle.outServiceDate.toString(),
      outServiceOdometer: this.result.lifeCycle.outServiceOdometer,
    };
    this.insurance = {
      issueDate: this.result.insurance.issueDate.toString(),
      premiumAmount: this.result.insurance.premiumAmount,
      premiumAmountUnit: this.result.insurance.premiumAmountUnit,
      expiryDate: this.result.insurance.expiryDate.toString(),
      vendorID: this.result.insurance.vendorID,
      reminderNumber: this.result.insurance.reminderNumber.toString(),
      reminderNumberUnits: this.result.insurance.reminderNumberUnits
    };
    this.engine = {
      engineSummary: this.result.engine.engineSummary,
      engineBrand: this.result.engine.engineBrand,
      aspiration: this.result.engine.aspiration,
      blockType: this.result.engine.blockType,
      bore: this.result.engine.bore,
      camType: this.result.engine.camType,
      stroke: this.result.engine.stroke,
      valves: this.result.engine.valves,
      compression: this.result.engine.compression,
      cylinders: this.result.engine.cylinders,
      displacement: this.result.engine.displacement,
      fuelInduction: this.result.engine.fuelInduction,
      fuelQuality: this.result.engine.fuelQuality,
      maxHP: this.result.engine.maxHP,
      maxTorque: this.result.engine.maxTorque,
      redlineRPM: this.result.engine.redlineRPM,
    }
    this.transmission = {
      summary: this.result.transmission.summary,
      brand: this.result.transmission.brand,
      type: this.result.transmission.type,
      gears: this.result.transmission.gears,
    };
    this.loan = {
      loanVendor: this.result.loan.loanVendor,
      loanAmount: this.result.loan.loanAmount,
      aspiration: this.result.loan.aspiration,
      annualPercentageRate: this.result.loan.annualPercentageRate.toString(),
      downPayment: this.result.loan.downPayment,
      loanDate: this.result.loan.loanDate.toString(),
      monthlyPayment: this.result.loan.monthlyPayment,
      firstPaymentDate: this.result.loan.firstPaymentDate.toString(),
      numberofPayments: this.result.loan.numberofPayments,
      loanEndDate: this.result.loan.loanEndDate.toString(),
      accountNumber: this.result.loan.accountNumber,
      generateExpenses: this.result.loan.generateExpenses,
      notes: this.result.loan.notes
    };
    this.weight.curbWeight = this.result.weight.curbWeight;
    this.weight.grossVehicleWeightRating =
      this.result.weight.grossVehicleWeightRating;

    this.performance.towingCapacity = this.result.performance.towingCapacity;
    this.performance.maxPayload = this.result.performance.maxPayload;

    this.fuelEconomy.EPACity = this.result.fuelEconomy.EPACity;
    this.fuelEconomy.EPAHighway = this.result.fuelEconomy.EPAHighway;
    this.fuelEconomy.EPACombined = this.result.fuelEconomy.EPACombined;
    this.fuel = {
      fuelType: this.result.fuel.fuelType,
      fuelQuality: this.result.fuel.fuelQuality,
      fuelTank1Capacity: this.result.fuel.fuelTank1Capacity,
      fuelTank2Capacity: this.result.fuel.fuelTank2Capacity
    };
    this.oilCapacity = this.result.oilCapacity;
    this.features = {
      numberOfTires: this.result.features.numberOfTires,
      driveType: this.result.features.driveType,
      breakSystem: this.result.features.breakSystem,
      wheelBase: this.result.features.wheelBase,
      rearAxle: this.result.features.rearAxle,
      frontTyreType: this.result.features.frontTyreType,
      frontTrackWidth: this.result.features.frontTrackWidth,
      frontWheelDiameter: this.result.features.frontWheelDiameter,
      frontTyrePSI: this.result.features.frontTyrePSI,
      rearTyreType: this.result.features.rearTyreType,
      rearTrackWidth: this.result.features.rearTrackWidth,
      rearWheelDiameter: this.result.features.rearWheelDiameter,
      rearTyrePSI: this.result.features.rearTyrePSI
    };
    this.spRepeatOdometer = this.result.spRepeatOdometer;
    this.spRepeatTime = this.result.spRepeatTime.toString();
    this.spRepeatTimeUnit = this.result.spRepeatTimeUnit;

    this.settings = {
      primaryMeter: this.result.settings.primaryMeter,
      fuelUnit: this.result.settings.fuelUnit,
      measurementUnit: this.result.settings.measurementUnit
    };
    this.safetyParameters = {
      hardBreakingParameters: this.result.safetyParameters.hardBreakingParameters,
      hardAccelrationParameters: this.result.safetyParameters.hardAccelrationParameters,
      turningParameters: this.result.safetyParameters.turningParameters
    };
    // this.settings.primaryMeter = result.settings.primaryMeter;
    // this.settings.fuelUnit = result.settings.fuelUnit;
    // this.settings.measurementUnit = result.settings.measurementUnit;

    // this.safetyParameters.hardBreakingParameters =
    //   result.safetyParameters.hardBreakingParameters;
    // this.safetyParameters.hardAccelrationParameters =
    //   result.safetyParameters.hardAccelrationParameters;
    // this.safetyParameters.turningParameters =
    //   result.safetyParameters.turningParameters;
    // this.quantum = result.quantumInfo;
    // this.timeCreated = result.timeCreated;

    $("#hardBreakingParametersValue").html(
      this.safetyParameters.hardBreakingParameters
    );
    $("#hardAccelrationParametersValue").html(
      this.safetyParameters.hardAccelrationParameters
    );
    $("#turningParametersValue").html(
      this.safetyParameters.turningParameters
    );
    setTimeout(() => {
      this.fillCountry();
      this.fillModel();
    }, 2000);
    // });

    //console.log(this.vehicleID);
  }
  fetchVendors() {
    this.apiService.getData("vendors").subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }
  fetchManufacturers() {
    this.apiService.getData("manufacturers").subscribe((result: any) => {
      this.manufacturers = result.Items;
    });
  }

  fetchCountries() {
    this.apiService.getData("countries").subscribe((result: any) => {
      this.countries = result.Items;
    });

  }

  fetchGroups() {
    this.apiService.getData("groups").subscribe((result: any) => {
      this.groups = result.Items;
    });
  }

  getStates() {
    this.apiService
      .getData("states/country/" + this.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
  fillCountry() {
    this.apiService
      .getData("states/" + this.state)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.countryID = result.countryID;
      });

    setTimeout(() => {
      this.getStates();
    }, 2000);
  }
  fillModel() {
    this.apiService.getData('vehicleModels/' + this.model).subscribe((result: any) => {
      result = result.Items[0];
      this.make = result.manufacturerID;
    });
    setTimeout(() => {
      this.getModels();
    }, 2000);
  }
  getModels() {
    this.apiService
      .getData(`vehicleModels/manufacturer/${this.make}`)
      .subscribe((result: any) => {
        this.models = result.Items;
      });
  }

  fetchServicePrograms() {
    this.apiService.getData("servicePrograms").subscribe((result: any) => {
      this.servicePrograms = result.Items;
    });
  }

  fetchInspectionForms() {
    this.apiService.getData("inspectionForms").subscribe((result: any) => {
      this.inspectionForms = result.Items;
      console.log(this.inspectionForms);
    });
  }
  updateVehicle() {
    this.hasError = false;
    this.hasSuccess = false;
    const data = {
      vehicleName: this.vehicleName,
      VIN: this.VIN,
      year: this.year,
      manufacturerID: this.make,
      modelID: this.model,
      stateID: this.state,
      countryID : this.countryID,
      plateNumber: this.plateNumber,
      basicPrimaryMeter:this.basicPrimaryMeter,
      spRepeatTime: this.spRepeatTime,
      spRepeatTimeUnit : this.spRepeatTimeUnit,
      spRepeatOdometer:this.spRepeatOdometer,
      serviceProgramID: this.serviceProgramID,
      inspectionFormID: this.inspectionFormID,
      currentStatus: this.currentStatus,
      groupID: this.group,
      ownership: this.ownership,
      additionalDetails: {
        vehicleColor: this.additionalDetails.vehicleColor,
        bodyType: this.additionalDetails.bodySubType,
        bodySubType: this.additionalDetails.bodySubType,
        MSRP: this.additionalDetails.MSRP,
      },
      insurance : {
        issueDate: this.insurance.issueDate,
        premiumAmount: this.insurance.premiumAmount,
        premiumAmountUnit: this.insurance.premiumAmountUnit,
        expiryDate: this.insurance.expiryDate,
        vendorID: this.insurance.vendorID,
        reminderNumber: this.insurance.reminderNumber,
        reminderNumberUnits : this.insurance.reminderNumberUnits
    
      },
      lifeCycle: {
        estimatedServiceLifeInMonths: this.lifeCycle.estimatedServiceLifeInMonths,
        estimatedServiceLifeInMiles: this.lifeCycle.estimatedServiceLifeInMiles,
        inServiceDate:this.lifeCycle.inServiceDate,
        inServiceOdometer:this.lifeCycle.inServiceOdometer,
        outServiceDate:this.lifeCycle.outServiceDate,
        outServiceOdometer:this.lifeCycle.outServiceOdometer,
        estimatedResaleValue:this.lifeCycle.estimatedResaleValue,
      },
      dimensions: {
        width: this.dimensions.width,
        height:  this.dimensions.height,
        length: this.dimensions.length,
        interiorVolume: this.dimensions.interiorVolume,
        passengerVolume: this.dimensions.passengerVolume,
        cargoVolume: this.dimensions.cargoVolume,
        groundClearance: this.dimensions.groundClearance,
        bedLength: this.dimensions.bedLength
      },
      weight: {
        curbWeight: this.weight.curbWeight,
        grossVehicleWeightRating: this.weight.grossVehicleWeightRating
      },
      performance: {
        towingCapacity: this.performance.towingCapacity,
        maxPayload: this.performance.maxPayload
      },
      fuelEconomy: {
        EPACity: this.fuelEconomy.EPACity,
        EPAHighway: this.fuelEconomy.EPAHighway,
        EPACombined: this.fuelEconomy.EPACombined
      },
      fuel: {
        fuelType: this.fuel.fuelType,
        fuelQuality:this.fuel.fuelQuality,
        fuelTank1Capacity: this.fuel.fuelTank1Capacity,
        fuelTank2Capacity: this.fuel.fuelTank2Capacity
      },
      oilCapacity: this.oilCapacity,
      features: {
        numberOfTires:this.features.numberOfTires,
        driveType:this.features.driveType,
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
        rearTyrePSI: this.features.rearTyreType
      },
      engine : {
        engineSummary : this.engine.engineSummary,
        engineBrand : this.engine.engineBrand,
        aspiration : this.engine.aspiration,
        blockType : this.engine.blockType,
        bore : this.engine.bore,
        camType : this.engine.camType,
        stroke : this.engine.stroke,
        valves : this.engine.valves,
        compression : this.engine.compression,
        cylinders : this.engine.cylinders,
        displacement : this.engine.displacement,
        fuelInduction : this.engine.fuelInduction,
        fuelQuality : this.engine.fuelQuality,
        maxHP : this.engine.maxHP,
        maxTorque : this.engine.maxTorque,
        redlineRPM : this.engine.redlineRPM,
        },
        transmission : {
          summary : this.transmission.summary,
          brand : this.transmission.brand,
          type: this.transmission.type,
          gears : this.transmission.gears,
        },
        loan : {
          loanVendor : this.loan.loanVendor,
          loanAmount : this.loan.loanAmount,
           aspiration : this.loan.aspiration,
           annualPercentageRate : this.loan.annualPercentageRate,
           downPayment : this.loan.downPayment,
           loanDate : this.loan.loanDate,
           monthlyPayment : this.loan.monthlyPayment,
           firstPaymentDate : this.loan.firstPaymentDate,
           numberofPayments : this.loan.numberofPayments,
           loanEndDate : this.loan.loanEndDate,
           accountNumber : this.loan.accountNumber,
           generateExpenses : this.loan.generateExpenses,
           notes : this.loan.notes
              },
      settings: {
        primaryMeter: this.settings.primaryMeter,
        fuelUnit: this.settings.fuelUnit,
        measurementUnit: this.settings.measurementUnit
      },
      safetyParameters: {
        hardBreakingParameters: this.safetyParameters.hardBreakingParameters,
        hardAccelrationParameters: this.safetyParameters.hardAccelrationParameters,
        turningParameters: this.safetyParameters.turningParameters,
      },
      quantumInfo: this.quantum
  };

console.log(data);
return;
    this.apiService.postData('vehicles', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Vehicle Added successfully';


      }
    });
  }
  // updateVehicle() {
  //   this.hasError = false;
  //   this.hasSuccess = false;

  //   const data = {
  //     vehicleID: this.vehicleID,
  //     vehicleName: this.vehicleName,
  //     VIN: this.VIN,
  //     year: this.year,
  //     manufacturerID: this.make,
  //     modelID: this.model,
  //     stateID: this.state,
  //     plateNumber: this.plateNumber,
  //     serviceProgramID: this.serviceProgramID,
  //     inspectionFormID: this.inspectionFormID,
  //     currentStatus: this.currentStatus,
  //     groupID: this.group,
  //     ownership: this.ownership,
  //     additionalDetails: {
  //       vehicleColor: this.additionalDetails.vehicleColor,
  //       bodyType: this.additionalDetails.bodyType,
  //       bodySubType: this.additionalDetails.bodySubType,
  //     },
  //     lifeCycle: {
  //       estimatedServiceLifeInMonths: this.lifeCycle
  //         .estimatedServiceLifeInMonths,
  //       estimatedServiceLifeInMiles: this.lifeCycle.estimatedServiceLifeInMiles,
  //     },
  //     dimensions: {
  //       width: this.dimensions.width,
  //       height: this.dimensions.height,
  //       length: this.dimensions.length,
  //       interiorVolume: this.dimensions.interiorVolume,
  //       passengerVolume: this.dimensions.passengerVolume,
  //       cargoVolume: this.dimensions.cargoVolume,
  //       groundClearance: this.dimensions.groundClearance,
  //       bedLength: this.dimensions.bedLength,
  //     },
  //     weight: {
  //       curbWeight: this.weight.curbWeight,
  //       grossVehicleWeightRating: this.weight.grossVehicleWeightRating,
  //     },
  //     performance: {
  //       towingCapacity: this.performance.towingCapacity,
  //       maxPayload: this.performance.maxPayload,
  //     },
  //     fuelEconomy: {
  //       EPACity: this.fuelEconomy.EPACity,
  //       EPAHighway: this.fuelEconomy.EPAHighway,
  //       EPACombined: this.fuelEconomy.EPACombined,
  //     },
  //     fuel: {
  //       fuelType: this.fuel.fuelType,
  //       fuelTank1Capacity: this.fuel.fuelTank1Capacity,
  //       fuelTank2Capacity: this.fuel.fuelTank2Capacity,
  //     },
  //     oilCapacity: this.oilCapacity,
  //     features: {
  //       breakSystem: this.features.breakSystem,
  //       wheelBase: this.features.wheelBase,
  //       rearAxle: this.features.rearAxle,
  //       frontTyreType: this.features.frontTyreType,
  //       frontTrackWidth: this.features.frontTrackWidth,
  //       frontWheelDiameter: this.features.frontWheelDiameter,
  //       frontTyrePSI: this.features.frontTyrePSI,
  //       rearTyreType: this.features.rearTyreType,
  //       rearTrackWidth: this.features.rearTrackWidth,
  //       rearWheelDiameter: this.features.rearWheelDiameter,
  //       rearTyrePSI: this.features.rearTyreType,
  //     },
  //     settings: {
  //       primaryMeter: this.settings.primaryMeter,
  //       fuelUnit: this.settings.fuelUnit,
  //       measurementUnit: this.settings.measurementUnit,
  //     },
  //     safetyParameters: {
  //       hardBreakingParameters: this.safetyParameters.hardBreakingParameters,
  //       hardAccelrationParameters: this.safetyParameters
  //         .hardAccelrationParameters,
  //       turningParameters: this.safetyParameters.turningParameters,
  //     },
  //     quantumInfo: this.quantum,
  //     timeCreated: this.timeCreated
  //   };

  //   this.apiService.putData("vehicles", data).subscribe({
  //     complete: () => { },
  //     error: (err) => {
  //       this.hasError = true;
  //       this.Error = err.error;
  //     },
  //     next: (res) => {
  //       this.response = res;
  //       this.hasSuccess = true;
  //       this.Success = "Vehicle Updated successfully";
  //     },
  //   });
  // }


  onChangeBasicPrimaryMeter(value: any){
    this.basicPrimaryMeter = value;
  
    console.log(value);
    
  }
  onChangePrimaryMeter(value: any) {
    this.settings.primaryMeter = value;
    console.log(value);
    
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
