import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css'],
})
export class VehicleDetailComponent implements OnInit {
  slides = [];
  Asseturl = this.apiService.AssetUrl;

  /**
   * Vehicle Prop
   */
  driversList: any = {};
  vehicleModelList:any = {};
  vehicleManufacturersList: any  = {};
  groupsList: any = {};
  statesList : any = {};
  vehicleID = '';
  vehicleIdentification = '';
  vehicleType = '';
  VIN = '';
  year = '';
  manufacturerID = '';
  modelID = '';
  plateNumber = '';
  stateID = '';
  driverID = '';
  teamDriverID = '';
  serviceProgramID = '';
  primaryMeter = '';
  repeatByTime = '';
  repeatByTimeUnit = '';
  reapeatbyOdometerMiles = '';
  currentStatus = '';
  ownership = '';
  groupID = '';
  aceID = '';
  aciID = '';
  vehicleColor = '';
  bodyType = '';
  bodySubType = '';
  msrp = '';
  inspectionFormID = '';
  lifeCycle = {
    inServiceDate: '',
    inServiceOdometer: '',
    estimatedServiceMonths: '',
    estimatedServiceMiles: '',
    estimatedResaleValue: '',
    outOfServiceDate: '',
    outOfServiceOdometer: '',
  };
  specifications = {
    height: '',
    heightUnit: '',
    length: '',
    lengthUnit: '',
    width: '',
    widthUnit: '',
    interiorVolume: '',
    passangerVolume: '',
    groundClearnce: '',
    groundClearnceUnit: '',
    badLength: '',
    badLengthUnit: '',
    cargoVolume: '',
    curbWeight: '',
    grossVehicleWeightRating: '',
    iftaReporting: false,
    towingCapacity: '',
    maxPayload: '',
    EPACity: '',
    EPACombined: '',
    EPAHighway: '',
  };
  insurance = {
    dateOfIssue: '',
    premiumAmount: '',
    premiumCurrency: '',
    vendorID: '',
    dateOfExpiry: '',
    remiderEvery: '',
    policyNumber: '',
    amount: 0,
    amountCurrency: ''
  };
  fluid = {
    fuelType: '',
    fuelTankOneCapacity: '',
    fuelQuality: '',
    fuelTankTwoCapacity: '',
    oilCapacity: '',
  };
  wheelsAndTyres = {
    numberOfTyres: '',
    driveType: '',
    brakeSystem: '',
    wheelbase: '',
    rearAxle: '',
    frontTyreType: '',
    rearTyreType: '',
    frontTrackWidth: '',
    rearTrackWidth: '',
    frontWheelDiameter: '',
    rearWheelDiameter: '',
    frontTyrePSI: '',
    rearTyrePSI: '',
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
    fuelIndication: '',
    fuelQuality: '',
    maxHP: '',
    maxTorque: '',
    readlineRPM: '',
    transmissionSummary: '',
    transmissionType: '',
    transmissonBrand: '',
    transmissionGears: '',
  };
  purchase = {
    purchaseVendorID: '',
    warrantyExpirationDate: '',
    purchasePrice: '',
    purchasePriceCurrency: '', 
    warrantyExpirationMeter: '',
    purchaseDate: '',
    purchaseComments: '',
    purchaseOdometer: '',
  };
  loan = {
    loanVendorID: '',
    amountOfLoan: '',
    aspiration: '',
    annualPercentageRate: '',
    downPayment: '',
    dateOfLoan: '',
    monthlyPayment: '',
    firstPaymentDate: '',
    numberOfPayments: '',
    loadEndDate: '',
    accountNumber: '',
    generateExpenses: '',
    notes: '',
  };
  settings = {
    primaryMeter: '',
    fuelUnit: '',
    hardBreakingParams: 0,
    hardAccelrationParams: 0,
    turningParams: 0,
    measurmentUnit: '',
  };

