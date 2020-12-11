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

  statesObject: any = {};
  countriesObject: any = {};
  citiesObject: any = {};
  vehiclesObject: any = {};
  assetsObject: any = {};
  carriersObject: any = {};
  driversObject: any = {};
  ordersObject: any = {};

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchTripsCount()
    // this.dummyInit();
    this.initDataTable('all');

    this.fetchAllStatesIDs();
    this.fetchAllVehiclesIDs();
    this.fetchAllCitiesIDs();
    this.fetchAllCountriesIDs();
    this.fetchAllAssetIDs();
    this.fetchAllCarrierIDs();
    this.fetchAllDriverIDs();
    this.fetchAllOrderIDs();

    // this.initPage();
  }

  async fetchTrips(result) {
    this.trips = [];
    let current = this;
    // console.log('in fetch trips')
    // console.log(result)
    this.spinner.show();

    for (let i = 0; i < result.Items.length; i++) {
      let locationArr = [];
      let dropArr = [];

      if (result.Items[i].isDeleted == '0') {
        // result.Items[i].date = '';
        result.Items[i].pickupCountry = '';
        result.Items[i].pickupState = '';
        result.Items[i].pickupCity = '';
        result.Items[i].pickupTime = '';
        result.Items[i].dropCountry = '';
        result.Items[i].dropState = '';
        result.Items[i].dropCity = '';
        result.Items[i].dropTime = '';
        result.Items[i].dropLocation = '';
        result.Items[i].driverUsername = '';
        result.Items[i].vehicleId = '';
        result.Items[i].assetId = [];
        result.Items[i].carrierId = '';

        const element = result.Items[i];
        // console.log('element')
        // console.log(element)
        let pickup;
        let drop;
        let planData;

        planData = result.Items[i].tripPlanning[0];
        pickup = result.Items[i].tripPlanning[0].location;

        result.Items[i].pickupCountry = pickup.countryID;
        result.Items[i].pickupState = pickup.stateID;
        result.Items[i].pickupCity = pickup.cityID;

        let pdate = planData.date;
        let newpdate = '';
        if (pdate !== '' && pdate !== undefined) {
          newpdate = pdate.split("-").reverse().join("-");
        }

        result.Items[i].pickupLocation = pickup.address1 + ', ' + pickup.address2 + ', ' + pickup.zipcode;
        result.Items[i].pickupTime = newpdate + ' ' + planData.time;

        let lastloc = result.Items[i].tripPlanning.length - 1
        drop = result.Items[i].tripPlanning[lastloc].location;

        result.Items[i].dropCountry = drop.countryID;
        result.Items[i].dropState = drop.stateID;
        result.Items[i].dropCity = drop.cityID;

        let ddate = result.Items[i].tripPlanning[lastloc].date;
        let newddate = '';
        if (ddate !== '' && ddate !== undefined) {
          newddate = ddate.split("-").reverse().join("-");
        }

        result.Items[i].dropLocation = drop.address1 + ', ' + drop.address2 + ', ' + drop.zipcode;
        result.Items[i].dropTime = newddate + ' ' + result.Items[i].tripPlanning[lastloc].time;

        if (planData.assetID !== '' && planData.assetID !== undefined) {
          for (let j = 0; j < planData.assetID.length; j++) {
            const astId = planData.assetID[j];
            // this.fetchAssetDetail(astId, result.Items[i]);
            // let assteName = this.assetsObject[astId]+', ';
            result.Items[i].assetId.push(astId)
            // console.log('asset')
            // console.log(result.Items[i].assetId)
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
        // result.Items[i].dateCreated = element.dateCreated;
        this.trips.push(result.Items[i]);
        // console.log('trip');
        // console.log(this.trips)
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
    }
    current.initDataTable(tabType, 'reload');
  }

  initDataTable(tabType, check = '', filters: any = '') {
    let current = this;
    if (tabType === 'all') {
      this.serviceUrl = "trips/fetch-records/" + tabType + "?value1=";
    } else {
      this.serviceUrl = "trips/fetch-records/" + tabType + "?recLimit=" + this.allTripsCount + "&value1=";
    }

    // if (filters === 'yes') {
    //   this.tripsFiltr.category = 'tripNo';
    //   this.serviceUrl = this.serviceUrl + '&searchValue=' + this.tripsFiltr.searchValue + "&startDate=" + this.tripsFiltr.startDate + "&endDate=" + this.tripsFiltr.endDate + "&category=" + this.tripsFiltr.category + "&value1=";
    // }
    // console.log(this.serviceUrl);

    if (check !== '') {
      current.rerender();
    }

    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: current.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0],"orderable": false},
        {"targets": [1],"orderable": false},
        {"targets": [2],"orderable": false},
        {"targets": [3],"orderable": false},
        {"targets": [4],"orderable": false},
        {"targets": [5],"orderable": false},
        {"targets": [6],"orderable": false},
        {"targets": [7],"orderable": false},
        {"targets": [8],"orderable": false},
        {"targets": [9],"orderable": false},
        {"targets": [10],"orderable": false},
        {"targets": [11],"orderable": false},
        {"targets": [12],"orderable": false},
        {"targets": [13],"orderable": false},
      ],
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData(current.serviceUrl + current.lastEvaluated.value1 +
          '&searchValue=' + this.tripsFiltr.searchValue + "&startDate=" + this.tripsFiltr.startDate + 
          "&endDate=" + this.tripsFiltr.endDate + "&category=" + this.tripsFiltr.category, dataTablesParameters).subscribe(resp => {
            current.fetchTrips(resp)
            if (resp['LastEvaluatedKey'] !== undefined) {
              if (resp['LastEvaluatedKey'].carrierID !== undefined) {
                current.lastEvaluated = {
                  value1: resp['LastEvaluatedKey'].tripID,
                }
              } else {
                current.lastEvaluated = {
                  value1: resp['LastEvaluatedKey'].tripID,
                }
              }

            } else {
              current.lastEvaluated = {
                value1: '',
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
    if(this.tripsFiltr.searchValue !== '' || this.tripsFiltr.startDate !== '' 
    || this.tripsFiltr.endDate !== '' || this.tripsFiltr.category !== '') {
      this.totalRecords = this.allTripsCount;
      this.initDataTable('all', 'reload', 'yes');
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
    this.apiService.getData('drivers/get/list')
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
}
