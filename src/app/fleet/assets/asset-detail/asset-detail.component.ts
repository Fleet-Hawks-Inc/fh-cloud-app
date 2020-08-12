import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HereMapService } from './../../../services/here-map.service';
import {ApiService} from '../../../api.service';
import {AwsUploadService} from '../../../aws-upload.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.css']
})
export class AssetDetailComponent implements OnInit {
  image;
  public assetsImages = [];
  public assetID;
  public assetData: any;
  public deviceData: any;
  carrierID;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Set'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Actual'}
  ];
  constructor( public hereMap: HereMapService, private domSanitizer: DomSanitizer, private awsUS: AwsUploadService, private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.hereMap.mapInit(); // Initialize map
    this.assetID = this.route.snapshot.params['assetID']; // get asset Id from URL
    this.fetchAsset();
    this.fetchDeviceInfo();
  }

  /**
   * fetch Asset data
   */
  fetchAsset() {
    this.apiService
      .getData(`assets/${this.assetID}`)
      .subscribe((result: any) => {
        if (result) {
          this.assetData = result['Items'];
          console.log('assets', this.assetData[0].uploadedDocs);
          this.getImages();
        }
      }, (err) => {
        console.log('asset detail', err);
      });
  }

  fetchDeviceInfo = () => {
    this.apiService
      .getData('devices')
      .subscribe((result: any) => {
        if (result) {
          this.deviceData = result['Items'];
          console.log('devices', result);
        }
      }, (err) => {
        console.log('asset detail', err);
      });
  }

  getImages = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    for (let i = 0; i <= this.assetData.length; i++) {
     //this.awsUS.getFiles(this.carrierID, this.assetData[0].uploadedDocs[i]);
     this.image = this.domSanitizer.bypassSecurityTrustUrl(await this.awsUS.getFiles(this.carrierID, this.assetData[0].uploadedDocs[i]));
     this.assetsImages.push(this.image)
     
    }
    console.log('this.assetsImages', this.assetsImages)
  }

}
