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
  markerOptions: google.maps.MarkerOptions = { draggable: false, icon: 'assets/location-pin.png' };
  markerPositions = [];


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
              time: new Date(value.timeCreated),
              speed: speedVal.toFixed(2),
              driverId: key,
              altitude: parseInt(value.altitude).toFixed(2)
            }
          });
        }
      } else {
        // console.log('No data');
      }


    })

  }

  openInfoWindow(marker: MapMarker, data) {

    this.infoDetail = this.prepareInfoTemplate(data);

    this.infoWindow.open(marker);

  }

  prepareInfoTemplate(data: any) {
    return `<div style='padding:1px'><b> Driver: ${data.userId}</b><br/>
     Speed: ${data.speed} KM/H | Altitude:$ {data.altitude} <br/> Time : ${data.time}<br/>
    <a href='#/fleet/drivers/detail/${data.driverId}' target=_blank'>  View details</a> </div>`;
  }

  valuechange() {
    this.visible = !this.visible;
  }


  // showDriverData() {
  //   const mockData = this.getDriverData();
  //   const geocoder = this.platform.getGeocodingService();
  //   this.frontEndData = mockData;

  //   mockData.drivers.forEach(async (driver) => {
  //     const result = await geocoder.reverseGeocode({
  //       prox: `${driver.location[0]},${driver.location[1]}`,
  //       mode: "retrieveAddresses",
  //       maxresults: "1",
  //     });
  //     const origin = location.origin;
  //     const customMarker = origin + "/assets/img/cirlce-stroke.png";
  //     const customIcon = new H.map.Icon(customMarker, {
  //       size: { w: 25, h: 25 },
  //     });
  //     const markers = new H.map.Marker(
  //       {
  //         lat: driver.location[0],
  //         lng: driver.location[1],
  //       },
  //       {
  //         icon: customIcon,
  //       }
  //     );
  //     // this.map.addObject(markers);
  //     // const defaultLayers = this.platform.createDefaultLayers();
  //     // const ui = H.ui.UI.createDefault(this.map, defaultLayers);
  //     markers.setData(`<h5>${driver.driverName}</h5>
  //     Load: ${driver.loadCapacity}</br>
  //     Speed: ${driver.speed}<br>
  //     Location: ${result.Response.View[0].Result[0].Location.Address.Label}
  //     `);
  //     markers.addEventListener(
  //       "tap",
  //       (evt) => {
  //         const bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
  //           // read custom data
  //           content: evt.target.getData(),
  //         });

  //         // show info bubble

  //       },
  //       false
  //     );
  //   });
  //   // this.HereMap.calculateRoute(['51.06739365305408,-114.08167471488684', '50.469846991997564,-104.61146016696867'])
  // }

  /** MOCK DATA:  This data will be from service */
  getDriverData() {
    const mockData = {
      drivers: [
        {
          driverName: "Luca Steele",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "on Time",
          dispatchId: "DIS-6140",
          loadCapacity: "1001 tonnes",
          speed: "50 mile/hr",
          location: [51.055783, -114.068639],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
        {
          driverName: "Maariya Holloway",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "on Time",
          dispatchId: "DIS-6140",
          loadCapacity: "1001 tonnes",
          speed: "50 mile/hr",
          location: [51.052058, -114.071666],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
        {
          driverName: "Regina Cole",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "on Time",
          dispatchId: "DIS-6140",
          loadCapacity: "1001 tonnes",
          speed: "50 mile/hr",
          location: [51.042866, -114.098134],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
        {
          driverName: "Luisa Leech",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "on Time",
          dispatchId: "DIS-6140",
          loadCapacity: "1001 tonnes",
          speed: "50 mile/hr",
          location: [51.04283, -114.143733],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
        {
          driverName: "Karina Kennedy",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "on Time",
          dispatchId: "DIS-6140",
          loadCapacity: "1001 tonnes",
          speed: "50 mile/hr",
          location: [50.86045, -114.036036],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
        {
          driverName: "Dru Drake",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "on Time",
          dispatchId: "DIS-6140",
          loadCapacity: "1001 tonnes",
          speed: "50 mile/hr",
          location: [50.751927, -111.897283],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
        {
          driverName: "Drain Drake",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "Late",
          dispatchId: "DIS-6140",
          loadCapacity: "1200 tonnes",
          speed: "40 mile/hr",
          location: [50.978391, -110.041988],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
      ],
    };

    return mockData;
  }



  ngAfterViewInit(): void { }


}
