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
declare var $: any;

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css']
})
export class TripDetailComponent implements OnInit {

  constructor(private apiService: ApiService, private awsUS: AwsUploadService, private route: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private hereMap: HereMapService) { }

  tripData = {};
  tripID = '';
  allAssetName = '';
  errors: {};
  trips = [];
  ngOnInit() {
    this.fetchTripDetail();
    this.mapShow();
  }

  mapShow() {
    this.hereMap.mapInit();
  }

  fetchTripDetail() {
    this.spinner.show();
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
            location: {
              countryID: element.location.countryID,
              cityID: element.location.cityID,
              cityName: '',
              countryName: '',
              locationName: '',
              stateID: element.location.stateID,
              stateName: '',
              zipcode: element.location.zipcode,
              address1: element.location.address1,
              address2: element.location.address2,
            },
            locationName: "",
            mileType: element.mileType,
            miles: element.miles,
            name: element.name,
            trailer: '',
            trailerName: "",
            type: element.type,
            vehicleID: element.vehicleID,
            vehicleName: ""
          };

          this.trips.push(obj);
          let assetName = '';

          let assetArr = [];
          for (let j = 0; j < element.assetID.length; j++) {
            const assetID = element.assetID[j];
            // let assetName = this.fetchAssetDetail(assetID,j);

            this.apiService.getData('assets/' + assetID)
              .subscribe((result: any) => {
                // console.log('========here');
                if (result.Items[0].assetIdentification != undefined) {
                  assetName = result.Items[0].assetIdentification;
                  // console.log('assetName', assetName)

                  let assObj = {
                    id: assetID,
                    name: assetName
                  }

                  this.allAssetName += assetName + ', ';
                  assetArr.push(assObj);
                  this.trips[i].trailerName = this.allAssetName;
                }
              })

            // console.log('========now here');
            this.trips[i].trailer = assetArr;
          }
          this.fetchVehicleDetail(element.vehicleID, i);
          this.fetchDriverDetail(element.driverUsername, 'driver', i);
          this.fetchDriverDetail(element.codriverUsername, 'codriver', i);
          this.fetchCountryName(element.location.countryID, i);
          this.fetchStateDetail(element.location.stateID, i);
          this.fetchCityDetail(element.location.cityID, i);
          this.fetchCarrierName(element.carrierID, i)
        }
        this.spinner.hide();
      })
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
        // console.log(result.Items[0]);
        if (result.Items[0].vehicleIdentification != undefined) {
          this.trips[index].vehicleName = result.Items[0].vehicleIdentification
        }
      })
  }

  fetchDriverDetail(driverUserName, type, index) {
    this.apiService.getData('drivers/userName/' + driverUserName)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
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
        // console.log(result.Items[0]);
        if (result.Items[0].countryName != undefined) {
          this.trips[index].location.countryName = result.Items[0].countryName;
        }
      })
  }

  fetchCarrierName(carrierID, index) {
    this.apiService.getData('carriers/' + carrierID)
      .subscribe((result: any) => {
        // console.log('carrier');
        // console.log(result.Items[0]);
        if (result.Items[0].businessDetail.carrierName != undefined) {
          this.trips[index].carrierName = result.Items[0].businessDetail.carrierName;

          console.log('this.trips');
          console.log(this.trips);
        }
      })
  }

  fetchStateDetail(stateID, index) {
    this.apiService.getData('states/' + stateID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].stateName != undefined) {
          this.trips[index].location.stateName = result.Items[0].stateName;
        }
      })
  }

  fetchCityDetail(cityID, index) {
    this.apiService.getData('cities/' + cityID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].cityName != undefined) {
          this.trips[index].location.cityName = result.Items[0].cityName;
          this.trips[index].locationName = this.trips[index].location.address1 + ', ' + this.trips[index].location.address2 + ', ' + this.trips[index].location.zipcode + ', ' + this.trips[index].location.cityName + ', ' + this.trips[index].location.stateName + ', ' + this.trips[index].location.countryName;
        }
      })
  }



  // initSpeedChart(){
  //  var graph2 = new Chart('speedChart', {
  //     type: 'line',
  //     data: {
  //        labels: [
  //            '12:00 AM', '12:30 AM','1:00 AM', '1:30 AM','2:00 AM', '2:30 AM','3:00 AM', '3:30 AM',
  //            '4:00 AM', '4:30 AM','5:00 AM', '5:30 AM','6:00 AM', '6:30 AM','7:00 AM', '7:30 AM',
  //            '8:00 AM', '8:30 AM','9:00 AM', '9:30 AM','10:00 AM', '10:30 AM','11:00 AM', '11:30 AM',
  //            '12:00 PM', '12:30 PM','1:00 PM', '1:30 PM','2:00 PM', '2:30 PM','3:00 PM', '3:30 PM',
  //            '4:00 PM', '4:30 PM','5:00 PM', '5:30 PM','6:00 PM', '6:30 PM','7:00 PM', '7:30 PM',
  //            '8:00 PM', '8:30 PM','9:00 PM', '9:30 PM','10:00 PM', '10:30 PM','11:00 PM', '11:30 PM'],
  //        datasets: [{
  //           label: 'Speed',
  //           fill: false,
  //           backgroundColor: '#9c9ea1',
  //           borderColor: '#9c9ea1',
  //           borderWidth: 1,
  //           data: [
  //              22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
  //              22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
  //              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //              22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
  //              22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
  //              22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
  //              22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
  //              22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,

  //           ],
  //        }]
  //     },
  //     options: {
  //        responsive: true,
  //        maintainAspectRatio: false,
  //        tooltips: {
  //           mode: 'index',
  //           intersect: false,
  //        },
  //        hover: {
  //           mode: 'nearest',
  //           intersect: true
  //        },
  //        legend: {
  //           position: 'top',
  //           labels: {
  //              boxWidth: 10
  //           }
  //        },
  //        scales: {
  //           xAxes: [{
  //              // ticks: {beginAtZero:true},
  //              display: true,
  //              scaleLabel: {
  //                 display: true,
  //                 labelString: ''
  //              },

  //           }]
  //        }

  //     }
  //  });

  // }

}
