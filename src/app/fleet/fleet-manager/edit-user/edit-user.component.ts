import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../api.service";
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { Object } from "aws-sdk/clients/s3";
declare var $: any;

@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.css"],
})
export class EditUserComponent implements OnInit {
  parentTitle = "Users";
  title = "Edit Fleet Manager";
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
  timeCreated = "";

  groups = [];
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.userName = this.route.snapshot.params["userName"];
    this.fetchUser();
    this.fetchGroups();
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  fetchGroups() {
    this.apiService.getData("groups").subscribe((result: any) => {
      this.groups = result.Items;
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
      groupID: this.groupID,
      loginEnabled: this.loginEnabled,
      timeCreated: this.timeCreated,
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
              console.log(key);
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
        this.Success = "User updated successfully";
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
