import { Component, OnInit} from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import {map} from 'rxjs/operators';
import {from} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router'; 
import { Location } from '@angular/common';

import  Constants  from '../../constants'
import { ListService } from '../../../../services';

declare var $: any;

@Component({
  selector: 'app-add-vehicle-new',
  templateUrl: './add-vehicle-new.component.html',
  styleUrls: ['./add-vehicle-new.component.css'],
})
export class AddVehicleNewComponent implements OnInit {
  showDriverModal = false
  title = 'Add Vehicle';
  Asseturl = this.apiService.AssetUrl;
  activeTab = 1;
  modalImage = '';

  /**
   * Quantum prop
   */
  quantumsList = [];
  quantum = '';
  quantumSelected = '';
  quantumcurrentStatus = '';
/**
 *Group Properties
*/
groupData = {
  groupType : Constants.GROUP_VEHICLES,
  groupName: '',
  groupMembers: '',
  description: '',
};
vehicles= [];

  /**
   * Vehicle Prop
   */
  vehicleID: string;
  hasBasic: boolean = false;
  hasLife: boolean = false;
  hasSpecs: boolean = false;
  hasFluids: boolean = false;
  vehicleTypeList: any = [];
  vehicleIdentification = '';
  vehicleType = '';
  VIN = '';
  DOT = '';
  year = '';
  manufacturerID = '';
  modelID = '';
  plateNumber = '';
  countryID = '';
  stateID = '';
  driverID = '';
  teamDriverID = '';
  serviceProgramID = '';
  repeatByTime = '';
  repeatByTimeUnit = '';
  reapeatbyOdometerMiles = '';
  annualSafetyDate = '';
  annualSafetyReminder = true;
  currentStatus = '';
  ownership = '';
  ownerOperatorID = '';
  groupID = '';
  aceID = '';
  aciID = '';
  iftaReporting = false;
  vehicleColor = '';
  bodyType = '';
  bodySubType = '';
  msrp = '';
  inspectionFormID = '';
  lifeCycle = {
    inServiceDate: '',
    startDate: '',
    inServiceOdometer: '',
    estimatedServiceYears: '',
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
    bedLength: '',
    bedLengthUnit: '',
    cargoVolume: '',
    tareWeight: '',
    grossVehicleWeightRating: '',
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
    reminder: '',
    remiderEvery: '',
    policyNumber: '',
    amount: 0,
    amountCurrency: ''
  };
  fluid = {
    fuelType: '',
    fuelTankOneCapacity: '',
    fuelTankOneType: '',
    fuelQuality: '',
    fuelTankTwoCapacity: '',
    fuelTankTwoType: '',
    oilCapacity: '',
    oilCapacityType: '',
    def: '',
    defType: ''
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
    maxTorque: 0,
    readlineRPM: '',
    transmissionSummary: '',
    transmissionType: '',
    transmissonBrand: '',
    transmissionGears: '',
  };
  purchase = {
    purchaseVendorID: '',
    warrantyExpirationDate: '',
    warrantyExpirationDateReminder: false,
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
    amountOfLoanCurrency: '',
    aspiration: '',
    annualPercentageRate: '',
    downPayment: '',
    downPaymentCurrency: '',
    dateOfLoan: '',
    monthlyPayment: '',
    monthlyPaymentCurrency: '',
    firstPaymentDate: '',
    numberOfPayments: '',
    loadEndDate: '',
    accountNumber: '',
    generateExpenses: '',
    notes: '',
  };
  settings = {
    primaryMeter: 'miles',
    fuelUnit: 'gallons(CA)',
    hardBreakingParams: 0,
    hardAccelrationParams: 0,
    turningParams: 0,
    measurmentUnit: 'imperial',
  };

  ownerOperators: any = []
  servicePrograms: any = [];
  inspectionForms = [];
  manufacturers: any = [];
  models: any = [];
  countries: any = [];
  states: any = [];
  groups = [];
  fuelTypes = [];
  drivers: any;
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  uploadedPhotos = [];
    uploadedDocs = [];
    existingPhotos = [];
    existingDocs = [];
    carrierID;
    programs = [];
    vendors: any = [];
    timeCreated: '';
  errors = {};
  vehicleForm;
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';

