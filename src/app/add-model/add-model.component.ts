import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";
declare var $: any;

@Component({
  selector: "app-add-model",
  templateUrl: "./add-model.component.html",
  styleUrls: ["./add-model.component.css"],
})
export class AddModelComponent implements OnInit {
  title = "Add Model";

  errors = {};
  form;

  /********** Form Fields ***********/

  name = "";
  manufacturerID = "";
  yearOfRelease = "";
  manufacturers = [];

  /******************/

  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.fetchManufacturers();
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  fetchManufacturers() {
    this.apiService.getData("manufacturers").subscribe((result: any) => {
      this.manufacturers = result.Items;
    });
  }

  addManufacturer() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      manufacturerID: this.manufacturerID,
      yearOfRelease: this.yearOfRelease,
      name: this.name,
    };

    this.apiService.postData("vehicleModels", data).subscribe({
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
        this.name = "";
        this.yearOfRelease = "";
        this.manufacturerID = "";

        this.response = res;
        this.hasSuccess = true;
        this.Success = "Model Added successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
