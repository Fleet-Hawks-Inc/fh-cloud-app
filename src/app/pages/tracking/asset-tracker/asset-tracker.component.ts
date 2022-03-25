import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';

import * as moment from "moment";
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ApiService } from 'src/app/services';
import { EChartsOption } from 'echarts';

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
  height = "500px";
  selectedRow;
  cols = [

    { field: 'battery', header: 'Battery' },
    { field: 'location', header: 'Location' },
    { field: 'speed', header: 'Speed' },
    { field: 'temperature', header: 'Tracker Temp.' },
    { field: 'time', header: 'Time' }

  ];
  sensorDataCols = [
    { field: 'assetName', header: 'Asset Name' },
    { field: 'temperature', header: 'Temperature(Celsius)' },
    { field: 'humidity', header: 'Humidity' },
    { field: 'time', header: 'Date & Time' },
  ]
  sensorData = [];
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
  chartOption: EChartsOption;
  updateOptions: any;
  sensorLoading = false;
  sensorTemperature = [];

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
    { name: '7 Days', value: '168h' },
    { name: '15 Days', value: '360h' },
    { name: '1 Month', value: '744h' },
  ]
  selectedDuration = undefined;
  selectedSensorDuration = undefined;
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
    private primengConfig: PrimeNGConfig,

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

    await this.getSensorData(this.selectedSensorDuration.value || this.selectedSensorDuration.value);

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
  async updateAssetData() {

    await this.getDeviceEventsForDuration(this.selectedDuration.value);
  }

  /**
   * Gets Sensor data
   */
  async updateSensorData() {
    await this.getSensorData(this.selectedSensorDuration.value);
  }

  /**
   * Refresh Data
   */
  async refreshData() {

    await this.getDeviceEventsForDuration(this.selectedDuration.value);
    await this.getSensorData(this.selectedSensorDuration.value);
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
        }

      },
      (err) => { }
    );
  }

  /**
   * Gets Sensor data from Cloud Service
   * @param duration selected duration from dropdown
   */
  async getSensorData(duration = '6h') {

    this.sensorLoading = true;
    const data: sensorData[] = await this.apiService
      .getData(`assetTrackers/getSensorData/${this.assetID}/bleTemp/${duration}`).toPromise();

    if (data && data.length > 0) {
      this.sensorTemperature = [];
      for (const res of data) {
        const time = new Date(res.time).toLocaleString();

        this.sensorTemperature.push({ name: time, value: res.graphTemp });

        // format time

        const updateRes = {
          assetName: this.assetID,
          time: time,
          temperature: res.temperature,
          humidity: res.humidity
        }
        this.sensorData.push(updateRes);


      }

      this.sensorLoading = false;
      this.mapper();
    } else {
      this.sensorLoading = false;
    }

  }


  /**
   * Maps the charts with data and configures rendering options.
   */

  mapper() {


    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        },
      },
      title: {
        left: 'center',
        text: 'Asset Temperature'
      },
      toolbox: {
        feature: {
          dataZoom: {

            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {},
        }
      },

      // dataZoom: [
      //   {
      //     type: 'inside',
      //     start: 0,
      //     end: 50
      //   },
      //   {
      //     start: 0,
      //     end: 50
      //   }
      // ],
      xAxis: {
        type: 'time',
        boundaryGap: false

      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        axisLabel: {
          formatter: '{value} °C'
        }
      },

      series: [
        {
          name: 'Temperature',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          areaStyle: {},
          data: this.sensorTemperature,
        },

      ]
    };

  }


}


/**
 * Marker Interface
 */
interface markerPosition {
  location: google.maps.LatLng;
  data: any;
}


interface sensorData {

  messageType: string
  time: number;
  temperature: number;
  humidity: number;
  light: string;
  battery: number; // expressed in percentage
  graphHumidity: any;
  graphTemp: any


}