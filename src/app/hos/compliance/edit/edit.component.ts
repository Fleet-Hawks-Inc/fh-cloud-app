import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../api.service";
import { from, of } from "rxjs";
import * as moment from "moment";
import * as _ from "lodash";
declare var $: any;

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.css"],
})
export class EditComponent implements OnInit {
  //graph general props
  coordinates = 1292 / 24 / 60;
  types = {
    OFF: 40,
    SB: 117,
    D: 192,
    ON: 268,
  };

  title = "Driver Logs";
  lastEvent: any = {};
  userName = "";
  selectedDate = "";
  duties = [];
  eventList = [];
  accumulatedOFF = 0;
  accumulatedSB = 0;
  accumulatedD = 0;
  accumulatedON = 0;
  currentDate = moment().utc().format("DD-MM-YYYY");
  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.userName = this.route.snapshot.params["userName"];
    this.selectedDate = this.route.snapshot.params["eventDate"];

    this.lastDayEvent();
  }

  lastDayEvent() {
    let newDate = moment(this.selectedDate, "DD-MM-YYYY").subtract("days", 1);
    let lastDayDate = this.changeFormat(newDate);

    this.apiService
      .getData(
        `eventLogs/HOSLastDayEvent?userName=${this.userName}&eventDate=${lastDayDate}`
      )
      .subscribe((result: any) => {
        this.lastEvent = result;
        this.getGraphData();
      });
  }

  getGraphData() {
    this.apiService
      .getData(
        `eventLogs/HOSDetail?userName=${this.userName}&eventDate=${this.selectedDate}`
      )
      .subscribe((result: any) => {
        for (var i = 0; i < result.length; i++) {
          for (var key in result[i]) {
            if (result[i].hasOwnProperty(key)) {
              //add event list localy
              this.eventList = result[i][key].eventList;
              console.log(this.eventList);
              //Add duty status data
              this.refineDutyStatusData(result[i][key].dutyCycleChanges);

              //Add accumulated data
              this.refineAccumlatedData(result[i][key].accumlatedHOS);
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
  }

  calculateTimeDiffInMinutes(start: any, end: any) {
    let start_date = moment(start, "DD-MM-YYYY HH:mm:ss");
    let end_date = moment(end, "DD-MM-YYYY HH:mm:ss");
    let duration = moment.duration(end_date.diff(start_date));
    let diff = duration.asMinutes();
    return diff;
  }

  refineAccumlatedData(data: any) {
    //get the time difference from the beginning of the day to the first event of the today in seconds to calculate accumulated data
    if (!_.isEmpty(this.lastEvent)) {
      let lastDayAccumulated = {
        type: this.setType(this.lastEvent.HOSEventDescription),
        time: this.calculateTimeDiffInSeconds(
          `${this.selectedDate} 00:00:00`,
          this.eventList[0].dateTime
        ),
      };
      this.updateAccumulated(lastDayAccumulated);
    }

    //set types
    let refine = data.map((m) => {
      return {
        type: this.setType(m.type),
        time: m.time,
      };
    });

    //sum the same types
    let sum = _(refine)
      .groupBy("type")
      .map((objs, key) => ({
        type: key,
        time: _.sumBy(objs, "time"),
      }))
      .value();

    for (var i = 0; i < sum.length; i++) {
      this.updateAccumulated(sum[i]);
    }
  }

  updateAccumulated(data: any) {
    if (data.type == "OFF") this.accumulatedOFF += data.time;
    if (data.type == "SB") this.accumulatedSB += data.time;
    if (data.type == "D") this.accumulatedD += data.time;
    if (data.type == "ON") this.accumulatedON += data.time;
  }

  calculateTimeDiffInSeconds(start: any, end: any) {
    let start_date = moment(start, "DD-MM-YYYY HH:mm:ss");
    let end_date = moment(end, "DD-MM-YYYY HH:mm:ss");
    let duration = moment.duration(end_date.diff(start_date));
    let diff = duration.asSeconds();
    return diff;
  }
}
