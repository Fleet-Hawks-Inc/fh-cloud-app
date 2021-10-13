const ct = require('countries-and-timezones');
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Auth } from 'aws-amplify';
import { passwordStrength } from 'check-password-strength';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { from, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { CanComponentDeactivate } from 'src/app/guards/unsaved-changes.guard';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';

import { UnsavedChangesComponent } from 'src/app/unsaved-changes/unsaved-changes.component';
import { ApiService, HereMapService, ListService } from '../../../../services';
import { ModalService } from '../../../../services/modal.service';
import Constants from '../../constants';
declare var $: any;
@Component({
  selector: "app-add-driver",
  templateUrl: "./add-driver.component.html",
  styleUrls: ["./add-driver.component.css"],
})
export class AddDriverComponent
  implements OnInit, OnDestroy, CanComponentDeactivate {
  @ViewChild("driverF") driverF: NgForm;
  takeUntil$ = new Subject();
  Asseturl = this.apiService.AssetUrl;
  // driverSession = JSON.parse(localStorage.getItem('driver'));
  pageTitle: string;
  lastElement;
  hideNextBtn = true;
  hasBasic = false;
  hasDocs = false;
  hasLic = false;
  hasPay = false;
  hasHos = false;
  hasCrossBrdr = false;
  deletedUploads = [];
  addressField = -1;
  userLocation: any;
  public driverID;
  public driverProfileSrc: any = "assets/img/driver/driver.png";
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  errors = {};
  // form;
  concatArrayKeys = "";
  manualAddress = false;
  nextTab: any;
  carrierID: any;
  statesObject: any;
  countriesObject: any;
  citiesObject: any;
  allDrivers: any;
  groupData = {
    groupType: "drivers", // it can be users,vehicles,assets,drivers
    groupName: "",
    groupMembers: "",
    description: "",
  };

  driverAddress = {
    address: [],
  };
  isEdit = false;
  driverData = {
    employeeContractorId: "",
    createdDate: "",
    createdTime: "",
    driverType: "employee",
    entityType: Constants.DRIVER,
    gender: "M",
    DOB: null,
    abstractDocs: [],
    corporationType: null,
    vendor: null,
    corporation: "",
    ownerOperator: null,
    driverStatus: null,
    userName: "",
    firstName: null,
    lastName: null,
    startDate: null,
    terminationDate: null,
    contractStart: null,
    contractEnd: null,
    password: null,
    confirmPassword: null,
    citizenship: null,
    assignedVehicle: null,
    groupID: null,
    driverImage: "",
    phone: "",
    email: "",
    address: [
      {
        addressID: "",
        addressType: null,
        countryName: "",
        countryCode: "",
        stateCode: "",
        stateName: "",
        cityName: "",
        zipCode: "",
        address1: "",
        address2: "",
        geoCords: {
          lat: "",
          lng: "",
        },
        manual: false,
        userLocation: "",
        states: [],
        cities: [],
        isSuggest: false,
      },
    ],
    documentDetails: [
      {
        documentType: null,
        document: "",
        issuingAuthority: "",
        issuingCountry: null,
        issuingState: null,
        issueDate: "",
        expiryDate: "",
        uploadedDocs: [],
        docStates: [],
      },
    ],
    crossBorderDetails: {
      ACI_ID: "",
      ACE_ID: "",
      fast_ID: "",
      fastExpiry: null,
      csa: false,
    },
    paymentDetails: {
      paymentType: "",
      loadedMiles: "",
      loadedMilesTeam: "",
      loadedMilesUnit: "",
      loadedMilesTeamUnit: "",
      emptyMiles: "",
      emptyMilesTeam: "",
      emptyMilesUnit: "",
      emptyMilesTeamUnit: "",
      loadPayPercentage: "",
      loadPayPercentageOf: "",
      rate: "",
      rateUnit: "",
      waitingPay: "",
      waitingPayUnit: "",
      waitingHourAfter: "",
      deliveryRate: "",
      deliveryRateUnit: "",
      payPeriod: "",
    },
    SIN: "",
    CDL_Number: "",
    licenceDetails: {
      issuedCountry: null,
      issuedState: null,
      licenceExpiry: null,
      licenceNotification: true,
      WCB: "",
      medicalCardRenewal: null,
      healthCare: "",
      vehicleType: "",
      licCntryName: "",
      licStateName: "",
    },
    hosDetails: {
      hosStatus: null,
      timezone: null,
      type: null,
      hosRemarks: "",
      homeTerminal: null,
      pcAllowed: false,
      ymAllowed: false,
      hosCycleName: null,
      optZone: "South (Canada)",
    },
    emergencyDetails: {
      name: "",
      relationship: "",
      phone: "",
    },
  };
  public searchTerm = new Subject<string>();
  public searchResults: any;
  localAbsDocs = [];
  currentUserCarrier: string;
  newDocuments = [];
  newAddress = [];
  /**
   * Form Props
   */
  userType = "driver"; // default
  userName = null;
  password = "";
  firstName = null;
  lastName = null;
  address = "";
  phone = "";
  email = "";
  groupID = "";
  loginEnabled = true;
  driverNumber = "";
  driverLicenseNumber = "";
  driverLicenseType = "";
  driverLicenseExpiry = "";
  driverLicenseStateID = "";
  HOSCompliance = {
    status: "",
    type: "",
    cycleID: "",
  };
  defaultContract = {
    perMile: "",
    team: "",
    hourly: "",
    pickOrDrop: "",
  };
  fixed = {
    amount: "",
    type: "",
  };
  yardID = "";

  documentTypeList: any = [];
  driverLicenseCountry = "";
  groups = [];
  docCountries = [];
  docStates = [];
  vehicles: any;
  states = [];
  errorAbstract = false;
  cities = [];
  yards = [];
  cycles = [];
  response: any = "";
  hasError = false;
  hasSuccess = false;
  imageTitle = "Add";
  Error = "";
  Success = "";
  visibleIndex = 0;
  getcurrentDate: any;
  birthDateMinLimit: any;
  birthDateMaxLimit: any;
  futureDatesLimit: any;
  uploadedPhotos = [];
  licStates = [];
  uploadedDocs = [];
  abstractDocs = [];
  existingPhotos = [];
  existingDocs = [];
  assetsImages = [];
  assetsDocs = [];
  absDocs = [];
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl("");
  isSubmitted = false;
  showIcons = false;
  profileTitle = "Add";
  addressCountries = [];
  carrierYards: any = [];
  deletedAddress = [];
  ownerOperators: any;
  vendors: any;
  abstractValid = false;
  prefixOutput: string;
  finalPrefix = "";
  currentUser: any;
  modelID = "";
  empPrefix: any;
  submitDisabled = false;
  groupSubmitDisabled = false;
  fieldTextType: boolean;
  cpwdfieldTextType: boolean;
  passwordValidation = {
    upperCase: false,
    lowerCase: false,
    number: false,
    specialCharacters: false,
    length: false,
  };
  finaltimezones: any = [];
  nullVar = null;
  uploadedPic = "";
  showUploadedPicModal = false;
  pageType = 'add';

  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private HereMap: HereMapService,
    private ngbCalendar: NgbCalendar,
    private domSanitizer: DomSanitizer,
    private location: Location,
    private modalService: NgbModal,
    private modalServiceOwn: ModalService,
    private dateAdapter: NgbDateAdapter<string>,
    private router: Router,
    private listService: ListService,
    private countryStateCity: CountryStateCityService
  ) {
    this.modalServiceOwn.triggerRedirect.next(false);

    this.router.events.pipe(takeUntil(this.takeUntil$)).subscribe((v: any) => {
      if (v.url !== "undefined" || v.url !== "") {
        this.modalServiceOwn.setUrlToNavigate(v.url);
      }
    });
    this.modalServiceOwn.triggerRedirect$
      .pipe(takeUntil(this.takeUntil$))
      .subscribe((v) => {
        if (v) {
          this.router.navigateByUrl(
            this.modalServiceOwn.urlToRedirect.getValue()
          );
        }
      });
    this.selectedFileNames = new Map<any, any>();
    const date = new Date();
    this.getcurrentDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    this.birthDateMinLimit = { year: 1950, month: 1, day: 1 };
    this.birthDateMaxLimit = {
      year: date.getFullYear() - 18,
      month: 12,
      day: 31,
    };
    this.futureDatesLimit = {
      year: date.getFullYear() + 30,
      month: 12,
      day: 31,
    };
  }
  scrollError() {
    let errorList;
    setTimeout(() => {
      errorList = document.getElementsByClassName('error').length;
      if (errorList > 0) {
        let topPosition: any = $('.error').parent('div').offset().top;
        window.scrollTo({ top: topPosition - 150, left: 0, behavior: 'smooth' });
      }
    }, 1500);
  }
  /**
   * Unsaved Changes
   */
  canLeave(): boolean {
    if (this.driverF.dirty && !this.isSubmitted) {
      if (!this.modalService.hasOpenModals()) {
        this.modalService.open(UnsavedChangesComponent, { size: "sm" });
      }
      return false;
    }
    this.modalServiceOwn.triggerRedirect.next(true);
    this.takeUntil$.next();
    this.takeUntil$.complete();
    return true;
  }

  onChangeHideErrors(fieldname: any) {
    $('[name="' + fieldname + '"]')
      .removeClass("error")
      .next()
      .remove("label");
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday());
  }

  async ngOnInit() {
    this.listService.fetchVehicles();

    this.driverID = this.route.snapshot.params[`driverID`];
    if (this.driverID) {
      this.pageTitle = "Edit Driver";
      this.pageType = 'edit';
      await this.fetchDriverByID();
    } else {
      this.pageTitle = "Add Driver";
    }
    this.fetchGroups(); // fetch groups
    this.fetchCountries(); // fetch countries
    this.getToday(); // get today date on calender
    this.searchLocation(); // search location on keyup
    this.fetchDocuments();
    this.fetchTimezones(); // to fetch timezone
    this.fetchDrivers();
    await this.getCurrentuser();

    let vehicleList = new Array<any>();
    this.getValidVehicles(vehicleList);
    this.vehicles = vehicleList;
  }

  private getValidVehicles(vehicleList: any[]) {
    let ids = [];
    this.listService.vehicleList.forEach((element) => {
      element.forEach((element2) => {
        if (
          element2.vehicleIdentification &&
          element2.isDeleted === 1 &&
          element2.vehicleID === this.driverData.assignedVehicle
        ) {
          this.driverData.assignedVehicle = null;
        }
        if (
          element2.vehicleIdentification &&
          element2.isDeleted === 0 &&
          !ids.includes(element2.vehicleID)
        ) {
          vehicleList.push(element2);
          ids.push(element2.vehicleID);
        }
      });
    });
  }

  async getCarrierDetails(id: string) {
    this.spinner.show();
    this.apiService.getData("carriers/" + id).subscribe((res) => {
      if (res.Items.length > 0) {
        let carrierPrefix = res.Items[0].businessName;
        let toArray = carrierPrefix.match(/\b(\w)/g);
        this.prefixOutput = toArray.join("") + "-";
      }
      this.spinner.hide();
    });
  }
  fetchDrivers() {
    this.apiService.getData("drivers").subscribe((res: any) => {
      this.allDrivers = res.Items;
    });
  }
  fetchTimezones() {
    const UStimezones = ct.getTimezonesForCountry(`US`);
    UStimezones.forEach((element: any) => {
      const obj: any = {
        name: element.name,
        country: element.countries[0],
      };
      this.finaltimezones.push(obj);
    });
    const CAtimezones = ct.getTimezonesForCountry(`CA`);
    CAtimezones.forEach((e: any) => {
      const obj: any = {
        name: e.name,
        country: e.countries[0],
      };
      this.finaltimezones.push(obj);
    });
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  refreshVehicleData() {
    this.listService.fetchVehicles();
  }

  clearUserLocation(i) {
    this.driverData.address[i][`userLocation`] = "";
    $("div").removeClass("show-search__result");
  }
  manAddress(event, i) {
    if (event.target.checked) {
      $(event.target).closest(".address-item").addClass("open");
      this.driverData.address[i][`userLocation`] = "";
      this.driverData.address[i].zipCode = "";
      this.driverData.address[i].countryCode = "";
      this.driverData.address[i].stateCode = "";
      this.driverData.address[i].cityName = "";
      this.driverData.address[i].zipCode = "";
      this.driverData.address[i].address1 = "";
      this.driverData.address[i].address2 = "";
    } else {
      $(event.target).closest(".address-item").removeClass("open");
      this.driverData.address[i].countryCode = "";
      this.driverData.address[i].countryName = "";
      this.driverData.address[i].stateCode = "";
      this.driverData.address[i].stateName = "";
      this.driverData.address[i].cityName = "";
      this.driverData.address[i].zipCode = "";
      this.driverData.address[i].address1 = "";
      this.driverData.address[i].address2 = "";
      this.driverData.address[i].geoCords.lat = "";
      this.driverData.address[i].geoCords.lng = "";
      $('#addErr' + i).css('display', 'none');
    }
  }

  onChangeUnitType(str, value: any) {
    if (str === "driver_type") {
      if (value === "employee") {
        delete this.driverData.ownerOperator;
        delete this.driverData.corporationType;
        delete this.driverData.vendor;
        delete this.driverData.corporation;
        delete this.driverData.contractStart;
        delete this.driverData.contractEnd;
      } else {
        delete this.driverData.startDate;
        delete this.driverData.terminationDate;
      }
      this.driverData.driverType = value;
    } else {
      this.driverData.gender = value;
    }
  }

  addAddress() {
    this.driverData.address.push({
      addressID: "",
      addressType: "",
      countryCode: "",
      countryName: "",
      stateCode: "",
      stateName: "",
      cityName: "",
      zipCode: "",
      address1: "",
      address2: "",
      geoCords: {
        lat: "",
        lng: "",
      },
      manual: false,
      userLocation: "",
      states: [],
      cities: [],
      isSuggest: false,
    });
  }

  fetchGroups() {
    this.apiService
      .getData(`groups/getGroup/${this.groupData.groupType}`)
      .subscribe((result: any) => {
        this.groups = result.Items;
      });
  }
  refreshGroupsData() {
    this.fetchGroups();
  }
  refreshVendorData() {
    this.listService.fetchVendors();
  }
  refreshOpData() {
    this.listService.fetchOwnerOperators();
  }

  async fetchCountries() {
    this.docCountries = await this.countryStateCity.GetAllCountries();
  }
  async getStates(countryCode: any, index: any) {
    this.driverData.address[index].stateCode = "";
    this.driverData.address[index].cityName = "";
    this.driverData.address[index].states =
      await this.countryStateCity.GetStatesByCountryCode([countryCode]);
  }
  async getCities(stateCode: any, index: any, countryCode: any) {
    this.driverData.address[index].cityName = "";
    this.driverData.address[index].cities =
      await this.countryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
    this.driverData.address[index].countryName =
      await this.countryStateCity.GetSpecificCountryNameByCode(countryCode);
    this.driverData.address[index].stateName =
      await this.countryStateCity.GetStateNameFromCode(stateCode, countryCode);
  }
  async getDocStates(cntryCode: any, index: any) {
    this.driverData.documentDetails[index].issuingState = "";
    this.driverData.documentDetails[index].docStates =
      await this.countryStateCity.GetStatesByCountryCode([cntryCode]);
  }
  async getLicStates(cntryCode: any) {
    this.driverData.licenceDetails.issuedState = null;
    this.driverData.licenceDetails.licCntryName =
      await this.countryStateCity.GetSpecificCountryNameByCode(cntryCode);

    this.licStates = await this.countryStateCity.GetStatesByCountryCode([cntryCode]);
  }

  async getLicenseStateName() {
    if (
      this.driverData.licenceDetails.issuedState &&
      this.driverData.licenceDetails.issuedCountry
    ) {
      this.driverData.licenceDetails.licStateName =
        await this.countryStateCity.GetStateNameFromCode(
          this.driverData.licenceDetails.issuedState,
          this.driverData.licenceDetails.issuedCountry
        );
    }
  }

  async fetchLicStates(issuedCountry: any) {
    this.licStates = await this.countryStateCity.GetStatesByCountryCode([issuedCountry]);
  }
  async fetchStates(countryCode: any, index: any) {
    let states = await this.countryStateCity.GetStatesByCountryCode([countryCode]);
    this.driverData.address[index].states = states;
  }
  async fetchCities(countryCode: any, stateCode: any, index: any) {
    this.driverData.address[index].cities =
      await this.countryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
  }
  editAddress(address: any) {
    for (let a = 0; a < address.length; a++) {
      const countryCode = address[a].countryCode;
      const stateCode = address[a].stateCode;
      if (countryCode !== '' && countryCode !== null) {
        this.fetchStates(countryCode, a);
      }
      if (stateCode !== '' && stateCode !== null) {
      this.fetchCities(countryCode, stateCode, a);
     }
    }
  }
  async fetchDocStates(docs) {
    for (let d = 0; d < docs.length; d++) {
      let countryCode = this.driverData.documentDetails[d].issuingCountry;
      this.driverData.documentDetails[d].docStates =
        await this.countryStateCity.GetStatesByCountryCode([countryCode]);
    }
  }
  fetchDocuments() {
    this.httpClient.get("assets/travelDocumentType.json").subscribe((data) => {
      this.documentTypeList = data;
    });
  }

  getToday(): string {
    return new Date().toISOString().split("T")[0];
  }
  /*
   * Selecting files before uploading
   */
  selectDocuments(event: any, i: number) {
    let files = [...event.target.files];
    if (i != null) {
      this.uploadedDocs[i] = [];
      this.uploadedDocs[i] = files;
    } else {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.localAbsDocs.push(e.target.result);
      };
      reader.readAsDataURL(files[0]);
      this.abstractDocs = [];
      this.abstractDocs = files;
    }
  }

  selectPhoto(event, name: any, type: string) {
    if (type === "Add") {
      this.uploadedPhotos = [];
      const files = [...event.target.files];
      this.uploadedPhotos.push(files[0]);
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        this.showUploadedPicModal = true;
        reader.onload = (e: any) => {
          this.uploadedPic = e.target.result;
        };
        reader.readAsDataURL(files[i]);
        this.imageTitle = "Change";
      }
    } else {
      this.uploadedPhotos = [];
      const files = [...event.target.files];
      this.uploadedPhotos.push(files[0]);
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        this.showUploadedPicModal = true;
        reader.onload = (e: any) => {
          this.uploadedPic = e.target.result;
        };
        reader.readAsDataURL(files[i]);
      }
      this.deletedUploads.push(name);
    }
  }

  removeProfile() {
    this.driverProfileSrc = "assets/img/driver/driver.png";
    this.uploadedPhotos = [];
    this.profileTitle = "Add";
  }

  public searchLocation() {
    this.searchTerm
      .pipe(
        map((e: any) => {
          $(".map-search__results").hide();
          $(e.target).closest("div").addClass("show-search__result");
          return e.target.value;
        }),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => {
          return this.HereMap.searchEntries(term);
        }),
        catchError((e) => {
          return throwError(e);
        })
      )
      .subscribe((res) => {
        this.searchResults = res;
      });
  }

  addGroup() {
    this.groupSubmitDisabled = true;
    this.hideErrors();
    this.apiService.postData("groups", this.groupData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.label] = val.message;
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
        this.response = res;
        this.hasSuccess = true;
        this.groupSubmitDisabled = false;
        this.fetchGroups();
        this.toastr.success("Group added successfully");
        $("#addDriverGroupModal").modal("hide");
        this.groupData = {
          groupType: "drivers",
          groupName: "",
          groupMembers: "",
          description: "",
        };
      },
    });
  }

  async newGeoCode(data: any) {
    let result = await this.apiService
      .getData(`pcMiles/geocoding/${encodeURIComponent(JSON.stringify(data))}`)
      .toPromise();

    if (result.items != undefined && result.items.length > 0) {
      return result.items[0].position;
    }
  }

  async changeCompany(value) {
    if (value === "company") {
      this.driverData.corporation = null;
      this.driverData.ownerOperator = null;
      this.listService.fetchVendors();
      let vendorList = new Array<any>();
      this.getValidVendors(vendorList);
      this.vendors = vendorList;
    } else if (value === "corporation") {
      this.driverData.vendor = null;
      this.driverData.ownerOperator = null;
    } else {
      this.driverData.vendor = null;
      this.driverData.corporation = null;
      this.listService.fetchOwnerOperators();
      let opList = new Array<any>();
      this.getValidOperators(opList);
      this.ownerOperators = opList;
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

        if (element2.isDeleted === 1 && element2.contactID === this.driverData.vendor) {
          this.driverData.vendor = null;
        }
      })
    })
  }

  private getValidOperators(operatorList: any[]) {
    let ids = [];
    this.listService.ownerOperatorList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
          operatorList.push(element2);
          ids.push(element2.contactID);
        }

        if (element2.isDeleted === 1 && element2.contactID === this.driverData.ownerOperator) {
          this.driverData.ownerOperator = null;
        }
      })
    })
  }

  async onAddDriver() {
    if (this.abstractDocs.length > 0) {
      this.hasError = false;
      this.hasSuccess = false;
      this.hideErrors();
      this.driverData.createdDate = this.driverData.createdDate;
      this.driverData.createdTime = this.driverData.createdTime;
      this.driverData[`deletedUploads`] = this.deletedUploads;
      for (let d = 0; d < this.driverData.documentDetails.length; d++) {
        const element = this.driverData.documentDetails[d];
        delete element.docStates;
      }

      for (let i = 0; i < this.driverData.address.length; i++) {
        const element = this.driverData.address[i];
        delete element.states;
        delete element.cities;

        if (element.manual === true) {
          let data = {
            address1: element.address1,
            address2: element.address2,
            cityName: element.cityName,
            stateName: element.stateName,
            countryName: element.countryName,
            zipCode: element.zipCode,
          };

          $("#addErr" + i).css("display", "none");
          let result = await this.newGeoCode(data);

          if (result == null) {
            $("#addErr" + i).css("display", "block");
            return false;
          }
          if (result != undefined || result != null) {
            element.geoCords = result;
          }
        } else {
          $("#addErr" + i).css("display", "none");
          if (element.isSuggest != true && element.userLocation !== "") {
            $("#addErr" + i).css("display", "block");
            return;
          }
        }
      }

      // create form data instance
      const formData = new FormData();
      // append photos if any
      for (let i = 0; i < this.uploadedPhotos.length; i++) {
        formData.append("uploadedPhotos", this.uploadedPhotos[i]);
      }

      // append docs if any
      for (let j = 0; j < this.uploadedDocs.length; j++) {
        if (this.uploadedDocs[j] !== undefined) {
          for (let k = 0; k < this.uploadedDocs[j].length; k++) {
            let file = this.uploadedDocs[j][k];
            formData.append(`uploadedDocs-${j}`, file);
          }
        }
      }

      // append abstact history docs if any
      for (let k = 0; k < this.abstractDocs.length; k++) {
        formData.append("abstractDocs", this.abstractDocs[k]);
      }

      // append other fields
      formData.append("data", JSON.stringify(this.driverData));

      this.submitDisabled = true;
      try {
        this.apiService.postData("drivers", formData, true).subscribe({
          complete: () => { },
          error: (err: any) => {
            from(err.error)
              .pipe(
                map((val: any) => {
                  // val.message = val.message.replace(/".*"/, 'This Field');
                  this.errors[val.context.key] = val.message;
                  this.spinner.hide();
                })
              )
              .subscribe({
                complete: () => {
                  this.throwErrors();
                  this.hasError = true;
                  this.submitDisabled = false;
                },
                error: () => {
                  this.submitDisabled = false;
                },
                next: () => { },
              });
          },
          next: (res) => {
            // this.response = res;
            // this.hasSuccess = true;
            this.submitDisabled = false;
            this.toastr.success("Driver added successfully");
            this.isSubmitted = true;
            this.modalServiceOwn.triggerRedirect.next(true);
            this.takeUntil$.next();
            this.takeUntil$.complete();
            this.spinner.hide();
            this.router.navigateByUrl("/fleet/drivers/list");
          },
        });
      } catch (error) {
        this.submitDisabled = false;
        return "error found";
      }
    } else {
      this.errorAbstract = true;
      this.toastr.error("Abstract history document is required.");
    }
  }

  async userAddress(i, item) {
    this.driverData.address[i].userLocation = item.address;
    let result = await this.getAddressDetail(item.place_id);
    if (result != undefined) {
      this.driverData.address[i].zipCode = result.address.Zip;

      this.driverData.address[i].geoCords.lat = result.position.lat;
      this.driverData.address[i].geoCords.lng = result.position.lng;
      this.driverData.address[i].countryName = result.address.CountryFullName;
      $("div").removeClass("show-search__result");

      this.driverData.address[i].stateName = result.address.StateName;
      this.driverData.address[i].cityName = result.address.City;

      this.driverData.address[i].address1 = result.address.StreetAddress
        ? result.address.StreetAddress
        : "";
      this.driverData.address[i].isSuggest = true;
    }
  }

  async getAddressDetail(id) {
    let result = await this.apiService
      .getData(`pcMiles/detail/${id}`)
      .toPromise();
    return result;
  }

  remove(obj, i, addressID = null) {
    if (obj === "address") {
      this.driverData.address.splice(i, 1);
    } else {
      this.driverData.documentDetails.splice(i, 1);
    }
  }

  throwErrors() {
    from(Object.keys(this.errors)).subscribe((v) => {
      if (
        v === "userName" ||
        v === "email" ||
        v === "employeeContractorId" ||
        v === "CDL_Number" ||
        v === "SIN"
      ) {
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
      if (v === "abstractDocs") {
        $('[name="' + v + '"]').after(
          '<label class="text-danger"> Abstract history document is mandatory.</label>'
        );
      }
      if (v === "cognito") {
        this.toastr.error(this.errors[v]);
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

  addDocument() {
    this.driverData.documentDetails.push({
      documentType: "",
      document: "",
      issuingAuthority: "",
      issuingCountry: "",
      issuingState: "",
      issueDate: "",
      expiryDate: "",
      uploadedDocs: [],
      docStates: [],
    });
  }

  deleteInput(i: number) {
    this.driverData.documentDetails.splice(i, 1);
  }
  /**
   * fetch driver data
   */
  async fetchDriverByID() {
    this.isEdit = true;
    let result = await this.apiService
      .getData(`drivers/${this.driverID}`)
      .toPromise();
    // .subscribe(async (result: any) => {
    result = result.Items[0];
    this.fetchLicStates(result.licenceDetails.issuedCountry);
    this.driverData.address = result.address;
    if (result.address !== undefined) {
      for (let a = 0; a < this.driverData.address.length; a++) {
        if (this.driverData.address[a].manual) {
          this.driverData.address[a].isSuggest = false;
        } else {
          this.driverData.address[a].isSuggest = true;
        }
        const countryCode = this.driverData.address[a].countryCode;
        const stateCode = this.driverData.address[a].stateCode;
        this.fetchStates(countryCode, a);
        if (countryCode !== '' && countryCode !== null && stateCode !== '' && stateCode !== null) {
          this.fetchCities(countryCode, stateCode, a);
        }
      }
    }
    if (result.corporationType === "owner_operator") {
      // this.listService.fetchOwnerOperators();
      // this.ownerOperators = this.listService.ownerOperatorList;

      this.listService.fetchOwnerOperators();
      let opList = new Array<any>();
      this.getValidOperators(opList);
      this.ownerOperators = opList;

    }
    if (result.corporationType === "company") {
      this.listService.fetchVendors();
      // this.vendors = this.listService.vendorList;
      let vendorList = new Array<any>();
      this.getValidVendors(vendorList);
      this.vendors = vendorList;
    }
    this.driverData.driverType = result.driverType;
    this.driverData.employeeContractorId = result.employeeContractorId;
    this.driverData.corporationType = result.corporationType;
    this.driverData.vendor = result.vendor;
    this.driverData.corporation = result.corporation;

    this.driverData.ownerOperator = result.ownerOperator;
    this.driverData.driverStatus = result.driverStatus;
    this.driverData.userName = result.userName;
    this.driverData.firstName = result.firstName;
    this.driverData.lastName = result.lastName;
    this.driverData.DOB = _.isEmpty(result.DOB) ? null : result.DOB;
    this.driverData.startDate = _.isEmpty(result.startDate)
      ? null
      : result.startDate;
    this.driverData.terminationDate = _.isEmpty(result.terminationDate)
      ? null
      : result.terminationDate;
    this.driverData.contractStart = _.isEmpty(result.contractStart)
      ? null
      : result.contractStart;
    this.driverData.contractEnd = _.isEmpty(result.contractEnd)
      ? null
      : result.contractEnd;
    this.driverData.crossBorderDetails.fastExpiry = _.isEmpty(
      result.crossBorderDetails.fastExpiry
    )
      ? null
      : result.crossBorderDetails.fastExpiry;
    this.driverData.licenceDetails.licenceExpiry = _.isEmpty(
      result.licenceDetails.licenceExpiry
    )
      ? null
      : result.licenceDetails.licenceExpiry;
    this.driverData.citizenship = result.citizenship;
    this.driverData.assignedVehicle = result.assignedVehicle;
    this.driverData.groupID = result.groupID;
    this.driverData.createdDate = result.createdDate;
    this.driverData.createdTime = result.createdTime;
    this.driverData.driverImage = result.driverImage;
    if (result.driverImage !== "" && result.driverImage !== undefined) {
      this.driverProfileSrc = `${this.Asseturl}/${result.carrierID}/${result.driverImage}`;
      this.imageTitle = "Change";
    } else {
      this.driverProfileSrc = "";
      this.imageTitle = "Add";
    }
    this.driverData[`abstractDocs`] = [];
    if (result.abstractDocs !== undefined && result.abstractDocs.length > 0) {
      this.driverData[`abstractDocs`] = result.abstractDocs;
      this.absDocs = result.abstractDocs.map((x: any) => ({
        path: `${this.Asseturl}/${result.carrierID}/${x}`,
        name: x,
      }));
    }
    this.driverData.gender = result.gender;
    this.driverData.DOB = result.DOB;
    this.driverData.email = result.email;
    this.driverData.phone = result.phone;
    for (let i = 0; i < result.documentDetails.length; i++) {
      let docmnt = [];
      if (
        result.documentDetails[i].uploadedDocs !== undefined &&
        result.documentDetails[i].uploadedDocs.length > 0
      ) {
        docmnt = result.documentDetails[i].uploadedDocs;
      }
      this.newDocuments.push({
        documentType: result.documentDetails[i].documentType,
        document: result.documentDetails[i].document,
        issuingAuthority: result.documentDetails[i].issuingAuthority,
        issuingCountry: result.documentDetails[i].issuingCountry,
        issuingState: result.documentDetails[i].issuingState,
        issueDate: result.documentDetails[i].issueDate,
        expiryDate: result.documentDetails[i].expiryDate,
        uploadedDocs: docmnt,
      });
      if (
        result.documentDetails[i].uploadedDocs !== undefined &&
        result.documentDetails[i].uploadedDocs.length > 0
      ) {
        this.assetsDocs[i] = result.documentDetails[i].uploadedDocs.map(
          (x) => ({
            path: `${this.Asseturl}/${result.carrierID}/${x}`,
            name: x,
          })
        );
      }
    }
    this.driverData.documentDetails = this.newDocuments;
    this.fetchDocStates(this.newDocuments);
    this.driverData.crossBorderDetails.ACI_ID =
      result.crossBorderDetails.ACI_ID;
    this.driverData.crossBorderDetails.ACE_ID =
      result.crossBorderDetails.ACE_ID;
    this.driverData.crossBorderDetails.fast_ID =
      result.crossBorderDetails.fast_ID;
    this.driverData.crossBorderDetails.fastExpiry =
      result.crossBorderDetails.fastExpiry;
    this.driverData.crossBorderDetails.csa = result.crossBorderDetails.csa;
    this.driverData.paymentDetails.paymentType =
      result.paymentDetails.paymentType;
    this.driverData.paymentDetails.loadedMiles =
      result.paymentDetails.loadedMiles;
    this.driverData.paymentDetails.loadedMilesUnit =
      result.paymentDetails.loadedMilesUnit;
    this.driverData.paymentDetails.loadedMilesTeam =
      result.paymentDetails.loadedMilesTeam;
    this.driverData.paymentDetails.loadedMilesTeamUnit =
      result.paymentDetails.loadedMilesTeamUnit;

    this.driverData.paymentDetails.emptyMiles =
      result.paymentDetails.emptyMiles;
    this.driverData.paymentDetails.emptyMilesUnit =
      result.paymentDetails.emptyMilesUnit;
    this.driverData.paymentDetails.emptyMilesTeam =
      result.paymentDetails.emptyMilesTeam;
    this.driverData.paymentDetails.emptyMilesTeamUnit =
      result.paymentDetails.emptyMilesTeamUnit;
    this.driverData.paymentDetails.loadPayPercentage =
      result.paymentDetails.loadPayPercentage;
    this.driverData.paymentDetails.loadPayPercentageOf =
      result.paymentDetails.loadPayPercentageOf;
    this.driverData.paymentDetails.rate = result.paymentDetails.rate;
    this.driverData.paymentDetails.rateUnit = result.paymentDetails.rateUnit;
    this.driverData.paymentDetails.waitingPay =
      result.paymentDetails.waitingPay;
    this.driverData.paymentDetails.waitingPayUnit =
      result.paymentDetails.waitingPayUnit;
    this.driverData.paymentDetails.waitingHourAfter =
      result.paymentDetails.waitingHourAfter;

    this.driverData.paymentDetails.deliveryRate =
      result.paymentDetails.deliveryRate;
    this.driverData.paymentDetails.deliveryRateUnit =
      result.paymentDetails.deliveryRateUnit;

    this.driverData.SIN = result.SIN;
    this.driverData.paymentDetails.payPeriod = result.paymentDetails.payPeriod;
    this.driverData.CDL_Number = result.CDL_Number;
    this.driverData.licenceDetails.issuedCountry =
      result.licenceDetails.issuedCountry;
    this.driverData.licenceDetails.issuedState =
      result.licenceDetails.issuedState;
    this.driverData.licenceDetails.licCntryName =
      result.licenceDetails.licCntryName;
    this.driverData.licenceDetails.licStateName =
      result.licenceDetails.licStateName;
    this.driverData.licenceDetails.licenceExpiry =
      result.licenceDetails.licenceExpiry;
    this.driverData.licenceDetails.licenceNotification =
      result.licenceDetails.licenceNotification;
    this.driverData.licenceDetails.WCB = result.licenceDetails.WCB;
    this.driverData.licenceDetails.medicalCardRenewal =
      result.licenceDetails.medicalCardRenewal;
    this.driverData.licenceDetails.healthCare =
      result.licenceDetails.healthCare;

    this.driverData.licenceDetails.vehicleType =
      result.licenceDetails.vehicleType;

    this.driverData.hosDetails.hosStatus = result.hosDetails.hosStatus;
    this.driverData.hosDetails.type = result.hosDetails.type;
    this.driverData.hosDetails.hosRemarks = result.hosDetails.hosRemarks;
    this.driverData.hosDetails.hosCycleName = result.hosDetails.hosCycleName;
    this.driverData.hosDetails.homeTerminal =
      result.hosDetails.homeTerminal.addressID;
    this.driverData.hosDetails.pcAllowed = result.hosDetails.pcAllowed;
    this.driverData.hosDetails.ymAllowed = result.hosDetails.ymAllowed;
    this.driverData.hosDetails.timezone = result.hosDetails.timezone;
    this.driverData.hosDetails.optZone = result.hosDetails.optZone;

    this.driverData.emergencyDetails.name = result.emergencyDetails.name;
    this.driverData.emergencyDetails.relationship =
      result.emergencyDetails.relationship;
    this.driverData.emergencyDetails.phone = result.emergencyDetails.phone;
    this.driverData[`timeCreated`] = result.timeCreated;

    // });
  }
  async onUpdateDriver() {
    if (this.abstractDocs.length > 0 || this.absDocs.length > 0) {
      this.hasError = false;
      this.hasSuccess = false;
      this.hideErrors();
      this.driverData[`driverID`] = this.driverID;
      this.driverData.createdDate = this.driverData.createdDate;
      this.driverData.createdTime = this.driverData.createdTime;
      this.driverData[`deletedUploads`] = this.deletedUploads;
      for (let d = 0; d < this.driverData.documentDetails.length; d++) {
        const element = this.driverData.documentDetails[d];
        delete element.docStates;
      }
      for (let i = 0; i < this.driverData.address.length; i++) {
        const element = this.driverData.address[i];
        delete element.states;
        delete element.cities;

        if (element.manual === true) {
          let data = {
            address1: element.address1,
            address2: element.address2,
            cityName: element.cityName,
            stateName: element.stateName,
            countryName: element.countryName,
            zipCode: element.zipCode,
          };

          $("#addErr" + i).css("display", "none");
          let result = await this.newGeoCode(data);

          if (result == null) {
            $("#addErr" + i).css("display", "block");
            return false;
          }
          if (result != undefined || result != null) {
            element.geoCords = result;
          }
        } else {
          $("#addErr" + i).css("display", "none");
          if (element.isSuggest != true && element.userLocation !== "") {
            $("#addErr" + i).css("display", "block");
            return;
          }
        }
      }

      // create form data instance
      const formData = new FormData();
      // append photos if any
      for (let i = 0; i < this.uploadedPhotos.length; i++) {
        formData.append("uploadedPhotos", this.uploadedPhotos[i]);
      }

      for (let j = 0; j < this.uploadedDocs.length; j++) {
        if (this.uploadedDocs[j] !== undefined) {
          for (let k = 0; k < this.uploadedDocs[j].length; k++) {
            let file = this.uploadedDocs[j][k];
            formData.append(`uploadedDocs-${j}`, file);
          }
        }
      }

      // append abstact history docs if any
      for (let k = 0; k < this.abstractDocs.length; k++) {
        formData.append("abstractDocs", this.abstractDocs[k]);
      }

      // append other fields
      formData.append("data", JSON.stringify(this.driverData));
      this.submitDisabled = true;
      try {
        this.apiService.putData("drivers", formData, true).subscribe({
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
                  this.hasError = false;
                  this.submitDisabled = false;

                  // this.toastr.error('Please see the errors');
                },
                error: () => {
                  this.submitDisabled = false;
                },
                next: () => {
                  this.submitDisabled = false;
                },
              });
          },
          next: (res) => {
            this.response = res;
            this.hasSuccess = true;
            this.isSubmitted = true;
            this.submitDisabled = false;
            this.toastr.success("Driver updated successfully");
            this.cancel();
          },
        });
      } catch (error) {
        this.submitDisabled = false;
      }
    } else {
      this.errorAbstract = true;
      this.toastr.error("Abstract history document is required.");
    }
  }

  changePaymentModeForm(value) {
    if (value === "Pay Per Mile") {
      delete this.driverData.paymentDetails.loadPayPercentage;
      delete this.driverData.paymentDetails.loadPayPercentageOf;
      delete this.driverData.paymentDetails.rate;
      delete this.driverData.paymentDetails.rateUnit;
      delete this.driverData.paymentDetails.waitingPay;
      delete this.driverData.paymentDetails.waitingPayUnit;
      delete this.driverData.paymentDetails.waitingHourAfter;
      delete this.driverData.paymentDetails.deliveryRate;
      delete this.driverData.paymentDetails.deliveryRateUnit;
    } else if (value === "Percentage") {
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
    } else if (value === "Pay Per Hour") {
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
  changeCurrency(currency: any) {
    this.driverData.paymentDetails.rateUnit = currency;
    this.driverData.paymentDetails.deliveryRateUnit = currency;
    this.driverData.paymentDetails.loadedMilesUnit = currency;
    this.driverData.paymentDetails.emptyMilesUnit = currency;
    this.driverData.paymentDetails.loadedMilesTeamUnit = currency;
    this.driverData.paymentDetails.emptyMilesTeamUnit = currency;
    this.driverData.paymentDetails.waitingPayUnit = currency;
  }
  concatArray(path) {
    this.concatArrayKeys = "";
    for (const i in path) {
      this.concatArrayKeys += path[i] + ".";
    }
    this.concatArrayKeys = this.concatArrayKeys.substring(
      0,
      this.concatArrayKeys.length - 1
    );
    return this.concatArrayKeys;
  }

  ngOnDestroy(): void {
    this.takeUntil$.next();
    this.takeUntil$.complete();
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
  // Show password
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  togglecpwdfieldTextType() {
    this.cpwdfieldTextType = !this.cpwdfieldTextType;
  }
  // delete uploaded images and documents
  delete(type: string, name: string, index: any, dIndex: any) {
    if (type === "doc") {
      this.driverData.documentDetails[index].uploadedDocs.splice(dIndex, 1);
      this.assetsDocs[index].splice(dIndex, 1);
      this.deletedUploads.push(name);
    } else if (type === "profile") {
      this.driverProfileSrc = "";
      this.uploadedPhotos = [];
      this.driverData.driverImage = "";
      this.deletedUploads.push(name);
      this.imageTitle = "Add";
      $("#driverProfileModal").modal("hide");
    } else if (type === "uploaded") {
      this.uploadedPic = "";
      this.driverProfileSrc = "";
      this.showUploadedPicModal = false;
      this.uploadedPhotos = [];
      // this.driverData.driverImage = '';
      this.deletedUploads.push(this.driverData.driverImage);
      $("#driverPicUploadedModal").modal("hide");
      this.imageTitle = "Add";
    } else {
      this.absDocs.splice(index, 1);
      this.driverData.abstractDocs.splice(index, 1);
      this.deletedUploads.push(name);
    }
    // this.apiService.deleteData(`drivers/uploadDelete/${name}`).subscribe((result: any) => {});
  }
  localDelete(type: string, name: string, index: any, dIndex: any) {
    if (type === "doc") {
      this.driverData.documentDetails[index].uploadedDocs.splice(dIndex, 1);
      this.assetsDocs[index].splice(index, 1);
    } else {
      this.localAbsDocs.splice(index, 1);
      this.abstractDocs.splice(index, 1);
    }
  }
  complianceChange(value) {
    if (value === "non_Exempted") {
      this.driverData.hosDetails.type = "ELD";
    } else {
      this.driverData.hosDetails.type = "Log Book";
      this.driverData.hosDetails.hosCycleName = "";
    }
  }

  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.currentUserCarrier = this.currentUser.carrierID;
    this.carrierID = this.currentUser.carrierID;

    if (this.currentUser.userType === "Cloud Admin") {
      let isCarrierID = localStorage.getItem("carrierID");
      if (isCarrierID !== undefined) {
        this.currentUserCarrier = isCarrierID;
      }
    }

    this.apiService
      .getData(`carriers/${this.currentUserCarrier}`)
      .subscribe((result) => {
        if (result.Items[0].addressDetails !== undefined) {
          result.Items[0].addressDetails.map((e) => {
            if (e.addressType === "yard") {
              this.carrierYards.push(e);
            }
          });
        }

        for (let a = 0; a < this.carrierYards.length; a++) {
          this.carrierYards.map(async (e: any) => {
            if (e.manual) {
              e.countryName = await this.countryStateCity.GetSpecificCountryNameByCode(
                e.countryCode
              );
              e.stateName = await this.countryStateCity.GetStateNameFromCode(
                e.stateCode,
                e.countryCode
              );
            }
          });
        }
      });
  };

  closeGroupModal() {
    this.groupData = {
      groupType: "drivers",
      groupName: "",
      groupMembers: "",
      description: "",
    };

    $("#addDriverGroupModal").modal("hide");
  }
  validatePassword(password) {
    let passwordVerify = passwordStrength(password);
    if (passwordVerify.contains.includes("lowercase")) {
      this.passwordValidation.lowerCase = true;
    } else {
      this.passwordValidation.lowerCase = false;
    }

    if (passwordVerify.contains.includes("uppercase")) {
      this.passwordValidation.upperCase = true;
    } else {
      this.passwordValidation.upperCase = false;
    }
    if (passwordVerify.contains.includes("symbol")) {
      this.passwordValidation.specialCharacters = true;
    } else {
      this.passwordValidation.specialCharacters = false;
    }
    if (passwordVerify.contains.includes("number")) {
      this.passwordValidation.number = true;
    } else {
      this.passwordValidation.number = false;
    }
    if (passwordVerify.length >= 8) {
      this.passwordValidation.length = true;
    } else {
      this.passwordValidation.length = false;
    }
    if (password.includes(".") || password.includes("-")) {
      this.passwordValidation.specialCharacters = true;
    }
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem("isOpen", "true");
    this.listService.changeButton(false);
  }

  validateUserName() {
    this.hideVal();
    if (this.driverData.userName !== '') {
      this.driverData.userName = this.driverData.userName.trim();
      this.apiService.getData(`drivers/validate/username?value=${this.driverData.userName}&type=${this.pageType}`)
        .subscribe((result: any) => {
          if (!result) {
            this.errors[`userName`] = 'Username already exists';
            this.submitDisabled = true;
          } else {
            this.onChangeHideErrors('userName');
            delete this.errors[`userName`];
          }
          this.throwErrors();
        });
    }

  }

  validateEmployeeID() {
    this.hideVal();
    if (this.driverData.employeeContractorId !== '') {
      this.driverData.employeeContractorId = this.driverData.employeeContractorId.trim();
      this.apiService.getData(`drivers/validate/employee-id?value=${this.driverData.employeeContractorId}&type=${this.pageType}`)
        .subscribe((result: any) => {
          if (!result) {
            this.errors[`employeeContractorId`] = 'Employee ID already exists';
            this.submitDisabled = true;
          } else {
            this.onChangeHideErrors('employeeContractorId');
            delete this.errors[`employeeContractorId`];
          }
          this.throwErrors();
        });
    }
  }
  
  validateCDL() {
    this.hideVal();
    if (this.driverData.CDL_Number !== '') {
      this.driverData.CDL_Number = this.driverData.CDL_Number.trim();
      this.apiService.getData(`drivers/validate/cdl?value=${this.driverData.CDL_Number}&type=${this.pageType}&drv=${this.driverID}`)
        .subscribe((result: any) => {
          if (!result) {
            this.errors[`CDL_Number`] = 'CDL already exists';
            this.submitDisabled = true;
          } else {
            this.onChangeHideErrors('CDL_Number');
            delete this.errors[`CDL_Number`];
          }
          this.throwErrors();
        });
    }

  }

  validateEmail() {
    this.hideVal();
    if (this.driverData.email !== '') {
      this.driverData.email = this.driverData.email.trim();
      this.apiService.getData(`drivers/validate/email?value=${this.driverData.email}&type=${this.pageType}&drv=${this.driverData.userName}`)
        .subscribe((result: any) => {
          if (!result) {
            this.errors[`email`] = 'Email already exists';
            this.submitDisabled = true;
          } else {
            this.onChangeHideErrors('email');
            delete this.errors[`email`];
          }
          this.throwErrors();
        });
    }
  }

  hideVal() {
    this.onChangeHideErrors('employeeContractorId');
    this.onChangeHideErrors('userName');
    this.onChangeHideErrors('CDL_Number');
    this.onChangeHideErrors('email');
    this.submitDisabled = false;
  }
}
