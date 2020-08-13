import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AwsUploadService } from '../../../aws-upload.service';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare var jquery: any;

@Component({
  selector: 'app-add-vehicle-new',
  templateUrl: './add-vehicle-new.component.html',
  styleUrls: ['./add-vehicle-new.component.css'],
})
export class AddVehicleNewComponent implements OnInit {
  title = '';
  public vehicleID;
  // activeTab = 'details';
  imageError = '';
  fileName = '';
  form;
  errors = {};
  /**
   * Quantum prop
   */
  quantumsList = [];
  quantum = '';
  quantumSelected = '';
  quantumStatus = '';
  // Dates
  loanDate: NgbDateStruct;
  loanEndDate: NgbDateStruct;
  firstPaymentDate: NgbDateStruct;
  inServiceDate: NgbDateStruct;
  outServiceDate: NgbDateStruct;
  issueDate: NgbDateStruct;
  expiryDate: NgbDateStruct;
  /**
   * Vehicle Prop
   */
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
  uploadedFiles = [];
  uploadedDocuments = [];
  documentNameArray = [];
  imageNameArray = [];
  selectedFiles: FileList;
  selectedDocuments: FileList;
  carrierID;
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
              private router: Router,
              private awsUS: AwsUploadService,
              private route: ActivatedRoute,
              private toaster: ToastrService, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {
    this.fetchServicePrograms();
    this.fetchInspectionForms();
    this.fetchManufacturers();
    this.fetchCountries();
    this.fetchGroups();
    this.fetchVendors();

    this.apiService.getData('devices')
      .subscribe((result: any) => {
        this.quantumsList = result.Items;
      });

    this.settings.primaryMeter = 'kilometers';
    this.settings.fuelUnit = 'liters';
    this.settings.measurementUnit = 'metric';
    this.safetyParameters.hardBreakingParameters = '6';
    this.safetyParameters.hardAccelrationParameters = '6';
    this.safetyParameters.turningParameters = '6';
    this.basicPrimaryMeter = 'miles';

    $('#hardBreakingParametersValue').html(6);
    $('#hardAccelrationParametersValue').html(6);
    $('#turningParametersValue').html(6);
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
    this.vehicleID = this.route.snapshot.params['vehicleID'];
    if (this.vehicleID) {
      this.title = 'Edit Vehicle';
      this.fetchVehicleByID();
    } else {
      this.title = 'Add Vehicle';
    }
  }

  fetchServicePrograms() {
    this.apiService.getData('servicePrograms')
      .subscribe((result: any) => {
        this.servicePrograms = result.Items;
      });
  }
  fetchVendors() {
    this.apiService.getData('vendors').subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }
  fetchManufacturers() {
    this.apiService.getData('manufacturers')
      .subscribe((result: any) => {
        this.manufacturers = result.Items;
      });
  }

  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  fetchGroups() {
    this.apiService.getData('groups')
      .subscribe((result: any) => {
        this.groups = result.Items;
      });
  }

