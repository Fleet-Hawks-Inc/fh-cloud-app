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
  confirmedTrips = [];
  dispatchedTrips = [];
  startedTrips = [];
  enrouteTrips = [];
  cancelledTrips = [];
  deliveredTrips = [];
  confirmedTripsCount = 0;
  dispatchedTripsCount = 0;
  startedTripsCount = 0;
  enrouteTripsCount = 0;
  cancelledTripsCount = 0;
  deliveredTripsCount = 0;
  allTripsCount = 0;
  statusData = [
    {
      name: "Confirmed",
      value: 'confirmed'
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

  dispatchedOptions: any = {};
  startedOptions: any = {};
  enrouteOptions: any = {};
  cancelledOptions: any = {};
  deliveredOptions: any = {};

  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  errors = {};
  lastEvaluated = {
    value1: '',
  };
  totalRecords = 20;
  confirmedTotalRecords = 20;

  pageLength = 10;
  serviceUrl = '';
  tripsFiltr = {
    searchValue: '',
    startDate: '',
    endDate: '',
    category: '',
    start: '',
    end: ''
  };

  statesObject: any = {};
  countriesObject: any = {};
  citiesObject: any = {};
  vehiclesObject: any = {};
  assetsObject: any = {};
  carriersObject: any = {};
  driversObject: any = {};
  ordersObject: any = {};
  activeTab = 'all';

  // manual pagination
  tripNext = false;
  tripPrev = true;
  tripDraw = 0;
  tripPrevEvauatedKeys = [''];
  tripStartPoint = 1;
  tripEndPoint = this.pageLength;
  lastEvaluatedKey = '';
  tripConfirmedNext = false;
  tripConfirmedPrev = true;
  tripConfirmedDraw = 0;
  tripConfirmedPrevEvauatedKeys = [''];
  tripConfirmedStartPoint = 1;
  tripConfirmedEndPoint = this.pageLength;
  tripConfirmedlastEvaluatedKey = '';
  tripDispatchedNext = false;
  tripDispatchedPrev = true;
  tripDispatchedDraw = 0;
  tripDispatchedPrevEvauatedKeys = [''];
  tripDispatchedStartPoint = 1;
  tripDispatchedEndPoint = this.pageLength;
  tripDispatchedlastEvaluatedKey = '';
  tripStartedNext = false;
  tripStartedPrev = true;
  tripStartedDraw = 0;
  tripStartedPrevEvauatedKeys = [''];
  tripStartedStartPoint = 1;
  tripStartedEndPoint = this.pageLength;
  tripStartedlastEvaluatedKey = '';
  tripEnrouteNext = false;
  tripEnroutePrev = true;
  tripEnrouteDraw = 0;
  tripEnroutePrevEvauatedKeys = [''];
  tripEnrouteStartPoint = 1;
  tripEnrouteEndPoint = this.pageLength;
  tripEnroutelastEvaluatedKey = '';
  tripCancelNext = false;
  tripCancelPrev = true;
  tripCancelDraw = 0;
  tripCancelPrevEvauatedKeys = [''];
  tripCancelStartPoint = 1;
  tripCancelEndPoint = this.pageLength;
  tripCancellastEvaluatedKey = '';
  tripDeliverNext = false;
  tripDeliverPrev = true;
  tripDeliverDraw = 0;
  tripDeliverPrevEvauatedKeys = [''];
  tripDeliverStartPoint = 1;
  tripDeliverEndPoint = this.pageLength;
  tripDeliverlastEvaluatedKey = '';

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchOtherTripsCount();
    this.fetchTripsCount()
    this.initDataTable('all');
    this.fetchAllStatesIDs();
    this.fetchAllVehiclesIDs();
    this.fetchAllCitiesIDs();
    this.fetchAllCountriesIDs();
    this.fetchAllAssetIDs();
    this.fetchAllCarrierIDs();
    this.fetchAllDriverIDs();
    this.fetchAllOrderIDs();

    this.initConfirmedDataTable();
    this.initDispatchedDataTable();
    this.initStartedDataTable();
    this.initEnrouteDataTable();
  }

  async fetchTrips(result, type=null) {

    for (let i = 0; i < result.Items.length; i++) {
        result.Items[i].pickupLocation = '';
        result.Items[i].pickupTime = '';
        result.Items[i].dropLocation = '';
        result.Items[i].dropTime = '';
        result.Items[i].dropLocation = '';
        result.Items[i].driverUsername = '';
        result.Items[i].vehicleId = '';
        result.Items[i].assetId = [];
        result.Items[i].carrierId = '';

        const element = result.Items[i];
        let drop;
        let planData;

        planData = result.Items[i].tripPlanning[0];
        result.Items[i].pickupLocation = planData.location;
        result.Items[i].pickupTime = planData.pickupTime;

        let lastloc = result.Items[i].tripPlanning.length - 1
        drop = result.Items[i].tripPlanning[lastloc].location;
        result.Items[i].dropLocation = drop;
        result.Items[i].dropTime =result.Items[i].tripPlanning[lastloc].dropTime;

        if (planData.assetID !== '' && planData.assetID !== undefined) {
          for (let j = 0; j < planData.assetID.length; j++) {
            const astId = planData.assetID[j];
            result.Items[i].assetId.push(astId)
          }
        }

        if (planData.driverUsername !== '' && planData.driverUsername !== undefined) {
          result.Items[i].driverUsername = planData.driverUsername;
        }

        if (planData.vehicleID !== '' && planData.vehicleID !== undefined) {
          result.Items[i].vehicleId = planData.vehicleID;
        }

        if (planData.carrierID !== '' && planData.carrierID !== undefined) {
          result.Items[i].carrierId = planData.carrierID;
        }

        if(type == 'confirmed') {
          this.confirmedTrips.push(result.Items[i]);
        } else if(type == 'dispatched') {
          this.dispatchedTrips.push(result.Items[i]);
        } else if(type == 'started') {
          this.startedTrips.push(result.Items[i]);
        } else if(type == 'enroute') {
          this.enrouteTrips.push(result.Items[i]);
        } else if(type == 'cancelled') {
          this.cancelledTrips.push(result.Items[i]);
        } else if(type == 'delivered') {
          this.deliveredTrips.push(result.Items[i]);
        } else {
          this.trips.push(result.Items[i]);
        }
    }
  }

  fetchOtherTripsCount() {
    this.confirmedTripsCount = 0;
    this.dispatchedTripsCount = 0;
    this.startedTripsCount = 0;
    this.enrouteTripsCount = 0;
    this.cancelledTripsCount = 0;
    this.deliveredTripsCount = 0;
    this.allTripsCount = 0;

    this.apiService.getData('trips').
      subscribe(async (result: any) => {
        this.allTripsCount = result.Count;
        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].tripStatus === 'confirmed') {
            this.confirmedTripsCount = this.confirmedTripsCount + 1;

          } else if (result.Items[i].tripStatus === 'dispatched') {
            this.dispatchedTripsCount = this.dispatchedTripsCount + 1;

          } else if (result.Items[i].tripStatus === 'started') {
            this.startedTripsCount = this.startedTripsCount + 1;

          } else if (result.Items[i].tripStatus === 'enroute') {
            this.enrouteTripsCount = this.enrouteTripsCount + 1;

          } else if (result.Items[i].tripStatus === 'cancelled') {
            this.cancelledTripsCount = this.cancelledTripsCount + 1;

          } else if (result.Items[i].tripStatus === 'delivered') {
            this.deliveredTripsCount = this.deliveredTripsCount + 1
          }
        }
        this.resetEndPoint('confirmed');
        this.resetEndPoint('dispatched');
        this.resetEndPoint('started');
        this.resetEndPoint('enroute');
        this.resetEndPoint('cancelled');
        this.resetEndPoint('delivered');
      })
  }

  fetchTripsCount() {
    this.apiService.getData('trips/get/count?searchValue=' + this.tripsFiltr.searchValue + '&startDate=' + this.tripsFiltr.start +
    '&endDate=' + this.tripsFiltr.end + '&category=' + this.tripsFiltr.category).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
      },
    });
  }

  openStatusModal(tripId) {
    this.tripID = tripId;
    this.fetchTripDetail();
  }

  deleteTrip(tripID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.spinner.show();
      this.apiService.getData('trips/delete/' + tripID + '/1').subscribe({
        complete: () => {},
        error: () => { },
        next: (result: any) => {
          this.spinner.hide();
          this.hasSuccess = true;
          this.tripDraw = 0;
          this.lastEvaluatedKey = '';

          this.fetchOtherTripsCount();
          this.fetchTripsCount()
          this.initDataTable('all');
          if(this.activeTab == 'confirmed') {
            this.tripConfirmedDraw = 0;
            this.tripConfirmedlastEvaluatedKey = '';
            this.initConfirmedDataTable();
          } else if(this.activeTab == 'dispatched') {
            this.tripDispatchedlastEvaluatedKey = '';
            this.tripDispatchedDraw = 0;
            this.initDispatchedDataTable();
          } else if(this.activeTab == 'started') {
            this.tripStartedlastEvaluatedKey = '';
            this.tripStartedDraw = 0;
            this.initStartedDataTable();
          } else if(this.activeTab == 'enroute') {
            this.tripEnroutelastEvaluatedKey = '';
            this.tripEnrouteDraw = 0;
            this.initEnrouteDataTable();
          } else if(this.activeTab == 'cancelled') {
            this.tripCancellastEvaluatedKey = '';
            this.tripCancelDraw = 0;
            this.initCancelDataTable();
          } else if(this.activeTab == 'delivered') {
            this.tripDeliverlastEvaluatedKey = '';
            this.tripDeliverDraw = 0;
            this.initDeliveredDataTable();
          }
          this.toastr.success('Trip deleted successfully');
        }
      })
    }
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
        this.spinner.hide();
        this.trips = [];
        this.initDataTable('all');
        $("#tripStatusModal").modal('hide');
        this.toastr.success('Trip status updated successfully.');
        this.router.navigateByUrl('/dispatch/trips/trip-list');
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  initDataTable(tabType) {
    this.spinner.show();
    this.trips = [];
    this.apiService.getData('trips/fetch/records/' + tabType + '?searchValue=' + this.tripsFiltr.searchValue + '&startDate=' + this.tripsFiltr.start +
      '&endDate=' + this.tripsFiltr.end + '&category=' + this.tripsFiltr.category + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        this.fetchTrips(result, 'all')
        if (this.tripsFiltr.searchValue !== '' || this.tripsFiltr.start !== '' ) {
          this.tripStartPoint = 1;
          this.tripEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.tripNext = false;
          // for prev button
          if (!this.tripPrevEvauatedKeys.includes(result['LastEvaluatedKey'].tripID)) {
            this.tripPrevEvauatedKeys.push(result['LastEvaluatedKey'].tripID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].tripID;

        } else {
          this.tripNext = true;
          this.lastEvaluatedKey = '';
          this.tripEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.tripDraw > 0) {
          this.tripPrev = false;
        } else {
          this.tripPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initConfirmedDataTable() {
    this.spinner.show();
    this.confirmedTrips = [];
    this.apiService.getData('trips/fetch/records/confirmed?searchValue=&startDate=&endDate=&category=&lastKey=' + this.tripConfirmedlastEvaluatedKey)
      .subscribe((result: any) => {
        this.fetchTrips(result,'confirmed');
        
        if (result['LastEvaluatedKey'] !== undefined) {
          this.tripConfirmedNext = false;
          // for prev button
          if (!this.tripConfirmedPrevEvauatedKeys.includes(result['LastEvaluatedKey'].tripID)) {
            this.tripConfirmedPrevEvauatedKeys.push(result['LastEvaluatedKey'].tripID);
          }
          this.tripConfirmedlastEvaluatedKey = result['LastEvaluatedKey'].tripID;

        } else {
          this.tripConfirmedNext = true;
          this.tripConfirmedlastEvaluatedKey = '';
          this.tripConfirmedEndPoint = this.confirmedTripsCount;
        }
        
        // disable prev btn
        if (this.tripConfirmedDraw > 0) {
          this.tripConfirmedPrev = false;
        } else {
          this.tripConfirmedPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDispatchedDataTable() {
    this.spinner.show();
    this.dispatchedTrips = [];
    this.apiService.getData('trips/fetch/records/dispatched?searchValue=&startDate=&endDate=&category=&lastKey=' + this.tripDispatchedlastEvaluatedKey)
      .subscribe((result: any) => {
        this.fetchTrips(result,'dispatched');
        
        if (result['LastEvaluatedKey'] !== undefined) {
          this.tripDispatchedNext = false;
          // for prev button
          if (!this.tripDispatchedPrevEvauatedKeys.includes(result['LastEvaluatedKey'].tripID)) {
            this.tripDispatchedPrevEvauatedKeys.push(result['LastEvaluatedKey'].tripID);
          }
          this.tripDispatchedlastEvaluatedKey = result['LastEvaluatedKey'].tripID;

        } else {
          this.tripDispatchedNext = true;
          this.tripDispatchedlastEvaluatedKey = '';
          this.tripDispatchedEndPoint = this.dispatchedTripsCount;
        }
        
        // disable prev btn
        if (this.tripDispatchedDraw > 0) {
          this.tripDispatchedPrev = false;
        } else {
          this.tripDispatchedPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initStartedDataTable() {
    this.spinner.show();
    this.startedTrips = [];
    this.apiService.getData('trips/fetch/records/started?searchValue=&startDate=&endDate=&category=&lastKey=' + this.tripStartedlastEvaluatedKey)
      .subscribe((result: any) => {
        this.fetchTrips(result,'started');
        
        if (result['LastEvaluatedKey'] !== undefined) {
          this.tripStartedNext = false;
          // for prev button
          if (!this.tripStartedPrevEvauatedKeys.includes(result['LastEvaluatedKey'].tripID)) {
            this.tripStartedPrevEvauatedKeys.push(result['LastEvaluatedKey'].tripID);
          }
          this.tripStartedlastEvaluatedKey = result['LastEvaluatedKey'].tripID;

        } else {
          this.tripStartedNext = true;
          this.tripStartedlastEvaluatedKey = '';
          this.tripStartedEndPoint = this.startedTripsCount;
        }
        
        // disable prev btn
        if (this.tripStartedDraw > 0) {
          this.tripStartedPrev = false;
        } else {
          this.tripStartedPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initEnrouteDataTable() {
    this.spinner.show();
    this.enrouteTrips = [];
    this.apiService.getData('trips/fetch/records/enroute?searchValue=&startDate=&endDate=&category=&lastKey=' + this.tripEnroutelastEvaluatedKey)
      .subscribe((result: any) => {
        this.fetchTrips(result,'enroute');
        
        if (result['LastEvaluatedKey'] !== undefined) {
          this.tripEnrouteNext = false;
          // for prev button
          if (!this.tripEnroutePrevEvauatedKeys.includes(result['LastEvaluatedKey'].tripID)) {
            this.tripEnroutePrevEvauatedKeys.push(result['LastEvaluatedKey'].tripID);
          }
          this.tripEnroutelastEvaluatedKey = result['LastEvaluatedKey'].tripID;

        } else {
          this.tripEnrouteNext = true;
          this.tripEnroutelastEvaluatedKey = '';
          this.tripEnrouteEndPoint = this.enrouteTripsCount;
        }
        
        // disable prev btn
        if (this.tripEnrouteDraw > 0) {
          this.tripEnroutePrev = false;
        } else {
          this.tripEnroutePrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initCancelDataTable() {
    this.spinner.show();
    this.cancelledTrips = [];
    this.apiService.getData('trips/fetch/records/cancelled?searchValue=&startDate=&endDate=&category=&lastKey=' + this.tripCancellastEvaluatedKey)
      .subscribe((result: any) => {
        this.fetchTrips(result,'cancelled');
        
        if (result['LastEvaluatedKey'] !== undefined) {
          this.tripCancelNext = false;
          // for prev button
          if (!this.tripCancelPrevEvauatedKeys.includes(result['LastEvaluatedKey'].tripID)) {
            this.tripCancelPrevEvauatedKeys.push(result['LastEvaluatedKey'].tripID);
          }
          this.tripCancellastEvaluatedKey = result['LastEvaluatedKey'].tripID;

        } else {
          this.tripCancelNext = true;
          this.tripCancellastEvaluatedKey = '';
          this.tripCancelEndPoint = this.cancelledTripsCount;
        }
        
        // disable prev btn
        if (this.tripCancelDraw > 0) {
          this.tripCancelPrev = false;
        } else {
          this.tripCancelPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDeliveredDataTable() {
    this.spinner.show();
    this.deliveredTrips = [];
    this.apiService.getData('trips/fetch/records/delivered?searchValue=&startDate=&endDate=&category=&lastKey=' + this.tripDeliverlastEvaluatedKey)
      .subscribe((result: any) => {
        this.fetchTrips(result,'delivered');
        
        if (result['LastEvaluatedKey'] !== undefined) {
          this.tripDeliverNext = false;
          // for prev button
          if (!this.tripDeliverPrevEvauatedKeys.includes(result['LastEvaluatedKey'].tripID)) {
            this.tripDeliverPrevEvauatedKeys.push(result['LastEvaluatedKey'].tripID);
          }
          this.tripDeliverlastEvaluatedKey = result['LastEvaluatedKey'].tripID;

        } else {
          this.tripDeliverNext = true;
          this.tripDeliverlastEvaluatedKey = '';
          this.tripDeliverEndPoint = this.deliveredTripsCount;
        }
        
        // disable prev btn
        if (this.tripDeliverDraw > 0) {
          this.tripDeliverPrev = false;
        } else {
          this.tripDeliverPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  filterTrips() {
    if(this.tripsFiltr.searchValue !== '' || this.tripsFiltr.startDate !== '' 
    || this.tripsFiltr.endDate !== '' || this.tripsFiltr.category !== '') {

      this.trips = [];
      let sdate;
      let edate;
      if(this.tripsFiltr.startDate !== ''){
        sdate = this.tripsFiltr.startDate.split('-');
        if(sdate[0] < 10) {
          sdate[0] = '0'+sdate[0]
        }
        this.tripsFiltr.start = sdate[2]+'-'+sdate[1]+'-'+sdate[0];
      }
      if(this.tripsFiltr.endDate !== ''){
        edate = this.tripsFiltr.endDate.split('-');
        if(edate[0] < 10) {
          edate[0] = '0'+edate[0]
        }
        this.tripsFiltr.end = edate[2]+'-'+edate[1]+'-'+edate[0];
      }
      this.totalRecords = this.allTripsCount;
      this.activeTab = 'all';
      this.fetchTripsCount();
      this.initDataTable('all');
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.tripsFiltr.startDate !== '' || this.tripsFiltr.endDate !== '' || this.tripsFiltr.searchValue !== '') {
      this.trips = [];
      this.tripsFiltr = {
        searchValue: '',
        startDate: '',
        endDate: '',
        category: '',
        start: '',
        end: ''
      };
      $("#categorySelect").text('Search by category');
      this.tripDraw = 0;
      this.activeTab = 'all';
      this.fetchTripsCount();
      this.initDataTable('all');
      this.getStartandEndVal('all');
    } else {
      return false;
    }
  }

  selectCategory(type) {
    let typeText = '';
    this.tripsFiltr.category = type;

    if (type === 'TripNo') {
      typeText = 'Trip Number';
      this.tripsFiltr.category = 'tripNo'
    } else if (type === 'TripType') {
      typeText = 'Trip Type';
    } else if (type === 'OrderNo') {
      typeText = 'Order Number';
    } else if(type === 'TripType') {
      typeText = 'Trip Type';
    } else if(type === 'OrderNo') {
      typeText = 'Order Number';
    } else {
      typeText = type;
    }
    
    $("#categorySelect").text(typeText);
  }

  fetchAllStatesIDs() {
    this.apiService.getData('states/get/list')
      .subscribe((result: any) => {
        this.statesObject = result;
      });
  }

  fetchAllCountriesIDs() {
    this.apiService.getData('countries/get/list')
      .subscribe((result: any) => {
        this.countriesObject = result;
      });
  }

  fetchAllCitiesIDs() {
    this.apiService.getData('cities/get/list')
      .subscribe((result: any) => {
        this.citiesObject = result;
      });
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
    this.apiService.getData('carriers/get/list')
      .subscribe((result: any) => {
        this.carriersObject = result;
      });
  }

  fetchAllDriverIDs() {
    this.apiService.getData('drivers/get/username-list')
      .subscribe((result: any) => {
        this.driversObject = result;
      });
  }

  fetchAllOrderIDs() {
    this.apiService.getData('orders/get/list')
      .subscribe((result: any) => {
        this.ordersObject = result;
      });
  }

  getStartandEndVal(type) {
    if(type == 'all') {
      this.tripStartPoint = this.tripDraw * this.pageLength + 1;
      this.tripEndPoint = this.tripStartPoint + this.pageLength - 1;

    } else if(type == 'confirmed') {
      this.tripConfirmedStartPoint = this.tripConfirmedDraw * this.pageLength + 1;
      this.tripConfirmedEndPoint = this.tripConfirmedStartPoint + this.pageLength - 1;

    } else if(type == 'dispatched') {
      this.tripDispatchedStartPoint = this.tripDispatchedDraw * this.pageLength + 1;
      this.tripDispatchedEndPoint = this.tripDispatchedStartPoint + this.pageLength - 1;

    } else if(type == 'started') {
      this.tripStartedStartPoint = this.tripStartedDraw * this.pageLength + 1;
      this.tripStartedEndPoint = this.tripStartedStartPoint + this.pageLength - 1;

    } else if(type == 'enrouted') {
      this.tripEnrouteStartPoint = this.tripEnrouteDraw * this.pageLength + 1;
      this.tripEnrouteEndPoint = this.tripEnrouteStartPoint + this.pageLength - 1;

    } else if(type == 'cancelled') {
      this.tripCancelStartPoint = this.tripCancelDraw * this.pageLength + 1;
      this.tripCancelEndPoint = this.tripCancelStartPoint + this.pageLength - 1;

    } else if(type == 'delivered') {
      this.tripDeliverStartPoint = this.tripDeliverDraw * this.pageLength + 1;
      this.tripDeliverEndPoint = this.tripDeliverStartPoint + this.pageLength - 1;
    }
  }

  // next button func
  nextResults(type) {
    if(type == 'all') {
      this.tripDraw += 1;
      this.initDataTable('all');
      this.getStartandEndVal(type);

    } else if(type == 'confirmed') {
      this.tripConfirmedDraw += 1;
      this.initConfirmedDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'dispatched') {
      this.tripDispatchedDraw += 1;
      this.initDispatchedDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'started') {
      this.tripStartedDraw += 1;
      this.initStartedDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'enrouted') {
      this.tripEnrouteDraw += 1;
      this.initEnrouteDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'cancelled') {
      this.tripCancelDraw += 1;
      this.initCancelDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'delivered') {
      this.tripDeliverDraw += 1;
      this.initDeliveredDataTable();
      this.getStartandEndVal(type);
    }
  }

  // prev button func
  prevResults(type) {
    if(type == 'all') {
      this.tripDraw -= 1;
      this.lastEvaluatedKey = this.tripPrevEvauatedKeys[this.tripDraw];
      this.initDataTable('all');
      this.getStartandEndVal(type);

    } else if(type == 'confirmed') {
      this.tripConfirmedDraw -= 1;
      this.tripConfirmedlastEvaluatedKey = this.tripConfirmedPrevEvauatedKeys[this.tripConfirmedDraw];
      this.initConfirmedDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'dispatched') {
      this.tripDispatchedDraw -= 1;
      this.tripDispatchedlastEvaluatedKey = this.tripDispatchedPrevEvauatedKeys[this.tripDispatchedDraw];
      this.initDispatchedDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'started') {
      this.tripStartedDraw -= 1;
      this.tripStartedlastEvaluatedKey = this.tripStartedPrevEvauatedKeys[this.tripStartedDraw];
      this.initStartedDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'enrouted') {
      this.tripEnrouteDraw -= 1;
      this.tripEnroutelastEvaluatedKey = this.tripEnroutePrevEvauatedKeys[this.tripEnrouteDraw];
      this.initEnrouteDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'cancelled') {
      this.tripCancelDraw -= 1;
      this.tripCancellastEvaluatedKey = this.tripCancelPrevEvauatedKeys[this.tripCancelDraw];
      this.initCancelDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'delivered') {
      this.tripDeliverDraw -= 1;
      this.tripDeliverlastEvaluatedKey = this.tripDeliverPrevEvauatedKeys[this.tripDeliverDraw];
      this.initDeliveredDataTable();
      this.getStartandEndVal(type);
    }
  }

  resetCountResult() {
    this.tripStartPoint = 1;
    this.tripEndPoint = this.pageLength;
    this.tripDraw = 0;
  }

  resetEndPoint(type){
    if(type == 'confirmed') {
      if(this.confirmedTripsCount < this.tripConfirmedEndPoint) {
        this.tripConfirmedEndPoint = this.confirmedTripsCount;
      }
    } else if(type == 'dispatched') {
      if(this.dispatchedTripsCount < this.tripDispatchedEndPoint) {
        this.tripDispatchedEndPoint = this.dispatchedTripsCount;
      }
    } else if(type == 'started') {
      if(this.startedTripsCount < this.tripStartedEndPoint) {
        this.tripStartedEndPoint = this.startedTripsCount;
      }
    } else if(type == 'enroute') {
      if(this.enrouteTripsCount < this.tripEnrouteEndPoint) {
        this.tripEnrouteEndPoint = this.enrouteTripsCount;
      }
    } else if(type == 'cancelled') {
      if(this.cancelledTripsCount < this.tripCancelEndPoint) {
        this.tripCancelEndPoint = this.cancelledTripsCount;
      }
    } else if(type == 'delivered') {
      if(this.deliveredTripsCount < this.tripDeliverEndPoint) {
        this.tripDeliverEndPoint = this.deliveredTripsCount;
      }
    }
  }

  setActiveDiv(type){
    this.activeTab = type;
  }
}
