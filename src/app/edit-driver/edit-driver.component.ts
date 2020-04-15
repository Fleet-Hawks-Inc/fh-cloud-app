import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-edit-driver",
  templateUrl: "./edit-driver.component.html",
  styleUrls: ["./edit-driver.component.css"],
})
export class EditDriverComponent implements OnInit {
  title = "Edit Driver";

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
  group = "";
  loginEnabled = true;

  driverID = "";
  driverNumber = "";
  driverLicenseNumber = "";
  driverLicenseType = "";
  driverLicenseExpiry = "";
  driverLicenseState = "";
  HOSCompliance = {
    status: "",
    type: "",
    cycle: "",
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
  homeTerminal = "";
  timeCreated = "";
  /**
   * Form errors prop
   */
  validationErrors = {
    userName: {
      error: false,
    },
    password: {
      error: false,
    },
    firstName: {
      error: false,
    },
    lastName: {
      error: false,
    },
    address: {
      error: false,
    },
    phone: {
      error: false,
    },
    email: {
      error: false,
    },
    group: {
      error: false,
    },
    loginEnabled: {
      error: false,
    },
    driverNumber: {
      error: false,
    },
    driverLicenseNumber: {
      error: false,
    },
    driverLicenseType: {
      error: false,
    },
    driverLicenseExpiry: {
      error: false,
    },
    driverLicenseState: {
      error: false,
    },
    HOSCompliance: {
      status: {
        error: false,
      },
      type: {
        error: false,
      },
      cycle: {
        error: false,
      },
    },
    defaultContract: {
      perMile: {
        error: false,
      },
      team: {
        error: false,
      },
      hourly: {
        error: false,
      },
      pickOrDrop: {
        error: false,
      },
    },
    fixed: {
      amount: {
        error: false,
      },
      type: {
        error: false,
      },
    },
    homeTerminal: {
      error: false,
    },
  };

  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.userName = this.route.snapshot.params["userName"];
    this.fetchUser();
    this.fetchDriver();
  }

  /**
   * fetch User data
   */
  fetchUser(){
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
        this.group = result.group;
        this.loginEnabled = result.loginEnabled;
        this.timeCreated = result.timeCreated;
      });
  }

  /**
   * fetch driver data
   */
  fetchDriver(){
    this.apiService
      .getData(`drivers/userName/${this.userName}`)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.driverID = result.driverID;
        this.driverNumber = result.driverNumber;
        this.driverLicenseNumber = result.driverLicenseNumber;
        this.driverLicenseType = result.driverLicenseType;
        this.driverLicenseExpiry = result.driverLicenseExpiry;
        this.driverLicenseState = result.driverLicenseState;
        this.HOSCompliance = {
          status: result.HOSCompliance.status,
          type: result.HOSCompliance.type,
          cycle: result.HOSCompliance.cycle
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
        this.homeTerminal = result.homeTerminal;
      });
  }

  updateDriver() {
    let data = {
      userType: this.userType,
      userName: this.userName,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      phone: this.phone,
      email: this.email,
      group: this.group,
      loginEnabled: this.loginEnabled,
      driverID: this.driverID,
      driverNumber: this.driverNumber,
      driverLicenseNumber: this.driverLicenseNumber,
      driverLicenseType: this.driverLicenseType,
      driverLicenseExpiry: this.driverLicenseExpiry,
      driverLicenseState: this.driverLicenseState,
      HOSCompliance: {
        status: this.HOSCompliance.status,
        type: this.HOSCompliance.type,
        cycle: this.HOSCompliance.cycle,
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
      homeTerminal: this.homeTerminal,
      timeCreated: this.timeCreated
    };
 //   console.log(data);return false;
    this.apiService.putData("users", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.mapErrors(err.error);
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Driver updated successfully";
      },
    });
  }

  mapErrors(errors) {
    for (var i = 0; i < errors.length; i++) {
      let key = errors[i].path;
      let length = key.length;

      //make array of message to remove the fieldName
      let message = errors[i].message.split(" ");
      delete message[0];

      //new message
      let modifiedMessage = `This field${message.join(" ")}`;

      if (length == 1) {
        //single object
        this.validationErrors[key[0]].error = true;
        this.validationErrors[key[0]].message = modifiedMessage;
      } else if (length == 2) {
        //two dimensional object
        this.validationErrors[key[0]][key[1]].error = true;
        this.validationErrors[key[0]][key[1]].message = modifiedMessage;
      }
    }
    console.log(this.validationErrors);
  }

  updateValidation(first, second = "") {
    if (second == "") {
      this.validationErrors[first].error = false;
    } else {
      this.validationErrors[first][second].error = false;
    }
  }
}

