import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from '../../../api.service';
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { Object } from "aws-sdk/clients/s3";
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Component({
  selector: "app-edit-driver",
  templateUrl: "./edit-driver.component.html",
  styleUrls: ["./edit-driver.component.css"],
})
export class EditDriverComponent implements OnInit {
  title = "Edit Driver";
  errors = {};
  form;
  concatArrayKeys = "";

  /**
   * Form Props
   */
  basic = {
    driverType: "",
    companyID: "",
    employeeID: "",
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    driverID: "",
    driverGender: "",
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
    driverPayType: "",
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
  // driverAllowYM : boolean;
  // driverAllowPC  : boolean;
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
  additionalDetails = {
    driverTumblr: "",
    driverFacebook: "",
    driverInstagram: "",
    driverTwitter: "",
    driverBlog: "",
    driverLinkedIn: "",
    additionalNotes: "",
  };
  groupNameModal = "";
  driverLicenseCountry = "";
  groups = [];
  countries = [];
  states = [];
  yards = [];
  cycles = [];
   // Dates
   driverContractEnd: NgbDateStruct;
   driverContractStart : NgbDateStruct;
   driverMedicalRenewal : NgbDateStruct;
   driverBirthDate  : NgbDateStruct;
   driverLicenseExpiry : NgbDateStruct;
  mockData = {
    basic: {
      companyID: '1111',
      driverGender: 'Male',
      driverID: '1111',
      driverType: 'Contractor',
      email: 'hardeep8587@gmail.com',
      employeeID: '',
      firstName: 'hardeep',
      groupID: 'da0e0920-abd8-11ea-a3e2-011208633052',
      lastName: 'Matharu',
      password: '',
      phone: '98722 648784',
      userName: 'hardeepMatharu'
    },
    address: {
      addressType: "Work",
      addressZip: "45656777",
      driverAddress1: "166 st",
      driverAddress2: "3452",
      driverCityID: "",
      driverCountry: "8e8a0700-8979-11ea-94e8-ddabdd2e57f0",
      driverStateID: "2be51e80-897b-11ea-94e8-ddabdd2e57f0",
    },
    payment: {
      calculateEmptyMiles: "",
      driverEmptyMiles: "",
      driverLoadPercentage: 7,
      driverLoadPercentageOf: "Hauling Fees",
      driverLoadedMiles: "",
      driverPayType: "Percentage",
      driverPerHourRate: "",
    },
    licence: {
      driverBirthDate: { year: 2020, month: 7, day: 23 },
      driverContractEnd: { year: 2022, month: 7, day: 29 },
      driverContractStart: { year: 2020, month: 8, day: 9 },
      driverLicenseExpiry: { year: 2020, month: 8, day: 1 },
      driverLicenseNumber: "12312323",
      driverLicenseStateID: "9a507140-897a-11ea-94e8-ddabdd2e57f0",
      driverMedicalRenewal: { year: 2020, month: 7, day: 14 },
      driverVehicleType: "1"
    },
    HOSCompliance: {
      cycleID: "bc459ff0-85f6-11ea-9a20-5b1ee3c12feb",
      driverAllowPC: true,
      driverAllowYM: true,
      exemptedNotes: "these are notes.",
      status: "Non Exempted",
      type: "ELD",
      yardID: "9a4a9070-885f-11ea-9b41-0fa80c04fe00",
    },
    emergencyContact: {
      emergencyContactAddress: "667↵htghh",
      emergencyContactEmail: "jatinder@gmail.com",
      emergencyContactName: "jatinder",
      emergencyContactPhone: "9872202707",
      emergencyContactRelationship: "Brother"
    },
    additionalDetails: {
      additionalNotes: "these are notes",
      driverBlog: "blog.com",
      driverFacebook: "facebook.com",
      driverInstagram: "instagram",
      driverLinkedIn: "linkedIn.com",
      driverTumblr: "tumblr.com",
      driverTwitter: "twitter.com"
    }
  }
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    // this.userName = this.route.snapshot.params["userName"];
    this.fetchGroups();
    this.fetchCountries();
    this.fetchYards();
    // this.fetchUser();
    this.fetchDriver();
    this.fetchCycles();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
    $(document).ready(() => {
      this.form = $('#form1_').validate();
    });
  }

