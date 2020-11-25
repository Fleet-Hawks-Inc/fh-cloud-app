import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {from, Subject, throwError} from 'rxjs';
import {ApiService} from '../../../../services';
import { Auth } from 'aws-amplify';
import { HereMapService } from '../../../../services';
import { v4 as uuidv4 } from 'uuid';
import { AwsUploadService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer} from '@angular/platform-browser';

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
  currentTab =  1;
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
  driverAddress = {
    address: [],
  };
  driverData = {
    address: [{
      addressType: '',
      countryID: '',
      stateID: '',
      cityID: '',
      zipCode: '',
      address1: '',
      address2: '',
      geoCords: {lat: '', lng: ''}
    }],
    documentDetails: [{
      documentType: '',
      document: '',
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



  driverLicenseCountry = '';
  groups = [];
  countries = [];
  vehicles = [];
  states = [];
  adrStates = [];
  docStates = [];
  cities = [];
  yards = [];
  cycles = [];
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  visibleIndex = 0 ;
  constructor(private apiService: ApiService,
              private toastr: ToastrService,
              private awsUS: AwsUploadService,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private HereMap: HereMapService,
              private ngbCalendar: NgbCalendar,
              private domSanitizer: DomSanitizer,
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
    } else {
      this.pageTitle = 'Add Driver';
    }

    this.fetchGroups(); // fetch groups
    this.fetchCountries(); // fetch countries
    this.fetchYards(); // fetch yards
    this.fetchCycles(); // fetch cycle
    this.fetchVehicles();
    this.getToday();
    this.searchLocation();
    
    $('#address-wrap-0').hide();

    $(document).ready(() => {
      this.form = $('#driverForm').validate();
    });
  }

  nextStep() {
    this.currentTab++;
    console.log('currentTab', this.currentTab);
  }
  prevStep() {
    this.currentTab--;
    console.log('currentTab', this.currentTab);
  }
  tabChange(value) {
    this.currentTab = value;
  }

  manAddress(event, i) {
    if (event.target.checked) {
      this.addressField = i;
    } else {
      this.addressField = -1;
    }
  }

  addAddress() {
    this.driverData.address.push({
      addressType: '',
      countryID: '',
      stateID: '',
      cityID: '',
      zipCode: '',
      address1: '',
      address2: '',
      geoCords: {lat: '', lng: ''}
    });
  }

  fetchCycles() {
    this.apiService.getData('cycles')
    .subscribe((result: any) => {
      this.cycles = result.Items;
    });
  }

  fetchGroups() {
    this.apiService.getData('groups')
    .subscribe((result: any) => {
      this.groups = result.Items;
    });
  }

  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
        //console.log(this.countries)
      });
  }

  fetchVehicles() {
    this.apiService.getData('vehicles')
      .subscribe((result: any) => {
        this.vehicles = result.Items;
        console.log('vehicles', this.vehicles)
      });
  }

  fetchYards() {
    this.apiService.getData('yards')
      .subscribe((result: any) => {
        this.yards = result.Items;
        //console.log(this.yards)
      });
  }

  getStates(id: any) {
    console.log('countryID', id);
    
    // const countryID = this.driverData.address['countryID'];
    this.apiService.getData('states/country/' + id)
      .subscribe((result: any) => {
        this.states = result.Items;
        this.adrStates = result.Items;
        this.docStates = result.Items;
        console.log('this.adrStates', this.adrStates)
      });
  }

  getCities(id: any) {
    // const stateID = this.driverData.address['stateID'];
    this.apiService.getData('cities/state/' + id)
      .subscribe((result: any) => {
        this.cities = result.Items;
        console.log('this.cities', this.cities)
      });
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  uploadDriverImg(elem, event): void {
    console.log(event);
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
    console.log(' this.driverData',  this.driverData['driverImage']);
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
      console.log('res', this.searchResults);
    });
  }

  addDriver() {
    //this.spinner.show(); // loader init
    this.register();
    this.hideErrors();
    console.log('this.driverData', this.driverData);
    // this.driverAddress.address = this.driverData.address;
    // this.driverAddress.address.forEach(element => {
    //     delete element.userLocation;
    // });
    // console.log('this.driverAddress', this.driverAddress);
    this.apiService.postData('drivers', this.driverData).subscribe({
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
        this.uploadFiles(); // upload selected files to bucket
        this.toastr.success('Driver added successfully');
        this.router.navigateByUrl('/fleet/drivers/list');

      },
    });
  }

  async userAddress(i, item) {
    let result = await this.HereMap.geoCode(item.address.label);
    result = result.items[0];
    console.log('result', result);
    
    
    this.driverData.address[i].geoCords.lat = result.position.lat;
    this.driverData.address[i].geoCords.lng = result.position.lng;
    this.driverData.address[i].countryID = result.address.countryName;
    console.log('this.driverData.address[i]', this.driverData.address[i]);
    // this.driverData.address['geoCords'].lat = result.position.lat;
    // this.driverData.address['geoCords'].lng = result.position.lng;
    // console.log('driver', this.driverAddress)
    $('div').removeClass('show-search__result');
  }

  remove(obj, i) {
    if (obj === 'address') {
      this.driverData.address.splice(i, 1);
    } else {
      this.driverData.documentDetails.splice(i, 1);
    }
  }

  throwErrors() {
    console.log(this.errors);
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
      issuingCountry: '',
      issuingState: '',
      issueDate: '',
      expiryDate: '',
      uploadedDocs: []
    })
    console.log(this.driverData)
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
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log(result);
        this.getImages();
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
        // this.driverData.address['addressType'] = result.address.addressType;
        // this.driverData.address['country'] = result.address.country;
        // this.driverData.address['state'] = result.address.state;
        // this.driverData.address['zipCode'] = result.address.zipCode;
        // this.driverData.address['address1'] = result.address.address1;
        // this.driverData.address['address2'] = result.address.address2;
        this.driverData.documentDetails['documentType'] = result.documentDetails.documentType;
        this.driverData.documentDetails['document'] = result.documentDetails.document;
        this.driverData.documentDetails['issuingAuthority'] = result.documentDetails.issuingAuthority;
        this.driverData.documentDetails['issuingCountry'] = result.documentDetails.issuingCountry;
        this.driverData.documentDetails['issuingState'] = result.documentDetails.issuingState;
        this.driverData.documentDetails['issueDate'] = result.documentDetails.issueDate;
        this.driverData.documentDetails['expiryDate'] = result.documentDetails.expiryDate;
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

      console.log(res);
    } catch (err) {
      console.log('inside catch block');
      // this.hasError = true;
      // this.Error = err.message || 'Error during login';
    }
  }
}
