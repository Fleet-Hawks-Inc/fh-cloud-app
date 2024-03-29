import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services/here-map.service';
import * as moment from "moment";
declare var $: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  constructor(private apiService: ApiService,
    private toastr: ToastrService, private spinner: NgxSpinnerService, private hereMap: HereMapService) { }

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
      tripID: '',
      driverIDs: [],
      vehicleIDs :[],
      assetIDs: [],
      loc: ''
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
    OrderIDs = [];
    allCustomers = [];
    tempIndex:any = '';

  ngOnInit() {
    this.mapShow();
    this.fetchAllTrips();
    this.fetchTrips();
    // this.fetchCustomers();
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
  }

  fetchAllTrips() {
    let backgroundColor = '';
    let borderColor = '';
    this.apiService.getData('trips')
      .subscribe((result: any) => {
        result.Items.map((i) => { 
          if(i.tripStatus == 'confirmed') {
            backgroundColor = '#005ce6';
            borderColor = '#005ce6';
          } else if(i.tripStatus == 'delivered') {
            backgroundColor = '#29a329';
            borderColor = '#29a329';
          } else if(i.tripStatus == 'dispatched') {
            backgroundColor = '#0099ff';
            borderColor = '#0099ff';
          }
          let eventObj = {
            title: '#' + i.tripNo + '\n Status: '+ i.tripStatus,
            date:  moment(i.dateCreated,'YYYY-MM-DD').format('YYYY-MM-DD'),
            backgroundColor: backgroundColor,
            borderColor: borderColor
          };
          this.events.push(eventObj);
        });
      })
  }

  mapShow() {
    this.hereMap.mapSetAPI();
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
        this.codrivers = result.Items;
      })
  }

  fetchCoDriver(driverID) {
    this.codrivers = this.drivers.filter(function (obj) {
      if (obj.driverID !== driverID) {
          return obj;
      }
    });
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
        this.tempTextFieldValues.driverID = '';
      } else {
        $(".codriverClass").removeClass('td_border');
        this.tempTextFieldValues.coDriverName = '';
        this.tempTextFieldValues.coDriverUsername = '';
        this.assetDataCoDriverUsername = '';
        this.tempTextFieldValues.coDriverID = '';
      }
    } else {
      if (type === 'driver') {
        // alert('here')
        await this.spinner.show();
        this.assetDataCoDriverUsername = ''; //reset the codriver selected
        this.fetchCoDriver($event.driverID);
        this.tempTextFieldValues.driverName = $event.fullName;
        this.tempTextFieldValues.driverUsername = $event.userName;
        this.assetDataCoDriverUsername = '';
        this.tempTextFieldValues.driverID = $event.driverID;
        if (eventType === 'click') {
          this.assetDataDriverUsername = $event.userName;
        }
        $(".driverClass").removeClass('td_border');
        $("#drivr_" + $event.driverID).addClass('td_border');

        await this.spinner.hide();

      } else if (type === 'codriver') {
        this.tempTextFieldValues.coDriverName = $event.fullName;
        this.tempTextFieldValues.coDriverUsername = $event.userName;
        this.tempTextFieldValues.coDriverID = $event.driverID;
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
        this.tempTextFieldValues.trailer = [];

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

  async saveAssetModalData() {
    let selectedDriverids = [];
    let selectedVehicles = [];
    let selectedAssets = [];
    if(this.tempTextFieldValues.coDriverUsername != '' || this.tempTextFieldValues.driverUsername != '' || 
      this.tempTextFieldValues.vehicleID != '' || this.tempTextFieldValues.trailer.length != 0) {
      let planData = this.tripData.tripPlanning;

      selectedDriverids.push(this.tempTextFieldValues.coDriverID);
      selectedDriverids.push(this.tempTextFieldValues.driverID);

      if(this.tempTextFieldValues.vehicleID != '' && this.tempTextFieldValues.vehicleID != undefined) {
        if(!selectedVehicles.includes(this.tempTextFieldValues.vehicleID)) {
            selectedVehicles.push(this.tempTextFieldValues.vehicleID);
          }
      }
      
      for (let i = 0; i < planData.length; i++) {
        this.tripData.tripPlanning[i].coDriverID = this.tempTextFieldValues.coDriverID;
        this.tripData.tripPlanning[i].driverID = this.tempTextFieldValues.driverID;
        this.tripData.tripPlanning[i].codriverUsername = this.tempTextFieldValues.coDriverUsername;
        this.tripData.tripPlanning[i].driverUsername = this.tempTextFieldValues.driverUsername;
        this.tripData.tripPlanning[i].vehicleID = this.tempTextFieldValues.vehicleID;

        this.tripData.tripPlanning[i].assetID = [];
        for (let j = 0; j < this.tempTextFieldValues.trailer.length; j++) {
          const element2 = this.tempTextFieldValues.trailer[j];
          this.tripData.tripPlanning[i].assetID.push(element2.id);

          if(element2.id != '' && element2.id != undefined) {
            if(!selectedAssets.includes(element2.id)) {
              selectedAssets.push(element2.id);
            }
          }
        }
      }
      this.tripData.driverIDs = await selectedDriverids;
      this.tripData.vehicleIDs = await selectedVehicles;
      this.tripData.assetIDs = await selectedAssets;
      this.tripData.tripStatus = 'dispatched';

      this.tempTrips[this.tempIndex].tripStatus = 'dispatched';
      this.apiService.putData('trips', this.tripData).subscribe({
        complete: () => {
        },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
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
          this.response = res;
          $('#assetModal').modal('hide');
          this.tempIndex = '';
          this.toastr.success('Assignment done successfully');
        },
      });
    } else {
      $("#assetModal").modal('hide');
      return false;
    }
  }

  showAssignModal(tripID, index) {
    this.tempIndex = index;
    this.emptyAssetModalFields();
    
    this.spinner.show();
    this.OrderIDs = [];
    this.apiService.getData('trips/' + tripID).
      subscribe((result: any) => {
        result = result.Items[0];
        // delete result.timeCreated;
        delete result.timeModified;
        delete result.tripSK;
        delete result.isDelActiveSK;
        this.tripData = result;
        this.OrderIDs = this.tripData['orderId'];

        if(this.tripData.tripPlanning.length === 0) { 
          this.toastr.error('The trip plan for the selected trip is empty. Please create one to assign.');
          this.spinner.hide();
          return false;
        }

        if(this.tripData.tripStatus === 'pending' || this.tripData.tripStatus === 'confirmed') {
          $("#assetModal").modal('show');
          this.spinner.hide();
        } else {
          this.toastr.error('Assignment is already done. Please refer edit trip to change the previous assignment');
          this.spinner.hide();
        }
      })
  }

  fetchTrips() {
    this.spinner.show();

    const tripResponse = this.apiService.getData('trips/status/confirmed');
    const orderResponse = this.apiService.getData('orders');
    const observables = forkJoin([tripResponse, orderResponse]).subscribe(value => {
      this.orderTripValues(value);
      this.spinner.hide();
    });
  }

  async orderTripValues(val) {
    let fetchedTrip = val[0];
    let fetchedOrder = val[1];

    for (let i = 0; i < fetchedTrip.Items.length; i++) {
      let element = fetchedTrip.Items[i];
      if (element.isDeleted == 0) {
        let tripDate = element.dateCreated;
        if(tripDate != '' && tripDate != undefined) {
          tripDate = moment(tripDate,'YYYY-MM-DD').format('DD-MM-YYYY')
        }
        let tripObj = {
          pickupLocation: '',
          deliveryLocation: '',
          tripID: element.tripID,
          tripNo: element.tripNo,
          tripStatus: element.tripStatus,
          date: tripDate,
          time: '-',
          tripPlan: element.tripPlanning,
          orders: element.orderId,
          customersArr: []
        }

        for (let k = 0; k < element.orderId.length; k++) {
          const element1 = element.orderId[k];

          fetchedOrder.Items.filter(function (obj) {
            if (obj.orderID == element1) {
              let cusObj = {
                customerId : obj.customerID,
                name: '',
                icon: ''
              }
              tripObj.customersArr.push(cusObj);

              //for unique customer-id in array 
              tripObj.customersArr = [...new Map(tripObj.customersArr.map(item =>[item['customerId'], item])).values()];
            }
          });
        }
        this.tempTrips.push(tripObj);
      }
    }
    await this.fetchCustomers();
    await this.getTripsData(this.tempTrips);
    
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  getTripsData(tempTrips) {
    for (let i = 0; i < tempTrips.length; i++) {
      const element = tempTrips[i];
      let pickup;
      let drop;

      if (element.tripPlan.length > 0) {
        pickup = element.tripPlan[0].location;
        element.pickupLocation = pickup;
        element.time = element.tripPlan[0].pickupTime;

        if (element.tripPlan.length >= 2) {
          let lastloc = element.tripPlan.length - 1
          drop = element.tripPlan[lastloc].location;
          element.deliveryLocation = drop;
        }
      }
    }
  }

  
  /*
    * Get all customers
   */
  fetchCustomers() {
    this.apiService.getData('customers/get/all').subscribe((result: any) => {
      this.allCustomers = result.Items;
      this.assignCompanyName();
    });
  }

  assignCompanyName() {
    for (let p = 0; p < this.tempTrips.length; p++) {
      const element = this.tempTrips[p];
      if(element.customersArr.length > 0) {
        for (let w = 0; w < element.customersArr.length; w++) {
          const elementp = element.customersArr[w];

          this.allCustomers.map(function (obj) {
            if (obj.customerID == elementp.customerId) {
              elementp.name = obj.companyName;

              let custName = obj.companyName.split(' ');
              if(custName[0] != undefined) {
                elementp.icon = custName[0].charAt(0).toUpperCase();
              }

              if(custName[1] != undefined) {
                elementp.icon += custName[1].charAt(0).toUpperCase();
              }
            }
          });
        }
      }
    }
  }

}