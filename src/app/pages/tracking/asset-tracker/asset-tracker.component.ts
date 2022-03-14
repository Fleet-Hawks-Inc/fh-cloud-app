import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapDirectionsService, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import * as moment from "moment";
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services';

interface location {
  battery;
  location;
  speed;
  temprature;
  time;
}
@Component({
  selector: 'app-asset-tracker',
  templateUrl: './asset-tracker.component.html',
  styleUrls: ['./asset-tracker.component.css'],
  providers: [MessageService]
})
export class AssetTrackerComponent implements OnInit {
  @ViewChild(GoogleMap) googleMap: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  options: any;
  width = "100%";
  height = "700px";
  selectedRow;
  cols = [
    { field: 'battery', header: 'Battery' },
    { field: 'location', header: 'Location' },
    { field: 'speed', header: 'Speed' },
    { field: 'temperature', header: 'Tracker Temp.' },
    { field: 'time', header: 'Time' }
  ];
  center = { lat: 48.48248695279594, lng: -99.0688673798094 };
  mapOptions: google.maps.MapOptions = {
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    zoom: 4,
    mapId: '620eb1a41a9e36d4',
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,

    },
    center: this.center
  };
  assetID;
  locationData;
  loading = false;;
  value: Date;

  polylineOptions: google.maps.Polyline;
  lineSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    strokeColor: "#393",
  };

  startMarkerOptions: google.maps.MarkerOptions = { draggable: false, animation: google.maps.Animation.DROP, title: 'A', label: 'A' };
  endMarkerOptions: google.maps.MarkerOptions = { draggable: false, animation: google.maps.Animation.DROP, title: 'B', label: 'B' };
  markerOptions: google.maps.MarkerOptions = { draggable: false, animation: google.maps.Animation.DROP };
  markerPositions: markerPosition[];
  startMarker: google.maps.LatLngLiteral;
  endMarker: google.maps.LatLngLiteral;
  noDevices = false;
  infoDetail: string;

  /**
   * Constructor
   * @param apiService 
   * @param message 
   * @param route 
   */
  constructor(
    private apiService: ApiService,
    private message: MessageService,
    private route: ActivatedRoute,
  ) {
    this.assetID = this.route.snapshot.params.assetId;
    this.markerPositions = new Array<markerPosition>();
  }


  /**
   * Angular OnInit()
   */
  async ngOnInit(): Promise<void> {

    await this.getDeviceEventsFor24Hours(this.assetID);
    this.mapOptions.center = this.center;
    // this.googleMap.googleMap.setCenter(this.center);


    this.polylineOptions = new google.maps.Polyline({
      strokeColor: 'green',
      icons: [
        {
          icon: this.lineSymbol,
          offset: "100%",
        },
      ],
      path: this.vertices
    })

    this.animate();
    this.googleMap.googleMap.fitBounds(this.bounds);



  }


  /**
   * Open Marker Window
   * @param marker 
   * @param data 
   */
  openInfoWindow(marker: MapMarker, data) {
    this.infoDetail = `${data.location} <br/>${data.speed} <br/> ${data.temperature}`;
    this.infoWindow.open(marker);
  }

  /**
   * Triggers when location icon is clicked on table
   * @param event 
   */
  onRowSelect = (event) => {
    if (event && event.cords) {
      const cords = event.cords.split(",");
      const curPosition: google.maps.LatLng = new google.maps.LatLng({
        lng: parseFloat(cords[0]),
        lat: parseFloat(cords[1]),
      })

      this.markerPositions.push({ data: event, location: curPosition });
      this.center = {
        lng: parseFloat(cords[0]),
        lat: parseFloat(cords[1]),
      };
      console.log(event);

      //  this.googleMap.googleMap.setCenter(this.center)
      // this.googleMap.googleMap.setZoom(17);
      this.googleMap.googleMap.panTo(curPosition)

    } else {
      this.message.add({ severity: 'error', summary: 'Location not available', detail: 'Tracker was not able to get GPS signal.' })
    }

  }



  /**
   * Get Device location for duration
   * @param assetIdentification 
   */
  async getDeviceEventsFor24Hours(assetIdentification: string) {
    this.loading = true;
    const data: any = await this.apiService
      .getData(`assetTrackers/getLast24HoursData/${assetIdentification}/48h`).toPromise();

    if (data && data.length > 0) {
      for (const item of data) {
        const stillUtc = moment.utc(item.time).toDate();
        const localTime = moment(stillUtc)
          .local()
          .format("YYYY-MM-DD HH:mm:ss");
        item.time = localTime;
      }
      this.locationData = data;
      this.loading = false;
      const startCords = data[data.length - 1].cords.split(",");
      const endCords = data[0].cords.split(",");

      this.center = {
        lng: parseFloat(startCords[0]),
        lat: parseFloat(startCords[1]),
      };

      this.startMarker = {
        lng: parseFloat(startCords[0]),
        lat: parseFloat(startCords[1]),
      };
      this.endMarker = {
        lng: parseFloat(endCords[0]),
        lat: parseFloat(endCords[1]),
      };

      this.drawWayPoints(data);
    } else {
      this.noDevices = true;

      this.message.add({ severity: 'error', summary: 'Location data not available for selected duration', detail: 'Please change the duration and try again.' })
    }

  }

  vertices: google.maps.LatLng[];
  bounds = new google.maps.LatLngBounds();
  drawWayPoints(results: any[]) {
    try {
      this.vertices = new Array<any>();
      let cords = results[0].cords.split(",");
      let cords1 = results[results.length - 1].cords.split(",");

      const endCords = {
        lat: parseFloat(cords1[1]),
        lng: parseFloat(cords1[0]),
      }
      cords = results[0].cords.split(",");
      const startCords = {
        lat: parseFloat(cords[1]),
        lng: parseFloat(cords[0]),
      }
      for (let way of results) {
        const cords = way.cords.split(",");

        const myLatLng = new google.maps.LatLng(parseFloat(cords[1]),
          parseFloat(cords[0]));
        this.vertices.push(myLatLng);


        this.bounds.extend(myLatLng);
      }


      // const request: google.maps.DirectionsRequest = {
      //   destination: endCords,
      //   origin: startCords,
      //   travelMode: google.maps.TravelMode.DRIVING
      // };
      // this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));

    } catch (err) {
      console.error('erro1', err);
    }
  }


  animate() {
    try {

      let count = 0;
      setInterval(() => {
        console.log('Interval', count);
        count = (count + 1) % 200;
        const icons = this.polylineOptions.get("icons");
        icons[0].offset = count / 2 + "%";
        this.polylineOptions.setOptions({})
      }, 200)
    } catch (err) {
      console.error('err', err);
    }
  }

}


interface markerPosition {
  location: google.maps.LatLng;
  data: any;
}