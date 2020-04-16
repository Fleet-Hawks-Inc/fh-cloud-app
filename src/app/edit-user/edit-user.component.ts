import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";

@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.css"],
})
export class EditUserComponent implements OnInit {
  title = "Edit Fleet Manager";

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
        this.group = result.group;
        this.loginEnabled = result.loginEnabled;
        this.timeCreated = result.timeCreated;
      });
  }

  updateUser() {
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
      timeCreated: this.timeCreated,
    };
    // console.log(data);return;
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
        this.Success = "Manager updated successfully";
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
  }

  updateValidation(first, second = "") {
    if (second == "") {
      this.validationErrors[first].error = false;
    } else {
      this.validationErrors[first][second].error = false;
    }
  }
}
