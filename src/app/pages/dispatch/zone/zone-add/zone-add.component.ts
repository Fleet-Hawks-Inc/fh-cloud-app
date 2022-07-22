import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
declare var $;
@Component({
  selector: "app-zone-add",
  templateUrl: "./zone-add.component.html",
  styleUrls: ["./zone-add.component.css"],
})
export class ZoneAddComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  public zone = {
    zName: null,
    zDesc: null,
    coordinates: null,
    pRates: null,
    aspRates: null,
  };
  zoneID: any = null;

  public saveDisabled = false;
  map = null;
  newPolygon = null;
  poly = null;

  async ngOnInit() {
    this.zoneID = this.route.snapshot.params["zoneID"];
    if (this.zoneID) {
      await this.fetchZoneDetails();
    }
    await this.initMap();
  }

  async fetchZoneDetails() {
    const result = await this.apiService
      .getData("zone/" + this.zoneID)
      .toPromise();
    this.zone.zName = result[0].zName;
    this.zone.zDesc = result[0].zDesc;
    this.zone.coordinates = result[0].coordinates;
    this.zone.pRates = result[0].pRates;
    this.zone.aspRates = result[0].aspRates;
  }

  initMap() {
    this.map = null;
    if (this.zoneID && this.zone.coordinates.length > 0) {
      this.map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: this.zone.coordinates[0],
          mapId: "620eb1a41a9e36d4",
          zoom: 9,
        }
      );
    } else {
      this.map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: { lat: 52.9183784, lng: -108.4769625 },
          mapId: "620eb1a41a9e36d4",
          zoom: 8,
        }
      );
    }
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      circleOptions: {
        fillColor: "#ffff00",
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    });
    drawingManager.setMap(this.map);
    const coordinates = [];
    google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      function (polygon) {
        $.each(polygon.overlay.getPath().getArray(), async (key, latlng) => {
          let coords = { lat: "", lng: "" };
          coords.lat = latlng.lat();
          coords.lng = latlng.lng();
          coordinates.push(coords);
        });
        localStorage.setItem("zCords", JSON.stringify(coordinates));
      }
    );

    const input = document.getElementById("searchInput") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    if (this.zoneID) {
      const button = document.getElementById("clearMap") as HTMLButtonElement;
      this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(button);
    }

    // Bias the SearchBox results towards current map's viewport.
    this.map.addListener("bounds_changed", () => {
      searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });

    let markers: google.maps.Marker[] = [];

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          return;
        }

        const icon = {
          url: place.icon as string,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map: this.map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });
    if (this.zone.coordinates.length > 0) {
      this.newPolygon = new google.maps.Polygon({
        paths: this.zone.coordinates,
        fillColor: "#afb0b0",
        fillOpacity: 0.6,
        strokeWeight: 3,
        zIndex: 1,
      });
      this.newPolygon.setMap(this.map);
    }
  }

  cancel() {
    this.location.back();
  }
  clear() {
    if (this.newPolygon) {
      this.newPolygon.setMap(null);
    } else {
      this.poly.setMap(null);
    }
  }
  async saveZone() {
    this.saveDisabled = true;
    const coordinates = localStorage.getItem("zCords");
    if (coordinates) {
      this.zone.coordinates = JSON.parse(coordinates);
    }
    localStorage.removeItem("zCords");
    if (!this.zone.zName) {
      this.toastr.error("Zone Name is Required");
      return;
    }
    const pRates = [
      {
        noPallets: null,
        weight: null,
        rate: null,
        currency: null,
        unit: null,
      },
    ];
    const aspRates = [
      {
        name: null,
        fee: null,
        currency: null,
      },
    ];
    const zoneData = {
      zName: this.zone.zName,
      zDesc: this.zone.zDesc,
      coordinates: this.zone.coordinates,
      pRates: pRates,
      aspRates: aspRates,
    };
    this.apiService.postData("zone", zoneData).subscribe({
      complete: () => {},
      error: (err) => {
        this.saveDisabled = false;
      },
      next: (res) => {
        this.toastr.success("Zone added successfully");
        this.location.back();
      },
    });
  }
  async updateZone() {
    this.saveDisabled = true;
    const coordinates = localStorage.getItem("zCords");
    if (coordinates) {
      this.zone.coordinates = JSON.parse(coordinates);
    }
    localStorage.removeItem("zCords");
    if (!this.zone.zName) {
      this.toastr.error("Zone Name is Required");
      return;
    }
    const zoneData = {
      zName: this.zone.zName,
      zDesc: this.zone.zDesc,
      coordinates: this.zone.coordinates,
      pRates: this.zone.pRates,
      aspRates: this.zone.aspRates,
      id: this.zoneID,
    };
    this.apiService.putData("zone", zoneData).subscribe({
      complete: () => {},
      error: (err) => {
        this.saveDisabled = false;
      },
      next: (res) => {
        this.toastr.success("Zone Updated successfully");
        this.location.back();
      },
    });
  }
}
