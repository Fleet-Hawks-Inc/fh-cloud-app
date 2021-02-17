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
  }

  async fetchTrips(result) {
    this.trips = [];
    this.spinner.show();

    for (let i = 0; i < result.Items.length; i++) {
      if (result.Items[i].isDeleted == 0) {
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
        this.trips.push(result.Items[i]);
      }
    }

    this.spinner.hide();
  }

  fetchOtherTripsCount() {
    let current = this;
    this.apiService.getData('trips').
      subscribe(async (result: any) => {
        this.allTripsCount = result.Count;
        // this.totalRecords = result.Count;

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
      })
  }

  fetchTripsCount() {
    this.apiService.getData('trips/get/count').subscribe({
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
          this.rerender();
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
        this.initDataTable('all','reload');
        $("#tripStatusModal").modal('hide');
        this.toastr.success('Trip status updated successfully.');
        this.router.navigateByUrl('/dispatch/trips/trip-list');
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  fetchTabData(tabType) {
    this.trips = [];
    let current = this;
    $(".navtabs").removeClass('active');

    if (tabType === 'all') {
      $("#allTrips-tab").addClass('active');
      this.totalRecords = this.allTripsCount;

    } else if (tabType === 'confirmed') {
      $("#confirmed-tab").addClass('active');
      this.totalRecords = this.confirmedTripsCount;

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
        {"targets": [0,1,2,3,4,5,6,7,8,9,10,11],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData(current.serviceUrl + current.lastEvaluated.value1 +
          '&searchValue=' + this.tripsFiltr.searchValue + "&startDate=" + this.tripsFiltr.start + 
          "&endDate=" + this.tripsFiltr.end + "&category=" + this.tripsFiltr.category, dataTablesParameters).subscribe(resp => {
            current.fetchTrips(resp)
            if (resp['LastEvaluatedKey'] !== undefined) {
                current.lastEvaluated = {
                  value1: resp['LastEvaluatedKey'].tripID,
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

  rerender(status=''): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      if(status === 'reset') {
        this.dtOptions.pageLength = this.totalRecords;
      } else {
        this.dtOptions.pageLength = 10;
      }
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
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
      this.pageLength = this.allTripsCount;
      this.totalRecords = this.allTripsCount;
      this.initDataTable('all', 'reload', 'yes');
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.tripsFiltr.startDate !== '' || this.tripsFiltr.endDate !== '' || this.tripsFiltr.searchValue !== '') {
      this.spinner.show();
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
      this.pageLength = 10;
      this.rerender();
      this.spinner.hide();
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
}
