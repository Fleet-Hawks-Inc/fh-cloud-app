import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: "app-asset-list",
  templateUrl: "./asset-list.component.html",
  styleUrls: ["./asset-list.component.css"],
})
export class AssetListComponent implements OnInit {
  title = "Assets List";
  assets;

  selectedAssets;
  

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchAssets();
  }

  fetchAssets() {
    this.apiService.getData("assets").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log("res",result);
        this.assets = result.Items;
      },
    });
  }

  deleteAsset(assetId) {
     /******** Clear DataTable ************/
     if ($.fn.DataTable.isDataTable("#datatable-default")) {
      $("#datatable-default").DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData("assets/" + assetId).subscribe((result: any) => {
      this.fetchAssets();
    });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}
