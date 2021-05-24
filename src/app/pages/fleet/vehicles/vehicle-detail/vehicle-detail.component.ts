import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../services";
import { ActivatedRoute, Router } from "@angular/router";
declare var $: any;
import { ToastrService } from "ngx-toastr";
import {environment} from '../../../../../environments/environment';
import { rest } from "lodash";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from '@angular/platform-browser';
import  Constants  from '../../constants';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';

@Component({
  selector: "app-vehicle-detail",
  templateUrl: "./vehicle-detail.component.html",
  styleUrls: ["./vehicle-detail.component.css"],
})
export class VehicleDetailComponent implements OnInit {

  noRecordMsg = Constants.NO_RECORDS_FOUND;
  slides = [];
  docs = [];
  Asseturl = this.apiService.AssetUrl;
  public environment = environment;
  /**
   * Vehicle Prop
   */
  driversList: any = {};
  vehicleModelList: any = {};
  vehicleManufacturersList: any = {};
  groupsList: any = {};
  statesList: any = {};
  countriesList: any = {};
  vendors = {};

  iftaReporting = "";
  annualSafetyDate = "";
  vehicleID = "";
  vehicleIdentification = "";
  vehicleType = "";
  VIN = "";
  year = "";
  manufacturerID = "";
  modelID = "";
  plateNumber = "";
  stateID = "";
  countryID = "";
  driverID = "";
  teamDriverID = "";
  serviceProgramID:any = [];
  primaryMeter = "";
  repeatByTime = "";
  repeatByTimeUnit = "";
  reapeatbyOdometerMiles = "";
  currentStatus = "";
  ownership = "";
  groupID = "";
  aceID = "";
  aciID = "";
  vehicleColor = "";
  bodyType = "";
  bodySubType = "";
  msrp = "";
  inspectionFormID = "";
  lifeCycle = {
    inServiceDate: "",
    inServiceOdometer: 0,
    estimatedServiceMonths: 0,
    estimatedServiceMiles: 0,
    estimatedResaleValue: "",
    outOfServiceDate: "",
    outOfServiceOdometer: 0,
    startDate: '',
    estimatedServiceYear: ''
  };
  specifications = {
    height: 0,
    heightUnit: "",
    length: 0,
    lengthUnit: "",
    width: 0,
    widthUnit: "",
    interiorVolume: "",
    passangerVolume: "",
    groundClearnce: 0,
    groundClearnceUnit: "",
    bedLength: 0,
    bedLengthUnit: "",
    cargoVolume: "",
    curbWeight: "",
    grossVehicleWeightRating: "",
    towingCapacity: "",
    maxPayload: "",
    EPACity: 0,
    EPACombined: 0,
    EPAHighway: 0,
    tareWeight: ''
  };
  insurance = {
    dateOfIssue: "",
    premiumAmount: 0,
    premiumCurrency: "",
    vendorID: "",
    dateOfExpiry: "",
    remiderEvery: "",
    policyNumber: "",
    amount: 0,
    amountCurrency: "",
    reminder: ''
  };
  fluid = {
    fuelType: "",
    fuelTankOneCapacity: 0,
    fuelQuality: "",
    fuelTankTwoCapacity: 0,
    oilCapacity: 0,
    fuelTankOneType: '',
    fuelTankTwoType: '',
    oilCapacityType: '',
    defType: '',
    def: ''
  };
  wheelsAndTyres = {
    numberOfTyres: 0,
    driveType: "",
    brakeSystem: "",
    wheelbase: "",
    rearAxle: "",
    frontTyreType: "",
    rearTyreType: "",
    frontTrackWidth: "",
    rearTrackWidth: "",
    frontWheelDiameter: "",
    rearWheelDiameter: "",
    frontTyrePSI: "",
    rearTyrePSI: "",
  };
  engine = {
    engineSummary: "",
    engineBrand: "",
    aspiration: "",
    blockType: "",
    bore: 0,
    camType: "",
    stroke: "",
    valves: "",
    compression: "",
    cylinders: "",
    displacement: "",
    fuelIndication: "",
    fuelQuality: "",
    maxHP: "",
    maxTorque: 0,
    readlineRPM: "",
    transmissionSummary: "",
    transmissionType: "",
    transmissonBrand: "",
    transmissionGears: "",
  };
  purchase = {
    purchaseVendorID: "",
    warrantyExpirationDate: "",
    purchasePrice: "",
    purchasePriceCurrency: "",
    warrantyExpirationMeter: "",
    purchaseDate: "",
    purchaseComments: "",
    purchaseOdometer: "",
  };
  loan = {
    loanVendorID: "",
    amountOfLoan: "",
    amountOfLoanCurrency: "",
    aspiration: "",
    annualPercentageRate: "",
    downPayment: "",
    downPaymentCurrency: "",
    dateOfLoan: "",
    monthlyPayment: "",
    monthlyPaymentCurrency: "",
    firstPaymentDate: "",
    numberOfPayments: "",
    loadEndDate: "",
    accountNumber: "",
    generateExpenses: "",
    notes: "",
  };
  settings = {
    primaryMeter: "miles",
    fuelUnit: "gallons(USA)",
    hardBreakingParams: 0,
    hardAccelrationParams: 0,
    turningParams: 0,
    measurmentUnit: "imperial",
  };

