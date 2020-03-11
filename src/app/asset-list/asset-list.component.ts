import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css']
})
export class AssetListComponent implements OnInit {
    title = 'Assets List';
    assets;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
      this.fetchAssets();
  }

  fetchAssets() {
    this.apiService.getData('assets')
        .subscribe((result: any) => {
          this.assets = result.Items;
        });
  }



  deleteAsset(assetId) {
    this.apiService.deleteData('assets/' + assetId)
        .subscribe((result: any) => {
          this.fetchAssets();
        })
  }
}
