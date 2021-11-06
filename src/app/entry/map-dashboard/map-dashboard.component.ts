import { animate, style, transition, trigger } from "@angular/animations";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MapInfoWindow, MapMarker } from "@angular/google-maps";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { ApiService } from "../../services";


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
  zoom: 3;
  lat = -104.618896;
  lng = 50.44521;
  center = { lat: 48.48248695279594, lng: -99.0688673798094 };
  markerOptions: google.maps.MarkerOptions = { draggable: false, icon: 'assets/driver-marker.png' };
  assetMarkerOptions: google.maps.MarkerOptions = { draggable: false, icon: 'assets/asset-marker.png' };
  markerPositions = [];
  assetPositions = [];


  isControlAdded = false;
  frontEndData = {
    drivers: {},
  };


  activeTrips = [];
  constructor(
    private apiService: ApiService
  ) { }

  async ngOnInit() {
    await this.getCurrentDriverLocation();
    await this.getCurrentAssetLocation();


  }

  /**
   * Get driver location for last 24 hours
   */
  async getCurrentDriverLocation() {

    this.apiService.getData('dashboard/drivers/getCurrentDriverLocation').subscribe((data) => {
      if (data) {
        this.markerPositions = [];
        for (const key in data) {
          const value = data[key]
          const speedVal = parseInt(value.speed) / 3.6;
          this.markerPositions.push({
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
        console.log(this.assetPositions)

      } else {
        // console.log('No data');
      }


    })

  }

  openInfoWindow(marker: MapMarker, data, infoType: string) {
    switch (infoType) {
      case 'driver':
        this.infoDetail = this.prepareDriverInfoTemplate(data);
        break;
      case 'asset':
        this.infoDetail = this.prepareAssetInfoTemplate(data);
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
    console.log('data', data);
    return `<a href='#/fleet/assets/detail/${data.assetID}' target=_blank'><h4> Asset: ${data.assetIdentification}</h4></a>
    Speed: ${data.speed} KM/H | Altitude: ${data.altitude} <br/> <br/>
    Time : ${data.time}<br/> <br/>
    Temp. : ${data.temp} | Battery : ${data.battery}
     `;
  }

  valuechange() {
    this.visible = !this.visible;
  }

  ngAfterViewInit(): void { }


}