  issues = [];
  reminders = [];
  serviceReminders = [];
  renewalReminders = [];
  inspectionForms = {
    inspectionFormName : '',
    parameters: [],
    inspectionType: ''
  };
  fuelEntries = [];
  documents = [];
  servicePrograms = [];
  serviceHistory = [];
  devices = [];
  fuelTypes = {};

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
  };
  contactsObjects: any = {};
  vehicleTypeObects: any = {};
  ownerOperatorName = '';
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');
  tasksList = [];
  usersList = [];
  countryName = '';
  stateName = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.vehicleID = this.route.snapshot.params["vehicleID"];
    this.getVehicle();
    this.fetchIssues();
    this.fetchReminders();
    this.fetchFuelTypes();
    this.fetchDriversList();
    this.fetchStatesList();
    this.fetchCountriesList();
    this.fetchVehicleModelList();
    this.fetchVehicleManufacturerList();
    this.fetchGroupsList();
    // this.fetchVendorsList();
    this.fetchTasksList();
    this.fetchUsersList();
    this.fetchContactsByIDs();
    this.httpClient.get('assets/vehicleType.json').subscribe((data: any) => {
      this.vehicleTypeObects =  data.reduce( (a: any, b: any) => {
        return a[b[`code`]] = b[`name`], a;
    }, {});
    });
  }

  fetchContactsByIDs() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.contactsObjects = result;
    });
  }
  fetchGroupsList() {
    this.apiService.getData("groups/get/list").subscribe((result: any) => {
      this.groupsList = result;
    });
  }

  fetchTasksList() {
    this.apiService.getData("tasks/get/list").subscribe((result: any) => {
      this.tasksList = result;
    });
  }

  fetchDriversList() {
    this.apiService.getData("drivers/get/list").subscribe((result: any) => {
      this.driversList = result;
    });
  }
  fetchStatesList() {
    this.apiService.getData("states/get/list").subscribe((result: any) => {
      this.statesList = result;
    });
  }
  fetchCountriesList() {
    this.apiService.getData("countries/get/list").subscribe((result: any) => {
      this.countriesList = result;
    });
  }

  fetchUsersList() {
    this.apiService.getData("users/get/list").subscribe((result: any) => {
      this.usersList = result;
    });
  }

  fetchVehicleModelList() {
    this.apiService
      .getData("vehicleModels/get/list")
      .subscribe((result: any) => {
        this.vehicleModelList = result;
      });
  }
  fetchVehicleManufacturerList() {
    this.apiService
      .getData("manufacturers/get/list")
      .subscribe((result: any) => {
        this.vehicleManufacturersList = result;
      });
  }

  closeIssue(issueID) {
    this.apiService
      .getData(`issues/setStatus/${issueID}/CLOSE`)
      .subscribe((result) => {
        this.fetchIssues();
      });
  }

  fetchReminders() {
    this.apiService
      .getData(`reminders/vehicle/${this.vehicleID}`)
      .subscribe((result) => {
        this.reminders = result.Items;
        for (let i = 0; i < this.reminders.length; i++) {
          const element = this.reminders[i];
          if(element.type == 'service') {
            this.serviceReminders.push(element);
          } else {
            this.renewalReminders.push(element);
          }
        }
      });
  }

  fetchIssues() {
    this.apiService
      .getData(`issues/vehicle/${this.vehicleID}`)
      .subscribe((result) => {
        this.issues = result.Items;
      });
  }

  fetchFuelTypes(){
    this.apiService.getData('fuelTypes/get/list').subscribe((result: any) => {
      this.fuelTypes = result;
    });
  }

  getVehicle() {
    this.apiService
      .getData("vehicles/" + this.vehicleID)
      .subscribe((result: any) => {
        result = result.Items[0];

        this.ownerOperatorName = result.ownerOperatorID;
        if(result.inspectionFormID != '' && result.inspectionFormID != undefined) {
          this.apiService.getData(`inspectionForms/${result.inspectionFormID}`).subscribe((result1: any) => {
            this.inspectionForms = result1.Items[0];
            console.log('this.inspectionForms', this.inspectionForms);
          });
        }
        this.annualSafetyDate = result.annualSafetyDate;
        this.vehicleIdentification = result.vehicleIdentification;
        this.vehicleType = result.vehicleType;
        this.VIN = result.VIN;
        this.year = result.year;
        this.manufacturerID = result.manufacturerID;
        this.modelID = result.modelID;
        this.plateNumber = result.plateNumber;
        this.countryName = CountryStateCity.GetSpecificCountryNameByCode(result.countryID);
        this.stateName = CountryStateCity.GetStateNameFromCode(result.stateID, result.countryID);
        this.driverID = result.driverID;
        this.teamDriverID = result.teamDriverID;
        this.serviceProgramID = result.servicePrograms;
        this.fetchProgramDetails();
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
        this.iftaReporting= result.iftaReporting;
        this.lifeCycle = {
          inServiceDate: result.lifeCycle.inServiceDate,
          inServiceOdometer: result.lifeCycle.inServiceOdometer,
          estimatedServiceMonths: result.lifeCycle.estimatedServiceMonths,
          estimatedServiceMiles: result.lifeCycle.estimatedServiceMiles,
          estimatedResaleValue: result.lifeCycle.estimatedResaleValue,
          outOfServiceDate: result.lifeCycle.outOfServiceDate,
          outOfServiceOdometer: result.lifeCycle.outOfServiceOdometer,
          startDate: result.lifeCycle.startDate,
          estimatedServiceYear: result.lifeCycle.estimatedServiceYears,
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
          curbWeight: result.specifications.curbWeight,
          grossVehicleWeightRating:result.specifications.grossVehicleWeightRating,
          towingCapacity: result.specifications.towingCapacity,
          maxPayload: result.specifications.maxPayload,
          EPACity: result.specifications.EPACity,
          EPACombined: result.specifications.EPACombined,
          EPAHighway: result.specifications.EPAHighway,
          tareWeight: result.specifications.tareWeight,
        };
        this.insurance = {
          dateOfIssue: result.insurance.dateOfIssue,
          premiumAmount: result.insurance.premiumAmount,
          premiumCurrency: result.insurance.premiumCurrency,
          vendorID: result.insurance.vendorID,
          dateOfExpiry: result.insurance.dateOfExpiry,
          reminder: `${result.insurance.reminder}`,
          remiderEvery: `${result.insurance.remiderEvery}`,
          policyNumber: result.insurance.policyNumber,
          amount: result.insurance.amount,
          amountCurrency: result.insurance.amountCurrency,
        };
        this.fluid = {
          fuelType: result.fluid.fuelType,
          fuelTankOneCapacity: result.fluid.fuelTankOneCapacity,
          fuelTankOneType: result.fluid.fuelTankOneType,
          fuelQuality: result.fluid.fuelQuality,
          fuelTankTwoType: result.fluid.fuelTankTwoType,
          fuelTankTwoCapacity: result.fluid.fuelTankTwoCapacity,
          oilCapacity: result.fluid.oilCapacity,
          oilCapacityType: result.fluid.oilCapacityType,
          defType: result.fluid.defType,
          def: result.fluid.def
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
          amountOfLoanCurrency: result.loan.amountOfLoanCurrency,
          aspiration: result.loan.aspiration,
          annualPercentageRate: result.loan.annualPercentageRate,
          downPayment: result.loan.downPayment,
          downPaymentCurrency: result.loan.downPaymentCurrency,
          monthlyPaymentCurrency: result.loan.monthlyPaymentCurrency,
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

        if (
          result.uploadedPhotos != undefined &&
          result.uploadedPhotos.length > 0
        ) {
          this.slides = result.uploadedPhotos.map(
            (x) => `${this.Asseturl}/${result.carrierID}/${x}`
          );
        }

        if (
          result.uploadedDocs != undefined &&
          result.uploadedDocs.length > 0
        ) {
          this.docs = [];
          result.uploadedDocs.map((x) => {
            let obj = {
              name: x,
              path: `${this.Asseturl}/${result.carrierID}/${x}`
            }
            this.docs.push(obj);
          });
        }

        $("#hardBreakingParametersValue").html(
          this.settings.hardBreakingParams
        );
        $("#hardAccelrationParametersValue").html(
          this.settings.hardAccelrationParams
        );
        $("#turningParametersValue").html(this.settings.turningParams);
      });
  }

  deleteVehicle() {
    this.apiService
      .deleteData("vehicles/" + this.vehicleID)
      .subscribe((result: any) => {
        this.toastr.success("Vehicle Deleted Successfully!");
        this.router.navigateByUrl("/fleet/vehicles/list");
      });
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length - 1];
    this.pdfSrc = '';
    if (ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  deleteDocument(name: string, index: string) {
    this.apiService.deleteData(`vehicles/uploadDelete/${this.vehicleID}/${name}`).subscribe((result: any) => {
      this.docs.splice(parseInt(index), 1);
    });
  }

  fetchProgramDetails() {
    if(this.serviceProgramID.length > 0) {
      let serviceProgramID = JSON.stringify(this.serviceProgramID);
      this.apiService.getData('servicePrograms/fetch/selectedPrograms?programIds=' + serviceProgramID).subscribe((result: any) => {
        this.servicePrograms = result;

      })
    }
  }
}
