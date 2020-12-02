import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import * as moment from "moment";

@Component({
  selector: 'app-safety-overview',
  templateUrl: './safety-overview.component.html',
  styleUrls: ['./safety-overview.component.css']
})
export class SafetyOverviewComponent implements OnInit {

  events = {
    criticalEventsCount : 0,
    hosViolationsCount: 0,
    incidentCount: 0,
    compliantDriversPercent: 0,
    harshBrakeCount: 0,
    harshAccelerationCount: 0,
    overSpeedingCount: 0,
    nearViolationsCount: 0,
    distanceDriven: 0,
    timeDriven: 0,
    fuelIdling: 0,
    compliancePercent: 0
  };

  totalEvents = {
    harshAccelerationEventCount :0,
    harshAccelerationDriverCount :0,
    harshBrakeEventCount :0,
    harshBrakeDriverCount :0,
    harshTurnEventCount :0,
    harshTurnDriverCount :0,
    crashEventCount :0,
    crashDriverCount :0,
    RollingStopEventCount :0,
    RollingStopDriverCount :0,
  };

  harshAccelerationDrivers =[];
  harshBrakeDrivers =[];
  harshTurnDrivers =[];
  crashDrivers =[];
  RollingStopDrivers =[];
  
  // graph
  chartOptions = {};
  chartLabels = [];
  chartType = '';
  chartLegend;
  chartData = [];

  countChartOptions = {};
  countChartLabels = [];
  countChartType = '';
  countChartLegend;
  countChartData = [];

  speedingChartOptions = {};
  speedingChartLabels = [];
  speedingChartType = '';
  speedingChartLegend;
  speedingChartData = [];
  eventData = [];

  constructor(private apiService: ApiService, private awsUS: AwsUploadService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.fetchevents();
    this.initHarshEventRateGraph();
    this.initHarshEventCountGraph();
    this.initSpeedingGraph();
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.apiService.getData('drivers')
      .subscribe((result: any) => {
        result.Items.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
        // console.log('this.drivers')
        // console.log(result.Items)
        for (let i = 0; i < result.Items.length; i++) {
          const element = result.Items[i];
          if (element.isDeleted === 0) {
            let obj = {
              driverName: element.fullName,
              driverID: element.driverID,
              compliance: 'NA',
              safetyScore: 'NA',
              fuelIdling: 'NA',
              harshBrake: 0,
              harshAcceleration: 0,
              harshTurn: 0,
              rollingStop: 0,
              crashes: 0,
              overSpeeding: 0,
              distance: 0,
              time: <any>'00:00:00',
              rank: 0
            }
            let eventtim = <any>'00:00:00';
            this.apiService.getData('safety/eventLogs/fetch/driver/eventData/' + element.userName)
              .subscribe((result1: any) => {
                for (let j = 0; j < result1.Items.length; j++) {
                  const element1 = result1.Items[j];
                  if (element1.criticalityType === 'harshAcceleration') {
                    obj.harshAcceleration = obj.harshAcceleration + 1;
                  }

                  if (element1.criticalityType === 'harshBrake') {
                    obj.harshBrake = obj.harshBrake + 1;
                  }

                  if (element1.criticalityType === 'harshTurn') {
                    obj.harshTurn = obj.harshTurn + 1;
                  }

                  if (element1.criticalityType === 'rollingStop') {
                    obj.rollingStop = obj.rollingStop + 1;
                  }

                  if (element1.criticalityType === 'crashes') {
                    obj.crashes = obj.crashes + 1;
                  }

                  if (element1.criticalityType === 'overSpeedingStart' || element1.criticalityType === 'overSpeedingEnd') {
                    if (element1.criticalityType === 'overSpeedingStart') {
                      obj.overSpeeding = obj.overSpeeding + 1;
                    }

                    obj.distance = obj.distance + parseFloat(element1.odometerReading);
                    //subtract end time from start time
                    var d = moment.duration(element1.evenEndTime).subtract(moment.duration(element1.eventStartTime))
                    let newTime = moment.utc(d.as('milliseconds')).format("HH:mm:ss")

                    //add total time of overspeeding i.e of criticality type overspeedingstart and end
                    eventtim = moment.duration(eventtim).add(moment.duration(newTime));
                    eventtim = moment.utc(eventtim.as('milliseconds')).format("HH:mm:ss");
                    obj.time = eventtim;
                  }
                }
                obj.rank = obj.harshAcceleration + obj.harshBrake + obj.rollingStop + obj.crashes + obj.overSpeeding;
                this.eventData.push(obj);
                this.eventData.sort(function (a, b) {
                  return b.rank - a.rank;
                });
              })
          }
        }
      })
  }

