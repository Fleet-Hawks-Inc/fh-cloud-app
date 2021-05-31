import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-hos-chart',
  templateUrl: './hos-chart.component.html',
  styleUrls: ['./hos-chart.component.css']
})
export class HosChartComponent implements OnChanges {
  chartDataset: any[] = [];
  totalAccumulated = 0;
  coordinates = 759 / 24 / 60;
  timeTillInMinutes = 0;
  timeTillInSeconds = 0;
  currentEvent: any = {};
  eventList: any[] = [];
  dutyCycleChanges: any[] = [];

  accumulatedOFF = 0;
  accumulatedSB = 0;
  accumulatedD = 0;
  accumulatedON = 0;
  lastEventOfYesterday: any = {};
  lastEventYesterdayTimeInSeconds = 0;

  private destroy$ = new Subject();

  /**
   * from parent component
   */
  @Input() date: any;
  @Input() userName: any;

  currentDate = moment().format('DD-MM-YYYY');
  //* Charts JS Section
  public lineChartData: ChartDataSets[] = [
    {
      data: this.chartDataset,
      label: 'Duty Status',
      steppedLine: true,
      fill: false,
      borderColor: 'black'
    }

  ];

  /** Y Axis labels */
  public yLabels = {
    0.5: DutyStatus.ON,
    1.5: DutyStatus.D,
    2.5: DutyStatus.SB,
    3.5: DutyStatus.OFF
  }

  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions & { annotation: any } = {
    animation: {
      duration: 1000 * 1.5,
      easing: 'easeOutSine'
    },
    annotation: {},
    legend: {
      display: false,

    },
    tooltips: {
      callbacks: {
        labelColor: function (context) {
          return {
            borderColor: "rgb(0, 0, 255)",
            backgroundColor: "white",
            borderWidth: 2,
            borderDash: [2, 2],
            borderRadius: 2
          };
        },
        label: (tooltipItem): any => {
          switch (tooltipItem.yLabel) {
            case 1.5:
              return "Driving";
            case 0.5:
              return "ON Duty";
            case 2.5:
              return "Sleeper Birth";
            case 3.5:
              return "OFF Duty";
            default:
              return tooltipItem.yLabel;
          }
        }
      }
    },
    responsive: false,

    scales: {
      yAxes: [
        {
          gridLines: {
            color: 'gray',
            lineWidth: 1,
            zeroLineColor: "gray",
            zeroLineWidth: 1,
            offsetGridLines: false,
            drawBorder: true,
            drawTicks: false,


          },
          ticks: {
            padding: 10,
            beginAtZero: true,
            stepSize: 0.5,
            min: 0,
            max: 4,
            callback: function (value, index, values) {
              switch (value) {
                case 0:
                  return "";
                case 1:
                  return DutyStatus.ON;
                case 2:
                  return DutyStatus.D;
                case 3:
                  return DutyStatus.SB;
                case 4:
                  return DutyStatus.OFF;
              }
            }
          }
        }
      ],
      xAxes: [
        {
          position: "top",
          type: "time",
          gridLines: {
            color: 'gray',
            lineWidth: 1,
            zeroLineColor: "gray",
            zeroLineWidth: 1,
            offsetGridLines: false,
            drawBorder: true,
            drawTicks: false,


          },
          time: {
            parser: "HH:mm:ss",
            unit: "hour",

            displayFormats: {
              hour: "HH"
            }
          },
          ticks: {
            padding: 10,
            min: "00:00:00",
            max: "24:00:00",
            callback: function (value) {
              switch (value) {
                case "00":
                  return "M";
                case "12":
                  return "N";
                case "24":
                  return "M";
              }
              return value;
            }
          }
        }
      ]
    }
  };
  public lineChartColors: Color[] = [
    {

      backgroundColor: 'black',
    },
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  /*** Char JS section ends */
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  constructor(private apiService: ApiService) { }

  ngOnChanges(): void {
    this.plotHosGraph();
  }


  async plotHosGraph() {

    this.chartDataset = [];
    this.lineChartData[0].data = this.chartDataset;
    this.chart.update();
    this.emptyData();
    this.minutesElapsed();
    // Fetch yesterday event
    this.fetchLastEventYesterday();
    // Fetch current date events
    this.fetchEvents();

  }

  emptyData() {
    this.totalAccumulated = 0;
    this.timeTillInMinutes = 0;
    this.timeTillInSeconds = 0;
    this.currentEvent = {};
    this.eventList = [];
    this.dutyCycleChanges = [];
    this.accumulatedOFF = 0;
    this.accumulatedSB = 0;
    this.accumulatedD = 0;
    this.accumulatedON = 0;
    this.lastEventOfYesterday = {};
    this.lastEventYesterdayTimeInSeconds = 0;
  }


  /**
   * get last event of yesterday
   */
  async fetchLastEventYesterday() {
    let lastDayDate = moment(this.date).subtract(1, 'days').format("YYYY-MM-DD");

    this.apiService
      .getData(`compliance/hosLastDayEvent?userName=${this.userName}&eventDate=${lastDayDate}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.lastEventOfYesterday = result[0];
          const lastDayEvents = result[0];

          let dutyStatus;
          switch (lastDayEvents.hosEvntDesc) {
            case 'ON':
              dutyStatus = GraphDutyStatus.ON;
              break;
            case 'OFF':
              dutyStatus = GraphDutyStatus.OFF;
              break;
            case 'D':
              dutyStatus = GraphDutyStatus.D;
              break;
            case 'ON':
              dutyStatus = GraphDutyStatus.ON;
              break;
            default:
              break;
          }

          // construct last days events from start of the day
          // this.chartDataset.push({
          //   x: '00:00:00',
          //   y: dutyStatus
          // });

          // update last day event till current days time          
          this.lineChartData[0].data = this.chartDataset;
          this.chart.update();

        }
      });
  }
  /**
* get all todays events
*/
  async fetchEvents() {
    this.apiService
      .getData(`compliance/hosDetail?userName=${this.userName}&eventDate=${this.date}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        for (let i = 0; i < result.length; i++) {
          for (let key in result[i]) {
            if (result[i].hasOwnProperty(key)) {
              // Add event list localy
              this.eventList = result[i][key].eventList;

              /** refine events based to duty status */
              this.eventList.forEach(evnt => {
                if (evnt.type === DutyStatus.OFF) {
                  // Push Start time
                  this.chartDataset.push({
                    x: evnt.time,
                    y: 3.5
                  })

                };
                if (evnt.type == DutyStatus.D) {
                  // Push Start time
                  this.chartDataset.push({
                    x: evnt.time,
                    y: 1.5
                  })
                }
                if (evnt.type == DutyStatus.SB) {
                  // Push Start time
                  this.chartDataset.push({
                    x: evnt.time,
                    y: 2.5
                  });
                }
                if (evnt.type == DutyStatus.ON || evnt.type == DutyStatus.YM) {
                  // Push Start time
                  this.chartDataset.push({
                    x: evnt.time,
                    y: 0.5
                  })
                }

              });
              if (this.date === this.currentDate) {

                this.chartDataset.push({
                  x: this.getCurrentTime(),
                  y: this.chartDataset[this.chartDataset.length - 1].y
                })
              } else {
                this.chartDataset.push({
                  x: '23:59:59',
                  y: this.chartDataset[this.chartDataset.length - 1].y
                })
              }
              this.lineChartData[0].data = this.chartDataset;
              this.chart.update();
              let length = result[i][key].eventList.length;
              // Add current event locally
              this.currentEvent = {
                id: result[i][key].eventList[length - 1].id,
                type: this.setType(result[i][key].eventList[length - 1].type),
              };

              // Add accumulated data
              this.refineAccumulatedData(result[i][key].accumlatedHOS);

              // Add yesterday last event accumulated
              this.addYesterdayLastEventAccumulated();

              // Decide last/current event accumulated data
            //  this.lastEventAccumulatedData();   //already decided from backend
            }
          }
        }

        if (result.length === 0) {

          this.takeYesterdayLastEventToCurrentTime()
        }
        if (result.length === 0) {
          if (this.chartDataset.length === 1) {
            this.chartDataset.push({
              x: this.getCurrentTime(),
              y: this.chartDataset[0].y
            })
            this.lineChartData[0].data = this.chartDataset;
            this.chart.update();
          }
        }
      });
  }


