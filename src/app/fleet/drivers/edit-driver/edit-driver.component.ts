import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {ApiService} from '../../../api.service';
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { Object } from "aws-sdk/clients/s3";
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
  userType = "";
  userName = "";
  password = "";
  firstName = "";
  lastName = "";
  address = "";
  phone = "";
  email = "";
  groupID = "";
  loginEnabled = true;

  driverID = "";
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
  timeCreated = "";

  driverLicenseCountry = "";
  groups = [];
  countries = [];
  states = [];
  yards = [];
  cycles = [];

  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.userName = this.route.snapshot.params["userName"];
    this.fetchGroups();
    this.fetchCountries();
    this.fetchYards();
    this.fetchUser();
    this.fetchDriver();
    this.fetchCycles();
    $(document).ready(() => {
      this.form = $('#form_').validate();
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
  fetchUser() {
    this.apiService
      .getData(`users/${this.userName}`)
      .subscribe((result: any) => {
        result = result.Items[0];

        this.userType = result.userType;
        this.password = result.password;
        this.firstName = result.firstName;
        this.lastName = result.lastName;
        this.address = result.address;
        this.phone = result.phone;
        this.email = result.email;
        this.groupID = result.groupID;
        this.loginEnabled = result.loginEnabled;
        this.timeCreated = result.timeCreated;
      });
  }

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
      .getData("states/countryID/" + this.driverLicenseCountry)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  fillCountry() {
    this.apiService
      .getData("states/" + this.driverLicenseStateID)
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
  fetchDriver() {
    this.apiService
      .getData(`drivers/userName/${this.userName}`)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.driverID = result.driverID;
        this.driverNumber = result.driverNumber;
        this.driverLicenseNumber = result.driverLicenseNumber;
        this.driverLicenseType = result.driverLicenseType;
        this.driverLicenseExpiry = result.driverLicenseExpiry;
        this.driverLicenseStateID = result.driverLicenseStateID;
        this.HOSCompliance = {
          status: result.HOSCompliance.status,
          type: result.HOSCompliance.type,
          cycleID: result.HOSCompliance.cycleID,
        };
        this.defaultContract = {
          perMile: result.defaultContract.perMile,
          team: result.defaultContract.team,
          hourly: result.defaultContract.hourly,
          pickOrDrop: result.defaultContract.pickOrDrop,
        };
        this.fixed = {
          amount: result.fixed.amount,
          type: result.fixed.type,
        };
        this.yardID = result.yardID;
      });

    setTimeout(() => {
      this.fillCountry();
    }, 2000);
  }

  updateDriver() {
    this.errors = {};
    const data = {
      driverID: this.driverID,
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
      timeCreated: this.timeCreated
    };

    this.apiService.putData("users", data).subscribe({
      complete: () => {},
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
            error: () => {},
            next: () => {},
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
}
