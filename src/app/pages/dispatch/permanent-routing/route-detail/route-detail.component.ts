import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services/here-map.service';
declare var $: any;

@Component({
  selector: 'app-route-detail',
  templateUrl: './route-detail.component.html',
  styleUrls: ['./route-detail.component.css']
})
export class RouteDetailComponent implements OnInit {

  pageTitle = "Route Detail";
  form;

  routeID   = '';
  routeNo   = '';
  routeName = '';
  notes     = '';
  stopInformation = [];
  assetName = '-';
  driverName  = '-';
  coDriverName = '-';
  VehicleName = '-';
  recurringType = '-';
  miles = '-';

  sourceAddress = '';
  sourceCountryName = '';
  sourceStateName = '';
  sourceCityName = '';
  sourceZipcode = '';
  destinationAddress = '';
  destinationCountryName = '';
  destinationStateName = '';
  destinationCityName = '';
  destinationZipcode = '';
  newCoords = [];
  stopNumber = [];
  recurringDate = '';
  modalData = '';
  sourceNotes = '';
  destinationNotes = '';

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, 
    private spinner: NgxSpinnerService,private route: ActivatedRoute, private hereMap: HereMapService) {}

  ngOnInit() {
    this.routeID    = this.route.snapshot.params['routeID']; 
    this.fetchRoute();
  }

  fetchRoute(){
    this.apiService.getData('routes/' + this.routeID).
      subscribe(async (result: any) => {
        result = result.Items[0];
        this.routeNo   = result.routeNo;
        this.routeName = result.routeName;
        this.notes     = result.notes;
        this.miles = result.miles;

        if(result.stops != undefined){
          this.stopInformation = result.stops;
          this.sourceNotes = result.stops[0].stopNotes;
          for (let k = 0; k < result.stops.length; k++) {
            this.stopNumber.push(k);
          }

          if (result.stops.length > 1) {
            this.destinationNotes = result.stops[result.stops.length-1].stopNotes;
            this.getCoords(result.stops);
          }
          this.mapShow();
        }

        if(result.recurring.recurringRoute) {
          if(result.recurring.recurringType != undefined && result.recurring.recurringType !== ''){
            this.recurringType = result.recurring.recurringType;
          }
  
          if(result.recurring.recurringDate != undefined && result.recurring.recurringDate !== ''){
            this.recurringDate = result.recurring.recurringDate;
          }
        }

        if(result.sourceInformation.sourceAddress != '' && result.sourceInformation.sourceAddress != undefined){
          this.sourceAddress = result.sourceInformation.sourceAddress;
          this.sourceCountryName = result.sourceInformation.sourceCountry;
          this.sourceStateName = result.sourceInformation.sourceState;
          this.sourceCityName = result.sourceInformation.sourceCity;
          this.sourceZipcode = result.sourceInformation.sourceZipCode;
        }

        if(result.destinationInformation.destinationAddress != '' && result.destinationInformation.destinationAddress != undefined){
          this.destinationAddress = result.destinationInformation.destinationAddress;
          this.sourceCountryName = result.destinationInformation.destinationCountry;
          this.sourceStateName = result.destinationInformation.destinationState;
          this.sourceCityName = result.destinationInformation.destinationCity;
          this.destinationZipcode = result.destinationInformation.destinationZipCode;
        }

        if(result.AssetID != '' && result.AssetID != undefined){
          this.fetchAssets(result.AssetID);
        }

        if(result.VehicleID != '' && result.VehicleID != undefined){
          this.fetchVehicle(result.VehicleID);
        }

        if(result.driverID != '' && result.driverID != undefined){
          this.fetchDriver(result.driverID,'driver');
        }
        
        if(result.coDriverID != '' && result.coDriverID != undefined){
          this.fetchDriver(result.coDriverID,'codriver');
        }
      })
  }

  fetchAssets(assetID){
    this.apiService.getData('assets/'+assetID)
      .subscribe((result: any)=>{
        if(result.Items> 0){
          this.assetName = result.Items[0].assetIdentification;
        }
      })
  }

  fetchVehicle(vehicleID){
    this.apiService.getData('vehicles/'+vehicleID)
      .subscribe((result: any)=>{
        if(result.Items > 0){
          this.VehicleName = result.Items[0].vehicleIdentification;
        }
      })
  }

  fetchDriver(driverID, type){
    this.apiService.getData('drivers/'+driverID)
      .subscribe((result: any)=>{
        if(result.Items > 0){
          if(type == 'driver'){
            this.driverName = result.Items[0].firstName +' ' +result.Items[0].lastName;
          } else{
            this.coDriverName = result.Items[0].firstName +' ' +result.Items[0].lastName;
          }
        }
      })
  }

  
  mapShow() {
    this.hereMap.mapInit();
  }

  /**
   * pass trips coords to show on the map
   * @param data
   */
  async getCoords(data) {
    this.spinner.show();
    await Promise.all(data.map(async item => {
      let result = await this.hereMap.geoCode(item.stopName);
      this.newCoords.push(`${result.items[0].position.lat},${result.items[0].position.lng}`)
    }));
    this.hereMap.calculateRoute(this.newCoords);
    this.spinner.hide();
    this.newCoords = [];
  }

  openDetailModal(data){
    this.modalData = data;
    $('#routeNotes').modal('show');
  }
  
}
