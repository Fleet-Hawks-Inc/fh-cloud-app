import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ApiService } from "../../../api.service";
import {BehaviorSubject, combineLatest, from, merge, of, zip} from 'rxjs';
import {concatAll, concatMap, map, mergeMap, shareReplay, tap} from 'rxjs/operators';
import {  ActivatedRoute } from "@angular/router";
// import {ToastrService} from 'ngx-toastr';
import * as moment from "moment";
import * as _ from "lodash";
import {split} from 'ts-node';
declare var $: any;

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.css"],
})
export class EditComponent implements OnInit, OnDestroy {
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

  eventID = "";
  fromTime = "";
  toTime = "";
  eventType = "";


  /**
   * New Vars
   *
   ***/
    timeClash : boolean = true;
    initialDayTime = '';
    endDayTime = '';
    sharedData$;
    //startTimes : BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    //endTimes : BehaviorSubject <any[]> = new BehaviorSubject<any[]>([]);
    startTimes  = [];
    endTimes  = [];
    @ViewChild('fromtime_', {static: false}) fromTime_ : ElementRef;
    @ViewChild('toTime_', {static: false}) toTime_ : ElementRef;
    fromTimeStamp;
    toTimeStamp;



  constructor(private route: ActivatedRoute,
              private apiService: ApiService) {}

  ngOnInit() {
    this.userName = this.route.snapshot.params["userName"];
    this.selectedDate = this.route.snapshot.params["eventDate"];

    this.lastDayEvent();
  }

  lastDayEvent() {
    this.lastEvent =  {};
  
    this.duties = [];
    this.eventList = [];
    this.accumulatedOFF = 0;
    this.accumulatedSB = 0;
    this.accumulatedD = 0;
    this.accumulatedON = 0;
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

    this.sharedData$ = this.apiService
      .getData(
        `eventLogs/HOSDetail?userName=${this.userName}&eventDate=${this.selectedDate}`
      )
      .pipe(
        tap((r) => this.eventList = r[0][this.selectedDate].eventList),
        shareReplay(0));


    /**
     * For refineDutyStatusData()
     */
    this.sharedData$
      .pipe(map((result) => {
        return result[0][this.selectedDate].dutyCycleChanges;
      }))
      .subscribe((result) => {
        this.refineDutyStatusData(result);
        });


    /**
     * For refineAccumlatedData()
     */
    this.sharedData$
      .pipe(map((result) => {
        return result[0][this.selectedDate].accumlatedHOS;
      }))
      .subscribe((result) => {
        this.refineAccumlatedData(result);
        });


    /**
     * For initdaytime and EndDayTime
     **/
    this.sharedData$
      .pipe(map((result) => {
        return result[0][this.selectedDate].eventList;
      }))
      .subscribe((result) => {
        /****
         * Set Both Times
         *****/
        this.initialDayTime = result[0].time;
        this.endDayTime = result[result.length - 1 ].time;
        /********************************/


        /**
         * Keep a track of all the start and end times
         */
        const allValues$ = from(result);
        allValues$.subscribe((r: any) => {
          this.startTimes.push(r.time);
          this.endTimes.push(r.toTime);
          });
        /******************************/
      });

    // this.sharedData$.subscribe((result) => {
    //   console.log(result);
    //
    //   for (let i = 0; i < result.length; i++) {
    //     for (const key in result[i]) {
    //       if (result[i].hasOwnProperty(key)) {
    //         //add event list localy
    //         //this.eventList = result[i][key].eventList;
    //         //console.log(this.eventList);
    //         //Add duty status data
    //         this.refineDutyStatusData(result[i][key].dutyCycleChanges);
    //
    //         //Add accumulated data
    //         this.refineAccumlatedData(result[i][key].accumlatedHOS);
    //       }
    //     }
    //   }
    // });






       // map((result) =>  result.time ) )
      //.subscribe((result: any) => {
      //  console.log(result);



        // for (let i = 0; i < result.length; i++) {
        //   for (const key in result[i]) {
        //     if (result[i].hasOwnProperty(key)) {
        //       //add event list localy
        //       this.eventList = result[i][key].eventList;
        //       //console.log(this.eventList);
        //       //Add duty status data
        //       this.refineDutyStatusData(result[i][key].dutyCycleChanges);
        //
        //       //Add accumulated data
        //       this.refineAccumlatedData(result[i][key].accumlatedHOS);
        //     }
        //   }
        // }

       //


     // });


  }

