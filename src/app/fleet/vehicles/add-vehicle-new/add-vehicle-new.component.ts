import { Component, OnInit } from "@angular/core";
import {ApiService} from '../../../api.service';
import {Router} from '@angular/router';
import {AwsUploadService} from '../../../aws-upload.service';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


declare var $: any;

@Component({
  selector: "app-add-vehicle-new",
  templateUrl: "./add-vehicle-new.component.html",
  styleUrls: ["./add-vehicle-new.component.css"],
})
export class AddVehicleNewComponent implements OnInit {
  title = 'Add Vehicles';

  activeTab = "details";
  imageError = '';
  fileName = '';
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
expiryDate : NgbDateStruct;
  /**
   * Vehicle Prop
   */
  vehicleName = "";
  VIN = "";
  year = "";
  make = "";
  model = "";
  state = "";
  plateNumber = "";
  basicPrimaryMeter = "Miles";
  spRepeatTime = "";
  spRepeatTimeUnit = "";
  spRepeatOdometer = "";
  serviceProgramID = "";
  inspectionFormID = "";
  currentStatus = "";
  group = "";
  ownership = "";
  enableIFTAReports:boolean = false;
  additionalDetails = {
    vehicleColor: "",
    bodyType: "",
    bodySubType: "",
    MSRP: "",
  }
  lifeCycle = {
    inServiceDate : "",
    inServiceOdometer : "",
    estimatedServiceLifeInMonths: "",
    estimatedServiceLifeInMiles: "",
    estimatedResaleValue : "",
    outServiceDate: "",
    outServiceOdometer : "",
  }
  dimensions = {
    width: "",
    height:  "",
    length: "",
    interiorVolume: "",
    passengerVolume: "",
    cargoVolume: "",
    groundClearance: "",
    bedLength: ""
  }
  weight = {
    curbWeight: "",
    grossVehicleWeightRating: ""
  }
  performance = {
    towingCapacity: "",
    maxPayload:  ""
  }
  insurance = {
    issueDate: "",
    premiumAmount: "",
    premiumAmountUnit: "",
    expiryDate: "",
    vendorID:"",
    reminderNumber:"",
    reminderNumberUnits : ""

  }
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
  }
  oilCapacity = "";
  features = {
    numberOfTires:"",
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
  }
  engine = {
    engineSummary : "",
    engineBrand : "",
    aspiration : "",
    blockType : "",
    bore : "",
    camType : "",
    stroke : "",
    valves : "",
    compression : "",
    cylinders : "",
    displacement : "",
    fuelInduction : "",
    fuelQuality : "",
    maxHP : "",
    maxTorque : "",
    redlineRPM : "",
    }
    transmission = {
      summary : "",
      brand : "",
      type: "",
      gears : "",
    }
    loan = {
      loanVendor : "",
      loanAmount : "",
      loanAspiration : "",
       annualPercentageRate : "",
       downPayment : "",
       loanDate : "",
       monthlyPayment : "",
       firstPaymentDate : "",
       numberofPayments : "",
       loanEndDate : "",
       accountNumber : "",
       generateExpenses : "",
       notes : ""
          }
  settings = {
    primaryMeter: "",
    fuelUnit: "",
    measurementUnit: ""
  }
  safetyParameters = {
    hardBreakingParameters: "",
    hardAccelrationParameters: "",
    turningParameters: ""
  }

  countryID = "";
  servicePrograms =  [];
  inspectionForms = [];
  manufacturers = [];
  models = [];
  countries = [];
  states = [];
  groups = [];
  vendors = [];

  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private apiService: ApiService,
    private router: Router,private awsUS: AwsUploadService, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) {}
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

    this.settings.primaryMeter = "kilometers";
    this.settings.fuelUnit = "liters";
    this.settings.measurementUnit = "metric";
    this.safetyParameters.hardBreakingParameters = "6";
    this.safetyParameters.hardAccelrationParameters = "6";
    this.safetyParameters.turningParameters = "6";
    this.basicPrimaryMeter = "Miles";

    $('#hardBreakingParametersValue').html(6);
    $('#hardAccelrationParametersValue').html(6);
    $('#turningParametersValue').html(6);
  }

  fetchServicePrograms(){
    this.apiService.getData('servicePrograms')
      .subscribe((result: any) => {
        this.servicePrograms = result.Items;
      });
  }
  fetchVendors() {
    this.apiService.getData("vendors").subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }
  fetchManufacturers(){
    this.apiService.getData('manufacturers')
      .subscribe((result: any) => {
        this.manufacturers = result.Items;
      });
  }

  fetchCountries(){
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  fetchGroups(){
    this.apiService.getData('groups')
      .subscribe((result: any) => {
        this.groups = result.Items;
      });
  }

  getStates(){
    this.apiService.getData('states/country/' + this.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  getModels(){
    this.apiService.getData(`vehicleModels/manufacturer/${this.make}`)
      .subscribe((result: any) => {
        this.models = result.Items;
      });
  }

  fetchInspectionForms() {
    this.apiService.getData("inspectionForms/type/Vehicle").subscribe((result: any) => {
      this.inspectionForms = result.Items;
    });
  }

  addVehicle() {
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
      enableIFTAReports: this.enableIFTAReports,
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
          loanAspiration : this.loan.loanAspiration,
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
 
  onChangeBasicPrimaryMeter(value: any){
    this.basicPrimaryMeter = value;
    console.log(value);
    
  }
  onChangePrimaryMeter(value: any){
    this.settings.primaryMeter = value;
    console.log(value);
    
  }

  onChangeFuelUnit(value: any){
    this.settings.fuelUnit = value;
  }

  onChangeMeasurementUnit(value: any){
    this.settings.measurementUnit = value;
  }

  onChangeHardBreakingParameters(value: any){
    this.safetyParameters.hardBreakingParameters = value;
    console.log(value);
    $('#hardBreakingParametersValue').html(value);
  }

  onChangeAccelrationParameters(value: any){
    this.safetyParameters.hardAccelrationParameters = value;
    $('#hardAccelrationParametersValue').html(value);
  }

  onChangeturningParameters(value: any){
    this.safetyParameters.turningParameters = value;
    $('#turningParametersValue').html(value);
  }

  quantumModal() {
    $( document ).ready(function() {
      $('#quantumModal').modal('show');
    });
  }

  onChange(newValue) {
    this.quantum = newValue;
    this.quantumSelected = newValue;
   }
   uploadFile(event) {
    this.imageError = '';
    if (this.awsUS.imageFormat(event.target.files.item(0)) !== -1) {
      this.fileName = this.awsUS.uploadFile('test', event.target.files.item(0));
    } else {
      this.fileName = '';
      this.imageError = 'Invalid Image Format';
    }
  }
}
