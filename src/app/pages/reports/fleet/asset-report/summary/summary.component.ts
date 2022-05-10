import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import { environment } from '../../../../../../environments/environment';
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import * as _ from 'lodash';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  assetType = null;
  assetID = '';
  allData = [];
  assetsCount = {
    total: '',
    active: '',
    inactive: '',
  };
  assetIdentification = '';
  dataMessage: string = Constants.FETCHING_DATA;
  lastItemSK = '';
  lastEvaluatedKey = ''
  loaded = false;
  data = [];

  suggestedAssets = [];
  constructor(private apiService: ApiService, private toastr: ToastrService) {

  }
  ngOnInit() {
    this.fetchAssetCount();
    this.fetchAssetsList();
  }

  fetchAssetCount() {
    this.apiService.getData('assets/fetch/assetCount').subscribe((result: any) => {
      this.assetsCount = result;
    })
  }

  onScroll() {
    if (this.loaded) {
      this.fetchAssetsList();
    }
    this.loaded = false;
  }

  getSuggestions = _.debounce(function (value) {
    value = value.toLowerCase();
    if (value != '') {
      this.apiService
        .getData(`assets/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestedAssets = result;
        });
    } else {
      this.suggestedAssets = [];
    }
  }, 800)

  setAsset(assetID, assetIdentification) {
    this.assetIdentification = assetIdentification;
    this.assetID = assetIdentification;
    this.suggestedAssets = [];
  }

  fetchAssetsList() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`assets/fetch/assetReport?asset=${this.assetIdentification}&assetType=${this.assetType}&lastKey=${this.lastItemSK}`).subscribe((result: any) => {
        this.dataMessage = Constants.FETCHING_DATA;
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
        }
        this.suggestedAssets = [];
        if (result.Items.length > 0) {

          if (result.LastEvaluatedKey !== undefined) {
            this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].assetSK);
          }
          else {
            this.lastItemSK = 'end';
          }
         this.allData = this.allData.concat(result.Items);
        /*
          result[`Items`].map((v: any) => {
            v.assetType = v.assetType.replace("_", " ")
            this.allData.push(v)
          });
          */
          this.loaded = true;
        }
      });
    }
  }
  searchFilter() {
    if (this.assetIdentification !== '' || this.assetType != null) {
      this.assetIdentification = this.assetIdentification.toLowerCase();
      if (this.assetID == '') {
        this.assetID = this.assetIdentification;
      }
      this.lastItemSK = '';
      this.suggestedAssets = [];
      this.allData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchAssetsList();
    }
    else {
      return false;
    }
  }
  resetFilter() {
    if (this.assetIdentification !== '' || this.assetType !== null) {
      this.assetIdentification = '';
      this.lastItemSK = '';
      this.assetType = null;
      this.suggestedAssets = [];
      this.allData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchAssetsList();
    } else {
      return false;
    }
  }
  fetchExportfullList() {
    this.apiService.getData('assets/fetch/assetList').subscribe((result: any) => {
      this.data = result.Items;
      this.generateCSV();
    })

  }

  csv() {
    if (this.assetIdentification !== '' || this.assetType != null) {
      this.data = this.allData
      this.generateCSV();
    }
    else {
      this.fetchExportfullList()
    }
  }

  generateCSV() {
    if (this.data.length > 0) {
      let dataObject = []
      let csvArray = []
      this.data.forEach(element => {
        let obj = {}
        obj["Asset Name/Number"] = element.assetIdentification
        obj["VIN"] = element.VIN
        obj["Asset Type"] = element.assetType
        obj["Make"] = element.assetDetails.manufacturer
        obj["License Plate Number"] = element.assetDetails.licencePlateNumber
        obj["Status"] = element.currentStatus
        dataObject.push(obj)
      });
      let headers = Object.keys(dataObject[0]).join(',')
      headers += ' \n'
      csvArray.push(headers)
      dataObject.forEach(element => {
        let obj = Object.values(element).join(',')
        obj += ' \n'
        csvArray.push(obj)
      });
      const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Asset-Report.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    else {
      this.toastr.error("No Records found")
    }
  }
}