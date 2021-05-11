import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { from, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ListService } from '../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import constants from '../../../../app/pages/fleet/constants';
import { HereMapService } from '../../../services';
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
  deletedAddress = [];
  allAssetTypes: any;

  constructor(private apiService: ApiService, private HereMap: HereMapService, private toastr: ToastrService, private httpClient: HttpClient, private listService: ListService,     private spinner: NgxSpinnerService
    ) {
      const date = new Date();
      this.getcurrentDate = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
      this.birthDateMinLimit = {year: date.getFullYear() - 60, month: date.getMonth() + 1, day: date.getDate()};
      this.futureDatesLimit = {year: date.getFullYear() + 30, month: date.getMonth() + 1, day: date.getDate()};
     }

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
statesObject: any;
assets: any = [];

fuelTypes = [];
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
  servicePrograms = [];
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
// hasBasic: boolean = false;
// hasDocs: boolean = false;
// hasLic: boolean = false;
// hasPay: boolean = false;
// hasHos: boolean = false;

driverData = {
  userName: '',
  lastName: '',
  phone: '',
  email: '',
  firstName: '',
  password: '',
  confirmPassword: '',
  citizenship: '',
  driverStatus: '',
  ownerOperator: '',
  startDate: '',
  terminationDate: '',
  contractStart: '',
  contractEnd: '',
  employeeContractorId: '',
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
  paymentDetails: {
    rate: '',
    rateUnit: '',
    waitingPay: '',
    waitingPayUnit: '',
    waitingHourAfter: '',
    deliveryRate: '',
    deliveryRateUnit: '',
    loadPayPercentage: '',
    loadPayPercentageOf: '',
    loadedMiles: '',
    loadedMilesUnit: '',
    emptyMiles: '',
    emptyMilesUnit: '',
    loadedMilesTeam: '',
    loadedMilesTeamUnit: '',
    emptyMilesTeam: '',
    emptyMilesTeamUnit: '',
    paymentType: '',
    payPeriod: '',
  },
  SIN: '',
  CDL_Number: '',
  licenceDetails: {
    licenceExpiry: '',
    licenceNotification: true,
    issuedCountry: '',
    issuedState: '',
    vehicleType: '',

  },
  hosDetails: {
    pcAllowed: false,
    ymAllowed: false,
    hosCycle: '',
    hosStatus: '',
    hosRemarks: '',
    type: '',
    homeTerminal: '',
    timezone: '',
    optZone: 'South (Canada)'
  },
  emergencyDetails: {},
};

abstractValid = false;
prefixOutput: string;
finalPrefix = '';
currentUser: any;
currentTab = 1;
abstractDocs = [];
uploadedDocs = [];
isSubmitted = false;
carrierID: any;
carrierYards = [];
absDocs = [];
documentTypeList: any = [];
cycles = [];
ownerOperators: any = [];
getcurrentDate: any;
birthDateMinLimit: any;
futureDatesLimit: any;
countriesObject: any;
fieldTextType: boolean;
  cpwdfieldTextType: boolean;
  licCountries: any = [];
finaltimezones: any = [];
// driver variables ends

// Issues variables ends
issuesData = {
  issueName: '',
  currentStatus: 'OPEN',
  unitID: '',
  unitType: 'vehicle',
  reportedDate: '',
  description: '',
  odometer: null,
  reportedBy: '',
  assignedTo: '',
}



/**
 * service program props
 */
pageTitle: string;
vehicleModal = false;
vehicles: any;
tasks = [];
uploadedPhotos = [];
private programID;
serviceData = {
  programName: '',
  description: '',
  vehicles: [],
  serviceScheduleDetails: [{
    serviceTask: '',
    repeatByTime: '',
    repeatByTimeUnit: '',
    repeatByOdometer: '',
  }]
};

taskData = {
  taskType: 'service',
  taskName: '',
  description: ''
};

inspectionForms = [];
groups = [];
drivers: any;
groupData = {
  groupName: '',
  groupType: 'vehicles',
  description: '',
  groupMembers: []
};
localPhotos = [];
activeTab = 1;

