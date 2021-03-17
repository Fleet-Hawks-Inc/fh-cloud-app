import { Component, OnInit } from '@angular/core';
import { ApiService, ListService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { HereMapService } from '../../../../services';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.css']
})
export class AddRouteComponent implements OnInit {

  pageTitle: string;
  public searchResults: any;
  public searchResults1: any;
  public searchTerm = new Subject<string>();
  public searchTerm1 = new Subject<string>();
  mapVisible = false;
  errors = {};
  routeData = {
    routeNo: '',
    routeName: '',
    notes: '',
    VehicleID: '',
    AssetID: '',
    driverUserName: '',
    coDriverUserName: '',
    miles: 0,
    sourceInformation: {
      sourceAddress: '',
      sourceCity: '',
      sourceState: '',
      sourceCountry: '',
      sourceZipCode: ''
    },
    recurring: {
      recurringRoute: false,
      recurringType: '',
      recurringDate: '',
    },
    destinationInformation: {
      destinationAddress: '',
      destinationCity: '',
      destinationState: '',
      destinationCountry: '',
      destinationZipCode: ''
    },
    stops: []
  };
  form;
  newCoords = [];

  vehicles: any;
  assets:any;
  drivers: any;
  coDrivers: any;
  // locations = [];
  countries = [];
  sourceStates = [];
  destinationStates = [];
  sourceCities = [];
  destinationCities = [];

  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  mapView = false;
  stopsData = [];

