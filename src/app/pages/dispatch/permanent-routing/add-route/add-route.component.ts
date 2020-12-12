import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
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
  private readonly search: any;
  public searchTerm = new Subject<string>();
  public searchTerm1 = new Subject<string>();
  mapVisible = false;
  errors: {};
  routeData = {
    coDriverUserName: '',
    sourceInformation: {},
    recurring: {
      recurringRoute: false,
      recurringType: '',
      recurringDate: '',
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false
    },
    destinationInformation: {},
    stops: []
  };
  form;
  newCoords = [];

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
  Error = '';
  Success = '';
  mapView = false;
  stopsData = [];
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

  new_length = 0;

  constructor(private apiService: ApiService,
    private awsUS: AwsUploadService, private route: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>, private hereMap: HereMapService) {
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }



  ngOnInit() {

    this.pageTitle = 'Add Route';

    // this.fetchCountries();
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.searchLocation();

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


    var thiss = this;
    // $('.countrySelect').on('change', function () {
    //   var curr = $(this);
    //   var countryId = curr.val();
    //   var countryType = curr.closest('select').attr('type');
    //   thiss.getStates(countryId, countryType);
    // })

    $('#routeCheckBtn').on('click', function () {
      if (this.checked == true) {
        $('#routeMapDiv').css('display', 'flex');
        thiss.mapShow();
        //this.getCoords(this.routeData.stops);
      } else {
        $('#routeMapDiv').css('display', 'none');
      }
    })

    // $('.stateSelect').on('change', function () {
    //   let curr = $(this);
    //   let stateId = curr.val();
    //   let stateType = curr.closest('select').attr('type');
    //   thiss.getCities(stateId, stateType);
    // })

    $('.reccRoute').on('click', function () {
      // alert('redd');
      $('.reccRoute').removeClass('selRecc');
      $(this).addClass('selRecc');
    })
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

  // fetchCountries() {
  //   this.apiService.getData('countries')
  //     .subscribe((result: any) => {
  //       this.countries = result.Items;
  //       // console.log(this.countries)
  //     });
  // }

  fetchVehicles() {
    this.apiService.getData('vehicles')
      .subscribe((result: any) => {
        this.vehicles = result.Items;
        // console.log('vehicles');
        // console.log(this.vehicles);
      })
  }

  fetchAssets() {
    this.apiService.getData('assets')
      .subscribe((result: any) => {
        this.assets = result.Items;
        console.log(this.assets);
      })
  }

  fetchDrivers() {
    this.apiService.getData('drivers')
      .subscribe((result: any) => {
        this.drivers = result.Items;
        this.coDrivers = result.Items;
        // console.log('this.drivers');
        // console.log(this.drivers);
      })
  }

  resetCodrivers(event) {
    $("#codrvr option").show();
    this.routeData.coDriverUserName = '';
    $("#codrvr option[value='"+event.target.value+"']").hide();
  }

  mapShow() {
    this.mapView = true;
    setTimeout(() => {
      this.hereMap.mapInit();
    }, 100);
  }


  addRoute() {
    // console.log(this.routeData);

    if (this.routeData.recurring.recurringRoute === true) {
      if(this.routeData.recurring.recurringType == '') {
        this.toastr.error('Please select recurring type');
        return false;
      }

      if ($('input.daysChecked:checked').length == 0) { 
        this.toastr.error('Please select day and date of recurring');
        return false;
      }

      if (this.routeData.recurring.recurringType === 'weekly') {
        if ($('input.daysChecked:checked').length > 1) {
          this.toastr.error('Please select a single day for weekly recurring route');
          return false;
        }
      } else if (this.routeData.recurring.recurringType === 'biweekly') {
        if ($('input.daysChecked:checked').length > 2) {
          this.toastr.error('Please select only two days for biweekly recurring route');
          return false;
        }
      }
    }

    this.spinner.show();
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    console.log("this.routeData", this.routeData);
    this.apiService.postData('routes', this.routeData).subscribe({
      complete: () => {
      },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              console.log(key);
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
        this.response = res;
        this.toastr.success('Route added successfully');
        this.router.navigateByUrl('/dispatch/routes/route-list');
      },
    });
  }

  throwErrors() {
    console.log(this.errors);
    this.form.showErrors(this.errors);
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
      
      this.routeData.stops.splice(1, 0, item);
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
      
      this.routeData.stops.splice(1, 1);
      this.routeData.stops.splice(1, 0, item);
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
    const length = this.routeData.stops.length;
    this.routeData.stops.splice(length - 1, 0, item);
    if (length > 2) {
      console.log('length if', length);
      this.routeData.stops[this.routeData.stops.length - 1].stopName = this.routeData.destinationInformation['destinationAddress'];
    } else {
      console.log('length else', length);
      this.routeData.stops[length].stopName = this.routeData.destinationInformation['destinationAddress'];
    }

    console.log('this.routeData.stops', this.routeData.stops);
  }

  removeStops(i) {
    this.routeData.stops.splice(i, 0);
  }

}