assetsData = {
  assetIdentification: '',
  groupID: '',
  VIN: '',
  startDate: '',
  inspectionFormID: null,
  assetDetails: {
    assetType: '',
    currentStatus: '',
    year: '',
    manufacturer: '',
    model: '',
    height: '',
    heightUnit: '',
    length: '',
    lengthUnit: '',
    axle: '',
    GVWR: '',
    GVWR_Unit: '',
    GAWR: '',
    GAWR_Unit: '',
    ownerShip: '',
    ownerOperator: '',
    licenceCountryID: '',
    licenceStateID: '',
    licencePlateNumber: '',
    annualSafetyDate: '',
    annualSafetyReminder: true,
    remarks: '',
  },
  insuranceDetails: {
    dateOfIssue: '',
    premiumAmount: '',
    premiumCurrency: '',
    dateOfExpiry: '',
    reminderBefore: '',
    reminderBeforeUnit: '',
    vendor: ''
  },
  crossBorderDetails: {
    ACI_ID: '',
    ACE_ID: ''
  },
  uploadedPhotos: [],
  uploadedDocs: []
};
years = [];
inspectionFormsAsset = [];
users = [];

  async ngOnInit() {
    this.fetchCountries();
    // this.fetchAssetManufacturers();

    this.fetchAssetModels();
    this.newManufacturers();
    this.fetchVehicles();
    this.fetchTasks();
    this.fetchAssetTypes();
    this.getYears();
    this.fetchUsers();

    this.fetchInspectionForms();
    this.fetchInspectionFormsAssets();
    this.fetchDocuments();
    this.fetchGroups();
    this.fetchCycles(); // fetch cycles
    this.fetchAssets();
    this.fetchAllCountriesIDs();
    this.fetchAllStatesIDs();
    this.fetchFuelTypes();
    this.listService.fetchVendors();
    this.listService.fetchManufacturers()
    this.listService.fetchModels();
    this.listService.fetchOwnerOperators();
    this.listService.fetchServicePrograms();
    this.listService.fetchDrivers();
    this.listService.fetchAssetManufacturers();
this.fetchTimezones();
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
    this.drivers = this.listService.driversList;
    this.ownerOperators = this.listService.ownerOperatorList;
    this.assetManufacturers = this.listService.assetManufacturesList;

    await this.getCurrentuser();
    this.listService.ownerOperatorList;
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
 fetchTimezones(){
  const ct = require('countries-and-timezones');
  const UStimezones = ct.getTimezonesForCountry('US');
  UStimezones.forEach((element: any) => {
    const obj: any = {
      name: element.name,
      country: element.country
      };
      this.finaltimezones.push(obj);
  });
  const CAtimezones = ct.getTimezonesForCountry('CA');
  CAtimezones.forEach((e: any) => {
  const obj: any = {
  name: e.name,
  country: e.country
  };
  this.finaltimezones.push(obj);
  });
}
 fetchCycles() {
  this.apiService.getData('cycles')
    .subscribe((result: any) => {
      this.cycles = result.Items;
    });
}

 fetchInspectionForms() {
  this.apiService
    .getData('inspectionForms/type/vehicle')
    .subscribe((result: any) => {
      this.inspectionForms = result.Items;
    });
}

fetchInspectionFormsAssets() {
  this.apiService
    .getData('inspectionForms/type/asset')
    .subscribe((result: any) => {
      this.inspectionFormsAsset = result.Items;
    });
}

fetchGroups() {
  this.apiService.getData(`groups/getGroup/${this.groupData.groupType}`).subscribe((result: any) => {
    this.groups = result.Items;
  });
}

fetchDrivers(){
  this.apiService.getData('drivers').subscribe((result: any) => {
    this.drivers = result.Items;
  });
}
  //  /**
  //  * fetch asset manufacturers
  //  */
  // fetchAssetManufacturers(){
  //   this.apiService.getData('assetManufacturers')
  //     .subscribe((result: any) => {
  //       this.assetManufacturers = result.Items;
  //     });
  // }

  fetchAssetModels() {
    this.apiService.getData('assetModels')
      .subscribe((result: any) => {
        this.assetModels = result.Items;
      })
  }

  fetchAssets() {
    this.apiService.getData('assets')
      .subscribe((result: any) => {
        this.assets = result.Items;
      })
  }
 /*
   * Get all countries from api
   */
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
        this.countries.map(elem => {
          if (elem.countryName == 'Canada' || elem.countryName == 'United States of America') {
            this.licCountries.push({ countryName: elem.countryName, countryID: elem.countryID })
          }
        });
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
          this.listService.fetchCities();
          $('#addCityModal').modal('hide');
          this.toastr.success('City Added Successfully.');
          this.listService.fetchCities();
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
          this.assetModelData.manufacturerID = '';
          this.assetMakeData.manufacturerName = '';
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
          this.listService.fetchTasks();
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
      servicePrograms: this.servicePrograms,
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
            servicePrograms: [],
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
          this.clearVehicleData();
          $('#addVehicleModelDriver').modal('hide');
          this.listService.fetchVehicles();
        },
      })});
    } catch (error) {
      return 'error found';
    }

  }

  fetchFuelTypes(){
    this.apiService.getData('fuelTypes').subscribe((result: any) => {
      this.fuelTypes = result.Items;
    });
  }

   /*
   * Selecting files before uploading
   */
  selectDocuments(event, i) {
    let files = [...event.target.files];
    if(i != null) {
      if(this.uploadedDocs[i] == undefined) {
        this.uploadedDocs[i] = files;
      }
    } else {
      this.abstractDocs = [];
      this.abstractDocs = files;
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
  // DRIVER SECTION

    // Show password
    toggleFieldTextType() {
      this.fieldTextType = !this.fieldTextType;
    }
    togglecpwdfieldTextType() {
      this.cpwdfieldTextType = !this.cpwdfieldTextType;
    }

  // for driver submittion
  async onSubmit() {
    this.hasError = false;
    this.hasSuccess = false;
    // this.register();
    this.spinner.show();
    this.hideErrors();
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
              // if(err) return reject(err);
              this.spinner.hide();
              //this.toastr.error('Please see the errors');
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        $('#addDriverModelVehicle').modal('hide');
        this.toastr.success('Driver added successfully');
        this.clearDriverData();
        this.listService.fetchDrivers();
        this.isSubmitted = true;
        this.spinner.hide();
      },
    })})
  } catch (error) {
    return 'error found';
  }}

  fetchDocuments() {
    this.httpClient.get('assets/travelDocumentType.json').subscribe(data =>{
      this.documentTypeList = data;
    })
  }
  addDriverDocument() {
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
    if(value === 'non_Exempted') {
      this.driverData.hosDetails[`type`] = 'ELD';
    } else {
      this.driverData.hosDetails[`type`] = 'Log Book';
      this.driverData.hosDetails[`hosCycle`] = '';
    }
  }
  onChangeHideErrors(fieldname = '') {
    $('[name="' + fieldname + '"]')
      .removeClass('error')
      .next()
      .remove('label');
  }

  onChangeUnitType(str, value: any) {
    if(str == 'driver_type') {
      if (value === 'employee') {
        delete this.driverData.ownerOperator;
        delete this.driverData.contractStart;
        delete this.driverData.contractEnd;
      } else {
        // delete this.driverData.employeeId;
        delete this.driverData.startDate;
        delete this.driverData.terminationDate;
      }
      this.driverData.driverType = value;
    } else {
      this.driverData.gender = value;
    }
  }


  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    let currentUserCarrier = this.currentUser.carrierID;
    this.carrierID = this.currentUser.carrierID;
    if(this.currentUser.userType == 'Cloud Admin') {
      let isCarrierID = localStorage.getItem('carrierID');
      if(isCarrierID != undefined) {
        currentUserCarrier = isCarrierID;
      }
    }
    this.apiService.getData(`addresses/carrier/${currentUserCarrier}`).subscribe(result => {
      result.Items.map(e => {
        if(e.addressType == 'yard') {
          this.carrierYards.push(e);
        }
      })
    });
  }

  remove(obj, i, addressID = null) {
    if (obj === 'address') {
      if (addressID != null) {
        this.deletedAddress.push(addressID)
      }
      this.driverData.address.splice(i, 1);
    } else {
      this.driverData.documentDetails.splice(i, 1);
    }
  }

  changePaymentModeForm(value) {
    if (value === 'Pay Per Mile') {
      delete this.driverData.paymentDetails.loadPayPercentage;
      delete this.driverData.paymentDetails.loadPayPercentageOf;
      delete this.driverData.paymentDetails.rate;
      delete this.driverData.paymentDetails.rateUnit;
      delete this.driverData.paymentDetails.waitingPay;
      delete this.driverData.paymentDetails.waitingPayUnit;
      delete this.driverData.paymentDetails.waitingHourAfter;
      delete this.driverData.paymentDetails.deliveryRate;
      delete this.driverData.paymentDetails.deliveryRateUnit;
    } else if (value === 'Percentage') {

      delete this.driverData.paymentDetails.loadedMiles;
      delete this.driverData.paymentDetails.loadedMilesUnit;
      delete this.driverData.paymentDetails.loadedMilesTeam;
      delete this.driverData.paymentDetails.loadedMilesTeamUnit;
      delete this.driverData.paymentDetails.emptyMiles;
      delete this.driverData.paymentDetails.emptyMilesTeam;
      delete this.driverData.paymentDetails.emptyMilesUnit;
      delete this.driverData.paymentDetails.emptyMilesTeamUnit;
      delete this.driverData.paymentDetails.deliveryRate;
      delete this.driverData.paymentDetails.deliveryRateUnit;
      delete this.driverData.paymentDetails.rate;
      delete this.driverData.paymentDetails.rateUnit;
      delete this.driverData.paymentDetails.waitingPay;
      delete this.driverData.paymentDetails.waitingPayUnit;
      delete this.driverData.paymentDetails.waitingHourAfter;

    } else if (value === 'Pay Per Hour') {
      delete this.driverData.paymentDetails.deliveryRate;
      delete this.driverData.paymentDetails.deliveryRateUnit;
      delete this.driverData.paymentDetails.loadPayPercentage;
      delete this.driverData.paymentDetails.loadPayPercentageOf;
      delete this.driverData.paymentDetails.loadedMiles;
      delete this.driverData.paymentDetails.loadedMilesUnit;
      delete this.driverData.paymentDetails.loadedMilesTeam;
      delete this.driverData.paymentDetails.loadedMilesTeamUnit;
      delete this.driverData.paymentDetails.emptyMiles;
      delete this.driverData.paymentDetails.emptyMilesTeam;
      delete this.driverData.paymentDetails.emptyMilesUnit;
      delete this.driverData.paymentDetails.emptyMilesTeamUnit;
    } else {
      delete this.driverData.paymentDetails.loadedMiles;
      delete this.driverData.paymentDetails.loadedMilesUnit;
      delete this.driverData.paymentDetails.loadedMilesTeam;
      delete this.driverData.paymentDetails.loadedMilesTeamUnit;
      delete this.driverData.paymentDetails.emptyMiles;
      delete this.driverData.paymentDetails.emptyMilesTeam;
      delete this.driverData.paymentDetails.emptyMilesUnit;
      delete this.driverData.paymentDetails.emptyMilesTeamUnit;
      delete this.driverData.paymentDetails.rate;
      delete this.driverData.paymentDetails.rateUnit;
      delete this.driverData.paymentDetails.waitingPay;
      delete this.driverData.paymentDetails.waitingPayUnit;
      delete this.driverData.paymentDetails.waitingHourAfter;
    }
  }

  async getStates(id: any, oid = null) {
    if(oid != null) {
      this.driverData.address[oid].countryName = this.countriesObject[id];
    }
    this.apiService.getData('states/country/' + id)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  async getCities(id: any, oid = null) {
    if(oid != null) {
      this.driverData.address[oid].stateName = this.statesObject[id];
    }

    this.apiService.getData('cities/state/' + id)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }
// ISSUE SECTION
  addIssue() {
    this.hideErrors();

    // create form data instance
    const formData = new FormData();

    // append other fields
    formData.append('data', JSON.stringify(this.issuesData));

    // this.apiService.postData('issues/', data).subscribe({
    this.apiService.postData('issues', formData, true).subscribe({
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
          this.clearIssueData();
          this.toastr.success('Issue Added successfully');
          $('#addIssuesModal').modal('hide');
          let issueVehicleID = localStorage.getItem('issueVehicleID');
          issueVehicleID = issueVehicleID.slice(1, -1);
          this.listService.fetchVehicleIssues(issueVehicleID);
          this.listService.fetchAssetsIssues(issueVehicleID);
        }
      });
  }

  issuesUnitType(value: string) {
    this.issuesData.unitID = '';
    this.issuesData.unitType = value;
  }

  fetchAllStatesIDs() {
    this.apiService.getData('states/get/list')
      .subscribe((result: any) => {
        this.statesObject = result;
      });
  }

  fetchAllCountriesIDs() {
    this.apiService.getData('countries/get/list')
      .subscribe((result: any) => {
        this.countriesObject = result;
      });
  }

  /**
   * fetch asset types from database
   */
  fetchAssetTypes() {
    this.apiService.getData('assetTypes').subscribe((result: any) => {
      this.allAssetTypes = result.Items;
    });

  }

  getYears() {
    var max = new Date().getFullYear(),
    min = max - 30,
    max = max;

    for(var i=max; i>=min; i--){
      this.years.push(i);
    }
  }

  /*
   * Add new asset
   */
  addAsset() {
    this.uploadedPhotos = [];
    this.uploadedDocs = [];
    this.hideErrors();
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
    formData.append('data', JSON.stringify(this.assetsData));

    this.apiService.postData('assets', formData, true).subscribe({
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
        this.listService.fetchAssets();
        $('#addAsset').modal('hide');
        this.toastr.success('Asset added successfully.');
        this.assetsData = {
          assetIdentification: '',
          groupID: '',
          VIN: '',
          startDate: '',
          inspectionFormID: null,
          assetDetails: {
            assetType: '',
            currentStatus: '',
            year: '',
            manufacturer: '',
            model: '',
            height: '',
            heightUnit: '',
            length: '',
            lengthUnit: '',
            axle: '',
            GVWR: '',
            GVWR_Unit: '',
            GAWR: '',
            GAWR_Unit: '',
            ownerShip: '',
            ownerOperator: '',
            licenceCountryID: '',
            licenceStateID: '',
            licencePlateNumber: '',
            annualSafetyDate: '',
            annualSafetyReminder: true,
            remarks: '',
          },
          insuranceDetails: {
            dateOfIssue: '',
            premiumAmount: '',
            premiumCurrency: '',
            dateOfExpiry: '',
            reminderBefore: '',
            reminderBeforeUnit: '',
            vendor: ''
          },
          crossBorderDetails: {
            ACI_ID: '',
            ACE_ID: ''
          },
          uploadedPhotos: [],
          uploadedDocs: []
        };
      },
    });
  }

  clearIssueData() {
    this.issuesData = {
      issueName: '',
      currentStatus: 'OPEN',
      unitID: '',
      unitType: 'vehicle',
      reportedDate: '',
      description: '',
      odometer: null,
      reportedBy: '',
      assignedTo: '',
    }
  }

  fetchUsers(){
    this.apiService.getData('users').subscribe((result: any) => {
      this.users = result.Items;
    });
  }

  clearVehicleData() {
    // this.vehicleID = '';
    // vehicleTypeList: any = [];
    this.vehicleIdentification = '';
    this.vehicleType = '';
    this.VIN = '';
    this.DOT = '';
    this.year = '';
    this.manufacturerID = '';
    this.modelID = '';
    this.plateNumber = '';
    this.countryID = '';
    this.stateID = '';
    this.driverID = '';
    this.teamDriverID = '';
    this.servicePrograms = [];
    this.repeatByTime = '';
    this.repeatByTimeUnit = '';
    this.reapeatbyOdometerMiles = '';
    this.annualSafetyDate = '';
    this.annualSafetyReminder = true;
    this.currentStatus = '';
    this.ownership = '';
    this.ownerOperatorID = '';
    this.groupID = '';
    this.aceID = '';
    this.aciID = '';
    this.iftaReporting = false;
    this.vehicleColor = '';
    this.bodyType = '';
    this.bodySubType = '';
    this.msrp = '';
    this.inspectionFormID = '';
    this.lifeCycle = {
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
    this.specifications = {
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
    this.insurance = {
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
    this.fluid = {
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
    this.wheelsAndTyres = {
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
    this.engine = {
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
    this.purchase = {
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

    this.loan = {
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
  }

  clearDriverData (){
    this.driverData = {
      userName: '',
      lastName: '',
      phone: '',
      email: '',
      firstName: '',
      password: '',
      confirmPassword: '',
      citizenship: '',
      driverStatus: '',
      ownerOperator: '',
      startDate: '',
      terminationDate: '',
      contractStart: '',
      contractEnd: '',
      employeeContractorId: '',
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
      paymentDetails: {
        rate: '',
        rateUnit: '',
        waitingPay: '',
        waitingPayUnit: '',
        waitingHourAfter: '',
        deliveryRate: '',
        deliveryRateUnit: '',
        loadPayPercentage: '',
        loadPayPercentageOf: '',
        loadedMiles: '',
        loadedMilesUnit: '',
        emptyMiles: '',
        emptyMilesUnit: '',
        loadedMilesTeam: '',
        loadedMilesTeamUnit: '',
        emptyMilesTeam: '',
        emptyMilesTeamUnit: '',
        paymentType: '',
        payPeriod: '',
      },
      SIN: '',
      CDL_Number: '',
      licenceDetails: {
        licenceExpiry: '',
        licenceNotification: true,
        issuedCountry: '',
        issuedState: '',
        vehicleType: '',

      },
      hosDetails: {
        pcAllowed: false,
        ymAllowed: false,
        hosCycle: '',
        hosStatus: '',
        hosRemarks: '',
        type: '',
        timezone: '',
        homeTerminal: '',
        optZone: 'South (Canada)'
      },
      emergencyDetails: {},
    };
  }
}
