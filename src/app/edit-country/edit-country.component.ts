import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { ActivatedRoute } from "@angular/router";
import { from } from "rxjs";
import { map } from "rxjs/operators";
declare var $: any;
@Component({
  selector: "app-edit-country",
  templateUrl: "./edit-country.component.html",
  styleUrls: ["./edit-country.component.css"],
})
export class EditCountryComponent implements OnInit {
  title = "Edit Countries";

  errors = {};
  form;

  /********** Form Fields ***********/

  countryID = "";
  countryCode = "";
  countryName = "";
  timeCreated = "";

  /******************/

  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.countryID = this.route.snapshot.params["countryID"];

    this.apiService
      .getData("countries/" + this.countryID)
      .subscribe((result: any) => {
        //console.log(result);
        result = result.Items[0];
        this.countryCode = result.countryCode;
        this.countryName = result.countryName;
        this.timeCreated = result.timeCreated;
      });

    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  addCountry() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      countryID: this.countryID,
      countryCode: this.countryCode,
      countryName: this.countryName,
      timeCreated: this.timeCreated,
    };
  
    this.apiService.putData("countries", data).subscribe({
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
        this.Success = "Country Updated successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
