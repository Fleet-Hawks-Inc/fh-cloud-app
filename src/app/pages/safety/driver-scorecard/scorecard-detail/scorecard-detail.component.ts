import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';;
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-scorecard-detail',
  templateUrl: './scorecard-detail.component.html',
  styleUrls: ['./scorecard-detail.component.css']
})
export class ScorecardDetailComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  drivers = [];
  eventData = {
    driver: {
      licenceDetails: {
        CDL_Number: ''
      },
      fullName: '',
      workPhone: '',
      workEmail: '',
      cycleName: '',
      homeTerminal: '',
      driverImage: ''
    },
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
  };
  driverID: '';
  rank: '';
  driverUsername = '';
  totalEvents = [];

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

  constructor(private apiService: ApiService, private awsUS: AwsUploadService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.initHarshEventRateGraph();
    this.initHarshEventCountGraph();
    this.initSpeedingGraph();
    // this.initTripsGraph();

    this.driverID = this.route.snapshot.params[`driverID`];
    this.rank = this.route.snapshot.params[`rank`];
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.spinner.show();
    this.apiService.getData('drivers/' + this.driverID)
      .subscribe((result: any) => {
        result.Items.map((i: any) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });

        const element = result.Items[0];
        this.driverUsername = element.userName;

        this.eventData.driver = element;
        this.eventData.driver.driverImage = `${this.Asseturl}/${element.carrierID}/${element.driverImage}`;

        this.fetchCycle(element.hosDetails.hosCycle);
        this.fetchHomeTerminal(element.hosDetails.homeTerminal);

        let eventtim = <any>'00:00:00';
        this.apiService.getData('safety/eventLogs/fetch/driver/eventData/' + element.userName)
          .subscribe((result1: any) => {
            for (let j = 0; j < result1.Items.length; j++) {
              const element1 = result1.Items[j];
              if (element1.criticalityType === 'harshAcceleration') {
                this.eventData.harshAcceleration = this.eventData.harshAcceleration + 1;
              }

              if (element1.criticalityType === 'harshBrake') {
                this.eventData.harshBrake = this.eventData.harshBrake + 1;
              }

              if (element1.criticalityType === 'harshTurn') {
                this.eventData.harshTurn = this.eventData.harshTurn + 1;
              }

              if (element1.criticalityType === 'rollingStop') {
                this.eventData.rollingStop = this.eventData.rollingStop + 1;
              }

              if (element1.criticalityType === 'crashes') {
                this.eventData.crashes = this.eventData.crashes + 1;
              }

              if (element1.criticalityType === 'overSpeedingStart' || element1.criticalityType === 'overSpeedingEnd') {
                if (element1.criticalityType === 'overSpeedingStart') {
                  this.eventData.overSpeeding = this.eventData.overSpeeding + 1;
                }

                this.eventData.distance = this.eventData.distance + parseFloat(element1.odometerReading);
                //subtract end time from start time
                var d = moment.duration(element1.evenEndTime).subtract(moment.duration(element1.eventStartTime))
                let newTime = moment.utc(d.as('milliseconds')).format("HH:mm:ss")

                //add total time of overspeeding i.e of criticality type overspeedingstart and end
                eventtim = moment.duration(eventtim).add(moment.duration(newTime));
                eventtim = moment.utc(eventtim.as('milliseconds')).format("HH:mm:ss");
                this.eventData.time = eventtim;
              }
            }
            this.eventData.rank = this.eventData.harshAcceleration + this.eventData.harshBrake + this.eventData.rollingStop + this.eventData.crashes + this.eventData.overSpeeding;
          })

        this.spinner.hide();
      })
  }

  fetchCycle(cycleID) {
    this.apiService.getData('cycles/'+cycleID)
      .subscribe((result: any) => {
          this.eventData.driver.cycleName = result.Items[0].cycleName;
      })
  }

  fetchHomeTerminal(yardID) {
    this.apiService.getData('yards/'+yardID)
      .subscribe((result: any) => {
          this.eventData.driver.homeTerminal = result.Items[0].yardName;
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
            3,3,3,3,3,3,3,3,3,3,3,3,3,3
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
    this.countChartLabels =  ['21 Aug 2020', '22 Aug 2020', '23 Aug 2020', '24 Aug 2020', '25 Aug 2020', '26 Aug 2020', '27 Aug 2020', '28 Aug 2020'],
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
            3,3,3,3,3,3,3,3,3,3,3,3,3,3
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
            barThickness : 40
        }],
        yAxes: [{
            display: true,
            ticks: {
              stepSize: 10,
            }
        }]
      }
    };
    this.speedingChartLabels =['21 Aug 2020', '22 Aug 2020', '23 Aug 2020', '24 Aug 2020', '25 Aug 2020', '26 Aug 2020', '27 Aug 2020', '28 Aug 2020'],
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

  openModal(type) {
    this.totalEvents = [];
    if(type === 'harshBrake') {
      $('#modaltitle').text('Harsh Brake Events');
    } else if(type === 'harshAcceleration') {
      $('#modaltitle').text('Harsh Acceleration Events');
    } else if(type === 'overSpeedingStart') {
      $('#modaltitle').text('Over Speeding Events');
    } else if(type === 'harshTurn') {
      $('#modaltitle').text('Harsh Turn Events');
    } else if(type === 'crashes') {
      $('#modaltitle').text('Crash Events');
    }

    this.apiService.getData('safety/eventLogs/fetch/driver/eventData/'+this.driverUsername+'?type='+type)
      .subscribe((result: any) => {
        // console.log(result)
        this.totalEvents = result.Items;
    })

    $("#eventModal").modal('show');
  }
}
