import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../api.service";

@Component({
  selector: "app-add-driver",
  templateUrl: "./add-driver.component.html",
  styleUrls: ["./add-driver.component.css"],
})
export class AddDriverComponent implements OnInit {
  title = "Add Driver";

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
  group = "";
  loginEnabled = true;
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

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    console.log(this.validationErrors);
  }

  addDriver() {
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
    };

    this.apiService.postData("users", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.mapErrors(err.error);
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Driver Added successfully";
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
