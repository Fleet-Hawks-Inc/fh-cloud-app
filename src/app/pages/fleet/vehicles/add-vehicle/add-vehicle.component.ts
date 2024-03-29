import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as _ from "lodash";
import * as moment from 'moment';
import { from, Subject } from 'rxjs';
import {
  map
} from "rxjs/operators";
import { CountryStateCityService } from "src/app/services/country-state-city.service";
import { RouteManagementServiceService } from "src/app/services/route-management-service.service";
import { ApiService, DashboardUtilityService, ListService } from "../../../../services";
import { ModalService } from "../../../../services/modal.service";
import { ELDService } from "src/app/services/eld.service";
import { MessageService } from 'primeng/api';
declare var $: any;
@Component({
  selector: "app-add-vehicle",
  templateUrl: "./add-vehicle.component.html",
  styleUrls: ["./add-vehicle.component.css"],
  exportAs: "vehicleF",
})
export class AddVehicleComponent implements OnInit {
  @ViewChild("vehicleF") vehicleF: NgForm;
  takeUntil$ = new Subject();
  isInsured = true;
  showDriverModal = false;
  createdDate = "";
  createdTime = "";
  title = "Add Vehicle";
  Asseturl = this.apiService.AssetUrl;
  activeTab = 1;
  modalImage = "";
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl("");

  /**
   * Quantum prop
   */
  quantumsList = [];
  quantum = "";
  quantumSelected = "";
  quantumcurrentStatus = "";
  /**
   *Group Properties
   */
  groupData = {
    groupType: "vehicles",
    groupName: "",
    groupMembers: [],
    description: "",
  };
  vehicles = [];

  /**
   * Vehicle Prop
   */
  vehicleID: string;
  sessionID: string;
  hasBasic: boolean = false;
  hasLife: boolean = false;
  hasSpecs: boolean = false;
  hasFluids: boolean = false;
  vehicleTypeList: any = [];
  vehicleIdentification = "";
  vehicleType = null;
  VIN = "";
  DOT = "";
  isSubmitted = false;

  year = null;
  manufacturerID = null;
  modelID = null;
  plateNumber = "";
  countryCode = null;
  stateCode = null;
  driverID = null;
  teamDriverID = null;
  servicePrograms = null;
  repeatByTime = "";
  repeatByTimeUnit = "";
  reapeatbyOdometerMiles = "";
  annualSafetyDate = null;
  annualSafetyReminder = true;
  currentStatus = null;
  uploadDocsError = '';
  uploadLonDocsError = '';
  uploadPurchaseDocsError = '';
  uploadPhotosError = '';
  ownership = null;
  ownerOperatorID = null;
  groupID = null;
  aceID = "";
  aciID = "";
  iftaReporting = false;
  vehicleColor = "";
  bodyType = "";
  bodySubType = "";
  msrp = "";
  inspectionFormID = null;
  lifeCycle = {
    inServiceDate: "",
    startDate: null,
    inServiceOdometer: "",
    estimatedServiceYears: "",
    estimatedServiceMonths: "",
    estimatedServiceMiles: "",
    estimatedResaleValue: "",
    outOfServiceDate: null,
    outOfServiceOdometer: "",
  };
  specifications = {
    height: null,
    heightUnit: "Feet",
    length: "",
    lengthUnit: "",
    width: "",
    widthUnit: "",
    interiorVolume: "",
    passangerVolume: "",
    groundClearnce: "",
    groundClearnceUnit: "Feet",
    bedLength: "",
    bedLengthUnit: "",
    cargoVolume: "",
    tareWeight: "",
    grossVehicleWeightRating: "",
    towingCapacity: "",
    maxPayload: "",
    EPACity: "",
    EPACombined: "",
    EPAHighway: "",
  };
  insurance = {
    dateOfIssue: null,
    premiumAmount: "",
    premiumCurrency: null,
    vendorID: null,
    dateOfExpiry: null,
    reminder: "",
    remiderEvery: null,
    policyNumber: "",
    amount: 0,
    amountCurrency: null,
  };
  fluid = {
    fuelType: null,
    fuelTankOneCapacity: "",
    fuelTankOneType: "",
    fuelQuality: "",
    fuelTankTwoCapacity: "",
    fuelTankTwoType: "",
    oilCapacity: null,
    oilCapacityType: "",
    def: null,
    defType: "",
  };
  wheelsAndTyres = {
    numberOfTyres: "",
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
    bore: "",
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
    purchaseVendorID: null,
    warrantyExpirationDate: null,
    warrantyExpirationDateReminder: false,
    purchasePrice: "",
    purchasePriceCurrency: null,
    warrantyExpirationMeter: "",
    purchaseDate: null,
    purchaseComments: "",
    purchaseOdometer: "",
    gstInc: true,
  };
  loan = {
    loanVendorID: null,
    amountOfLoan: "",
    amountOfLoanCurrency: null,
    aspiration: "",
    annualPercentageRate: "",
    gstInc: true,
    downPayment: "",
    downPaymentCurrency: null,
    dateOfLoan: null,
    monthlyPayment: "",
    monthlyPaymentCurrency: null,
    firstPaymentDate: "",
    numberOfPayments: "",
    loadEndDate: null,
    accountNumber: "",
    generateExpenses: "",
    notes: "",
    loanDueDate: null,
    lReminder: true,
  };
  settings = {
    primaryMeter: "miles",
    fuelUnit: "gallons(CA)",
    hardBreakingParams: 0,
    hardAccelrationParams: 0,
    turningParams: 0,
    measurmentUnit: "imperial",
  };
  deviceInfo = {};

