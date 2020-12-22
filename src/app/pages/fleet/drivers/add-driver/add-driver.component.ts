import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { from, Subject, throwError } from 'rxjs';
import { ApiService } from '../../../../services';
import { Auth } from 'aws-amplify';
import { HereMapService } from '../../../../services';
import { v4 as uuidv4 } from 'uuid';
import { AwsUploadService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css'],
})
export class AddDriverComponent implements OnInit {
  pageTitle: string;
  lastElement;
  hideNextBtn: boolean = true;
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
  manualAddress: boolean = false;
  nextTab: any;
  carrierID: any;

  statesObject: any;
  countriesObject: any;
  citiesObject: any;

  allDrivers: any;

  groupData = {
    groupType : 'drivers'
  };

  driverAddress = {
    address: [],
  };
  driverData = {
    driverType: 'employee',
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
      }
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
  public searchTerm = new Subject<string>();
  public searchResults: any;


  newDocuments = [];
  newAddress = []
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
  vehicles = [];
  states = [];

  cities = [];
  yards = [];
  cycles = [];
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  visibleIndex = 0;
  constructor(private apiService: ApiService,

              private httpClient: HttpClient,
              private toastr: ToastrService,
              private awsUS: AwsUploadService,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private HereMap: HereMapService,
              private ngbCalendar: NgbCalendar,
              private domSanitizer: DomSanitizer,
              private location: Location,
              private dateAdapter: NgbDateAdapter<string>,
              private router: Router) {
      this.selectedFileNames = new Map<any, any>();
    }


  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  ngOnInit() {
    this.driverID = this.route.snapshot.params['driverID'];
    if (this.driverID) {
      this.pageTitle = 'Edit Driver';
      this.fetchDriverByID();
      this.fetchAddress();
    } else {
      this.pageTitle = 'Add Driver';
    }

    this.fetchGroups(); // fetch groups
    this.fetchCountries(); // fetch countries
    this.fetchYards(); // fetch yards
    this.fetchCycles(); // fetch cycles
    this.fetchVehicles(); // fetch vehicles
    this.fetchDrivers();
    this.getToday(); // get today date on calender
    this.searchLocation(); // search location on keyup

    this.fetchAllCountriesIDs(); // fetch all countries Ids with name
    this.fetchAllStatesIDs(); // fetch all states Ids with name
    this.fetchAllCitiesIDs(); // fetch all cities Ids with name

    this.fetchDocuments();

    $(document).ready(() => {
      this.form = $('#driverForm, #groupForm').validate();
    });
  }