  getStates() {
    this.apiService.getData('states/country/' + this.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  getModels() {
    this.apiService.getData(`vehicleModels/manufacturer/${this.make}`)
      .subscribe((result: any) => {
        this.models = result.Items;
      });
  }

  fetchInspectionForms() {
    this.apiService.getData('inspectionForms/type/Vehicle').subscribe((result: any) => {
      this.inspectionForms = result.Items;
    });
  }

  addVehicle() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    const data = {
      vehicleName: this.vehicleName,
      VIN: this.VIN,
      year: this.year,
      make: this.make,
      modelId: this.modelId,
      stateID: this.stateID,
      countryID: this.countryID,
      plateNumber: this.plateNumber,
      basicPrimaryMeter: this.basicPrimaryMeter,
      spRepeatTime: this.spRepeatTime,
      spRepeatTimeUnit: this.spRepeatTimeUnit,
      spRepeatOdometer: this.spRepeatOdometer,
      serviceProgramID: this.serviceProgramID,
      currentStatus: this.currentStatus,
      groupID: this.groupID,
      ownership: this.ownership,
      enableIFTAReports: this.enableIFTAReports,
      additionalDetails: {
        vehicleColor: this.additionalDetails.vehicleColor,
        bodyType: this.additionalDetails.bodySubType,
        bodySubType: this.additionalDetails.bodySubType,
        MSRP: this.additionalDetails.MSRP,
      },
      insurance: {
        issueDate: this.insurance.issueDate,
        premiumAmount: this.insurance.premiumAmount,
        premiumAmountUnit: this.insurance.premiumAmountUnit,
        expiryDate: this.insurance.expiryDate,
        vendorID: this.insurance.vendorID,
        reminderNumber: this.insurance.reminderNumber,
        reminderNumberUnits: this.insurance.reminderNumberUnits

      },
      lifeCycle: {
        estimatedServiceLifeInMonths: this.lifeCycle.estimatedServiceLifeInMonths,
        estimatedServiceLifeInMiles: this.lifeCycle.estimatedServiceLifeInMiles,
        inServiceDate: this.lifeCycle.inServiceDate,
        inServiceOdometer: this.lifeCycle.inServiceOdometer,
        outServiceDate: this.lifeCycle.outServiceDate,
        outServiceOdometer: this.lifeCycle.outServiceOdometer,
        estimatedResaleValue: this.lifeCycle.estimatedResaleValue,
      },
      dimensions: {
        width: this.dimensions.width,
        height: this.dimensions.height,
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
        fuelQuality: this.fuel.fuelQuality,
        fuelTank1Capacity: this.fuel.fuelTank1Capacity,
        fuelTank2Capacity: this.fuel.fuelTank2Capacity
      },
      oilCapacity: this.oilCapacity,
      features: {
        numberOfTires: this.features.numberOfTires,
        driveType: this.features.driveType,
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
      engine: {
        engineSummary: this.engine.engineSummary,
        engineBrand: this.engine.engineBrand,
        aspiration: this.engine.aspiration,
        blockType: this.engine.blockType,
        bore: this.engine.bore,
        camType: this.engine.camType,
        stroke: this.engine.stroke,
        valves: this.engine.valves,
        compression: this.engine.compression,
        cylinders: this.engine.cylinders,
        displacement: this.engine.displacement,
        fuelInduction: this.engine.fuelInduction,
        fuelQuality: this.engine.fuelQuality,
        maxHP: this.engine.maxHP,
        maxTorque: this.engine.maxTorque,
        redlineRPM: this.engine.redlineRPM,
      },
      transmission: {
        summary: this.transmission.summary,
        brand: this.transmission.brand,
        type: this.transmission.type,
        gears: this.transmission.gears,
      },
      loan: {
        loanVendor: this.loan.loanVendor,
        loanAmount: this.loan.loanAmount,
        loanAspiration: this.loan.loanAspiration,
        annualPercentageRate: this.loan.annualPercentageRate,
        downPayment: this.loan.downPayment,
        loanDate: this.loan.loanDate,
        monthlyPayment: this.loan.monthlyPayment,
        firstPaymentDate: this.loan.firstPaymentDate,
        numberofPayments: this.loan.numberofPayments,
        loanEndDate: this.loan.loanEndDate,
        accountNumber: this.loan.accountNumber,
        generateExpenses: this.loan.generateExpenses,
        notes: this.loan.notes
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
      uploadedFiles : this.uploadedFiles,
      imageNameArray : this.imageNameArray,
    };
    this.apiService.postData('vehicles', data).
      subscribe({
        complete: () => { },
        error: (err) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                const path = val.path;
                // We Can Use This Method
                const key = val.message.match(/"([^']+)"/)[1];
                // console.log(key);
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
                this.Success = '';
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.toaster.success('Vehicle Added successfully');
          this.router.navigateByUrl('/fleet/vehicles/Vehicle-List');

        }
      });

  }
  throwErrors() {
    this.form.showErrors(this.errors);
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

  fetchVehicleByID() {
    this.apiService
      .getData('vehicles/' + this.vehicleID).subscribe((result: any) => {
        result = result.Items[0];
        this.vehicleID = this.vehicleID;
        this.vehicleName = result.vehicleName;
        this.VIN = result.VIN;
        this.year = result.year;
        this.make = result.manufacturerID;
        this.modelId = result.modelId;
        this.countryID = result.countryID;
        this.stateID = result.stateID;
        this.groupID = result.groupID;
        this.plateNumber = result.plateNumber;
        this.serviceProgramID = result.serviceProgramID;
        this.basicPrimaryMeter = result.basicPrimaryMeter;
        // this.inspectionFormID = result.inspectionFormID;
        this.currentStatus = result.currentStatus;
        // this.group = result.group;
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
        };

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
        this.safetyParameters = {
          hardBreakingParameters: result.safetyParameters.hardBreakingParameters,
          hardAccelrationParameters: result.safetyParameters.hardAccelrationParameters,
          turningParameters: result.safetyParameters.turningParameters
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

        $('#hardBreakingParametersValue').html(
          this.safetyParameters.hardBreakingParameters
        );
        $('#hardAccelrationParametersValue').html(
          this.safetyParameters.hardAccelrationParameters
        );
        $('#turningParametersValue').html(
          this.safetyParameters.turningParameters
        );
        setTimeout(() => {
          this.fillCountry();
          this.fillModel();
        }, 2000);
        });

      }

      updateVehicle() {
        this.errors = {};
        this.hasError = false;
        this.hasSuccess = false;
        const data1 = {
          vehicleID : this.vehicleID,
          vehicleName: this.vehicleName,
          VIN: this.VIN,
          year: this.year,
          make: this.make,
          modelId: this.modelId,
          stateID: this.stateID,
          countryID: this.countryID,
          plateNumber: this.plateNumber,
          basicPrimaryMeter: this.basicPrimaryMeter,
          spRepeatTime: this.spRepeatTime,
          spRepeatTimeUnit: this.spRepeatTimeUnit,
          spRepeatOdometer: this.spRepeatOdometer,
          serviceProgramID: this.serviceProgramID,
          currentStatus: this.currentStatus,
          groupID: this.groupID,
          ownership: this.ownership,
          enableIFTAReports: this.enableIFTAReports,
          additionalDetails: {
            vehicleColor: this.additionalDetails.vehicleColor,
            bodyType: this.additionalDetails.bodySubType,
            bodySubType: this.additionalDetails.bodySubType,
            MSRP: this.additionalDetails.MSRP,
          },
          insurance: {
            issueDate: this.insurance.issueDate,
            premiumAmount: this.insurance.premiumAmount,
            premiumAmountUnit: this.insurance.premiumAmountUnit,
            expiryDate: this.insurance.expiryDate,
            vendorID: this.insurance.vendorID,
            reminderNumber: this.insurance.reminderNumber,
            reminderNumberUnits: this.insurance.reminderNumberUnits
    
          },
          lifeCycle: {
            estimatedServiceLifeInMonths: this.lifeCycle.estimatedServiceLifeInMonths,
            estimatedServiceLifeInMiles: this.lifeCycle.estimatedServiceLifeInMiles,
            inServiceDate: this.lifeCycle.inServiceDate,
            inServiceOdometer: this.lifeCycle.inServiceOdometer,
            outServiceDate: this.lifeCycle.outServiceDate,
            outServiceOdometer: this.lifeCycle.outServiceOdometer,
            estimatedResaleValue: this.lifeCycle.estimatedResaleValue,
          },
          dimensions: {
            width: this.dimensions.width,
            height: this.dimensions.height,
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
            fuelQuality: this.fuel.fuelQuality,
            fuelTank1Capacity: this.fuel.fuelTank1Capacity,
            fuelTank2Capacity: this.fuel.fuelTank2Capacity
          },
          oilCapacity: this.oilCapacity,
          features: {
            numberOfTires: this.features.numberOfTires,
            driveType: this.features.driveType,
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
          engine: {
            engineSummary: this.engine.engineSummary,
            engineBrand: this.engine.engineBrand,
            aspiration: this.engine.aspiration,
            blockType: this.engine.blockType,
            bore: this.engine.bore,
            camType: this.engine.camType,
            stroke: this.engine.stroke,
            valves: this.engine.valves,
            compression: this.engine.compression,
            cylinders: this.engine.cylinders,
            displacement: this.engine.displacement,
            fuelInduction: this.engine.fuelInduction,
            fuelQuality: this.engine.fuelQuality,
            maxHP: this.engine.maxHP,
            maxTorque: this.engine.maxTorque,
            redlineRPM: this.engine.redlineRPM,
          },
          transmission: {
            summary: this.transmission.summary,
            brand: this.transmission.brand,
            type: this.transmission.type,
            gears: this.transmission.gears,
          },
          loan: {
            loanVendor: this.loan.loanVendor,
            loanAmount: this.loan.loanAmount,
            loanAspiration: this.loan.loanAspiration,
            annualPercentageRate: this.loan.annualPercentageRate,
            downPayment: this.loan.downPayment,
            loanDate: this.loan.loanDate,
            monthlyPayment: this.loan.monthlyPayment,
            firstPaymentDate: this.loan.firstPaymentDate,
            numberofPayments: this.loan.numberofPayments,
            loanEndDate: this.loan.loanEndDate,
            accountNumber: this.loan.accountNumber,
            generateExpenses: this.loan.generateExpenses,
            notes: this.loan.notes
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
          // quantumInfo: this.quantum
        };
        this.apiService.putData('vehicles', data1).
          subscribe({
            complete: () => { },
            error: (err) => {
              from(err.error)
                .pipe(
                  map((val: any) => {
                    const path = val.path;
                    // We Can Use This Method
                    const key = val.message.match(/"([^']+)"/)[1];
                    console.log(key);
                    val.message = val.message.replace(/".*"/, 'This Field');
                    this.errors[key] = val.message;
                  })
                )
                .subscribe({
                  complete: () => {
                    this.throwErrors();
                    this.Success = '';
                  },
                  error: () => { },
                  next: () => { },
                });
            },
            next: (res) => {
              this.response = res;
              this.toaster.success('Vehicle Updated successfully');
              this.router.navigateByUrl('/fleet/vehicles/Vehicle-List');

            }
          });

      }
  onChangeBasicPrimaryMeter(value: any) {
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
        $('#hardBreakingParametersValue').html(value);
      }

  onChangeAccelrationParameters(value: any) {
        this.safetyParameters.hardAccelrationParameters = value;
        $('#hardAccelrationParametersValue').html(value);
      }

  onChangeturningParameters(value: any) {
        this.safetyParameters.turningParameters = value;
        $('#turningParametersValue').html(value);
      }

  onChange(newValue) {
        this.quantum = newValue;
        this.quantumSelected = newValue;
      }
      showFiles(file) {
        this.imageNameArray.push(file.name);
    }
    uploadFile = async (event) => {
      this.imageNameArray = [];
      this.selectedFiles = event.target.files;
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.showFiles(this.selectedFiles[i]);
      }
      console.log('Name Array Files', this.imageNameArray);
      this.carrierID = await this.apiService.getCarrierID();
     // console.log('carrierID', this.carrierID);
      this.imageError = '';
      for (let j = 0; j < this.imageNameArray.length; j++) {
        if (this.awsUS.imageFormat(event.target.files.item(j)) !== -1) {
          this.uploadedFiles = this.awsUS.uploadFile(this.carrierID,
          event.target.files.item(j));
         // console.log('event target', event.target.files.item(j));
        } else {
          this.fileName = '';
          this.imageError = 'Invalid Image Format';
        }
      }
      console.log('service returned array' + this.uploadedFiles);
    }
    //  For uploading document
    showDocuments(file) {
      this.documentNameArray.push(file.name);
  }
    uploadDocument = async (event) => {
      this.documentNameArray = [];
      this.selectedDocuments = event.target.files;
      for (let i = 0; i < this.selectedDocuments.length; i++) {
        this.showDocuments(this.selectedDocuments[i]);
      }
      console.log('Name Array Documents', this.documentNameArray);
      this.carrierID = await this.apiService.getCarrierID();
     // console.log('carrierID', this.carrierID);
      this.imageError = '';
      for (let j = 0; j < this.documentNameArray.length; j++) {
        if (this.awsUS.documentFormat(event.target.files.item(j)) !== -1) {
          this.uploadedDocuments = this.awsUS.uploadDocument(this.carrierID,
          event.target.files.item(j));
         // console.log('event target', event.target.files.item(j));
        } else {
          this.fileName = '';
          this.imageError = 'Invalid Document Format';
        }
      }
      console.log('service returned array' + this.uploadedDocuments);
    }
}
