import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { MapBoxService } from '../../../../../services/map-box.service';
declare var $: any;

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.css'],
})
export class EditVendorComponent implements OnInit {
  parentTitle = 'Vendors';
  title = 'Edit Vendor';
  errors = {};
  form;
  concatArrayKeys = '';

  /**
   * Form Props
   */
  vendorID = '';
  vendorName = '';
  vendorType = '';
  geoLocation = {
    latitude: '',
    longitude: '',
  };
  geofence = '';
  address = '';
  stateID = '';
  countryID = '';
  taxID = '';
  creditDays = '';
  timeCreated = '';

  countries = [];
  states = [];
  taxAccounts = [];

  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';
  constructor(
    private route: ActivatedRoute,
    private mapBoxService: MapBoxService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.vendorID = this.route.snapshot.params['vendorID'];
    this.fetchCountries();
    this.fetchAccounts();
    this.fetchVendor();
  }

  initMap() {
    if ($('#map-div').is(':visible')) {
      $('#map-div').hide('slow');
    } else {
      $('#map-div').show('slow');
    }

    //initiate map box
    this.mapBoxService.initMapbox(-104.618896, 50.44521);

    //create polygon
    this.mapBoxService.plotGeofencing(
      this.geofence,
      this.geoLocation.latitude,
      this.geoLocation.longitude
    );
  }

  fetchAccounts() {
    this.apiService
      .getData(`accounts/accountType/Tax`)
      .subscribe((result: any) => {
        this.taxAccounts = result.Items;
      });
  }

  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
    });
  }

  getStates() {
    this.apiService
      .getData(`states/country/${this.countryID}`)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  /**
   * fetch User data
   */
  fetchVendor() {
    this.apiService
      .getData(`vendors/${this.vendorID}`)
      .subscribe((result: any) => {
        result = result.Items[0];

        this.vendorName = result.vendorName;
        this.vendorType = result.vendorType;
        this.geoLocation = {
          latitude: result.geoLocation.latitude,
          longitude: result.geoLocation.longitude,
        };
        (this.geofence = result.geofence), (this.address = result.address);
        this.stateID = result.stateID;
        this.countryID = result.countryID;
        this.taxID = result.taxID;
        this.creditDays = result.creditDays;
        this.timeCreated = result.timeCreated;
      });

    setTimeout(() => {
      this.getStates();
    }, 2000);
  }

  updateVendor() {
    let data = {
      vendorID: this.vendorID,
      vendorName: this.vendorName,
      vendorType: this.vendorType,
      geoLocation: {
        latitude: this.mapBoxService.latitude,
        longitude: this.mapBoxService.longitude,
      },
      geofence: this.mapBoxService.plottedMap || [],
      address: this.address,
      stateID: this.stateID,
      countryID: this.countryID,
      taxID: this.taxID,
      creditDays: this.creditDays,
      timeCreated: this.timeCreated,
    };

    this.apiService.putData('vendors', data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
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
            },
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Vendor updated successfully';
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  concatArray(path) {
    this.concatArrayKeys = '';
    for (const i in path) {
      this.concatArrayKeys += path[i] + '.';
    }
    this.concatArrayKeys = this.concatArrayKeys.substring(
      0,
      this.concatArrayKeys.length - 1
    );
    return this.concatArrayKeys;
  }
}
