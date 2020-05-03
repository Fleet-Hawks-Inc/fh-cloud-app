import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { Object } from "aws-sdk/clients/s3";
declare var $: any;

@Component({
  selector: "app-edit-item-group",
  templateUrl: "./edit-item-group.component.html",
  styleUrls: ["./edit-item-group.component.css"],
})
export class EditItemGroupComponent implements OnInit {
  title = "Edit Item Group";
  errors = {};
  form;
  concatArrayKeys = "";
  /********** Form Fields ***********/
  groupID = "";
  groupName = "";
  description = "";
  timeCreated = "";
  /******************/

  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.groupID = this.route.snapshot.params["groupID"];

    this.apiService
      .getData("itemGroups/" + this.groupID)
      .subscribe((result: any) => {
        result = result.Items[0];

        this.groupName = result.groupName;
        this.description = result.description;
        this.timeCreated = result.timeCreated;
      });

    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  updateGroup() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      groupID: this.groupID,
      groupName: this.groupName,
      description: this.description,
      timeCreated: this.timeCreated,
    };

    this.apiService.putData("itemGroups", data).subscribe({
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
        this.Success = "Item Group updated successfully";
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
