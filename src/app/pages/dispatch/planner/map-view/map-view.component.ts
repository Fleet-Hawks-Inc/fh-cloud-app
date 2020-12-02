import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services/here-map.service';
declare var $: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  constructor(private apiService: ApiService, private awsUS: AwsUploadService, private route: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private hereMap: HereMapService) { }

    vehicles = [];
    assets = [];
    drivers = [];
    codrivers = [];
    errors: {};
    tempTrips = [];
    trips = [];
    events = [];
    tripData = {
      tripPlanning: [],
      tripStatus: '',
      tripID: ''
    };
    response: any = '';
    form;
    
    tempTextFieldValues: any = {
      tripID: '',
      trailer: []
    };
  
    assetDataVehicleID = '';
    assetDataDriverUsername = '';
    assetDataCoDriverUsername = '';
    informationAsset = [];

  ngOnInit() {
    this.mapShow();
    this.fetchTrips();
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
  }

  mapShow() {
      this.hereMap.mapInit();
  }

  emptyAssetModalFields() {
    // empty the values of asset modal and temp_text_fields after adding
    this.tempTextFieldValues.vehicleName = '';
    this.tempTextFieldValues.vehicleID = '';
    this.tempTextFieldValues.trailer = [];
    this.tempTextFieldValues.driverName = '';
    this.tempTextFieldValues.driverUsername = '';
    this.tempTextFieldValues.coDriverName = '';
    this.tempTextFieldValues.coDriverUsername = '';
    this.tempTextFieldValues.trailerName = '';

    this.assetDataVehicleID = '';
    this.informationAsset = [];
    this.assetDataDriverUsername = '';
    this.assetDataCoDriverUsername = '';
    $(".vehicleClass").removeClass('td_border');
    $(".assetClass").removeClass('td_border');
    $(".driverClass").removeClass('td_border');
    $(".codriverClass").removeClass('td_border');
  }

  fetchVehicles() {
    this.apiService.getData('vehicles')
      .subscribe((result: any) => {
        this.vehicles = result.Items;
      })
  }

  fetchAssets() {
    this.apiService.getData('assets')
      .subscribe((result: any) => {
        this.assets = result.Items;
      })
  }

  fetchDrivers() {
    this.apiService.getData('drivers')
      .subscribe((result: any) => {
        result.Items.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
        this.drivers = result.Items;
        console.log('this.drivers');
        console.log(this.drivers);
        this.codrivers = result.Items;
      })
  }

  fetchCoDriver(driverID) {
    this.apiService.getData('drivers')
      .subscribe((result: any) => {
        this.assetDataCoDriverUsername = ''; //reset the codriver selected
        let newDrivers = [];
        let allDrivers = result.Items.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
        for (let i = 0; i < allDrivers.length; i++) {
          const element = allDrivers[i];
          if (element.driverID !== driverID) {
            newDrivers.push(element);
          }
        }
        this.codrivers = newDrivers;
      })
  }

  vehicleChange($event, type) {
    if ($event === undefined) {
      $(".vehicleClass").removeClass('td_border');
      this.tempTextFieldValues.vehicleName = '';
      this.tempTextFieldValues.vehicleID = '';
      this.assetDataVehicleID = '';
    } else {
      if (type === 'click') {
        this.assetDataVehicleID = $event.vehicleID;
      }
      this.tempTextFieldValues.vehicleName = $event.vehicleIdentification;
      this.tempTextFieldValues.vehicleID = $event.vehicleID;
      $(".vehicleClass").removeClass('td_border');
      $("#veh_" + $event.vehicleID).addClass('td_border');
    }
  }

  async driverChange($event, type, eventType) {
    if ($event === undefined) {
      if (type === 'driver') {
        $(".driverClass").removeClass('td_border');
        this.tempTextFieldValues.driverName = '';
        this.tempTextFieldValues.driverUsername = '';
        this.assetDataDriverUsername = '';
      } else {
        $(".codriverClass").removeClass('td_border');
        this.tempTextFieldValues.coDriverName = '';
        this.tempTextFieldValues.coDriverUsername = '';
        this.assetDataCoDriverUsername = '';
      }
    } else {
      if (type === 'driver') {
        // alert('here')
        await this.spinner.show();
        this.assetDataCoDriverUsername = ''; //reset the codriver selected
        await this.fetchCoDriver($event.driverID);
        this.tempTextFieldValues.driverName = $event.fullName;
        this.tempTextFieldValues.driverUsername = $event.userName;
        this.assetDataCoDriverUsername = '';
        if (eventType === 'click') {
          this.assetDataDriverUsername = $event.userName;
        }
        $(".driverClass").removeClass('td_border');
        $("#drivr_" + $event.driverID).addClass('td_border');

        await this.spinner.hide();

      } else if (type === 'codriver') {
        this.tempTextFieldValues.coDriverName = $event.fullName;
        this.tempTextFieldValues.coDriverUsername = $event.userName;
        if (eventType === 'click') {
          this.assetDataCoDriverUsername = $event.userName;
        }
        $(".codriverClass").removeClass('td_border');
        $("#codrivr_" + $event.driverID).addClass('td_border');
      }
    }
  }

  assetsChange($event, type) {
    if ($event === undefined) {
      $(".assetClass").removeClass('td_border');
    } else {
      if (type === 'change') {
        console.log('asset change $event');
        this.tempTextFieldValues.trailer = [];
        console.log(this.informationAsset);

        $(".assetClass").removeClass('td_border');
        let arayy = [];
        for (let i = 0; i < $event.length; i++) {
          const element = $event[i];

          $("#asset_" + element.assetID).addClass('td_border');
          arayy.push(element.assetID);
          let objj = {
            id: element.assetID,
            name: element.assetIdentification
          }
          this.tempTextFieldValues.trailer.push(objj);
        }
      } else {
        let arayy = [];
        $("#asset_" + $event.assetID).addClass('td_border');
        let objj = {
          id: $event.assetID,
          name: $event.assetIdentification
        }
        this.tempTextFieldValues.trailer.push(objj);
        for (let i = 0; i < this.tempTextFieldValues.trailer.length; i++) {
          const element = this.tempTextFieldValues.trailer[i];
          arayy.push(element.id);
        }
        this.informationAsset = arayy;
      }
      let trailerNames = this.tempTextFieldValues.trailer.map(function (v) { return v.name; });
      trailerNames = trailerNames.join();
      this.tempTextFieldValues.trailerName = trailerNames;
    }
  }

  saveAssetModalData() {

    if(this.tempTextFieldValues.coDriverUsername === '' || this.tempTextFieldValues.driverUsername === '' || 
      this.tempTextFieldValues.vehicleID === '' || this.tempTextFieldValues.trailer.length === 0) {

        this.toastr.error('Please select all the assignment values');
        return false;
    }

    let planData = this.tripData.tripPlanning;
    
    for (let i = 0; i < planData.length; i++) {
      this.tripData.tripPlanning[i].codriverUsername = this.tempTextFieldValues.coDriverUsername;
      this.tripData.tripPlanning[i].driverUsername = this.tempTextFieldValues.driverUsername;
      this.tripData.tripPlanning[i].vehicleID = this.tempTextFieldValues.vehicleID;

      this.tripData.tripPlanning[i].assetID = [];
      for (let j = 0; j < this.tempTextFieldValues.trailer.length; j++) {
        const element2 = this.tempTextFieldValues.trailer[j];
        this.tripData.tripPlanning[i].assetID.push(element2.id)
      }
    }

    this.apiService.putData('trips', this.tripData).subscribe({
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
        this.updateTripStatus(this.tripData.tripID)
      },
    });
  }

  showAssignModal(tripID) {
    this.emptyAssetModalFields();
    // let tripAssgn = '0';

    this.spinner.show();
    this.apiService.getData('trips/' + tripID).
      subscribe((result: any) => {
        result = result.Items[0];
        delete result.timeCreated;
        delete result.timeModified;
        this.tripData = result;

        if(this.tripData.tripPlanning.length === 0) { 
          this.toastr.error('Trip plan for selected trip is empty. Please create one to assign');
          this.spinner.hide();
          return false;
        }

        if(this.tripData.tripStatus === 'pending' || this.tripData.tripStatus === 'planned') {
          $("#assetModal").modal('show');
          console.log(this.tripData)
          this.spinner.hide();
        } else {
          this.toastr.error('Assignment is already done. Please refer edit trip to change the previous assignment');
          this.spinner.hide();
        }
      })
  }

  fetchTrips() {
    this.spinner.show();
    this.apiService.getData('trips').subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.spinner.hide();
        // console.log(result);
        // let eventArr = [];
        for (let i = 0; i < result.Items.length; i++) {
          let element = result.Items[i];
          //if (result.Items[i].isDeleted == '0' && result.Items[i].tripStatus == 'pending') {
          if (element.isDeleted == '0') {
            this.trips.push(element);

            let tripObj = {
              assetID: '1',
              assetName: 'Imperial trucking Co.',
              assetShortName: "IT",
              pickupLocation: '',
              pickupCity: '',
              pickupState: '',
              pickupCountry: '',
              deliveryLocation: '',
              deliveryCountry: '',
              deliveryState: '',
              deliveryCity: '',
              tripID: element.tripID,
              tripNo: element.tripNo,
              date: '-',
              time: '-',
              tripPlan: element.tripPlanning,
            }
            this.tempTrips.push(tripObj);
          }
        }
        this.getTripsData(this.tempTrips);
      }
    })
  }

  throwErrors() {
    // console.log(this.errors);
    this.form.showErrors(this.errors);
  }

  getTripsData(tempTrips) {
    for (let i = 0; i < tempTrips.length; i++) {
      const element = tempTrips[i];
      let pickup;
      let drop;

      if (element.tripPlan.length > 0) {
        pickup = element.tripPlan[0].location;
        this.fetchCountryName(pickup.countryID, i, 'pickup');
        this.fetchStateDetail(pickup.stateID, i, 'pickup');
        this.fetchCityDetail(pickup.cityID, i, 'pickup');
        element.pickupLocation = pickup.address1 + ', ' + pickup.address2 + ', ' + pickup.zipcode;
        element.date = element.tripPlan[0].date;
        element.time = element.tripPlan[0].time;

        //calendar data
        let eventObj = {
          title: '#' + element.tripNo,
          date: element.date
        };
        this.events.push(eventObj);


        if (element.tripPlan.length >= 2) {
          let lastloc = element.tripPlan.length - 1
          drop = element.tripPlan[lastloc].location;
          this.fetchCountryName(drop.countryID, i, 'drop');
          this.fetchStateDetail(drop.stateID, i, 'drop');
          this.fetchCityDetail(drop.cityID, i, 'drop');
          element.deliveryLocation = drop.address1 + ', ' + drop.address2 + ', ' + drop.zipcode;
        }
      }
    }
  }

  fetchCountryName(countryID, index, type) {
    this.apiService.getData('countries/' + countryID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].countryName != undefined) {
          if (type === 'pickup') {
            this.tempTrips[index].pickupCountry = result.Items[0].countryName;
          } else {
            this.tempTrips[index].deliveryCountry = result.Items[0].countryName;
          }
        }
      })
  }

  fetchStateDetail(stateID, index, type) {
    this.apiService.getData('states/' + stateID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].stateName != undefined) {
          if (type === 'pickup') {
            this.tempTrips[index].pickupState = result.Items[0].stateName;
          } else {
            this.tempTrips[index].deliveryState = result.Items[0].stateName;
          }
        }
      })
  }

  fetchCityDetail(cityID, index, type) {
    this.apiService.getData('cities/' + cityID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].cityName != undefined) {
          if (type === 'pickup') {
            this.tempTrips[index].pickupCity = result.Items[0].cityName;
          } else {
            this.tempTrips[index].deliveryCity = result.Items[0].cityName;
          }
        }
      })
  }

  updateTripStatus(tripId) {
    this.apiService.getData('trips/update-status/'+tripId+'/dispatched').subscribe({
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
        this.spinner.hide();
        this.response = res;
        $('#assetModal').modal('hide');
        this.toastr.success('Assignment done successfully');
      },
    });
  }
}