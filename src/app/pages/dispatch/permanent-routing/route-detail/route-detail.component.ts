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
          this.sourceNotes = result.stops[0].notes;
          for (let k = 0; k < result.stops.length; k++) {
            this.stopNumber.push(k);
          }

          if (result.stops.length > 1) {
            this.destinationNotes = result.stops[result.stops.length-1].notes;
            this.getCoords(result.stops);
          }
        }

        if(result.recurring.route) {
          if(result.recurring.type != undefined && result.recurring.type !== ''){
            this.recurringType = result.recurring.type;
          }
  
          if(result.recurring.date != undefined && result.recurring.date !== ''){
            this.recurringDate = result.recurring.date;
          }
        }

        if(result.sourceInfo.address != '' && result.sourceInfo.address != undefined){
          this.sourceAddress = result.sourceInfo.address;
          this.sourceCountryName = result.sourceInfo.country;
          this.sourceStateName = result.sourceInfo.state;
          this.sourceCityName = result.sourceInfo.city;
          this.sourceZipcode = result.sourceInfo.zipCode;
        }

        if(result.destInfo.address != '' && result.destInfo.address != undefined){
          this.destinationAddress = result.destInfo.address;
          this.destinationCountryName = result.destInfo.country;
          this.destinationStateName = result.destInfo.state;
          this.destinationCityName = result.destInfo.city;
          this.destinationZipcode = result.destInfo.zipCode;
        }

        if(result.assetID != '' && result.assetID != undefined){
          this.fetchAssets(result.assetID);
        }

        if(result.vehicleID != '' && result.vehicleID != undefined){
          this.fetchVehicle(result.vehicleID);
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
        if(result.Items.length> 0){
          this.assetName = result.Items[0].assetIdentification;
        }
      })
  }

  fetchVehicle(vehicleID){
    this.apiService.getData('vehicles/'+vehicleID)
      .subscribe((result: any)=>{
        if(result.Items.length > 0){
          this.VehicleName = result.Items[0].vehicleIdentification;
        }
      })
  }

  fetchDriver(driverID, type){
    this.apiService.getData('drivers/'+driverID)
      .subscribe((result: any)=>{
        if(result.Items.length > 0){
          if(type == 'driver'){
            this.driverName = result.Items[0].firstName +' ' +result.Items[0].lastName;
          } else{
            this.coDriverName = result.Items[0].firstName +' ' +result.Items[0].lastName;
          }
        }
      })
  }

  
  mapShow() {
    this.hereMap.mapSetAPI();
    this.hereMap.mapInit();
  }

  /**
   * pass trips coords to show on the map
   * @param data
   */
  async getCoords(data) {
    this.mapShow();
    this.newCoords = [];

    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      this.newCoords.push(`${element.lat},${element.lng}`)
    }
    this.hereMap.calculateRoute(this.newCoords);
  }

  openDetailModal(data){
    this.modalData = data;
    $('#routeNotes').modal('show');
  }
  
}
