import { Component, OnInit } from '@angular/core';
import { timeStamp } from 'console';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  assetStartPoint = 1;
  assetType = null;
  assetID = '';
  allData = [];
  activeAssets = 0;
  inActiveAssets = 0;
  pageLength = 10;
  assetDraw = 0;
  assetEndPoint = this.pageLength;
  assetIdentification = '';
  dataMessage: string = Constants.FETCHING_DATA;


  constructor(private apiService: ApiService) {

  }

  ngOnInit() {
    // this.fetchAssetList();
    this.fetchAssetsCount();
  }

  fetchAssetList() {
    this.apiService.getData('assets').subscribe((result: any) => {
      // this.allData = result.Items;
      // console.log('this.allData', this.allData)

      for (let i = 0; i < result.Items; i++) {
        // console.log('count', this.allData[i])
        if (result.Items[i].currentStatus === "active") {
          this.activeAssets += 1
        }
        else {
          this.inActiveAssets += 1
        }

      }
    });
  }

  fetchAssetsCount() {
    // this.apiService.getData(`assets/fetch/assetList?name=${this.assetIdentification}` + '&assetType=' + this.assetType).subscribe((result: any) => {
    this.apiService.getData(`assets/fetch/assetList?name=${this.assetIdentification}&assetType=${this.assetType}`).subscribe((result: any) => {
      console.log('this.data', result)
      this.allData = result.Items;

      // for (let i = 0; i < this.allData.length; i++) {
      //   // console.log('count', this.allData[i])
      //   if (this.allData[i].currentStatus === "active") {
      //     this.activeAssets += 1
      //   }
      //   else {
      //     this.inActiveAssets += 1
      //   }
      // }
      result[`Items`].map((v: any) => {
        v.assetType = v.assetType.replace("_", " ")
      })
    });
  }
  searchFilter() {
    if (this.assetIdentification !== '' || this.assetType != null) {
      this.assetIdentification = this.assetIdentification.toLowerCase();
      this.allData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchAssetsCount();
    }
    else {
      return false;
    }
  }
  resetFilter() {
    if (this.assetIdentification !== '' || this.assetType !== null) {
      this.assetIdentification = '';
      this.assetType = null;
      this.allData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchAssetsCount();

    } else {
      return false;
    }
  }
}

