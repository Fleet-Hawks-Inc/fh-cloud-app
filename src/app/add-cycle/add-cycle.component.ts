import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";
declare var $: any;

@Component({
  selector: "app-add-cycle",
  templateUrl: "./add-cycle.component.html",
  styleUrls: ["./add-cycle.component.css"],
})
export class AddCycleComponent implements OnInit {
  title = "Add Cycles";

  errors = {};
  form;

  /********** Form Fields ***********/

  cycleName = "";
  continuousDriveTime = "";
  minimumSubBreakTime = "";
  totalDays = "";
  continuousBreak = "";
  totalDriveTime = "";
  cycleChangeBreakHours = "";
  totalCycleDriveTime = "";
  totalOnDutyTime = "";
  totalCycleOnDutyTime = "";
  geofenceParams: "";

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

  addCycle() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      cycleName: this.cycleName,
      continuousDriveTime: this.continuousDriveTime,
      minimumSubBreakTime: this.minimumSubBreakTime,
      totalDays: this.totalDays,
      continuousBreak: this.continuousBreak,
      totalDriveTime: this.totalDriveTime,
      cycleChangeBreakHours: this.cycleChangeBreakHours,
      totalCycleDriveTime: this.totalCycleDriveTime,
      totalOnDutyTime: this.totalOnDutyTime,
      totalCycleOnDutyTime: this.totalCycleOnDutyTime,
      geofenceParams: this.geofenceParams,
    };

    this.apiService.postData("cycles", data).subscribe({
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
        this.cycleName = "";
        this.continuousDriveTime = "";
        this.minimumSubBreakTime = "";
        this.totalDays = "";
        this.continuousBreak = "";
        this.totalDriveTime = "";
        this.cycleChangeBreakHours = "";
        this.totalCycleDriveTime = "";
        this.totalOnDutyTime = "";
        this.totalCycleOnDutyTime = "";
        this.geofenceParams = "";

        this.response = res;
        this.hasSuccess = true;
        this.Success = "Cycle Added successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
