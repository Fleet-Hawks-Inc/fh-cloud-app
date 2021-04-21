import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {from, Subject, throwError } from 'rxjs';
import { ApiService, ListService } from '../../../../services';
import { Auth } from 'aws-amplify';
import { HereMapService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import {map, debounceTime, distinctUntilChanged, switchMap, catchError, takeUntil} from 'rxjs/operators';
import {NgbCalendar, NgbDateAdapter, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { CanComponentDeactivate } from 'src/app/guards/unsaved-changes.guard';
import { NgForm } from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { UnsavedChangesComponent } from 'src/app/unsaved-changes/unsaved-changes.component';
import {ModalService} from '../../../../services/modal.service';
import Constants from '../../constants';

declare var $: any;

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css'],
})
export class AddDriverComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  @ViewChild('driverForm',null) driverForm: NgForm;
  takeUntil$ = new Subject();
  Asseturl = this.apiService.AssetUrl;
  // driverSession = JSON.parse(localStorage.getItem('driver'));
  pageTitle: string;
  lastElement;
  hideNextBtn = true;
  hasBasic: boolean = false;
  hasDocs: boolean = false;
  hasLic: boolean = false;
  hasPay: boolean = false;
  hasHos: boolean = false;
  hasCrossBrdr: boolean = false;

  addressField = -1;
  currentTab = 1;
  userLocation: any;
  public driverID;
  public driverProfileSrc: any = 'assets/img/driver/driver.png';
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  errors = {};
  form;
  concatArrayKeys = '';
  manualAddress = false;
  nextTab: any;
  carrierID: any;

  statesObject: any;
  countriesObject: any;
  citiesObject: any;

  allDrivers: any;

  groupData = {
    groupType : 'drivers', // it can be users,vehicles,assets,drivers
    groupName: '',
    groupMembers: '',
    description: '',
  };

  driverAddress = {
    address: [],
  };
  isEdit: boolean = false;
  driverData = {
    employeeContractorId: '',
    driverType: 'employee',
    entityType: Constants.DRIVER,
    gender: 'M',
    DOB: '',
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
    workPhone: '',
    email: '',
    currentTab: null, // for send data on last tab
    address: [{
      addressID: '',
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
      manual: false,
      userLocation: ''
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
      utcOffset: '',
      type: '',
      hosRemarks: '',
      hosCycle: '',
      homeTerminal: '',
      pcAllowed: false,
      ymAllowed: false,
      hosCycleName:'',
      optZone: 'South (Canada)'
    },
    emergencyDetails: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
      emergencyAddress: '',
    },
  };
  public searchTerm = new Subject<string>();
  public searchResults: any;

  currentUserCarrier: string;
  newDocuments = [];
  newAddress = [];
  /**
   * Form Props
   */
  userType = 'driver'; //default
  userName = '';
  password = '';
  firstName = '';
  lastName = '';
  address = '';
  phone = '';
  email = '';
  groupID = '';
  loginEnabled = true;
  driverNumber = '';
  driverLicenseNumber = '';
  driverLicenseType = '';
  driverLicenseExpiry = '';
  driverLicenseStateID = '';
  HOSCompliance = {
    status: '',
    type: '',
    cycleID: '',
  };
  defaultContract = {
    perMile: '',
    team: '',
    hourly: '',
    pickOrDrop: '',
  };
  fixed = {
    amount: '',
    type: '',
  };
  yardID = '';

  documentTypeList: any = [];
  driverLicenseCountry = '';
  groups = [];
  countries = [];
  vehicles: any;
  states = [];

  cities = [];
  yards = [];
  cycles = [];
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  visibleIndex = 0;
  getcurrentDate: any;
  birthDateMinLimit: any;
  futureDatesLimit: any;
  uploadedPhotos = [];

  uploadedDocs = [];
  abstractDocs = [];
  existingPhotos = [];
  existingDocs = [];
  assetsImages = []
  assetsDocs = [];
  absDocs = [];
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');
  isSubmitted = false;
  showIcons = false;
  profileTitle = 'Add';
  addressCountries = [];
  carrierYards: any = [];
  deletedAddress = [];
  ownerOperators: any;
  abstractValid = false;
  prefixOutput: string;
  finalPrefix = '';
  currentUser: any;
  modelID = '';
  empPrefix: any;

  constructor(private apiService: ApiService,
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
              private listService: ListService
              ) {
    this.modalServiceOwn.triggerRedirect.next(false);

    this.router.events
      .pipe(takeUntil(this.takeUntil$))
      .subscribe((v: any) => {
        if ((v.url !== 'undefined' || v.url !== '')) {
          this.modalServiceOwn.setUrlToNavigate(v.url);
        }
      });
    this.modalServiceOwn.triggerRedirect$
      .pipe(takeUntil(this.takeUntil$))
      .subscribe((v) => {
        if (v) {
          this.router.navigateByUrl(this.modalServiceOwn.urlToRedirect.getValue());
      }
    })

    this.selectedFileNames = new Map<any, any>();
    const date = new Date();
    this.getcurrentDate = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.birthDateMinLimit = {year: date.getFullYear() - 60, month: date.getMonth() + 1, day: date.getDate()};
    this.futureDatesLimit = {year: date.getFullYear() + 30, month: date.getMonth() + 1, day: date.getDate()};

    }

    /**
     * Unsaved Changes
     */
    canLeave(): boolean {
      if (this.driverForm.dirty && !this.isSubmitted) {
        if (!this.modalService.hasOpenModals()) {
          this.modalService.open(UnsavedChangesComponent, { size: 'sm' });
        }
        return false;
      }
      this.modalServiceOwn.triggerRedirect.next(true);
      this.takeUntil$.next();
      this.takeUntil$.complete();
      return true;
    }

    onChangeHideErrors(fieldname = '') {
      $('[name="' + fieldname + '"]')
        .removeClass('error')
        .next()
        .remove('label');
    }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  async ngOnInit() {
    this.listService.fetchVehicles();
    this.listService.fetchOwnerOperators();
    this.driverID = this.route.snapshot.params[`driverID`];
    if (this.driverID) {
      this.pageTitle = 'Edit Driver';
      this.fetchDriverByID();
    } else {
      this.pageTitle = 'Add Driver';
    }
    this.fetchGroups(); // fetch groups
    this.fetchCountries(); // fetch countries

    this.fetchYards(); // fetch yards
    this.fetchCycles(); // fetch cycles
    this.fetchDrivers();
    this.getToday(); // get today date on calender
    this.searchLocation(); // search location on keyup

    this.fetchAllCountriesIDs(); // fetch all countries Ids with name
    this.fetchAllStatesIDs(); // fetch all states Ids with name
    this.fetchAllCitiesIDs(); // fetch all cities Ids with name

    this.fetchDocuments();
    await this.getCurrentuser();

    $(document).ready(() => {
      this.form = $('#driverForm, #groupForm').validate();
    });

    for (let i = 0; i < this.driverData.documentDetails.length; i++) {
      const element = this.driverData.documentDetails[i];
      await this.getStates(element.issuingCountry)
    }

    this.vehicles = this.listService.vehicleList;
    this.ownerOperators = this.listService.ownerOperatorList;
  }

  async getCarrierDetails(id: string) {
    this.spinner.show();
    this.apiService.getData('carriers/'+ id).subscribe(res => {
      if(res.Items.length > 0){
        let carrierPrefix = res.Items[0].businessName;
        let toArray = carrierPrefix.match(/\b(\w)/g);
        this.prefixOutput = toArray.join('') + '-';
      }
      this.spinner.hide();
    })
  }

  validateTabErrors(){
    if($('#addDriverBasic .error').length > 0 && this.currentTab >= 1) {
      this.hasBasic = true;
    } else {
      this.hasBasic = false;
    }
    if($('#documents .error').length > 0 && this.currentTab >= 3) {
      this.hasDocs = true;
    } else {
      this.hasDocs = false;
    }
    if($('#addDriverCrossBorder .error').length > 0 && this.currentTab >= 4) {
      this.hasCrossBrdr = true;
    } else {
      this.hasCrossBrdr = false;
    }

    if($('#licence .error').length > 0 && this.currentTab >= 5) {
      this.hasLic = true;
    } else {
      this.hasLic = false;
    }
    if($('#payment .error').length > 0 && this.currentTab >= 6) {
      this.hasPay = true;
    } else {
      this.hasPay = false;
    }
    if($('#Driverhos .error').length > 0 && this.currentTab >= 7) {
      this.hasHos = true;
    } else {
      this.hasHos = false;
    }
  }

  async nextStep() {

    if(!this.driverID){
      await this.onSubmit();
      if(this.abstractDocs.length == 0 && this.currentTab == 1) {
        this.abstractValid = true;
        return;
      }
    }else {
      if(this.absDocs.length == 0) {
        this.abstractValid = true;
      }
      await this.updateDriver();
    }

    this.validateTabErrors();
    if($('#addDriverBasic .error').length > 0 && this.currentTab == 1) return;
    if($('#addDriverAddress .error').length > 0 && this.currentTab == 2) return;
    if($('#documents .error').length > 0 && this.currentTab == 3) return;
    if($('#addDriverCrossBorder .error').length > 0 && this.currentTab == 4) return;
    if($('#licence .error').length > 0 && this.currentTab == 5) return;
    if($('#payment .error').length > 0 && this.currentTab == 6) return;
    if($('#Driverhos .error').length > 0 && this.currentTab == 7) return;
    if($('#emergency .error').length > 0 && this.currentTab == 8) return;

    this.currentTab++;

  }
  prevStep() {
    this.currentTab--;
    if(this.driverID) return;
  }
  async tabChange(value) {
    this.currentTab = value;
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  gotoVehiclePage() {
    $('#addVehicleModelDriver').modal('show');
  }


  clearUserLocation(i) {
    this.driverData.address[i]['userLocation'] = '';
    $('div').removeClass('show-search__result');
  }
  manAddress(event, i) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
      this.driverData.address[i]['userLocation'] = '';
      this.driverData.address[i].zipCode = '';
    } else {
      $(event.target).closest('.address-item').removeClass('open');
      this.driverData.address[i].countryID = '';
      this.driverData.address[i].countryName = '';
      this.driverData.address[i].stateID = '';
      this.driverData.address[i].stateName = '';
      this.driverData.address[i].cityID = '';
      this.driverData.address[i].cityName = '';
      this.driverData.address[i].zipCode = '';
      this.driverData.address[i].address1 = '';
      this.driverData.address[i].address2 = '';
      this.driverData.address[i].geoCords.lat = '';
      this.driverData.address[i].geoCords.lng = '';
    }
  }

  onChangeUnitType(value: any) {
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
  }

  addAddress() {
    this.driverData.address.push({
      addressID: '',
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
      manual: false,
      userLocation: ''
    });
    console.log('driverData.address', this.driverData.address);
  }

  fetchCycles() {
    this.apiService.getData('cycles')
      .subscribe((result: any) => {
        this.cycles = result.Items;
      });
  }
  fetchGroups() {
    this.apiService.getData(`groups/getGroup/${this.groupData.groupType}`).subscribe((result: any) => {
      this.groups = result.Items;
    });
  }

  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
        this.countries.map(elem => {
          if (elem.countryName == 'Canada' || elem.countryName == 'United States of America') {
            this.addressCountries.push({countryName: elem.countryName, countryID: elem.countryID})
          }
        });
      });
  }


  fetchCountryByID(id: any) {
    this.apiService.getData('countries' + id)
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  fetchYards() {
    this.apiService.getData('yards')
      .subscribe((result: any) => {
        this.yards = result.Items;
      });
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

  fetchAllCitiesIDs() {
    this.apiService.getData('cities/get/list')
      .subscribe((result: any) => {
        this.citiesObject = result;
      });
  }

  fetchDocuments() {
    this.httpClient.get("assets/travelDocumentType.json").subscribe(data =>{
      this.documentTypeList = data;
    })
  }


  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }


   /*
   * Selecting files before uploading
   */
  selectDocuments(event: any, i: number) {
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

  selectPhoto(event) {
    let files = [...event.target.files];
    const reader = new FileReader();
    reader.onload = e => this.driverProfileSrc = reader.result;
    reader.readAsDataURL(files[0]);
    this.uploadedPhotos = [];
    this.uploadedPhotos.push(files[0])

    if(this.uploadedPhotos.length > 0) {
      this.profileTitle = 'Change';
    }

  }

  removeProfile() {
    this.driverProfileSrc = 'assets/img/driver/driver.png';
    this.uploadedPhotos = [];
    this.profileTitle = 'Add';
  }


  public searchLocation() {
    this.searchTerm.pipe(
      map((e: any) => {
        $('.map-search__results').hide();
        $(e.target).closest('div').addClass('show-search__result');
        return e.target.value;
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        return this.HereMap.searchEntries(term);
      }),
      catchError((e) => {
        return throwError(e);
      }),
    ).subscribe(res => {
      this.searchResults = res;
    });
  }

  fetchDrivers() {
    this.apiService.getData(`drivers`).subscribe( res=> {
      this.allDrivers = res.Items;
    });
  }
  addGroup() {
    this.hideErrors();
    this.apiService.postData('groups', this.groupData).subscribe({
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
        this.hasSuccess = true;
        this.fetchGroups();
        this.toastr.success('Group added successfully');
        $('#addDriverGroupModal').modal('hide');


      },
    });
  }


  async onSubmit() {
    this.hasError = false;
    this.hasSuccess = false;
    // this.spinner.show();
    this.hideErrors();
    // this.driverData.empPrefix = this.prefixOutput;
    this.driverData.currentTab = this.currentTab;

    if(this.driverData.hosDetails.hosCycle != '') {
      let cycleName = '';
      this.cycles.map((v:any)=>{
        if(this.driverData.hosDetails.hosCycle == v.cycleID) {
          cycleName = v.cycleName;
        }
      })
      this.driverData.hosDetails.hosCycleName = cycleName;
    }

    for (let i = 0; i < this.driverData.address.length; i++) {
      const element = this.driverData.address[i];
      if(element.countryID != '' || element.stateID != '' || element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);
        result = result.items[0];

        if(result != undefined) {
          element.geoCords.lat = result.position.lat;
          element.geoCords.lng = result.position.lng;
        }
      }
    }
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
        this.isSubmitted = true;
        this.modalServiceOwn.triggerRedirect.next(true);
        this.takeUntil$.next();
        this.takeUntil$.complete();
        this.spinner.hide();
        this.cancel();


      },
    })})
  } catch (error) {
    return 'error found';
  }}

  getCityName(i, id: any) {
    let result = this.citiesObject[id];
    this.driverData.address[i].cityName = result;
  }
  async userAddress(i, item) {
    let result = await this.HereMap.geoCode(item.address.label);
    result = result.items[0];

    this.driverData.address[i].userLocation = result.address.label;
    this.driverData.address[i].zipCode = result.address.postalCode;

    this.driverData.address[i].geoCords.lat = result.position.lat;
    this.driverData.address[i].geoCords.lng = result.position.lng;
    this.driverData.address[i].countryName = result.address.countryName;
    $('div').removeClass('show-search__result');

    this.driverData.address[i].stateName = result.address.state;
    this.driverData.address[i].cityName = result.address.city;
    if (result.address.houseNumber === undefined) {
      result.address.houseNumber = '';
    }
    if (result.address.street === undefined) {
      result.address.street = '';
    }
  }

  async fetchCountriesByName(name: string, i) {
    const result = await this.apiService.getData(`countries/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getStates(result.Items[0].countryID, i);
      return result.Items[0].countryID;
    }
    return '';
  }

  async fetchStatesByName(name: string, i) {
  const result = await this.apiService.getData(`states/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getCities(result.Items[0].stateID, i);
      return result.Items[0].stateID;
    }
    return '';
  }

  async fetchCitiesByName(name: string) {
    const result = await this.apiService.getData(`cities/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      return result.Items[0].cityID;
    }
    return '';
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

  addDocument() {
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

  deleteInput(i: number) {
    this.driverData.documentDetails.splice(i, 1);
  }
  /**
   * fetch driver data
   */
  fetchDriverByID() {
    this.isEdit = true;
    this.apiService
      .getData(`drivers/${this.driverID}`)
      .subscribe(async (result: any) => {
        result = result.Items[0];

        this.driverData.driverType = result.driverType;
        this.driverData.employeeContractorId = result.employeeContractorId;
        // this.driverData.contractorId = result.contractorId;

        this.driverData.ownerOperator = result.ownerOperator;

        this.driverData.driverStatus = result.driverStatus;
        this.driverData.userName = result.userName;
        this.driverData.firstName = result.firstName;
        this.driverData.middleName = result.middleName;
        this.driverData.lastName = result.lastName;
        this.driverData.password = result.password;
        this.driverData.confirmPassword = result.confirmPassword;
        this.driverData.startDate = result.startDate;
        this.driverData.terminationDate = result.terminationDate;
        this.driverData.contractStart = result.contractStart;
        this.driverData.contractEnd = result.contractEnd;

        this.driverData.citizenship = result.citizenship;
        this.driverData.assignedVehicle = result.assignedVehicle;
        this.driverData.groupID = result.groupID;

        if(result.driverImage != '' && result.driverImage != undefined) {
          this.driverProfileSrc = `${this.Asseturl}/${result.carrierID}/${result.driverImage}`;
          this.showIcons = true;
          this.profileTitle = 'Change';
        } else {
          this.driverProfileSrc = 'assets/img/driver/driver.png';
        }
        this.driverData['abstractDocs'] = [];
        if(result.abstractDocs != undefined && result.abstractDocs.length > 0) {
          this.driverData['abstractDocs'] = result.abstractDocs;
          this.absDocs = result.abstractDocs.map(x => ({path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x}));


        }

        this.driverData.gender = result.gender;
        this.driverData.DOB = result.DOB;
        this.driverData.email = result.email;
        this.driverData.workPhone = result.workPhone;


        for (let i = 0; i < result.address.length; i++) {
          await this.getStates(result.address[i].countryID);
          await this.getCities(result.address[i].stateID);
          if (result.address[i].manual) {
            this.newAddress.push({
              addressID: result.address[i].addressID,
              addressType: result.address[i].addressType,
              countryID: result.address[i].countryID,
              countryName: result.address[i].countryName,
              stateID: result.address[i].stateID,
              stateName: result.address[i].stateName,
              cityID: result.address[i].cityID,
              cityName: result.address[i].cityName,
              zipCode: result.address[i].zipCode,
              address1: result.address[i].address1,
              address2: result.address[i].address2,
              geoCords: {
                lat: result.address[i].geoCords.lat,
                lng: result.address[i].geoCords.lng
              },
              manual: result.address[i].manual
            })
          } else {
            this.newAddress.push({
              addressID: result.address[i].addressID,
              addressType: result.address[i].addressType,
              countryID: result.address[i].countryID,
              countryName: result.address[i].countryName,
              stateID: result.address[i].stateID,
              stateName: result.address[i].stateName,
              cityID: result.address[i].cityID,
              cityName: result.address[i].cityName,
              zipCode: result.address[i].zipCode,
              address1: result.address[i].address1,
              address2: result.address[i].address2,
              geoCords: {
                lat: result.address[i].geoCords.lat,
                lng: result.address[i].geoCords.lng
              },
              userLocation: result.address[i].userLocation

            })
          }

        }

        this.driverData.address = this.newAddress;
        for (let i = 0; i < result.documentDetails.length; i++) {
          await this.getStates(result.documentDetails[i].issuingCountry);
          await this.getCities(result.documentDetails[i].issuingState);
          let docmnt = []
          if(result.documentDetails[i].uploadedDocs != undefined && result.documentDetails[i].uploadedDocs.length > 0){
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
            uploadedDocs: docmnt
          });
          if(result.documentDetails[i].uploadedDocs != undefined && result.documentDetails[i].uploadedDocs.length > 0){
            this.assetsDocs[i] = result.documentDetails[i].uploadedDocs.map(x => ({path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x}));
          }
        }

        this.driverData.documentDetails = this.newDocuments;
        this.driverData.crossBorderDetails.ACI_ID = result.crossBorderDetails.ACI_ID;
        this.driverData.crossBorderDetails.ACE_ID = result.crossBorderDetails.ACE_ID;
        this.driverData.crossBorderDetails.fast_ID = result.crossBorderDetails.fast_ID;
        this.driverData.crossBorderDetails.fastExpiry = result.crossBorderDetails.fastExpiry;
        this.driverData.crossBorderDetails.csa = result.crossBorderDetails.csa;
        this.driverData.paymentDetails.paymentType = result.paymentDetails.paymentType;
        this.driverData.paymentDetails.loadedMiles = result.paymentDetails.loadedMiles;
        this.driverData.paymentDetails.loadedMilesUnit = result.paymentDetails.loadedMilesUnit;
        this.driverData.paymentDetails.loadedMilesTeam = result.paymentDetails.loadedMilesTeam;
        this.driverData.paymentDetails.loadedMilesTeamUnit = result.paymentDetails.loadedMilesTeamUnit;

        this.driverData.paymentDetails.emptyMiles = result.paymentDetails.emptyMiles;
        this.driverData.paymentDetails.emptyMilesUnit = result.paymentDetails.emptyMilesUnit;
        this.driverData.paymentDetails.emptyMilesTeam = result.paymentDetails.emptyMilesTeam;
        this.driverData.paymentDetails.emptyMilesTeamUnit = result.paymentDetails.emptyMilesTeamUnit;
        this.driverData.paymentDetails.loadPayPercentage = result.paymentDetails.loadPayPercentage;
        this.driverData.paymentDetails.loadPayPercentageOf = result.paymentDetails.loadPayPercentageOf;
        this.driverData.paymentDetails.rate = result.paymentDetails.rate;
        this.driverData.paymentDetails.rateUnit = result.paymentDetails.rateUnit;
        this.driverData.paymentDetails.waitingPay = result.paymentDetails.waitingPay;
        this.driverData.paymentDetails.waitingPayUnit = result.paymentDetails.waitingPayUnit;
        this.driverData.paymentDetails.waitingHourAfter = result.paymentDetails.waitingHourAfter;

        this.driverData.paymentDetails.deliveryRate = result.paymentDetails.deliveryRate;
        this.driverData.paymentDetails.deliveryRateUnit = result.paymentDetails.deliveryRateUnit;

        this.driverData.paymentDetails.SIN_Number = result.paymentDetails.SIN_Number;
        this.driverData.paymentDetails.payPeriod = result.paymentDetails.payPeriod;
        this.driverData.licenceDetails.CDL_Number = result.licenceDetails.CDL_Number;
        this.driverData.licenceDetails.issuedCountry = result.licenceDetails.issuedCountry;
        this.driverData.licenceDetails.issuedState = result.licenceDetails.issuedState;
        this.driverData.licenceDetails.licenceExpiry = result.licenceDetails.licenceExpiry;
        this.driverData.licenceDetails.licenceNotification = result.licenceDetails.licenceNotification;
        this.driverData.licenceDetails.WCB = result.licenceDetails.WCB;
        this.driverData.licenceDetails.medicalCardRenewal = result.licenceDetails.medicalCardRenewal;
        this.driverData.licenceDetails.healthCare = result.licenceDetails.healthCare;

        this.driverData.licenceDetails.vehicleType = result.licenceDetails.vehicleType;

        this.driverData.hosDetails.hosStatus = result.hosDetails.hosStatus;
        this.driverData.hosDetails.type = result.hosDetails.type;
        this.driverData.hosDetails.hosRemarks = result.hosDetails.hosRemarks;
        this.driverData.hosDetails.hosCycle = result.hosDetails.hosCycle;
        this.driverData.hosDetails.homeTerminal = result.hosDetails.homeTerminal;
        this.driverData.hosDetails.pcAllowed = result.hosDetails.pcAllowed;
        this.driverData.hosDetails.ymAllowed = result.hosDetails.ymAllowed;
        this.driverData.hosDetails.utcOffset = result.hosDetails.utcOffset;
        this.driverData.hosDetails.optZone = result.hosDetails.optZone;

        this.driverData.emergencyDetails.name = result.emergencyDetails.name;
        this.driverData.emergencyDetails.relationship = result.emergencyDetails.relationship;
        this.driverData.emergencyDetails.phone = result.emergencyDetails.phone;
        this.driverData.emergencyDetails.email = result.emergencyDetails.email;
        this.driverData.emergencyDetails.emergencyAddress = result.emergencyDetails.emergencyAddress;
        this.driverData['timeCreated'] = result.timeCreated;
      });
  }

  async updateDriver() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
    this.driverData.currentTab = this.currentTab;
    for (let i = 0; i < this.driverData.address.length; i++) {
      const element = this.driverData.address[i];
      if(element.countryID != '' || element.stateID != '' || element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        if(result != undefined) {
            element.geoCords.lat = result.position.lat;
            element.geoCords.lng = result.position.lng;
        }
      }
    }
    this.driverData['driverID'] = this.driverID;

    if(this.driverData.hosDetails.hosCycle != '') {
      let cycleName = '';
      this.cycles.map((v:any)=>{
        if(this.driverData.hosDetails.hosCycle == v.cycleID) {
          cycleName = v.cycleName;
        }
      })
      this.driverData.hosDetails.hosCycleName = cycleName;
    }
    
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

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
      return await new Promise((resolve, reject) => {this.apiService.putData('drivers', formData, true).subscribe({
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
              this.hasError = false;
              if(err) return reject(err);
              // this.toastr.error('Please see the errors');
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.isSubmitted = true;
        for (let i = 0; i < this.deletedAddress.length; i++) {
          const element = this.deletedAddress[i];
          this.apiService.deleteData(`addresses/deleteAddress/${element}`).subscribe(async (result: any) => {});

        }
        this.toastr.success('Driver updated successfully');
        // this.router.navigateByUrl('/fleet/drivers/list');
        this.cancel();

      },
    })})
    } catch (error) {

}}


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

  concatArray(path) {
    this.concatArrayKeys = '';
    for (const i in path) {
      this.concatArrayKeys += path[i] + '.';
    }
    this.concatArrayKeys = this.concatArrayKeys.substring(0, this.concatArrayKeys.length - 1);
    return this.concatArrayKeys;
  }


  ngOnDestroy(): void {
    this.takeUntil$.next();
    this.takeUntil$.complete();
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length-1];
    this.pdfSrc = '';
    if(ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url='+val+'&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  // delete uploaded images and documents
  delete(type: string,name: string, index:string){
    this.apiService.deleteData(`drivers/uploadDelete/${this.driverID}/${type}/${name}/${index}`).subscribe((result: any) => {
      this.absDocs.splice(parseInt(index), 1);
    });
  }

  complianceChange(value) {
    if(value === 'Non Exempted') {
      this.driverData.hosDetails.type = 'ELD';
    } else {
      this.driverData.hosDetails.type = 'Log Book';
      this.driverData.hosDetails.hosCycle = '';
    }
  }

   getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.currentUserCarrier = this.currentUser.carrierID;
    this.carrierID = this.currentUser.carrierID;
   
    if(this.currentUser.userType == 'Cloud Admin') {
      let isCarrierID = localStorage.getItem('carrierID');
      if(isCarrierID != undefined) {
        this.currentUserCarrier = isCarrierID;
      }
    }
    
    this.apiService.getData(`addresses/carrier/${this.currentUserCarrier}`).subscribe(result => {
      result.Items.map(e => {
        if(e.addressType == 'yard') {
          this.carrierYards.push(e);
        }
      })
    });
  }

  closeGroupModal (){
    this.groupData = {
      groupType : 'drivers',
      groupName: '',
      groupMembers: '',
      description: '',
    };

    $("#addDriverGroupModal").modal("hide");
  }

  async getUtc(yard) {
    this.carrierYards.map(async (element: any) => {
      if (element.addressID == yard) {
        let result = await this.HereMap.geoCode(element.userLocation);
        result = result.items[0];
        this.driverData.hosDetails.utcOffset = result.timeZone.utcOffset
      }
    })
  }

}
