import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
import * as moment from "moment";
import * as _ from "lodash";
declare var $: any;
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from "@angular/common";
import {CachedService} from "../../../cached.service";

@Component({
  selector: "app-detailed",
  templateUrl: "./detailed.component.html",
  styleUrls: ["./detailed.component.css"],
})
export class DetailedComponent implements OnInit {
  //graph general props
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
  userName = "";
  fromDate: any  = "";
  toDate: any = "";
  selectedDate = "";
  duties = [];
  eventList = [];
  accumulatedOFF = 0;
  accumulatedSB = 0;
  accumulatedD = 0;
  accumulatedON = 0;

  formattedFromDate: any = "";
  formattedToDate: any = "";

  constructor(private apiService: ApiService,
              private parserFormatter: NgbDateParserFormatter,
              private cachedService: CachedService) {

    // this.formattedToDate = this.datePipe.transform(new Date(),  'dd-MM-yyyy');
    // this.formattedFromDate = moment(this.datePipe.transform(new Date(), 'yyyy-MM-dd').toString()).subtract(15 , 'days').format('DD-MM-YYYY');

    //this.getInitialLogs();


  }

  ngOnInit() {
    this.fetchDrivers();
    //this.getLogs();
  }



  getInitialLogs() {
    this.getLogs();
  }


  getFilteredLogs() {
    /**
     * this.fromDate and this.toDate are objects need to format them
     */
    this.formattedFromDate  = moment(this.parserFormatter.format(this.fromDate)).format('DD-MM-YYYY');
    this.formattedToDate = moment(this.parserFormatter.format(this.toDate)).format('DD-MM-YYYY');
    this.getLogs();
  }

  fetchDrivers() {
    // this.apiService
    //   .getData("users/userType/driver")
    //   .subscribe((result: any) => {
    //     this.drivers = result.Items;
    //   });

    this.cachedService.resolveDriver("users/userType/driver" ,"drivers").subscribe((result: any) => {
      this.drivers = result.Items;
    });
  }

  private getLogs() {
    // let from = moment(this.fromDate).format("DD-MM-YYYY");
    // let to = moment(this.toDate).format("DD-MM-YYYY");

    this.apiService
      .getData(
        `eventLogs/HOSSummary?userName=${this.userName}&fromDate=${this.formattedFromDate}&toDate=${this.formattedToDate}`
      )
      .subscribe((result: any) => {
        this.logs = result;
      });
  }

  getData(date: string) {
    this.duties = [];
    this.accumulatedD = this.accumulatedOFF = this.accumulatedON = this.accumulatedSB = 0;
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
    if (!_.isEmpty(this.lastEvent)){
      let lastDayAccumulated = {
        type: this.setType(this.lastEvent.HOSEventDescription),
        time:this.calculateTimeDiffInSeconds(
          `${this.selectedDate} 00:00:00`,
          this.eventList[0].dateTime
        )
      }
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
