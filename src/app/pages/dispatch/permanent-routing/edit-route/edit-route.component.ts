import {  Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
import { v4 as uuidv4 } from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCalendar, NgbDateAdapter,  NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HereMapService } from '../../../../services';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.css']
})
export class EditRouteComponent implements OnInit {

  pageTitle:string;
  public searchResults: any;
  public searchResults1: any;
  private readonly search: any;
  public searchTerm = new Subject<string>();
  public searchTerm1 = new Subject<string>();
  mapVisible = false;
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
  miles     = "";
  driverUserName = '';
  coDriverUserName = '';
  sourceInformation = {
    // sourceLocationID: '',
    sourceAddress:'',
    sourceCountry: '',
    sourceState:'',
    sourceCity:'',
    sourceZipCode:'',
  };
  recurring = {
    recurringRoute: false,
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
  destinationInformation = {
    // destinationLocationID: '',
    destinationAddress: '',
    destinationCountry: '',
    destinationState:'',
    destinationCity:'',
    destinationZipCode:'',
  };
  stop = [];
  destinationStop = <any> '';

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

  sundaySelect = '';
  mondaySelect = '';
  tuesdaySelect = '';
  wednesdaySelect = '';
  thursdaySelect = '';
  fridaySelect = '';
  saturdaySelect = '';

  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  newCoords = [];
  // searchResults;

  constructor(private apiService: ApiService, private awsUS: AwsUploadService, private route: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private ngbCalendar: NgbCalendar, 
    private dateAdapter: NgbDateAdapter<string>, private hereMap: HereMapService) {}

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {
    this.routeID    = this.route.snapshot.params['routeID'];
    this.pageTitle  = 'Edit Route';
    
    this.fetchCountries();
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.fetchRoute();
    this.searchLocation();

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
    })

    // $(".reccRoute").on('click', function(){
    $(document).on('click','.reccRoute', function(){
      // alert('redd');
      $('.reccRoute').removeClass('selRecc');
      $(this).addClass('selRecc');
    })

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


  fetchRoute(){
    this.spinner.show();
    this.apiService.getData('routes/'+this.routeID).
      subscribe((result: any) => {
        result = result.Items[0];

        this.routeNo   = result.routeNo;
        // console.log(result);
        this.routeName = result.routeName;
        this.notes     = result.notes;
        this.VehicleID = result.VehicleID;
        this.AssetID   = result.AssetID;
        this.driverUserName = result.driverUserName;
        this.coDriverUserName = result.coDriverUserName;
        this.sourceInformation = {
          // sourceLocationID: result.sourceInformation.sourceLocationID,
          sourceAddress:result.sourceInformation.sourceAddress,
          sourceCountry: result.sourceInformation.sourceCountry,
          sourceState:result.sourceInformation.sourceState,
          sourceCity:result.sourceInformation.sourceCity,
          sourceZipCode:result.sourceInformation.sourceZipCode,
        };
        this.recurring = {
          recurringRoute: result.recurring.recurringRoute,
          recurringType: result.recurring.recurringType,
          recurringDate: result.recurring.recurringDate,
          sunday: result.recurring.sunday,
          monday: result.recurring.monday,
          tuesday: result.recurring.tuesday,
          wednesday: result.recurring.wednesday,
          thursday: result.recurring.thursday,
          friday: result.recurring.friday,
          saturday: result.recurring.saturday
        }
        this.destinationInformation = {
          // destinationLocationID: result.destinationInformation.destinationLocationID,
          destinationAddress: result.destinationInformation.destinationAddress,
          destinationCountry: result.destinationInformation.destinationCountry,
          destinationState:result.destinationInformation.destinationState,
          destinationCity:result.destinationInformation.destinationCity,
          destinationZipCode:result.destinationInformation.destinationZipCode,
        };
        this.stop = result.stops;
        // console.log(this.recurring);
        if(result.recurring.recurringRoute === true){
          $("#recurringRadioDiv").css('display','block');
          $("#recurringDate").css('display','block');
        }
        // if(result.stop.destinationStop == true){
          this.destinationStop = true;
          $('#routeMapDiv').css('display', 'flex');
          this.mapShow()
        // }

        if(result.recurring.recurringType == 'daily'){
          this.dailyClass = 'selRecc';
          this.weekClass = '';
          this.biClass = '';
        } else if(result.recurring.recurringType == 'weekly'){
          this.dailyClass = '';
          this.weekClass = 'selRecc';
          this.biClass = '';
        } else if(result.recurring.recurringType == 'biweekly'){
          this.dailyClass = '';
          this.weekClass = '';
          this.biClass = 'selRecc';
        }

        if (this.stop.length > 1) {
          this.getCoords(this.stop);
        }

        // console.log('this.sourceInformation')
        // console.log(this.sourceInformation)

        this.spinner.hide();
      })
  }