  refineAccumulatedData(data: any) {
    // get the time difference from the beginning of the day to the first event of the today in seconds to calculate accumulated data
    this.lastEventYesterdayTimeInSeconds = this.calculateTimeDiffInSeconds(
      moment().format('DD-MM-YYYY 00:00:00'),
      this.eventList[0].dateTime
    );

    // set types
    let refine = data.map((m) => {
      return {
        type: this.setType(m.type),
        time: m.time,
      };
    });

    //sum the same types
    let sum = _(refine)
      .groupBy('type')
      .map((objs, key) => ({
        type: key,
        time: _.sumBy(objs, 'time'),
      }))
      .value();

    for (let i = 0; i < sum.length; i++) {
      this.updateAccumulated(sum[i]);
    }
  }

  minutesElapsed() {
    const startDate = moment().format('DD-MM-YYYY 00:00:00');
    const endDate = moment().format(' DD-MM-YYYY HH:mm:ss');

    const startDate2 = moment(startDate, 'DD-MM-YYYY HH:mm:ss');
    const endDate2 = moment(endDate, 'DD-MM-YYYY HH:mm:ss');
    const duration = moment.duration(endDate2.diff(startDate2));
    this.timeTillInMinutes = duration.asMinutes();
    this.timeTillInSeconds = duration.asSeconds();
  }

  calculateTimeDiffInMinutes(start: any, end: any) {
    let start_date = moment(start, 'DD-MM-YYYY HH:mm:ss');
    let end_date = moment(end, 'DD-MM-YYYY HH:mm:ss');
    let duration = moment.duration(end_date.diff(start_date));
    let diff = duration.asMinutes();
    return diff;
  }

