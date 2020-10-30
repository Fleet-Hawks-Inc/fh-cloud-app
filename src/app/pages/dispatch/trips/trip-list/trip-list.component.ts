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
  trips = [];
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
      name:"Planned",
      value:'planned'
    },
    {
      name:"Dispatched",
      value:'dispatched'
    },
    {
      name:"Started",
      value:'started'
    },
    {
      name:"En-route",
      value:'enroute'
    },
    {
      name:"Cancelled",
      value:'cancelled'
    },
    {
      name:"Delivered",
      value:'delivered'
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

  ngOnInit() {
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
        this.spinner.hide();
        // console.log(result);
        
        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].isDeleted == '0') {
            this.trips.push(result.Items[i]);

            if(result.Items[i].tripStatus === 'planned') {
              this.plannedTrips.push(result.Items[i]);
            } else if(result.Items[i].tripStatus === 'dispatched') {
              this.dispatchedTrips.push(result.Items[i]);
            } else if(result.Items[i].tripStatus === 'started') {
              this.startedTrips.push(result.Items[i]);
            } else if(result.Items[i].tripStatus === 'enroute') {
              this.enrouteTrips.push(result.Items[i]);
            } else if(result.Items[i].tripStatus === 'cancelled') {
              this.cancelledTrips.push(result.Items[i]);
            } else if(result.Items[i].tripStatus === 'delivered') {
              this.deliveredTrips.push(result.Items[i]);
            }
          }
        }

        this.plannedTripsCount = this.plannedTrips.length;
        this.dispatchedTripsCount = this.dispatchedTrips.length;
        this.startedTripsCount = this.startedTrips.length;
        this.enrouteTripsCount = this.enrouteTrips.length;
        this.cancelledTripsCount = this.cancelledTrips.length;
        this.deliveredTripsCount = this.deliveredTrips.length;
        // this.trips = result.Items;
        // console.log('this.trips');
        // console.log(this.trips);
      }
    })
  }

  openStatusModal(tripId){
    this.tripID = tripId;
    this.fetchTripDetail();
  }


  initDataTable() {

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
 
  deleteTrip(tripID){
    this.spinner.show();
    this.apiService.getData('trips/delete/'+tripID+'/1').subscribe({
      complete: () =>{
        // this.initDataTable();
      },
      error: () => {},
      next: (result:any) =>{
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

    this.tripData.tripID = tripId;
    this.tripData.tripStatus = this.tripStatus;

    this.apiService.getData('trips/update-status/'+this.tripID+'/'+this.tripStatus).subscribe({
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
}
