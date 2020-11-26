import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { from, forkJoin } from 'rxjs';
declare var $: any;

import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
// import { _countGroupLabelsBeforeOption } from '@angular/material/core';


@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

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
  allTripsCount = 0;
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
    value2: ''
  };
  totalRecords = 20;
  pageLength = 10;
  serviceUrl = '';
  tripsFiltr = {
    searchValue: '',
    startDate: '',
    endDate: '',
    category: ''
  };

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchTripsCount()
    // this.dummyInit();
    this.initDataTable('all');

    // this.initPage();
  }

  async fetchTrips(result) {
    this.trips = [];
    let current = this;
    console.log('in fetch trips')
    console.log(result)
    // this.spinner.show();

    for (let i = 0; i < result.Items.length; i++) {
      let locationArr = [];
      let dropArr = [];

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

        const element = result.Items[i];
        let pickup;
        let drop;
        let planData;

        let pickupAddr = new Promise(function (resolve, reject) {
          planData = result.Items[i].tripPlanning[0];
          pickup = result.Items[i].tripPlanning[0].location;

          let countryUrl = current.apiService.getData('countries/' + pickup.countryID);
          let stateUrl = current.apiService.getData('states/' + pickup.stateID);
          let cityUrl = current.apiService.getData('cities/' + pickup.cityID);

          locationArr.push(countryUrl);
          locationArr.push(stateUrl);
          locationArr.push(cityUrl);

          let pdate = planData.date;
          let newpdate = '';
          if (pdate !== '' && pdate !== undefined) {
            newpdate = pdate.split("-").reverse().join("-");
          }

          forkJoin(locationArr)
            .subscribe(serviceResp => {
              result.Items[i].pickupCountry = serviceResp[0].Items[0].countryName;
              result.Items[i].pickupState = serviceResp[1].Items[0].stateName;
              result.Items[i].pickupCity = serviceResp[2].Items[0].cityName;
              result.Items[i].pickupLocation = pickup.address1 + ', ' + pickup.address2 + ', ' + pickup.zipcode;

              result.Items[i].pickupTime = newpdate + ' ' + planData.time;
              resolve(true);
            });

        })

        let dropAddr = new Promise(function (resolve, reject) {
          let lastloc = result.Items[i].tripPlanning.length - 1
          drop = result.Items[i].tripPlanning[lastloc].location;

          let ddate = result.Items[i].tripPlanning[lastloc].date;
          let newddate = '';
          if (ddate !== '' && ddate !== undefined) {
            newddate = ddate.split("-").reverse().join("-");
          }

          let countryUrl = current.apiService.getData('countries/' + drop.countryID);
          let stateUrl = current.apiService.getData('states/' + drop.stateID);
          let cityUrl = current.apiService.getData('cities/' + drop.cityID);

          dropArr.push(countryUrl);
          dropArr.push(stateUrl);
          dropArr.push(cityUrl);

          forkJoin(dropArr)
            .subscribe(serviceResp => {
              result.Items[i].dropCountry = serviceResp[0].Items[0].countryName;
              result.Items[i].dropState = serviceResp[1].Items[0].stateName;
              result.Items[i].dropCity = serviceResp[2].Items[0].cityName;
              result.Items[i].dropLocation = drop.address1 + ', ' + drop.address2 + ', ' + drop.zipcode;

              result.Items[i].dropTime = newddate + ' ' + result.Items[i].tripPlanning[lastloc].time;
              resolve(true);
            });
        })

        await pickupAddr.then(function (result) {
          // this.activities = result;
        }.bind(this));

        await dropAddr.then(function (result) {
          // this.activities = result;
        }.bind(this));

        if (planData.assetID !== '' && planData.assetID !== undefined) {
          for (let j = 0; j < planData.assetID.length; j++) {
            const astId = planData.assetID[j];
            this.fetchAssetDetail(astId, result.Items[i]);
          }
        }

        if (planData.driverUsername !== '' && planData.driverUsername !== undefined) {
          this.fetchDriverDetail(planData.driverUsername, result.Items[i]);
        }

        if (planData.vehicleID !== '' && planData.vehicleID !== undefined) {
          this.fetchVehicleDetail(planData.vehicleID, result.Items[i]);
        }

        if (planData.carrierID !== '' && planData.carrierID !== undefined) {
          this.fetchCarrierName(planData.carrierID, result.Items[i]);
        }

        this.trips.push(result.Items[i]);
      }
    }

    this.spinner.hide();
  }

  fetchTripsCount() {
    let current = this;
    this.apiService.getData('trips').
      subscribe(async (result: any) => {
        this.allTripsCount = result.Count;
        this.totalRecords = result.Count;

        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].tripStatus === 'planned') {
            this.plannedTripsCount = this.plannedTripsCount + 1;

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
      })
  }

  openStatusModal(tripId) {
    this.tripID = tripId;
    this.fetchTripDetail();
  }

  deleteTrip(tripID) {
    this.spinner.show();
    this.apiService.getData('trips/delete/' + tripID + '/1').subscribe({
      complete: () => {
        // this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        // this.initDataTable();
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
        // this.fetchTrips();

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

  fetchTabData(tabType) {
    let current = this;
    $(".navtabs").removeClass('active');

    if (tabType === 'all') {
      $("#allTrips-tab").addClass('active');
      this.totalRecords = this.allTripsCount;

    } else if (tabType === 'planned') {
      $("#planned-tab").addClass('active');
      this.totalRecords = this.plannedTripsCount;

    } else if (tabType === 'dispatched') {
      $("#dispatchedTrip-tab").addClass('active');
      this.totalRecords = this.dispatchedTripsCount;

    } else if (tabType === 'started') {
      $("#started-tab").addClass('active');
      this.totalRecords = this.startedTripsCount;

    } else if (tabType === 'enroute') {
      $("#enroute-tab").addClass('active');
      this.totalRecords = this.enrouteTripsCount;

    } else if (tabType === 'cancelled') {
      $("#cancelled-tab").addClass('active');
      this.totalRecords = this.cancelledTripsCount;

    } else if (tabType === 'delivered') {
      $("#delivered-tab").addClass('active');
      this.totalRecords = this.deliveredTripsCount;

    }
    current.lastEvaluated = {
      value1: '',
      value2: ''
    }
    current.initDataTable(tabType, 'reload');
  }

  initDataTable(tabType, check = '', filters:any = '') {
    let current = this;
    if(tabType === 'all') {
      this.serviceUrl = "trips/fetch-records/" + tabType + "?value1=";
    } else {
      this.serviceUrl = "trips/fetch-records/" + tabType + "?recLimit="+this.allTripsCount+"&value1=";
    }

    if(filters === 'yes') {
      let startDatee:any = '';
      let endDatee:any = '';
      if(this.tripsFiltr.startDate !== ''){
        startDatee = new Date(this.tripsFiltr.startDate).getTime();
      }
      
      if(this.tripsFiltr.endDate !== ''){
        endDatee = new Date(this.tripsFiltr.endDate+" 00:00:00").getTime();
      }
      this.tripsFiltr.category = 'tripNo';
      this.serviceUrl = this.serviceUrl+'&filter=true&searchValue='+this.tripsFiltr.searchValue+"&startDate="+startDatee+"&endDate="+endDatee+"&category="+this.tripsFiltr.category+"&value1=";
    }
    // console.log(this.serviceUrl);

    if (check !== '') {
      current.rerender();
    }

    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: current.pageLength,
      serverSide: true,
      processing: true,
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData(current.serviceUrl+current.lastEvaluated.value1 + 
          '&value2=' + current.lastEvaluated.value2, dataTablesParameters).subscribe(resp => {
          current.fetchTrips(resp)
          // console.log('in ajax')
          // console.log(resp)
          if (resp['LastEvaluatedKey'] !== undefined) {
            if (resp['LastEvaluatedKey'].carrierID !== undefined) {
              current.lastEvaluated = {
                value1: resp['LastEvaluatedKey'].tripID,
                value2: resp['LastEvaluatedKey'].carrierID
              }
            } else {
              current.lastEvaluated = {
                value1: resp['LastEvaluatedKey'].tripID,
                value2: ''
              }
            }

          } else {
            current.lastEvaluated = {
              value1: '',
              value2: ''
            }
          }

          callback({
            recordsTotal: current.totalRecords,
            recordsFiltered: current.totalRecords,
            data: []
          });
        });
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  filterTrips() {
    // alert('3');
    // console.log('tripsFiltr');
    // console.log(this.tripsFiltr)
    this.totalRecords = this.allTripsCount;
    this.initDataTable('all', 'reload','yes');
  }

  selectCategory(type) {
    let typeText = '';
    this.tripsFiltr.category = type;

    if(type === 'TripNo') {
      typeText = 'Trip Number';
      this.tripsFiltr.category = 'tripNo'
    } else if(type === 'TripType') {
      typeText = 'Trip Type';
    } else if(type === 'OrderNo') {
      typeText = 'Order Number';
    } else {
      typeText = type;
    }

    $("#categorySelect").text(typeText);
  }
}
