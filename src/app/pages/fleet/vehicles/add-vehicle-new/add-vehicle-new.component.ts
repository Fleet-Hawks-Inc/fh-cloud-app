import { Component, OnInit } from "@angular/core";
import {ApiService} from '../../../api.service';
import {Router} from '@angular/router';
declare var $: any;

@Component({
  selector: "app-add-vehicle-new",
  templateUrl: "./add-vehicle-new.component.html",
  styleUrls: ["./add-vehicle-new.component.css"],
})
export class AddVehicleNewComponent implements OnInit {
  title = 'Add Vehicles';

  activeTab = "details";
  /**
   * Quantum prop
   */
  quantumsList = [];
  quantum = '';
  quantumSelected = '';
  quantumStatus = '';

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
  serviceProgramID = "";
  inspectionFormID = "";
  currentStatus = "";
  group = "";
  ownership = "";
  additionalDetails = {
    vehicleColor: "",
    bodyType: "",
    bodySubType: "",
  }
  lifeCycle = {
    estimatedServiceLifeInMonths: "",
    estimatedServiceLifeInMiles: ""
  }
  dimensions = {
    width: "",
    height:  "",
    length: "",
    interiorVolume: "",
    passengerVolume: "",
    cargoVolume: "",
    groundClearance: "",
    badLength: ""
  }
  weight = {
    curbWeight: "",
    grossVehicleWeightRating: ""
  }
  performace = {
    towingCapacity: "",
    maxPayload:  ""
  }
  fuelEconomy = {
    EPACity: "",
    EPAHighway: "",
    EPACombined: ""
  }
  fuel = {
    fuelType: "",
    fuelTank1Capacity: "",
    fuelTank2Capacity: ""
  }
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
    rearTyrePSI: ""
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

  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';


  slides = [
    {img: "assets/img/truck.jpg"},
    {img: "assets/img/truck.jpg"},
  ];
  slideConfig = {"slidesToShow": 1,
  "slidesToScroll": 1,
  "dots": true,
  "infinite": true,
  "autoplay": true,
  "autoplaySpeed": 1500};

  constructor(private apiService: ApiService,
    private router: Router) {}

  ngOnInit() {
    this.fetchServicePrograms();
    this.fetchInspectionForms();
    this.fetchManufacturers();
    this.fetchCountries();
    this.fetchGroups();

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
      plateNumber: this.plateNumber,
      serviceProgramID: this.serviceProgramID,
      inspectionFormID: this.inspectionFormID,
      currentStatus: this.currentStatus,
      groupID: this.group,
      ownership: this.ownership,
      additionalDetails: {
        vehicleColor: this.additionalDetails.vehicleColor,
        bodyType: this.additionalDetails.bodySubType,
        bodySubType: this.additionalDetails.bodySubType
      },
      lifeCycle: {
        estimatedServiceLifeInMonths: this.lifeCycle.estimatedServiceLifeInMonths,
        estimatedServiceLifeInMiles: this.lifeCycle.estimatedServiceLifeInMiles
      },
      dimensions: {
        width: this.dimensions.width,
        height:  this.dimensions.height,
        length: this.dimensions.length,
        interiorVolume: this.dimensions.interiorVolume,
        passengerVolume: this.dimensions.passengerVolume,
        cargoVolume: this.dimensions.cargoVolume,
        groundClearance: this.dimensions.groundClearance,
        badLength: this.dimensions.badLength
      },
      weight: {
        curbWeight: this.weight.curbWeight,
        grossVehicleWeightRating: this.weight.grossVehicleWeightRating
      },
      performace: {
        towingCapacity: this.performace.towingCapacity,
        maxPayload: this.performace.maxPayload
      },
      fuelEconomy: {
        EPACity: this.fuelEconomy.EPACity,
        EPAHighway: this.fuelEconomy.EPAHighway,
        EPACombined: this.fuelEconomy.EPACombined
      },
      fuel: {
        fuelType: this.fuel.fuelType,
        fuelTank1Capacity: this.fuel.fuelTank1Capacity,
        fuelTank2Capacity: this.fuel.fuelTank2Capacity
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
        rearTyrePSI: this.features.rearTyreType
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
  new_details() {
    this.activeTab="details";
    document.getElementById("vehicle_new_details").style.display = "block";
    document.getElementById("vehicle_new_lifecycle").style.display = "none";
    document.getElementById("vehicle_new_specifications").style.display =
      "none";
    document.getElementById("vehicle_new_fluids").style.display = "none";
    document.getElementById("vehicle_new_wheels").style.display = "none";
    document.getElementById("vehicle_new_settings").style.display = "none";
  }
  new_lifecycle() {
    this.activeTab="lifeCycle";
    document.getElementById("vehicle_new_details").style.display = "none";
    document.getElementById("vehicle_new_lifecycle").style.display = "block";
    document.getElementById("vehicle_new_specifications").style.display =
      "none";
    document.getElementById("vehicle_new_fluids").style.display = "none";
    document.getElementById("vehicle_new_wheels").style.display = "none";
    document.getElementById("vehicle_new_settings").style.display = "none";
  }
  new_specifications() {
    this.activeTab="specifications";
    document.getElementById("vehicle_new_details").style.display = "none";
    document.getElementById("vehicle_new_lifecycle").style.display = "none";
    document.getElementById("vehicle_new_specifications").style.display =
      "block";
    document.getElementById("vehicle_new_fluids").style.display = "none";
    document.getElementById("vehicle_new_wheels").style.display = "none";
    document.getElementById("vehicle_new_settings").style.display = "none";
  }
  new_fluids() {
    this.activeTab="fluids";
    document.getElementById("vehicle_new_details").style.display = "none";
    document.getElementById("vehicle_new_lifecycle").style.display = "none";
    document.getElementById("vehicle_new_specifications").style.display =
      "none";
    document.getElementById("vehicle_new_fluids").style.display = "block";
    document.getElementById("vehicle_new_wheels").style.display = "none";
    document.getElementById("vehicle_new_settings").style.display = "none";
  }
  new_wheels() {
    this.activeTab="wheel&Tyres";
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
    this.activeTab="settings";
    document.getElementById("vehicle_new_details").style.display = "none";
    document.getElementById("vehicle_new_lifecycle").style.display = "none";
    document.getElementById("vehicle_new_specifications").style.display =
      "none";
    document.getElementById("vehicle_new_fluids").style.display = "none";
    document.getElementById("vehicle_new_wheels").style.display = "none";
    document.getElementById("vehicle_new_settings").style.display = "block";
  }

  onChangePrimaryMeter(value: any){
    this.settings.primaryMeter = value;
    console.log(value);
    console.log(this.settings);
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

}
