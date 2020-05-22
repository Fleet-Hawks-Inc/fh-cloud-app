import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";
declare var $: any;
@Component({
  selector: "app-add-country",
  templateUrl: "./add-country.component.html",
  styleUrls: ["./add-country.component.css"],
})
export class AddCountryComponent implements OnInit {
  title = "Add Country";

  errors = {};
  form;

  /********** Form Fields ***********/

  countryCode = "";
  countryName = "";

  /******************/

  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  addCountry() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      countryCode: this.countryCode,
      countryName: this.countryName,
    };

    this.apiService.postData("countries", data).subscribe({
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
        this.countryCode = "";
        this.countryName = "";

        this.response = res;
        this.hasSuccess = true;
        this.Success = "Country Added successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
