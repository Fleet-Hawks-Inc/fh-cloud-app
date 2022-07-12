import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../../services/api.service";
import {  ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import {ActivatedRoute} from '@angular/router';
import * as moment from 'moment-timezone';
@Component({
  selector: "app-add-scheduler",
  templateUrl: "./add-scheduler.component.html",
  styleUrls: ["./add-scheduler.component.css"],
})
export class AddSchedulerComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute
  ) {}
  scheduler = {
    orderID: null,
    orderNumber: null,
    name: null,
    time: null,
    repeatType: null,
    type: {
      daysNo: "",
      days: [],
    },
    rangeType: null,
    dateRange: {
      to: null,
      from: null,
    },
    selectedMonths: [],
    timezone: null,
  };
  saveDisabled = false;
  repeatType = null;
  rangeDisabled = false;
  range = null;
  days = [
    { dName: "monday", isSelected: false },
    { dName: "tuesday", isSelected: false },
    { dName: "wednesday", isSelected: false },
    { dName: "thursday", isSelected: false },
    { dName: "friday", isSelected: false },
    { dName: "saturday", isSelected: false },
    { dName: "sunday", isSelected: false },
  ];
  months = [
    { mName: "january", isSelected: false },
    { mName: "february", isSelected: false },
    { mName: "march", isSelected: false },
    { mName: "april", isSelected: false },
    { mName: "may", isSelected: false },
    { mName: "june", isSelected: false },
    { mName: "july", isSelected: false },
    { mName: "august", isSelected: false },
    { mName: "september", isSelected: false },
    { mName: "october", isSelected: false },
    { mName: "november", isSelected: false },
    { mName: "december", isSelected: false },
  ];
  orders: any;
  schedulerID: any = "";
  async ngOnInit() {
    this.schedulerID = this.route.snapshot.params["scheduleID"];
    if (this.schedulerID) {
      this.fetchScheduleByID();
    }
    await this.fetchOrderList();
  }

  async fetchScheduleByID() {
    const result = await this.apiService
      .getData("orders/schedule/" + this.schedulerID)
      .toPromise();
    if (result && result.length > 0) {
      const data = result[0];
      console.log(data);
      this.scheduler.name = data.sName;
      this.scheduler.time = data.sTime;
      this.scheduler.dateRange.from = data.dateRange.from;
      this.scheduler.dateRange.to = data.dateRange.to;
      this.scheduler.orderID = data.orderID;
      this.scheduler.orderNumber = data.orderNumber;
      this.scheduler.type = data.sType ? data.sType : undefined;
      this.scheduler.timezone = data.timezone;
      (this.scheduler.selectedMonths = data.selectedMonths
        ? this.scheduler.selectedMonths
        : undefined),
        (this.range = data.sRange),
        (this.repeatType = data.repeatType);
      this.scheduler.selectedMonths = data.selectedMonths;
      if (this.scheduler.type.days && this.scheduler.type.days.length > 0) {
        for (const d of this.scheduler.type.days) {
          for (const day of this.days) {
            if (d === day.dName) {
              day.isSelected = true;
            }
          }
        }
      }
      if (
        this.scheduler.selectedMonths &&
        this.scheduler.selectedMonths.length > 0
      ) {
        for (const d of this.scheduler.selectedMonths) {
          for (const month of this.months) {
            if (d === month.mName) {
              month.isSelected = true;
            }
          }
        }
      }
      if (this.scheduler.type.days === undefined) {
        this.repeatType = "selectDaysNo";
      } else {
        this.repeatType = "days";
      }
    }
  }
  async fetchOrderList() {
    const orders = await this.apiService.getData("orders/get/list").toPromise();
    this.orders = orders;
  }
  onCheckboxChange(data, isChecked) {
    if (isChecked) {
      this.scheduler.type.days.push(data);
    } else {
      const index = this.scheduler.type.days.findIndex((x) => x == data);
      this.scheduler.type.days.splice(index, 1);
    }
  }

  onRangeCheckboxChange(value, isChecked) {
    if (isChecked) {
      this.scheduler.selectedMonths.push(value);
    } else {
      const index = this.scheduler.selectedMonths.findIndex((x) => x == value);
      this.scheduler.type.days.splice(index, 1);
    }
  }

  async updateScheduler() {
    this.saveDisabled = true;
    console.log(this.scheduler);
    if (this.scheduler.orderID)
      this.scheduler.orderNumber = this.orders[this.scheduler.orderID];

    if (this.scheduler.orderID == null || this.scheduler.orderNumber == null) {
      this.toastr.error("Reference Order is required");
      this.saveDisabled = false;
      return;
    }
    if (this.scheduler.name == null) {
      this.toastr.error("Scheduler Name is required");
      this.saveDisabled = false;
      return;
    }
    if (this.scheduler.time == null) {
      this.toastr.error("Scheduler Time is required");
      this.saveDisabled = false;
      return;
    }
    if (this.repeatType == null) {
      this.toastr.error("Repeat Type is required");
      this.saveDisabled = false;
      return;
    }
    if (this.range == null) {
      this.toastr.error("Range is required");
      this.saveDisabled = false;
      return;
    }
    if (this.repeatType == "selectDaysNo") {
      delete this.scheduler.type.days;
    } else if (this.repeatType == "days") {
      delete this.scheduler.type.daysNo;
    } else {
      delete this.scheduler.type;
    }

    if (this.range == "everyMonth") {
      delete this.scheduler.selectedMonths;
    }
    const scheduleData = {
      orderID: this.scheduler.orderID,
      orderNumber: this.scheduler.orderNumber,
      repeatType: this.repeatType,
      sName: this.scheduler.name,
      sType: this.scheduler.type ? this.scheduler.type : undefined,
      sTime: this.scheduler.time,
      dateRange: this.scheduler.dateRange,
      selectedMonth: this.scheduler.selectedMonths
        ? this.scheduler.selectedMonths
        : undefined,
      sRange: this.range,
      orderSK: `ORDSCH#` + this.schedulerID,
      timezone: this.scheduler.timezone,
      id: this.schedulerID,
    };
    this.apiService.putData("orders/schedule/update", scheduleData).subscribe({
      complete: () => {},
      error: (err) => {},
      next: (res) => {
        this.toastr.success("Schedule Updated successfully");
        this.location.back();
      },
    });
  }

  async saveScheduler() {
    this.saveDisabled = true;
    if (this.scheduler.orderID)
      this.scheduler.orderNumber = this.orders[this.scheduler.orderID];
    if (this.scheduler.orderID == null || this.scheduler.orderNumber == null) {
      this.toastr.error("Reference Order is required");
      this.saveDisabled = false;
      return;
    }
    if (this.scheduler.name == null) {
      this.toastr.error("Scheduler Name is required");
      this.saveDisabled = false;
      return;
    }
    if (this.scheduler.time == null) {
      this.toastr.error("Scheduler Time is required");
      this.saveDisabled = false;
      return;
    }
    if (this.repeatType == null) {
      this.toastr.error("Repeat Type is required");
      this.saveDisabled = false;
      return;
    }
    if (this.range == null) {
      this.toastr.error("Range is required");
      this.saveDisabled = false;
      return;
    }

    if (!this.scheduler.dateRange.from || !this.scheduler.dateRange.to) {
      this.toastr.error("Date Range is required");
      this.saveDisabled = false;
      return;
    } else if (this.scheduler.dateRange.to < this.scheduler.dateRange.from) {
      this.toastr.error("Date range from must be greater");
      this.saveDisabled = false;
      return;
    }
    if (this.range == "month") {
      if (this.scheduler.selectedMonths.length === 0) {
        this.toastr.error("Please Select at least 1 month");
        this.saveDisabled = false;
        return;
      }
    }

    if (this.repeatType == "selectDaysNo") {
      delete this.scheduler.type.days;
    } else if (this.repeatType == "days") {
      delete this.scheduler.type.daysNo;
    } else {
      delete this.scheduler.type;
    }

    if (this.range == "everyMonth") {
      delete this.scheduler.selectedMonths;
    }
    const scheduleData = {
      orderID: this.scheduler.orderID,
      orderNumber: this.scheduler.orderNumber,
      repeatType: this.repeatType,
      sName: this.scheduler.name,
      dateRange: this.scheduler.dateRange,
      sType: this.scheduler.type ? this.scheduler.type : undefined,
      selectedMonths: this.scheduler.selectedMonths
        ? this.scheduler.selectedMonths
        : undefined,
      sRange: this.range,
      sTime: this.scheduler.time,
      timezone: moment.tz.guess(),
    };

    this.apiService.postData("orders/schedule", scheduleData).subscribe({
      complete: () => {},
      error: (err) => {
        this.saveDisabled = false;
      },
      next: (res) => {
        this.toastr.success("Schedule added successfully");
        this.location.back();
      },
    });
  }
  back() {
    this.location.back();
  }
}
