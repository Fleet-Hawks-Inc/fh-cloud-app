import { Component, OnInit } from '@angular/core';
import { ApiService, ListService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { HereMapService } from '../../../../services';
import { GoogleMapsService } from '../../../../services/google-maps.service'
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.css']
})
export class AddRouteComponent implements OnInit {

  public trips;
  public actualMiles;
  pageTitle: string;
  public searchResults: any;
  public searchResults1: any;
  public searchTerm = new Subject<string>();
  public searchTerm1 = new Subject<string>();
  mapVisible = true;
  errors = {};
  routeData = {
    routeNo: '',
    routeName: '',
    notes: '',
    vehicleID: null,
    assetID: null,
    driverID: null,
    coDriverID: null,
    miles: 0,
    sourceInfo: {
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    recurring: {
      route: false,
      type: '',
      date: '',
    },
    destInfo: {
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    stops: []
  };
  form;
  newCoords = [];

  vehicles: any;
  assets: any;
  drivers: any;
  coDrivers: any;
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
  destinationStop = true;
  dailyClass = '';
  weekClass = '';
  biClass = '';
  isDaily = false;
  routeBtnStatus = false;

  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>, private hereMap: HereMapService, private listService: ListService, private pcMiler: GoogleMapsService) {
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {
    this.listService.fetchVehicles();
    this.listService.fetchDrivers();
    this.listService.fetchAssets();
    this.routeID = this.route.snapshot.params['routeID'];
    if (this.routeID != undefined) {
      this.pageTitle = 'Edit Route';
    } else {
      this.mapShow();
      this.pageTitle = 'Add Route';
    }

    this.searchLocation();

    this.vehicles = this.listService.vehicleList;
    this.drivers = this.listService.driversList;
    this.coDrivers = this.listService.driversList;
    this.assets = this.listService.assetsList;
    if (this.routeID != undefined) {
      this.fetchRouteByID();
    }

    $(document).ready(() => {
      // this.form = $('#form_').validate();

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

  async getCoords(data) {
    this.newCoords = [];
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      this.newCoords.push(`${element.lat},${element.lng}`);
    }

    await this.getMiles();
    this.hereMap.calculateRoute(this.newCoords);
  }

  async getCoordsEdit(data) {
    await Promise.all(data.map(async item => {
      let result = await this.hereMap.geoCode(item.name);
      this.newCoords.push(`${result.items[0].position.lat},${result.items[0].position.lng}`)
    }));

    this.hereMap.calculateRoute(this.newCoords);
    this.newCoords = [];
  }

  async getMiles() {
    this.routeData.miles = 0;
    let switchCoordinates = [];
    this.routeData.stops.forEach(coordinates => {
      let newPoint = coordinates.lng + "," + coordinates.lat;
      switchCoordinates.push(newPoint);
    })
    let stops = switchCoordinates.join(";");
    this.pcMiler.pcMiles.next(true);
    this.routeData.miles = await this.pcMiler.pcMilesDistance(stops).toPromise()
  }

  calculateActualMiles(miles) {
    this.actualMiles += miles;
  }
  resetCodrivers() {
    this.routeData.coDriverID = null;
  }

  mapShow() {
    this.mapView = true;
    setTimeout(() => {
      this.hereMap.mapSetAPI();
      this.hereMap.mapInit();
    }, 100);
  }

  addRoute() {
    if (this.routeData.recurring.route === true) {
      if (this.routeData.recurring.type == '') {
        this.toastr.error('Please select recurring type');
        return false;
      }
    }

    this.routeBtnStatus = true;
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
              // this.throwErrors();
              this.routeBtnStatus = false;
            },
            error: () => {
              this.routeBtnStatus = false;
            },
            next: () => {
            },
          });
      },
      next: (res) => {
        this.response = res;
        this.routeBtnStatus = false;
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

  async assignLocation(elem, label, index: any = '') {
    const result = await this.hereMap.geoCode(label);
    const labelResult = result.items[0];
    const item = {
      name: label,
      notes: '',
      state: '',
      country: '',
      lat: '',
      lng: ''
    };

    if(labelResult.position != undefined) {
      item.lat = labelResult.position.lat;
      item.lng = labelResult.position.lng;
    }

    if (labelResult.address.countryName !== undefined) {
      item.country = `${labelResult.address.countryName}`;
    }

    if (labelResult.address.state !== undefined) {
      item.state = `${labelResult.address.state}`;
    }
    if (elem === 'source') {
      this.setSourceValue(labelResult)
      this.routeData.stops[0] = item;

    } else if (elem === 'destination') {
      this.setDestinationValue(labelResult);
      let stopLen = this.routeData.stops.length;
      if (stopLen == 0) {
        this.routeData.stops[0] = {
          name: '',
          notes: '',
          country: '',
          state: '',
          lat: '',
          lng: ''
        };
        this.routeData.stops[1] = item;
      } else if (stopLen == 1 || stopLen == 2) {
        this.routeData.stops[1] = item;
      } else if (stopLen > 2) {
        this.routeData.stops[stopLen - 1] = item;
      }

    } else {
      if(labelResult.position != undefined) {
        this.routeData.stops[index]['lat'] = labelResult.position.lat;
        this.routeData.stops[index]['lng'] = labelResult.position.lng;
      }

      if (labelResult.address.countryName !== undefined) {
        this.routeData.stops[index]['country'] = `${labelResult.address.countryName}`;
      }

      if (labelResult.address.state !== undefined) {
        this.routeData.stops[index]['state'] = `${labelResult.address.state}`;
      }
      this.routeData.stops[index]['name'] = label;

      if (index == 0 || index == this.routeData.stops.length - 1) {
        if (index === 0) {
          this.setSourceValue(labelResult)
        } else {
          this.setDestinationValue(labelResult);
        }
      }
    }
    this.searchResults = false;
    this.reinitMap();
    $('div').removeClass('show-search__result');

  }

  setSourceValue(labelResult) {
    this.routeData.sourceInfo['address'] = '';
    this.routeData.sourceInfo['country'] = '';
    this.routeData.sourceInfo['state'] = '';
    this.routeData.sourceInfo['city'] = '';
    this.routeData.sourceInfo['zipCode'] = '';
    this.routeData.sourceInfo['address'] = `${labelResult.title}`;

    if (labelResult.address.countryName !== undefined) {
      this.routeData.sourceInfo['country'] = `${labelResult.address.countryName}`;
    }

    if (labelResult.address.state !== undefined) {
      this.routeData.sourceInfo['state'] = `${labelResult.address.state} (${labelResult.address.stateCode})`;
    }

    if (labelResult.address.city !== undefined) {
      this.routeData.sourceInfo['city'] = `${labelResult.address.city}`;
    }

    if (labelResult.address.postalCode !== undefined) {
      this.routeData.sourceInfo['zipCode'] = `${labelResult.address.postalCode}`;
    }
  }

  setDestinationValue(labelResult) {
    this.routeData.destInfo['address'] = '';
    this.routeData.destInfo['country'] = '';
    this.routeData.destInfo['state'] = '';
    this.routeData.destInfo['city'] = '';
    this.routeData.destInfo['zipCode'] = '';

    this.routeData.destInfo['address'] = `${labelResult.title}`;

    if (labelResult.address.countryName !== undefined) {
      this.routeData.destInfo['country'] = `${labelResult.address.countryName}`;
    }

    if (labelResult.address.state !== undefined) {
      this.routeData.destInfo['state'] = `${labelResult.address.state} (${labelResult.address.stateCode})`;
    }

    if (labelResult.address.city !== undefined) {
      this.routeData.destInfo['city'] = `${labelResult.address.city}`;
    }

    if (labelResult.address.postalCode !== undefined) {
      this.routeData.destInfo['zipCode'] = `${labelResult.address.postalCode}`;
    }
  }

  addStops() {
    const item = {
      name: '',
      notes: ''
    };
    let allStops = this.routeData.stops;
    const length = this.routeData.stops.length;
    allStops.splice(length - 1, 0, item);
    if (length > 2) {
      allStops[allStops.length - 1].name = this.routeData.destInfo['address'];
    } else {
      allStops[length].name = this.routeData.destInfo['address'];
    }
    this.routeData.stops = [];
    setTimeout(() => {
      this.routeData.stops = allStops;
    }, 0.5)
  }

  removeStops(i) {
    this.routeData.stops.splice(i, 1);
    setTimeout(() => {
      this.reinitMap();
    }, 0.5)
  }

  fetchRouteByID() {
    this.apiService.getData('routes/' + this.routeID).
      subscribe((result: any) => {
        result = result.Items[0];

        this.routeData['routeNo'] = result.routeNo;
        this.routeData['routeName'] = result.routeName;
        this.routeData['notes'] = result.notes;
        this.routeData['vehicleID'] = result.vehicleID;
        this.routeData['assetID'] = result.assetID;
        this.routeData['driverID'] = result.driverID;
        this.routeData['coDriverID'] = result.coDriverID;
        this.routeData['miles'] = result.miles;

        this.routeData['sourceInfo'] = {
          address: result.sourceInfo.address,
          country: result.sourceInfo.country,
          state: result.sourceInfo.state,
          city: result.sourceInfo.city,
          zipCode: result.sourceInfo.zipCode,
        };
        this.routeData.recurring = {
          route: result.recurring.route,
          type: result.recurring.type,
          date: result.recurring.date,
        }
        this.routeData.destInfo = {
          address: result.destInfo.address,
          country: result.destInfo.country,
          state: result.destInfo.state,
          city: result.destInfo.city,
          zipCode: result.destInfo.zipCode,
        };
        this.routeData.stops = result.stops;
        if (result.recurring.route === true) {
          $("#recurringRadioDiv").css('display', 'block');
          $("#recurringDate").css('display', 'block');
        }
        if (result.recurring.type == 'daily') {
          this.dailyClass = 'selRecc';
          this.weekClass = '';
          this.biClass = '';
        } else if (result.recurring.type == 'weekly') {
          this.isDaily = true;
          this.dailyClass = '';
          this.weekClass = 'selRecc';
          this.biClass = '';
        } else if (result.recurring.type == 'biweekly') {
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
          this.getCoordsEdit(result.stops);
        }
        this.mapShow()

      })
  }

  updateRoute() {
    this.hasError = false;
    this.hasSuccess = false;
    this.routeBtnStatus = true;
    if (this.routeData.recurring.route === true) {
      if (this.routeData.recurring.type == '') {
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
              // this.throwErrors();
              this.routeBtnStatus = false;
            },
            error: () => {
              this.routeBtnStatus = false;
            },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.routeBtnStatus = false;
        this.router.navigateByUrl('/dispatch/routes/list');
        this.toastr.success('Route updated successfully.');
      },
    })
  }

  selectRecurring(event) {
    $('.reccRoute').removeClass('selRecc');
    $('#' + event.target.id).closest('label').addClass('selRecc');
    if (event.target.id != 'dailyRecurringRadioBtn') {
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

  refreshDrivrData() {
    this.listService.fetchDrivers();
  }
}

