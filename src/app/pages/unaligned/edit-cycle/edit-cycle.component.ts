import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";
declare var $: any;

@Component({
  selector: "app-edit-cycle",
  templateUrl: "./edit-cycle.component.html",
  styleUrls: ["./edit-cycle.component.css"],
})
export class EditCycleComponent implements OnInit {
  title = "Edit Cycle";

  errors = {};
  form;

  /********** Form Fields ***********/
  cycleID = "";
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
  timeCreated = "";
  /******************/

  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.cycleID = this.route.snapshot.params["cycleID"];
    this.fetchCycle();
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  fetchCycle() {
    this.apiService
      .getData("cycles/" + this.cycleID)
      .subscribe((result: any) => {
        result = result.Items[0];

        this.cycleName = result.cycleName;
        this.continuousDriveTime = result.continuousDriveTime;
        this.minimumSubBreakTime = result.minimumSubBreakTime;
        this.totalDays = result.totalDays;
        this.continuousBreak = result.continuousBreak;
        this.totalDriveTime = result.totalDriveTime;
        this.cycleChangeBreakHours = result.cycleChangeBreakHours;
        this.totalCycleDriveTime = result.totalCycleDriveTime;
        this.totalOnDutyTime = result.totalCycleOnDutyTime;
        this.totalCycleOnDutyTime = result.totalCycleOnDutyTime;
        this.geofenceParams = result.geofenceParams;
        this.timeCreated = result.timeCreated;
      });
  }

  updateCycle() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      cycleID: this.cycleID,
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
      timeCreated: this.timeCreated,
    };

    this.apiService.putData("cycles", data).subscribe({
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
        this.Success = "Cycle updated successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