  fetchCycles() {
    this.apiService.getData("cycles").subscribe((result: any) => {
      this.cycles = result.Items;
    });
  }

  /**
   * fetch User data
   */
  // fetchUser() {
  //   this.apiService
  //     .getData(`users/${this.userName}`)
  //     .subscribe((result: any) => {
  //       result = result.Items[0];

  //       this.userType = result.userType;
  //       this.password = result.password;
  //       this.firstName = result.firstName;
  //       this.lastName = result.lastName;
  //       this.address = result.address;
  //       this.phone = result.phone;
  //       this.email = result.email;
  //       this.groupID = result.groupID;
  //       this.loginEnabled = result.loginEnabled;
  //       this.timeCreated = result.timeCreated;
  //     });
  // }

  fetchGroups() {
    this.apiService.getData("groups").subscribe((result: any) => {
      this.groups = result.Items;
    });
  }

  fetchCountries() {
    this.apiService.getData("countries").subscribe((result: any) => {
      this.countries = result.Items;
    });
  }

  fetchYards() {
    this.apiService.getData("yards").subscribe((result: any) => {
      this.yards = result.Items;
    });
  }

  getStates() {
    this.apiService
      .getData("states/country/" + this.driverLicenseCountry)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  fillCountry() {
    this.apiService
      .getData("states/" + this.licence.driverLicenseStateID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.driverLicenseCountry = result.countryID;
      });

    setTimeout(() => {
      this.getStates();
    }, 2000);
  }

  /**
   * fetch driver data
   */
  addGroup(){
    this.errors = {};
      this.hasError = false;
      this.hasSuccess = false;
      const data1 = {
        groupNameModal: this.groupNameModal
      };
      console.log(data1);
  }
  fetchDriver() {

    // this.apiService
    //   .getData(`drivers/userName/${this.userName}`)
    //   .subscribe((result: any) => {
    //     result = result.Items[0];
    this.basic = {
      driverType: this.mockData.basic.driverType,
      employeeID: this.mockData.basic.employeeID,
      companyID: this.mockData.basic.companyID,
      userName: this.mockData.basic.userName,
      password: this.mockData.basic.password,
      firstName: this.mockData.basic.firstName,
      lastName: this.mockData.basic.lastName,
      driverID: this.mockData.basic.driverID,
      driverGender: this.mockData.basic.driverGender,
      phone: this.mockData.basic.phone,
      email: this.mockData.basic.email,
      groupID: this.mockData.basic.groupID,
    };
    this.address = {
      addressType: this.mockData.address.addressType,

      driverCountry: this.mockData.address.driverCountry,
      driverStateID: this.mockData.address.driverStateID,
      driverCityID: this.mockData.address.driverCityID,
      addressZip: this.mockData.address.addressZip,
      driverAddress1: this.mockData.address.driverAddress1,
      driverAddress2: this.mockData.address.driverAddress2,
    };
    this.payment = {
      driverPayType: this.mockData.payment.driverPayType,
      driverPerHourRate: this.mockData.payment.driverPerHourRate,
      driverLoadedMiles: this.mockData.payment.driverLoadedMiles,
      driverEmptyMiles: this.mockData.payment.driverEmptyMiles,
      calculateEmptyMiles: this.mockData.payment.calculateEmptyMiles,
      driverLoadPercentage: this.mockData.payment.driverLoadPercentage.toString(),
      driverLoadPercentageOf: this.mockData.payment.driverLoadPercentageOf,
    };
    this.licence = {
      driverContractStart: JSON.stringify(this.mockData.licence.driverContractStart),
      driverContractEnd: this.mockData.licence.driverContractEnd.toString(),
      driverMedicalRenewal: this.mockData.licence.driverMedicalRenewal.toString(),
      driverLicenseNumber: this.mockData.licence.driverLicenseNumber,
      driverBirthDate: this.mockData.licence.driverBirthDate.toString(),
      driverLicenseExpiry: this.mockData.licence.driverLicenseExpiry.toString(),
      driverLicenseStateID: this.mockData.licence.driverLicenseStateID,
      driverVehicleType: this.mockData.licence.driverVehicleType,
    };
    this.HOSCompliance = {
      status: this.mockData.HOSCompliance.status,
      type: this.mockData.HOSCompliance.type,
      cycleID: this.mockData.HOSCompliance.cycleID,
      yardID: this.mockData.HOSCompliance.yardID,
      driverAllowPC: this.mockData.HOSCompliance.driverAllowPC,
      driverAllowYM: this.mockData.HOSCompliance.driverAllowYM,
      exemptedNotes: this.mockData.HOSCompliance.exemptedNotes
    };
    this.emergencyContact = {
      emergencyContactName: this.mockData.emergencyContact.emergencyContactName,
      emergencyContactPhone: this.mockData.emergencyContact.emergencyContactPhone,
      emergencyContactAddress: this.mockData.emergencyContact.emergencyContactAddress,
      emergencyContactRelationship: this.mockData.emergencyContact.emergencyContactRelationship,
      emergencyContactEmail: this.mockData.emergencyContact.emergencyContactEmail,
    };
    this.additionalDetails = {
      driverFacebook: this.mockData.additionalDetails.driverFacebook,
      driverInstagram: this.mockData.additionalDetails.driverInstagram,
      driverBlog: this.mockData.additionalDetails.driverBlog,
      driverTumblr: this.mockData.additionalDetails.driverTumblr,
      driverTwitter: this.mockData.additionalDetails.driverTwitter,
      driverLinkedIn: this.mockData.additionalDetails.driverLinkedIn,
      additionalNotes: this.mockData.additionalDetails.additionalNotes
    };
  

    setTimeout(() => {
      this.fillCountry();
    }, 2000);

  }

