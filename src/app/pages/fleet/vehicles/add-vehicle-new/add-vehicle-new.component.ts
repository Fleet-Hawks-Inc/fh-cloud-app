import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import {concatMap, map, mergeAll, toArray} from 'rxjs/operators';
import {from, of} from 'rxjs';
import {AwsUploadService} from '../../../../services';
import { v4 as uuidv4 } from 'uuid';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-add-vehicle-new',
  templateUrl: './add-vehicle-new.component.html',
  styleUrls: ['./add-vehicle-new.component.css'],
})
export class AddVehicleNewComponent implements OnInit {
  title = 'Add Vehicles';

  activeTab = 'details';
  /**
   * Quantum prop
   */
  quantumsList = [];
  quantum = '';
  quantumSelected = '';
  quantumcurrentStatus = '';

  /**
   * Vehicle Prop
   */
  vehicleTypeList: any = [];
  vehicleIdentification = '';
  vehicleType = '';
  VIN = '';
  DOT = '';
  year = '';
  manufacturerID = '';
  modelID = '';
  plateNumber = '';
  stateID = '';
  driverID = '';
  teamDriverID = '';
  serviceProgramID = '';
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
    policyNumber: ''
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

  countryID = '';
  servicePrograms = [];
  inspectionForms = [];
  manufacturers = [];
  models = [];
  countries = [];
  states = [];
  groups = [];
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  uploadedPhotos = [];
    uploadedDocs = [];
    carrierID;

  errors = {};
  vehicleForm;
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';

