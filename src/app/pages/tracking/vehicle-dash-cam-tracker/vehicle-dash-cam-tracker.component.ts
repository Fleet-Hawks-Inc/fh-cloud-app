import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services';
import { DashCamLocationStreamService } from 'src/app/services/dash-cam-location-stream.service';

@Component({
  selector: 'app-vehicle-dash-cam-tracker',
  templateUrl: './vehicle-dash-cam-tracker.component.html',
  styleUrls: ['./vehicle-dash-cam-tracker.component.css'],
  providers: [MessageService]
})
export class VehicleDashCamTrackerComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  messages = [];

  destroyed$ = new Subject();
  vehicleDetails = undefined;
  vehicleId = undefined;
  width = "100%";
  height = "100%";
  isOnline = false;
  center = { lat: 48.48248695279594, lng: -99.0688673798094 };
  token = undefined;
  loaded = false;
  deviceSerial = undefined;
  deviceDetails = undefined;
  apiResponse: {
    usage: "",
    token: "",
    salt: "",
    deviceID: "",
    vehicleID: "",
    vehicleName: "",
    lastLocation: "",
    lastReportedDate: "",
    networkType: any,
    speed: any,
    errorCode: any,
    lat: 0.0,
    lng: 0.0
  };
  infoDetail = 'Vehicle is Offline!!';
  vehicleMarkerOptions: google.maps.MarkerOptions = { draggable: false, icon: 'assets/live-location-icon.png' };
  mapOptions: google.maps.MapOptions = {
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    zoom: 15,
    mapId: '620eb1a41a9e36d4',
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,

    },
    center: this.center
  };


  constructor(private route: ActivatedRoute, private webSocket: DashCamLocationStreamService, private apiService: ApiService, private toaster: ToastrService, private messageService: MessageService) {


    this.deviceSerial = this.route.snapshot.params.deviceSerial;

  }

  async ngOnInit(): Promise<void> {
    // Extract query parameters
    this.extractQueryParams();
    // get last location
    await this.getLastLocation();


    if (this.apiResponse && this.apiResponse.errorCode) {
      this.messageService.add({ severity: 'error', summary: 'Unable to connect to Vehicle. ', detail: 'Please try after some time.' });

      this.loaded = false;
      this.isOnline = false;
    }
    if (this.apiResponse) {
      this.loaded = true;
      this.mapOptions.center = { lat: this.apiResponse.lng, lng: this.apiResponse.lat };

      await this.getVehicleDetails();
      this.connectToWSServer();
      // this.updateLastLocation();
    }


  }


  private extractQueryParams() {
    this.route.queryParams
      .subscribe(params => {

        this.vehicleId = params.vehicle;
      }
      );
  }

  private async getVehicleDetails() {
    this.vehicleDetails = await this.apiService
      .getData("vehicles/" + this.vehicleId).toPromise();
  }
  private connectToWSServer() {
    this.webSocket.connect(this.apiResponse.usage, this.apiResponse.salt, this.apiResponse.token).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(message => {

      this.deviceDetails = message;
      if (message.action === '80000') {
        this.messageService.add({ severity: 'info', summary: 'Connected to server.', });
      }
      if (message.action === "80003" && message.payload.deviceID === this.deviceSerial) {

        this.isOnline = true;
        this.deviceDetails = message.payload;
        this.messages.push(message);
        console.log(this.messages);
        if (this.messages.length === 1) {
          this.messageService.add({ severity: 'success', summary: 'Vehicle is online.', });
        }
        this.center = { lat: parseFloat(message.payload.location.latitude), lng: parseFloat(message.payload.location.longitude) };
        this.mapOptions.zoom = 17;
        this.apiResponse.speed = parseFloat(message.payload.location.speed).toFixed(2) || 0.0;
        this.apiResponse.networkType = this.getNetwork(message.payload.mobile.type);
      }
    });
  }

  async getLastLocation() {
    this.apiResponse = await this.apiService.getData(`location/dashcam/get/${this.deviceSerial}`).toPromise();
  }

  async refresh() {
    await this.getLastLocation();


  }
  ngOnDestroy() {
    this.destroyed$.next();
  }
  openInfoWindow(marker: MapMarker) {
    if (this.isOnline) {
      this.infoDetail = `<b>Vehicle Name : ${this.vehicleDetails.Items[0].plateNumber}</b><br>`;
      this.infoDetail += `Device Serial/ID: ${this.deviceSerial}<br>`;
      this.infoDetail += `Device Time: ${this.deviceDetails.dtu || 'NA'}<br>`;
      if (this.apiResponse.speed) {
        this.infoDetail += `Speed : ${this.deviceDetails.location.speed || 'NA'} km/h<br>`
      }
      if (this.apiResponse.networkType) {
        this.infoDetail += `Network : ${this.apiResponse.networkType}`
      }
    } else {
      this.infoDetail = "Device is offline."
    }


    this.infoWindow.open(marker);
  }

  getNetwork(networkType: string) {

    switch (networkType) {
      case '-1':
        return 'Offline';
      case '0':
        return 'Unknown';
      case '3':
        return '2G';
      case '4':
        return '3G';
      case '5':
        return '4G';
      default:
        return undefined;

    }
  }

}
