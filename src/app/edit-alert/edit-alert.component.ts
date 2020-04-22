import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";
declare var $: any;

@Component({
  selector: 'app-edit-alert',
  templateUrl: './edit-alert.component.html',
  styleUrls: ['./edit-alert.component.css']
})
export class EditAlertComponent implements OnInit {
  title = "Edit Alert";

  errors = {};
  form;

  /********** Form Fields ***********/

  alertID = "";
  groupID = "";
  parameter = "";
  condition = "";
  value = "";
  timeCreated = "";

  groups = [];
  /******************/

  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.alertID = this.route.snapshot.params['alertID'];

    this.fetchGroups();
    this.fetchAlert();
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  fetchGroups(){
    this.apiService.getData('groups')
      .subscribe((result: any) => {
        this.groups = result.Items;
      });
  }

  fetchAlert(){
    this.apiService.getData('alerts')
      .subscribe((result: any) => {
        result = result.Items[0];
        this.groupID = result.groupID;
        this.parameter = result.parameter;
        this.condition = result.condition;
        this.value = result.value;
        this.timeCreated = result.timeCreated;
      });
  }

  updateAlert() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      alertID: this.alertID,
      groupID: this.groupID,
      parameter: this.parameter,
      condition: this.condition,
      value: this.value,
      timeCreated: this.timeCreated
    };

    this.apiService.putData("alerts", data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe((val) => {
            this.throwErrors();
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Alert updated successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
