import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ApiService } from '../../../api.service';
import { ActivatedRoute } from '@angular/router';
import { AwsDownloadService } from 'src/app/aws-download.service';
declare var $: any;
declare var jquery: any;


@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  };
    /**
   * Vehicle Prop
   */
  carrierID;
  vehicleID = '';
  vehicleName = '';
  VIN = '';
  year = '';
  make = '';
  modelId = '';
  stateID = '';
  plateNumber = '';
  basicPrimaryMeter = 'miles';
  spRepeatTime = '';
  spRepeatTimeUnit = '';
  spRepeatOdometer = '';
  serviceProgramID = '';
  // inspectionFormID = '';
  currentStatus = '';
  groupID = '';
  ownership = '';
  imageArray = [];
  showImage = [];
  imageNameArray = [];
  enableIFTAReports = false;
  additionalDetails = {
    vehicleColor: '',
    bodyType: '',
    bodySubType: '',
    MSRP: '',
  };
  lifeCycle = {
    inServiceDate: '',
    inServiceOdometer: '',
    estimatedServiceLifeInMonths: '',
    estimatedServiceLifeInMiles: '',
    estimatedResaleValue: '',
    outServiceDate: '',
    outServiceOdometer: '',
  };
  dimensions = {
    width: '',
    height: '',
    length: '',
    interiorVolume: '',
    passengerVolume: '',
    cargoVolume: '',
    groundClearance: '',
    bedLength: ''
  };
  weight = {
    curbWeight: '',
    grossVehicleWeightRating: ''
  };
  performance = {
    towingCapacity: '',
    maxPayload: ''
  };
  insurance = {
    issueDate: '',
    premiumAmount: '',
    premiumAmountUnit: '',
    expiryDate: '',
    vendorID: '',
    reminderNumber: '',
    reminderNumberUnits: ''

  };
  fuelEconomy = {
    EPACity: '',
    EPAHighway: '',
    EPACombined: ''
  };
  fuel = {
    fuelType: '',
    fuelQuality: '',
    fuelTank1Capacity: '',
    fuelTank2Capacity: ''
  };
  oilCapacity = '';
  features = {
    numberOfTires: '',
    driveType: '',
    breakSystem: '',
    wheelBase: '',
    rearAxle: '',
    frontTyreType: '',
    frontTrackWidth: '',
    frontWheelDiameter: '',
    frontTyrePSI: '',
    rearTyreType: '',
    rearTrackWidth: '',
    rearWheelDiameter: '',
    rearTyrePSI: ''
  };
  engine = {
    engineSummary: '',
    engineBrand: '',
    aspiration: '',
    blockType: '',
    bore: '',
    camType: '',
    stroke: '',
    valves: '',
    compression: '',
    cylinders: '',
    displacement: '',
    fuelInduction: '',
    fuelQuality: '',
    maxHP: '',
    maxTorque: '',
    redlineRPM: '',
  };
  transmission = {
    summary: '',
    brand: '',
    type: '',
    gears: '',
  };
  loan = {
    loanVendor: '',
    loanAmount: '',
    loanAspiration: '',
    annualPercentageRate: '',
    downPayment: '',
    loanDate: '',
    monthlyPayment: '',
    firstPaymentDate: '',
    numberofPayments: '',
    loanEndDate: '',
    accountNumber: '',
    generateExpenses: '',
    notes: ''
  };
  settings = {
    primaryMeter: '',
    fuelUnit: '',
    measurementUnit: ''
  };
  safetyParameters = {
    hardBreakingParameters: '',
    hardAccelrationParameters: '',
    turningParameters: ''
  };
  data;
  countryID = '';
  servicePrograms = [];
  inspectionForms = [];
  manufacturers = [];
  models = [];
  countries = [];
  states = [];
  groups = [];
  vendors = [];

  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private fileDownload: AwsDownloadService) { }

  ngOnInit() {
    this.vehicleID = this.route.snapshot.params['vehicleID'];
    this.fetchServicePrograms();
    // this.fetchInspectionForms();
    this.fetchManufacturers();
    this.fetchCountries();
    this.fetchGroups();
    this.fetchVendors();
    this.fetchVehicle();
    this.carrierID = this.apiService.getCarrierID();
  }
  fetchVendors() {
    this.apiService.getData('vendors').subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }
  fetchManufacturers() {
    this.apiService.getData('manufacturers').subscribe((result: any) => {
      this.manufacturers = result.Items;
    });
  }

  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
    });

  }

  fetchGroups() {
    this.apiService.getData('groups').subscribe((result: any) => {
      this.groups = result.Items;
    });
  }

  getStates() {
    this.apiService
      .getData('states/country/' + this.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
  fillCountry() {
    this.apiService
      .getData('states/' + this.stateID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.countryID = result.countryID;
      });

    setTimeout(() => {
      this.getStates();
    }, 2000);
  }
  fillModel() {
    this.apiService.getData('vehicleModels/' + this.modelId).subscribe((result: any) => {
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
    this.apiService.getData('servicePrograms').subscribe((result: any) => {
      this.servicePrograms = result.Items;
    });
  }

  fetchVehicle() {
    this.apiService
      .getData('vehicles/' + this.vehicleID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.vehicleName = result.vehicleName;
        console.log('vehicle Name is' + this.vehicleName);
        this.VIN = result.VIN;
        this.year = result.year;
        this.make = result.manufacturerID;
        console.log('make of the truck' + this.make);
        this.modelId = result.modelId;
        this.countryID = result.countryID;
        this.stateID = result.stateID;
        this.groupID = result.groupID;
        this.plateNumber = result.plateNumber;
        this.serviceProgramID = result.serviceProgramID;
        this.basicPrimaryMeter = result.basicPrimaryMeter;
        this.currentStatus = result.currentStatus;
        this.ownership = result.ownership;
        this.dimensions = {
          width: result.dimensions.width,
          height: result.dimensions.height,
          length: result.dimensions.length,
          interiorVolume: result.dimensions.interiorVolume,
          passengerVolume: result.dimensions.passengerVolume,
          cargoVolume: result.dimensions.cargoVolume,
          groundClearance: result.dimensions.groundClearance,
          bedLength: result.dimensions.bedLength,
    };
        this.additionalDetails = {
          vehicleColor: result.additionalDetails.vehicleColor,
          bodyType: result.additionalDetails.bodyType,
          bodySubType: result.additionalDetails.bodySubType,
          MSRP: result.additionalDetails.MSRP,
    }

        this.lifeCycle = {
          inServiceDate: result.lifeCycle.inServiceDate,
          inServiceOdometer: result.lifeCycle.inServiceOdometer,
          estimatedServiceLifeInMonths: result.lifeCycle.estimatedServiceLifeInMonths,
          estimatedServiceLifeInMiles: result.lifeCycle.estimatedServiceLifeInMiles,
          estimatedResaleValue: result.lifeCycle.estimatedResaleValue,
          outServiceDate: result.lifeCycle.outServiceDate,
          outServiceOdometer: result.lifeCycle.outServiceOdometer,
        };
        this.insurance = {
          issueDate: result.insurance.issueDate,
          premiumAmount: result.insurance.premiumAmount,
          premiumAmountUnit: result.insurance.premiumAmountUnit,
          expiryDate: result.insurance.expiryDate,
          vendorID: result.insurance.vendorID,
          reminderNumber: result.insurance.reminderNumber,
          reminderNumberUnits: result.insurance.reminderNumberUnits
        };
        this.engine = {
          engineSummary: result.engine.engineSummary,
          engineBrand: result.engine.engineBrand,
          aspiration: result.engine.aspiration,
          blockType: result.engine.blockType,
          bore: result.engine.bore,
          camType: result.engine.camType,
          stroke: result.engine.stroke,
          valves: result.engine.valves,
          compression: result.engine.compression,
          cylinders: result.engine.cylinders,
          displacement: result.engine.displacement,
          fuelInduction: result.engine.fuelInduction,
          fuelQuality: result.engine.fuelQuality,
          maxHP: result.engine.maxHP,
          maxTorque: result.engine.maxTorque,
          redlineRPM: result.engine.redlineRPM,
        };
        this.transmission = {
          summary: result.transmission.summary,
          brand: result.transmission.brand,
          type: result.transmission.type,
          gears: result.transmission.gears,
        };
        this.loan = {
          loanVendor: result.loan.loanVendor,
          loanAmount: result.loan.loanAmount,
          loanAspiration: result.loan.loanAspiration,
          annualPercentageRate: result.loan.annualPercentageRate,
          downPayment: result.loan.downPayment,
          loanDate: result.loan.loanDate,
          monthlyPayment: result.loan.monthlyPayment,
          firstPaymentDate: result.loan.firstPaymentDate,
          numberofPayments: result.loan.numberofPayments,
          loanEndDate: result.loan.loanEndDate,
          accountNumber: result.loan.accountNumber,
          generateExpenses: result.loan.generateExpenses,
          notes: result.loan.notes
        };
        this.weight.curbWeight = result.weight.curbWeight;
        this.weight.grossVehicleWeightRating =
          result.weight.grossVehicleWeightRating;

        this.performance.towingCapacity = result.performance.towingCapacity;
        this.performance.maxPayload = result.performance.maxPayload;

        this.fuelEconomy.EPACity = result.fuelEconomy.EPACity;
        this.fuelEconomy.EPAHighway = result.fuelEconomy.EPAHighway;
        this.fuelEconomy.EPACombined = result.fuelEconomy.EPACombined;
        this.fuel = {
          fuelType: result.fuel.fuelType,
          fuelQuality: result.fuel.fuelQuality,
          fuelTank1Capacity: result.fuel.fuelTank1Capacity,
          fuelTank2Capacity: result.fuel.fuelTank2Capacity
        };
        this.oilCapacity = result.oilCapacity;
        this.features = {
          numberOfTires: result.features.numberOfTires,
          driveType: result.features.driveType,
          breakSystem: result.features.breakSystem,
          wheelBase: result.features.wheelBase,
          rearAxle: result.features.rearAxle,
          frontTyreType: result.features.frontTyreType,
          frontTrackWidth: result.features.frontTrackWidth,
          frontWheelDiameter: result.features.frontWheelDiameter,
          frontTyrePSI: result.features.frontTyrePSI,
          rearTyreType: result.features.rearTyreType,
          rearTrackWidth: result.features.rearTrackWidth,
          rearWheelDiameter: result.features.rearWheelDiameter,
          rearTyrePSI: result.features.rearTyrePSI
        };
        this.spRepeatOdometer = result.spRepeatOdometer;
        this.spRepeatTime = result.spRepeatTime;
        this.spRepeatTimeUnit = result.spRepeatTimeUnit;

        this.settings = {
          primaryMeter: result.settings.primaryMeter,
          fuelUnit: result.settings.fuelUnit,
          measurementUnit: result.settings.measurementUnit
        };
        this.imageArray = result.uploadedFiles,
        this.imageNameArray = result.imageNameArray,
        this.safetyParameters = {
          hardBreakingParameters: result.safetyParameters.hardBreakingParameters,
          hardAccelrationParameters: result.safetyParameters.hardAccelrationParameters,
          turningParameters: result.safetyParameters.turningParameters
        };
        $('#hardBreakingParametersValue').html(
          this.safetyParameters.hardBreakingParameters
        );
        $('#hardAccelrationParametersValue').html(
          this.safetyParameters.hardAccelrationParameters
        );
        $('#turningParametersValue').html(
          this.safetyParameters.turningParameters
        );
        this.showImages();
   });
  }


  async showImages() {
    for (let i = 0; i < this.imageArray.length; i++) {
      let x = await this.fileDownload.getFiles(this.carrierID, this.imageArray[i]);
      this.showImage.push(x);
    }
   }
}
