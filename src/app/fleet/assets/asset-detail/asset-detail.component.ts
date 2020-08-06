import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HereMapService } from './../../../services/here-map.service';
import {ApiService} from '../../../api.service';
@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.css']
})
export class AssetDetailComponent implements OnInit {
  public assetID;
  public assetData: any;
  constructor(public hereMap: HereMapService,private apiService: ApiService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.hereMap.mapInit(); // Initialize map
    
    this.assetID = this.route.snapshot.params["assetID"]; // get asset Id from URL
    
    this.fetchAsset(); 
  }

   /**
   * fetch Asset data
   */
  fetchAsset() {
    this.apiService
      .getData(`assets/${this.assetID}`)
      .subscribe((result: any) => {
        if(result){
          this.assetData = result['Items'][0];
          console.log("result", this.assetData)
        }
        
      }, (err) => {
        console.log('asset detail', err);
      })
  };
  

}
