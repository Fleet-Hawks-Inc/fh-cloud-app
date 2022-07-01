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
  zoneDetail = {};
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

  ngOnInit(): void {
    this.zoneID = this.route.snapshot.params["zoneID"];
    this.fetchZoneDetails();
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
