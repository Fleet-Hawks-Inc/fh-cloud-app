import { animate, style, transition, trigger } from "@angular/animations";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { Table } from "primeng/table";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { ApiService } from "../../services";
import { OneSignal } from 'onesignal-ngx';
import { Auth } from "aws-amplify";
import { AppComponent } from './../../app.component';

declare var $: any;
declare var H: any;

@Component({
  selector: "app-map-dashboard",
  templateUrl: "./map-dashboard.component.html",
  styleUrls: ["./map-dashboard.component.css"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateX(100%)" }),
        animate("400ms", style({ transform: "translateX(0%)" })),
      ]),
      transition(":leave", [
        animate("400ms", style({ transform: "translateX(100%)" })),
      ]),
    ]),
  ],
})
export class MapDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild(GoogleMap) googleMap: GoogleMap;
  environment = environment.isFeatureEnabled;
  title = "Map Dashboard";
  visible = false;
  width = "100%";
  height = "100%";
  infoDetail = "No data";
  public searchTerm = new Subject<string>();
  public searchResults: any;
  driverData: any;
  // Google Maps
  mapOptions: google.maps.MapOptions = {
    center: { lat: 48.48248695279594, lng: -99.0688673798094 },
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    zoom: 5,
    mapId: '620eb1a41a9e36d4'

  }
  lat = -104.618896;
  lng = 50.44521;


  driverMarkerOptions: google.maps.MarkerOptions = { draggable: false, icon: '', animation: google.maps.Animation.DROP };
  assetMarkerOptions: google.maps.MarkerOptions = {

    draggable: false,
    icon: {

      url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg"><circle cx="110" cy="110" r="100" stroke="#FE904D" fill="#000000" fill-opacity="1.0" stroke-width="15" /></svg>'),
      scaledSize: new google.maps.Size(40, 40),
    },
    animation: google.maps.Animation.DROP
  };
  vehicleMarkerOptions: google.maps.MarkerOptions = {
    draggable: false,
    icon: {

      url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg"><circle cx="110" cy="110" r="100" stroke="#FFDE59" fill="#000000" fill-opacity="1.0" stroke-width="15" /></svg>'),
      scaledSize: new google.maps.Size(40, 40),
    },
    animation: google.maps.Animation.DROP
  };
  driverPositions = [];
  assetPositions = [];
  vehicleDashPositions = [];

  isControlAdded = false;
  frontEndData = {
    drivers: {},
  };


  activeTrips = [];
  constructor(
    private apiService: ApiService,
    private oneSignal: OneSignal,
    private app: AppComponent
  ) {


  }

  async ngOnInit() {
    await this.initPushNotification();
    await this.getCurrentDriverLocation();
    await this.getCurrentAssetLocation();
    await this.getVehicleLocationByDashCam();
    await this.app.getSubscriptionDetails();

  }

  private async initPushNotification() {
    const currentCarrierId = localStorage.getItem('xfhCarrierId')
    if (environment.testCarrier.includes(currentCarrierId)) {
      return;
    }
    this.oneSignal.init({
      appId: environment.oneSignalAppId,
    });
    this.oneSignal.isPushNotificationsEnabled(async (isEnabled) => {
      if (isEnabled) {
        // this console is for info do not remove it.
        this.oneSignal.setExternalUserId(localStorage.getItem('xfhCarrierId'));
        console.log("Push notifications are already enabled!");
      }
      else {

        await this.oneSignal.showHttpPrompt({
          force: true,
        });
        // await this.oneSignal.registerForPushNotifications();
        this.oneSignal.setExternalUserId(localStorage.getItem('xfhCarrierId'));
        // this console is for info do not remove it.
        console.log("Push notifications are not enabled yet.");
      }
    });
  }
  ngAfterViewInit() {

    //Add custom control on map or legends
    var controlTrashUI = document.createElement('DIV');
    controlTrashUI.style.cursor = 'pointer';

    controlTrashUI.style.marginLeft = '10px';
    controlTrashUI.style.padding = '5px';
    controlTrashUI.style.color = "black"
    controlTrashUI.innerHTML = "<img style='width:80%' src='assets/legends.png' />";
    this.googleMap.controls[google.maps.ControlPosition.LEFT_TOP].push(controlTrashUI);

  }
  /**
   * Get driver location for last 24 hours
   */
  async getCurrentDriverLocation() {

    this.apiService.getData('dashboard/drivers/getCurrentDriverLocation').subscribe((data) => {
      if (data) {
        this.driverPositions = [];
        for (const key in data) {
          const value = data[key]
          const speedVal = parseInt(value.speed) / 3.6;
          this.driverPositions.push({
            position: { lng: parseFloat(value.lng), lat: parseFloat(value.lat) },
            data: {
              userId: value.userId,
              time: `${new Date(value.timeCreated).toLocaleDateString()} | ${new Date(value.timeCreated).toLocaleTimeString()}`,
              speed: speedVal.toFixed(2),
              driverId: key,
              altitude: parseInt(value.altitude).toFixed(2),
              location: value.location
            }
          });
        }
      } else {
        // console.log('No data');
      }


    })

  }

  /**
  * Get driver location for last 24 hours
  */
  async getCurrentAssetLocation() {

    this.apiService.getData('dashboard/assets/getCurrentAssetLocation').subscribe((data) => {
      if (data) {
        this.assetPositions = [];
        for (const asset of data) {

          this.assetPositions.push({
            position: { lng: parseFloat(asset.lng), lat: parseFloat(asset.lat) },
            data: {
              assetIdentification: asset.assetIdentification,
              time: `${new Date(asset.timeModified).toLocaleDateString()} | ${new Date(asset.timeModified).toLocaleTimeString()}`,
              speed: asset.speed,
              assetID: asset.assetID,
              altitude: parseInt(asset.altitude).toFixed(2),
              battery: asset.battery,
              temp: asset.temp,
              location: asset.location
            }
          });
        }

      } else {
        // console.log('No data');
      }


    })

  }

  displayAssets = false;
  showAssets() {
    this.displayAssets = !this.displayAssets;

  }

  /**
 * Get vehicle location by dashCam
 */
  async getVehicleLocationByDashCam() {
    this.apiService.getData('dashboard/vehicle/getLocationViaDashCam').subscribe((data) => {
      if (data) {
        this.vehicleDashPositions = [];
        for (const devices of data) {
          this.vehicleDashPositions.push({
            position: { lng: parseFloat(devices.location.lng), lat: parseFloat(devices.location.lat) },
            data: {
              vehicleIdentification: devices.vehicleIdentification,
              time: `${new Date(devices.timeModified).toLocaleDateString()} | ${new Date(devices.timeModified).toLocaleTimeString()}`,
              speed: devices.location.speed || 0.00,
              vehicleID: devices.vehicleID,
              location: devices.location.label,
              deviceId: devices.deviceSerialNo.split('#')[1]
            }
          });
        }


      } else {
        // Do nothing
      }


    })

  }

  openInfoWindow(marker: MapMarker, data, infoType: string) {
    let content;
    switch (infoType) {
      case 'driver':
        this.infoDetail = this.prepareDriverInfoTemplate(data);
        break;
      case 'asset':
        this.infoDetail = this.prepareAssetInfoTemplate(data);

        break;
      case 'vehicle':

        this.infoDetail = this.prepareVehicleInfoTemplate(data);

        break;
      default:
        throw new Error('Unable to get Marker type info');

    }


    this.infoWindow.open(marker);

  }

  prepareDriverInfoTemplate(data: any) {
    return `<a href='#/fleet/drivers/detail/${data.driverId}' target=_blank'><h4> Driver: ${data.userId}</h4></a> 
    Speed: ${data.speed} KM/H | Altitude: ${data.altitude} <br/> <br/>
    Time : ${data.time} <br/><br/>
    `;
  }
  prepareAssetInfoTemplate(data: any) {
    // console.log('data', data);
    return `<b> Asset: ${data.assetIdentification}</b><br/>
    Speed: ${data.speed} | Altitude: ${data.altitude} <br/>
    Time : ${data.time}<br/> 
    Temp. : ${data.temp} | Battery : ${data.battery}
    <br/>
    <a class='link' target='_blank' href = '#/fleet/tracking/asset-tracker/${data.assetIdentification}?assetId=${data.assetID}' style='color:blue;font-size:9px'>Asset Report</a> | 
    <a href='#/fleet/assets/detail/${data.assetID}' target=_blank'>Asset Details</a>
     `;
  }

  prepareVehicleInfoTemplate(data: any) {
    return `<b>Vehicle: ${data.vehicleIdentification}</b></b><br/>
   <span> Speed: ${parseFloat(data.speed).toFixed(2)} KM/H</span><br/>   
      <a class='link' target='_blank' href = '#/fleet/tracking/vehicle-dash-cam-tracker/${data.deviceId}?vehicleId=${data.vehicleID}' style='color:blue;font-size:9px'>Realtime view</a> | 
      <a class='link' target='_blank' href ='#/fleet/vehicles/detail/${data.vehicleID}' style='color:blue;font-size:9px'>Vehicle details</a>
        `;
  }

  valuechange() {
    this.visible = !this.visible;
  }

  async refresh() {

    await this.getCurrentAssetLocation();
    await this.getVehicleLocationByDashCam();

  }

  clear(table: Table) {
    table.clear();
  }


}

