import { Component, OnInit } from "@angular/core";
import { ApiService, DashboardUtilityService} from "../../../../services";
import { Router, ActivatedRoute } from "@angular/router";
import { formatDate } from "@angular/common";
import { map } from "rxjs/operators";
import { from } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { NgbCalendar, NgbDateAdapter } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
import { Location } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import { ListService } from "../../../../services/list.service";
import * as moment from "moment";
import { CountryStateCityService } from "src/app/services/country-state-city.service";

@Component({
  selector: "app-add-assets",
  templateUrl: "./add-assets.component.html",
  styleUrls: ["./add-assets.component.css"],
})
export class AddAssetsComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  allAssetTypes: any;
  public assetID;
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  pageTitle: string;
  errors = {};
  form;
  quantumSelected = "";
  pDocs = [];
  lDocs = [];
  assetsData = {
    isTemp: false,
    inspectionFormID: "",
    assetIdentification: "",
    groupID: null,
    pk: null,
    VIN: "",
    startDate: moment().format("YYYY-MM-DD"),
    assetType: null,
    currentStatus: "active",
    createdDate: "",
    createdTime: "",
    assetDetails: {
      year: null,
      manufacturer: null,
      model: null,
      length: 0,
      lengthUnit: null,
      height: "",
      heightUnit: null,
      axle: "",
      GVWR: "",
      GVWR_Unit: null,
      GAWR: "",
      GAWR_Unit: null,
      ownerShip: null,
      ownerOperator: null,
      ownCname: "",
      ownAmt: "",
      ownCurr: "",
      ownDate: "",
      ownRec: true,
      ownFrq: "",
      licenceCountryCode: null,
      licenceStateCode: null,
      licencePlateNumber: "",
      annualSafetyDate: "",
      annualSafetyReminder: true,
      remarks: "",
    },
    insuranceDetails: {
      dateOfIssue: null,
      premiumAmount: "",
      premiumCurrency: null,
      dateOfExpiry: null,
      reminderBefore: "",
      reminderBeforeUnit: "",
      vendor: null,
    },
    purchase: {
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
    },
    loan: {
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
    },
    crossBorderDetails: {
      ACI_ID: "",
      ACE_ID: "",
    },
    uploadedPhotos: [],
    uploadedDocs: [],
  };

  allAssets = [];
  groupData = {
    groupName: "",
    groupType: "assets",
    description: "",
    groupMembers: [],
  };

  vendors: any = [];
  manufacturers: any = [];
  models: any = [];
  groups = [];

  isRequired: boolean = true;

  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error = "";
  Success = "";
  imageError = "";
  fileName = "";
  carrierID: any;
  states = [];
  uploadedPhotos = [];
  uploadedDocs = [];
  existPDocs = [];
  existLDocs = [];
  purchaseDocs = [];
  loanDocs = [];
  existingPhotos = [];
  existingDocs = [];
  assetsImages = [];
  assetsDocs = [];
  inspectionForms = [];
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl("");

  years = [];
  ownOperators: any = [];
  submitDisabled = false;
  groupSubmitDisabled = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  editDisabled = false;
  companyLabel = "";

  isEdit: boolean = false;
  groupsData:any = [];
  
   retInterval = [
    {
      value: 'weekly',
      name: 'Weekly'
    },
    {
      value: 'biweekly',
      name: 'Biweekly'
    },
    {
      value: 'monthly',
      name: 'Monthly'
    },
    {
      value: 'quarterly',
      name: 'Quarterly'
    },
    {
      value: 'annually',
      name: 'Annually'
    },
     {
      value: 'semi-monthly',
      name: 'Semi-Monthly'
    },
  ];
  
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private location: Location,
    private toastr: ToastrService,
    private listService: ListService,
    private spinner: NgxSpinnerService,
    private domSanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private countryStateCity: CountryStateCityService,
    private dashboardUtilityService: DashboardUtilityService
  ) {
    this.selectedFileNames = new Map<any, any>();
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  ngOnInit() {
    this.getYears();
    this.fetchManufacturers();
    this.listService.fetchVendors();
    this.listService.fetchOwnerOperators();
    this.fetchGroups();
    this.fetchAssets();
    this.fetchInspectionForms();
    this.assetID = this.route.snapshot.params[`assetID`];
    if (this.assetID) {
      this.pageTitle = "Edit Asset";
      this.fetchAssetByID();
    } else {
      this.pageTitle = "Add Asset";
    }

    let vendorList = new Array<any>();
    this.getValidVendors(vendorList);
    this.vendors = vendorList;

    let operatorList = new Array<any>();
    this.getValidOperators(operatorList);
    this.ownOperators = operatorList;
    

    this.fetchGroupsList();
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
          if (element2.contactID === this.assetsData.insuranceDetails.vendor) {
            this.assetsData.insuranceDetails.vendor = null;
          }

          if (
            element2.contactID === this.assetsData.purchase.purchaseVendorID
          ) {
            this.assetsData.purchase.purchaseVendorID = null;
          }

          if (element2.contactID === this.assetsData.loan.loanVendorID) {
            this.assetsData.loan.loanVendorID = null;
          }
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
          this.assetsData.assetDetails.ownerOperator === element2.contactID
        ) {
          this.assetsData.assetDetails.ownerOperator = null;
        }
      });
    });
  }

  fetchManufacturers() {
    this.httpClient
      .get("assets/jsonFiles/assets/trailer.json")
      .subscribe((data: any) => {
        data.forEach((element) => {
          this.manufacturers.push(Object.keys(element)[0].toUpperCase());
        });
      });
  }

  fetchModels() {
    this.models = [];
    let manufacturer: any = "";

    if (this.assetsData.assetDetails.manufacturer !== null) {
      manufacturer = this.assetsData.assetDetails.manufacturer.toLowerCase();
    }
    this.httpClient
      .get("assets/jsonFiles/assets/trailer.json")
      .subscribe((data: any) => {
        data.forEach((element) => {
          let output = [];
          if (element[manufacturer]) {
            element[manufacturer].forEach((element) => {
              output.push(element.toUpperCase());
            });
            this.models = output;
          }
        });
      });
  }
  getYears() {
    var max = new Date().getFullYear() + 1,
      min = 1991,
      max = max;

    for (var i = max; i >= min; i--) {
      this.years.push(i);
    }
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  resetModel() {
    this.assetsData.assetDetails.model = "";
    $("#assetSelect").val("");
  }

  async getInspectionForms() {
    await this.fetchInspectionForms();
  }
  fetchInspectionForms() {
    this.apiService
      .getData("inspectionForms/type/asset")
      .subscribe((result: any) => {
        this.inspectionForms = result.Items;
      });
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

  changeComp(value) {
    if (!this.assetID) {
      if (value === "interchange") {
        this.isRequired = false;
        this.assetsData.assetDetails.annualSafetyDate = "";
        this.assetsData.VIN = "";
        this.assetsData.assetDetails.year = null;
        this.assetsData.assetDetails.licenceCountryCode = null;
        this.assetsData.assetDetails.licenceStateCode = null;
      } else {
        this.isRequired = true;
      }
    } else {
      if (value === "interchange") {
        this.isRequired = false;
        this.isEdit = false;
        this.assetsData.assetDetails.annualSafetyDate = "";
        this.assetsData.VIN = "";
        this.assetsData.assetDetails.year = null;
        this.assetsData.assetDetails.licenceCountryCode = null;
        this.assetsData.assetDetails.licenceStateCode = null;
      } else if (this.isEdit) {
        this.isRequired = true;
        this.assetsData.VIN = "";
        this.assetsData.assetDetails.year = null;
        this.assetsData.assetDetails.licenceCountryCode = null;
        this.assetsData.assetDetails.licenceStateCode = null;
      } else {
        this.isRequired = true;
      }
    }
     if(value === 'rented') {
        this.companyLabel = 'Rented';
      }  else if(value === 'leased') {
      this.companyLabel = 'Leased';
      }
  }

  /*
   * Add new asset
   */
  onAddAsset() {
    this.hideErrors();
    this.submitDisabled = true;
    const data = {
      isTemp: false,
      assetID: this.assetID,
      assetIdentification: this.assetsData.assetIdentification,
      groupID: this.assetsData.groupID,
      VIN: this.assetsData.VIN,
      startDate: this.assetsData.startDate,
      inspectionFormID: this.assetsData.inspectionFormID,
      assetType: this.assetsData.assetType,
      currentStatus: this.assetsData.currentStatus,
      assetDetails: {
        year: this.assetsData.assetDetails.year,
        manufacturer: this.assetsData.assetDetails.manufacturer
          ? this.assetsData.assetDetails.manufacturer
          : "",
        model: this.assetsData.assetDetails.model
          ? this.assetsData.assetDetails.model
          : "",
        length: this.assetsData.assetDetails.length,
        lengthUnit: this.assetsData.assetDetails.lengthUnit,
        height: this.assetsData.assetDetails.height,
        heightUnit: this.assetsData.assetDetails.heightUnit,
        axle: this.assetsData.assetDetails.axle,
        GVWR: this.assetsData.assetDetails.GVWR,
        GVWR_Unit: this.assetsData.assetDetails.GVWR_Unit,
        GAWR: this.assetsData.assetDetails.GAWR,
        GAWR_Unit: this.assetsData.assetDetails.GAWR_Unit,
        ownerShip: this.assetsData.assetDetails.ownerShip,
        ownCname: this.assetsData.assetDetails.ownCname,
        ownAmt: this.assetsData.assetDetails.ownAmt,
        ownCurr:this.assetsData.assetDetails.ownCurr,
        ownDate:this.assetsData.assetDetails.ownDate,
        ownRec:this.assetsData.assetDetails.ownRec,
        ownFrq:this.assetsData.assetDetails.ownFrq,
        ownerOperator: this.assetsData.assetDetails.ownerOperator,
        licenceCountryCode: this.assetsData.assetDetails.licenceCountryCode,
        licenceStateCode: this.assetsData.assetDetails.licenceStateCode,
        licencePlateNumber: this.assetsData.assetDetails.licencePlateNumber,
        annualSafetyDate: this.assetsData.assetDetails.annualSafetyDate,
        annualSafetyReminder: this.assetsData.assetDetails.annualSafetyReminder,
        remarks: this.assetsData.assetDetails.remarks,
      },
      insuranceDetails: {
        dateOfIssue: this.assetsData.insuranceDetails.dateOfIssue,
        premiumAmount: this.assetsData.insuranceDetails.premiumAmount,
        premiumCurrency: this.assetsData.insuranceDetails.premiumCurrency,
        dateOfExpiry: this.assetsData.insuranceDetails.dateOfExpiry,
        reminderBefore: this.assetsData.insuranceDetails.reminderBefore,
        reminderBeforeUnit: this.assetsData.insuranceDetails.reminderBeforeUnit,
        vendor: this.assetsData.insuranceDetails.vendor,
      },
      purchase: {
        purchaseVendorID: this.assetsData.purchase.purchaseVendorID,
        warrantyExpirationDate: this.assetsData.purchase.warrantyExpirationDate,
        warrantyExpirationDateReminder:
          this.assetsData.purchase.warrantyExpirationDateReminder,
        purchasePrice: this.assetsData.purchase.purchasePrice,
        purchasePriceCurrency: this.assetsData.purchase.purchasePriceCurrency,
        warrantyExpirationMeter:
          this.assetsData.purchase.warrantyExpirationMeter,
        purchaseDate: this.assetsData.purchase.purchaseDate,
        purchaseComments: this.assetsData.purchase.purchaseComments,
        purchaseOdometer: this.assetsData.purchase.purchaseOdometer,
        gstInc: this.assetsData.purchase.gstInc,
      },
      loan: {
        loanVendorID: this.assetsData.loan.loanVendorID,
        amountOfLoan: this.assetsData.loan.amountOfLoan,
        amountOfLoanCurrency: this.assetsData.loan.amountOfLoanCurrency,
        annualPercentageRate: this.assetsData.loan.annualPercentageRate,
        gstInc: this.assetsData.loan.gstInc,
        downPayment: this.assetsData.loan.downPayment,
        downPaymentCurrency: this.assetsData.loan.downPaymentCurrency,
        dateOfLoan: this.assetsData.loan.dateOfLoan,
        monthlyPayment: this.assetsData.loan.monthlyPayment,
        monthlyPaymentCurrency: this.assetsData.loan.monthlyPaymentCurrency,
        numberOfPayments: this.assetsData.loan.numberOfPayments,
        loadEndDate: this.assetsData.loan.loadEndDate,
        generateExpenses: this.assetsData.loan.generateExpenses,
        notes: this.assetsData.loan.notes,
        loanDueDate: this.assetsData.loan.loanDueDate,
        lReminder: this.assetsData.loan.lReminder,
      },
      crossBorderDetails: {
        ACE_ID: this.assetsData.crossBorderDetails.ACE_ID,
        ACI_ID: this.assetsData.crossBorderDetails.ACI_ID,
      },
      uploadedPhotos: this.uploadedPhotos,
      uploadedDocs: this.uploadedDocs,
    };
    data.assetDetails.year =
      data.assetDetails.ownerShip === "interchange"
        ? new Date().getFullYear().toString()
        : data.assetDetails.year;
    let currentDate = new Date();
    let formattedDate = formatDate(currentDate, "yyyy-MM-dd", "en");
    data.assetDetails.annualSafetyDate =
      data.assetDetails.ownerShip === "interchange"
        ? formattedDate.toString()
        : data.assetDetails.annualSafetyDate;
    data.assetDetails.annualSafetyReminder =
      data.assetDetails.ownerShip === "interchange"
        ? data.assetDetails.annualSafetyReminder === false
        : data.assetDetails.annualSafetyReminder;
    data.VIN =
      data.assetDetails.ownerShip === "interchange"
        ? new Date().getTime().toString()
        : data.VIN;

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
    for (let k = 0; k < this.purchaseDocs.length; k++) {
      formData.append("purchaseDocs", this.purchaseDocs[k]);
    }

    // append loan docs if any
    for (let l = 0; l < this.loanDocs.length; l++) {
      formData.append("loanDocs", this.loanDocs[l]);
    }

    // append other fields
    formData.append("data", JSON.stringify(data));

    this.apiService.postData("assets", formData, true).subscribe({
      complete: () => { },
      error: (err: any) => {
        this.submitDisabled = false;
        from(err.error)
          .pipe(
            map((val: any) => {
              // val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.submitDisabled = false;
              this.throwErrors();
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
        this.toastr.success("Asset added successfully.");
        this.dashboardUtilityService.refreshAssets = true;
        this.cancel();
      },
    });
  }

  throwErrors() {
    from(Object.keys(this.errors)).subscribe((v) => {
      if (v === "assetIdentification" || v === "VIN") {
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

  /*
   * Fetch Asset details before updating
   */
  fetchAssetByID() {
    this.spinner.show(); // loader init
    this.apiService
      .getData("assets/" + this.assetID)
      .subscribe(async (result: any) => {
        this.editDisabled = true;
        result = result.Items[0];
        this.assetsData[`assetID`] = this.assetID;
        this.assetsData.assetIdentification = result.assetIdentification;
        this.assetsData.createdTime = result.createdTime;
        this.assetsData.createdDate = result.createdDate;
        this.assetsData.groupID = result.groupID;
        this.assetsData.inspectionFormID = result.inspectionFormID;
        this.assetsData.VIN = result.VIN;
        this.assetsData.startDate = result.startDate;
        this.assetsData.assetType = result.assetType;
        this.assetsData.assetDetails.year = result.assetDetails.year;
        this.assetsData.assetDetails.manufacturer =
          result.assetDetails.manufacturer;
        this.assetsData.assetDetails.model = result.assetDetails.model;
        this.assetsData.assetDetails.length = result.assetDetails.length;
        this.assetsData.assetDetails.lengthUnit =
          result.assetDetails.lengthUnit;
        (this.assetsData.assetDetails.height = result.assetDetails.height),
          (this.assetsData.assetDetails.heightUnit =
            result.assetDetails.heightUnit),
          (this.assetsData.assetDetails.axle = result.assetDetails.axle);
        this.assetsData.assetDetails.GVWR = result.assetDetails.GVWR;
        this.assetsData.assetDetails.GVWR_Unit = result.assetDetails.GVWR_Unit;
        this.assetsData.assetDetails.GAWR = result.assetDetails.GAWR;
        this.assetsData.assetDetails.GAWR_Unit = result.assetDetails.GAWR_Unit;
        this.assetsData.assetDetails.ownerShip = result.assetDetails.ownerShip;
        this.assetsData.assetDetails.ownCname = result.assetDetails.ownCname;
        this.assetsData.assetDetails.ownAmt = result.assetDetails.ownAmt;
        this.assetsData.assetDetails.ownCurr = result.assetDetails.ownCurr;
        this.assetsData.assetDetails.ownDate = result.assetDetails.ownDate;
        this.assetsData.assetDetails.ownRec = result.assetDetails.ownRec;
        this.assetsData.assetDetails.ownFrq = result.assetDetails.ownFrq;
        if (result.assetDetails.ownerShip === "ownerOperator") {
          this.assetsData.assetDetails.ownerOperator =
            result.assetDetails.ownerOperator;
        }
         if (result.assetDetails.ownerShip === "interchange") {
          this.isRequired = false;
          this.isEdit = true;
        } else {
          this.isRequired = true;
        }

        this.assetsData.currentStatus = result.currentStatus;
        this.assetsData.assetDetails.licenceCountryCode =
          result.assetDetails.licenceCountryCode;
        await this.getStates(result.assetDetails.licenceCountryCode);
        this.assetsData.assetDetails.licenceStateCode =
          result.assetDetails.licenceStateCode;
        this.assetsData.assetDetails.licencePlateNumber =
          result.assetDetails.licencePlateNumber;
        this.assetsData.assetDetails.annualSafetyDate =
          result.assetDetails.annualSafetyDate;
        this.assetsData.assetDetails.annualSafetyReminder =
          result.assetDetails.annualSafetyReminder;
        this.assetsData.assetDetails.remarks = result.assetDetails.remarks;
        this.assetsData.insuranceDetails.dateOfIssue =
          result.insuranceDetails.dateOfIssue;
        this.assetsData.insuranceDetails.premiumAmount =
          result.insuranceDetails.premiumAmount;
        this.assetsData.insuranceDetails.premiumCurrency =
          result.insuranceDetails.premiumCurrency;
        this.assetsData.insuranceDetails.dateOfExpiry =
          result.insuranceDetails.dateOfExpiry;
        this.assetsData.insuranceDetails.dateOfIssue =
          result.insuranceDetails.dateOfIssue;
        this.assetsData.insuranceDetails.reminderBefore =
          result.insuranceDetails.reminderBefore;
        this.assetsData.insuranceDetails.reminderBeforeUnit =
          result.insuranceDetails.reminderBeforeUnit;
        this.assetsData.insuranceDetails.vendor =
          result.insuranceDetails.vendor;

        this.assetsData.purchase.purchaseVendorID =
          result.purchase.purchaseVendorID;
        this.assetsData.purchase.warrantyExpirationDate =
          result.purchase.warrantyExpirationDate;
        this.assetsData.purchase.purchasePrice = result.purchase.purchasePrice;
        this.assetsData.purchase.purchasePriceCurrency =
          result.purchase.purchasePriceCurrency;
        this.assetsData.purchase.warrantyExpirationMeter =
          result.purchase.warrantyExpirationMeter;
        this.assetsData.purchase.purchaseDate = result.purchase.purchaseDate;
        this.assetsData.purchase.purchaseComments =
          result.purchase.purchaseComments;
        this.assetsData.purchase.purchaseOdometer =
          result.purchase.purchaseOdometer;
        this.assetsData.purchase.gstInc = result.purchase.gstInc;

        this.assetsData.loan.loanVendorID = result.loan.loanVendorID;
        this.assetsData.loan.amountOfLoan = result.loan.amountOfLoan;
        this.assetsData.loan.amountOfLoanCurrency =
          result.loan.amountOfLoanCurrency;
        this.assetsData.loan.annualPercentageRate =
          result.loan.annualPercentageRate;
        this.assetsData.loan.downPayment = result.loan.downPayment;
        this.assetsData.loan.downPaymentCurrency =
          result.loan.downPaymentCurrency;
        this.assetsData.loan.monthlyPaymentCurrency =
          result.loan.monthlyPaymentCurrency;
        this.assetsData.loan.dateOfLoan = result.loan.dateOfLoan;
        this.assetsData.loan.monthlyPayment = result.loan.monthlyPayment;
        this.assetsData.loan.numberOfPayments = result.loan.numberOfPayments;
        this.assetsData.loan.loadEndDate = result.loan.loadEndDate;
        this.assetsData.loan.generateExpenses = result.loan.generateExpenses;
        this.assetsData.loan.loanDueDate = result.loan.loanDueDate;
        this.assetsData.loan.lReminder = result.loan.lReminder;
        this.assetsData.loan.gstInc = result.loan.gstInc;
        this.assetsData.loan.notes = result.loan.notes;

        this.assetsData.crossBorderDetails.ACE_ID =
          result.crossBorderDetails.ACE_ID;
        this.assetsData.crossBorderDetails.ACI_ID =
          result.crossBorderDetails.ACI_ID;
        this.existingPhotos = result.uploadedPhotos;
        this.existingDocs = result.uploadedDocs;
        this.existPDocs = result.purchaseDocs;
        this.existLDocs = result.loanDocs;

        if (
          result.uploadedPhotos !== undefined &&
          result.uploadedPhotos.length > 0
        ) {
         // this.assetsImages = result.uploadedPhotos.map((x: any) => ({
         //    path: `${this.Asseturl}/${result.carrierID}/${x}`,
         //    name: x,
         // }));
            this.assetsImages = result.uploadedPhotosLinks;
        }

        if (
          result.uploadedDocs !== undefined &&
          result.uploadedDocs.length > 0
        ) {
         // this.assetsDocs = result.uploadedDocs.map((x) => ({
         //    path: `${this.Asseturl}/${result.carrierID}/${x}`,
         //   name: x,
         // }));
            this.assetsDocs = result.uploadedDocsLinks;
        }

        if (result.loanDocs !== undefined && result.loanDocs.length > 0) {
        // this.lDocs = result.loanDocs.map((x) => ({
        //    path: `${this.Asseturl}/${result.carrierID}/${x}`,
        //   name: x,
        //  }));
            this.lDocs = result.loanDocsLinks;
        }

        if (
          result.purchaseDocs !== undefined &&
          result.purchaseDocs.length > 0
        ) {
        //  this.pDocs = result.purchaseDocs.map((x) => ({
        //    path: `${this.Asseturl}/${result.carrierID}/${x}`,
        //    name: x,
        //  }));
            this.pDocs = result.purchaseDocsLinks;
        }

        this.spinner.hide(); // loader hide
      });
  }
  /*
   * Update asset
   */
  onUpdateAsset() {
    this.hasError = false;
    this.hasSuccess = false;

    this.submitDisabled = true;
    const data = {
      isTemp: false,
      assetID: this.assetID,
      assetIdentification: this.assetsData.assetIdentification,
      groupID: this.assetsData.groupID,
      VIN: this.assetsData.VIN,
      startDate: this.assetsData.startDate,
      createdTime: this.assetsData.createdTime,
      createdDate: this.assetsData.createdDate,
      inspectionFormID: this.assetsData.inspectionFormID,
      assetType: this.assetsData.assetType,
      currentStatus: this.assetsData.currentStatus,
      assetDetails: {
        year: this.assetsData.assetDetails.year,
        manufacturer: this.assetsData.assetDetails.manufacturer,
        model: this.assetsData.assetDetails.model,
        length: this.assetsData.assetDetails.length,
        lengthUnit: this.assetsData.assetDetails.lengthUnit,
        height: this.assetsData.assetDetails.height,
        heightUnit: this.assetsData.assetDetails.heightUnit,
        axle: this.assetsData.assetDetails.axle,
        GVWR: this.assetsData.assetDetails.GVWR,
        GVWR_Unit: this.assetsData.assetDetails.GVWR_Unit,
        GAWR: this.assetsData.assetDetails.GAWR,
        GAWR_Unit: this.assetsData.assetDetails.GAWR_Unit,
        ownerShip: this.assetsData.assetDetails.ownerShip,
        ownCname: this.assetsData.assetDetails.ownCname,
        ownAmt: this.assetsData.assetDetails.ownAmt,
        ownCurr: this.assetsData.assetDetails.ownCurr,
        ownDate: this.assetsData.assetDetails.ownDate,
        ownRec: this.assetsData.assetDetails.ownRec,
        ownFrq: this.assetsData.assetDetails.ownFrq,
        ownerOperator: this.assetsData.assetDetails.ownerOperator,
        licenceCountryCode: this.assetsData.assetDetails.licenceCountryCode,
        licenceStateCode: this.assetsData.assetDetails.licenceStateCode,
        licencePlateNumber: this.assetsData.assetDetails.licencePlateNumber,
        annualSafetyDate: this.assetsData.assetDetails.annualSafetyDate,
        annualSafetyReminder: this.assetsData.assetDetails.annualSafetyReminder,
        remarks: this.assetsData.assetDetails.remarks,
      },
      insuranceDetails: {
        dateOfIssue: this.assetsData.insuranceDetails.dateOfIssue,
        premiumAmount: this.assetsData.insuranceDetails.premiumAmount,
        premiumCurrency: this.assetsData.insuranceDetails.premiumCurrency,
        dateOfExpiry: this.assetsData.insuranceDetails.dateOfExpiry,
        reminderBefore: this.assetsData.insuranceDetails.reminderBefore,
        reminderBeforeUnit: this.assetsData.insuranceDetails.reminderBeforeUnit,
        vendor: this.assetsData.insuranceDetails.vendor,
      },
      purchase: {
        purchaseVendorID: this.assetsData.purchase.purchaseVendorID,
        warrantyExpirationDate: this.assetsData.purchase.warrantyExpirationDate,
        warrantyExpirationDateReminder:
          this.assetsData.purchase.warrantyExpirationDateReminder,
        purchasePrice: this.assetsData.purchase.purchasePrice,
        purchasePriceCurrency: this.assetsData.purchase.purchasePriceCurrency,
        warrantyExpirationMeter:
          this.assetsData.purchase.warrantyExpirationMeter,
        purchaseDate: this.assetsData.purchase.purchaseDate,
        purchaseComments: this.assetsData.purchase.purchaseComments,
        purchaseOdometer: this.assetsData.purchase.purchaseOdometer,
        gstInc: this.assetsData.purchase.gstInc,
      },
      loan: {
        loanVendorID: this.assetsData.loan.loanVendorID,
        amountOfLoan: this.assetsData.loan.amountOfLoan,
        amountOfLoanCurrency: this.assetsData.loan.amountOfLoanCurrency,
        annualPercentageRate: this.assetsData.loan.annualPercentageRate,
        gstInc: this.assetsData.loan.gstInc,
        downPayment: this.assetsData.loan.downPayment,
        downPaymentCurrency: this.assetsData.loan.downPaymentCurrency,
        dateOfLoan: this.assetsData.loan.dateOfLoan,
        monthlyPayment: this.assetsData.loan.monthlyPayment,
        monthlyPaymentCurrency: this.assetsData.loan.monthlyPaymentCurrency,
        numberOfPayments: this.assetsData.loan.numberOfPayments,
        loadEndDate: this.assetsData.loan.loadEndDate,
        generateExpenses: this.assetsData.loan.generateExpenses,
        notes: this.assetsData.loan.notes,
        loanDueDate: this.assetsData.loan.loanDueDate,
        lReminder: this.assetsData.loan.lReminder,
      },
      crossBorderDetails: {
        ACE_ID: this.assetsData.crossBorderDetails.ACE_ID,
        ACI_ID: this.assetsData.crossBorderDetails.ACI_ID,
      },
      uploadedPhotos: this.existingPhotos,
      uploadedDocs: this.existingDocs,
      purchaseDocs: this.existPDocs,
      loanDocs: this.existLDocs,
    };
    data.assetDetails.year =
      data.assetDetails.ownerShip === "interchange"
        ? new Date().getFullYear().toString()
        : data.assetDetails.year;
    let currentDate = new Date();
    let formattedDate = formatDate(currentDate, "yyyy-MM-dd", "en");
    data.assetDetails.annualSafetyDate =
      data.assetDetails.ownerShip === "interchange"
        ? formattedDate.toString()
        : data.assetDetails.annualSafetyDate;
    data.assetDetails.annualSafetyReminder =
      data.assetDetails.ownerShip === "interchange"
        ? data.assetDetails.annualSafetyReminder === false
        : data.assetDetails.annualSafetyReminder;
    data.VIN =
      data.assetDetails.ownerShip === "interchange"
        ? new Date().getTime().toString()
        : data.VIN;

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
    for (let k = 0; k < this.purchaseDocs.length; k++) {
      formData.append("purchaseDocs", this.purchaseDocs[k]);
    }

    // append loan docs if any
    for (let l = 0; l < this.loanDocs.length; l++) {
      formData.append("loanDocs", this.loanDocs[l]);
    }
    //append other fields
    formData.append("data", JSON.stringify(data));

    this.apiService.putData("assets/", formData, true).subscribe({
      complete: () => { },
      error: (err) => {
        this.submitDisabled = false;
        from(err.error)
          .pipe(
            map((val: any) => {
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.submitDisabled = false;
              this.throwErrors();
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
        this.hasSuccess = true;
        this.toastr.success("Asset updated successfully.");
        this.dashboardUtilityService.refreshAssets = true;
        this.cancel();
        this.Success = "";
      },
    });
  }

  selectDocuments(event, obj) {
    let files = [...event.target.files];

    if (obj === "uploadedDocs") {
      this.uploadedDocs = [];
      for (let i = 0; i < files.length; i++) {
        this.uploadedDocs.push(files[i]);
      }
    } else if (obj === "purchase") {
      for (let i = 0; i < files.length; i++) {
        this.purchaseDocs.push(files[i]);
      }
    } else if (obj === "loan") {
      for (let i = 0; i < files.length; i++) {
        this.loanDocs.push(files[i]);
      }
    } else {
      this.uploadedPhotos = [];
      for (let i = 0; i < files.length; i++) {
        this.uploadedPhotos.push(files[i]);
      }
    }
  }

  // Changing gvwr/gawr values
  gwr(value, el) {
    if (el === "GVWR_Unit") {
      this.assetsData.assetDetails[`GAWR_Unit`] = value;
    } else {
      this.assetsData.assetDetails[`GVWR_Unit`] = value;
    }
  }

  

  getGroups() {
    this.fetchGroups();
  }

  fetchAssets() {
    this.apiService.getData("assets").subscribe((result: any) => {
      // this.allAssets = result.Items;
      result.Items.forEach((element) => {
        if (element.isDeleted === 0) {
          this.allAssets.push(element);
        }
      });
    });
  }

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
              this.throwErrors();
              this.groupSubmitDisabled = false;
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
        this.fetchGroups();
        this.toastr.success("Group added successfully.");
        $("#addGroupModal").modal("hide");
        this.groupData[`groupName`] = "";
        this.groupData[`groupMembers`] = [];
        this.groupData[`description`] = "";
      },
    });
  }

  async getStates(countryCode) {
    this.assetsData.assetDetails.licenceStateCode = null;
    this.states = await this.countryStateCity.GetStatesByCountryCode([
      countryCode,
    ]);
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

  // delete uploaded images and documents
  // delete(type: string, name: string, index: any) {
  //   if (type === 'doc') {
  //     this.assetsDocs.splice(index, 1);
  //     this.existingDocs.splice(index, 1);
  //     this.deleteUploadedFile(type, name);
  //   } else {
  //     this.assetsImages.splice(index, 1);
  //     this.existingPhotos.splice(index, 1);
  //     this.deleteUploadedFile(type, name);
  //   }
  // }
  // deleteUploadedFile(type: string, name: string) { // delete from aws
  //   this.apiService.deleteData(`assets/uploadDelete/${this.assetID}/${type}/${name}`).subscribe((result: any) => { });
  // }

  deleteDocument(type: string, name: string) {
    // delete from aws
    this.apiService
      .deleteData(`assets/uploadDelete/${this.assetID}/${type}/${name}`)
      .subscribe((result: any) => {
        if (type == "doc") {
          this.assetsDocs = [];
          this.uploadedDocs = result.Attributes.uploadedDocs;
          this.existingDocs = result.Attributes.uploadedDocs;
          result.Attributes.uploadedDocs.map((x) => {
            let obj = {
              name: x,
              path: `${this.Asseturl}/${result.carrierID}/${x}`,
            };
            this.assetsDocs.push(obj);
          });
        } else if (type == "loan") {
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

  clearAssetGroup() {
    this.groupData = {
      groupName: "",
      groupType: "assets",
      description: "",
      groupMembers: [],
    };
  }
  
  fetchGroups() {
    this.apiService
      .getData(`groups/getGroup/${this.groupData.groupType}`)
      .subscribe((result: any) => {
        this.groups = result.Items;
      });
  }
  
  fetchGroupsList() {
    this.apiService.getData('groups/get/list/type?type=assets').subscribe((result: any) => {
      this.groupsData = result;
    });
  }
}
