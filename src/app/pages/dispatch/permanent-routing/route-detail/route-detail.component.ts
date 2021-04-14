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

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, 
    private spinner: NgxSpinnerService,private route: ActivatedRoute, private hereMap: HereMapService) {}

  ngOnInit() {
    this.routeID    = this.route.snapshot.params['routeID']; 
    // this.mapShow();
    this.fetchRoute();
  }

  fetchRoute(){
    this.spinner.show();
    this.apiService.getData('routes/' + this.routeID).
      subscribe(async (result: any) => {
        result = result.Items[0];
        this.routeNo   = result.routeNo;
        this.routeName = result.routeName;
        this.notes     = result.notes;

        if(result.stops != undefined){
          this.stopInformation = result.stops;

          if (result.stops.length > 1) {
            this.getCoords(result.stops);
          }
          this.mapShow();
        }

        if(result.recurring.recurringType != undefined && result.recurring.recurringType !== ''){
          this.recurringType = result.recurring.recurringType;
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

        if(result.driverUserName != '' && result.driverUserName != undefined){
          this.fetchDriver(result.driverUserName,'driver');
        }
        
        if(result.coDriverUserName != '' && result.coDriverUserName != undefined){
          this.fetchDriver(result.coDriverUserName,'codriver');
        }

        var ths = this;
        setTimeout(function(){
          ths.spinner.hide();
        },800)
        
      })
  }

  fetchAssets(assetID){
    this.apiService.getData('assets/'+assetID)
      .subscribe((result: any)=>{
        if(result.Items[0].assetIdentification != undefined){
          this.assetName = result.Items[0].assetIdentification;
        }
      })
  }

  fetchVehicle(vehicleID){
    this.apiService.getData('vehicles/'+vehicleID)
      .subscribe((result: any)=>{
        // console.log(result.Items[0]);
        if(result.Items[0].vehicleIdentification != undefined){
          this.VehicleName = result.Items[0].vehicleIdentification;
        }
      })
  }

  fetchDriver(driverUserName, type){
    this.apiService.getData('drivers/userName/'+driverUserName)
      .subscribe((result: any)=>{
        // console.log(result.Items[0]);
        if(result.Items[0].firstName != undefined){
          if(type == 'driver'){
            this.driverName = result.Items[0].firstName+' '+result.Items[0].lastName;
          } else{
            this.coDriverName = result.Items[0].firstName+' '+result.Items[0].lastName;
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
  
}
