import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
import * as moment from "moment";
import * as _ from "lodash";
declare var $: any;

@Component({
  selector: "app-detailed",
  templateUrl: "./detailed.component.html",
  styleUrls: ["./detailed.component.css"],
})
export class DetailedComponent implements OnInit {
  coordinates = 1292 / 24 / 60;
  types = {
    OFF: 40,
    SB: 117,
    D: 192,
    ON: 268,
  };

  title = "Logs";
  logDetails = [];
  lastEvent: any = {};
  logs = [];
  drivers = [];
  userName = "driveruser1";
  fromDate = "05-08-2020";
  toDate = "05-09-2020";
  selectedDate = "";
  duties = [];
  eventList = [];
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchDrivers();
//    this.getLogs();
  }

  fetchDrivers() {
    this.apiService
      .getData("users/userType/driver")
      .subscribe((result: any) => {
        this.drivers = result.Items;
      });
  }

  getLogs() {
    let from = moment(this.fromDate).format("DD-MM-YYYY");
    let to = moment(this.toDate).format("DD-MM-YYYY");

    this.apiService
      .getData(
        `eventLogs/HOSSummary?userName=${this.userName}&fromDate=${from}&toDate=${to}`
      )
      .subscribe((result: any) => {
        this.logs = result;
      });
  }

  getData(date: string) {
    this.duties = [];
    $(".toggle-content").hide("slow");
    if ($("#" + date).is(":visible")) {
      $("#" + date).hide("slow");
    } else {
      $("#" + date).show("slow");
    }

    this.selectedDate = date;
    this.lastDayEvent(date);
  }

  lastDayEvent(date: any) {
    let newDate = moment(date, "DD-MM-YYYY").subtract("days", 1);
    let lastDayDate = this.changeFormat(newDate);

    this.apiService
      .getData(
        `eventLogs/HOSLastDayEvent?userName=${this.userName}&eventDate=${lastDayDate}`
      )
      .subscribe((result: any) => {
        this.lastEvent = result;
        this.getGraphData(date);
      });
  }

  getGraphData(date) {
    this.apiService
      .getData(
        `eventLogs/HOSDetail?userName=${this.userName}&eventDate=${date}`
      )
      .subscribe((result: any) => {
        for (var i = 0; i < result.length; i++) {
          for (var key in result[i]) {
            if (result[i].hasOwnProperty(key)) {
              //add event list localy
              this.eventList = result[i][key].eventList;
              let length = result[i][key].eventList.length;
              //add current event localy
              // this.currentEvent = {
              //   id: result[i][key].eventList[length - 1].id,
              //   type: this.setType(result[i][key].eventList[length - 1].type),
              // };

              //Add duty status data
              this.refineDutyStatusData(result[i][key].dutyCycleChanges);

              //Add accumulated data
              // this.refineAccumlatedData(result[i][key].accumlatedHOS);

              // //add yesterday last event accumulated
              // this.addYesterdayLastEventAccumulated();

              // //decide last/current event accumulated data
              // this.lastEventAccumulatedData();
            }
          }
        }
      });
  }

  changeFormat(newDate: any) {
    var day = newDate.format("DD");
    var month = newDate.format("MM");
    var year = newDate.format("YYYY");
    return `${day}-${month}-${year}`;
  }

  /**
   * Conside "YM" as "ON" and "PC" as "OFF"
   * @param type : string
   */
  setType(type: string) {
    if (type == "YM") return "ON";
    else if (type == "PC") return "OFF";
    return type;
  }

  refineDutyStatusData(data: any) {
    //get the time difference from the beginning of the day to the first event

    let diff = this.calculateTimeDiffInMinutes(
      `${this.selectedDate} 00:00:00`,
      this.eventList[0].dateTime
    );

    //use this as start point of x for next event from the current
    let nextStart = diff;

    //first add the last event of yesterday if exists
    if (!_.isEmpty(this.lastEvent)) {
      //alert("here");
      this.duties.push({
        type: this.setType(this.lastEvent.HOSEventDescription),
        time: diff, //already in minutes
        nextStart,
      });
    }

    for (var j = 0; j < data.length; j++) {
      nextStart += Math.round(data[j].time / 60); //convert to minutes

      if (_.isEmpty(this.lastEvent) && j == 0) {
        this.duties.push({
          type: this.setType(data[j].type),
          time: diff, 
          nextStart,
        });
      } else {
        this.duties.push({
          type: this.setType(data[j].type),
          time: Math.round(data[j].time / 60), //convert to minutes
          nextStart,
        });
      }
    }

    //console.log(this.duties);
  }

  calculateTimeDiffInMinutes(start: any, end: any) {
    let start_date = moment(start, "DD-MM-YYYY HH:mm:ss");
    let end_date = moment(end, "DD-MM-YYYY HH:mm:ss");
    let duration = moment.duration(end_date.diff(start_date));
    let diff = duration.asMinutes();
    return diff;
  }
}