  slides = [];
  localPhotos = [];
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1500,
  };

  vendorModalStatus = false;

  constructor(private apiService: ApiService,private route: ActivatedRoute,  private location: Location, private toastr: ToastrService, private router: Router, private httpClient: HttpClient, private listService: ListService) {
    this.selectedFileNames = new Map<any, any>();
    $(document).ready(() => {
      this.vehicleForm = $('#vehicleForm').validate();
    });

  }

  ngOnInit() {
    this.fetchInspectionForms();
    this.fetchGroups();
    this.fetchVehicles();
    this.fetchFuelTypes();
    this.listService.fetchVendors();
    this.listService.fetchManufacturers()
    this.listService.fetchCountries();
    this.listService.fetchModels();
    this.listService.fetchStates();
    this.listService.fetchOwnerOperators();
    this.listService.fetchServicePrograms();
    this.listService.fetchDrivers();

    this.vehicleID = this.route.snapshot.params['vehicleID'];
    if (this.vehicleID) {
      this.title = 'Edit Vehicle';
      this.fetchVehicleByID();
    } else {
      this.title = 'Add Vehicle';
    }

    this.apiService.getData('devices').subscribe((result: any) => {
      this.quantumsList = result.Items;
    });
    this.httpClient.get('assets/vehicleType.json').subscribe(data => {
      this.vehicleTypeList = data;
    });
    this.settings.hardBreakingParams = 6;
    this.settings.hardAccelrationParams = 6;
    this.settings.turningParams = 6;

    $('#hardBreakingParametersValue').html(6);
    $('#hardAccelrationParametersValue').html(6);
    $('#turningParametersValue').html(6);

   this.vendors = this.listService.vendorList;
   this.manufacturers = this.listService.manufacturerList;
   this.countries = this.listService.countryList;
   this.models = this.listService.modelList;
   this.countries = this.listService.countryList;
   this.states = this.listService.stateList;
   this.ownerOperators = this.listService.ownerOperatorList;
   this.servicePrograms = this.listService.serviceProgramList;
   this.drivers = this.listService.driversList;
  }


  fetchDrivers(){
    this.apiService.getData('drivers').subscribe((result: any) => {
      this.drivers = result.Items;
    });
  }

  resetState(){
    this.stateID = '';
    $('#stateSelect').val('');
  }


  resetModel(){
    this.modelID = '';
    $('#vehicleSelect').val('');
  }

  fetchServicePrograms() {
    this.apiService.getData('servicePrograms').subscribe((result: any) => {
      this.servicePrograms = result.Items;
    });
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  fetchFuelTypes(){
    this.apiService.getData('fuelTypes').subscribe((result: any) => {
      this.fuelTypes = result.Items;
    });
  }
  gotoVehiclePage() {    
    $('#addDriverModelVehicle').modal('show');
  }

  fetchGroups() {
    this.apiService.getData(`groups?groupType=${this.groupData.groupType}`).subscribe((result: any) => {
      this.groups = result.Items;
    });
  }

  fetchInspectionForms() {
    this.apiService
      .getData('inspectionForms/type/Vehicle')
      .subscribe((result: any) => {
        this.inspectionForms = result.Items;
      });
  }
  async addVehicle() {
    this.hasError = false;
    this.hasSuccess = false;
    this.Error = '';

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
      countryID: this.countryID,
      stateID: this.stateID,
      driverID: this.driverID,
      teamDriverID: this.teamDriverID,
      serviceProgramID: this.serviceProgramID,
      annualSafetyDate: this.annualSafetyDate,
      annualSafetyReminder: this.annualSafetyReminder,
      currentStatus: this.currentStatus,
      ownership: this.ownership,
      ownerOperatorID: this.ownerOperatorID,
      groupID: this.groupID,
      aceID: this.aceID,
      aciID: this.aciID,
      vehicleColor: this.vehicleColor,
      bodyType: this.bodyType,
      bodySubType: this.bodySubType,
      msrp: this.msrp,
      iftaReporting: this.iftaReporting,
      inspectionFormID: this.inspectionFormID,
      lifeCycle: {
        inServiceDate: this.lifeCycle.inServiceDate,
        startDate: this.lifeCycle.startDate,
        inServiceOdometer: this.lifeCycle.inServiceOdometer,
        estimatedServiceYears: this.lifeCycle.estimatedServiceYears,
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
        width: this.specifications.width,
        widthUnit: this.specifications.widthUnit,
        interiorVolume: this.specifications.interiorVolume,
        passangerVolume: this.specifications.passangerVolume,
        groundClearnce: this.specifications.groundClearnce,
        groundClearnceUnit: this.specifications.groundClearnceUnit,
        bedLength: this.specifications.bedLength,
        bedLengthUnit: this.specifications.bedLengthUnit,
        cargoVolume: this.specifications.cargoVolume,
        tareWeight: this.specifications.tareWeight,
        grossVehicleWeightRating: this.specifications.grossVehicleWeightRating,
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
        reminder: this.insurance.reminder,
        remiderEvery: this.insurance.remiderEvery,
        policyNumber: this.insurance.policyNumber,
        amount: this.insurance.amount,
        amountCurrency: this.insurance.amountCurrency
      },
      fluid: {
        fuelType: this.fluid.fuelType,
        fuelTankOneCapacity: this.fluid.fuelTankOneCapacity,
        fuelTankOneType: this.fluid.fuelTankOneType,
        fuelQuality: this.fluid.fuelQuality,
        fuelTankTwoCapacity: this.fluid.fuelTankTwoCapacity,
        fuelTankTwoType: this.fluid.fuelTankOneType,
        oilCapacity: this.fluid.oilCapacity,
        oilCapacityType: this.fluid.oilCapacityType,
        def: this.fluid.def,
        defType: this.fluid.defType
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
        warrantyExpirationDateReminder: this.purchase.warrantyExpirationDateReminder,
        purchasePrice: this.purchase.purchasePrice,
        purchasePriceCurrency: this.purchase.purchasePriceCurrency,
        warrantyExpirationMeter: this.purchase.warrantyExpirationMeter,
        purchaseDate: this.purchase.purchaseDate,
        purchaseComments: this.purchase.purchaseComments,
        purchaseOdometer: this.purchase.purchaseOdometer,
      },
      loan: {
        loanVendorID: this.loan.loanVendorID,
        amountOfLoan: this.loan.amountOfLoan,
        amountOfLoanCurrency: this.loan.amountOfLoanCurrency,
        aspiration: this.loan.aspiration,
        annualPercentageRate: this.loan.annualPercentageRate,
        downPayment: this.loan.downPayment,
        downPaymentCurrency: this.loan.downPaymentCurrency,
        dateOfLoan: this.loan.dateOfLoan,
        monthlyPayment: this.loan.monthlyPayment,
        monthlyPaymentCurrency: this.loan.monthlyPaymentCurrency,
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
      activeTab: this.activeTab
    };
    // create form data instance
    const formData = new FormData();

    // append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    // append docs if any
    for(let j = 0; j < this.uploadedDocs.length; j++){
      formData.append('uploadedDocs', this.uploadedDocs[j]);
    }

    // append other fields
    formData.append('data', JSON.stringify(data));
    try {
      return await new Promise((resolve, reject) => {this.apiService.postData('vehicles', formData, true).subscribe({
        complete: () => {},
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.label] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
                this.hasError = true;
                if(err) return reject(err);
              },
              error: () => {},
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.Success = '';
          // this.uploadFiles(); // upload selected files to bucket
          let vehicle = {
            vehicleIdentification: '',
            vehicleType: '',
            VIN: '',
            DOT: '',
            year: '',
            manufacturerID: '',
            modelID: '',
            plateNumber: '',
            countryID: '',
            stateID: '',
            driverID: '',
            teamDriverID: '',
            serviceProgramID: '',
            repeatByTime: '',
            repeatByTimeUnit: '',
            reapeatbyOdometerMiles: '',
            annualSafetyDate: '',
            annualSafetyReminder: true,
            currentStatus: '',
            ownership: '',
            ownerOperator: '',
            groupID: '',
            aceID: '',
            aciID: '',
            iftaReporting: false,
            vehicleColor: '',
            bodyType: '',
            bodySubType: '',
            msrp: '',
            inspectionFormID: '',
            lifeCycle: {
              inServiceDate: '',
              startDate: '',
              inServiceOdometer: '',
              estimatedServiceYears: '',
              estimatedServiceMonths: '',
              estimatedServiceMiles: '',
              estimatedResaleValue: '',
              outOfServiceDate: '',
              outOfServiceOdometer: '',
            },
            specifications: {
              height: '',
              heightUnit: 'Centimeters',
              length: '',
              lengthUnit: '',
              width: '',
              widthUnit: '',
              interiorVolume: '',
              passangerVolume: '',
              groundClearnce: '',
              groundClearnceUnit: 'Centimeters',
              bedLength: '',
              bedLengthUnit: '',
              cargoVolume: '',
              tareWeight: '',
              grossVehicleWeightRating: '',
              towingCapacity: '',
              maxPayload: '',
              EPACity: '',
              EPACombined: '',
              EPAHighway: '',
            },
            insurance: {
              dateOfIssue: '',
              premiumAmount: '',
              premiumCurrency: 'CAD',
              vendorID: '',
              dateOfExpiry: '',
              reminder: '',
              remiderEvery: '',
              policyNumber: '',
              amount: 0,
              amountCurrency: 'CAD'
            },
            fluid: {
              fuelType: '',
              fuelTankOneCapacity: '',
              fuelTankOneType: 'Liters',
              fuelQuality: '',
              fuelTankTwoCapacity: '',
              fuelTankTwoType: 'Liters',
              oilCapacity: '',
              oilCapacityType: 'Liters',
              def: '',
              defType: 'Liters'
            },
            wheelsAndTyres: {
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
            },
            engine: {
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
              maxTorque: 0,
              readlineRPM: '',
              transmissionSummary: '',
              transmissionType: '',
              transmissonBrand: '',
              transmissionGears: '',
            },
            purchase: {
              purchaseVendorID: '',
              warrantyExpirationDate: '',
              warrantyExpirationDateReminder: false,
              purchasePrice: '',
              purchasePriceCurrency: 'CAD',
              warrantyExpirationMeter: '',
              purchaseDate: '',
              purchaseComments: '',
              purchaseOdometer: '',
            },
            loan: {
              loanVendorID: '',
              amountOfLoan: '',
              amountOfLoanCurrency: 'CAD',
              aspiration: '',
              annualPercentageRate: '',
              downPayment: '',
              downPaymentCurrency: 'CAD',
              dateOfLoan: '',
              monthlyPayment: '',
              monthlyPaymentCurrency: 'CAD',
              firstPaymentDate: '',
              numberOfPayments: '',
              loadEndDate: '',
              accountNumber: '',
              generateExpenses: '',
              notes: '',
            },
            settings: {
              primaryMeter: 'miles',
              fuelUnit: 'gallons(CA)',
              hardBreakingParams: 0,
              hardAccelrationParams: 0,
              turningParams: 0,
              measurmentUnit: 'imperial',
            },
          }
          // localStorage.setItem('vehicle', JSON.stringify(vehicle));
          this.toastr.success('Vehicle Added Successfully');
          // this.router.navigateByUrl('/fleet/vehicles/list');
          this.location.back();
        },
      })});
    } catch (error) {
      return 'error found';
    }

  }

  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error')
      });
      this.validateTabErrors();
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
    let files = [...event.target.files];

    if (obj === 'uploadedDocs') {
      for (let i = 0; i < files.length; i++) {
        this.uploadedDocs.push(files[i])
      }
    } else {
      for (let i = 0; i < files.length; i++) {
          this.uploadedPhotos.push(files[i])
      }

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.localPhotos.push(e.target.result);
        }
        reader.readAsDataURL(files[i]);
      }
    }
  }

  // EDIT
  fetchVehicleByID(){
    this.apiService
      .getData('vehicles/' + this.vehicleID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.vehicleIdentification = result.vehicleIdentification;
        this.vehicleType = result.vehicleType;
        this.VIN = result.VIN;
        this.DOT = result.DOT;
        this.year = result.year;
        this.manufacturerID = result.manufacturerID;
        this.modelID = result.modelID;
        this.plateNumber = result.plateNumber;
        this.countryID = result.countryID
        this.stateID = result.stateID;
        this.driverID = result.driverID;
        this.teamDriverID = result.teamDriverID;
        this.serviceProgramID = result.serviceProgramID;
        this.annualSafetyDate = result.annualSafetyDate,
        this.annualSafetyReminder = result.annualSafetyReminder,
        this.currentStatus = result.currentStatus;
        this.ownership = result.ownership;
        this.ownerOperatorID = this.ownerOperatorID;
        this.groupID = result.groupID;
        this.aceID = result.aceID;
        this.aciID = result.aciID;
        this.iftaReporting = result.iftaReporting,
        this.vehicleColor = result.vehicleColor;
        this.bodyType = result.bodyType;
        this.bodySubType = result.bodySubType;
        this.msrp = result.msrp;
        this.inspectionFormID = result.inspectionFormID;
        this.lifeCycle =  {
          inServiceDate: result.lifeCycle.inServiceDate,
          inServiceOdometer: result.lifeCycle.inServiceOdometer,
          startDate: result.lifeCycle.startDate,
          estimatedServiceYears: result.lifeCycle.estimatedServiceYears,
          estimatedServiceMonths: result.lifeCycle.estimatedServiceMonths,
          estimatedServiceMiles: result.lifeCycle.estimatedServiceMiles,
          estimatedResaleValue: result.lifeCycle.estimatedResaleValue,
          outOfServiceDate: result.lifeCycle.outOfServiceDate,
          outOfServiceOdometer: result.lifeCycle.outOfServiceOdometer
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
          bedLength: result.specifications.bedLength,
          bedLengthUnit: result.specifications.bedLengthUnit,
          cargoVolume: result.specifications.cargoVolume,
          tareWeight: result.specifications.tareWeight,
          grossVehicleWeightRating: result.specifications.grossVehicleWeightRating,
          towingCapacity: result.specifications.towingCapacity,
          maxPayload: result.specifications.maxPayload,
          EPACity: result.specifications.EPACity,
          EPACombined: result.specifications.EPACombined,
          EPAHighway: result.specifications.EPAHighway
        };
        this.insurance = {
          dateOfIssue: result.insurance.dateOfIssue,
          premiumAmount: result.insurance.premiumAmount,
          premiumCurrency: result.insurance.premiumCurrency,
          vendorID: result.insurance.vendorID,
          dateOfExpiry: result.insurance.dateOfExpiry,
          reminder: result.insurance.reminder,
          remiderEvery: result.insurance.remiderEvery,
          policyNumber: result.insurance.policyNumber,
          amount: result.insurance.amount,
          amountCurrency: result.insurance.amountCurrency
        };
        this.fluid = {
          fuelType: result.fluid.fuelType,
          fuelTankOneCapacity: result.fluid.fuelTankOneCapacity,
          fuelTankOneType:result.fluid.fuelTankOneType,
          fuelQuality: result.fluid.fuelQuality,
          fuelTankTwoCapacity: result.fluid.fuelTankTwoCapacity,
          fuelTankTwoType: result.fluid.fuelTankTwoType,
          oilCapacity: result.fluid.oilCapacity,
          oilCapacityType: result.fluid.oilCapacityType,
          def: result.fluid.def,
          defType: result.fluid.defType
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
          rearTyrePSI: result.wheelsAndTyres.rearTyrePSI
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
          transmissionGears: result.engine.transmissionGears
        };
        this.purchase = {
          purchaseVendorID: result.purchase.purchaseVendorID,
          warrantyExpirationDate: result.purchase.warrantyExpirationDate,
          warrantyExpirationDateReminder: result.purchase.warrantyExpirationDateReminder,
          purchasePrice: result.purchase.purchasePrice,
          purchasePriceCurrency: result.purchase.purchasePriceCurrency,
          warrantyExpirationMeter: result.purchase.warrantyExpirationMeter,
          purchaseDate: result.purchase.purchaseDate,
          purchaseComments: result.purchase.purchaseComments,
          purchaseOdometer: result.purchase.purchaseOdometer
        };
        this.loan = {
          loanVendorID: result.loan.loanVendorID,
          amountOfLoan: result.loan.amountOfLoan,
          amountOfLoanCurrency: result.loan.amountOfLoanCurrency,
          aspiration: result.loan.aspiration,
          annualPercentageRate: result.loan.annualPercentageRate,
          downPayment: result.loan.downPayment,
          downPaymentCurrency: result.loan.downPaymentCurrency,
          dateOfLoan: result.loan.dateOfLoan,
          monthlyPayment: result.loan.monthlyPayment,
          monthlyPaymentCurrency: result.loan.monthlyPaymentCurrency,
          firstPaymentDate: result.loan.firstPaymentDate,
          numberOfPayments: result.loan.numberOfPayments,
          loadEndDate: result.loan.loadEndDate,
          accountNumber: result.loan.accountNumber,
          generateExpenses: result.loan.generateExpenses,
          notes: result.loan.notes
        };
        this.settings = {
          primaryMeter: result.settings.primaryMeter,
          fuelUnit: result.settings.fuelUnit,
          hardBreakingParams: result.settings.hardBreakingParams,
          hardAccelrationParams: result.settings.hardAccelrationParams,
          turningParams: result.settings.turningParams,
          measurmentUnit: result.settings.measurmentUnit
        };
        this.existingPhotos = result.uploadedPhotos;
        this.existingDocs = result.uploadedDocs;
        if(result.uploadedPhotos != undefined && result.uploadedPhotos.length > 0){
          this.slides = result.uploadedPhotos.map(x => `${this.Asseturl}/${result.carrierID}/${x}`);
        }

        this.timeCreated = result.timeCreated;

        $('#hardBreakingParametersValue').html(
          this.settings.hardBreakingParams
        );
        $('#hardAccelrationParametersValue').html(
          this.settings.hardAccelrationParams
        );
        $('#turningParametersValue').html(
          this.settings.turningParams
        );
      });

  }
  async updateVehicle() {
    this.hasError = false;
    this.hasSuccess = false;
    this.Error = '';

    this.hideErrors();
    const data = {
      vehicleID : this.vehicleID,
      vehicleIdentification: this.vehicleIdentification,
      vehicleType: this.vehicleType,
      VIN: this.VIN,
      DOT: this.DOT,
      year: this.year,
      manufacturerID: this.manufacturerID,
      modelID: this.modelID,
      plateNumber: this.plateNumber,
      countryID: this.countryID,
      stateID: this.stateID,
      driverID: this.driverID,
      teamDriverID: this.teamDriverID,
      serviceProgramID: this.serviceProgramID,
      annualSafetyDate: this.annualSafetyDate,
      annualSafetyReminder: this.annualSafetyReminder,
      currentStatus: this.currentStatus,
      ownership: this.ownership,
      ownerOperatorID: this.ownerOperatorID,
      groupID: this.groupID,
      aceID: this.aceID,
      aciID: this.aciID,
      iftaReporting: this.iftaReporting,
      vehicleColor: this.vehicleColor,
      bodyType: this.bodyType,
      bodySubType: this.bodySubType,
      msrp: this.msrp,
      inspectionFormID: this.inspectionFormID,
      lifeCycle: {
        inServiceDate: this.lifeCycle.inServiceDate,
        startDate: this.lifeCycle.startDate,
        inServiceOdometer: this.lifeCycle.inServiceOdometer,
        estimatedServiceYears: this.lifeCycle.estimatedServiceYears,
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
        width: this.specifications.width,
        widthUnit: this.specifications.widthUnit,
        interiorVolume: this.specifications.interiorVolume,
        passangerVolume: this.specifications.passangerVolume,
        groundClearnce: this.specifications.groundClearnce,
        groundClearnceUnit: this.specifications.groundClearnceUnit,
        bedLength: this.specifications.bedLength,
        bedLengthUnit: this.specifications.bedLengthUnit,
        cargoVolume: this.specifications.cargoVolume,
        tareWeight: this.specifications.tareWeight,
        grossVehicleWeightRating: this.specifications.grossVehicleWeightRating,
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
        reminder: this.insurance.reminder,
        remiderEvery: this.insurance.remiderEvery,
        policyNumber: this.insurance.policyNumber,
        amount: this.insurance.amount,
        amountCurrency: this.insurance.amountCurrency
      },
      fluid: {
        fuelType: this.fluid.fuelType,
        fuelTankOneCapacity: this.fluid.fuelTankOneCapacity,
        fuelTankOneType: this.fluid.fuelTankOneType,
        fuelQuality: this.fluid.fuelQuality,
        fuelTankTwoCapacity: this.fluid.fuelTankTwoCapacity,
        fuelTankTwoType: this.fluid.fuelTankTwoType,
        oilCapacity: this.fluid.oilCapacity,
        oilCapacityType: this.fluid.oilCapacityType,
        def: this.fluid.def,
        defType: this.fluid.defType
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
        warrantyExpirationDateReminder: this.purchase.warrantyExpirationDateReminder,
        purchasePrice: this.purchase.purchasePrice,
        purchasePriceCurrency: this.purchase.purchasePriceCurrency,
        warrantyExpirationMeter: this.purchase.warrantyExpirationMeter,
        purchaseDate: this.purchase.purchaseDate,
        purchaseComments: this.purchase.purchaseComments,
        purchaseOdometer: this.purchase.purchaseOdometer,
      },
      loan: {
        loanVendorID: this.loan.loanVendorID,
        amountOfLoan: this.loan.amountOfLoan,
        amountOfLoanCurrency: this.loan.amountOfLoanCurrency,
        aspiration: this.loan.aspiration,
        annualPercentageRate: this.loan.annualPercentageRate,
        downPayment: this.loan.downPayment,
        downPaymentCurrency: this.loan.downPaymentCurrency,
        dateOfLoan: this.loan.dateOfLoan,
        monthlyPayment: this.loan.monthlyPayment,
        monthlyPaymentCurrency: this.loan.monthlyPaymentCurrency,
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
      uploadedPhotos: this.existingPhotos,
      uploadedDocs: this.existingDocs,
      activeTab: this.activeTab
    };

     // create form data instance
     const formData = new FormData();

     //append photos if any
     for(let i = 0; i < this.uploadedPhotos.length; i++){
       formData.append('uploadedPhotos', this.uploadedPhotos[i]);
     }

     //append docs if any
     for(let j = 0; j < this.uploadedDocs.length; j++){
       formData.append('uploadedDocs', this.uploadedDocs[j]);
     }

     //append other fields
     formData.append('data', JSON.stringify(data));

     try {
      return await new Promise((resolve, reject) => {this.apiService.putData('vehicles', formData, true).
      subscribe({
        complete : () => {},
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.label] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
                if(err) return reject(err);
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.Success = '';
          this.toastr.success('Vehicle Updated successfully');
          this.router.navigateByUrl('/fleet/vehicles/list');
        }
      })});
     } catch (error) {

     }

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

  async next(){
    console.log(this.annualSafetyReminder);
    const data = {
      vehicleIdentification: this.vehicleIdentification,
      vehicleType: this.vehicleType,
      VIN: this.VIN,
      DOT: this.DOT,
      year: this.year,
      manufacturerID: this.manufacturerID,
      modelID: this.modelID,
      plateNumber: this.plateNumber,
      countryID: this.countryID,
      stateID: this.stateID,
      driverID: this.driverID,
      teamDriverID: this.teamDriverID,
      serviceProgramID: this.serviceProgramID,
      annualSafetyDate: this.annualSafetyDate,
      annualSafetyReminder: this.annualSafetyReminder,
      currentStatus: this.currentStatus,
      ownership: this.ownership,
      ownerOperatorID: this.ownerOperatorID,
      groupID: this.groupID,
      aceID: this.aceID,
      aciID: this.aciID,
      vehicleColor: this.vehicleColor,
      bodyType: this.bodyType,
      bodySubType: this.bodySubType,
      msrp: this.msrp,
      iftaReporting: this.iftaReporting,
      inspectionFormID: this.inspectionFormID,
      lifeCycle: {
        inServiceDate: this.lifeCycle.inServiceDate,
        startDate: this.lifeCycle.startDate,
        inServiceOdometer: this.lifeCycle.inServiceOdometer,
        estimatedServiceYears: this.lifeCycle.estimatedServiceYears,
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
        width: this.specifications.width,
        widthUnit: this.specifications.widthUnit,
        interiorVolume: this.specifications.interiorVolume,
        passangerVolume: this.specifications.passangerVolume,
        groundClearnce: this.specifications.groundClearnce,
        groundClearnceUnit: this.specifications.groundClearnceUnit,
        bedLength: this.specifications.bedLength,
        bedLengthUnit: this.specifications.bedLengthUnit,
        cargoVolume: this.specifications.cargoVolume,
        tareWeight: this.specifications.tareWeight,
        grossVehicleWeightRating: this.specifications.grossVehicleWeightRating,
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
        reminder: this.insurance.reminder,
        remiderEvery: this.insurance.remiderEvery,
        policyNumber: this.insurance.policyNumber,
        amount: this.insurance.amount,
        amountCurrency: this.insurance.amountCurrency
      },
      fluid: {
        fuelType: this.fluid.fuelType,
        fuelTankOneCapacity: this.fluid.fuelTankOneCapacity,
        fuelTankOneType: this.fluid.fuelTankOneType,
        fuelQuality: this.fluid.fuelQuality,
        fuelTankTwoCapacity: this.fluid.fuelTankTwoCapacity,
        fuelTankTwoType: this.fluid.fuelTankOneType,
        oilCapacity: this.fluid.oilCapacity,
        oilCapacityType: this.fluid.oilCapacityType,
        def: this.fluid.def,
        defType: this.fluid.defType
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
        warrantyExpirationDateReminder: this.purchase.warrantyExpirationDateReminder,
        purchasePrice: this.purchase.purchasePrice,
        purchasePriceCurrency: this.purchase.purchasePriceCurrency,
        warrantyExpirationMeter: this.purchase.warrantyExpirationMeter,
        purchaseDate: this.purchase.purchaseDate,
        purchaseComments: this.purchase.purchaseComments,
        purchaseOdometer: this.purchase.purchaseOdometer,
      },
      loan: {
        loanVendorID: this.loan.loanVendorID,
        amountOfLoan: this.loan.amountOfLoan,
        amountOfLoanCurrency: this.loan.amountOfLoanCurrency,
        aspiration: this.loan.aspiration,
        annualPercentageRate: this.loan.annualPercentageRate,
        downPayment: this.loan.downPayment,
        downPaymentCurrency: this.loan.downPaymentCurrency,
        dateOfLoan: this.loan.dateOfLoan,
        monthlyPayment: this.loan.monthlyPayment,
        monthlyPaymentCurrency: this.loan.monthlyPaymentCurrency,
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
      }
    }

    if(!this.vehicleID){
      localStorage.setItem('vehicle', JSON.stringify(data));
      await this.addVehicle();
    }else {
      await this.updateVehicle();
    }

    this.validateTabErrors();
    if($('#details .error').length > 0 && this.activeTab == 1) return;
    if($('#lifecycle .error').length > 0 && this.activeTab == 2) return;
    if($('#specifications .error').length > 0 && this.activeTab == 3) return;
    if($('#insurance .error').length > 0 && this.activeTab == 4) return;
    if($('#fluids .error').length > 0 && this.activeTab == 5) return;
    if($('#wheels .error').length > 0 && this.activeTab == 6) return;
    if($('#engine .error').length > 0 && this.activeTab == 7) return;
    if($('#purchase .error').length > 0 && this.activeTab == 8) return;
    if($('#loan .error').length > 0 && this.activeTab == 9) return;



    this.activeTab++;
  }

  previous(){
    this.activeTab--;

    if(this.vehicleID) return;
    const data = {
      vehicleIdentification: this.vehicleIdentification,
      vehicleType: this.vehicleType,
      VIN: this.VIN,
      DOT: this.DOT,
      year: this.year,
      manufacturerID: this.manufacturerID,
      modelID: this.modelID,
      plateNumber: this.plateNumber,
      countryID: this.countryID,
      stateID: this.stateID,
      driverID: this.driverID,
      teamDriverID: this.teamDriverID,
      serviceProgramID: this.serviceProgramID,
      annualSafetyDate: this.annualSafetyDate,
      annualSafetyReminder: this.annualSafetyReminder,
      currentStatus: this.currentStatus,
      ownership: this.ownership,
      ownerOperatorID: this.ownerOperatorID,
      groupID: this.groupID,
      aceID: this.aceID,
      aciID: this.aciID,
      vehicleColor: this.vehicleColor,
      bodyType: this.bodyType,
      bodySubType: this.bodySubType,
      msrp: this.msrp,
      iftaReporting: this.iftaReporting,
      inspectionFormID: this.inspectionFormID,
      lifeCycle: {
        inServiceDate: this.lifeCycle.inServiceDate,
        startDate: this.lifeCycle.startDate,
        inServiceOdometer: this.lifeCycle.inServiceOdometer,
        estimatedServiceYears: this.lifeCycle.estimatedServiceYears,
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
        width: this.specifications.width,
        widthUnit: this.specifications.widthUnit,
        interiorVolume: this.specifications.interiorVolume,
        passangerVolume: this.specifications.passangerVolume,
        groundClearnce: this.specifications.groundClearnce,
        groundClearnceUnit: this.specifications.groundClearnceUnit,
        bedLength: this.specifications.bedLength,
        bedLengthUnit: this.specifications.bedLengthUnit,
        cargoVolume: this.specifications.cargoVolume,
        tareWeight: this.specifications.tareWeight,
        grossVehicleWeightRating: this.specifications.grossVehicleWeightRating,
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
        reminder: this.insurance.reminder,
        remiderEvery: this.insurance.remiderEvery,
        policyNumber: this.insurance.policyNumber,
        amount: this.insurance.amount,
        amountCurrency: this.insurance.amountCurrency
      },
      fluid: {
        fuelType: this.fluid.fuelType,
        fuelTankOneCapacity: this.fluid.fuelTankOneCapacity,
        fuelTankOneType: this.fluid.fuelTankOneType,
        fuelQuality: this.fluid.fuelQuality,
        fuelTankTwoCapacity: this.fluid.fuelTankTwoCapacity,
        fuelTankTwoType: this.fluid.fuelTankOneType,
        oilCapacity: this.fluid.oilCapacity,
        oilCapacityType: this.fluid.oilCapacityType,
        def: this.fluid.def,
        defType: this.fluid.defType
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
        warrantyExpirationDateReminder: this.purchase.warrantyExpirationDateReminder,
        purchasePrice: this.purchase.purchasePrice,
        purchasePriceCurrency: this.purchase.purchasePriceCurrency,
        warrantyExpirationMeter: this.purchase.warrantyExpirationMeter,
        purchaseDate: this.purchase.purchaseDate,
        purchaseComments: this.purchase.purchaseComments,
        purchaseOdometer: this.purchase.purchaseOdometer,
      },
      loan: {
        loanVendorID: this.loan.loanVendorID,
        amountOfLoan: this.loan.amountOfLoan,
        amountOfLoanCurrency: this.loan.amountOfLoanCurrency,
        aspiration: this.loan.aspiration,
        annualPercentageRate: this.loan.annualPercentageRate,
        downPayment: this.loan.downPayment,
        downPaymentCurrency: this.loan.downPaymentCurrency,
        dateOfLoan: this.loan.dateOfLoan,
        monthlyPayment: this.loan.monthlyPayment,
        monthlyPaymentCurrency: this.loan.monthlyPaymentCurrency,
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
      }
    }
    localStorage.setItem('vehicle', JSON.stringify(data));
  }

  validateTabErrors(){
    if($('#details .error').length > 0 && this.activeTab >= 1) {
      console.log('details', $('#details .error').length)
    this.hasBasic = true;
    } else {
    this.hasBasic = false;
    }
    if($('#lifecycle .error').length > 0 && this.activeTab >= 2) {
    this.hasLife = true;
    } else {
    this.hasLife = false;
    }
    if($('#specifications .error').length > 0 && this.activeTab >= 3) {
    this.hasSpecs = true;
    } else {
    this.hasSpecs = false;
    }
    if($('#fluids .error').length > 0 && this.activeTab >= 5) {
    this.hasFluids = true;
    } else {
    this.hasFluids = false;
    }
    if($('#details .error').length > 0 && this.activeTab == 1) return;
    if($('#lifecycle .error').length > 0 && this.activeTab == 2) return;
    if($('#specifications .error').length > 0 && this.activeTab == 3) return;
    if($('#insurance .error').length > 0 && this.activeTab == 4) return;
    if($('#fluids .error').length > 0 && this.activeTab == 5) return;
    if($('#wheels .error').length > 0 && this.activeTab == 6) return;
    if($('#engine .error').length > 0 && this.activeTab == 7) return;
    if($('#purchase .error').length > 0 && this.activeTab == 8) return;
    if($('#loan .error').length > 0 && this.activeTab == 9) return;
  }

  async changeTab(value){
    // const data = {
    //   vehicleIdentification: this.vehicleIdentification,
    //   vehicleType: this.vehicleType,
    //   VIN: this.VIN,
    //   DOT: this.DOT,
    //   year: this.year,
    //   manufacturerID: this.manufacturerID,
    //   modelID: this.modelID,
    //   plateNumber: this.plateNumber,
    //   countryID: this.countryID,
    //   stateID: this.stateID,
    //   driverID: this.driverID,
    //   teamDriverID: this.teamDriverID,
    //   serviceProgramID: this.serviceProgramID,
    //   annualSafetyDate: this.annualSafetyDate,
    //   annualSafetyReminder: this.annualSafetyReminder,
    //   currentStatus: this.currentStatus,
    //   ownership: this.ownership,
    //   ownerOperatorID: this.ownerOperatorID,
    //   groupID: this.groupID,
    //   aceID: this.aceID,
    //   aciID: this.aciID,
    //   vehicleColor: this.vehicleColor,
    //   bodyType: this.bodyType,
    //   bodySubType: this.bodySubType,
    //   msrp: this.msrp,
    //   iftaReporting: this.iftaReporting,
    //   inspectionFormID: this.inspectionFormID,
    //   lifeCycle: {
    //     inServiceDate: this.lifeCycle.inServiceDate,
    //     startDate: this.lifeCycle.startDate,
    //     inServiceOdometer: this.lifeCycle.inServiceOdometer,
    //     estimatedServiceYears: this.lifeCycle.estimatedServiceYears,
    //     estimatedServiceMonths: this.lifeCycle.estimatedServiceMonths,
    //     estimatedServiceMiles: this.lifeCycle.estimatedServiceMiles,
    //     estimatedResaleValue: this.lifeCycle.estimatedResaleValue,
    //     outOfServiceDate: this.lifeCycle.outOfServiceDate,
    //     outOfServiceOdometer: this.lifeCycle.outOfServiceOdometer,
    //   },
    //   specifications: {
    //     height: this.specifications.height,
    //     heightUnit: this.specifications.heightUnit,
    //     length: this.specifications.length,
    //     lengthUnit: this.specifications.lengthUnit,
    //     width: this.specifications.width,
    //     widthUnit: this.specifications.widthUnit,
    //     interiorVolume: this.specifications.interiorVolume,
    //     passangerVolume: this.specifications.passangerVolume,
    //     groundClearnce: this.specifications.groundClearnce,
    //     groundClearnceUnit: this.specifications.groundClearnceUnit,
    //     bedLength: this.specifications.bedLength,
    //     bedLengthUnit: this.specifications.bedLengthUnit,
    //     cargoVolume: this.specifications.cargoVolume,
    //     tareWeight: this.specifications.tareWeight,
    //     grossVehicleWeightRating: this.specifications.grossVehicleWeightRating,
    //     towingCapacity: this.specifications.towingCapacity,
    //     maxPayload: this.specifications.maxPayload,
    //     EPACity: this.specifications.EPACity,
    //     EPACombined: this.specifications.EPACombined,
    //     EPAHighway: this.specifications.EPAHighway,
    //   },
    //   insurance: {
    //     dateOfIssue: this.insurance.dateOfIssue,
    //     premiumAmount: this.insurance.premiumAmount,
    //     premiumCurrency: this.insurance.premiumCurrency,
    //     vendorID: this.insurance.vendorID,
    //     dateOfExpiry: this.insurance.dateOfExpiry,
    //     reminder: this.insurance.reminder,
    //     remiderEvery: this.insurance.remiderEvery,
    //     policyNumber: this.insurance.policyNumber,
    //     amount: this.insurance.amount,
    //     amountCurrency: this.insurance.amountCurrency
    //   },
    //   fluid: {
    //     fuelType: this.fluid.fuelType,
    //     fuelTankOneCapacity: this.fluid.fuelTankOneCapacity,
    //     fuelTankOneType: this.fluid.fuelTankOneType,
    //     fuelQuality: this.fluid.fuelQuality,
    //     fuelTankTwoCapacity: this.fluid.fuelTankTwoCapacity,
    //     fuelTankTwoType: this.fluid.fuelTankOneType,
    //     oilCapacity: this.fluid.oilCapacity,
    //     oilCapacityType: this.fluid.oilCapacityType,
    //     def: this.fluid.def,
    //     defType: this.fluid.defType
    //   },
    //   wheelsAndTyres: {
    //     numberOfTyres: this.wheelsAndTyres.numberOfTyres,
    //     driveType: this.wheelsAndTyres.driveType,
    //     brakeSystem: this.wheelsAndTyres.brakeSystem,
    //     wheelbase: this.wheelsAndTyres.wheelbase,
    //     rearAxle: this.wheelsAndTyres.rearAxle,
    //     frontTyreType: this.wheelsAndTyres.frontTyreType,
    //     rearTyreType: this.wheelsAndTyres.rearTyreType,
    //     frontTrackWidth: this.wheelsAndTyres.frontTrackWidth,
    //     rearTrackWidth: this.wheelsAndTyres.rearTrackWidth,
    //     frontWheelDiameter: this.wheelsAndTyres.frontWheelDiameter,
    //     rearWheelDiameter: this.wheelsAndTyres.rearWheelDiameter,
    //     frontTyrePSI: this.wheelsAndTyres.frontTyrePSI,
    //     rearTyrePSI: this.wheelsAndTyres.rearTyrePSI,
    //   },
    //   engine: {
    //     engineSummary: this.engine.engineSummary,
    //     engineBrand: this.engine.engineBrand,
    //     aspiration: this.engine.aspiration,
    //     blockType: this.engine.blockType,
    //     bore: this.engine.bore,
    //     camType: this.engine.camType,
    //     stroke: this.engine.stroke,
    //     valves: this.engine.valves,
    //     compression: this.engine.compression,
    //     cylinders: this.engine.cylinders,
    //     displacement: this.engine.displacement,
    //     fuelIndication: this.engine.fuelIndication,
    //     fuelQuality: this.engine.fuelQuality,
    //     maxHP: this.engine.maxHP,
    //     maxTorque: this.engine.maxTorque,
    //     readlineRPM: this.engine.readlineRPM,
    //     transmissionSummary: this.engine.transmissionSummary,
    //     transmissionType: this.engine.transmissionType,
    //     transmissonBrand: this.engine.transmissonBrand,
    //     transmissionGears: this.engine.transmissionGears,
    //   },
    //   purchase: {
    //     purchaseVendorID: this.purchase.purchaseVendorID,
    //     warrantyExpirationDate: this.purchase.warrantyExpirationDate,
    //     warrantyExpirationDateReminder: this.purchase.warrantyExpirationDateReminder,
    //     purchasePrice: this.purchase.purchasePrice,
    //     purchasePriceCurrency: this.purchase.purchasePriceCurrency,
    //     warrantyExpirationMeter: this.purchase.warrantyExpirationMeter,
    //     purchaseDate: this.purchase.purchaseDate,
    //     purchaseComments: this.purchase.purchaseComments,
    //     purchaseOdometer: this.purchase.purchaseOdometer,
    //   },
    //   loan: {
    //     loanVendorID: this.loan.loanVendorID,
    //     amountOfLoan: this.loan.amountOfLoan,
    //     amountOfLoanCurrency: this.loan.amountOfLoanCurrency,
    //     aspiration: this.loan.aspiration,
    //     annualPercentageRate: this.loan.annualPercentageRate,
    //     downPayment: this.loan.downPayment,
    //     downPaymentCurrency: this.loan.downPaymentCurrency,
    //     dateOfLoan: this.loan.dateOfLoan,
    //     monthlyPayment: this.loan.monthlyPayment,
    //     monthlyPaymentCurrency: this.loan.monthlyPaymentCurrency,
    //     firstPaymentDate: this.loan.firstPaymentDate,
    //     numberOfPayments: this.loan.numberOfPayments,
    //     loadEndDate: this.loan.loadEndDate,
    //     accountNumber: this.loan.accountNumber,
    //     generateExpenses: this.loan.generateExpenses,
    //     notes: this.loan.notes,
    //   },
    //   settings: {
    //     primaryMeter: this.settings.primaryMeter,
    //     fuelUnit: this.settings.fuelUnit,
    //     hardBreakingParams: this.settings.hardBreakingParams,
    //     hardAccelrationParams: this.settings.hardAccelrationParams,
    //     turningParams: this.settings.turningParams,
    //     measurmentUnit: this.settings.measurmentUnit,
    //   }
    // }

    // if(!this.vehicleID){
    //   localStorage.setItem('vehicle', JSON.stringify(data));
      // await this.addVehicle();
    // }else {
    //   await this.updateVehicle();
    // }


    // if($('#details .error').length > 0 && this.activeTab == 1) return;
    // if($('#lifecycle .error').length > 0 && this.activeTab == 2) return;
    // if($('#specifications .error').length > 0 && this.activeTab == 3) return;
    // if($('#insurance .error').length > 0 && this.activeTab == 4) return;
    // if($('#fluids .error').length > 0 && this.activeTab == 5) return;
    // if($('#wheels .error').length > 0 && this.activeTab == 6) return;
    // if($('#engine .error').length > 0 && this.activeTab == 7) return;
    // if($('#purchase .error').length > 0 && this.activeTab == 8) return;
    // if($('#loan .error').length > 0 && this.activeTab == 9) return;

    // if(value != this.activeTab + 1 && value > this.activeTab) return;


    this.activeTab = value;
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
       // GROUP MODAL
       addGroup() {
        this.apiService.postData('groups', this.groupData).subscribe({
          complete: () => { },
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
            this.fetchGroups();
            this.toastr.success('Group added successfully');
            $('#addGroupModal').modal('hide');
      this.fetchGroups();

          },
        });
      }

    openImageModal(slide){
      this.modalImage = slide;
      $('#imageModal').modal('show');
    }

    deleteUploadedImage(index){
      this.slides.splice(index, 1);
      this.existingPhotos.splice(index, 1);
    }

    deleteLocalImage(index){
      this.localPhotos.splice(index, 1);
      this.uploadedPhotos.splice(index, 1);
    }

    driverChange(driverType){
      if(driverType == 'main' && this.driverID != '' && this.driverID == this.teamDriverID){
        alert('Both drivers cant be same.');
        this.driverID = '';
        $('#main_driver').val('');
      }else if(driverType == 'team' && this.teamDriverID != '' && this.driverID == this.teamDriverID){
        alert('Both drivers cant be same.');
        this.teamDriverID = '';
        $('#team_driver').val('');
      }
    }
}