  issues = [];
  reminders = [];
  inspectionForms = [];
  fuelEntries = [];
  documents = [];
  servicePrograms = [];
  serviceHistory = [];
  devices = [];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1500,
  };
  
  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.vehicleID = this.route.snapshot.params['vehicleID'];
    this.getVehicle();
    this.fetchIssues();
    this.fetchReminders();
    this.fetchInspectionForms();
    this.fetchFuel();
    this.fetchServiceProgams();
    this.fetchServiceHistory();
    this. fetchDriversList();
    this.fetchStatesList();
    this.fetchVehicleModelList();
    this.fetchVehicleManufacturerList();
    this.fetchGroupsList();

  }
  fetchGroupsList() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groupsList = result;
    });
  }
  fetchDriversList() {
    this.apiService.getData('drivers/get/list').subscribe((result: any) => {
      this.driversList = result;
    });
  }
  fetchStatesList() {
    this.apiService.getData('states/get/list').subscribe((result: any) => {
      this.statesList = result;
    });
  }
  fetchVehicleModelList() {
    this.apiService.getData('vehicleModels/get/list').subscribe((result: any) => {
      this.vehicleModelList = result;
    });
  }
  fetchVehicleManufacturerList() {
    this.apiService.getData('manufacturers/get/list').subscribe((result: any) => {
      this.vehicleManufacturersList = result;
    });
  }
  fetchServiceProgams(){
    this.apiService.getData(`serviceLogs/vehicle/${this.vehicleID}`).subscribe((result) => {
      this.serviceHistory = result.Items;
    })
  }

  fetchServiceHistory(){
    this.apiService.getData(`servicePrograms/vehicle/${this.vehicleID}`).subscribe((result) => {
      this.servicePrograms = result.Items;
    })
  }


  fetchInspectionForms(){
    this.apiService.getData(`inspectionForms/vehicle/${this.vehicleID}`).subscribe((result) => {
      this.inspectionForms = result.Items;
    })
  }

  
  fetchFuel(){
    this.apiService.getData(`fuelEntries/vehicle/${this.vehicleID}`).subscribe((result) => {
      this.fuelEntries = result.Items;
    })
  }

  closeIssue(issueID){
    this.apiService.getData(`issues/setStatus/${issueID}/CLOSE`).subscribe((result) => {
      this.fetchIssues();
    })
  }

  fetchReminders(){
    this.apiService.getData(`reminders/vehicle/${this.vehicleID}`).subscribe((result) => {
      this.reminders = result.Items;
    })
  }

  fetchIssues(){
    this.apiService.getData(`issues/vehicle/${this.vehicleID}`).subscribe((result) => {
      this.issues = result.Items;
    })
  }

  getVehicle() {
    this.apiService
      .getData('vehicles/' + this.vehicleID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.vehicleIdentification = result.vehicleIdentification;
        this.vehicleType = result.vehicleType;
        this.VIN = result.VIN;
        this.year = result.year;
        this.manufacturerID = result.manufacturerID;
        this.modelID = result.modelID;
        this.plateNumber = result.plateNumber;
        this.stateID = result.stateID;
        this.driverID = result.driverID;
        this.teamDriverID = result.teamDriverID;
        this.serviceProgramID = result.serviceProgramID;
        this.primaryMeter = result.primaryMeter;
        this.repeatByTime = result.repeatByTime;
        this.repeatByTimeUnit = result.repeatByTimeUnit;
        this.reapeatbyOdometerMiles = result.reapeatbyOdometerMiles;
        this.currentStatus = result.currentStatus;
        this.ownership = result.ownership;
        this.groupID = result.groupID;
        this.aceID = result.aceID;
        this.aciID = result.aciID;
        this.vehicleColor = result.vehicleColor;
        this.bodyType = result.bodyType;
        this.bodySubType = result.bodySubType;
        this.msrp = result.msrp;
        this.inspectionFormID = result.inspectionFormID;
        this.lifeCycle = {
          inServiceDate: result.lifeCycle.inServiceDate,
          inServiceOdometer: result.lifeCycle.inServiceOdometer,
          estimatedServiceMonths: result.lifeCycle.estimatedServiceMonths,
          estimatedServiceMiles: result.lifeCycle.estimatedServiceMiles,
          estimatedResaleValue: result.lifeCycle.estimatedResaleValue,
          outOfServiceDate: result.lifeCycle.outOfServiceDate,
          outOfServiceOdometer: result.lifeCycle.outOfServiceOdometer,
        };
        this.specifications = {
          height: result.specifications.height,
          heightUnit: result.specifications.heightUnit,
          width: result.specifications.width,
          widthUnit: result.specifications.widthUnit,
          length: result.specifications.length,
          lengthUnit: result.specifications.lengthUnit,
          interiorVolume: result.specifications.interiorVolume,
          passangerVolume: result.specifications.passangerVolume,
          groundClearnce: result.specifications.groundClearnce,
          groundClearnceUnit: result.specifications.groundClearnceUnit,
          badLength: result.specifications.badLength,
          badLengthUnit: result.specifications.badLengthUnit,
          cargoVolume: result.specifications.cargoVolume,
          curbWeight: result.specifications.curbWeight,
          grossVehicleWeightRating:
            result.specifications.grossVehicleWeightRating,
          iftaReporting: result.specifications.iftaReporting,
          towingCapacity: result.specifications.towingCapacity,
          maxPayload: result.specifications.maxPayload,
          EPACity: result.specifications.EPACity,
          EPACombined: result.specifications.EPACombined,
          EPAHighway: result.specifications.EPAHighway,
        };
        this.insurance = {
          dateOfIssue: result.insurance.dateOfIssue,
          premiumAmount: result.insurance.premiumAmount,
          premiumCurrency: result.insurance.premiumCurrency,
          vendorID: result.insurance.vendorID,
          dateOfExpiry: result.insurance.dateOfExpiry,
          remiderEvery: result.insurance.remiderEvery,
          policyNumber: result.insurance.policyNumber,
          amount: result.insurance.amount,
          amountCurrency: result.insurance.amountCurrency
        };
        this.fluid = {
          fuelType: result.fluid.fuelType,
          fuelTankOneCapacity: result.fluid.fuelTankOneCapacity,
          fuelQuality: result.fluid.fuelQuality,
          fuelTankTwoCapacity: result.fluid.fuelTankTwoCapacity,
          oilCapacity: result.fluid.oilCapacity,
        };
        this.wheelsAndTyres = {
          numberOfTyres: result.wheelsAndTyres.numberOfTyres,
          driveType: result.wheelsAndTyres.driveType,
          brakeSystem: result.wheelsAndTyres.brakeSystem,
          wheelbase: result.wheelsAndTyres.wheelbase,
          rearAxle: result.wheelsAndTyres.rearAxle,
          frontTyreType: result.wheelsAndTyres.frontTyreType,
          rearTyreType: result.wheelsAndTyres.rearTyreType,
          frontTrackWidth: result.wheelsAndTyres.frontTrackWidth,
          rearTrackWidth: result.wheelsAndTyres.rearTrackWidth,
          frontWheelDiameter: result.wheelsAndTyres.frontWheelDiameter,
          rearWheelDiameter: result.wheelsAndTyres.rearWheelDiameter,
          frontTyrePSI: result.wheelsAndTyres.frontTyrePSI,
          rearTyrePSI: result.wheelsAndTyres.rearTyrePSI,
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
          fuelIndication: result.engine.fuelIndication,
          fuelQuality: result.engine.fuelQuality,
          maxHP: result.engine.maxHP,
          maxTorque: result.engine.maxTorque,
          readlineRPM: result.engine.readlineRPM,
          transmissionSummary: result.engine.transmissionSummary,
          transmissionType: result.engine.transmissionType,
          transmissonBrand: result.engine.transmissonBrand,
          transmissionGears: result.engine.transmissionGears,
        };
        this.purchase = {
          purchaseVendorID: result.purchase.purchaseVendorID,
          warrantyExpirationDate: result.purchase.warrantyExpirationDate,
          purchasePrice: result.purchase.purchasePrice,
          purchasePriceCurrency: result.purchase.purchasePriceCurrency,
          warrantyExpirationMeter: result.purchase.warrantyExpirationMeter,
          purchaseDate: result.purchase.purchaseDate,
          purchaseComments: result.purchase.purchaseComments,
          purchaseOdometer: result.purchase.purchaseOdometer,
        };
        this.loan = {
          loanVendorID: result.loan.loanVendorID,
          amountOfLoan: result.loan.amountOfLoan,
          aspiration: result.loan.aspiration,
          annualPercentageRate: result.loan.annualPercentageRate,
          downPayment: result.loan.downPayment,
          dateOfLoan: result.loan.dateOfLoan,
          monthlyPayment: result.loan.monthlyPayment,
          firstPaymentDate: result.loan.firstPaymentDate,
          numberOfPayments: result.loan.numberOfPayments,
          loadEndDate: result.loan.loadEndDate,
          accountNumber: result.loan.accountNumber,
          generateExpenses: result.loan.generateExpenses,
          notes: result.loan.notes,
        };
        this.settings = {
          primaryMeter: result.settings.primaryMeter,
          fuelUnit: result.settings.fuelUnit,
          hardBreakingParams: result.settings.hardBreakingParams,
          hardAccelrationParams: result.settings.hardAccelrationParams,
          turningParams: result.settings.turningParams,
          measurmentUnit: result.settings.measurmentUnit,
        };

        if(result.uploadedPhotos != undefined && result.uploadedPhotos.length > 0){
          this.slides = result.uploadedPhotos.map(x => `${this.Asseturl}/${result.carrierID}/${x}`);
        }

        $('#hardBreakingParametersValue').html(
          this.settings.hardBreakingParams
        );
        $('#hardAccelrationParametersValue').html(
          this.settings.hardAccelrationParams
        );
        $('#turningParametersValue').html(this.settings.turningParams);
      });
  }
}