  initHarshEventRateGraph() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10
        }
      },
    };
    this.chartLabels = ['21 Aug 2020', '22 Aug 2020', '23 Aug 2020', '24 Aug 2020', '25 Aug 2020', '26 Aug 2020', '27 Aug 2020', '28 Aug 2020'],
      this.chartType = 'line';
    this.chartLegend = true;
    this.chartData = [
      {
        label: 'Harsh Acceleration Rate',
        hidden: false,
        fill: false,
        backgroundColor: '#9c9ea1',
        borderColor: '#9c9ea1',
        borderWidth: 1,
        data: [
          0, 2, 0, 3, 1, 2, 5, 4, 5, 1, 3, 5
        ],
      },
      {
        label: 'Harsh Brake Rate',
        hidden: true,
        fill: false,
        backgroundColor: '#000',
        borderColor: '#000',
        borderWidth: 1,
        data: [
          12, 12, 18, 12, 18, 13, 0, 5, 2, 3, 15, 10, 14,
        ],
      },
      {
        label: 'Harsh Trun Rate',
        hidden: true,
        fill: false,
        backgroundColor: '#f44336',
        borderColor: '#f44336',
        borderWidth: 1,
        data: [
          3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
        ],
      },
      {
        label: 'Crash Rate',
        hidden: true,
        fill: false,
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1,
        data: [
          0, 5, 2, 3, 15, 10, 14, 12, 12, 18, 12, 18, 13
        ],
      },
      {
        label: 'Rolling Stop rate',
        hidden: true,
        fill: false,
        backgroundColor: '#795548',
        borderColor: '#795548',
        borderWidth: 1,
        data: [
          0, 5, 2, 3, 0, 0, 4, 2, 5, 1, 3
        ],
      },

    ];
  }

  initHarshEventCountGraph() {
    this.countChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10
        }
      },
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            stepSize: 2,
          }
        }]
      }
    };
    this.countChartLabels = ['21 Aug 2020', '22 Aug 2020', '23 Aug 2020', '24 Aug 2020', '25 Aug 2020', '26 Aug 2020', '27 Aug 2020', '28 Aug 2020'],
      this.countChartType = 'line';
    this.countChartLegend = true;
    this.countChartData = [
      {
        label: 'Harsh Acceleration Rate',
        hidden: false,
        fill: false,
        backgroundColor: '#9c9ea1',
        borderColor: '#9c9ea1',
        borderWidth: 1,
        data: [
          0, 2, 0, 3, 1, 2, 5, 4, 5, 1, 3, 5
        ],
      },
      {
        label: 'Harsh Brake Rate',
        hidden: true,
        fill: false,
        backgroundColor: '#000',
        borderColor: '#000',
        borderWidth: 1,
        data: [
          12, 12, 18, 12, 18, 13, 0, 5, 2, 3, 15, 10, 14,
        ],
      },
      {
        label: 'Harsh Trun Rate',
        hidden: true,
        fill: false,
        backgroundColor: '#f44336',
        borderColor: '#f44336',
        borderWidth: 1,
        data: [
          3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
        ],
      },
      {
        label: 'Crash Rate',
        hidden: true,
        fill: false,
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1,
        data: [
          0, 5, 2, 3, 15, 10, 14, 12, 12, 18, 12, 18, 13
        ],
      },
      {
        label: 'Rolling Stop rate',
        hidden: true,
        fill: false,
        backgroundColor: '#795548',
        borderColor: '#795548',
        borderWidth: 1,
        data: [
          0, 5, 2, 3, 0, 0, 4, 2, 5, 1, 3
        ],
      },
    ];
  }

  initSpeedingGraph() {
    this.speedingChartOptions = {
      title: {
        display: true,
        fontSize: 14,
        text: 'time over speed limit'
      },
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      legend: {
        display: false
      },

      scales: {
        xAxes: [{
          barThickness: 40
        }],
        yAxes: [{
          display: true,
          ticks: {
            stepSize: 10,
          }
        }]
      }
    };
    this.speedingChartLabels = ['21 Aug 2020', '22 Aug 2020', '23 Aug 2020', '24 Aug 2020', '25 Aug 2020', '26 Aug 2020', '27 Aug 2020', '28 Aug 2020'],
      this.speedingChartType = 'bar';
    this.speedingChartLegend = true;
    this.speedingChartData = [
      {
        fill: false,
        backgroundColor: '#363636',
        borderColor: '#9c9ea1',
        borderWidth: 1,
        data: [
          30, 20, 15, 30, 15, 30, 50, 35
        ],
      },
    ];
  }

  fetchevents() {
    this.spinner.show();
    this.apiService.getData('safety/eventLogs/fetch/all-events')
      .subscribe((result: any) => {
        // console.log(result.Items);
        // this.events = result.Items;

        for (let i = 0; i < result.Items.length; i++) {
          const element = result.Items[i];
          
          if(element.eventType === "critical") {
            this.events.criticalEventsCount += 1; 
          }

          if(element.eventType === "incident") {
            this.events.incidentCount += 1; 
          }

          if(element.eventType === "hosViolation") {
            this.events.hosViolationsCount += 1; 
          }
          
          if(element.criticalityType === "harshAcceleration") {
            this.events.harshAccelerationCount += 1; 
            this.totalEvents.harshAccelerationEventCount += 1;

            this.harshAccelerationDrivers.push(element.driverUsername);
            this.harshAccelerationDrivers = this.harshAccelerationDrivers.filter(onlyUnique);
            this.totalEvents.harshAccelerationDriverCount = this.harshAccelerationDrivers.length;
          }

          if(element.criticalityType === "harshBrake") {
            this.events.harshBrakeCount += 1; 
            this.totalEvents.harshBrakeEventCount += 1;

            this.harshBrakeDrivers.push(element.driverUsername);
            this.harshBrakeDrivers = this.harshBrakeDrivers.filter(onlyUnique);
            this.totalEvents.harshBrakeDriverCount = this.harshBrakeDrivers.length;
          }

          if(element.criticalityType === "overSpeedingStart") {
            this.events.overSpeedingCount += 1; 
          }

          if(element.criticalityType === "harshTurn") {
            this.totalEvents.harshTurnEventCount += 1;

            this.harshTurnDrivers.push(element.driverUsername);
            this.harshTurnDrivers = this.harshTurnDrivers.filter(onlyUnique);
            this.totalEvents.harshTurnDriverCount = this.harshTurnDrivers.length;
          }

          if(element.criticalityType === "crash") {
            this.totalEvents.crashEventCount += 1;

            this.crashDrivers.push(element.driverUsername);
            this.crashDrivers = this.crashDrivers.filter(onlyUnique);
            this.totalEvents.crashDriverCount = this.crashDrivers.length;
          }

          if(element.criticalityType === "rollingStop") {
            this.totalEvents.RollingStopEventCount += 1;

            this.RollingStopDrivers.push(element.driverUsername);
            this.RollingStopDrivers = this.RollingStopDrivers.filter(onlyUnique);
            this.totalEvents.RollingStopDriverCount = this.RollingStopDrivers.length;
          }

        }
        this.spinner.hide();
      })
  }
}

// for unique array
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
