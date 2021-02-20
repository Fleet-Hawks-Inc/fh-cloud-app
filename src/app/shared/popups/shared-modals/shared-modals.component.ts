import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ListService } from '../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import  Constants  from '../../../../app/pages/fleet/constants';
import { Auth } from 'aws-amplify';

declare var $: any;
@Component({
  selector: 'app-shared-modals',
  templateUrl: './shared-modals.component.html',
  styleUrls: ['./shared-modals.component.css']
})
export class SharedModalsComponent implements OnInit {
  countriesList: any= [];
  countries: any  = [];
  states: any = [];
  cities: any = [];
  manufacturers: any = [];
  models: any = [];
  assetManufacturers: any = [];
  assetModels: any = [];
  form:any;
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';
  private destroy$ = new Subject();
  errors = {};
  constructor(private apiService: ApiService,private toastr: ToastrService, private httpClient: HttpClient, private listService: ListService,     private spinner: NgxSpinnerService
    ) { }
stateData = {
  countryID : '',
  stateName: '',
  stateCode: ''
};
cityData = {
  countryID : '',
  stateID: '',
  cityName: '', 
};
vehicleMakeData = {
  manufacturerName: ''
}
vehicleModelData = {
  manufacturerID: '',
  modelName:''
}
assetMakeData = {
  manufacturerName: ''
}
assetModelData = {
  manufacturerID: '',
  modelName:''
}
test: any = [];

// Vehicles variables start
vehicleID: string;
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
// Vehicles variables end
// driver variables start
driverData = {
  driverType: 'employee',
  entityType: 'driver',
  gender: 'M',
  DOB: '',
  address: [{
    addressType: '',
    countryID: '',
    countryName: '',
    stateID: '',
    stateName: '',
    cityID: '',
    cityName: '',
    zipCode: '',
    address1: '',
    address2: '',
    geoCords: {
      lat: '',
      lng: ''
    },
    manual: false
  }],
  documentDetails: [{
    documentType: '',
    document: '',
    issuingAuthority: '',
    issuingCountry: '',
    issuingState: '',
    issueDate: '',
    expiryDate: '',
    uploadedDocs: []
  }],
  crossBorderDetails: {},
  paymentDetails: {},
  licenceDetails: {},
  hosDetails: {},
  emergencyDetails: {},
};

abstractValid: boolean = false;
prefixOutput: string;
finalPrefix = '';
currentUser: any;
currentTab = 1;
abstractDocs = [];
uploadedDocs = [];
isSubmitted: boolean = false;
carrierID: any;
carrierYards = [];
// driver variables ends

/**
 * service program props
 */
pageTitle: string;
vehicleModal: boolean = false;
vehicles: any;
tasks = [];
uploadedPhotos = [];
private programID;
serviceData = {
  serviceScheduleDetails: [{
    serviceTask: '',
    repeatByTime: '',
    repeatByTimeUnit: '',
    repeatByOdometer: '',
  }]
};

taskData = {
  taskType: 'service',
};

inspectionForms = [];
groups = [];
drivers = [];
groupData = {
  groupType : Constants.GROUP_VEHICLES 
};
localPhotos = [];
activeTab = 1;

  async ngOnInit() {
    this.fetchCountries();
    this.fetchAssetManufacturers();
    this.fetchAssetModels();
    this.newManufacturers();
    this.fetchVehicles();
    this.fetchTasks();

    this.fetchInspectionForms();
    //this.fetchVendors();
    this.fetchGroups();
    this.fetchDrivers();
    this.listService.fetchVendors();
    this.listService.fetchManufacturers()
    this.listService.fetchModels();
    // this.listService.fetchCountries();
    // this.listService.fetchStates();
    this.listService.fetchOwnerOperators();
    this.listService.fetchServicePrograms();

    $(document).ready(() => {
      this.form = $('#stateForm').validate();
      this.form = $('#cityForm').validate();
      this.form = $('#vehicleMakeForm').validate();
      this.form = $('#vehicleModelForm').validate();
      this.form = $('#assetMakeForm').validate();
      this.form = $('#assetModelForm').validate();
      this.form = $('#serviceProgramForm').validate();
    });    
    this.httpClient.get('assets/vehicleType.json').subscribe(data => {
      this.vehicleTypeList = data;
    });

    this.manufacturers = this.listService.manufacturerList;
    this.models = this.listService.modelList;

    await this.getCurrentuser();

    console.log('this.currentUser', this.currentUser);
    if(this.currentUser.userType != 'Cloud Admin') {
      this.getCarrierDetails(this.currentUser.carrierID);
    } else {
      this.prefixOutput = 'PB-'
    }
    // this.countries = this.listService.countryList;
    // this.states = this.listService.stateList;
  }
  /**
   * fetch vehicle manufacturers
   */
  fetchManufacturers(){
    this.apiService.getData('manufacturers')
      .subscribe((result: any) => {
        this.manufacturers = result.Items;
      });
  }
  newManufacturers(){
    this.apiService.getData('manufacturers')
    .subscribe((result: any) => {
      this.test = result.Items;   
      for(let i=0; i< this.test.length; i++){
        
   }
    }); 
 }
 