  calculateTimeDiffInSeconds(start: any, end: any) {
    let start_date = moment(start, 'DD-MM-YYYY HH:mm:ss');
    let end_date = moment(end, 'DD-MM-YYYY HH:mm:ss');
    let duration = moment.duration(end_date.diff(start_date));
    let diff = duration.asSeconds();
    return diff;
  }

  updateAccumulated(data: any) {
    if (data.type === 'OFF') this.accumulatedOFF += data.time;
    if (data.type === 'SB') this.accumulatedSB += data.time;
    if (data.type === 'D') this.accumulatedD += data.time;
    if (data.type === 'ON') this.accumulatedON += data.time;

    //save their total also
    this.totalAccumulated += data.time;
  }

  lastEventAccumulatedData() {
    if (this.date === this.currentDate) {
      if (this.currentEvent.type === 'OFF') {
        this.accumulatedOFF +=
          this.timeTillInSeconds -
          this.totalAccumulated -
          this.lastEventYesterdayTimeInSeconds;
      }
      if (this.currentEvent.type === 'SB') {
        this.accumulatedSB +=
          this.timeTillInSeconds -
          this.totalAccumulated -
          this.lastEventYesterdayTimeInSeconds;
      }
      if (this.currentEvent.type === 'D') {
        this.accumulatedD +=
          this.timeTillInSeconds -
          this.totalAccumulated -
          this.lastEventYesterdayTimeInSeconds;
      }
      if (this.currentEvent.type === 'ON') {
        this.accumulatedON +=
          this.timeTillInSeconds -
          this.totalAccumulated -
          this.lastEventYesterdayTimeInSeconds;
      }
    } else {
      let length = this.eventList.length;
      let from = this.eventList[length - 1].dateTime;
      let to = this.date + ' ' + '23:59:59';

      let restTime = this.calculateTimeDiffInSeconds(from, to);
      if (this.currentEvent.type === 'OFF') {
        this.accumulatedOFF += restTime;
      }

      if (this.currentEvent.type === 'SB') {
        this.accumulatedSB += restTime;
      }

      if (this.currentEvent.type === 'D') {
        this.accumulatedD += restTime;
      }

      if (this.currentEvent.type === 'ON') {
        this.accumulatedON += restTime;
      }
    }
  }

  takeYesterdayLastEventToCurrentTime() {
    let diff: any = '';
    if (this.date === this.currentDate) {
      //get the time difference from the beginning of the day to the current time of the today
      diff = this.calculateTimeDiffInMinutes(
        moment().format('DD-MM-YYYY 00:00:00'),
        moment().format('DD-MM-YYYY HH:mm:ss')
      );
    } else {
      // get the time difference from the beginning of the day to the end time of the date

      diff = this.calculateTimeDiffInMinutes(
        moment().format('DD-MM-YYYY 00:00:00'),
        moment().format('DD-MM-YYYY 23:59:59')
      );
    }

    // use this as start point of x for next event from the current
    let nextStart = diff;

    // first add the last event of yesterday
    this.dutyCycleChanges.push({
      type: this.setType(this.lastEventOfYesterday.hosEvntDesc),
      time: diff, // already in minutes
      nextStart,
    });

    if (this.date === this.currentDate) {
      this.updateAccumulated({
        type: this.setType(this.lastEventOfYesterday.hosEvntDesc),
        time: this.calculateTimeDiffInSeconds(
          moment().format('DD-MM-YYYY 00:00:00'),
          moment().format('DD-MM-YYYY HH:mm:ss')
        ),
      });
    } else {
      this.updateAccumulated({
        type: this.setType(this.lastEventOfYesterday.hosEvntDesc),
        time: this.calculateTimeDiffInSeconds(
          moment().format('DD-MM-YYYY 00:00:00'),
          moment().format('DD-MM-YYYY 23:59:59')
        ),
      });
    }
  }

  addYesterdayLastEventAccumulated() {
    if (this.setType(this.lastEventOfYesterday.hosEvntDesc) === 'OFF')
      this.accumulatedOFF += this.lastEventYesterdayTimeInSeconds;
    if (this.setType(this.lastEventOfYesterday.hosEvntDesc) === 'SB')
      this.accumulatedSB += this.lastEventYesterdayTimeInSeconds;
    if (this.setType(this.lastEventOfYesterday.hosEvntDesc) === 'D')
      this.accumulatedD += this.lastEventYesterdayTimeInSeconds;
    if (this.setType(this.lastEventOfYesterday.hosEvntDesc) === 'ON')
      this.accumulatedON += this.lastEventYesterdayTimeInSeconds;
  }



  private getCurrentTime() {
    const currentDate = new Date();
    return `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  }

  /**
   * Conside 'YM' as 'ON' and 'PC' as 'OFF'
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

}

enum GraphDutyStatus {
  ON = 0.5,
  D = 1.5,
  SB = 2.5,
  OFF = 3.5

}
enum DutyStatus {
  ON = 'ON',
  D = 'D',
  SB = 'SB',
  OFF = 'OFF',
  YM = 'YM'
}