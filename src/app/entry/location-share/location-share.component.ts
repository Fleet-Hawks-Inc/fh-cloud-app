import { Component, OnInit, ViewChild } from "@angular/core";
import { MapInfoWindow, MapMarker } from "@angular/google-maps";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiService } from "src/app/services";
import { DashCamLocationStreamService } from "src/app/services/dash-cam-location-stream.service";

@Component({
  selector: "app-location-share",
  templateUrl: "./location-share.component.html",
  styleUrls: ["./location-share.component.css"],
})
export class LocationShareComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  lat = -104.618896;
  lng = 50.44521;
  width = "100%";
  height = "100%";
  zoom = 17;
  center = { lat: 48.48248695279594, lng: -99.0688673798094 };
  token = undefined;
  loaded = false;

  apiResponse: {
    usage: "";
    token: "";
    salt: "";
    deviceID: "";
    vehicleID: "";
    vehicleName: "";
    lastLocation: "";
    lastReportedDate: "";
    networkType: any;
    speed: any;
    errorCode: any;
    lat: number;
    lng: number;
  };

  infoDetail = "Vehicle is Offline!!";
  vehicleMarkerOptions: google.maps.MarkerOptions = {
    draggable: false,
    icon: "assets/vehicle-marker.png",
  };
  mapOptions: google.maps.MapOptions = {
    center: this.center,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoom: 15,
    mapId: "620eb1a41a9e36d4",
    rotateControl: true,
    clickableIcons: true,
  };

  overlays: Array<google.maps.Marker>;

  constructor(
    private route: ActivatedRoute,
    private webSocket: DashCamLocationStreamService,
    private apiService: ApiService,
    private toaster: ToastrService
  ) {
    this.token = this.route.snapshot.params.token;
  }
  // this.overlays.push(position)

  messages = [];
  destroyed$ = new Subject();

  async ngOnInit(): Promise<void> {
    // google.maps.geometry.spherical.computeHeading - for rotation of icon
    this.apiResponse = await this.validateAndGetLocation();
    if (this.apiResponse && this.apiResponse.errorCode) {
      this.toaster.error("This link has expired.");
      this.loaded = false;
    }
    if (this.apiResponse) {
      this.loaded = true;
      this.center = { lat: this.apiResponse.lng, lng: this.apiResponse.lat };
      this.connectToWSServer();
      this.updateLastLocation();
    }
  }

  private connectToWSServer() {
    this.webSocket
      .connect(
        this.apiResponse.usage,
        this.apiResponse.salt,
        this.apiResponse.token
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((messages) => {
        if (messages.action === "80000") {
          this.toaster.success("Successfully Connected to Server..");
        }
        if (
          messages.action === "80003" &&
          messages.payload.deviceID === this.apiResponse.deviceID
        ) {
          this.messages.push(messages);
          if (this.messages.length === 1) {
            this.toaster.success("Vehicle is online...");
          }
          this.center = {
            lat: parseFloat(messages.payload.location.latitude),
            lng: parseFloat(messages.payload.location.longitude),
          };
          this.apiResponse.speed =
            parseFloat(messages.payload.location.speed).toFixed(2) || 0.0;
          this.apiResponse.networkType = this.getNetwork(
            messages.payload.mobile.type
          );
        }
      });
  }

  updateLastLocation() {
    setInterval(async () => {
      const response = await this.validateAndGetLocation();
      if (this.apiResponse && this.apiResponse.errorCode) {
        this.toaster.error("This link has expired.");
      }
      if (response) {
        this.apiResponse.lastLocation = response.lastLocation;
      }
    }, 60000);
  }

  async validateAndGetLocation() {
    return await this.apiService
      .getData(`location/share/get/${this.token}`)
      .toPromise();
  }

  ngOnDestroy() {}
  openInfoWindow(marker: MapMarker) {
    this.infoDetail = `<b>Vehicle Name : ${this.apiResponse.vehicleName}</b><br>`;
    if (this.apiResponse.speed) {
      this.infoDetail += `<b>Speed : ${this.apiResponse.speed} km/h</b><br>`;
    }
    if (this.apiResponse.networkType) {
      this.infoDetail += `<b>Network : ${this.apiResponse.networkType}</b>`;
    }

    this.infoWindow.open(marker);
  }

  getNetwork(networkType: string) {
    switch (networkType) {
      case "-1":
        return "Offline";
      case "0":
        return "Unknown";
      case "3":
        return "2G";
      case "4":
        return "3G";
      case "5":
        return "4G";
      default:
        return undefined;
    }
  }
}
