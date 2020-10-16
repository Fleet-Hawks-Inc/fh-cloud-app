import {  Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
import { v4 as uuidv4 } from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.css']
})
export class EditRouteComponent implements OnInit {

  pageTitle:string;
  errors:{};
  routeData ={
    sourceInformation: {
      recurring:{}
    },
    destinationInformation: {
      stop:{}
    },
  };
  form;

  routeID   = '';
  routeNo   = '';
  routeName = '';
  notes     = '';
  VehicleID = '';
  AssetID   = '';
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
      recurringType: ''
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
  dailyClass = '';
  weekClass = '';
  biClass = '';

  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';

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
    private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.routeID    = this.route.snapshot.params['routeID'];
    this.pageTitle  = 'Edit Route';
    
    this.fetchCountries();
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.fetchRoute();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
    
    $('#recurringBtn').on('click', function(){
      if(this.checked == true){
        $("#recurringRadioDiv").css('display','block');
      } else{
        $("#recurringRadioDiv").css('display','none');
      }
    });

    $('#routeCheckBtn').on('click', function() {
      if(this.checked == true){
        $('#routeMapDiv').css('display', 'flex');
      } else{
        $('#routeMapDiv').css('display', 'none');
      }
    })

    $("#addStop").on('click', function(){
      alert('2');
    })

    var thiss = this;
    $('.countrySelect').on('change', function(){
      var curr = $(this);
      var countryId = curr.val();
      var countryType = curr.closest('select').attr('type');
      thiss.getStates(countryId, countryType);
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
        // console.log(this.assets);
      })
  }

  fetchDrivers(){
    this.apiService.getData('drivers')
      .subscribe((result: any)=>{
        this.drivers = result.Items;
        // console.log(this.drivers);
      })
  }

  getStates(countryID, countryType) {
    this.apiService.getData('states/country/' + countryID)
      .subscribe((result: any) => {
        if(countryType == 'source'){
          this.sourceStates = result.Items;
        } else if(countryType == 'destination'){
          this.destinationStates = result.Items;
        }
        
        // console.log('this.states', result.Items)
      });
  }

  getCities(stateID, stateType) {
    this.apiService.getData('cities/state/' + stateID)
      .subscribe((result: any) => {
        if(stateType == 'source'){
          this.sourceCities = result.Items;
        } else if(stateType == 'destination'){
          this.destinationCities = result.Items;
        }
        // console.log('this.states', result.Items)
      });
  }


  fetchRoute(){
    this.apiService.getData('routes/'+this.routeID).
      subscribe((result: any) => {
        result = result.Items[0];

        this.routeNo   = result.routeNo;
        console.log(this.routeNo);
        this.routeName = result.routeName;
        this.notes     = result.notes;
        this.VehicleID = result.VehicleID;
        this.AssetID   = result.AssetID;
        this.driverUserName = result.driverUserName;
        this.coDriverUserName = result.coDriverUserName;
        this.sourceInformation = {
          sourceLocationID: result.sourceInformation.sourceLocationID,
          sourceAddress:result.sourceInformation.sourceAddress,
          sourceCountryID: result.sourceInformation.sourceCountryID,
          sourceStateID:result.sourceInformation.sourceStateID,
          sourceCityID:result.sourceInformation.sourceCityID,
          sourceZipCode:result.sourceInformation.sourceZipCode,
          recurring: {
            recurringRoute: result.sourceInformation.recurring.recurringRoute,
            recurringType: result.sourceInformation.recurring.recurringType
          }
        };
        this.destinationInformation = {
          destinationLocationID: result.destinationInformation.destinationLocationID,
          destinationAddress: result.destinationInformation.destinationAddress,
          destinationCountryID: result.destinationInformation.destinationCountryID,
          destinationStateID:result.destinationInformation.destinationStateID,
          destinationCityID:result.destinationInformation.destinationCityID,
          destinationZipCode:result.destinationInformation.destinationZipCode,
          stop:{
            destinationStop: result.destinationInformation.stop.destinationStop,
            stopLocation: result.destinationInformation.stop.stopLocation,
            stopNotes: result.destinationInformation.stop.stopNotes
          }
        };
        if(result.sourceInformation.recurring.recurringRoute == true){
          $("#recurringRadioDiv").css('display','block');
        }
        if(result.destinationInformation.stop.destinationStop == true){
          $('#routeMapDiv').css('display', 'flex');
        }

        if(result.sourceInformation.recurring.recurringType == 'daily'){
           this.dailyClass = 'selRecc';
           this.weekClass = '';
           this.biClass = '';
        } else if(result.sourceInformation.recurring.recurringType == 'weekly'){
            this.dailyClass = '';
           this.weekClass = 'selRecc';
           this.biClass = '';
        } else if(result.sourceInformation.recurring.recurringType == 'biweekly'){
          this.dailyClass = '';
          this.weekClass = '';
          this.biClass = 'selRecc';
        }
        
        this.getStates(result.sourceInformation.sourceCountryID, 'source');
        this.getStates(result.destinationInformation.destinationCountryID, 'destination');

        this.getCities(result.sourceInformation.sourceStateID, 'source');
        this.getCities(result.destinationInformation.destinationStateID, 'destination');
      })
  }

  updateRoute() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      routeID: this.routeID,
      routeNo   : this.routeNo,
      routeName : this.routeName,
      notes     : this.notes,
      VehicleID : this.VehicleID,
      AssetID   : this.AssetID,
      driverUserName : this.driverUserName,
      coDriverUserName : this.coDriverUserName,
      sourceInformation : {
        sourceLocationID: this.sourceInformation.sourceLocationID,
        sourceAddress:this.sourceInformation.sourceAddress,
        sourceCountryID: this.sourceInformation.sourceCountryID,
        sourceStateID:this.sourceInformation.sourceStateID,
        sourceCityID:this.sourceInformation.sourceCityID,
        sourceZipCode:this.sourceInformation.sourceZipCode,
        recurring: {
          recurringRoute: this.sourceInformation.recurring.recurringRoute,
          recurringType: this.sourceInformation.recurring.recurringType
        }
      },
      destinationInformation : {
        destinationLocationID: this.destinationInformation.destinationLocationID,
        destinationAddress: this.destinationInformation.destinationAddress,
        destinationCountryID: this.destinationInformation.destinationCountryID,
        destinationStateID:this.destinationInformation.destinationStateID,
        destinationCityID:this.destinationInformation.destinationCityID,
        destinationZipCode:this.destinationInformation.destinationZipCode,
        stop:{
          destinationStop: this.destinationInformation.stop.destinationStop,
          stopLocation: this.destinationInformation.stop.stopLocation,
          stopNotes: this.destinationInformation.stop.stopNotes
        }
      },
    };
    console.log('data', data)

    this.apiService.putData('routes', data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/'([^']+)'/)[1];

              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.toastr.success('Route updated successfully');
        // this.Success = 'Route updated successfully';
      },
    })
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