  slides = [{ img: 'assets/img/truck.jpg' }, { img: 'assets/img/truck.jpg' }];
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1500,
  };

  constructor(private apiService: ApiService, private awsUS: AwsUploadService, private router: Router, private httpClient: HttpClient,) {
    this.selectedFileNames = new Map<any, any>();
    $(document).ready(() => {
      this.vehicleForm = $('#vehicleForm').validate();
    });
  }

  ngOnInit() {
    this.fetchServicePrograms();
    this.fetchInspectionForms();
    this.fetchManufacturers();
    this.fetchCountries();
    this.fetchGroups();

    this.apiService.getData('devices').subscribe((result: any) => {
      this.quantumsList = result.Items;
    });
    this.httpClient.get('assets/vehicleType.json').subscribe(data => {
      console.log('Vehicle Type', data);
      this.vehicleTypeList = data;
    });
    this.settings.hardBreakingParams = 6;
    this.settings.hardAccelrationParams = 6;
    this.settings.turningParams = 6;

    $('#hardBreakingParametersValue').html(6);
    $('#hardAccelrationParametersValue').html(6);
    $('#turningParametersValue').html(6);



  }

  fetchServicePrograms() {
    this.apiService.getData('servicePrograms').subscribe((result: any) => {
      this.servicePrograms = result.Items;
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

  getModels() {
    this.apiService
      .getData(`vehicleModels/manufacturer/${this.manufacturerID}`)
      .subscribe((result: any) => {
        this.models = result.Items;
      });
  }

  fetchInspectionForms() {
    this.apiService
      .getData('inspectionForms/type/Vehicle')
      .subscribe((result: any) => {
        this.inspectionForms = result.Items;
      });
  }

  addVehicle() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
    const data = {
      vehicleIdentification: this.vehicleIdentification,
      vehicleType: this.vehicleType,
      VIN: this.VIN,
      DOT: this.DOT,
      year: this.year,
      manufacturerID: this.manufacturerID,
      modelID: this.modelID,
      plateNumber: this.plateNumber,
      stateID: this.stateID,
      driverID: this.driverID,
      teamDriverID: this.teamDriverID,
      serviceProgramID: this.serviceProgramID,
      repeatByTime: this.repeatByTime,
      repeatByTimeUnit: this.repeatByTimeUnit,
      reapeatbyOdometerMiles: this.reapeatbyOdometerMiles,
      currentStatus: this.currentStatus,
      ownership: this.ownership,
      groupID: this.groupID,
      aceID: this.aceID,
      aciID: this.aciID,
      vehicleColor: this.vehicleColor,
      bodyType: this.bodyType,
      bodySubType: this.bodySubType,
      msrp: this.msrp,
      inspectionFormID: this.inspectionFormID,
      lifeCycle: {
        inServiceDate: this.lifeCycle.inServiceDate,
        inServiceOdometer: this.lifeCycle.inServiceOdometer,
        estimatedServiceMonths: this.lifeCycle.estimatedServiceMonths,
        estimatedServiceMiles: this.lifeCycle.estimatedServiceMiles,
        estimatedResaleValue: this.lifeCycle.estimatedResaleValue,
        outOfServiceDate: this.lifeCycle.outOfServiceDate,
        outOfServiceOdometer: this.lifeCycle.outOfServiceOdometer,
      },
      specifications: {
        height: this.specifications.height,
        heightUnit: this.specifications.heightUnit,
        length: this.specifications.length,
        lengthUnit: this.specifications.lengthUnit,
        interiorVolume: this.specifications.interiorVolume,
        passangerVolume: this.specifications.passangerVolume,
        groundClearnce: this.specifications.groundClearnce,
        groundClearnceUnit: this.specifications.groundClearnceUnit,
        badLength: this.specifications.badLength,
        badLengthUnit: this.specifications.badLengthUnit,
        cargoVolume: this.specifications.cargoVolume,
        curbWeight: this.specifications.curbWeight,
        grossVehicleWeightRating: this.specifications.grossVehicleWeightRating,
        iftaReporting: this.specifications.iftaReporting,
        towingCapacity: this.specifications.towingCapacity,
        maxPayload: this.specifications.maxPayload,
        EPACity: this.specifications.EPACity,
        EPACombined: this.specifications.EPACombined,
        EPAHighway: this.specifications.EPAHighway,
      },
      insurance: {
        dateOfIssue: this.insurance.dateOfIssue,
        premiumAmount: this.insurance.premiumAmount,
        premiumCurrency: this.insurance.premiumCurrency,
        vendorID: this.insurance.vendorID,
        dateOfExpiry: this.insurance.dateOfExpiry,
        remiderEvery: this.insurance.remiderEvery,
        policyNumber: this.insurance.policyNumber,
      },
      fluid: {
        fuelType: this.fluid.fuelType,
        fuelTankOneCapacity: this.fluid.fuelTankOneCapacity,
        fuelQuality: this.fluid.fuelQuality,
        fuelTankTwoCapacity: this.fluid.fuelTankTwoCapacity,
        oilCapacity: this.fluid.oilCapacity,
      },
      wheelsAndTyres: {
        numberOfTyres: this.wheelsAndTyres.numberOfTyres,
        driveType: this.wheelsAndTyres.driveType,
        brakeSystem: this.wheelsAndTyres.brakeSystem,
        wheelbase: this.wheelsAndTyres.wheelbase,
        rearAxle: this.wheelsAndTyres.rearAxle,
        frontTyreType: this.wheelsAndTyres.frontTyreType,
        rearTyreType: this.wheelsAndTyres.rearTyreType,
        frontTrackWidth: this.wheelsAndTyres.frontTrackWidth,
        rearTrackWidth: this.wheelsAndTyres.rearTrackWidth,
        frontWheelDiameter: this.wheelsAndTyres.frontWheelDiameter,
        rearWheelDiameter: this.wheelsAndTyres.rearWheelDiameter,
        frontTyrePSI: this.wheelsAndTyres.frontTyrePSI,
        rearTyrePSI: this.wheelsAndTyres.rearTyrePSI,
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
        fuelIndication: this.engine.fuelIndication,
        fuelQuality: this.engine.fuelQuality,
        maxHP: this.engine.maxHP,
        maxTorque: this.engine.maxTorque,
        readlineRPM: this.engine.readlineRPM,
        transmissionSummary: this.engine.transmissionSummary,
        transmissionType: this.engine.transmissionType,
        transmissonBrand: this.engine.transmissonBrand,
        transmissionGears: this.engine.transmissionGears,
      },
      purchase: {
        purchaseVendorID: this.purchase.purchaseVendorID,
        warrantyExpirationDate: this.purchase.warrantyExpirationDate,
        purchasePrice: this.purchase.purchasePrice,
        warrantyExpirationMeter: this.purchase.warrantyExpirationMeter,
        purchaseDate: this.purchase.purchaseDate,
        purchaseComments: this.purchase.purchaseComments,
        purchaseOdometer: this.purchase.purchaseOdometer,
      },
      loan: {
        loanVendorID: this.loan.loanVendorID,
        amountOfLoan: this.loan.amountOfLoan,
        aspiration: this.loan.aspiration,
        annualPercentageRate: this.loan.annualPercentageRate,
        downPayment: this.loan.downPayment,
        dateOfLoan: this.loan.dateOfLoan,
        monthlyPayment: this.loan.monthlyPayment,
        firstPaymentDate: this.loan.firstPaymentDate,
        numberOfPayments: this.loan.numberOfPayments,
        loadEndDate: this.loan.loadEndDate,
        accountNumber: this.loan.accountNumber,
        generateExpenses: this.loan.generateExpenses,
        notes: this.loan.notes,
      },
      settings: {
        primaryMeter: this.settings.primaryMeter,
        fuelUnit: this.settings.fuelUnit,
        hardBreakingParams: this.settings.hardBreakingParams,
        hardAccelrationParams: this.settings.hardAccelrationParams,
        turningParams: this.settings.turningParams,
        measurmentUnit: this.settings.measurmentUnit,
      },
      uploadedPhotos: this.uploadedPhotos,
      uploadedDocs: this.uploadedDocs
    };
    this.apiService.postData('vehicles', data).subscribe({
      complete: () => {},
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        // this.uploadFiles(); // upload selected files to bucket
        this.Success = 'Vehicle Added successfully';
      },
    });
  }

  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error')
      });
    // this.vehicleForm.showErrors(this.errors);
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label')
      });
    this.errors = {};
  }


 /*
   * Selecting files before uploading
   */
  selectDocuments(event, obj) {
    this.selectedFiles = event.target.files;
    console.log('selected files', this.selectedFiles[0].name);
    if (obj === 'uploadedDocs') {
      for (let i = 0; i <= this.selectedFiles.item.length; i++) {
        const randomFileGenerate = this.selectedFiles[i].name.split('.');
        const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;
        this.selectedFileNames.set(fileName, this.selectedFiles[i]);
        this.uploadedDocs.push(fileName);
      }
    } else {
      for (let i = 0; i <= this.selectedFiles.item.length; i++) {
        const randomFileGenerate = this.selectedFiles[i].name.split('.');
        const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;

        this.selectedFileNames.set(fileName, this.selectedFiles[i]);
        this.uploadedPhotos.push(fileName);
      }
    }
  }
  /*
   * Uploading files which selected
   */
  uploadFiles = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    this.selectedFileNames.forEach((fileData: any, fileName: string) => {
      this.awsUS.uploadFile(this.carrierID, fileName, fileData);
    });
  }
  onChangePrimaryMeter(value: any) {
    this.settings.primaryMeter = value;
  }

  onChangeFuelUnit(value: any) {
    this.settings.fuelUnit = value;
  }

  onChangeMeasurementUnit(value: any) {
    this.settings.measurmentUnit = value;
  }

  onChangeHardBreakingParameters(value: any) {
    this.settings.hardBreakingParams = value;
    $('#hardBreakingParametersValue').html(value);
  }

  onChangeAccelrationParameters(value: any) {
    this.settings.hardAccelrationParams = value;
    $('#hardAccelrationParametersValue').html(value);
  }

  onChangeturningParameters(value: any) {
    this.settings.turningParams = value;
    $('#turningParametersValue').html(value);
  }

  quantumModal() {
    $(document).ready(function () {
      $('#quantumModal').modal('show');
    });
  }

  onChange(newValue) {
    this.quantum = newValue;
    this.quantumSelected = newValue;
  }
}
