import { Component, OnInit } from '@angular/core';
// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
// import { v4 as uuidv4 } from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services/here-map.service';
import { v4 as uuidv4 } from 'uuid';
declare var $: any;

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css']
})
export class TripDetailComponent implements OnInit {

  constructor(private apiService: ApiService, private awsUS: AwsUploadService, private route: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private hereMap: HereMapService) {
      this.selectedFileNames = new Map<any, any>();
     }

  tripData = {};
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

  ngOnInit() {
    this.tripID = this.route.snapshot.params['tripID'];
    this.fetchTripDetail();
    this.mapShow();

    this.initSpeedChart();
    this.initTemperatureChart();
  }

  mapShow() {
    this.hereMap.mapInit();
  }

  fetchTripDetail() {
    this.spinner.show();
    this.tripID = this.route.snapshot.params['tripID'];
    let locations = [];
    this.apiService.getData('trips/' + this.tripID).
      subscribe((result: any) => {
        result = result.Items[0];
        this.tripData = result;
        let tripPlanning = result.tripPlanning;
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

          if(element.location != undefined && element.location != '') {
            locations.push(element.location)
          }

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

        if(locations.length > 0) {
          this.getCoords(locations);
        }
        this.spinner.hide();
      })
  }

  /**
   * pass trips coords to show on the map
   * @param data
   */
  async getCoords(data) {
    this.spinner.show();
    await Promise.all(data.map(async item => {
      let result = await this.hereMap.geoCode(item);
      this.newCoords.push(`${result.items[0].position.lat},${result.items[0].position.lng}`)
    }));
    this.hereMap.calculateRoute(this.newCoords);
    this.spinner.hide();
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

  fetchCountryName(countryID, index) {
    this.apiService.getData('countries/' + countryID)
      .subscribe((result: any) => {
        if (result.Items[0].countryName != undefined) {
          this.trips[index].location.countryName = result.Items[0].countryName;
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

  fetchStateDetail(stateID, index) {
    this.apiService.getData('states/' + stateID)
      .subscribe((result: any) => {
        if (result.Items[0].stateName != undefined) {
          this.trips[index].location.stateName = result.Items[0].stateName;
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

  uploadFiles = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    this.selectedFileNames.forEach((fileData: any, fileName: string) => {
      this.awsUS.uploadFile(this.carrierID, fileName, fileData);
    });
  }

  selectDocuments(event) {
    this.selectedFiles = event.target.files;
    for (let i = 0; i < this.selectedFiles.item.length; i++) {
      const randomFileGenerate = this.selectedFiles[i].name.split('.');
      const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;
      this.selectedFileNames.set(fileName, this.selectedFiles[i]);
      this.documentID.push(fileName);
    }
    this.uploadFiles();
  }
}
