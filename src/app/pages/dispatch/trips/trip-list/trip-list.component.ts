import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import  Constants  from '../../../fleet/constants';
import { environment } from 'src/environments/environment';
declare var $: any;
import * as moment from "moment";

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  dataMessageConfirm: string = Constants.NO_RECORDS_FOUND;
  dataMessageDispatch: string = Constants.NO_RECORDS_FOUND;
  dataMessageStart: string = Constants.NO_RECORDS_FOUND;
  dataMessageEnroute: string = Constants.NO_RECORDS_FOUND;
  dataMessageCancel: string = Constants.NO_RECORDS_FOUND;
  dataMessageDeliver: string = Constants.NO_RECORDS_FOUND;
  form;
  title = "Trips";
  tripID = '';
  tripStatus = '';
  prevStatus = '';
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
  categoryFilter = [
    {
      'name': 'Trip Number',
      'value': 'tripNo'
    },
    {
      'name': 'Trip Type',
      'value': 'tripType'
    },
    {
      'name': 'Order Number',
      'value': 'orderNo'
    },
    {
      'name': 'Driver',
      'value': 'driver'
    },
    {
      'name': 'Vehicle',
      'value': 'vehicle'
    },
    {
      'name': 'Asset',
      'value': 'asset'
    },
    {
      'name': 'Location',
      'value': 'location'
    },
    {
      'name': 'Trip Status',
      'value': 'tripStatus'
    },
  ]

  pageLength = 10;
  serviceUrl = '';
  tripsFiltr = {
    searchValue: '',
    startDate: '',
    endDate: '',
    category: null,
    start: '',
    end: ''
  };

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
  driversIDSObject = [];
  tripDate = '';
  tripTime = '';
  recIndex:any = '';
  records = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  fetchedRecordsCount = 0;
  lastFetched = {
    draw:0,
    status: false
  }
  settlement;

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchAllTripsCount();
    this.fetchAllVehiclesIDs();
    this.fetchAllAssetIDs();
    this.fetchAllCarrierIDs();
    this.fetchAllOrderIDs();
    this.fetchAllDrivers();
  }

  async fetchTrips(result, type = null) {
    let trpArr = [];
    for (let i = 0; i < result.Items.length; i++) {
      result.Items[i].pickupLocation = '';
      result.Items[i].pickupLocationCount = 0;
      result.Items[i].dropLocation = '';
      result.Items[i].dropLocationCount = 0;
      result.Items[i].driverId = '';
      result.Items[i].driverCount = 0;
      result.Items[i].vehicleId = '';
      result.Items[i].vehicleCount = 0;
      result.Items[i].assetId = '';
      result.Items[i].assetCount = 0;
      result.Items[i].planCarrierId = '';
      result.Items[i].carrierIdCount = 0;

      const element = result.Items[i];

      for (let j = 0; j < result.Items[i].tripPlanning.length; j++) {
        const element2 = result.Items[i].tripPlanning[j];
        if (element2.type == 'Pickup') {
          result.Items[i].pickupLocationCount += 1;

          if (result.Items[i].pickupLocation == '') {
            result.Items[i].pickupLocation = element2.location;
          }
        } else if (element2.type == 'Delivery') {
          result.Items[i].dropLocationCount += 1;

          if (result.Items[i].dropLocation == '') {
            result.Items[i].dropLocation = element2.location;
          }
        }

        if (element2.carrierID !== '' && element2.carrierID !== undefined) {
          if (result.Items[i].planCarrierId == '') {
            result.Items[i].planCarrierId = element2.carrierID;
          }
        }

        if (element2.driverID !== '' && element2.driverID !== undefined) {
          if (result.Items[i].driverId == '') {
            result.Items[i].driverId = element2.driverID;
          }

          result.Items[i].driverCount = element.driverIDs.length;
        }

        if (element2.coDriverID !== '' && element2.coDriverID !== undefined) {
          if (result.Items[i].driverId == '') {
            result.Items[i].driverId = element2.coDriverID;
          }
        }

        if (element2.vehicleID !== '' && element2.vehicleID !== undefined) {
          if (result.Items[i].vehicleId == '') {
            result.Items[i].vehicleId = element2.vehicleID;
          }
          result.Items[i].vehicleCount = element.vehicleIDs.length;
        }

        for (let l = 0; l < element2.assetID.length; l++) {
          const element3 = element2.assetID[l];

          if (element3 !== '' && element3 !== undefined) {
            if (result.Items[i].assetId == '') {
              result.Items[i].assetId = element3;
            }
            result.Items[i].assetCount = element.assetIDs.length;
          }
        }
      }

      if (element.tripStatus == 'confirmed') {
        this.confirmedTrips.push(result.Items[i]);
      } else if (element.tripStatus == 'dispatched') {
        this.dispatchedTrips.push(result.Items[i]);
      } else if (element.tripStatus == 'started') {
        this.startedTrips.push(result.Items[i]);
      } else if (element.tripStatus == 'enroute') {
        this.enrouteTrips.push(result.Items[i]);
      } else if (element.tripStatus == 'cancelled') {
        this.cancelledTrips.push(result.Items[i]);
      } else if (element.tripStatus == 'delivered') {
        this.deliveredTrips.push(result.Items[i]);
      } 

      trpArr.push(result.Items[i]);
    }
    this.trips.push(trpArr);
  }

  fetchAllTripsCount() {
    this.allTripsCount = 0;

    this.apiService.getData('trips/get/allTypes/count').subscribe(async (result: any) => { 
      this.allTripsCount = result.allCount;
      this.totalRecords = result.allCount;

      this.initDataTable();
    })
  }

  fetchTripsCount() {
    this.apiService.getData('trips/get/count?searchValue=' + this.tripsFiltr.searchValue + '&startDate=' + this.tripsFiltr.start +
    '&endDate=' + this.tripsFiltr.end + '&category=' + this.tripsFiltr.category).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
        this.initDataTable();
      },
    });
  }

  openStatusModal(tripId, index) {
    this.tripID = tripId;
    this.recIndex = index;
    this.fetchTripDetail();
  }

  deleteTrip(eventData) {
    if (confirm('Are you sure you want to delete?') === true) {
      let record = {
        eventID: eventData.tripID,
        status: eventData.tripStatus,
        stl: eventData.settlmnt
      }
      this.apiService.deleteData(`trips/delete/${eventData.tripID}/${eventData.settlmnt}/${eventData.tripStatus}`).subscribe({
        complete: () => {},
        error: () => { },
        next: (result: any) => {
          this.trips = [];
          this.confirmedTrips = [];
          this.dispatchedTrips = [];
          this.startedTrips = [];
          this.enrouteTrips = [];
          this.cancelledTrips = [];
          this.deliveredTrips = [];
          
          this.hasSuccess = true;
          this.tripDraw = 0;
          this.lastEvaluatedKey = '';
          this.records = false;
          this.fetchAllTripsCount();

          this.toastr.success('Trip deleted successfully');
        }
      })
    }
  }

  fetchTripDetail() {
    this.apiService.getData('trips/' + this.tripID).
      subscribe((result: any) => {
        result = result.Items[0];
        this.prevStatus = result.tripStatus;
        this.tripStatus = result.tripStatus;
        this.tripNumber = result.tripNo;
        this.bolNumber = result.bol;
        this.tripDate = result.createdDate;
        this.tripTime = result.createdTime;
        this.settlement = result.settlmnt;

        $("#tripStatusModal").modal('show');
      })
  }

  updateTripStatus() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    if (this.tripStatus === '') {
      this.toastr.error('Please select trip status');
      return false;
    }

    if (this.tripStatus === this.prevStatus) {
      $("#tripStatusModal").modal('hide');
      return false;
    }

    let allowedStatus = [];
    switch(this.prevStatus){
      case 'confirmed':
        allowedStatus = ['dispatched','started','enroute','cancelled','delivered'];
        break;
      case 'dispatched':
        allowedStatus = ['started','enroute','cancelled','delivered'];
        break;
      case 'started':
        allowedStatus = ['enroute','cancelled','delivered'];
        break;
      case 'enroute':
        allowedStatus = ['cancelled','delivered'];
        break;
      case 'cancelled':
        allowedStatus = ['delivered'];
        break;
      case 'delivered':
        allowedStatus = [];
        break;
    }
    
    if(!allowedStatus.includes(this.tripStatus)) {
      this.toastr.error('Please select a valid status');
      return false;
    } 

    let tripObj = {
      entryID : this.tripID,
      status: this.tripStatus,
      settlement: this.settlement,
    }
    this.apiService.postData('trips/updateStatus', tripObj).subscribe(async (result: any) => { 
      if(result) {
        if(this.activeTab == 'all') {
          this.trips[this.tripDraw][this.recIndex].tripStatus = this.tripStatus;
          this.resetMainTabValues();
        } else {
          if(this.activeTab  == 'confirmed') {
            this.confirmedTrips[this.recIndex].tripStatus = this.tripStatus;
          } else if(this.activeTab  == 'dispatched') {
            this.dispatchedTrips[this.recIndex].tripStatus = this.tripStatus;
          } else if(this.activeTab  == 'started') {
            this.startedTrips[this.recIndex].tripStatus = this.tripStatus;
          } else if(this.activeTab  == 'enroute') {
            this.enrouteTrips[this.recIndex].tripStatus = this.tripStatus;
          } else if(this.activeTab  == 'cancelled') {
            this.cancelledTrips[this.recIndex].tripStatus = this.tripStatus;
          } else if(this.activeTab  == 'delivered') {
            this.deliveredTrips[this.recIndex].tripStatus = this.tripStatus;
          }
          this.resetMainTabValues();
        }
        
        $("#tripStatusModal").modal('hide');
        this.toastr.success('Trip status updated successfully');
      } else {
        this.toastr.error('Internal Server error');
      }
    })
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('trips/fetch/records/all?searchValue=' + this.tripsFiltr.searchValue + '&startDate=' + this.tripsFiltr.start +
      '&endDate=' + this.tripsFiltr.end + '&category=' + this.tripsFiltr.category + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        // this.trips = [];
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
          this.records = false;
        } else {
          this.records = true;
        }
        this.fetchedRecordsCount += result.Count;
        this.getStartandEndVal('all');

        this.fetchTrips(result, 'all')
        if (this.tripsFiltr.searchValue !== '' || this.tripsFiltr.start !== '' ) {
          this.tripStartPoint = 1;
          this.tripEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].tripSK.replace(/#/g,'--');
          this.tripNext = false;
          // for prev button
          if (!this.tripPrevEvauatedKeys.includes(lastEvalKey)) {
            this.tripPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKey = lastEvalKey;

        } else {
          this.tripNext = true;
          this.lastEvaluatedKey = '';
          this.tripEndPoint = this.totalRecords;
        }

        if(this.totalRecords < this.tripEndPoint) {
          this.tripEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.tripDraw == 0) {
          this.tripPrev = true;
        } 

        // disable next btn when no records at last
        if(this.fetchedRecordsCount < this.totalRecords ){
          this.tripNext = false;
        } else if(this.fetchedRecordsCount === this.totalRecords) {
          this.tripNext = true;
        }
        this.lastFetched = {
          draw:this.tripDraw,
          status: this.tripNext
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  filterTrips() {
    

    if(this.tripsFiltr.startDate===null) this.tripsFiltr.startDate=''
    if(this.tripsFiltr.endDate===null) this.tripsFiltr.endDate=''
    
    if(this.tripsFiltr.searchValue !== '' || this.tripsFiltr.startDate !== '' 
    || this.tripsFiltr.endDate !== '' || this.tripsFiltr.category !== null) {

      if(this.tripsFiltr.startDate != '' && this.tripsFiltr.endDate == '') {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if(this.tripsFiltr.startDate == '' && this.tripsFiltr.endDate != '') {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if(this.tripsFiltr.startDate>this.tripsFiltr.endDate){
        this.toastr.error('Start Date should be less then end date.');
        return false;
      }
      else if(this.tripsFiltr.category !== null && this.tripsFiltr.searchValue == ''){
        this.toastr.error('Please enter search value.');
        return false;
      }else {
        if(this.tripsFiltr.category == 'location') {
          this.tripsFiltr.searchValue = this.tripsFiltr.searchValue.toLowerCase();
        }
        this.trips = [];
        this.confirmedTrips = [];
        this.dispatchedTrips = [];
        this.startedTrips = [];
        this.enrouteTrips = [];
        this.cancelledTrips = [];
        this.deliveredTrips = [];
        
        this.records = false;
        this.trips = [];
        if(this.tripsFiltr.startDate !== '') {
          this.tripsFiltr.start = this.tripsFiltr.startDate;
        }
        if(this.tripsFiltr.endDate !== '') {
          this.tripsFiltr.end = this.tripsFiltr.endDate;
        }
        this.totalRecords = this.allTripsCount;
        this.dataMessage = Constants.FETCHING_DATA;
        this.activeTab = 'all';
        this.fetchTripsCount();
      }
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
        category: null,
        start: '',
        end: ''
      };
      this.records = false;
      this.dataMessage = Constants.FETCHING_DATA;
      $("#categorySelect").text('Search by category');
      this.tripDraw = 0;
      this.activeTab = 'all';
      this.confirmedTrips = [];
      this.dispatchedTrips = [];
      this.startedTrips = [];
      this.enrouteTrips = [];
      this.cancelledTrips = [];
      this.deliveredTrips = [];
      this.fetchTripsCount();
      // this.initDataTable();
      this.getStartandEndVal('all');
    } else {
      return false;
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

  fetchAllDrivers() {
    this.apiService.getData('drivers/get/list')
      .subscribe((result: any) => {
        this.driversIDSObject = result;
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

    } 
  }

  // next button func
  nextResults(type) {
    if(type == 'all') {
      this.tripNext = true;
      this.tripDraw += 1;

      if(this.trips[this.tripDraw] == undefined) {
        this.records = false;
        this.initDataTable();
        this.tripPrev = false;
      } else {
        if(this.tripDraw <= 0 ){
          this.tripPrev = true;
        } else {
          this.tripPrev = false;
        }
        if(this.tripDraw < this.lastFetched.draw ){
          this.tripNext = false;
        } else {
          this.tripNext = this.lastFetched.status;
        }
        this.getStartandEndVal('all');
        this.tripEndPoint = this.tripStartPoint+this.trips[this.tripDraw].length-1;
      }
    } 
  }

  // prev button func
  prevResults(type) {
    if(type == 'all') {
      this.tripNext = true;
      this.tripPrev = true;
      this.tripDraw -= 1;

      if(this.trips[this.tripDraw] == undefined) {
        this.initDataTable();
      } else {
        if(this.tripDraw <= 0 ){
          this.tripPrev = true;
        } else {
          this.tripPrev = false;
        }
        this.tripNext = false;
        this.getStartandEndVal('all');
      }
    } 
  }

  resetCountResult() {
    this.tripStartPoint = 1;
    this.tripEndPoint = this.pageLength;
    this.tripDraw = 0;
  }

  setActiveDiv(type){
    this.activeTab = type;
  }

  categoryChange(event) {
    if(event == 'driver' || event == 'vehicle' || event == 'asset' || event == 'tripType' || event == 'orderNo' || event == 'tripStatus') {
      this.tripsFiltr.searchValue = null;
    } else {
      this.tripsFiltr.searchValue = '';
    }
  }

  resetMainTabValues(){
    this.confirmedTrips = [];
    this.dispatchedTrips = [];
    this.startedTrips = [];
    this.enrouteTrips = [];
    this.cancelledTrips = [];
    this.deliveredTrips = [];
    for (let i = 0; i < this.trips.length; i++) {
      const element = this.trips[i];
      
      for (let x = 0; x < element.length; x++) {
        if(this.tripID == element[x].tripID) {
          element[x].tripStatus = this.tripStatus;
        }

        if (element[x].tripStatus == 'confirmed') {
          this.confirmedTrips.push(element[x]);
        } else if (element[x].tripStatus == 'dispatched') {
          this.dispatchedTrips.push(element[x]);
        } else if (element[x].tripStatus == 'started') {
          this.startedTrips.push(element[x]);
        } else if (element[x].tripStatus == 'enroute') {
          this.enrouteTrips.push(element[x]);
        } else if (element[x].tripStatus == 'cancelled') {
          this.cancelledTrips.push(element[x]);
        } else if (element[x].tripStatus == 'delivered') {
          this.deliveredTrips.push(element[x]);
        } 
      }
    }
  }
}