  nextStep() {
    this.currentTab++;
  }
  prevStep() {
    this.currentTab--;
  }
  tabChange(value) {
    this.currentTab = value;
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  clearUserLocation(i) {
    this.driverData.address[i]['userLocation'] = '';
    $('div').removeClass('show-search__result');
  }
  manAddress(event, i) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
    } else {
      $(event.target).closest('.address-item').removeClass('open');
    }
  }

  onChangeUnitType(value: any) {
    this.driverData['driverType'] = value;
  }

  addAddress() {
    this.driverData.address.push({
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
      }
    });
  }

  fetchCycles() {
    this.apiService.getData('cycles')
      .subscribe((result: any) => {
        this.cycles = result.Items;
      });
  }

  
  fetchGroups() {
    this.apiService.getData(`groups?groupType=${this.groupData.groupType}`).subscribe((result: any) => {
      this.groups = result.Items;
    });
  }

  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }


  fetchCountryByID(id: any) {
    this.apiService.getData('countries' + id)
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  fetchVehicles() {
    this.apiService.getData('vehicles')
      .subscribe((result: any) => {
        this.vehicles = result.Items;
      });
  }

  fetchYards() {
    this.apiService.getData('yards')
      .subscribe((result: any) => {
        this.yards = result.Items;
      });
  }

  getStates(id: any) {
    this.apiService.getData('states/country/' + id)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  getCities(id: any) {
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

  uploadDriverImg(elem, event): void {
    if (elem === 'profile') {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.driverProfileSrc = reader.result;

      reader.readAsDataURL(file);
      const newFile = event.target.files[0].name.split('.');
      const fileName = `${uuidv4(newFile[0])}.${newFile[1]}`;
      this.selectedFileNames.set(fileName, newFile);
      this.driverData['driverImage'] = fileName;
    } else if (elem === 'docs') {
      this.selectedFiles = event.target.files;
      for (let i = 0; i <= this.selectedFiles.item.length; i++) {
        const randomFileGenerate = this.selectedFiles[i].name.split('.');
        const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;
        this.selectedFileNames.set(fileName, this.selectedFiles[i]);
        this.driverData.documentDetails[i].uploadedDocs.push(fileName);
      }
    } else {

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

  getImages = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    // console.log(' this.driverData',  this.driverData['driverImage']);
    // this.image = this.domSanitizer.bypassSecurityTrustUrl(
    //   await this.awsUS.getFiles(this.carrierID, this.driverData.driverImage));
    //   console.log(' this.driverImages',  this.driverImages);
    // this.driverImages.push(this.image);


  }

  public searchLocation() {
    let target;
    this.searchTerm.pipe(
      map((e: any) => {
        $('.map-search__results').hide();
        $(e.target).closest('div').addClass('show-search__result');
        target = e;
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


      },
    });
  }


  async addDriver() {

    this.hasError = false;
    this.hasSuccess = false;
    // this.register();
    this.hideErrors();
   
    if (this.driverData.address[0].countryName !== '' && this.driverData.address[0].stateName !== '' && this.driverData.address[0].cityName !== '') {
      for (let i = 0; i < this.driverData.address.length; i++) {
        const element = this.driverData.address[i];
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]} 
                           ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);
        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;
        delete element['userLocation'];
      }
    }
    
    this.apiService.postData('drivers', this.driverData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error) 
          .pipe(
            map((val: any) => {
              console.log('val.context.label', val.context.label);
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
        this.uploadFiles(); // upload selected files to bucket
        this.toastr.success('Driver added successfully');
        this.router.navigateByUrl('/fleet/drivers/list');

      },
    });
  }

  getCityName(i, id: any) {
    let result = this.citiesObject[id];
    this.driverData.address[i].cityName = result;
  }
  async userAddress(i, item) {
    let result = await this.HereMap.geoCode(item.address.label);
    result = result.items[0];
    
    this.driverData.address[i]['userLocation'] = result.address.label;
    this.driverData.address[i].geoCords.lat = result.position.lat;
    this.driverData.address[i].geoCords.lng = result.position.lng;
    // this.driverData.address[i].countryID = result.address.countryName;
    let countryID = await this.fetchCountriesByName(result.address.countryName);
    this.driverData.address[i].countryID = countryID;
    this.driverData.address[i].countryName = result.address.countryName;

    let stateID = await this.fetchStatesByName(result.address.state);
    this.driverData.address[i].stateID = stateID;
    this.driverData.address[i].stateName = result.address.state;

    let cityID = await this.fetchCitiesByName(result.address.city);
    this.driverData.address[i].cityID = cityID;
    this.driverData.address[i].cityName = result.address.city;

    this.driverData.address[i].zipCode = result.address.postalCode;
    if (result.address.houseNumber === undefined) {
      result.address.houseNumber = '';
    }
    if (result.address.street === undefined) {
      result.address.street = '';
    }
    this.driverData.address[i].address1 = `${result.title}, ${result.address.houseNumber} ${result.address.street}`;

    $('div').removeClass('show-search__result');
  }

  async fetchCountriesByName(name: string) {
    let result = await this.apiService.getData(`countries/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getStates(result.Items[0].countryID);
      return result.Items[0].countryID;
    }
    return '';
  }

  async fetchStatesByName(name: string) {
    let result = await this.apiService.getData(`states/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getCities(result.Items[0].stateID);
      return result.Items[0].stateID;
    }
    return '';
  }

  async fetchCitiesByName(name: string) {
    let result = await this.apiService.getData(`cities/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      return result.Items[0].cityID;
    }
    return '';
  }

  remove(obj, i) {
    if (obj === 'address') {
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
    this.apiService
      .getData(`drivers/${this.driverID}`)
      .subscribe(async (result: any) => {
        result = result.Items[0];
        console.log('result', result);
        // this.getImages();
        this.driverData['driverType'] = result.driverType;
        this.driverData['employeeId'] = result.employeeId;
        this.driverData['companyId'] = result.companyId;

        this.driverData['driverStatus'] = result.driverStatus;
        this.driverData['userName'] = result.userName;
        this.driverData['firstName'] = result.firstName;
        this.driverData['lastName'] = result.lastName;
        this.driverData['citizenship'] = result.citizenship;
        this.driverData['assignedVehicle'] = result.assignedVehicle;
        this.driverData['groupID'] = result.groupID;
        this.driverProfileSrc = result.driverImage;
        this.driverData['gender'] = result.gender;
        this.driverData['workEmail'] = result.workEmail;
        this.driverData['workPhone'] = result.workPhone;

        
        for (let i = 0; i < result.address.length; i++) {
          this.getStates(result.address[i].countryID);
          this.getCities(result.address[i].stateID);
          this.newAddress.push({
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
            }
          })
        }
        this.driverData.address = this.newAddress;
        for (let i = 0; i < result.documentDetails.length; i++) {
          this.newDocuments.push({
            documentType: result.documentDetails[i].documentType,
            document: result.documentDetails[i].document,
            issuingAuthority: result.documentDetails[i].issuingAuthority,
            issuingCountry: result.documentDetails[i].issuingCountry,
            issuingState: result.documentDetails[i].issuingState,
            issueDate: result.documentDetails[i].issueDate,
            expiryDate: result.documentDetails[i].expiryDate,
          });
          this.driverData.documentDetails = this.newDocuments;

        }
        this.driverData.crossBorderDetails['ACI_ID'] = result.crossBorderDetails.ACI_ID;
        this.driverData.crossBorderDetails['ACE_ID'] = result.crossBorderDetails.ACE_ID;
        this.driverData.crossBorderDetails['fast_ID'] = result.crossBorderDetails.fast_ID;
        this.driverData.crossBorderDetails['fastExpiry'] = result.crossBorderDetails.fastExpiry;
        this.driverData.crossBorderDetails['csa'] = result.crossBorderDetails.csa;
        this.driverData.paymentDetails['paymentType'] = result.paymentDetails.paymentType;
        this.driverData.paymentDetails['loadedMiles'] = result.paymentDetails.loadedMiles;
        this.driverData.paymentDetails['emptyMiles'] = result.paymentDetails.emptyMiles;
        this.driverData.paymentDetails['loadPayPercentage'] = result.paymentDetails.loadPayPercentage;
        this.driverData.paymentDetails['loadPayPercentageOf'] = result.paymentDetails.loadPayPercentageOf;
        this.driverData.paymentDetails['rate'] = result.paymentDetails.rate;
        this.driverData.paymentDetails['SIN_Number'] = result.paymentDetails.SIN_Number;
        this.driverData.paymentDetails['localTax'] = result.paymentDetails.localTax;
        this.driverData.paymentDetails['federalTax'] = result.paymentDetails.federalTax;
        this.driverData.paymentDetails['payPeriod'] = result.paymentDetails.payPeriod;
        this.driverData.licenceDetails['CDL_Number'] = result.licenceDetails.CDL_Number;
        this.driverData.licenceDetails['issuedCountry'] = result.licenceDetails.issuedCountry;
        this.driverData.licenceDetails['issuedState'] = result.licenceDetails.issuedState;
        this.driverData.licenceDetails['licenceExpiry'] = result.licenceDetails.licenceExpiry;
        this.driverData.licenceDetails['WCB'] = result.licenceDetails.WCB;
        this.driverData.licenceDetails['medicalCardRenewal'] = result.licenceDetails.medicalCardRenewal;
        this.driverData.licenceDetails['healthCare'] = result.licenceDetails.healthCare;
        this.driverData.licenceDetails['contractStart'] = result.licenceDetails.contractStart;
        this.driverData.licenceDetails['contractEnd'] = result.licenceDetails.contractEnd;
        this.driverData.licenceDetails['vehicleType'] = result.licenceDetails.vehicleType;
        this.driverData.licenceDetails['DOB'] = result.licenceDetails.DOB;
        this.driverData.hosDetails['hosStatus'] = result.hosDetails.hosStatus;
        this.driverData.hosDetails['type'] = result.hosDetails.type;
        this.driverData.hosDetails['hosRemarks'] = result.hosDetails.hosRemarks;
        this.driverData.hosDetails['hosCycle'] = result.hosDetails.hosCycle;
        this.driverData.hosDetails['homeTerminal'] = result.hosDetails.homeTerminal;
        this.driverData.hosDetails['pcAllowed'] = result.hosDetails.pcAllowed;
        this.driverData.hosDetails['ymAllowed'] = result.hosDetails.ymAllowed;
        this.driverData.emergencyDetails['name'] = result.emergencyDetails.name;
        this.driverData.emergencyDetails['relationship'] = result.emergencyDetails.relationship;
        this.driverData.emergencyDetails['phone'] = result.emergencyDetails.phone;
        this.driverData.emergencyDetails['email'] = result.emergencyDetails.email;
        this.driverData.emergencyDetails['emergencyAddress'] = result.emergencyDetails.emergencyAddress;
      });
  }

  updateDriver() {
    //this.spinner.show(); // loader init
    // this.register();
    this.hideErrors();
    for (let i = 0; i < this.driverData.address.length; i++) {
      const element = this.driverData.address[i];
      delete element['userLocation'];
    }
    this.driverData['driverID'] = this.driverID;
    this.apiService.putData('drivers', this.driverData).subscribe({
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
        // this.uploadFiles(); // upload selected files to bucket
        this.toastr.success('Driver updated successfully');
        this.router.navigateByUrl('/fleet/drivers/list');

      },
    });
  }




  fetchAddress() {
    this.apiService.getData('addresses')
      .subscribe((result: any) => {
    });
  }

  changePaymentModeForm(value) {
    if (value === 'Pay Per Mile') {
      delete this.driverData.paymentDetails['loadPayPercentage'];
      delete this.driverData.paymentDetails['loadPayPercentageOf'];
      delete this.driverData.paymentDetails['rate'];
    } else if (value === 'Percentage') {
      delete this.driverData.paymentDetails['loadedMiles'];
      delete this.driverData.paymentDetails['emptyMiles'];
      delete this.driverData.paymentDetails['rate'];
    } else {
      delete this.driverData.paymentDetails['loadPayPercentage'];
      delete this.driverData.paymentDetails['loadPayPercentageOf'];
      delete this.driverData.paymentDetails['loadedMiles'];
      delete this.driverData.paymentDetails['emptyMiles'];
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
  

  register = async () => {
    try {
      // This should go in Register component
      let res = await Auth.signUp({
        password: this.password,
        username: this.userName,
        attributes: {
          email: this.email,
          phone_number: this.phone,
        },
      });
    } catch (err) {
      console.log('inside catch block');
      // this.hasError = true;
      // this.Error = err.message || 'Error during login';
    }
  }
}
