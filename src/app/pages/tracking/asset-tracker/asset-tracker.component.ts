import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import * as moment from "moment";
import { MessageService, PrimeNGConfig } from 'primeng/api';
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
    zoom: 5,
    mapId: '620eb1a41a9e36d4',
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,

    },
    center: this.center
  };
  assetID;
  locationData = [];
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
  pathCoordinates = [];
  durations = [
    { name: '6 Hours', value: '6h' },
    { name: '12 Hours', value: '12h' },
    { name: '24 Hours', value: '24h' },
    { name: '48 Hours', value: '48h' },
    { name: '72 Hours', value: '72h' },
  ]
  selectedDuration = undefined;
  showTraffic = false;
  vertices: google.maps.LatLng[];
  bounds = new google.maps.LatLngBounds();

  assetId: any;

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
    private primengConfig: PrimeNGConfig
  ) {
    this.assetID = this.route.snapshot.params.assetId;
    this.markerPositions = new Array<markerPosition>();
  }


  /**
   * Angular OnInit()
   */
  async ngOnInit(): Promise<void> {
    this.primengConfig.ripple = true;
    // Extract query parameters
    this.extractQueryParams();
    // await this.fetchAsset();
    await this.getDeviceEventsForDuration(this.selectedDuration);
    this.mapOptions.center = this.center;
    // this.googleMap.googleMap.setCenter(this.center);


    this.polylineOptions = new google.maps.Polyline({
      strokeColor: 'green',
      path: this.vertices
    })




  }

  private extractQueryParams() {
    this.route.queryParams
      .subscribe(params => {

        this.assetId = params.assetId;
      }
      );
  }

  showTrafficLayer() {
    this.showTraffic = !this.showTraffic;
  }

  /**
   * update map data with selected duration
   */
  async updateData() {

    await this.getDeviceEventsForDuration(this.selectedDuration.value);

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

      //  this.googleMap.googleMap.setCenter(this.center)

      this.zoomIn(16);
      this.googleMap.googleMap.panTo(curPosition)


    } else {
      this.message.add({ severity: 'error', summary: 'Location not available', detail: 'Tracker was not able to get GPS signal.' })
    }

  }
  zoomIncrement = 1;
  zoomFactor = 2.0; // 2.0 - 0.1 (Slower (rough animation), Faster
  zoomIn(endZoom: number) {
    if (this.googleMap.googleMap.getZoom() < endZoom) {
      this.googleMap.googleMap.setZoom(this.googleMap.googleMap.getZoom() + this.zoomIncrement);
      setTimeout(() => { this.zoomIn(endZoom); }, this.zoomFactor * 100);
    }
  }

  zoomDecrement = 1;
  zoomOut(endZoom: number) {
    if (this.googleMap.googleMap.getZoom() > endZoom) {
      this.googleMap.googleMap.setZoom(this.googleMap.googleMap.getZoom() - this.zoomDecrement);
      setTimeout(() => { this.zoomOut(endZoom); }, this.zoomFactor * 100);
    }
  }



  /**
   * Get Device location for duration
   * @param assetIdentification 
   */
  async getDeviceEventsForDuration(duration = '6h') {
    this.loading = true;
    const data: any = await this.apiService
      .getData(`assetTrackers/getLocationData/${this.assetID}/${duration}`).toPromise();


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

      data.forEach(path => {
        const cords = path.cords.split(",");
        this.pathCoordinates.push({
          lng: parseFloat(cords[0]),
          lat: parseFloat(cords[1]),
        });
      });

      this.drawPath(data);
    } else {
      this.noDevices = true;

      this.message.add({ severity: 'error', summary: 'Location data not available for selected duration', detail: 'Please change the duration and try again.' });
      this.loading = false;

    }

  }


  /**
   * draw path using polyline
   * @param results 
   */
  drawPath(results: any[]) {
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

        const latLng = new google.maps.LatLng(parseFloat(cords[1]),
          parseFloat(cords[0]));
        this.vertices.push(latLng);


        this.bounds.extend(latLng);
      }


      this.polylineOptions = new google.maps.Polyline({
        strokeColor: 'green',
        path: this.vertices
      });
      // if (this.googleMap) {
      //   this.googleMap.googleMap.fitBounds(this.bounds);
      //   this.googleMap.googleMap.setCenter(this.bounds.getCenter());
      // }
    } catch (err) {
      console.error('Error', err);
    }
  }


  /**
   * create all markers from the map.
   */
  clearRoutes() {

    if (this.googleMap.googleMap.getZoom() > 4) {
      this.zoomOut(4);
    }
    this.markerPositions = [];

  }



  /**
   * fetch Asset data
   */
  async fetchAsset() {

    this.apiService.getData(`assets/${this.assetId}`).subscribe(
      async (res: any) => {
        if (res) {
          let result = res.Items[0];
          console.log(res.Items[0]);
        }

      },
      (err) => { }
    );
  }





}


/**
 * Marker Interface
 */
interface markerPosition {
  location: google.maps.LatLng;
  data: any;
}