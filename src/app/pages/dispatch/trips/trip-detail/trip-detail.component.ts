import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services/here-map.service';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
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
    private toastr: ToastrService, private spinner: NgxSpinnerService, private hereMap: HereMapService) {
      this.selectedFileNames = new Map<any, any>();
     }

  tripData = {
    tripNo: '',
    tripStatus: '',
    documents: [],
    carrierID: '',
    reeferTemperature:'',
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

  ngOnInit() {
    this.fetchCustomersByIDs();
    this.tripID = this.route.snapshot.params['tripID'];
    this.fetchTripDetail();
    this.mapShow();

    // this.initSpeedChart();
    // this.initTemperatureChart();
  }

  mapShow() {
    this.hereMap.mapSetAPI();
    this.hereMap.mapInit();
  }

  fetchCustomersByIDs() {
    this.apiService.getData('customers/get/list').subscribe((result: any) => {
      this.customersObjects = result;
    });
  }

  fetchTripDetail() {
    this.spinner.show();
    this.tripID = this.route.snapshot.params['tripID'];
    let locations = [];
    this.apiService.getData('trips/' + this.tripID).
      subscribe((result: any) => {
        result = result.Items[0];
        
        if(result.documents == undefined) {
          result.documents = [];
        }
        this.tripData = result;
        let tripPlanning = result.tripPlanning;
        if(result.orderId.length > 0){
          this.fetchOrderDetails(result.orderId);
        }

        if(result.routeID != '' && result.routeID != undefined) {
          this.apiService.getData('routes/' + result.routeID).
            subscribe((result: any) => { 
              this.routeName = result.Items[0].routeName;
            })
        }

        if(result.documents.length > 0) {
          for (let k = 0; k < result.documents.length; k++) {
            const element = result.documents[k];
            this.uploadedDocSrc.push(`${this.Asseturl}/${result.carrierID}/${element}`);
          }
        }

        for (let i = 0; i < tripPlanning.length; i++) {
          const element = tripPlanning[i];
          let obj = {
            carrierID: element.carrierID,
            carrierName: "",
            coDriverName: "",
            coDriverUsername: element.codriverUsername,
            date: element.date,
            driverName: "",
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

          this.newCoords.push(`${element.lat},${element.lng}`);

          this.trips.push(obj);
          let assetName = '';

          let assetArr = [];
          for (let j = 0; j < element.assetID.length; j++) {
            const assetID = element.assetID[j];

            this.apiService.getData('assets/' + assetID)
              .subscribe((result: any) => {
                if (result.Items[0].assetIdentification != undefined) {
                  assetName = result.Items[0].assetIdentification;
                  let assObj = {
                    id: assetID,
                    name: assetName
                  }

                  this.allAssetName += assetName + ', ';
                  assetArr.push(assObj);
                  this.trips[i].trailerName = this.allAssetName;
                }
              })

            this.trips[i].trailer = assetArr;
          }

          if(element.vehicleID != '' && element.vehicleID != undefined) {
            this.fetchVehicleDetail(element.vehicleID, i);
          }
          
          if(element.driverUsername != '' && element.driverUsername != undefined) {
            this.fetchDriverDetail(element.driverUsername, 'driver', i);
          }
          
          if(element.codriverUsername != '' && element.codriverUsername != undefined) {
            this.fetchDriverDetail(element.codriverUsername, 'codriver', i);
          }
          
          if(element.carrierID != '' && element.carrierID != undefined) {
            this.fetchCarrierName(element.carrierID, i)
          }          
        }

        if(this.newCoords.length > 0) {
          this.getCoords(this.newCoords);
        }
        this.spinner.hide();
      })
  }

  /**
   * pass trips coords to show on the map
   * @param data
   */
  async getCoords(data) {
    
    this.hereMap.calculateRoute(this.newCoords);
  }

  fetchAssetDetail(assetID, index) {
    this.apiService.getData('assets/' + assetID)
      .subscribe((result: any) => {
        if (result.Items[0].assetIdentification != undefined) {
          return result.Items[0].assetIdentification;
        }
      })
  }

  fetchVehicleDetail(vehicleID, index) {
    this.apiService.getData('vehicles/' + vehicleID)
      .subscribe((result: any) => {
        if (result.Items[0].vehicleIdentification != undefined) {
          this.trips[index].vehicleName = result.Items[0].vehicleIdentification
        }
      })
  }

  fetchDriverDetail(driverUserName, type, index) {
    this.apiService.getData('drivers/userName/' + driverUserName)
      .subscribe((result: any) => {
        if (result.Items[0].firstName != undefined) {
          if (type === 'driver') {
            this.trips[index].driverName = result.Items[0].firstName + ' ' + result.Items[0].lastName;
          } else {
            this.trips[index].coDriverName = result.Items[0].firstName + ' ' + result.Items[0].lastName;
          }
        }
      })
  }

  fetchCarrierName(carrierID, index) {
    this.apiService.getData('carriers/' + carrierID)
      .subscribe((result: any) => {
        if (result.Items[0].carrierName != undefined) {
          this.trips[index].carrierName = result.Items[0].carrierName;
        }
      })
  }

  fetchCityDetail(cityID, index) {
    this.apiService.getData('cities/' + cityID)
      .subscribe((result: any) => {
        if (result.Items[0].cityName != undefined) {
          this.trips[index].location.cityName = result.Items[0].cityName;
          this.trips[index].locationName = this.trips[index].location.address1 + ', ' + this.trips[index].location.address2 + ', ' + this.trips[index].location.zipcode + ', ' + this.trips[index].location.cityName + ', ' + this.trips[index].location.stateName + ', ' + this.trips[index].location.countryName;
          if (this.trips[index] === this.trips[this.trips.length - 1]) {
            this.getCoords(this.trips);
          }
        }
      })
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

  // selectDocuments(event) {
  //   this.selectedFiles = event.target.files;
  //   for (let i = 0; i < this.selectedFiles.item.length; i++) {
  //     const randomFileGenerate = this.selectedFiles[i].name.split('.');
  //     const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;
  //     this.selectedFileNames.set(fileName, this.selectedFiles[i]);
  //     this.documentID.push(fileName);
  //   }
  // }

  fetchOrderDetails(orderIds) {
    orderIds = JSON.stringify(orderIds);
    this.apiService.getData('orders/fetch/selectedOrders?orderIds='+orderIds).subscribe((result: any) => {
        
        let calcultedBy = '';
        let totalMilesOrder = 0;
        for (let i = 0; i < result.length; i++) {
            const element = result[i];

            this.orderNumbers = element.orderNumber;
            if(i>0 && i<result.length-1) {
              this.orderNumbers = this.orderNumbers+', ';
            }
            calcultedBy = element.milesInfo.calculateBy;
            totalMilesOrder += parseFloat(element.milesInfo.totalMiles);
        }

        this.plannedMiles = totalMilesOrder;
        // this.setOrdersDataFormat(result);
    })
  }

   /*
   * Selecting files before uploading
   */
   selectDocuments(event: any) {
    this.uploadedDocs = [];
    let files = [...event.target.files];
    let totalCount = this.uploadedDocSrc.length+files.length;

    if(totalCount >= 4) {
      $('#bolUpload').val('');
      this.toastr.error('Only 4 documents can be uploaded');
      return false;
    } else {
      // create form data instance
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        this.uploadedDocs.push(element);
      }

      //append docs if any
      for(let j = 0; j < this.uploadedDocs.length; j++){
        let file = this.uploadedDocs[j];
        formData.append(`uploadedDocs-${j}`, file);
      }
      
      formData.append('data', JSON.stringify(this.tripData.documents));

      this.apiService.postData('trips/update/bol/'+this.tripID,formData, true).subscribe({
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
        next: (res:any) => {
          this.uploadedDocSrc = [];
          if(res.Attributes.documents.length > 0) {
            for (let k = 0; k < res.Attributes.documents.length; k++) {
              const element = res.Attributes.documents[k];
              this.uploadedDocSrc.push(`${this.Asseturl}/${this.tripData.carrierID}/${element}`);
            }
          }
          this.toastr.success('BOL uploaded successfully');
        },
      })
    }
  }
}
