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
  lastEvaluatedKey = '';
  loaded = false;
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
    this.initDataTable();
    this.fetchContacts();
  }
  fetchContacts() {
    this.apiService.getData('contacts/get/list/ownerOperator').subscribe((result: any) => {
      this.contactsObjects = result;
    });
  }

      async initDataTable() {
        if (this.lastEvaluatedKey !== 'end') {
            const result = await this.apiService.getData('assets/fetch/deleted/records?asset=' + this.assetIdentification+ '&assetType=' + this.assetType + '&lastKey=' + this.lastEvaluatedKey).toPromise();
            if (result.Items.length === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND
            }
            this.suggestedAssets = [];
          result['Items'].map((v: any) => {
              v.assetType = v.assetType.replace('_', ' ');
                });
            if (result.Items.length > 0) {
                if (result.LastEvaluatedKey !== undefined) {
                    this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].assetSK);
                }
                else {
                    this.lastEvaluatedKey = 'end'
                }
                this.allData = this.allData.concat(result.Items);
                this.loaded = true;
            }
        }
    }
    onScroll() {
        if (this.loaded) {
            this.initDataTable();
        }
        this.loaded = false;
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
            this.dataMessage = Constants.FETCHING_DATA;
            this.lastEvaluatedKey = '';
            this.initDataTable();
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
      this.lastEvaluatedKey = '';
      this.suggestedAssets = [];
      this.initDataTable();
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
      this.lastEvaluatedKey = '';
      this.dataMessage = Constants.FETCHING_DATA;
      this.initDataTable();
    } else {
      return false;
    }
  }
}
