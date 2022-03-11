import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services';
import * as moment from "moment";
import { GoogleMap } from '@angular/google-maps';
import { selectRows } from '@swimlane/ngx-datatable';
import { MessageService } from 'primeng/api';
import { even } from '@rxweb/reactive-form-validators';
import { ActivatedRoute } from '@angular/router';

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
    zoom: 15,
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
  constructor(
    private apiService: ApiService,
    private message: MessageService,
    private route: ActivatedRoute
  ) {
    this.assetID = this.route.snapshot.params.assetId;
  }

  async ngOnInit(): Promise<void> {

    await this.getDeviceEventsFor24Hours(this.assetID);
    this.mapOptions.center = this.center;
    this.googleMap.googleMap.setCenter(this.center)
    console.log(this.mapOptions.center)
  }

  onRowSelect = (event) => {
    if (event && event.cords) {
      const cords = event.cords.split(",");
      this.markerPositions.push({
        lng: parseFloat(cords[0]),
        lat: parseFloat(cords[1]),
      });
      this.center = {
        lng: parseFloat(cords[0]),
        lat: parseFloat(cords[1]),
      };
      this.googleMap.googleMap.setCenter(this.center)
    } else {
      this.message.add({ severity: 'error', summary: 'Location not available', detail: 'Tracker was not able to get GPS signal.' })
    }

  }


  markerOptions: google.maps.MarkerOptions = { draggable: false, animation: google.maps.Animation.DROP };
  markerPositions: google.maps.LatLngLiteral[] = [];
  noDevices = false;
  async getDeviceEventsFor24Hours(assetIdentification: string) {
    this.loading = true;
    const data: any = await this.apiService
      .getData(`assetTrackers/getLast24HoursData/${assetIdentification}`).toPromise();
    console.log(data);
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
      const cords = data[0].cords.split(",");

      this.center = {
        lng: parseFloat(cords[0]),
        lat: parseFloat(cords[1]),
      };
      console.log(this.mapOptions)
      this.markerPositions.push({
        lng: parseFloat(cords[0]),
        lat: parseFloat(cords[1]),
      });
    } else {
      this.noDevices = true;
    }

  }
}
