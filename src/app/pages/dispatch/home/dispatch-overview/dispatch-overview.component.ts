import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import {forkJoin} from 'rxjs';
import  Constants  from '../../../fleet/constants';
declare var $: any;
import * as moment from 'moment';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
  selector: 'app-dispatch-overview',
  templateUrl: './dispatch-overview.component.html',
  styleUrls: ['./dispatch-overview.component.css']
})
export class DispatchOverviewComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  activeTripsCount = 0;
  totalTripsCount = 0;
  permanentRoutesCount = 0;
  customerCount = 0;
  todaysPickCount = 0;
  tomorrowsPickCount = 0;
  availableDriversCount = 0;
  availableVehiclesCount = 0;
  aceManifestCount = 0;
  aciManifestCount = 0;
  activities = [];
  errors: {};
  form;

  response: any = '';
  hasError = false;
  hasSuccess = false; 
  Error = '';
  Success = '';
  activityData = {
    action: '',
    userID: '',
    tableName: '',
    eventID: '',
    message: ""
  };

  // graph
  chartOptions = {};
  chartLabels = [];
  chartType = '';
  chartLegend;
  chartData = [];

  tripChartOptions = {};
  tripChartLabels = [];
  tripChartType = '';
  tripChartLegend;
  tripChartData = [];

  tripsMonths = {
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

  aceMonths = {
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

  aciMonths = {
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
  tripGraphData = [];
  aceGraphData = [];
  aciGraphData = [];
  allActivities = [];

  totalRecords = 0;
  pageLength = 10;
  lastEvaluatedKey:any = '';
  dispatchLength = 0;
  dispatchNext = false;
  dispatchPrev = true;
  dispatchDraw = 0;
  dispatchPrevEvauatedKeys = [''];
  dispatchStartPoint = 1;
  dispatchEndPoint = this.pageLength;
  pageload = true;
  activitiesCount = 0; 
  prevKeyExist = true;

  constructor(private apiService: ApiService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.fetchActivitiesCount();
    this.initDataTable();
    this.initManifestGraph();
    this.initTripsGraph();
    this.dispatchData();

    this.fetchAllTrips();
    this.fetchAllRoutes();
    this.fetchAllCustomers();
    this.fetchAlldrivers();
    this.fetchAllVehicles();
    this.fetchAceManifest();
    this.fetchAciManifest();
  }

  async dispatchData(){ 
    const current = this;
    current.spinner.show()
    // let latestEventActivities = new Promise(function(resolve, reject){
    //   current.apiService.getData('activities').
    //   subscribe(async (result: any) => {
    //       let activityGetUrl = [];
    //       for (let i = 0; i < result.Items.length; i++) {
    //         const element = result.Items[i];

    //         if(element.tableName === 'serviceroutes') {
    //           element.type = 'Route No.';
    //           element.typeValue = '';

    //           let url = current.apiService.getData('routes/'+element.eventID);
    //           activityGetUrl.push(url);
    //         }

    //         if(i === result.Items.length-1) {
    //           forkJoin(activityGetUrl)
    //           .subscribe(serviceResp=> {
    //             for (let j = 0; j < serviceResp.length; j++) {
    //               const element2 = serviceResp[j];
    //               if(element.tableName === 'serviceroutes') { 
    //                 result.Items[j].typeValue = element2.Items[0].routeNo;
    //               }
    //             }
    //             resolve(result.Items);
    //             current.spinner.hide();
    //           });
    //         }
    //       }
    //   })
    // })

    let todayPickupCount = new Promise(function(resolve, reject){
      let pickupObj = {
        todPickupCount: 0,
        tomPickupCount: 0
      };
      var todayDate = new Date(); 
      var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      current.apiService.getData('trips').
      subscribe((result: any) => {
        for (let i = 0; i < result.Items.length; i++) {
          const element = result.Items[i];
          if(element.isDeleted === 0 && element.tripStatus === 'confirmed'){
              if(element.dateCreated != '' && element.dateCreated != undefined) {
                let pickDate = element.dateCreated.split("-");
                var dateOne = new Date(pickDate[0], pickDate[1]-1, pickDate[2]);
                if (todayDate.setHours(0,0,0,0) === dateOne.setHours(0,0,0,0)) { 
                    pickupObj.todPickupCount = pickupObj.todPickupCount+1;
                } else if(tomorrowDate.setHours(0,0,0,0) === dateOne.setHours(0,0,0,0)){
                    pickupObj.tomPickupCount = pickupObj.tomPickupCount+1;
                }
              }
            resolve(pickupObj);
          }
        }
      })
    })

    // await latestEventActivities.then(function(result){
    //   this.activities = result;
    //   current.spinner.hide()
    // }.bind(this))

    await todayPickupCount.then(function(result){
      this.todaysPickCount = result.todPickupCount;
      this.tomorrowsPickCount = result.tomPickupCount;
      
    }.bind(this));
    
  }

  fetchActiveTrips() {
    this.spinner.show();
    this.apiService.getData('trips/status/enroute').
      subscribe((result: any) => {
        this.activeTripsCount = result.Count;
        this.spinner.hide();
      })
  }

  initDataTable() {
    this.spinner.show();
    if(this.lastEvaluatedKey != '') {
      this.lastEvaluatedKey = JSON.stringify(this.lastEvaluatedKey);
    }
    
    this.apiService.getData('auditLogs/fetch?lastEvaluatedKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.getStartandEndVal();
        result.Items.map((k)=> {
          k.eventParams.message = k.eventParams.message.replace('shippers','consigner');
          k.eventParams.message = k.eventParams.message.replace('receivers','consignee');
        })
        if(this.pageload){
          result.Items.map((v)=> {
            v.rest = v.eventParams.message.substring(0, v.eventParams.message.lastIndexOf(" ") + 1);
            v.last = v.eventParams.message.substring(v.eventParams.message.lastIndexOf(" ") + 1, v.eventParams.message.length);
          })
          this.activities = result['Items'];
          this.pageload = false;
        }
        this.allActivities = result['Items'];

        if (result['LastEvaluatedKey'] !== undefined) {
          this.dispatchNext = false;
          this.checkPrevEvaluatedKey(result['LastEvaluatedKey']);
          // for prev button
          if(this.prevKeyExist) {
            this.dispatchPrevEvauatedKeys.push(result['LastEvaluatedKey']);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'];
          
        } else {
          this.dispatchNext = true;
          this.lastEvaluatedKey = '';
          this.dispatchEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.dispatchDraw > 0) {
          this.dispatchPrev = false;
        } else {
          this.dispatchPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  fetchActivitiesCount() {
    this.apiService.getData('auditLogs/get/count').
      subscribe((result: any) => {
        this.totalRecords = result.Count;
      })
  }

  fetchAllTrips() { 
    this.spinner.show();
    this.apiService.getData('trips').
      subscribe((result: any) => {
        for (let i = 0; i < result.Items.length; i++) {
          const element = result.Items[i];
          if(element.dateCreated !== '' && element.dateCreated !== undefined) {
            let tripDate = element.dateCreated.split('-');
            let tripMonth = tripDate[1];
            if(tripMonth == '1' || tripMonth == '01') {
              this.tripsMonths.jan += 1;
            } else if(tripMonth == '2' || tripMonth == '02') {
              this.tripsMonths.feb += 1;
            } else if(tripMonth == '3' || tripMonth == '03') {
              this.tripsMonths.march += 1;
            } else if(tripMonth == '4' || tripMonth == '04') {
              this.tripsMonths.april += 1;
            } else if(tripMonth == '5' || tripMonth == '05') {
              this.tripsMonths.may += 1;
            } else if(tripMonth == '6' || tripMonth == '06') {
              this.tripsMonths.june += 1;
            } else if(tripMonth == '7' || tripMonth == '07') {
              this.tripsMonths.july += 1;
            } else if(tripMonth == '8' || tripMonth == '08') {
              this.tripsMonths.aug += 1;
            } else if(tripMonth == '9' || tripMonth == '09') {
              this.tripsMonths.sept += 1;
            } else if(tripMonth == '10') {
              this.tripsMonths.oct += 1;
            } else if(tripMonth == '11') {
              this.tripsMonths.nov += 1;
            } else if(tripMonth == '12') {
              this.tripsMonths.dec += 1;
            }
          }
        }

        this.tripGraphData = Object.keys(this.tripsMonths).map(key => this.tripsMonths[key]);
        this.initTripsGraph();
        this.totalTripsCount = result.Count;
        this.spinner.hide();
      })
  }

  fetchAllRoutes() {
    this.spinner.show();
    this.apiService.getData('routes').
      subscribe((result: any) => {
        // result = result.Items[0];
        this.permanentRoutesCount = result.Count;
        this.spinner.hide();
      })
  }

  fetchAllCustomers() {
    this.spinner.show();
    this.apiService.getData('customers/get/active').
      subscribe((result: any) => {
        // result = result.Items[0];
        this.customerCount = result.Count;
        this.spinner.hide();
      })
  }

  fetchEventActivities() {
    this.spinner.show();
    this.apiService.getData('activities').
      subscribe(async (result: any) => {
          for (let i = 0; i < result.Items.length; i++) {
            const element = result.Items[i];
  
            if(element.tableName === 'serviceroutes') {
              element.type = 'Route No.';
              this.fetchRouteDetail(element.eventID, i, function(data){
                element.typeValue = data;
                this.activities.push(element);
              }.bind(this));
            }
          }
        this.spinner.hide();
      })
  }

  fetchAlldrivers() {
    this.spinner.show();
    this.apiService.getData('drivers').
      subscribe((result: any) => {
        // result = result.Items[0];
        this.availableDriversCount = result.Count;
        this.spinner.hide();
      })
  }

  fetchAllVehicles() {
    this.spinner.show();
    this.apiService.getData('vehicles').
      subscribe((result: any) => {
        // result = result.Items[0];
        this.availableVehiclesCount = result.Count;
        this.spinner.hide();
      })
  }

  fetchRouteDetail(routeID, index, callback){
    this.apiService.getData('routes/'+routeID).
      subscribe((result: any) => {
        result = result.Items[0];
        // this.activities[index].typeValue   = result.routeNo;
        callback(result.routeNo)
      })
  }

  fetchAceManifest() {
    this.spinner.show();
    this.apiService.getData('ACIeManifest').
      subscribe((result: any) => {
        let data = result.Items;
        this.aceManifestCount = result.Count;
        if(result.Count > 0) {
          for (let i = 0; i < data.length; i++) {
            const element = data[i];

            if(element.timeCreated != undefined && element.timeCreated != '') {
              let check = moment(element.timeCreated);
              let eventMonth = check.format('M');

              if(eventMonth == '1' || eventMonth == '01') {
                this.aceMonths.jan += 1;
              } else if(eventMonth == '2' || eventMonth == '02') {
                this.aceMonths.feb += 1;
              } else if(eventMonth == '3' || eventMonth == '03') {
                this.aceMonths.march += 1;
              } else if(eventMonth == '4' || eventMonth == '04') {
                this.aceMonths.april += 1;
              } else if(eventMonth == '5' || eventMonth == '05') {
                this.aceMonths.may += 1;
              } else if(eventMonth == '6' || eventMonth == '06') {
                this.aceMonths.june += 1;
              } else if(eventMonth == '7' || eventMonth == '07') {
                this.aceMonths.july += 1;
              } else if(eventMonth == '8' || eventMonth == '08') {
                this.aceMonths.aug += 1;
              } else if(eventMonth == '9' || eventMonth == '09') {
                this.aceMonths.sept += 1;
              } else if(eventMonth == '10') {
                this.aceMonths.oct += 1;
              } else if(eventMonth == '11') {
                this.aceMonths.nov += 1;
              } else if(eventMonth == '12') {
                this.aceMonths.dec += 1;
              }
            }
          }
          this.aceGraphData = Object.keys(this.aceMonths).map(key => this.aceMonths[key]);
          this.initManifestGraph()
        }
        this.spinner.hide();
      })
  }

  fetchAciManifest() {
    this.spinner.show();
    this.apiService.getData('ACEeManifest').
      subscribe((result: any) => {
        let data = result.Items;
        this.aciManifestCount = result.Count;

        if(result.Count > 0) {
          for (let i = 0; i < data.length; i++) {
            const element = data[i];

            if(element.timeCreated != undefined && element.timeCreated != '') {
              let check = moment(element.timeCreated);
              let eventMonth = check.format('M');

              if(eventMonth == '1' || eventMonth == '01') {
                this.aciMonths.jan += 1;
              } else if(eventMonth == '2' || eventMonth == '02') {
                this.aciMonths.feb += 1;
              } else if(eventMonth == '3' || eventMonth == '03') {
                this.aciMonths.march += 1;
              } else if(eventMonth == '4' || eventMonth == '04') {
                this.aciMonths.april += 1;
              } else if(eventMonth == '5' || eventMonth == '05') {
                this.aciMonths.may += 1;
              } else if(eventMonth == '6' || eventMonth == '06') {
                this.aciMonths.june += 1;
              } else if(eventMonth == '7' || eventMonth == '07') {
                this.aciMonths.july += 1;
              } else if(eventMonth == '8' || eventMonth == '08') {
                this.aciMonths.aug += 1;
              } else if(eventMonth == '9' || eventMonth == '09') {
                this.aciMonths.sept += 1;
              } else if(eventMonth == '10') {
                this.aciMonths.oct += 1;
              } else if(eventMonth == '11') {
                this.aciMonths.nov += 1;
              } else if(eventMonth == '12') {
                this.aciMonths.dec += 1;
              }
            }
          }
          this.aciGraphData = Object.keys(this.aciMonths).map(key => this.aciMonths[key]);
          this.initManifestGraph()
        }
        this.spinner.hide();
      })
  }

  initManifestGraph() {
    this.chartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      // maintainAspectRatio: false,
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
           scaleLabel: {
              display: true,
           },
           ticks: {
              min: 0,
              stepSize: 10,
              suggestedMin: 0,
              callback: (value, index, values) => {
                 return value;
              }
           }
        }]
     }
    };
    this.chartLabels = ['January', 'February', 'March', ' April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.chartType = 'line';
    this.chartLegend = true;
    this.chartData = [
      {
        label: 'ACE',
        fill: false,
        backgroundColor: '#9c9ea1',
        borderColor: '#9c9ea1',
        borderWidth: 1,
        data: this.aceGraphData
      },
      {
        label: 'ACI',
        fill: false,
        backgroundColor: '#000',
        borderColor: '#000',
        borderWidth: 1,
        data: this.aciGraphData
     }
    ];
  }

  initTripsGraph() {
    this.tripChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      // maintainAspectRatio: false,
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
        xAxes: [{
          barPercentage: 0.4
        }]
     }
    };
    this.tripChartLabels = ['January', 'February', 'March', ' April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.tripChartType = 'bar';
    this.tripChartLegend = true;
    this.tripChartData = [
      {
        label: 'Trips',
        fill: false,
        backgroundColor: '#9c9ea1',
        borderColor: '#9c9ea1',
        borderWidth: 1,
        data: this.tripGraphData,
     }
    ];
  }

  getStartandEndVal() {
    this.dispatchStartPoint = this.dispatchDraw * this.pageLength + 1;
    this.dispatchEndPoint = this.dispatchStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.dispatchNext = true;
    this.dispatchPrev = true;
    this.dispatchDraw += 1;
    this.initDataTable();
  }

  // prev button func
  prevResults() {
    this.dispatchNext = true;
    this.dispatchPrev = true;
    this.dispatchDraw -= 1;
    this.lastEvaluatedKey = this.dispatchPrevEvauatedKeys[this.dispatchDraw];
    this.initDataTable();
  }

  checkPrevEvaluatedKey(newKeys:any = {}) {
    //if primary key matches then it will not added into the prev keys array
    for (let v = 0; v < this.dispatchPrevEvauatedKeys.length; v++) {
      const element = this.dispatchPrevEvauatedKeys[v];
      if(Object.values(element)[0] == Object.values(newKeys)[0]) {
        this.prevKeyExist = false;
        break;
      } else {
        this.prevKeyExist = true;
      }
    }
  }
}