  isTimeClashes_() {
    this.timeClash = false;
    //console.log(this.fromTime_.nativeElement.value + ' ' + this.toTime_.nativeElement.value);
    this.eventType = $('#eventType').val();
    this.fromTime = $('#fromTime').val();
    this.toTime = $('#toTime').val();
    if (this.eventType === null || this.fromTime === '' || this.toTime === '') {
      // this.toastr.error('Error', 'Please Choose Event Type', {
      //   timeOut: 3000
      // });
      alert('Please Fill All The Fields');

      return true;
    }



    /*
    ** Moment Instance
     */
    const format = 'HH:mm:ss';
    let tt = moment(this.toTime , format);
    let ft = moment(this.fromTime, format);
    let iTt = moment(this.initialDayTime, format);
    let eFt = moment(this.endDayTime, format);
    /******************/




    // /*********E2E LOGIC *************/
    //
    // /**
    //  * First Logic
    //  * If The Dates Are Valid From The User
    //  */
    // if (!tt.isBetween(iTt, eFt) || !ft.isBetween(iTt, eFt)) {
    //   console.log('E2E dates true');
    // }
    // /**
    //  * If The Dates Are InValid From The User
    //  */
    // else {
    //   console.log('E2E dates false');
    // }
    //
    // /*********************************/


    /**
     * Second Logic
     * Iterate Over All The Values
     */

    merge(of(this.startTimes) , of(this.endTimes))
      .subscribe(
        (v) => {
          if (moment(v[0] , format).isValid() && moment(v[1] , format).isValid()) {

          /*
          ** Moment Instance
          */
          const iTt_ = moment(v[0], format);
          const eFt_ = moment(v[1], format);

          if (tt.isBetween(iTt_, eFt_) || ft.isBetween(iTt_, eFt_)) {
            this.timeClash = true;
          }
          }
      });

    if (this.timeClash) {
      // this.toastr.error('Error', 'Time Is Clashing With Other Events', {
      //   timeOut: 3000
      // });
      alert('Your Time is Clashing With Your Logs, Please Remove Logs that are coming in between.');

    }


    return this.timeClash;

  }

  addEvent() {
    //check if entered time clashes with others

    //console.log(this.selectedDate);

    if (!this.isTimeClashes_()) {

      //  /**
     //  *Unix
     // */
     //  moment(explodedDate[2] + '-' + explodedDate[1] + '-' + explodedDate[0] + ' ' + this.fromTime).format('X');
     //
     //  /**
     //   *With MilliSecconds
     //   */
     //  moment(explodedDate[2] + '-' + explodedDate[1] + '-' + explodedDate[0] + ' ' + this.fromTime).unix('x');

      const explodedDate = this.selectedDate.split('-');

      this.fromTimeStamp = moment(explodedDate[2] + '-' + explodedDate[1] + '-' + explodedDate[0] + ' ' + this.fromTime).unix();

      this.toTimeStamp = moment(explodedDate[2] + '-' + explodedDate[1] + '-' + explodedDate[0] + ' ' + this.toTime).unix();

      console.log('from unix timestamp ' + this.fromTimeStamp);
      console.log('to unix timestamp ' + this.toTimeStamp);

      // this.toastr.success('Success', 'Event Successfully Saved', {
      //   timeOut: 3000
      // });

      const data = {
        HOSEventDescription: this.eventType,
        fromTime: this.fromTime,
        toTime: this.toTime,
        eventDate: this.selectedDate,
        userName: this.userName,
        fromTimeStamp : this.fromTimeStamp,
        toTimeStamp: this.toTimeStamp
      };

      console.log(data);
      this.apiService
        .postData('eventLogs/HOSAddAndModify', data)
        .subscribe((result: any) => {
          $('#editEventModal').modal('hide');
          this.lastDayEvent();
        });

     // $('#editEventModal').modal('hide');

    }

  }


  changeFormat(newDate: any) {
    let day = newDate.format("DD");
    let month = newDate.format("MM");
    let year = newDate.format("YYYY");
    return `${day}-${month}-${year}`;
  }

  /**
   * Conside "YM" as "ON" and "PC" as "OFF"
   * @param type : string
   */
  setType(type: string) {
    if (type === 'YM') {
      return 'ON';
    } else if (type === 'PC') {
      return 'OFF';
    } else {
      return type;
    }
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
          status: data[j].status,
          nextStart,
        });
      } else {
        this.duties.push({
          type: this.setType(data[j].type),
          time: Math.round(data[j].time / 60), //convert to minutes
          status: data[j].status,
          nextStart,
        });
      }
    }

    console.log(this.duties);
    console.log(this.lastEvent);
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

  deleteModal(eventID) {
    this.eventID = eventID;

    $(document).ready(function () {
      $("#deleteEventModal").modal("show");
    });
  }

  //update the status to "INACTIVE_CHANGE_REQUESTED: 3"
  deleteEvent() {
    this.apiService
      .getData("eventLogs/HOSUpdateStatus/" + this.eventID)
      .subscribe((result: any) => {
        $("#deleteEventModal").modal("hide");
        this.lastDayEvent();
      });
  }

  editModal() {
    $(document).ready(function () {
      $('#editEventModal').modal('show');
    });
  }







  isTimeClashes() {
    if (this.toTime < this.fromTime) {
      alert("To time must be greater than From time");
      return false;
    } else if (this.fromTime === this.toTime) {
      alert("From and To must not be equal.");
      return false;
    }

    console.log(this.fromTime);
    console.log(this.toTime);
    let list = this.eventList;
    for (var i = 0; i < list.length; i++) {


     console.log('you need to remove between '+ list[i].time + ' ' + list[i].toTime);
    }
  }

  ngOnDestroy() {
    //this.sharedData$.unsubscribe();
  }


}
