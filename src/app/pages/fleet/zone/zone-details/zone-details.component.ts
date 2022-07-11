import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";

@Component({
  selector: "app-zone-details",
  templateUrl: "./zone-details.component.html",
  styleUrls: ["./zone-details.component.css"],
})
export class ZoneDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService,
    private location: Location
  ) {}
  saveDisabled = true;
  title = "Zone Details";
  zoneID = null;
  zoneDetail: any = {};
  pRates = [
    {
      noPallets: null,
      weight: null,
      unit: null,
      currency: null,
      rate: null,
    },
  ];
  aspRates = [
    {
      name: null,
      fee: null,
      currency: null,
    },
  ];

  currencies = ["CAD", "USD"];
  wUnit = ["Ton(s)", "Kg(s)", "Lb(s)"];

  async ngOnInit() {
    this.zoneID = this.route.snapshot.params["zoneID"];
    await this.fetchZoneDetails();
    await this.initMap();
  }
  initMap() {
    if (this.zoneID && this.zoneDetail.coordinates.length > 0) {
      const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: this.zoneDetail.coordinates[0],
          mapId: "620eb1a41a9e36d4",
          zoom: 9,
        }
      );
      const newPolygon = new google.maps.Polygon({
        paths: this.zoneDetail.coordinates,
        fillColor: "#afb0b0",
        fillOpacity: 0.6,
        strokeWeight: 3,
        zIndex: 1,
      });
      newPolygon.setMap(map);
    }
  }

  async fetchZoneDetails() {
    const result = await this.apiService
      .getData("zone/" + this.zoneID)
      .toPromise();

    this.zoneDetail = result[0];
    if (result[0].pRates) {
      this.pRates = result[0].pRates;
    }
    if (result[0].aspRates) {
      this.aspRates = result[0].aspRates;
    }
  }
  addPallet(index) {
    if (!this.pRates[0].noPallets) {
      this.toastr.error("Pallet can not be empty");
      return;
    } else {
      if (this.pRates[index].noPallets != "") {
        this.saveDisabled = false;
        this.pRates.push({
          noPallets: null,
          weight: null,
          rate: null,
          currency: null,
          unit: null,
        });
      } else {
        this.toastr.error(" Pallet can not be empty.");
        return false;
      }
    }
  }
  addAspRate(index) {
    if (!this.aspRates[0].name) {
      this.toastr.error("Fee Name is required");
      return;
    } else {
      if (this.aspRates[index].name != "") {
        this.saveDisabled = false;
        this.aspRates.push({
          name: null,
          fee: null,
          currency: null,
        });
      } else {
        this.toastr.error(" Associrial Fees can not be empty.");
        return false;
      }
    }
  }
  deleteAspRate(t) {
    this.saveDisabled = false;
    this.aspRates.splice(t, 1);
  }

  deletePallet(t) {
    this.saveDisabled = false;
    this.pRates.splice(t, 1);
  }
  updateZone() {
    let pRates = this.pRates.filter((value) => value.noPallets);
    let aspRates = this.aspRates.filter((value) => value.name);
    const priceList = {
      pRates: pRates,
      aspRates: aspRates,
    };
    this.apiService.putData(`zone/price/${this.zoneID}`, priceList).subscribe({
      complete: () => {},
      error: (err) => {
        this.saveDisabled = false;
      },
      next: (res) => {
        this.toastr.success("Prices update Successfully");
        this.location.back();
      },
    });
  }
  cancel() {
    this.location.back();
  }
}
