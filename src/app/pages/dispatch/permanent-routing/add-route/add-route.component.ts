import {  Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
import { v4 as uuidv4 } from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCalendar, NgbDateAdapter,  NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HereMapService } from '../../../../services/here-map.service';
declare var $: any;

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.css']
})
export class AddRouteComponent implements OnInit {

  pageTitle:string;
  errors:{};
  routeData ={
    sourceInformation: {
      recurring:{
        recurringRoute: '',
        recurringType: '',
        recurringDate: '',
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
      }
    },
    destinationInformation: {
      stop:{}
    },
  };
  form;

  routeNo   = '';
  routeName = '';
  notes     = '';
  VehicleID = '';
  AssetID   = '';
  miles     = "";
  driverUserName = '';
  coDriverUserName = '';
  sourceInformation = {
    sourceLocationID: '',
    sourceAddress:'',
    sourceCountryID: '',
    sourceStateID:'',
    sourceCityID:'',
    sourceZipCode:'',
    recurring: {
      recurringRoute: '',
      recurringType: '',
      recurringDate: '',
      sunday: '',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: ''

    }
  };
  destinationInformation = {
    destinationLocationID: '',
    destinationAddress: '',
    destinationCountryID: '',
    destinationStateID:'',
    destinationCityID:'',
    destinationZipCode:'',
    stop:{
      destinationStop: '',
      stopLocation: '',
      stopNotes: ''
    }
  };

  vehicles = [];
  assets = [];
  drivers = [];
  coDrivers = [];
  // locations = [];
  countries = [];
  sourceStates = [];
  destinationStates = [];
  sourceCities = [];
  destinationCities = [];

  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  mapView: boolean = false ;

  locations = [
    {
      locationID: '1',
      locationName: 'location 1'
    },
    {
      locationID: '2',
      locationName: 'location 2'
    },
    {
      locationID: '3',
      locationName: 'location 3'
    },
    {
      locationID: '4',
      locationName: 'location 4'
    },
  ];

  constructor(private apiService: ApiService, private awsUS: AwsUploadService, private route: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private ngbCalendar: NgbCalendar, 
    private dateAdapter: NgbDateAdapter<string>, private hereMap: HereMapService) {}

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {

    this.pageTitle = 'Add Route';

    this.fetchCountries();
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    // this.mapShow();

    $(document).ready(() => {
      this.form = $('#form_').validate();
    });

    $('#recurringBtn').on('click', function(){
      if(this.checked == true){
        $("#recurringRadioDiv").css('display','block');
        $("#recurringDate").css('display','block');
      } else{
        $("#recurringRadioDiv").css('display','none');
        $("#recurringDate").css('display','none');
      }
    });

    $("#addStop").on('click', function(){
      // alert('2');
    });

    var thiss = this;
    $('.countrySelect').on('change', function(){
      var curr = $(this);
      var countryId = curr.val();
      var countryType = curr.closest('select').attr('type');
      thiss.getStates(countryId, countryType);
    })

    $('#routeCheckBtn').on('click', function() {
      if(this.checked == true){
        $('#routeMapDiv').css('display', 'flex');
        thiss.mapShow();
      } else{
        $('#routeMapDiv').css('display', 'none');
      }
    })

    $('.stateSelect').on('change', function(){
      var curr = $(this);
      var stateId = curr.val();
      var stateType = curr.closest('select').attr('type');
      thiss.getCities(stateId, stateType);
    })

    $(".reccRoute").on('click', function(){
      // alert('redd');
      $('.reccRoute').removeClass('selRecc');
      $(this).addClass('selRecc');
    })
  }

  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
        // console.log(this.countries)
      });
  }

  fetchVehicles(){
    this.apiService.getData('vehicles')
      .subscribe((result: any) =>{
        this.vehicles = result.Items;
        // console.log('vehicles');
        // console.log(this.vehicles);
    })
  }

  fetchAssets(){
    this.apiService.getData('assets')
      .subscribe((result: any)=>{
        this.assets = result.Items;
        console.log(this.assets);
      })
  }

  fetchDrivers(){
    this.apiService.getData('drivers')
      .subscribe((result: any)=>{
        this.drivers = result.Items;
        console.log('this.drivers');
        console.log(this.drivers);
      })
  }

  getStates(countryID, countryType) {
    this.spinner.show();
    this.apiService.getData('states/country/' + countryID)
      .subscribe((result: any) => {
        if(countryType == 'source'){
          this.sourceStates = result.Items;
        } else if(countryType == 'destination'){
          this.destinationStates = result.Items;
        }
        this.spinner.hide();
        // console.log('this.states', result.Items)
      });
  }

  getCities(stateID, stateType) {
    this.spinner.show();
    this.apiService.getData('cities/state/' + stateID)
      .subscribe((result: any) => {
        if(stateType == 'source'){
          this.sourceCities = result.Items;
        } else if(stateType == 'destination'){
          this.destinationCities = result.Items;
        }
        this.spinner.hide();
        // console.log('this.states', result.Items)
      });
  }

  mapShow() {
    this.mapView = true;
    setTimeout(() => {
      this.hereMap.mapInit();
    }, 100);
  }


  addRoute(){
    console.log(this.routeData.sourceInformation.recurring);

    if(this.routeData.sourceInformation.recurring.recurringType != ''){
      if(this.routeData.sourceInformation.recurring.recurringType == 'weekly'){
        if($('input.daysChecked:checked').length > 1){
          this.toastr.error('Please select a single day for weekly recurring route');
          return false;
        }
      } else if(this.routeData.sourceInformation.recurring.recurringType == 'biweekly'){
        if($('input.daysChecked:checked').length > 2){
          this.toastr.error('Please select only two days for biweekly recurring route');
          return false;
        }
      }
    }

    this.spinner.show();
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    this.apiService.postData('routes', this.routeData).subscribe({
      complete: () => { },
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              this.spinner.hide();
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/'([^']+)'/)[1];
              console.log(key);
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
              this.Success = '';
              this.spinner.hide();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.spinner.hide();
        this.response = res;
        this.toastr.success('Route added successfully');
        this.router.navigateByUrl('/dispatch/routes/route-list');
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

}