  new_length = 0;
  routeID = '';
  destinationStop = false;
  dailyClass = '';
  weekClass = '';
  biClass = '';
  isDaily = false;

  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>, private hereMap: HereMapService, private listService: ListService) {
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {
    this.listService.fetchVehicles();
    this.listService.fetchDrivers();
    this.listService.fetchAssets();
    this.routeID    = this.route.snapshot.params['routeID'];
    if(this.routeID != undefined) {
      this.pageTitle = 'Edit Route';
    } else {
      this.pageTitle = 'Add Route';
    } 
    
    this.searchLocation();

    this.vehicles = this.listService.vehicleList;
    this.drivers = this.listService.driversList;
    this.coDrivers = this.listService.driversList;
    this.assets = this.listService.assetsList;
    if(this.routeID != undefined) {
      this.fetchRouteByID();
    }

    $(document).ready(() => {
      this.form = $('#form_').validate();
    });

    $('#recurringBtn').on('click', function () {
      if (this.checked === true) {
        $('#recurringRadioDiv').css('display', 'block');
        $('#recurringDate').css('display', 'block');
      } else {
        $('#recurringRadioDiv').css('display', 'none');
        $('#recurringDate').css('display', 'none');
      }
    });
  }

  eventCheck(event) {
    const value = event.target.checked;
    if (value === true) {
      this.mapVisible = true;
      this.mapShow();
      if (this.routeData.stops.length > 1) {
        this.getCoords(this.routeData.stops);
      }
    } else {
      this.mapVisible = false;
    }
  }

  public searchLocation() {
    let target;
    this.searchTerm.pipe(
      map((e: any) => {
        $('.map-search__results').hide();
        $(e.target).closest('div').addClass('show-search__result');
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

  /**
   * pass trips coords to show on the map
   * @param data
   */
  async getCoords(data) { 
    await Promise.all(data.map(async item => {
      let result = await this.hereMap.geoCode(item.stopName);
      this.newCoords.push(`${result.items[0].position.lat},${result.items[0].position.lng}`)
    }));
    this.hereMap.calculateRoute(this.newCoords);
    this.newCoords = [];
  }

  resetCodrivers() {
    this.routeData.coDriverUserName = '';
  }

  mapShow() {
    this.mapView = true;
    setTimeout(() => {
      this.hereMap.mapInit();
    }, 100);
  }

  addRoute() {
    
    if (this.routeData.recurring.recurringRoute === true) {
      if(this.routeData.recurring.recurringType == '') {
        this.toastr.error('Please select recurring type');
        return false;
      }
    }
    
    // this.spinner.show();
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
    this.apiService.postData('routes', this.routeData).subscribe({
      complete: () => {
      },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => {
            },
            next: () => {
            },
          });
      },
      next: (res) => {
        this.response = res;
        this.toastr.success('Route added successfully.');
        this.router.navigateByUrl('/dispatch/routes/list');
      },
    });
  }

  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error')
      });
  }

  hideErrors() { 
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label')
      });
    this.errors = {};
  }

  async assignLocation(elem, label, index='') {
    const result = await this.hereMap.geoCode(label);
    const labelResult = result.items[0];
    const item = {
      stopName: label,
      stopNotes: ''
    };
    if (elem === 'source') {
      this.routeData.sourceInformation['sourceAddress'] = '';
      this.routeData.sourceInformation['sourceCountry'] = '';
      this.routeData.sourceInformation['sourceState'] = '';
      this.routeData.sourceInformation['sourceCity'] = '';
      this.routeData.sourceInformation['sourceZipCode'] = '';

      this.routeData.sourceInformation['sourceAddress'] = `${labelResult.title}` ;
      
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
      
      this.routeData.stops.splice(1, 0, item);
    } else if(elem === 'destination') {
      this.routeData.destinationInformation['destinationAddress'] = '';
      this.routeData.destinationInformation['destinationCountry'] = '';
      this.routeData.destinationInformation['destinationState'] = '';
      this.routeData.destinationInformation['destinationCity'] = '';
      this.routeData.destinationInformation['destinationZipCode'] = '';

      this.routeData.destinationInformation['destinationAddress'] = `${labelResult.title}`;
      
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
      
      this.routeData.stops.splice(1, 1);
      this.routeData.stops.splice(1, 0, item);
    } else {
      
      this.routeData.stops[index]['stopName'] = label;
    }
    this.searchResults = false;
    this.reinitMap();
    $('div').removeClass('show-search__result');

  }

  addStops() {
    const item = {
      stopName: '',
      stopNotes: ''
    };
    let allStops = this.routeData.stops;
    const length = this.routeData.stops.length;
    allStops.splice(length - 1, 0, item);
    if (length > 2) {
      allStops[allStops.length - 1].stopName = this.routeData.destinationInformation['destinationAddress'];
    } else {
      allStops[length].stopName = this.routeData.destinationInformation['destinationAddress'];
    }
    let thiss = this
    this.routeData.stops = [];
    setTimeout(function(){
      thiss.routeData.stops = allStops;
    },0.5)
  }

  removeStops(i) {
    
    this.routeData.stops.splice(i, 1);
    setTimeout(() => {
      this.reinitMap();
    }, 1000);
    
  }

  fetchRouteByID(){
    this.apiService.getData('routes/'+this.routeID).
      subscribe((result: any) => {
        result = result.Items[0];

        this.routeData['routeNo']   = result.routeNo;
        this.routeData['routeName'] = result.routeName;
        this.routeData['notes']     = result.notes;
        this.routeData['VehicleID'] = result.VehicleID;
        this.routeData['AssetID']   = result.AssetID;
        this.routeData['driverUserName'] = result.driverUserName;
        this.routeData['coDriverUserName'] = result.coDriverUserName;
        this.routeData['miles'] = result.miles;
        
        this.routeData['sourceInformation'] = {
          sourceAddress:result.sourceInformation.sourceAddress,
          sourceCountry: result.sourceInformation.sourceCountry,
          sourceState:result.sourceInformation.sourceState,
          sourceCity:result.sourceInformation.sourceCity,
          sourceZipCode:result.sourceInformation.sourceZipCode,
        };
        this.routeData.recurring = {
          recurringRoute: result.recurring.recurringRoute,
          recurringType: result.recurring.recurringType,
          recurringDate: result.recurring.recurringDate,
        }
        this.routeData.destinationInformation = {
          destinationAddress: result.destinationInformation.destinationAddress,
          destinationCountry: result.destinationInformation.destinationCountry,
          destinationState:result.destinationInformation.destinationState,
          destinationCity:result.destinationInformation.destinationCity,
          destinationZipCode:result.destinationInformation.destinationZipCode,
        };
        this.routeData.stops = result.stops;
        if(result.recurring.recurringRoute === true){
          $("#recurringRadioDiv").css('display','block');
          $("#recurringDate").css('display','block');
        }
        if(result.recurring.recurringType == 'daily'){
          this.dailyClass = 'selRecc';
          this.weekClass = '';
          this.biClass = '';
        } else if(result.recurring.recurringType == 'weekly'){
          this.isDaily = true;
          this.dailyClass = '';
          this.weekClass = 'selRecc';
          this.biClass = '';
        } else if(result.recurring.recurringType == 'biweekly'){
          this.isDaily = true;
          this.dailyClass = '';
          this.weekClass = '';
          this.biClass = 'selRecc';
        }
        this.routeData['timeCreated'] = result.timeCreated;

        // show map route
        this.destinationStop = true;
        this.mapVisible = true;
        if (result.stops.length > 1) {
          this.getCoords(result.stops);
        }
        this.mapShow()

      })
  }

  updateRoute() {
    this.hasError = false;
    this.hasSuccess = false;
    if (this.routeData.recurring.recurringRoute === true) {
      if(this.routeData.recurring.recurringType == '') {
        this.toastr.error('Please select recurring type.');
        return false;
      }
    }

    this.routeData['routeID'] = this.route.snapshot.params['routeID'];
    this.apiService.putData('routes', this.routeData).subscribe({
      complete: () => {

      },
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
              
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
        this.router.navigateByUrl('/dispatch/routes/list');
        this.toastr.success('Route updated successfully.');
      },
    })
  }

  selectRecurring(event) {
    $('.reccRoute').removeClass('selRecc');
    $('#'+event.target.id).closest('label').addClass('selRecc');
    if(event.target.id != 'dailyRecurringRadioBtn') {
      this.isDaily = true;
    } else {
      this.isDaily = false;
    }
  }

  reinitMap() {
    if (this.routeData.stops.length > 1) {
      this.getCoords(this.routeData.stops);
    }
  }

  gotoVehiclePage() {
    $('#addVehicleModelDriver').modal('show');
  }

  gotoDriverPage() {    
    $('#addDriverModelVehicle').modal('show');
  }

  gotoAssetPage() {    
    $('#addAsset').modal('show');
  }
}