  ownerOperators: any = [];
  serviceProgramss: any = [];
  inspectionForms = [];
  manufacturers: any = [];
  models: any = [];
  states: any = [];
  groups = [];
  drivers: any;
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  uploadedPhotos = [];
  uploadedDocs = [];
  purchaseDocs = [];
  loanDocs = [];
  existingPhotos = [];
  existingDocs = [];
  existPDocs = [];
  existLDocs = [];
  carrierID;
  programs = [];
  vendors: any = [];
  timeCreated: "";
  errors = {};
  vehicleForm;
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  manufacturerDataSource: any = [];
  modals: any = [];
  slides = [];
  pDocs = [];
  lDocs = [];
  years: any = []
  documentSlides = [];
  localPhotos = [];
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1500,
  };

  isImport = false;
  vendorModalStatus = false;
  submitDisabled = false;
  groupSubmitDisabled = false;
  countryName = "";
  stateName = "";
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  editDisabled = false;
  currentYear = '';
  groupsData: any = [];
  hosVehicleId = 0
  vehicleObj = {}
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private httpClient: HttpClient,
    private listService: ListService,
    private domSanitizer: DomSanitizer,
    private countryStateCity: CountryStateCityService,
    private dashboardUtilityService: DashboardUtilityService,
    private routerMgmtService: RouteManagementServiceService,
    private modalService: NgbModal,
    private modalServiceOwn: ModalService,
    private eldService: ELDService,
    private messageService: MessageService,
  ) {




    this.selectedFileNames = new Map<any, any>();
    $(document).ready(() => {
      // this.vehicleForm = $('#vehicleForm').validate();
    });
    this.sessionID = this.routerMgmtService.vehicleUpdateSessionID;
  }


  async ngOnInit() {
    this.getYears();
    this.currentYear = moment().format('YYYY');
    this.fetchInspectionForms();
    this.fetchVehicles();
    this.fetchManufacturers();
    this.listService.fetchVendors();
    this.listService.fetchOwnerOperators();
    this.listService.fetchServicePrograms();
    this.listService.fetchDrivers();

    this.vehicleID = this.route.snapshot.params[`vehicleID`];
    if (this.vehicleID) {
      this.title = "Edit Vehicle";
      await this.fetchVehicleByID();
    } else {
      this.title = "Add Vehicle";
    }
    this.httpClient.get("assets/vehicleType.json").subscribe((data) => {
      this.vehicleTypeList = data;
    });
    this.settings.hardBreakingParams = 6;
    this.settings.hardAccelrationParams = 6;
    this.settings.turningParams = 6;

    $("#hardBreakingParametersValue").html(6);
    $("#hardAccelrationParametersValue").html(6);
    $("#turningParametersValue").html(6);

    let vendorList = new Array<any>();
    this.getValidVendors(vendorList);
    this.vendors = vendorList;

    let programList = new Array<any>();
    this.getValidPrograms(programList);
    this.serviceProgramss = programList;

    let operatorList = new Array<any>();
    this.getValidOperators(operatorList);
    this.ownerOperators = operatorList;

    let driverList = new Array<any>();
    this.getValidDrivers(driverList);
    this.drivers = driverList;
    this.fetchGroupsList();
  }
  getYears() {
    var max = new Date().getFullYear() + 1,
      min = 1980,
      max = max;

    for (var i = max; i >= min; i--) {
      this.years.push(i);
    }
  }
  private getValidVendors(vendorList: any[]) {
    let ids = [];
    this.listService.vendorList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
          vendorList.push(element2);
          ids.push(element2.contactID);
        }

        if (element2.isDeleted === 1) {
          if (element2.contactID === this.insurance.vendorID) {
            this.insurance.vendorID = null;
          }

          if (element2.contactID === this.purchase.purchaseVendorID) {
            this.purchase.purchaseVendorID = null;
          }

          if (element2.contactID === this.loan.loanVendorID) {
            this.loan.loanVendorID = null;
          }
        }
      });
    });
  }

  private getValidPrograms(programsList: any[]) {
    let ids = [];
    this.listService.serviceProgramList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.programID)) {
          programsList.push(element2);
          ids.push(element2.programID);
        }
      });
    });
  }

  private getValidOperators(operatorsList: any[]) {
    let ids = [];
    this.listService.ownerOperatorList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
          operatorsList.push(element2);
          ids.push(element2.contactID);
        }

        if (
          element2.isDeleted === 1 &&
          this.ownerOperatorID === element2.contactID
        ) {
          this.ownerOperatorID = null;
        }
      });
    });
  }

  private getValidDrivers(driverList: any[]) {
    let ids = [];
    this.listService.driversList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.driverID)) {
          driverList.push(element2);
          ids.push(element2.driverID);
        }

        if (element2.isDeleted === 1 && this.driverID === element2.driverID) {
          this.driverID = null;
        }
      });
    });
  }

  async getInspectionForms() {
    await this.fetchInspectionForms();
  }

  fetchDrivers() {
    this.apiService.getData("drivers").subscribe((result: any) => {
      this.drivers = result.Items;
    });
  }

  fetchManufacturers() {
    this.httpClient
      .get("assets/jsonFiles/vehicles/trucks.json")
      .subscribe((data: any) => {
        data.forEach((element) => {
          this.manufacturerDataSource.push(
            Object.keys(element)[0].toUpperCase()
          );
        });
      });
  }
  fetchModels() {
    this.modals = [];
    let manufacturer: any = "";
    if (this.manufacturerID !== null) {
      manufacturer = this.manufacturerID.toLowerCase();
    }
    this.httpClient
      .get("assets/jsonFiles/vehicles/trucks.json")
      .subscribe((data: any) => {
        data.forEach((element) => {
          let output = [];
          if (element[manufacturer]) {
            element[manufacturer].forEach((element) => {
              output.push(element.toUpperCase());
            });
            this.modals = output;
          }
        });
      });
  }

  async getStates(event: any) {
    const countryCode: any = event;
    this.stateCode = "";
    this.states = await this.countryStateCity.GetStatesByCountryCode([
      countryCode,
    ]);
  }

  resetModel() {
    this.fetchModels();
    this.modelID = null;
    $("#vehicleSelect").val("");
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  gotoVehiclePage() {
    $("#addDriverModelVehicle").modal("show");
  }

  getGroups() {
    this.fetchGroupsList();
  }

  openProgram(value) {
    this.listService.separateModals(value);
  }

  fetchInspectionForms() {
    this.apiService
      .getData("inspectionForms/type/vehicle")
      .subscribe((result: any) => {
        this.inspectionForms = result.Items;
      });
  }
  async onAddVehicle() {
    this.hasError = false;
    this.hasSuccess = false;
    this.Error = "";
    this.submitDisabled = true;

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
      countryID: this.countryCode,
      stateID: this.stateCode,
      countryName: this.countryName,
      stateName: this.stateName,
      driverID: this.driverID,
      teamDriverID: this.teamDriverID,
      servicePrograms: Array.isArray(this.servicePrograms)
        ? this.servicePrograms
        : [],
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
      createdDate: this.createdDate,
      createdTime: this.createdTime,
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
        amountCurrency: this.insurance.amountCurrency,
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
        defType: this.fluid.defType,
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
        warrantyExpirationDateReminder:
          this.purchase.warrantyExpirationDateReminder,
        purchasePrice: this.purchase.purchasePrice,
        purchasePriceCurrency: this.purchase.purchasePriceCurrency,
        warrantyExpirationMeter: this.purchase.warrantyExpirationMeter,
        purchaseDate: this.purchase.purchaseDate,
        purchaseComments: this.purchase.purchaseComments,
        purchaseOdometer: this.purchase.purchaseOdometer,
        gstInc: this.purchase.gstInc,
      },
      loan: {
        loanVendorID: this.loan.loanVendorID,
        amountOfLoan: this.loan.amountOfLoan,
        amountOfLoanCurrency: this.loan.amountOfLoanCurrency,
        aspiration: this.loan.aspiration,
        annualPercentageRate: this.loan.annualPercentageRate,
        gstInc: this.loan.gstInc,
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
        loanDueDate: this.loan.loanDueDate,
        lReminder: this.loan.lReminder,
      },
      settings: {
        primaryMeter: this.settings.primaryMeter,
        fuelUnit: this.settings.fuelUnit,
        hardBreakingParams: this.settings.hardBreakingParams,
        hardAccelrationParams: this.settings.hardAccelrationParams,
        turningParams: this.settings.turningParams,
        measurmentUnit: this.settings.measurmentUnit,
      },
      activeTab: this.activeTab,
    };

    // create form data instance
    const formData = new FormData();

    // append photos if any
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      formData.append("uploadedPhotos", this.uploadedPhotos[i]);
    }

    // append docs if any
    for (let j = 0; j < this.uploadedDocs.length; j++) {
      formData.append("uploadedDocs", this.uploadedDocs[j]);
    }

    // append purchase docs if any
    for (let j = 0; j < this.purchaseDocs.length; j++) {
      formData.append("purchaseDocs", this.purchaseDocs[j]);
    }

    // append loan docs if any
    for (let j = 0; j < this.loanDocs.length; j++) {
      formData.append("loanDocs", this.loanDocs[j]);
    }

    // append other fields
    formData.append("data", JSON.stringify(data));
    try {
      return await new Promise((resolve, reject) => {
        this.apiService.postData("vehicles", formData, true).subscribe({
          complete: () => { },
          error: (err: any) => {
            from(err.error)
              .pipe(
                map((val: any) => {
                  // val.message = val.message.replace(/".*"/, 'This Field');
                  this.errors[val.context.label] = val.message;
                })
              )
              .subscribe({
                complete: () => {
                  this.throwErrors();
                  this.hasError = true;
                  this.submitDisabled = false;
                  if (err) return reject(err);
                },
                error: () => {
                  this.submitDisabled = false;
                },
                next: () => { },
              });
          },
          next: (res) => {
            this.response = res;
            this.Success = "";
            this.submitDisabled = false;
            this.showVehAddMessage();
            this.router.navigateByUrl("/fleet/vehicles/list");
            this.dashboardUtilityService.refreshVehicles = true;
            this.dashboardUtilityService.refreshVehCount = true;
            this.router.navigateByUrl(`/fleet/vehicles/list/${this.routerMgmtService.vehicleUpdated()}`);
            // this.location.back();
          },
        });
      });
    } catch (error) {
      this.submitDisabled = false;
      return "error found";
    }
  }

  throwErrors() {
    from(Object.keys(this.errors)).subscribe((v) => {
      if (v == "vehicleIdentification" || v == "VIN") {
        $('[name="' + v + '"]')
          .after(
            '<label id="' +
            v +
            '-error" class="error" for="' +
            v +
            '">' +
            this.errors[v] +
            "</label>"
          )
          .addClass("error");
      }
    });
  }

  hideErrors() {
    from(Object.keys(this.errors)).subscribe((v) => {
      $('[name="' + v + '"]')
        .removeClass("error")
        .next()
        .remove("label");
    });
    this.errors = {};
  }
  scrollError() {
    let errorList;
    setTimeout(() => {
      errorList = document.getElementsByClassName("error").length;
      if (errorList > 0) {
        let topPosition: any = $(".error").parent("div").offset().top;
        window.scrollTo({
          top: topPosition - 200,
          left: 0,
          behavior: "smooth",
        });
      }
    }, 1500);
  }

  /*
   * Selecting files before uploading
   */
  selectDocuments(event, obj) {
    let files = [...event.target.files];

    if (obj === "uploadedDocs") {
      for (let i = 0; i < files.length; i++) {
        let name = files[i].name.split(".");
        let ext = name[name.length - 1].toLowerCase();
        if (
          ext == "doc" ||
          ext == "docx" ||
          ext == "pdf" ||
          ext == "jpg" ||
          ext == "jpeg" ||
          ext == "png"
        ) {
          this.uploadedDocs.push(files[i]);
        } else {
          this.uploadDocsError = 'Only .doc, .docx, .pdf, .jpg, .jpeg and png files allowed.';
        }
      }
    } else if (obj === "purchase") {
      for (let i = 0; i < files.length; i++) {
        let name = files[i].name.split(".");
        let ext = name[name.length - 1].toLowerCase();
        if (
          ext == "doc" ||
          ext == "docx" ||
          ext == "pdf" ||
          ext == "jpg" ||
          ext == "jpeg" ||
          ext == "png"
        ) {
          this.purchaseDocs.push(files[i]);
        } else {
          this.uploadPurchaseDocsError = 'Only .doc, .docx, .pdf, .jpg, .jpeg and png files allowed.';
        }
      }
    } else if (obj === "loan") {
      for (let i = 0; i < files.length; i++) {
        let name = files[i].name.split(".");
        let ext = name[name.length - 1].toLowerCase();
        if (
          ext == "doc" ||
          ext == "docx" ||
          ext == "pdf" ||
          ext == "jpg" ||
          ext == "jpeg" ||
          ext == "png"
        ) {
          this.loanDocs.push(files[i]);
        } else {
          this.uploadLonDocsError = 'Only .doc, .docx, .pdf, .jpg, .jpeg and png files allowed.';
        }
      }
    } else {
      for (let i = 0; i < files.length; i++) {
        let name = files[i].name.split(".");
        let ext = name[name.length - 1].toLowerCase();
        if (
          ext == "jpg" ||
          ext == "jpeg" ||
          ext == "png"
        ) {
          this.uploadedPhotos.push(files[i]);
        } else {
          this.uploadPhotosError = 'Only .jpg, .jpeg and png files allowed.';
        }
      }

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.slides.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  // EDIT
  async fetchVehicleByID() {
    let result: any = await this.apiService
      .getData("vehicles/" + this.vehicleID)
      .toPromise();
    this.editDisabled = true;
    result = result.Items[0];
    this.vehicleIdentification = result.vehicleIdentification;
    this.vehicleType = result.vehicleType;
    this.VIN = result.VIN;
    this.DOT = result.DOT;
    this.year = result.year;
    this.manufacturerID = result.manufacturerID;
    this.modelID = result.modelID;
    this.plateNumber = result.plateNumber;
    this.countryCode = result.countryID;
    this.getStates(result.countryID);
    this.stateCode = result.stateID;
    this.countryName = result.countryName;
    this.stateName = result.stateName;
    this.driverID = result.driverID;
    this.teamDriverID = result.teamDriverID;
    this.servicePrograms = result.servicePrograms;
    (this.annualSafetyDate = _.isEmpty(result.annualSafetyDate)
      ? null
      : result.annualSafetyDate),
      (this.annualSafetyReminder = result.annualSafetyReminder ? result.annualSafetyReminder : false),
      (this.currentStatus = result.currentStatus);
    this.ownership = result.ownership;
    this.ownerOperatorID = result.ownerOperatorID;
    this.groupID = result.groupID;
    this.aceID = result.aceID;
    this.aciID = result.aciID;
    (this.iftaReporting = result.iftaReporting),
      (this.vehicleColor = result.vehicleColor);
    this.bodyType = result.bodyType;
    this.bodySubType = result.bodySubType;
    this.msrp = result.msrp;
    this.inspectionFormID = result.inspectionFormID;
    this.createdDate = result.createdDate;
    this.createdTime = result.createdTime;
    // Device Info
    if (result.deviceInfo) {
      this.deviceInfo = result.deviceInfo;
    }
    if (result.lifeCycle) {

      this.lifeCycle = {
        inServiceDate: _.isEmpty(result.lifeCycle.inServiceDate)
          ? null
          : result.lifeCycle.inServiceDate,
        inServiceOdometer: result.lifeCycle.inServiceOdometer,
        startDate: _.isEmpty(result.lifeCycle.startDate)
          ? null
          : result.lifeCycle.startDate,
        estimatedServiceYears: result.lifeCycle.estimatedServiceYears,
        estimatedServiceMonths: result.lifeCycle.estimatedServiceMonths,
        estimatedServiceMiles: result.lifeCycle.estimatedServiceMiles,
        estimatedResaleValue: result.lifeCycle.estimatedResaleValue,
        outOfServiceDate: _.isEmpty(result.lifeCycle.outOfServiceDate)
          ? null
          : result.lifeCycle.outOfServiceDate,
        outOfServiceOdometer: result.lifeCycle.outOfServiceOdometer,
      };
    }
    if (result.specifications) {
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
        EPAHighway: result.specifications.EPAHighway,
      };
    }
    if (result.insurance) {
      this.insurance = {
        dateOfIssue: _.isEmpty(result.insurance.dateOfIssue)
          ? null
          : result.insurance.dateOfIssue,
        premiumAmount: result.insurance.premiumAmount,
        premiumCurrency: result.insurance.premiumCurrency,
        vendorID: result.insurance.vendorID,
        dateOfExpiry: _.isEmpty(result.insurance.dateOfExpiry)
          ? null
          : result.insurance.dateOfExpiry,
        reminder: result.insurance.reminder,
        remiderEvery: result.insurance.remiderEvery,
        policyNumber: result.insurance.policyNumber,
        amount: result.insurance.amount,
        amountCurrency: result.insurance.amountCurrency,
      };
    }
    if (result.fluid) {
      this.fluid = {
        fuelType: result.fluid.fuelType,
        fuelTankOneCapacity: result.fluid.fuelTankOneCapacity,
        fuelTankOneType: result.fluid.fuelTankOneType,
        fuelQuality: result.fluid.fuelQuality,
        fuelTankTwoCapacity: result.fluid.fuelTankTwoCapacity,
        fuelTankTwoType: result.fluid.fuelTankTwoType,
        oilCapacity: result.fluid.oilCapacity,
        oilCapacityType: result.fluid.oilCapacityType,
        def: result.fluid.def,
        defType: result.fluid.defType,
      };
    }
    if (result.wheelsAndTyres) {
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
    }
    if (result.engine) {
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
    }
    if (result.purchase) {
      this.purchase = {
        purchaseVendorID: result.purchase.purchaseVendorID,
        warrantyExpirationDate: _.isEmpty(result.purchase.warrantyExpirationDate)
          ? null
          : result.purchase.warrantyExpirationDate,
        warrantyExpirationDateReminder:
          result.purchase.warrantyExpirationDateReminder,
        purchasePrice: result.purchase.purchasePrice,
        purchasePriceCurrency: result.purchase.purchasePriceCurrency,
        warrantyExpirationMeter: result.purchase.warrantyExpirationMeter,
        purchaseDate: _.isEmpty(result.purchase.purchaseDate)
          ? null
          : result.purchase.purchaseDate,
        purchaseComments: result.purchase.purchaseComments,
        purchaseOdometer: result.purchase.purchaseOdometer,
        gstInc: result.purchase.gstInc,
      };
    }
    if (result.loan) {
      this.loan = {
        loanVendorID: result.loan.loanVendorID,
        amountOfLoan: result.loan.amountOfLoan,
        amountOfLoanCurrency: result.loan.amountOfLoanCurrency,
        aspiration: result.loan.aspiration,
        annualPercentageRate: result.loan.annualPercentageRate,
        gstInc: result.loan.gstInc,
        downPayment: result.loan.downPayment,
        downPaymentCurrency: result.loan.downPaymentCurrency,
        dateOfLoan: _.isEmpty(result.loan.dateOfLoan)
          ? null
          : result.loan.dateOfLoan,
        monthlyPayment: result.loan.monthlyPayment,
        monthlyPaymentCurrency: result.loan.monthlyPaymentCurrency,
        firstPaymentDate: _.isEmpty(result.loan.firstPaymentDate)
          ? null
          : result.loan.firstPaymentDate,
        numberOfPayments: result.loan.numberOfPayments,
        loadEndDate: _.isEmpty(result.loan.loadEndDate)
          ? null
          : result.loan.loadEndDate,
        accountNumber: result.loan.accountNumber,
        generateExpenses: result.loan.generateExpenses,
        notes: result.loan.notes,
        loanDueDate: result.loan.loanDueDate,
        lReminder: result.loan.lReminder,
      };
    }
    if (result.settings) {
      this.settings = {
        primaryMeter: result.settings.primaryMeter,
        fuelUnit: result.settings.fuelUnit,
        hardBreakingParams: result.settings.hardBreakingParams,
        hardAccelrationParams: result.settings.hardAccelrationParams,
        turningParams: result.settings.turningParams,
        measurmentUnit: result.settings.measurmentUnit,
      };
    }
    this.existingPhotos = result.uploadedPhotos;
    this.existingDocs = result.uploadedDocs;
    this.existPDocs = result.purchaseDocs;
    this.existLDocs = result.loanDocs;
    if (
      result.uploadedPhotos != undefined &&
      result.uploadedPhotos.length > 0
    ) {
      //  this.slides = result.uploadedPhotos.map(
      //  (x) => `${this.Asseturl}/${result.carrierID}/${x}`
      //  );
      this.slides = result.uploadedPics;
    }

    if (result.purchaseDocs != undefined && result.purchaseDocs.length > 0) {
      //  result.purchaseDocs.map((x) => {
      //    let obj = {
      //      name: x,
      //      path: `${this.Asseturl}/${result.carrierID}/${x}`,
      //    };
      //    this.pDocs.push(obj);
      //  });
      this.pDocs = result.purchaseDocsUpload;
    }
    if (result.loanDocs != undefined && result.loanDocs.length > 0) {
      //  result.loanDocs.map((x) => {
      //    let obj = {
      //      name: x,
      //      path: `${this.Asseturl}/${result.carrierID}/${x}`,
      //    };
      //    this.lDocs.push(obj);
      //  });
      this.lDocs = result.loanDocsUpload;
    }
    if (result.uploadedDocs != undefined && result.uploadedDocs.length > 0) {
      //  result.uploadedDocs.map((x) => {
      //    let obj = {
      //      name: x,
      //      path: `${this.Asseturl}/${result.carrierID}/${x}`,
      //    };
      //    this.documentSlides.push(obj);
      //  });
      // this.documentSlides = result.uploadedDocs.map(x => `${this.Asseturl}/${result.carrierID}/${x}`);
      this.documentSlides = result.uploadDocument;
    }
    this.timeCreated = result.timeCreated;
    this.isImport = result.isImport;
    // if(this.hosVehicleId >0){
      this.hosVehicleId = result.hosVehicleId
    // }


    $("#hardBreakingParametersValue").html(this.settings.hardBreakingParams);
    $("#hardAccelrationParametersValue").html(
      this.settings.hardAccelrationParams
    );
    $("#turningParametersValue").html(this.settings.turningParams);
  }
  async onUpdateVehicle() {
    this.hasError = false;
    this.hasSuccess = false;
    this.Error = "";
    this.submitDisabled = true;
    this.hideErrors();
    const data = {
      vehicleID: this.vehicleID,
      vehicleIdentification: this.vehicleIdentification,
      vehicleType: this.vehicleType,
      VIN: this.VIN,
      DOT: this.DOT,
      year: this.year,
      manufacturerID: this.manufacturerID,
      modelID: this.modelID,
      plateNumber: this.plateNumber,
      countryID: this.countryCode,
      stateID: this.stateCode,
      countryName: this.countryName,
      stateName: this.stateName,
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
      iftaReporting: this.iftaReporting,
      vehicleColor: this.vehicleColor,
      bodyType: this.bodyType,
      bodySubType: this.bodySubType,
      msrp: this.msrp,
      inspectionFormID: this.inspectionFormID,
      createdTime: this.createdTime,
      createdDate: this.createdDate,
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
        amountCurrency: this.insurance.amountCurrency,
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
        defType: this.fluid.defType,
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
        warrantyExpirationDateReminder:
          this.purchase.warrantyExpirationDateReminder,
        purchasePrice: this.purchase.purchasePrice,
        purchasePriceCurrency: this.purchase.purchasePriceCurrency,
        warrantyExpirationMeter: this.purchase.warrantyExpirationMeter,
        purchaseDate: this.purchase.purchaseDate,
        purchaseComments: this.purchase.purchaseComments,
        purchaseOdometer: this.purchase.purchaseOdometer,
        gstInc: this.purchase.gstInc,
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
        loanDueDate: this.loan.loanDueDate,
        lReminder: this.loan.lReminder,
        gstInc: this.loan.gstInc,
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
      purchaseDocs: this.existPDocs,
      loanDocs: this.existLDocs,
      activeTab: this.activeTab,
      deviceInfo: this.deviceInfo,
      isImport: this.isImport,
      hosVehicleId:this.hosVehicleId
      
    };
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      formData.append("uploadedPhotos", this.uploadedPhotos[i]);
    }

    //append docs if any
    for (let j = 0; j < this.uploadedDocs.length; j++) {
      formData.append("uploadedDocs", this.uploadedDocs[j]);
    }

    // append purchase docs if any
    for (let j = 0; j < this.purchaseDocs.length; j++) {
      formData.append("purchaseDocs", this.purchaseDocs[j]);
    }

    // append loan docs if any
    for (let j = 0; j < this.loanDocs.length; j++) {
      formData.append("loanDocs", this.loanDocs[j]);
    }

    //append other fields
    formData.append("data", JSON.stringify(data));
  

    try {
        return await new Promise((resolve, reject) => {
          this.apiService.putData("vehicles", formData, true).subscribe({
            complete: () => { },
            error: (err: any) => {
              from(err.error)
                .pipe(
                  map((val: any) => {
                    //val.message = val.message.replace(/".*"/, 'This Field');
                    this.errors[val.context.label] = val.message;
                  })
                )
                .subscribe({
                  complete: () => {
                    this.throwErrors();
                    if (err) return reject(err);
                    this.submitDisabled = false;
                  },
                  error: () => {
                    this.submitDisabled = false;
                  },
                  next: () => { },
                });
            },
            next: (res) => {
              this.submitDisabled = false;
              this.response = res;
              if(!this.hosVehicleId){
                this.cancel();
              }
              this.updateVehEld()
              this.Success = "";
             this.showUpdateSuccess();
              this.dashboardUtilityService.refreshVehicles = true;
             
            },
          });
        });
     
    } catch (error) {
      this.submitDisabled = false;
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
    $("#hardBreakingParametersValue").html(value);
  }

  onChangeAccelrationParameters(value: any) {
    this.settings.hardAccelrationParams = value;
    $("#hardAccelrationParametersValue").html(value);
  }

  onChangeturningParameters(value: any) {
    this.settings.turningParams = value;
    $("#turningParametersValue").html(value);
  }

  quantumModal() {
    $(document).ready(function () {
      $("#quantumModal").modal("show");
    });
  }

  onChange(newValue) {
    this.quantum = newValue;
    this.quantumSelected = newValue;
  }

  fetchVehicles() {
    this.apiService.getData("vehicles").subscribe((result: any) => {
      // this.vehicles = result.Items;
      result.Items.forEach((element) => {
        if (element.isDeleted === 0) {
          this.vehicles.push(element);
        }
      });
    });
  }
  // GROUP MODAL
  addGroup() {
    this.groupSubmitDisabled = true;
    this.apiService.postData("groups", this.groupData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.groupSubmitDisabled = false;
              this.throwErrors();
            },
            error: () => {
              this.groupSubmitDisabled = false;
            },
            next: () => { },
          });
      },
      next: (res) => {
        this.groupSubmitDisabled = false;
        this.response = res;
        this.hasSuccess = true;
        this.fetchGroupsList();
        this.showGrpAddMessage();
        $("#addGroupModal").modal("hide");
        this.fetchGroupsList();
      },
    });
  }

  openImageModal(slide) {
    this.modalImage = slide;
    $("#imageModal").modal("show");
  }

  deleteUploadedImage(index) {
    this.slides.splice(index, 1);
    this.existingPhotos.splice(index, 1);
  }

  deleteLocalImage(index) {
    this.localPhotos.splice(index, 1);
    this.uploadedPhotos.splice(index, 1);
  }

  driverChange(driverType) {
    if (
      driverType == "main" &&
      this.driverID != null &&
      this.driverID == this.teamDriverID
    ) {
      alert("Both drivers cant be same.");
      this.driverID = null;
      $("#main_driver").val(null);
    } else if (
      driverType == "team" &&
      this.teamDriverID != null &&
      this.driverID == this.teamDriverID
    ) {
      alert("Both drivers cant be same.");
      this.teamDriverID = null;
      $("#team_driver").val(null);
    }
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length - 1];
    this.pdfSrc = "";
    if (ext == "doc" || ext == "docx" || ext == "xlsx") {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(
        "https://docs.google.com/viewer?url=" + val + "&embedded=true"
      );
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  deleteDocument(value: any, name: string, index: number) {
    this.apiService
      .deleteData(`vehicles/uploadDelete/${this.vehicleID}/${value}/${name}`)
      .subscribe((result: any) => {
        if (value == "doc") {
          this.documentSlides = [];
          this.uploadedDocs = result.Attributes.uploadedDocs;
          this.existingDocs = result.Attributes.uploadedDocs;
          result.Attributes.uploadedDocs.map((x) => {
            let obj = {
              name: x,
              path: `${this.Asseturl}/${result.carrierID}/${x}`,
            };
            this.documentSlides.push(obj);
          });
        } else if (value == "loan") {
          this.lDocs = [];
          this.uploadedDocs = result.Attributes.loanDocs;
          this.existingDocs = result.Attributes.loanDocs;
          result.Attributes.loanDocs.map((x) => {
            let obj = {
              name: x,
              path: `${this.Asseturl}/${result.carrierID}/${x}`,
            };
            this.lDocs.push(obj);
          });
        } else {
          this.pDocs = [];
          this.uploadedDocs = result.Attributes.purchaseDocs;
          this.existingDocs = result.Attributes.purchaseDocs;
          result.Attributes.purchaseDocs.map((x) => {
            let obj = {
              name: x,
              path: `${this.Asseturl}/${result.carrierID}/${x}`,
            };
            this.pDocs.push(obj);
          });
        }
      });
  }

  clearGroup() {
    this.groupData = {
      groupType: "vehicles",
      groupName: "",
      groupMembers: [],
      description: "",
    };
  }
  refreshDriverData() {
    this.listService.fetchDrivers();
  }

  refreshProgramData() {
    this.listService.fetchServicePrograms();
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem("isOpen", "true");
    this.listService.changeButton(false);
  }

  refreshVendorData() {
    this.listService.fetchVendors();
  }

  refreshOpData() {
    this.listService.fetchOwnerOperators();
  }

  fetchGroupsList() {
    this.apiService.getData('groups/get/list/type?type=vehicles').subscribe((result: any) => {
      this.groupsData = result;

    });
  }

  showError(error: any) {
    this.messageService.add({
        severity: 'error', summary: 'Error',
        detail: error.error.message
    });
}

showSuccess() {
    this.messageService.add({severity:'success',
     summary: 'Success', detail: 'Vehicle updated successfully in ELD'});
}

showUpdateSuccess() {
  this.messageService.add({severity:'success',
   summary: 'Success', detail: 'Vehicle updated successfully'});
}

showVehAddMessage() {
  this.messageService.add({severity:'success',
   summary: 'Success', detail: 'Vehicle Added Successfully'});
}

showGrpAddMessage() {
  this.messageService.add({severity:'success',
   summary: 'Success', detail: 'Group Added Successfully'});
}

updateVehEld(){
  if(this.hosVehicleId >0){
    this.vehicleObj = {
       FhIdentifier: this.vehicleID,
       AssetId : this.hosVehicleId,
       Number: this.vehicleIdentification,
       HOSHomeBaseId: '18',
       VIN: this.VIN,
       Plate: this.plateNumber,
       RegistrationState: this.stateCode,
       Type: '0',
       Active: '1'

   }

   this.eldService.postData("assets", {
     Asset: this.vehicleObj
   }).subscribe(
     result => {
       this.showSuccess()
       this.cancel();

     },
     error => {
         this.showError(error)
     });
 }
}
}
