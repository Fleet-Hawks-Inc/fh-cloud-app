import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Object } from 'aws-sdk/clients/s3';
import { ApiService } from '../../../api.service';
import { Auth } from 'aws-amplify';
import { AwsUploadService } from '../../../aws-upload.service';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from "moment";
declare var $: any;

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css'],
 
})
export class AddDriverComponent implements OnInit {
  title = 'Add Driver';
  errors = {};
  form;
  concatArrayKeys = '';

  imageError = '';
  fileName = '';
  /**
   * Form Props
   */
  // Dates
  driverContractEnd: NgbDateStruct;
  driverContractStart: NgbDateStruct;
  driverMedicalRenewal: NgbDateStruct;
  driverBirthDate: NgbDateStruct;
  driverLicenseExpiry: NgbDateStruct;

  basic = {
    driverType: "Employee",
    companyID: "",
    employeeID: "",
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    driverID: "",
    driverGender: "Male",
    groupID: "",
    phone: "",
    email: "",
  };
  address = {
    addressType: "",
    driverCountry: "",
    driverStateID: "",
    driverCityID: "",
    addressZip: "",
    driverAddress1: "",
    driverAddress2: "",
  };
  payment = {
    driverPayType: "Pay Per Mile",
    driverPerHourRate: "",
    driverLoadedMiles: "",
    driverEmptyMiles: "",
    calculateEmptyMiles: "",
    driverLoadPercentage: "",
    driverLoadPercentageOf: "",
  };

  licence = {
    driverContractStart: "",
    driverContractEnd: "",
    driverMedicalRenewal: "",
    driverBirthDate: "",
    driverLicenseNumber: "",
    driverLicenseExpiry: "",
    driverLicenseStateID: "",
    driverVehicleType: "",

  };
  driverAllowYM:boolean;
  driverAllowPC : boolean;
  HOSCompliance = {
    status: "",
    type: "",
    cycleID: "",
    yardID: "",
    exemptedNotes: "",
    driverAllowYM: false,
    driverAllowPC: false,
  };
  emergencyContact = {
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactAddress: "",
    emergencyContactRelationship: "",
    emergencyContactEmail: "",
  };
  // additionalDetails = {
  //   driverTumblr: "",
  //   driverFacebook: "",
  //   driverInstagram: "",
  //   driverTwitter: "",
  //   driverBlog: "",
  //   driverLinkedIn: "",
  //   additionalNotes: "",
  // };



  groups = [];
  groupNameModal = "";
  countries = [];
  states = [];
  cities = [];
  yards = [];
  cycles = [];
  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";
  rightSidebarShow: boolean = true;

