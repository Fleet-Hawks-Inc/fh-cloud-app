import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

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
  
  lastYear = '2020';
  currentYear = new Date().getFullYear();
  // graph data
  harshEventRateData = {
    acceleration: [],
    brake: [],
    turn: [],
    crash: [],
    rollingStop: []
  }

  harshEventCountData = {
    acceleration: [],
    brake: [],
    turn: [],
    crash: [],
    rollingStop: []
  }

  speedingGraphData = [];

  graphXaxis = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

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
            //to get data of current year or filtered year
            let start:any = '';
            let end:any = '';
            if(this.currentYear) {
              let startDate = this.lastYear+'-01-01 00:00:00';
              let endDate = this.currentYear+'-12-31 23:59:59';

              start = moment(startDate).format("X")
              start = start*1000;

              end = moment(endDate).format("X");
              end = end*1000;
            }
            
            this.apiService.getData('safety/eventLogs/fetch/driver/eventData/' + element.userName+'?start='+start+'&end='+end)
              .subscribe((result1: any) => {
                // console.log('result1--')
                // console.log(result1)
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
                    
                    if(element1.odometerReading !== undefined) {
                      obj.distance = obj.distance + parseFloat(element1.odometerReading);
                    }
                    
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
    this.chartLabels = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
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
    this.countChartLabels = this.graphXaxis,
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
        data: this.harshEventCountData.acceleration
      },
      {
        label: 'Harsh Brake Rate',
        hidden: true,
        fill: false,
        backgroundColor: '#000',
        borderColor: '#000',
        borderWidth: 1,
        data: this.harshEventCountData.brake
      },
      {
        label: 'Harsh Trun Rate',
        hidden: true,
        fill: false,
        backgroundColor: '#f44336',
        borderColor: '#f44336',
        borderWidth: 1,
        data: this.harshEventCountData.turn
      },
      {
        label: 'Crash Rate',
        hidden: true,
        fill: false,
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1,
        data: this.harshEventCountData.crash
      },
      {
        label: 'Rolling Stop rate',
        hidden: true,
        fill: false,
        backgroundColor: '#795548',
        borderColor: '#795548',
        borderWidth: 1,
        data: this.harshEventCountData.rollingStop
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
    this.speedingChartLabels = this.graphXaxis,
    this.speedingChartType = 'bar';
    this.speedingChartLegend = true;
    this.speedingChartData = [
      {
        fill: false,
        backgroundColor: '#363636',
        borderColor: '#9c9ea1',
        borderWidth: 1,
        data: this.speedingGraphData
      },
    ];
  }

  fetchevents() {

    this.spinner.show();

    let eventdate = <any> '';
    let rateAccelerationMonths = {
      jan: 0,
      feb: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      aug: 0,
      sept: 0,
      oct: 0,
      nov: 0,
      dec: 0
    }

    let rateBrakeMonths = {
      jan: 0,
      feb: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      aug: 0,
      sept: 0,
      oct: 0,
      nov: 0,
      dec: 0
    }

    let rateTurnMonths = {
      jan: 0,
      feb: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      aug: 0,
      sept: 0,
      oct: 0,
      nov: 0,
      dec: 0
    }

    let rateCrashMonths = {
      jan: 0,
      feb: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      aug: 0,
      sept: 0,
      oct: 0,
      nov: 0,
      dec: 0
    }

    let rateRollingStopMonths = {
      jan: 0,
      feb: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      aug: 0,
      sept: 0,
      oct: 0,
      nov: 0,
      dec: 0
    }

    let countAccelerationMonths = {
      jan: 0,
      feb: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      aug: 0,
      sept: 0,
      oct: 0,
      nov: 0,
      dec: 0
    }

    let countBrakeMonths = {
      jan: 0,
      feb: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      aug: 0,
      sept: 0,
      oct: 0,
      nov: 0,
      dec: 0
    }

    let countTurnMonths = {
      jan: 0,
      feb: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      aug: 0,
      sept: 0,
      oct: 0,
      nov: 0,
      dec: 0
    }

    let countCrashMonths = {
      jan: 0,
      feb: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      aug: 0,
      sept: 0,
      oct: 0,
      nov: 0,
      dec: 0
    }

    let countRollingStopMonths = {
      jan: 0,
      feb: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      aug: 0,
      sept: 0,
      oct: 0,
      nov: 0,
      dec: 0
    }

    let speedingMonths = {
      jan: 0,
      feb: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      aug: 0,
      sept: 0,
      oct: 0,
      nov: 0,
      dec: 0
    }
    
    //to get data of current year or filtered year
    let start:any = '';
    let end:any = '';
    if(this.currentYear) {
      let startDate = this.currentYear+'-01-01 00:00:00';
      let endDate = this.currentYear+'-12-31 23:59:59';

      start = moment(startDate).format("X")
      start = start*1000;

      end = moment(endDate).format("X");
      end = end*1000;
    }
    
    this.apiService.getData('safety/eventLogs/fetch/all-events?start='+start+'&end='+end)
      .subscribe((result: any) => {
        console.log(result.Items);
        // this.events = result.Items;

        for (let i = 0; i < result.Items.length; i++) {
          const element = result.Items[i];
          // eventdate = element.eventDate.split("-");

          let check = moment(element.date, 'YYYY/MM/DD');
          let eventMonth = check.format('M');
          let day   = check.format('D');
          let year  = check.format('YYYY');

          // let eventMonth = eventdate[1];
          // console.log('eventMonth')
          // console.log(element.eventType)

          if(element.eventType === "critical") {
            this.events.criticalEventsCount += 1; 
          }

          if(element.eventType === "incident") {
            this.events.incidentCount += 1; 
            // console.log('this.events.incidentCount') 
            // console.log(this.events.incidentCount) 
          }

          if(element.eventType === "hosViolation") {
            this.events.hosViolationsCount += 1; 
          }
          
          if(element.criticalityType === "harshAcceleration") {
            //graph data start
            if(eventMonth == '1' || eventMonth == '01') {
              countAccelerationMonths.jan += 1;
              rateAccelerationMonths.jan += 1;
            } else if(eventMonth == '2' || eventMonth == '02') {
              countAccelerationMonths.feb += 1;
              rateAccelerationMonths.feb += 1;
            } else if(eventMonth == '3' || eventMonth == '03') {
              countAccelerationMonths.march += 1;
              rateAccelerationMonths.march += 1;
            } else if(eventMonth == '4' || eventMonth == '04') {
              countAccelerationMonths.april += 1;
              rateAccelerationMonths.april += 1;
            } else if(eventMonth == '5' || eventMonth == '05') {
              countAccelerationMonths.may += 1;
              rateAccelerationMonths.may += 1;
            } else if(eventMonth == '6' || eventMonth == '06') {
              countAccelerationMonths.june += 1;
              rateAccelerationMonths.june += 1;
            } else if(eventMonth == '7' || eventMonth == '07') {
              countAccelerationMonths.july += 1;
              rateAccelerationMonths.july += 1;
            } else if(eventMonth == '8' || eventMonth == '08') {
              countAccelerationMonths.aug += 1;
              rateAccelerationMonths.aug += 1;
            } else if(eventMonth == '9' || eventMonth == '09') {
              countAccelerationMonths.sept += 1;
              rateAccelerationMonths.sept += 1;
            } else if(eventMonth == '10') {
              countAccelerationMonths.oct += 1;
              rateAccelerationMonths.oct += 1;
            } else if(eventMonth == '11') {
              countAccelerationMonths.nov += 1;
              rateAccelerationMonths.nov += 1;
            } else if(eventMonth == '12') {
              countAccelerationMonths.dec += 1;
              rateAccelerationMonths.dec += 1;
            }
            //graph data end

            this.events.harshAccelerationCount += 1; 
            this.totalEvents.harshAccelerationEventCount += 1;

            this.harshAccelerationDrivers.push(element.driverUsername);
            this.harshAccelerationDrivers = this.harshAccelerationDrivers.filter(onlyUnique);
            this.totalEvents.harshAccelerationDriverCount = this.harshAccelerationDrivers.length;
          }

          if(element.criticalityType === "harshBrake") {
            //graph data start
            if(eventMonth == '1' || eventMonth == '01') {
              countBrakeMonths.jan += 1;
            } else if(eventMonth == '2' || eventMonth == '02') {
              countBrakeMonths.feb += 1;
            } else if(eventMonth == '3' || eventMonth == '03') {
              countBrakeMonths.march += 1;
            } else if(eventMonth == '4' || eventMonth == '04') {
              countBrakeMonths.april += 1;
            } else if(eventMonth == '5' || eventMonth == '05') {
              countBrakeMonths.may += 1;
            } else if(eventMonth == '6' || eventMonth == '06') {
              countBrakeMonths.june += 1;
            } else if(eventMonth == '7' || eventMonth == '07') {
              countBrakeMonths.july += 1;
            } else if(eventMonth == '8' || eventMonth == '08') {
              countBrakeMonths.aug += 1;
            } else if(eventMonth == '9' || eventMonth == '09') {
              countBrakeMonths.sept += 1;
            } else if(eventMonth == '10') {
              countBrakeMonths.oct += 1;
            } else if(eventMonth == '11') {
              countBrakeMonths.nov += 1;
            } else if(eventMonth == '12') {
              countBrakeMonths.dec += 1;
            }
            //graph data end
            
            this.events.harshBrakeCount += 1; 
            this.totalEvents.harshBrakeEventCount += 1;

            this.harshBrakeDrivers.push(element.driverUsername);
            this.harshBrakeDrivers = this.harshBrakeDrivers.filter(onlyUnique);
            this.totalEvents.harshBrakeDriverCount = this.harshBrakeDrivers.length;
          }

          if(element.criticalityType === "overSpeedingStart") {
            //graph data start
            if(eventMonth == '1' || eventMonth == '01') {
              speedingMonths.jan += 1;
            } else if(eventMonth == '2' || eventMonth == '02') {
              speedingMonths.feb += 1;
            } else if(eventMonth == '3' || eventMonth == '03') {
              speedingMonths.march += 1;
            } else if(eventMonth == '4' || eventMonth == '04') {
              speedingMonths.april += 1;
            } else if(eventMonth == '5' || eventMonth == '05') {
              speedingMonths.may += 1;
            } else if(eventMonth == '6' || eventMonth == '06') {
              speedingMonths.june += 1;
            } else if(eventMonth == '7' || eventMonth == '07') {
              speedingMonths.july += 1;
            } else if(eventMonth == '8' || eventMonth == '08') {
              speedingMonths.aug += 1;
            } else if(eventMonth == '9' || eventMonth == '09') {
              speedingMonths.sept += 1;
            } else if(eventMonth == '10') {
              speedingMonths.oct += 1;
            } else if(eventMonth == '11') {
              speedingMonths.nov += 1;
            } else if(eventMonth == '12') {
              speedingMonths.dec += 1;
            }
            //graph data end
            
            this.events.overSpeedingCount += 1; 
          }

          if(element.criticalityType === "harshTurn") {
            //graph data start
            if(eventMonth == '1' || eventMonth == '01') {
              countTurnMonths.jan += 1;
            } else if(eventMonth == '2' || eventMonth == '02') {
              countTurnMonths.feb += 1;
            } else if(eventMonth == '3' || eventMonth == '03') {
              countTurnMonths.march += 1;
            } else if(eventMonth == '4' || eventMonth == '04') {
              countTurnMonths.april += 1;
            } else if(eventMonth == '5' || eventMonth == '05') {
              countTurnMonths.may += 1;
            } else if(eventMonth == '6' || eventMonth == '06') {
              countTurnMonths.june += 1;
            } else if(eventMonth == '7' || eventMonth == '07') {
              countTurnMonths.july += 1;
            } else if(eventMonth == '8' || eventMonth == '08') {
              countTurnMonths.aug += 1;
            } else if(eventMonth == '9' || eventMonth == '09') {
              countTurnMonths.sept += 1;
            } else if(eventMonth == '10') {
              countTurnMonths.oct += 1;
            } else if(eventMonth == '11') {
              countTurnMonths.nov += 1;
            } else if(eventMonth == '12') {
              countTurnMonths.dec += 1;
            }
            //graph data end

            this.totalEvents.harshTurnEventCount += 1;

            this.harshTurnDrivers.push(element.driverUsername);
            this.harshTurnDrivers = this.harshTurnDrivers.filter(onlyUnique);
            this.totalEvents.harshTurnDriverCount = this.harshTurnDrivers.length;
          }

          if(element.criticalityType === "crash") {
            //graph data start
            if(eventMonth == '1' || eventMonth == '01') {
              countCrashMonths.jan += 1;
            } else if(eventMonth == '2' || eventMonth == '02') {
              countCrashMonths.feb += 1;
            } else if(eventMonth == '3' || eventMonth == '03') {
              countCrashMonths.march += 1;
            } else if(eventMonth == '4' || eventMonth == '04') {
              countCrashMonths.april += 1;
            } else if(eventMonth == '5' || eventMonth == '05') {
              countCrashMonths.may += 1;
            } else if(eventMonth == '6' || eventMonth == '06') {
              countCrashMonths.june += 1;
            } else if(eventMonth == '7' || eventMonth == '07') {
              countCrashMonths.july += 1;
            } else if(eventMonth == '8' || eventMonth == '08') {
              countCrashMonths.aug += 1;
            } else if(eventMonth == '9' || eventMonth == '09') {
              countCrashMonths.sept += 1;
            } else if(eventMonth == '10') {
              countCrashMonths.oct += 1;
            } else if(eventMonth == '11') {
              countCrashMonths.nov += 1;
            } else if(eventMonth == '12') {
              countCrashMonths.dec += 1;
            }
            //graph data end
            
            this.totalEvents.crashEventCount += 1;

            this.crashDrivers.push(element.driverUsername);
            this.crashDrivers = this.crashDrivers.filter(onlyUnique);
            this.totalEvents.crashDriverCount = this.crashDrivers.length;
          }

          if(element.criticalityType === "rollingStop") {
            //graph data start
            if(eventMonth == '1' || eventMonth == '01') {
              countRollingStopMonths.jan += 1;
            } else if(eventMonth == '2' || eventMonth == '02') {
              countRollingStopMonths.feb += 1;
            } else if(eventMonth == '3' || eventMonth == '03') {
              countRollingStopMonths.march += 1;
            } else if(eventMonth == '4' || eventMonth == '04') {
              countRollingStopMonths.april += 1;
            } else if(eventMonth == '5' || eventMonth == '05') {
              countRollingStopMonths.may += 1;
            } else if(eventMonth == '6' || eventMonth == '06') {
              countRollingStopMonths.june += 1;
            } else if(eventMonth == '7' || eventMonth == '07') {
              countRollingStopMonths.july += 1;
            } else if(eventMonth == '8' || eventMonth == '08') {
              countRollingStopMonths.aug += 1;
            } else if(eventMonth == '9' || eventMonth == '09') {
              countRollingStopMonths.sept += 1;
            } else if(eventMonth == '10') {
              countRollingStopMonths.oct += 1;
            } else if(eventMonth == '11') {
              countRollingStopMonths.nov += 1;
            } else if(eventMonth == '12') { 
              countRollingStopMonths.dec += 1;
            }
            //graph data end

            this.totalEvents.RollingStopEventCount += 1;
            this.RollingStopDrivers.push(element.driverUsername);
            this.RollingStopDrivers = this.RollingStopDrivers.filter(onlyUnique);
            this.totalEvents.RollingStopDriverCount = this.RollingStopDrivers.length;
          }
        }

        // harsh event count graph
        this.harshEventCountData.acceleration = Object.keys(countAccelerationMonths).map(key => countAccelerationMonths[key]);
        this.harshEventCountData.brake = Object.keys(countBrakeMonths).map(key => countBrakeMonths[key]);
        this.harshEventCountData.turn = Object.keys(countTurnMonths).map(key => countTurnMonths[key]);
        this.harshEventCountData.crash = Object.keys(countCrashMonths).map(key => countCrashMonths[key]);
        this.harshEventCountData.rollingStop = Object.keys(countRollingStopMonths).map(key => countRollingStopMonths[key]);
        this.speedingGraphData = Object.keys(speedingMonths).map(key => speedingMonths[key]);

        //harsh event rate graph
        // if(this.totalEvents.harshAccelerationDriverCount > 0) {
        //   rateAccelerationMonths.jan = rateAccelerationMonths.jan/this.totalEvents.harshAccelerationDriverCount ;
        //   rateAccelerationMonths.feb = rateAccelerationMonths.feb/this.totalEvents.harshAccelerationDriverCount ;
        //   rateAccelerationMonths.march = rateAccelerationMonths.march/this.totalEvents.harshAccelerationDriverCount ;
        //   rateAccelerationMonths.april = rateAccelerationMonths.april/this.totalEvents.harshAccelerationDriverCount ;
        //   rateAccelerationMonths.may = rateAccelerationMonths.may/this.totalEvents.harshAccelerationDriverCount ;
        //   rateAccelerationMonths.jan = rateAccelerationMonths.jan/this.totalEvents.harshAccelerationDriverCount ;
        //   rateAccelerationMonths.jan = rateAccelerationMonths.jan/this.totalEvents.harshAccelerationDriverCount ;
        //   rateAccelerationMonths.jan = rateAccelerationMonths.jan/this.totalEvents.harshAccelerationDriverCount ;
        //   rateAccelerationMonths.jan = rateAccelerationMonths.jan/this.totalEvents.harshAccelerationDriverCount ;
        //   rateAccelerationMonths.jan = rateAccelerationMonths.jan/this.totalEvents.harshAccelerationDriverCount ;
        //   rateAccelerationMonths.jan = rateAccelerationMonths.jan/this.totalEvents.harshAccelerationDriverCount ;
        //   rateAccelerationMonths.jan = rateAccelerationMonths.jan/this.totalEvents.harshAccelerationDriverCount ;
        // }


        this.initHarshEventCountGraph() 
        this.initSpeedingGraph();
        this.spinner.hide();
      })
  }
}

// for unique array
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
