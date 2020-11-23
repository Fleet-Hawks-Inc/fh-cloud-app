import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {

  form;
  title = "Trips";
  tripID = '';
  tripStatus = '';
  tripNumber = '';
  bolNumber = '';
  tripData = {
    tripID: '',
    tripStatus: ''
  };
  dummyTrips = [];
  trips = [];
  tempTrips = [];
  plannedTrips = [];
  dispatchedTrips = [];
  startedTrips = [];
  enrouteTrips = [];
  cancelledTrips = [];
  deliveredTrips = [];
  plannedTripsCount = 0;
  dispatchedTripsCount = 0;
  startedTripsCount = 0;
  enrouteTripsCount = 0;
  cancelledTripsCount = 0;
  deliveredTripsCount = 0;
  statusData = [
    {
      name: "Planned",
      value: 'planned'
    },
    {
      name: "Dispatched",
      value: 'dispatched'
    },
    {
      name: "Started",
      value: 'started'
    },
    {
      name: "En-route",
      value: 'enroute'
    },
    {
      name: "Cancelled",
      value: 'cancelled'
    },
    {
      name: "Delivered",
      value: 'delivered'
    },
  ]

  dtOptions: any = {};

  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  errors = {};

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchTrips();
    this.initDataTable();
  }

  fetchTrips() {
    this.spinner.show();
    this.apiService.getData('trips').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        // console.log(result);

        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].isDeleted == '0') {

            result.Items[i].pickupCountry = '';
            result.Items[i].pickupState = '';
            result.Items[i].pickupCity = '';
            result.Items[i].pickupTime = '';
            result.Items[i].dropCountry = '';
            result.Items[i].dropState = '';
            result.Items[i].dropCity = '';
            result.Items[i].dropTime = '';
            result.Items[i].dropLocation = '';

            result.Items[i].driverName = '';
            result.Items[i].vehicleName = '';
            result.Items[i].assetName = '';
            result.Items[i].carrierName = '';

            //for (let i = 0; i < tempTrips.length; i++) {
            const element = result.Items[i];
            // element.
            let pickup;
            let drop;
            let planData;

            if (result.Items[i].tripPlanning !== undefined) {
              if (result.Items[i].tripPlanning.length > 0) {
                planData = result.Items[i].tripPlanning[0];

                pickup = result.Items[i].tripPlanning[0].location;

                // console.log('pickup');
                // console.log(pickup);
                this.fetchCountryName(pickup.countryID, i, 'pickup', result.Items[i]);
                this.fetchStateDetail(pickup.stateID, i, 'pickup', result.Items[i]);
                this.fetchCityDetail(pickup.cityID, i, 'pickup', result.Items[i]);

                if( planData.assetID !== '' && planData.assetID !== undefined){
                  // console.log('asset=============');
                  for (let j = 0; j < planData.assetID.length; j++) {
                    const astId = planData.assetID[j];
                    this.fetchAssetDetail(astId, result.Items[i]);
                  }
                }

                if( planData.driverUsername !== '' && planData.driverUsername !== undefined){
                  // console.log('driver=============');
                  this.fetchDriverDetail(planData.driverUsername, result.Items[i]);
                }

                if( planData.vehicleID !== '' && planData.vehicleID !== undefined){
                  // console.log('vehicle=============');
                  this.fetchVehicleDetail(planData.vehicleID, result.Items[i]);
                }
                
                if( planData.carrierID !== '' && planData.carrierID !== undefined){
                  // console.log('carrier=============');
                  this.fetchCarrierName(planData.carrierID, result.Items[i]);
                }
                
                result.Items[i].pickupLocation = pickup.address1 + ', ' + pickup.address2 + ', ' + pickup.zipcode;
                let date = result.Items[i].tripPlanning[0].date;
                let newdate = '';
                if (date !== '' && date !== undefined) {
                  newdate = date.split("-").reverse().join("-");
                }

                result.Items[i].pickupTime = newdate + ' ' + result.Items[i].tripPlanning[0].time;
                // result.Items[i].time = result.Items[i].tripPlanning[0].time;

                if (result.Items[i].tripPlanning.length >= 2) {
                  let lastloc = result.Items[i].tripPlanning.length - 1
                  drop = result.Items[i].tripPlanning[lastloc].location;
                  this.fetchCountryName(drop.countryID, i, 'drop', result.Items[i]);
                  this.fetchStateDetail(drop.stateID, i, 'drop', result.Items[i]);
                  this.fetchCityDetail(drop.cityID, i, 'drop', result.Items[i]);

                  let ddate = result.Items[i].tripPlanning[lastloc].date;
                  let newddate = '';
                  if (ddate !== '' && ddate !== undefined) {
                    newddate = ddate.split("-").reverse().join("-");
                  }
                  result.Items[i].dropLocation = drop.address1 + ', ' + drop.address2 + ', ' + drop.zipcode;
                  result.Items[i].dropTime = newddate + ' ' + result.Items[i].tripPlanning[lastloc].time;
                }
              }
              // console.log('element=============');
              // console.log(element)
            }
            this.trips.push(result.Items[i]);


            if (result.Items[i].tripStatus === 'planned') {
              this.plannedTrips.push(result.Items[i]);
            } else if (result.Items[i].tripStatus === 'dispatched') {
              this.dispatchedTrips.push(result.Items[i]);
            } else if (result.Items[i].tripStatus === 'started') {
              this.startedTrips.push(result.Items[i]);
            } else if (result.Items[i].tripStatus === 'enroute') {
              this.enrouteTrips.push(result.Items[i]);
            } else if (result.Items[i].tripStatus === 'cancelled') {
              this.cancelledTrips.push(result.Items[i]);
            } else if (result.Items[i].tripStatus === 'delivered') {
              this.deliveredTrips.push(result.Items[i]);
            }
          }
        }

        console.log('this.trips', this.trips);

        this.plannedTripsCount = this.plannedTrips.length;
        this.dispatchedTripsCount = this.dispatchedTrips.length;
        this.startedTripsCount = this.startedTrips.length;
        this.enrouteTripsCount = this.enrouteTrips.length;
        this.cancelledTripsCount = this.cancelledTrips.length;
        this.deliveredTripsCount = this.deliveredTrips.length;
        this.spinner.hide();

      }
    })
  }

  openStatusModal(tripId) {
    this.tripID = tripId;
    this.fetchTripDetail();
  }


  initDataTable() {

    // this.dtOptions = {
    //   ajax: 'data/data.json',
    //   columns: [{
    //     title: 'ID',
    //     data: 'id'
    //   }, {
    //     title: 'Trip',
    //     data: 'tripNo'
    //   }, {
    //     title: 'Type',
    //     data: '-'
    //   }]
    // };

    this.dtOptions = { // All list options
      pageLength: 10,
      processing: true,
      // select: {
      //     style:    'multi',
      //     selector: 'td:first-child'
      // },
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        // {
        //   extend: 'colvis',
        //   columns: ':not(.noVis)'
        // }
      ],
      colReorder: true,

    };
  }

  deleteTrip(tripID) {
    this.spinner.show();
    this.apiService.getData('trips/delete/' + tripID + '/1').subscribe({
      complete: () => {
        // this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        this.initDataTable();
        // this.initDataTable();
        this.spinner.hide();
        this.hasSuccess = true;
        // this.router.navigateByUrl('/dispatch/routes/route-list');
        this.toastr.success('Trip deleted successfully');
      }
    })
  }

  fetchTripDetail() {
    this.spinner.show();
    this.apiService.getData('trips/' + this.tripID).
      subscribe((result: any) => {
        result = result.Items[0];

        this.tripStatus = result.tripStatus;
        this.tripNumber = result.tripNo;
        this.bolNumber = result.bol;

        $("#tripStatusModal").modal('show');
        this.spinner.hide();
      })
  }

  updateTripStatus(tripId) {
    this.spinner.show();
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    if (this.tripStatus === '') {
      this.toastr.error('Please select trip status');
      this.spinner.hide();
      return false;
    }

    this.apiService.getData('trips/update-status/' + this.tripID + '/' + this.tripStatus).subscribe({
      complete: () => {
      },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              // console.log(key);
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.spinner.hide();
              this.throwErrors();
            },
            error: () => {
            },
            next: () => {
            },
          });
      },
      next: (res) => {
        this.fetchTrips();

        this.spinner.hide();
        $("#tripStatusModal").modal('hide');
        this.toastr.success('Trip status updated successfully');
        this.router.navigateByUrl('/dispatch/trips/trip-list');
      },
    });
  }

  throwErrors() {
    // console.log(this.errors);
    this.form.showErrors(this.errors);
  }

  fetchCountryName(countryID, index, type, tripArr) {
    this.apiService.getData('countries/' + countryID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].countryName != undefined) {
          if (type === 'pickup') {
            tripArr.pickupCountry = result.Items[0].countryName;
          } else {
            tripArr.dropCountry = result.Items[0].countryName;
          }
        }
      })
  }

  fetchStateDetail(stateID, index, type, tripArr) {
    this.apiService.getData('states/' + stateID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].stateName != undefined) {
          if (type === 'pickup') {
            tripArr.pickupState = result.Items[0].stateName;
          } else {
            tripArr.dropState = result.Items[0].stateName;
          }
        }
      })
  }

  fetchCityDetail(cityID, index, type, tripArr) {
    this.apiService.getData('cities/' + cityID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].cityName != undefined) {
          if (type === 'pickup') {
            tripArr.pickupCity = result.Items[0].cityName;
          } else {
            tripArr.dropCity = result.Items[0].cityName;
          }
        }
      })
  }

  fetchAssetDetail(assetID, tripArr) {
    this.apiService.getData('assets/' + assetID)
      .subscribe((result: any) => {
        // console.log('asset')
        if (result.Items[0].assetIdentification != undefined) {
          tripArr.assetName = result.Items[0].assetIdentification + ', ';
        }
      })
  }

  fetchVehicleDetail(vehicleID, tripArr) {
    this.apiService.getData('vehicles/' + vehicleID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].vehicleIdentification != undefined) {
          tripArr.vehicleName = result.Items[0].vehicleIdentification
        }
      })
  }

  fetchDriverDetail(driverUserName, tripArr) {
    this.apiService.getData('drivers/userName/' + driverUserName)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].firstName != undefined) {
          tripArr.driverName = result.Items[0].firstName + ' ' + result.Items[0].lastName;
        }
      })
  }

  fetchCarrierName(carrierID, tripArr) {
    this.apiService.getData('carriers/' + carrierID)
      .subscribe((result: any) => {
        // console.log('carrier');
        // console.log(result.Items[0]);
        if (result.Items[0].businessDetail.carrierName != undefined) {
          tripArr.carrierName = result.Items[0].businessDetail.carrierName;
        }
      })
  }

}
