import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { HereMapService } from '../../../../services/here-map.service';
declare var $: any;

@Component({
  selector: 'app-route-detail',
  templateUrl: './route-detail.component.html',
  styleUrls: ['./route-detail.component.css']
})
export class RouteDetailComponent implements OnInit {

  pageTitle = "Route detail";
  form;

  routeID   = '';
  routeNo   = '';
  routeName = '';
  notes     = '';
  stopInformation = '';
  assetName = '';
  driverName  = '';
  coDriverName = '';
  VehicleName = '';
  recurringType = '';

  sourceAddress = '';
  sourceCountryName = '';
  sourceStateName = '';
  sourceCityName = '';
  destinationAddress = '';
  destinationCountryName = '';
  destinationStateName = '';
  destinationCityName = '';

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, 
    private spinner: NgxSpinnerService,private route: ActivatedRoute, private hereMap: HereMapService) {}

  ngOnInit() {
    this.routeID    = this.route.snapshot.params['routeID']; 
    this.mapShow();
    this.fetchRoute();
  }

  fetchRoute(){
    this.spinner.show();
    this.apiService.getData('routes/' + this.routeID).
      subscribe(async (result: any) => {
        result = result.Items[0];
        console.log("route", result);
        this.routeNo   = result.routeNo;
        console.log(result);
        this.routeName = result.routeName;
        this.notes     = result.notes;

        if(result.destinationInformation.stop != undefined){
          this.stopInformation = result.destinationInformation.stop;
        }

        if(result.sourceInformation.recurring.recurringType != undefined){
          if(result.sourceInformation.recurring.recurringType == ''){
            this.recurringType = '-';
          } else{
            this.recurringType = result.sourceInformation.recurring.recurringType;
          }
        }

        if(result.sourceInformation.sourceAddress != '' && result.sourceInformation.sourceAddress != undefined){
          this.sourceAddress = result.sourceInformation.sourceAddress;
        }

        if(result.destinationInformation.destinationAddress != '' && result.destinationInformation.destinationAddress != undefined){
          this.destinationAddress = result.destinationInformation.destinationAddress;
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

        if(result.sourceInformation.sourceCountryID != '' && result.sourceInformation.sourceCountryID != undefined){
          this.fetchCountries(result.sourceInformation.sourceCountryID,'source');
        }

        if(result.sourceInformation.sourceStateID != '' && result.sourceInformation.sourceStateID != undefined){
          this.fetchStates(result.sourceInformation.sourceStateID, 'source');
        }

        if(result.sourceInformation.sourceCityID != '' && result.sourceInformation.sourceCityID != undefined){
          this.fetchCities(result.sourceInformation.sourceCityID, 'source');
        }
        //
        if(result.destinationInformation.destinationCountryID != '' && result.destinationInformation.destinationCountryID != undefined){
          this.fetchCountries(result.destinationInformation.destinationCountryID,'source');
        }

        if(result.destinationInformation.destinationStateID != '' && result.destinationInformation.destinationStateID != undefined){
          this.fetchStates(result.destinationInformation.destinationStateID, 'source');
        }

        if(result.destinationInformation.destinationCityID != '' && result.destinationInformation.destinationCityID != undefined){
          this.fetchCities(result.destinationInformation.destinationCityID, 'source');
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

  fetchCountries(countryID, type){
    this.apiService.getData('countries/'+countryID)
      .subscribe((result: any) =>{
        // console.log(result.Items[0]);
        if(result.Items[0].countryName != undefined){ 
          if(type == 'source'){
            this.sourceCountryName = result.Items[0].countryName;
          } else{
            this.destinationCountryName = result.Items[0].countryName;
          }
        }
      })
  }

  fetchStates(stateID, type){
    this.apiService.getData('states/'+stateID)
      .subscribe((result: any) =>{
        // console.log(result.Items[0]);
        if(result.Items[0].stateName != undefined){ 
          if(type == 'source'){
            this.sourceStateName = result.Items[0].stateName;
          } else{
            this.destinationStateName = result.Items[0].stateName;
          }
        }
      })
  }

  fetchCities(cityID, type){
    this.apiService.getData('cities/'+cityID)
      .subscribe((result: any) =>{
        console.log(result.Items[0]);
        if(result.Items[0].cityName != undefined){ 
          if(type == 'source'){
            this.sourceCityName = result.Items[0].cityName;
          } else{
            this.destinationCityName = result.Items[0].cityName;
          }
        }
      })
  }

  mapShow() {
    // this.mapView = true;
    // setTimeout(() => {
      this.hereMap.mapInit();
    // }, 100);
  }
  
}
