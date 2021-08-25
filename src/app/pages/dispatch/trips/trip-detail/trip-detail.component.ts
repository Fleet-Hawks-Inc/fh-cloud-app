import { Component, OnInit } from '@angular/core';
import { AccountService, ApiService } from '../../../../services';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services/here-map.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
declare var $: any;
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css']
})
export class TripDetailComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  environment = environment.isFeatureEnabled;
  constructor(private apiService: ApiService, private route: ActivatedRoute,
    private accountService: AccountService,
    private toastr: ToastrService, private spinner: NgxSpinnerService, private hereMap: HereMapService) {
    this.selectedFileNames = new Map<any, any>();
  }

  tripData = {
    tripNo: '',
    tripStatus: '',
    documents: [],
    carrierID: '',
    reeferTemperature: '',
    reeferTemperatureUnit: '',
    notifications: {
      changeRoute: false,
      pickUp: false,
      dropOff: false,
      tripToDriver: false,
      tripToDispatcher: false
    },
    bol: '',
    dateCreated: ''
  };
  tripID = '';
  allAssetName = '';
  errors: {};
  trips = [];

  newCoords = [];

  speedChartOptions: any;
  speedChartType = '';
  speedChartLegend;
  speedChartData = [];
  speedChartLabels = [];

  temperatureChartOptions: any;
  temperatureChartType = '';
  temperatureChartLegend;
  temperatureChartData = [];
  temperatureChartLabels = [];

  selectedFiles: FileList;
  carrierID = '';
  selectedFileNames: Map<any, any>;
  documentID = [];
  allFetchedOrders = [];
  customersObjects = [];
  orderNumbers = '-';
  routeName = '-';
  plannedMiles = 0;
  uploadedDocs = [];
  uploadedDocSrc = [];
  vehiclesObject: any = {};
  assetsObject: any = {};
  carriersObject: any = {};
  driversObject: any = {};
  lastDelivery = '';
  stops = 0;
  totalExp = 0;
  tripLog = [];
  expenses = [];
  categories = [];
  ngOnInit() {
    this.fetchAllVehiclesIDs();
    this.fetchAllAssetIDs();
    this.fetchAllCarrierIDs();
    this.fetchAllDriverIDs();
    this.fetchCustomersByIDs();
    this.tripID = this.route.snapshot.params['tripID'];
    this.fetchTripDetail();
    this.mapShow();
    this.fetchTripLog();
    this.fetchExpenses();
    this.fetchExpenseCategories();
    // this.initSpeedChart();
    // this.initTemperatureChart();
  }
  fetchTripLog() {
    const lastEvaluatedKey = '';
    this.apiService.getData('auditLogs/fetch?lastEvaluatedKey=' + lastEvaluatedKey).subscribe((res: any) => {
      res.Items.map((k) => {
        if (k.eventParams.eventID === this.tripID) {
          this.tripLog.push(k);
        }
      });
      if (this.tripLog.length > 0) {
        this.tripLog.map((k) => {
          if (k.eventParams.userName !== undefined) {
            const newString = k.eventParams.userName.split('_');
            k.userFirstName = newString[0];
            k.userLastName = newString[1];
          }
          if (k.eventParams.number !== undefined) {
            k.entityNumber = k.eventParams.number;
          }
          if (k.eventParams.name !== undefined) {
            if (k.eventParams.name.includes('_')) {
              const newString = k.eventParams.name.split('_');
              k.firstName = newString[0];
              k.lastName = newString[1];
            }
          }
        });
      }
    });
  }
  mapShow() {
    this.hereMap.mapSetAPI();
    this.hereMap.mapInit();
  }

  fetchCustomersByIDs() {
    this.apiService.getData('contacts/get/list/customer').subscribe((result: any) => {
      this.customersObjects = result;
    });
  }
  fetchExpenses() {
    this.accountService.getData(`expense`).subscribe((result: any) => {
      this.expenses = result.filter((e: any) => {
        return e.tripID === this.tripID;
      });
      for (const element of this.expenses) {
        this.totalExp = this.totalExp + element.amount;
      }
    });

  }
  fetchExpenseCategories() {
    this.accountService.getData(`expense/categories/list`)
      .subscribe((result: any) => {
        this.categories = result;
      })
  }
  fetchTripDetail() {
    this.spinner.show();
    this.tripID = this.route.snapshot.params['tripID'];
    let locations = [];
    this.apiService.getData('trips/' + this.tripID).
      subscribe((result: any) => {
        result = result.Items[0];

        if (result.documents == undefined) {
          result.documents = [];
        }
        this.tripData = result;
        let tripPlanning = result.tripPlanning;
        if (result.orderId.length > 0) {
          this.fetchOrderDetails(result.orderId);
        }

        if (result.routeID != '' && result.routeID != undefined) {
          this.apiService.getData('routes/' + result.routeID).
            subscribe((result: any) => {
              this.routeName = result.Items[0].routeName;
            })
        }

        if (result.documents.length > 0) {
          for (let k = 0; k < result.documents.length; k++) {
            const element = result.documents[k];

            let name = element.split('.');
            let ext = name[name.length - 1];
            let obj = {
              imgPath: '',
              docPath: ''
            }
            if (ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
              obj = {
                imgPath: `${this.Asseturl}/${result.carrierID}/${element}`,
                docPath: `${this.Asseturl}/${result.carrierID}/${element}`
              }
            } else {
              obj = {
                imgPath: 'assets/img/icon-pdf.png',
                docPath: `${this.Asseturl}/${result.carrierID}/${element}`
              }
            }
            this.uploadedDocSrc.push(obj);
          }
        }

        for (let i = 0; i < tripPlanning.length; i++) {
          const element = tripPlanning[i];

          let obj = {
            assetID: element.assetID,
            carrierID: element.carrierID,
            carrierName: "",
            coDriverName: "",
            coDriverUsername: element.codriverUsername,
            date: element.date,
            driverName: "",
            driverID: element.driverID,
            coDriverID: element.coDriverID,
            driverUsername: element.driverUsername,
            locationName: element.location,
            mileType: element.mileType,
            miles: element.miles,
            name: element.name,
            trailer: '',
            trailerName: "",
            type: element.type,
            vehicleID: element.vehicleID,
            vehicleName: "",
            actualDropTime: element.actualDropTime,
            actualPickupTime: element.actualPickupTime,
            dropTime: element.dropTime,
            time: element.time,
            pickupTime: element.pickupTime
          };

          if (element.type == 'Delivery') {
            this.lastDelivery = element.dropTime;
          }

          if (element.type == 'Stop') {
            this.stops += 1;
          }

          this.plannedMiles += parseFloat(element.miles);
          this.newCoords.push(`${element.lat},${element.lng}`);
          this.trips.push(obj);
        }

        if (this.newCoords.length > 0) {
          this.getCoords();
        }
        this.spinner.hide();
      })
  }

  /**
   * pass trips coords to show on the map
   * @param data
   */
  async getCoords() {
    this.hereMap.calculateRoute(this.newCoords);
  }

  initSpeedChart() {
    this.speedChartOptions = {
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
    this.speedChartLabels = [
      '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM', '3:00 AM', '3:30 AM',
      '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM',
      '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
      '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
      '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'],
      this.speedChartType = 'line';
    this.speedChartLegend = true;
    this.speedChartData = [
      {
        label: 'Speed Chart',
        hidden: false,
        fill: false,
        backgroundColor: '#9c9ea1',
        borderColor: '#9c9ea1',
        borderWidth: 1,
        data: [
          22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
          22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
          22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
          22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
          22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
          22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
        ],
      }
    ];
  }

  initTemperatureChart() {
    this.temperatureChartOptions = {
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
          // ticks: {beginAtZero:true},
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Temperature (F)'
          },
          ticks: {
            min: 0,
            max: 80,
            stepSize: 5,
            suggestedMin: 0,
            suggestedMax: 80,
            // Include a degree sign in the ticks
            callback: function (value, index, values) {
              return value + '°F';
            }
          }
        }]
      }
    };
    this.temperatureChartLabels = ['31 July 12:00', '31 July 18:00', '1 Aug 00:00', '1 Aug 06:00', '1 Aug 12:00', '1 Aug 18:00', '2 Aug 00:00', '2 Aug 06:00', '2 Aug 12:00', '2 Aug 18:00'],
      this.temperatureChartType = 'line';
    this.temperatureChartLegend = true;
    this.temperatureChartData = [
      {
        label: 'Set Temperature',
        fill: false,
        backgroundColor: '#9c9ea1',
        borderColor: '#9c9ea1',
        borderWidth: 1,
        data: [
          12, 15, 17, 13, 15, 12, 18, 12, 18, 13, 10, 14, 12
        ],
      },
      {
        label: 'Actual Temperature',
        fill: false,
        backgroundColor: '#000',
        borderColor: '#000',
        borderWidth: 1,
        data: [
          10, 14, 12, 11, 14, 11, 15, 12, 16, 14, 11, 13, 14
        ],
      }
    ];
  }

  fetchOrderDetails(orderIds) {
    orderIds = JSON.stringify(orderIds);
    this.apiService.getData('orders/fetch/selectedOrders?orderIds=' + orderIds).subscribe((result: any) => {
      for (let i = 0; i < result.length; i++) {
        const element = result[i];

        this.orderNumbers = element.orderNumber;
        if (i > 0 && i < result.length - 1) {
          this.orderNumbers = this.orderNumbers + ', ';
        }
      }
    })
  }

  /*
  * Selecting files before uploading
  */
  selectDocuments(event: any) {
    this.uploadedDocs = [];
    let files = [...event.target.files];
    let totalCount = this.tripData.documents.length + files.length;

    if (totalCount > 4) {
      $('#bolUpload').val('');
      this.toastr.error('Only 4 documents can be uploaded');
      return false;
    } else {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        let name = element.name.split('.');
        let ext = name[name.length - 1];

        if (ext != 'jpg' && ext != 'jpeg' && ext != 'png' && ext != 'pdf') {
          $('#bolUpload').val('');
          this.toastr.error('Only image and pdf files are allowed');
          return false;
        }
      }

      // create form data instance
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        this.uploadedDocs.push(element);
      }

      //append docs if any
      for (let j = 0; j < this.uploadedDocs.length; j++) {
        let file = this.uploadedDocs[j];
        formData.append(`uploadedDocs-${j}`, file);
      }

      formData.append('data', JSON.stringify(this.tripData.documents));

      this.apiService.postData('trips/update/bol/' + this.tripID, formData, true).subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.label] = val.message;
                this.spinner.hide();
              })
            )
            .subscribe({
              complete: () => {
                this.spinner.hide();
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res: any) => {
          this.tripData.documents = res;

          this.uploadedDocSrc = [];
          if (res.length > 0) {
            for (let k = 0; k < res.length; k++) {
              const element = res[k];
              // this.uploadedDocSrc.push(`${this.Asseturl}/${this.tripData.carrierID}/${element}`);

              let name = element.split('.');
              let ext = name[name.length - 1];
              let obj = {
                imgPath: '',
                docPath: ''
              }
              if (ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
                obj = {
                  imgPath: `${this.Asseturl}/${this.tripData.carrierID}/${element}`,
                  docPath: `${this.Asseturl}/${this.tripData.carrierID}/${element}`
                }
              } else {
                obj = {
                  imgPath: 'assets/img/icon-pdf.png',
                  docPath: `${this.Asseturl}/${this.tripData.carrierID}/${element}`
                }
              }
              this.uploadedDocSrc.push(obj);
            }
          }
          this.toastr.success('BOL/POD uploaded successfully');
        },
      })
    }
  }

  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/get/list')
      .subscribe((result: any) => {
        this.vehiclesObject = result;
      });
  }

  fetchAllAssetIDs() {
    this.apiService.getData('assets/get/list')
      .subscribe((result: any) => {
        this.assetsObject = result;
      });
  }

  fetchAllCarrierIDs() {
    this.apiService.getData('contacts/get/list/carrier')
      .subscribe((result: any) => {
        this.carriersObject = result;
      });
  }

  fetchAllDriverIDs() {
    this.apiService.getData('drivers/get/list')
      .subscribe((result: any) => {
        this.driversObject = result;
      });
  }
}