  updateRoute() {
    this.hasError = false;
    this.hasSuccess = false;
    // console.log('updatedd')
    // console.log(this.sourceInformation);
    if (this.recurring.recurringRoute === true) {
      if(this.recurring.recurringType == '') {
        this.toastr.error('Please select recurring type');
        return false;
      }

      if ($('input.daysChecked:checked').length == 0) { 
        this.toastr.error('Please select day and date of recurring');
        return false;
      }

      if (this.recurring.recurringType === 'weekly') {
        if ($('input.daysChecked:checked').length > 1) {
          this.toastr.error('Please select a single day for weekly recurring route');
          return false;
        }
      } else if (this.recurring.recurringType === 'biweekly') {
        if ($('input.daysChecked:checked').length > 2) {
          this.toastr.error('Please select only two days for biweekly recurring route');
          return false;
        }
      }
    }

    this.spinner.show();
    const data = {
      routeID   : this.route.snapshot.params['routeID'],
      routeNo   : this.routeNo,
      routeName : this.routeName,
      notes     : this.notes,
      VehicleID : this.VehicleID,
      AssetID   : this.AssetID,
      driverUserName : this.driverUserName,
      coDriverUserName : this.coDriverUserName,
      sourceInformation : {
        // sourceLocation: this.sourceInformation.sourceLocationID,
        sourceAddress:this.sourceInformation.sourceAddress,
        sourceCountry: this.sourceInformation.sourceCountry,
        sourceState:this.sourceInformation.sourceState,
        sourceCity:this.sourceInformation.sourceCity,
        sourceZipCode:this.sourceInformation.sourceZipCode,
      },
      recurring: {
        recurringRoute: this.recurring.recurringRoute,
        recurringType: this.recurring.recurringType,
        recurringDate: this.recurring.recurringDate,
        sunday: this.recurring.sunday,
        monday: this.recurring.monday,
        tuesday: this.recurring.tuesday,
        wednesday: this.recurring.wednesday,
        thursday: this.recurring.thursday,
        friday: this.recurring.friday,
        saturday: this.recurring.saturday
      },
      destinationInformation : {
        // destinationLocationID: this.destinationInformation.destinationLocationID,
        destinationAddress: this.destinationInformation.destinationAddress,
        destinationCountry: this.destinationInformation.destinationCountry,
        destinationState:this.destinationInformation.destinationState,
        destinationCity:this.destinationInformation.destinationCity,
        destinationZipCode:this.destinationInformation.destinationZipCode,
      },
      stops : this.stop,
      // stop:{
      //   stopLocation: this.stop.stopLocation,
      //   stopNotes: this.stop.stopNotes
      // }
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
              this.spinner.hide();
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
              this.spinner.hide();
            },
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.spinner.hide();
        this.toastr.success('Route updated successfully');
      },
    })
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  mapShow() {
    setTimeout(() => {
      this.hereMap.mapInit();
    }, 100);
  }

  async assignLocation(elem, label) {
    console.log("dff", elem, label);
    const result = await this.hereMap.geoCode(label);
    const labelResult = result.items[0];
    console.log("labelResult", labelResult);
    const item = {
      stopName: label,
      stopNotes: ''
    };
    if (elem === 'source') {

      // this.routeData.sourceInformation['sourceAddress'] =
      //   `${labelResult.title} ${labelResult.address.houseNumber} ${labelResult.address.street}`;
      this.routeData.sourceInformation['sourceAddress'] = '';
      this.routeData.sourceInformation['sourceCountry'] = '';
      this.routeData.sourceInformation['sourceState'] = '';
      this.routeData.sourceInformation['sourceCity'] = '';
      this.routeData.sourceInformation['sourceZipCode'] = '';

      this.routeData.sourceInformation['sourceAddress'] = `${labelResult.title}` ;
      if(labelResult.address.houseNumber !== undefined) {
        this.routeData.sourceInformation['sourceAddress'] += `${labelResult.address.houseNumber}`;
      }

      if(labelResult.address.street !== undefined) {
        this.routeData.sourceInformation['sourceAddress'] += `${labelResult.address.street}`;
      }
      
      if(labelResult.address.countryName !== undefined) {
        this.routeData.sourceInformation['sourceCountry'] = `${labelResult.address.countryName}`;
      }

      if(labelResult.address.state !== undefined) {
        this.routeData.sourceInformation['sourceState'] = `${labelResult.address.state} (${labelResult.address.stateCode})`;
      }

      if(labelResult.address.city !== undefined) {
        this.routeData.sourceInformation['sourceCity'] = `${labelResult.address.city}`;
      }
      
      if(labelResult.address.postalCode !== undefined) {
        this.routeData.sourceInformation['sourceZipCode'] = `${labelResult.address.postalCode}`;
      }
      
      this.stop.splice(1, 0, item);
    } else {
      this.routeData.destinationInformation['destinationAddress'] = '';
      this.routeData.destinationInformation['destinationCountry'] = '';
      this.routeData.destinationInformation['destinationState'] = '';
      this.routeData.destinationInformation['destinationCity'] = '';
      this.routeData.destinationInformation['destinationZipCode'] = '';

      // this.routeData.destinationInformation['destinationAddress'] =
      //   `${labelResult.title} ${labelResult.address.houseNumber} ${labelResult.address.street}`;

      this.routeData.destinationInformation['destinationAddress'] = `${labelResult.title}`;

      if(labelResult.address.houseNumber !== undefined) {
        this.routeData.destinationInformation['destinationAddress'] += `${labelResult.address.houseNumber}`;
      }

      if(labelResult.address.street !== undefined) {
        this.routeData.destinationInformation['destinationAddress'] += `${labelResult.address.street}`;
      }
      
      if(labelResult.address.countryName !== undefined) {
        this.routeData.destinationInformation['destinationCountry'] = `${labelResult.address.countryName}`;
      }

      if(labelResult.address.state !== undefined) {
        this.routeData.destinationInformation['destinationState'] = `${labelResult.address.state} (${labelResult.address.stateCode})`;
      }
      
      if(labelResult.address.city !== undefined) {
        this.routeData.destinationInformation['destinationCity'] = `${labelResult.address.city}`;
      }
      
      if(labelResult.address.postalCode !== undefined) {
        this.routeData.destinationInformation['destinationZipCode'] = `${labelResult.address.postalCode}`;
      }
      
      this.stop.splice(1, 1);
      this.stop.splice(1, 0, item);
    }
    // console.log('this.stopsData', this.routeData.stops);
    this.searchResults = false;
    $('div').removeClass('show-search__result');

  }

  addStops() {
    const item = {
      stopName: '',
      stopNotes: ''
    };
    const length = this.stop.length;
    this.stop.splice(length - 1, 0, item);
    if (length > 2) {
      console.log('length if', length);
      this.stop[this.stop.length - 1].stopName = this.destinationInformation['destinationAddress'];
    } else {
      console.log('length else', length);
      this.stop[length].stopName = this.destinationInformation['destinationAddress'];
    }

    console.log('this.stop', this.stop);
  }

  removeStops(i) {
    this.stop.splice(i, 0);
  }

  /**
   * pass trips coords to show on the map
   * @param data
   */
  async getCoords(data) {
    this.spinner.show();
    await Promise.all(data.map(async item => {
      let result = await this.hereMap.geoCode(item.stopName);
      console.log('result', result);
      this.newCoords.push(`${result.items[0].position.lat},${result.items[0].position.lng}`)
    }));
    this.hereMap.calculateRoute(this.newCoords);
    this.spinner.hide();
    this.newCoords = [];
  }

  eventCheck(event) {
    const value = event.target.checked;
    if (value === true) {
      this.mapVisible = true;
      this.mapShow();
      if (this.stop.length > 1) {
        this.getCoords(this.stop);
      }
    } else {
      this.mapVisible = false;
    }
  }

  public searchLocation() {
    let target;
    this.searchTerm.pipe(
      map((e: any) => {
        console.log(e.target)
        $('.map-search__results').hide();
        $(e.target).closest('div').addClass('show-search__result');
        target = e;
        return e.target.value;
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        return this.hereMap.searchEntries(term);
      }),
      catchError((e) => {
        return throwError(e);
      }),
    ).subscribe(res => {
      this.searchResults = res;
    });
  }

}