  updateDriver() {
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
      driverLoadedMiles : this.payment.driverLoadedMiles,
      driverEmptyMiles : this.payment.driverEmptyMiles,
      calculateEmptyMiles : this.payment.calculateEmptyMiles,
      driverLoadPercentage : this.payment.driverLoadPercentage,
      driverLoadPercentageOf : this.payment.driverLoadPercentageOf,
     },
      licence: {
        driverContractStart: this.licence.driverContractStart,
        driverContractEnd: this.licence.driverContractEnd,
        driverMedicalRenewal:this.licence.driverMedicalRenewal,
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
        emergencyContactName : this.emergencyContact.emergencyContactName,
        emergencyContactPhone : this.emergencyContact.emergencyContactPhone,
        emergencyContactAddress : this.emergencyContact.emergencyContactAddress,
        emergencyContactRelationship : this.emergencyContact.emergencyContactRelationship,
        emergencyContactEmail : this.emergencyContact.emergencyContactEmail,
      },
      additionalDetails: {
        driverFacebook: this.additionalDetails.driverFacebook,
        driverInstagram: this.additionalDetails.driverInstagram,
        driverBlog: this.additionalDetails.driverBlog,
        driverTumblr: this.additionalDetails.driverTumblr,
        driverTwitter: this.additionalDetails.driverTwitter,
        driverLinkedIn: this.additionalDetails.driverLinkedIn,
        additionalNotes: this.additionalDetails.additionalNotes
      },
      
    };
    console.log(data);
    return;
    this.apiService.putData("users", data).subscribe({
      complete: () => { },
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];

              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[key] = val.message;
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
        this.Success = "Driver updated successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
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
    // Driver Gender Value
onChangeDriverGender(value: any){
  this.basic.driverGender = value;
  console.log(value);

}
onChangeDriverType(value: any){
  this.basic.driverType = value;
  console.log(value);

}
}