  constructor(private apiService: ApiService, private router: Router,
    private awsUS: AwsUploadService, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {
    this.fetchGroups();
    this.fetchCountries();
    this.fetchYards();
    this.fetchCycles();
    this.getToday();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
    $(document).ready(() => {
      this.form = $("#form1_").validate();
    });
    this.basic.driverGender = "Male";
    this.basic.driverType = "Employee";
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
      });
  }

  fetchYards() {
    this.apiService.getData('yards')
      .subscribe((result: any) => {
        this.yards = result.Items;
      });
  }

  getStates() {
    this.apiService.getData('states/country/' + this.address.driverCountry)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
  getCities() {
    this.apiService.getData('cities/state/' + this.address.driverStateID)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  addGroup() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    const data1 = {
      groupNameModal: this.groupNameModal
    };
    console.log(data1);
  }
  addDriver() {
    // if (this.fileName === '') {
    //   this.imageError = 'Please Choose Image To Upload';
    //   return;
    // }
    this.register();
    this.errors = {};
    const data = {
      basic: {
        driverType: this.basic.driverType,
        employeeID: this.basic.employeeID,
        companyID: this.basic.companyID,
        userName: this.basic.userName,
        password: this.basic.password,
        firstName: this.basic.firstName,
        lastName: this.basic.lastName,
        driverID: this.basic.driverID,
        driverGender: this.basic.driverGender,
        phone: this.basic.phone,
        email: this.basic.email,
        groupID: this.basic.groupID,
      },
      address: {
        addressType: this.address.addressType,
        driverCountry: this.address.driverCountry,
        driverStateID: this.address.driverStateID,
        driverCityID: this.address.driverCityID,
        addressZip: this.address.addressZip,
        driverAddress1: this.address.driverAddress1,
        driverAddress2: this.address.driverAddress2,
      },
      payment: {
        driverPayType: this.payment.driverPayType,
        driverPerHourRate: this.payment.driverPerHourRate,
        driverLoadedMiles: this.payment.driverLoadedMiles,
        driverEmptyMiles: this.payment.driverEmptyMiles,
        calculateEmptyMiles: this.payment.calculateEmptyMiles,
        driverLoadPercentage: this.payment.driverLoadPercentage,
        driverLoadPercentageOf: this.payment.driverLoadPercentageOf,
      },
      licence: {
        driverContractStart: this.licence.driverContractStart,
        driverContractEnd: this.licence.driverContractEnd,
        driverMedicalRenewal: this.licence.driverMedicalRenewal,
        driverLicenseNumber: this.licence.driverLicenseNumber,
        driverBirthDate: this.licence.driverBirthDate,
        driverLicenseExpiry: this.licence.driverLicenseExpiry,
        driverLicenseStateID: this.licence.driverLicenseStateID,
        driverVehicleType: this.licence.driverVehicleType,
      },
      HOSCompliance: {
        status: this.HOSCompliance.status,
        type: this.HOSCompliance.type,
        cycleID: this.HOSCompliance.cycleID,
        yardID: this.HOSCompliance.yardID,
        driverAllowPC: this.HOSCompliance.driverAllowPC,
        driverAllowYM: this.HOSCompliance.driverAllowYM,
        exemptedNotes: this.HOSCompliance.exemptedNotes
      },
      emergencyContact: {
        emergencyContactName: this.emergencyContact.emergencyContactName,
        emergencyContactPhone: this.emergencyContact.emergencyContactPhone,
        emergencyContactAddress: this.emergencyContact.emergencyContactAddress,
        emergencyContactRelationship: this.emergencyContact.emergencyContactRelationship,
        emergencyContactEmail: this.emergencyContact.emergencyContactEmail,
      },
      // additionalDetails: {
      //   driverFacebook: this.additionalDetails.driverFacebook,
      //   driverInstagram: this.additionalDetails.driverInstagram,
      //   driverBlog: this.additionalDetails.driverBlog,
      //   driverTumblr: this.additionalDetails.driverTumblr,
      //   driverTwitter: this.additionalDetails.driverTwitter,
      //   driverLinkedIn: this.additionalDetails.driverLinkedIn,
      //   additionalNotes: this.additionalDetails.additionalNotes
      // },

    };

    console.log(data);
   
    this.apiService.postData('users', data).subscribe({
      complete: () => { },
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              // this.errors[key] = val.message;
              // Or We Can Use This One To Extract Key
              // const key = this.concatArray(path);
              // this.errors[this.concatArray(path)] = val.message;
              // if (key.length === 2) {
              // this.errors[val.context.key] = val.message;
              // } else {
              // this.errors[key] = val.message;
              // }
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[key] = val.message;
            }),
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
              this.Success = "";
            },
            error: () => { },
            next: () => { }
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Driver Added successfully";

        // this.basic.userName = "";
        // this.basic.password = "";
        // this.basic.firstName = "";
        // this.basic.lastName = "";
        // this.address.addressType = "";
        // this.basic.phone = "";
        // this.basic.email = "";
        // this.basic.groupID = "";
        // this.licence.driverLicenseNumber = "";

        // this.licence.driverLicenseExpiry = "";
        // this.licence.driverLicenseStateID = "";
        // this.HOSCompliance = {
        //   status: "",
        //   type: "",
        //   cycleID: "",
        //   yardID: "",
        //   exemptedNotes: "",
        //   driverAllowYM: ,
        //   driverAllowPC: ,
        // };

        // this.groups = [];
        // this.countries = [];
        // this.states = [];
        // this.yards = [];
        // this.cycles = [];
      },
    });
  }


  throwErrors() {
    this.form.showErrors(this.errors);
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
        password: this.basic.password,
        username: this.basic.userName,
        attributes: {
          email: this.basic.email,
          phone_number: this.basic.phone,
        },
      });

      console.log(res);
    } catch (err) {
      console.log("inside catch block");
      // this.hasError = true;
      // this.Error = err.message || 'Error during login';
    }
  };

  // Driver Gender Value
  onChangeDriverGender(value: any) {
    this.basic.driverGender = value;
    console.log(value);

  }
  onChangeDriverType(value: any) {
    this.basic.driverType = value;
    console.log(value);

  }
  uploadFile(event) {
    this.imageError = '';
    if (this.awsUS.imageFormat(event.target.files.item(0)) !== -1) {
      this.fileName = this.awsUS.uploadFile('test', event.target.files.item(0));
    } else {
      this.fileName = '';
      this.imageError = 'Invalid Image Format';
    }
  }
//  Modal for creating group. 
  createGroupModal() {
    $(document).ready(function () {
      $('#addGroupModal').modal('show');
    });
  }
  changePaymentMode(value: any) {
    console.log(value);
  }
}



