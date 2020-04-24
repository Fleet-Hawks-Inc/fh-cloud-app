import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../api.service";
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
declare var $: any;
@Component({
  selector: "app-add-group",
  templateUrl: "./add-group.component.html",
  styleUrls: ["./add-group.component.css"],
})
export class AddGroupComponent implements OnInit {
  title = "Add Group";
  form;
  errors = {};
  /********** Form Fields ***********/
  groupName = "";
  description = "";
  groupType = "";

  /******************/



  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  addGroup() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      groupName: this.groupName,
      description: this.description,
      groupType: this.groupType,
    };

    this.apiService.postData("groups", data).subscribe({
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
        this.Success = "Group Added successfully";

        this.groupName = "";
        this.description = "";
        this.groupType = "";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
