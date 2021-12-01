import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../../services';
import { HttpClient } from '@angular/common/http';
import Constants from 'src/app/pages/fleet/constants';
import { environment } from '../../../../../../environments/environment';
import { OnboardDefaultService } from '../../../../../services/onboard-default.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  allAssetTypes: any;
  assetTypesObjects: any = {};
  title = 'Assets List';
  mapView = false;
  listView = true;
  visible = true;
  allData = [];
  autoCarrier = [];
  beverageRack = [];
  flatbed = [];
  controlledTemp = [];
  gondola = [];
  hopper = [];
  horseTrailer = [];
  liveStock = [];
  lowboy = [];
  stake = [];
  stepDeck = [];
  tanker = [];
  checked = false;
  isChecked = false;
  headCheckbox = false;
  selectedAssetID: any;
  assetCheckCount = null;

  allOptions: any = {};
  reeferOptions: any = {};
  dryboxOptions: any = {};
  flatbedOptions: any = {};
  curtainOptions: any = {};
  closeResult = '';

  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';

  hideShow = {
    vin: true,
    assetName: true,
    type: true,
    plateNo: true,
    lastLocation: true,
    year: true,
    make: true,
    model: false,
    ownership: true,
    currentStatus: true,
    group: false,
    aceID: false,
    aciID: false,
    gvwr: false,
    gawr: false,
    companyName: true,
    safetyDate: true
  }

  message: any;
  groupsList: any = {};

  suggestedAssets = [];
  assetID = '';
  assetType = null;
  assetIdentification = '';
  assetTypeList: any = {};
  totalRecords = 10;
  pageLength = 10;
  lastEvaluatedKey = '';
  manufacturersObjects: any = {};
  modelsObjects: any = {};

  assetNext = false;
  assetPrev = true;
  assetDraw = 0;
  assetPrevEvauatedKeys = [''];
  assetStartPoint = 1;
  assetEndPoint = this.pageLength;
  contactsObjects = [];
  loaded = false;
  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private hereMap: HereMapService,
    private onboard: OnboardDefaultService) { }

  ngOnInit(): void {
    this.onboard.checkInspectionForms();
    this.fetchAssetsCount();
    this.fetchGroups();
    this.fetchContacts();

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

  fetchGroups() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groupsList = result;
    });
  }


  fetchContacts() {
    this.apiService.getData('contacts/get/list/ownerOperator').subscribe((result: any) => {
      this.contactsObjects = result;
    });
  }

  someClickHandler(info: any): void {
    this.message = info.id + ' - ' + info.firstName;
  }

  fetchAssetsCount() {
    this.apiService.getData('assets/get/count?asset=' + this.assetIdentification + '&assetType=' + this.assetType).subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.totalRecords = result.Count;
        if (this.assetID !== '' || this.assetType != null) {
          this.assetEndPoint = this.totalRecords;
        }
        this.initDataTable();
      },
    });
  }


  deleteAsset(eventData) {
    ;
    // }
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService.deleteData(`assets/delete/${eventData.assetID}/${eventData.assetIdentification}`).subscribe((result: any) => {
        this.allData = [];
        this.assetDraw = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        this.fetchAssetsCount();
        this.toastr.success('Asset Deleted Successfully!');
      });
    }

  }
  mapShow() {
    this.mapView = true;
    this.listView = false;
    setTimeout(() => {
      this.hereMap.mapInit();
    }, 500);
  }

  valuechange() {
    this.visible = !this.visible;
  }
  onScroll() {
    if (this.loaded) {
      this.initDataTable();
    }
    this.loaded = false;
  }
  async initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      const result = await this.apiService.getData('assets/fetch/records?asset=' + this.assetIdentification + '&assetType=' + this.assetType + '&lastKey=' + this.lastEvaluatedKey).toPromise();
      if (result.Items.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
      this.suggestedAssets = [];

      result[`Items`].map((v: any) => {
        v.url = `/reports/fleet/asset/activity/${v.assetID}`;
        v.assetType = v.assetType.replace("_", " ")
      })

      if (result.Items.length > 0) {
        if (result.LastEvaluatedKey !== undefined) {
          this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].assetSK);
        }
        else {
          this.lastEvaluatedKey = 'end';
        }
        this.allData = this.allData.concat(result.Items)
        this.loaded = true;
      }

      if (result.LastEvaluatedKey == undefined) {
        this.lastEvaluatedKey = 'end';

      }

    }
  }
  searchFilter() {
    if (this.assetIdentification !== '' || this.assetType !== null) {
      this.assetIdentification = this.assetIdentification.toLowerCase();
      if (this.assetID == '') {
        this.assetID = this.assetIdentification;
      }
      this.lastEvaluatedKey = ''
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
      this.lastEvaluatedKey = ''
      this.assetType = null;
      this.suggestedAssets = [];
      this.allData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchAssetsCount();
    } else {
      return false;
    }
  }


}
