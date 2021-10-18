import { Component, OnInit } from '@angular/core';
import Constants from '../../constants';
import {environment} from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../services';
import * as _ from 'lodash';
@Component({
  selector: 'app-assets-setting',
  templateUrl: './assets-setting.component.html',
  styleUrls: ['./assets-setting.component.css']
})
export class AssetsSettingComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  suggestedAssets = [];
  assetID = '';
  assetType = null;
  assetIdentification = '';
  assetNext = false;
  assetPrev = true;
  assetDraw = 0;
  totalRecords = 10;
  pageLength = 10;
  lastEvaluatedKey = '';
  assetPrevEvauatedKeys = [''];
  assetStartPoint = 1;
  assetEndPoint = this.pageLength;
  allData = [];
  contactsObjects = [];
  getSuggestions = _.debounce(function (value) {
    value = value.toLowerCase();
    if (value !== '') {
      this.apiService
      .getData(`assets/deleted/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedAssets = result;
      });
    } else {
      this.suggestedAssets = [];
    }

  }, 800);
  constructor(private apiService: ApiService,
              private toastr: ToastrService,) { }

  ngOnInit() {
    this.fetchAssetsCount();
    this.fetchContacts();
  }
  fetchAssetsCount() {
    this.apiService.getData('assets/get/deleted/count?asset=' + this.assetIdentification + '&assetType=' + this.assetType).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
        if (this.assetID !== '' || this.assetType != null) {
          this.assetEndPoint = this.totalRecords;
        }
        this.initDataTable();
      },
    });
  }
  fetchContacts() {
    this.apiService.getData('contacts/get/list/ownerOperator').subscribe((result: any) => {
      this.contactsObjects = result;
    });
  }
  initDataTable() {
    this.apiService.getData('assets/fetch/deleted/records?asset=' + this.assetIdentification+ '&assetType=' + this.assetType + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedAssets = [];
        this.getStartandEndVal();
        result[`Items`].map((v: any) => {
          v.assetType = v.assetType.replace('_', ' ');
        });
        this.allData = result[`Items`];

        if (this.assetID !== '' || this.assetType != null) {
          this.assetStartPoint = 1;
          this.assetEndPoint = this.totalRecords;
        }

        if (result[`LastEvaluatedKey`] !== undefined) {
          const lastEvalKey = result[`LastEvaluatedKey`].assetSK.replace(/#/g, '--');
          this.assetNext = false;
          // for prev button
          if (!this.assetPrevEvauatedKeys.includes(lastEvalKey)) {
            this.assetPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKey = lastEvalKey;

        } else {
          this.assetNext = true;
          this.lastEvaluatedKey = '';
          this.assetEndPoint = this.totalRecords;
        }

        if (this.totalRecords < this.assetEndPoint) {
          this.assetEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.assetDraw > 0) {
          this.assetPrev = false;
        } else {
          this.assetPrev = true;
        }
      }, err => {
      });
  }
  getStartandEndVal() {
    this.assetStartPoint = this.assetDraw * this.pageLength + 1;
    this.assetEndPoint = this.assetStartPoint + this.pageLength - 1;
  }

  setAsset(assetID, assetIdentification) {
    this.assetIdentification = assetIdentification;
    this.assetID = assetIdentification;
    this.suggestedAssets = [];
  }
  restoreAsset(eventData) {
      if (confirm('Are you sure you want to restore?') === true) {
        this.apiService.deleteData(`assets/restore/${eventData.assetID}/${eventData.assetIdentification}`).subscribe((result: any) => {
            this.allData = [];
            this.assetDraw = 0;
            this.dataMessage = Constants.FETCHING_DATA;
            this.lastEvaluatedKey = '';
            this.fetchAssetsCount();
            this.toastr.success('Asset Restored Successfully!');
          });
      }
  }
  searchFilter() {
    if (this.assetIdentification !== '' || this.assetType !== null) {
      this.assetIdentification = this.assetIdentification.toLowerCase();
      if(this.assetID === '') {
        this.assetID = this.assetIdentification;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.allData = [];
      this.suggestedAssets = [];
      this.fetchAssetsCount();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.assetIdentification !== '' || this.assetType !== null) {
      this.assetID = '';
      this.assetIdentification = '';
      this.assetType = null;
      this.suggestedAssets = [];
      this.allData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchAssetsCount();
      this.resetCountResult();
    } else {
      return false;
    }
  }
    // next button func
    nextResults() {
      this.assetNext = true;
      this.assetPrev = true;
      this.assetDraw += 1;
      this.initDataTable();
    }

    // prev button func
    prevResults() {
      this.assetNext = true;
      this.assetPrev = true;
      this.assetDraw -= 1;
      this.lastEvaluatedKey = this.assetPrevEvauatedKeys[this.assetDraw];
      this.initDataTable();
    }

    resetCountResult() {
      this.assetStartPoint = 1;
      this.assetEndPoint = this.pageLength;
      this.assetDraw = 0;
    }
}
