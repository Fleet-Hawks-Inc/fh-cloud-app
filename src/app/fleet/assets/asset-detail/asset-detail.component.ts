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

  // Charts
  public chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
         // ticks: {beginAtZero:true},
         display: true,
         scaleLabel: {
            display: true,
            labelString: 'Temperature (F)'
         },
         ticks: {
            min: 0,
            // max: 80,
            stepSize: 5,
            suggestedMin: 0,
            // suggestedMax: 80,
            // Include a degree sign in the ticks
            callback: (value, index, values) => {
               return value + '°F';
            }
         }
      }]
   }
  };
  public chartLabels = ['31 July 12:00', '31 July 18:00', '1 Aug 00:00', '1 Aug 06:00',
              '1 Aug 12:00', '1 Aug 18:00', '2 Aug 00:00', '2 Aug 06:00', '2 Aug 12:00', '2 Aug 18:00'];
  public chartType = 'line';
  public chartLegend = true;
  public chartData = [
    { data: [12, 15, 17, 13, 15, 12, 18, 12, 18, 13, 10, 14, 12],
      label: 'Set',
      fill: false,
      backgroundColor: '#9c9ea1',
      borderColor: '#9c9ea1',
      pointBackgroundColor: '#9c9ea1',
      borderWidth: 1,
    },
    {
      data: [10, 14, 12, 11, 14, 11, 15, 12, 16, 14, 11, 13, 14],
      label: 'Actual',
      fill: false,
      backgroundColor: '#000',
      borderColor: '#000',
      pointBackgroundColor: '#000',
      borderWidth: 1,
    }
  ];
  constructor(public hereMap: HereMapService, private domSanitizer: DomSanitizer, private awsUS: AwsUploadService,
              private apiService: ApiService, private route: ActivatedRoute) { }

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
        }
      }, (err) => {
        console.log('asset detail', err);
      });
  }

  getImages = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    for (let i = 0; i <= this.assetData.length; i++) {
      this.image = this.domSanitizer.bypassSecurityTrustUrl(await this.awsUS.getFiles(this.carrierID, this.assetData[0].uploadedDocs[i]));
      this.assetsImages.push(this.image);
    }
  }

}