 fetchInspectionForms() {
  this.apiService
    .getData('inspectionForms/type/Vehicle')
    .subscribe((result: any) => {
      this.inspectionForms = result.Items;
    });
}

fetchGroups() {
  this.apiService.getData(`groups?groupType=${this.groupData.groupType}`).subscribe((result: any) => {
    this.groups = result.Items;
  });
}

fetchDrivers(){
  this.apiService.getData('drivers').subscribe((result: any) => {
    this.drivers = result.Items;
  });
}
   /**
   * fetch asset manufacturers
   */
  fetchAssetManufacturers(){
    this.apiService.getData('assetManufacturers')
      .subscribe((result: any) => {
        this.assetManufacturers = result.Items;
      });
  }

  fetchAssetModels() {
    this.apiService.getData('assetModels')
      .subscribe((result: any) => {
        this.assetModels = result.Items;
      })
  }
 /*
   * Get all countries from api
   */
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }
  getStates(id) {
    this.apiService.getData('states/country/' + id)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  getCities(id) {
    this.apiService.getData('cities/state/' + id)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }
  // Add state
  addState() {
    this.hideErrors();  
    this.apiService.postData('states', this.stateData).
      subscribe({
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
          $('#addStateModal').modal('hide');
          this.toastr.success('State Added Successfully.');
          this.listService.fetchStates();
        }
      });
  }
  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
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
  // add city
  addCity() {
    this.hideErrors();  
    this.apiService.postData('cities', this.cityData).
      subscribe({
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
          $('#addCityModal').modal('hide');
          this.toastr.success('City Added Successfully.');
        }
      });
  }
  // add vehicle make
  addVehicleMake() {
    this.hideErrors();  
    this.apiService.postData('manufacturers', this.vehicleMakeData).
      subscribe({
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
          $('#addVehicleMakeModal').modal('hide');
          this.toastr.success('Vehicle Make Added Successfully.');
          this.listService.fetchManufacturers();
        }
      });
  }

   /**
    *   add vehicle model
    * */
   addVehicleModel() {
    this.hideErrors();  
    this.apiService.postData('vehicleModels', this.vehicleModelData).
      subscribe({
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
          $('#addVehicleModelModal').modal('hide');
          this.toastr.success('Vehicle Model Added Successfully.');
          this.listService.fetchModels();
        }
      });
  }

  /**
   * add asset make
   */
   
   addAssetMake() {
    this.hideErrors();  
    this.apiService.postData('assetManufacturers', this.assetMakeData).
      subscribe({
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
          $('#addAssetMakeModal').modal('hide');
          this.toastr.success('Asset Make Added Successfully.');
          this.listService.fetchAssetManufacturers();
        }
      });
  }
  /**
   * add asset model
   */
   // add vehicle model
   addAssetModel() {
    this.hideErrors();  
    this.apiService.postData('assetModels', this.assetModelData).
      subscribe({
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
          $('#addAssetModelModal').modal('hide');
          this.toastr.success('Asset Model Added Successfully.');
          this.listService.fetchAssetModels();
        }
      });
  }

  addDocument() {
    this.serviceData.serviceScheduleDetails.push({
      serviceTask: '',
      repeatByTime: '',
      repeatByTimeUnit: '',
      repeatByOdometer: '',
    })
    
  }
  addServiceProgram() {
    
    this.hideErrors();
    this.apiService.postData('servicePrograms', this.serviceData).subscribe({
      complete: () => { },
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
            },
            error: () => { },
            next: () => { },
          });
      },
        next: (res) => {
          this.response = res;
          this.listService.fetchServicePrograms();
          $('#addVehicleProgramModal').modal('hide');

          this.toastr.success('Service added successfully');
        }
      });
  }

  addServiceTask() {
   
    this.hideErrors();
    this.apiService.postData('tasks', this.taskData).subscribe({
      complete: () => { },
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
            },
            error: () => { },
            next: () => { },
          });
      },
        next: (res) => {
          
          this.toastr.success('Service Task added successfully');
          $('#addServiceTaskModal').modal('hide');
          this.taskData['taskName'] = '';
          this.taskData['description'] = '';
        }
      });
  }

  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe({
      error: () => {},
      next: (result: any) => {
        this.vehicles = result.Items;
      },
    });
  }

  fetchTasks() {
    this.apiService.getData('tasks').subscribe({
      error: () => {},
      next: (result: any) => {
       // this.tasks = result.Items;
       result.Items.forEach(element => {
        if (element.taskType === 'service') {
          this.tasks.push(element);
        }
       });
      },
    });
  }

  removeTasks(i) {
    this.serviceData.serviceScheduleDetails.splice(i, 1);
  }

  async changeTab(value){
    this.activeTab = value;
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
    };
    
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
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
          localStorage.setItem('vehicle', JSON.stringify(vehicle));
          this.toastr.success('Vehicle Added Successfully');
          $('#addVehicleModelDriver').modal('hide');
          this.listService.fetchVehicles();
        },
      })});
    } catch (error) {
      return 'error found';
    }
    
  }

  /*
   * Selecting files before uploading
   */
  selectDocuments(event) {
    let files = [...event.target.files];
    
    
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

  resetModel(){
    this.modelID = '';
    $('#vehicleSelect').val('');
  }
  resetState(){
    this.stateID = '';
    $('#stateSelect').val('');
  }


  async getCarrierDetails(id: string) {
    this.spinner.show();
    this.apiService.getData('carriers/'+ id).subscribe(res => {
      if(res.Items.length > 0){
        let carrierPrefix = res.Items[0].businessName;
        let toArray = carrierPrefix.match(/\b(\w)/g); // ['J','S','O','N']
        this.prefixOutput = toArray.join('') + '-'; // JSON
      }
      this.spinner.hide();
    })
  }

  
  async nextStep() {
    
    // if(!this.driverID){
      // localStorage.setItem('driver', JSON.stringify(this.driverData));
      await this.onSubmit();
    // }else {
    //   await this.updateDriver();
    // }
   
    if(this.abstractDocs.length == 0 && this.currentTab == 1) {
      this.abstractValid = true; 
      return;
    }
    if($('#addDriverBasic .error').length > 0 && this.currentTab == 1) return;
    if($('#addDriverAddress .error').length > 0 && this.currentTab == 2) return;
    if($('#documents .error').length > 0 && this.currentTab == 3) return;
    if($('#addDriverCrossBorder .error').length > 0 && this.currentTab == 4) return;
    if($('#licence .error').length > 0 && this.currentTab == 5) return;
    if($('#payment .error').length > 0 && this.currentTab == 6) return;
    if($('#Driverhos .error').length > 0 && this.currentTab == 7) return;
    
    this.currentTab++; 

  }
  prevStep() {
    this.currentTab--;
    if(this.driverID) return;
    // localStorage.setItem('driver', JSON.stringify(this.driverData));
  }
  async tabChange(value) {
    // if(!this.driverID){
      // localStorage.setItem('driver', JSON.stringify(this.driverData));
      await this.onSubmit();
    // }else {
    //   await this.updateDriver();
    // }

    if($('#addDriverBasic .error').length > 0 && this.currentTab == 1) return;
    if($('#addDriverAddress .error').length > 0 && this.currentTab == 2) return;
    if($('#documents .error').length > 0 && this.currentTab == 3) return;
    if($('#addDriverCrossBorder .error').length > 0 && this.currentTab == 4) return;
    if($('#licence .error').length > 0 && this.currentTab == 5) return;
    if($('#payment .error').length > 0 && this.currentTab == 6) return;
    if($('#Driverhos .error').length > 0 && this.currentTab == 7) return;
    if($('#emergency .error').length > 0 && this.currentTab == 8) return;

    if(value != this.currentTab + 1 && value > this.currentTab) return;

    this.currentTab = value;
  }

  // for driver submittion
  async onSubmit() {
    this.hasError = false;
    this.hasSuccess = false;
    // this.register();
    this.spinner.show();
    this.hideErrors();
    this.driverData['currentTab'] = this.currentTab;
    
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append docs if any
    for(let j = 0; j < this.uploadedDocs.length; j++){
      for (let k = 0; k < this.uploadedDocs[j].length; k++) {
        let file = this.uploadedDocs[j][k];
        formData.append(`uploadedDocs-${j}`, file);
      }
    }

    //append abstact history docs if any
    for(let k = 0; k < this.abstractDocs.length; k++){
      formData.append('abstractDocs', this.abstractDocs[k]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.driverData));
    
    
    try {
      return await new Promise((resolve, reject) => {this.apiService.postData('drivers',formData, true).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
              this.spinner.hide();
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
              this.hasError = true;
              if(err) return reject(err);
              this.spinner.hide();
              //this.toastr.error('Please see the errors');
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        // this.response = res;
        // this.hasSuccess = true;
        this.toastr.success('Driver added successfully');
        this.listService.fetchDrivers();
        this.isSubmitted = true;
        // this.modalServiceOwn.triggerRedirect.next(true);
        // this.takeUntil$.next();
        // this.takeUntil$.complete();
        let driver = {
          driverType: 'employee',
          entityType: 'driver',
          employeeId: '',
          ownerOperator: '',
          driverStatus: '',
          userName: '',
          firstName: '',
          middleName: '',
          lastName: '',
          startDate: '',
          terminationDate: '',
          contractStart: '',
          contractEnd: '',
          password: '',
          confirmPassword: '',
          citizenship: '',
          assignedVehicle: '',
          groupID: '',
          driverImage: '',
          gender: 'M',
          DOB: '',
          workPhone: '',
          workEmail: '',
          address: [{
            addressID: '',
            addressType: '',
            userLocation: '',
            countryID: '',
            countryName: '',
            stateID: '',
            stateName: '',
            cityID: '',
            cityName: '',
            zipCode: '',
            address1: '',
            address2: '',
            geoCords : {
              lat: null,
              lng: null
            },
            manual: false,
          }],
          documentDetails: [{
            documentType: '',
            document: '',
            issuingAuthority: '',
            issuingCountry: '',
            issuingState: '',
            issueDate: '',
            expiryDate: '',
            uploadedDocs: [],
          }],
          crossBorderDetails: {
            ACI_ID: '',
            ACE_ID: '',
            fast_ID: '',
            fastExpiry: '',
            csa: false,
          },
          paymentDetails: {
            paymentType: '',
            loadedMiles: '',
            loadedMilesTeam: '',
            loadedMilesUnit: '',
            loadedMilesTeamUnit: '',
            emptyMiles: '',
            emptyMilesTeam: '',
            emptyMilesUnit: '',
            emptyMilesTeamUnit: '',
            loadPayPercentage: '',
            loadPayPercentageOf: '',
            rate: '',
            rateUnit: '',
            waitingPay: '',
            waitingPayUnit: '',
            waitingHourAfter: '',
            deliveryRate: '',
            deliveryRateUnit: '',
            SIN_Number: '',
            payPeriod: '',
          },
          licenceDetails: {
            CDL_Number: '',
            issuedCountry: '',
            issuedState: '',
            licenceExpiry: '',
            licenceNotification: true,
            WCB: '',
            medicalCardRenewal: '',
            healthCare: '',
            vehicleType: '',
          },
          hosDetails: {
            hosStatus: '',
            type: '',
            hosRemarks: '',
            hosCycle: '',
            homeTerminal: '',
            pcAllowed: false, 
            ymAllowed: false,
          },
          emergencyDetails: {
            name: '',
            relationship: '',
            phone: '',
            email: '',
            emergencyAddress: '',
          },
        }
        // localStorage.setItem('driver', JSON.stringify(driver));
        // this.router.navigateByUrl('/fleet/drivers/list');
        this.spinner.hide();
        
      },
    })})
  } catch (error) {
    return 'error found';
  };
  }

  adddriverDocument() {
    this.driverData.documentDetails.push({
      documentType: '',
      document: '',
      issuingAuthority: '',
      issuingCountry: '',
      issuingState: '',
      issueDate: '',
      expiryDate: '',
      uploadedDocs: []
    });
  }

  complianceChange(value) {
    if(value === 'Non Exempted') {
      this.driverData.hosDetails['type'] = 'ELD';
    } else {
      this.driverData.hosDetails['type'] = 'Log Book';
      this.driverData.hosDetails['hosCycle'] = '';
    }
  }
  onChangeHideErrors(fieldname = '') {
    $('[name="' + fieldname + '"]')
      .removeClass('error')
      .next()
      .remove('label');
  }

  onChangeUnitType(value: any) {
    if (value === 'employee') {
      delete this.driverData['ownerOperator'];
      delete this.driverData['contractStart'];
      delete this.driverData['contractEnd'];
    } else {
      delete this.driverData['employeeId'];
      delete this.driverData['startDate'];
      delete this.driverData['terminationDate'];
      
    }
    this.driverData['driverType'] = value;
  }

  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    let currentUserCarrier = this.currentUser.carrierID;
    this.carrierID = this.currentUser.carrierID;
    this.apiService.getData(`addresses/carrier/${currentUserCarrier}`).subscribe(result => {
      result.Items.map(e => {
        if(e.addressType == 'yard') {
          this.carrierYards.push(e);
        }
      })
    });
  }
}
