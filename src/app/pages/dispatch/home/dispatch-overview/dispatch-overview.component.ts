import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
// import { EventActivitiesService } from '../../../../services/event-activities.service';
import {forkJoin} from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-dispatch-overview',
  templateUrl: './dispatch-overview.component.html',
  styleUrls: ['./dispatch-overview.component.css']
})
export class DispatchOverviewComponent implements OnInit {

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


  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.initManifestGraph();
    this.initTripsGraph();
    this.dispatchData();

    this.fetchAllTrips();
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
    let latestEventActivities = new Promise(function(resolve, reject){
      current.apiService.getData('activities').
      subscribe(async (result: any) => {
          let activityGetUrl = [];
          for (let i = 0; i < result.Items.length; i++) {
            const element = result.Items[i];

            if(element.tableName === 'serviceroutes') {
              element.type = 'Route No.';
              element.typeValue = '';

              let url = current.apiService.getData('routes/'+element.eventID);
              activityGetUrl.push(url);
            }

            if(i === result.Items.length-1) {
              forkJoin(activityGetUrl)
              .subscribe(serviceResp=> {
                for (let j = 0; j < serviceResp.length; j++) {
                  const element2 = serviceResp[j];
                  if(element.tableName === 'serviceroutes') { 
                    result.Items[j].typeValue = element2.Items[0].routeNo;
                  }
                }
                resolve(result.Items);
              });
            }
          }
      })
    })

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
          if(element.isDeleted === '0' && element.tripStatus === 'planned'){
            for (let j = 0; j < element.tripPlanning.length; j++) {
              const element2 = element.tripPlanning[j];
              let pickDate = element2.date.split("-");
              var dateOne = new Date(pickDate[0], pickDate[1]-1, pickDate[2]);
              if (todayDate.setHours(0,0,0,0) === dateOne.setHours(0,0,0,0) && element2.type === "Pickup") { 
                  pickupObj.todPickupCount = pickupObj.todPickupCount+1;
              } else if(tomorrowDate.setHours(0,0,0,0) === dateOne.setHours(0,0,0,0) && element2.type === "Pickup"){
                  pickupObj.tomPickupCount = pickupObj.tomPickupCount+1;
              }
            }
            resolve(pickupObj);
          }
        }
      })
    })

    await latestEventActivities.then(function(result){
      this.activities = result;
      current.spinner.hide()
    }.bind(this))

    await todayPickupCount.then(function(result){
      this.todaysPickCount = result.todPickupCount;
      this.tomorrowsPickCount = result.tomPickupCount;
      
    }.bind(this));
    
  }

  fetchActiveTrips() {
    this.spinner.show();
    this.apiService.getData('trips/status/enroute').
      subscribe((result: any) => {
        // result = result.Items[0];
        this.activeTripsCount = result.Count;
        this.spinner.hide();
      })
  }

  fetchAllTrips() {
    this.spinner.show();
    this.apiService.getData('trips/active/all').
      subscribe((result: any) => {
        // result = result.Items[0];
        this.totalTripsCount = result.Count;
        this.spinner.hide();
      })
  }

  fetchAllRoutes() {
    this.spinner.show();
    this.apiService.getData('routes/get/active').
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
        // result = result.Items[0];
        this.aceManifestCount = result.Count;
        this.spinner.hide();
      })
  }

  fetchAciManifest() {
    this.spinner.show();
    this.apiService.getData('ACEeManifest').
      subscribe((result: any) => {
        // result = result.Items[0];
        this.aciManifestCount = result.Count;
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
        data: [
          15,85,45,15,16,18,84,58,64,15,74,15,1,69,25,45
        ],
      },
      {
        label: 'ACI',
        fill: false,
        backgroundColor: '#000',
        borderColor: '#000',
        borderWidth: 1,
        data: [
           15,85,45,64,15,74,15,1,69,25,45,15,16,18,84,58,
        ],
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
        data: [
           15,85,45,64,15,74,15,1,69,25,45,15,16,18,84,58,
        ],
     }
    ];
  }
}
