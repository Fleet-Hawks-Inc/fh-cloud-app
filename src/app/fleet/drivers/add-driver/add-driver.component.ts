import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {from, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Object} from 'aws-sdk/clients/s3';
import {ApiService} from '../../../api.service';
import { Auth } from "aws-amplify";
declare var $: any;

@Component({
  selector: "app-add-driver",
  templateUrl: "./add-driver.component.html",
  styleUrls: ["./add-driver.component.css"],
})
export class AddDriverComponent implements OnInit {
  title = "Add Driver";
  errors = {};
  form;
  concatArrayKeys = '';
  /**
   * Form Props
   */
  userType = "driver"; //default
  userName = "";
  password = "";
  firstName = "";
  lastName = "";
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



  driverLicenseCountry = "";
  groups = [];
  countries = [];
  states = [];
  yards = [];
  cycles = [];
  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchGroups();
    this.fetchCountries();
    this.fetchYards();
    this.fetchCycles();
    this.getToday();
    $(document).ready(() => {
      this.form = $('#form_').validate();
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
      });
  }

  fetchYards() {
    this.apiService.getData('yards')
      .subscribe((result: any) => {
        this.yards = result.Items;
      });
  }

  getStates() {
    this.apiService.getData('states/country/' + this.driverLicenseCountry)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }
  addDriver() {
    this.register();
    this.errors = {};
    const data = {
      userType: this.userType,
      userName: this.userName,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      phone: this.phone,
      email: this.email,
      groupID: this.groupID,
      loginEnabled: this.loginEnabled,
      driverNumber: this.driverNumber,
      driverLicenseNumber: this.driverLicenseNumber,
      driverLicenseType: this.driverLicenseType,
      driverLicenseExpiry: this.driverLicenseExpiry,
      driverLicenseStateID: this.driverLicenseStateID,
      HOSCompliance: {
        status: this.HOSCompliance.status,
        type: this.HOSCompliance.type,
        cycleID: this.HOSCompliance.cycleID,
      },
      defaultContract: {
        perMile: this.defaultContract.perMile,
        team: this.defaultContract.team,
        hourly: this.defaultContract.hourly,
        pickOrDrop: this.defaultContract.pickOrDrop,
      },
      fixed: {
        amount: this.fixed.amount,
        type: this.fixed.type,
      },
      yardID: this.yardID,
    };

    this.apiService.postData('users', data).subscribe({
      complete: () => {},
      error : (err) => {
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

        this.userName = "";
        this.password = "";
        this.firstName = "";
        this.lastName = "";
        this.address = "";
        this.phone = "";
        this.email = "";
        this.groupID = "";
        this.loginEnabled = true;
        this.driverNumber = "";
        this.driverLicenseNumber = "";
        this.driverLicenseType = "";
        this.driverLicenseExpiry = "";
        this.driverLicenseStateID = "";
        this.HOSCompliance = {
          status: "",
          type: "",
          cycleID: "",
        };
        this.defaultContract = {
          perMile: "",
          team: "",
          hourly: "",
          pickOrDrop: "",
        };
        this.fixed = {
          amount: "",
          type: "",
        };
        this.yardID = "";
        this.driverLicenseCountry = "";
        this.groups = [];
        this.countries = [];
        this.states = [];
        this.yards = [];
        this.cycles = [];
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
        password: this.password,
        username: this.userName,
        attributes: {
          email: this.email,
          phone_number: this.phone,
        },
      });     

      console.log(res);
    } catch (err) {
      console.log("inside catch block");
      // this.hasError = true;  
      // this.Error = err.message || 'Error during login';
    }
  };
  
}
