import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
import {ApiService} from '../../../../services';
import { Auth } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
declare var $: any;

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css'],
})
export class AddDriverComponent implements OnInit {
  pageTitle: string;
  public driverID;
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  errors = {};
  form;
  concatArrayKeys = '';
  manualAddress: boolean;
  nextTab: any;
  driverData = {
    address: {},
    documentDetails: {},
    crossBorderDetails: {},
    paymentDetails: {},
    licenceDetails: {},
    hosDetails: {},
    emergencyDetails: {},
  };
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
  states = [];
  yards = [];
  cycles = [];
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.selectedFileNames = new Map<any, any>();
  }

  ngOnInit() {
    this.driverID = this.route.snapshot.params['driverID'];
    console.log(this.driverID)
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
    this.getToday();
    $(document).ready(() => {
      $('.btnNext').click(() => {
        this.nextTab = $('.nav-tabs li a.active').closest('li').next('li');
        this.nextTab.find('a').trigger('click');
      });

      $('.btnPrevious').click(() => {
        $('.nav-tabs li a.active').closest('li').prev('li').find('a').trigger('click');
      });

      this.form = $('#form_').validate({
        //ignore: ''
      });

      $('#document-two').hide();
      $('#add-document').on('click', function(){
        $(this).hide();
        $('#document-two').show();
      });
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

  fetchYards() {
    this.apiService.getData('yards')
      .subscribe((result: any) => {
        this.yards = result.Items;
        //console.log(this.yards)
      });
  }

  getStates() {
    const countryID = this.driverData.address['country'];
    this.apiService.getData('states/country/' + countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
        //console.log('this.states', this.states)
      });
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }
  /*
   * Selecting files before uploading
   */
  selectDocuments(event) {
    this.selectedFiles = event.target.files;
    for (let i = 0; i <= this.selectedFiles.item.length; i++) {
      const randomFileGenerate = this.selectedFiles[i].name.split('.');
      console.log(randomFileGenerate)
      const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;
      this.selectedFileNames.set(fileName, this.selectedFiles[i]);
      console.log('fileName', fileName)
      this.driverData['driverImage'] = fileName;
      console.log('fileName', this.driverData)
    }
  }

  addDriver() {
    this.register();
    this.errors = {};
    // console.log('this.driverData', this.driverData);
    this.apiService.postData('drivers', this.driverData).subscribe({
      complete: () => {},
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
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
        this.Success = 'Driver Added successfully';

      },
    });
  }


  throwErrors() {
    console.log('throw errors');
    this.form.showErrors(this.errors);
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
        this.driverData['driverStatus'] = result.driverStatus;
        this.driverData['userName'] = result.userName;
        this.driverData['firstName'] = result.firstName;
        this.driverData['lastName'] = result.lastName;
        this.driverData['citizenship'] = result.citizenship;
        this.driverData['assignedVehicle'] = result.assignedVehicle;
        this.driverData['groupID'] = result.groupID;
        this.driverData['gender'] = result.gender;
        this.driverData['workEmail'] = result.workEmail;
        this.driverData['workPhone'] = result.workPhone;
        this.driverData.address['addressType'] = result.address.addressType;
        this.driverData.address['country'] = result.address.country;
        this.driverData.address['state'] = result.address.state;
        this.driverData.address['zipCode'] = result.address.zipCode;
        this.driverData.address['address1'] = result.address.address1;
        this.driverData.address['address2'] = result.address.address2;
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
  };

}
