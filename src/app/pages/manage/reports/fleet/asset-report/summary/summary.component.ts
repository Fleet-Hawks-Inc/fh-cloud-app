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
  allData = [];
  assetIdentification = '';
  dataMessage: string = Constants.FETCHING_DATA;

  constructor(private apiService: ApiService) {

  }

  ngOnInit() {
    // this.fetchAssetList();
    this.fetchAssetSearch();
  }

  fetchAssetList() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.allData = result.Items;
      console.log('this.allData', this.allData)
    });
  }

  fetchAssetSearch() {
    this.apiService.getData(`assets/fetch/assetList?name=${this.assetIdentification}`).subscribe((result: any) => {
      // this.apiService.getData('assets/fetch/assetList').subscribe((result: any) => {
      console.log('this.data', result)
      this.allData = result.Items;
    });


  }
  searchAsset() {
    if (this.assetIdentification !== '') {
      this.assetIdentification = this.assetIdentification.toLowerCase();
      this.allData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchAssetSearch();
    }
    else {
      return false;
    }


  }
}

