import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services';
import { HttpClient } from '@angular/common/http';
import Constants from '../../constants';
import { environment } from '../../../../../environments/environment';
import { OnboardDefaultService } from '../../../../services/onboard-default.service';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css'],
})
export class AssetListComponent implements OnInit {
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
  loaded = false
  lastItemSK = ''
  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private hereMap: HereMapService,
    private onboard: OnboardDefaultService) { }

  ngOnInit(): void {
    this.onboard.checkInspectionForms();
    // this.fetchAssetsCount();
    this.fetchGroups();
    this.initDataTable();
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

  // fetchManufacturesByIDs() {
  //   this.apiService.getData('assetManufacturers/get/list').subscribe((result: any) => {
  //     this.manufacturersObjects = result;
  //   });
  // }

  // fetchModalsByIDs() {
  //   this.apiService.getData('assetModels/get/list').subscribe((result: any) => {
  //     this.modelsObjects = result;
  //   });
  // }

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


  // deleteAsset(eventData) {
  //   ;
  //   // }
  //   if (confirm('Are you sure you want to delete?') === true) {
  //     // let record = {
  //     //   date: eventData.createdDate,
  //     //   time: eventData.createdTime,
  //     //   eventID: eventData.assetID,
  //     //   status: eventData.currentStatus
  //     // }
  //     this.apiService.deleteData(`assets/delete/${eventData.assetID}/${eventData.assetIdentification}`).subscribe((result: any) => {
  //       this.allData = [];
  //       this.assetDraw = 0;
  //       this.dataMessage = Constants.FETCHING_DATA;
  //       this.lastEvaluatedKey = '';
  //       this.fetchAssetsCount();
  //       this.toastr.success('Asset Deleted Successfully!');
  //     });
  //   }

  // }
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

  initDataTable() {
    if (this.lastEvaluatedKey !== 'end')
      this.apiService.getData('assets/fetch/records?asset=' + this.assetIdentification + '&assetType=' + this.assetType + '&lastKey=' + this.lastEvaluatedKey)
        .subscribe((result: any) => {
          this.dataMessage = Constants.FETCHING_DATA
          if (result.Items.length === 0) {

            this.dataMessage = Constants.NO_RECORDS_FOUND
            this.suggestedAssets = [];


            result[`Items`].map((v: any) => {
              v.url = `/fleet/assets/detail/${v.assetID}`;
              v.assetType = v.assetType.replace("_", " ")
            })
          }
          if (result.Items.length > 0) {

            if (result.LastEvaluatedKey !== undefined) {
              this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].assetSK);
            }
            else {
              this.lastEvaluatedKey = 'end'
            }
            this.allData = this.allData.concat(result.Items)

            this.loaded = true;
          }
        });
  }
  onScroll() {
    if (this.loaded) {
      this.fetchAssetsCount();
    }
    this.loaded = true;
  }

  searchFilter() {
    if (this.assetIdentification !== '' || this.assetType !== null) {
      this.assetIdentification = this.assetIdentification.toLowerCase();
      if (this.assetID == '') {
        this.assetID = this.assetIdentification;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.allData = [];
      this.lastEvaluatedKey = ''
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
      this.lastEvaluatedKey = ''
      this.fetchAssetsCount();
      // this.resetCountResult();
    } else {
      return false;
    }
  }

  hideShowColumn() {
    // for headers
    if (this.hideShow.vin == false) {
      $('.col0').css('display', 'none');
    } else {
      $('.col0').css('display', '');
    }
    if (this.hideShow.assetName == false) {
      $('.col1').css('display', 'none');
    } else {
      $('.col1').css('display', '');
    }

    if (this.hideShow.type == false) {
      $('.col2').css('display', 'none');
    } else {
      $('.col2').css('display', '');
    }

    if (this.hideShow.plateNo == false) {
      $('.col3').css('display', 'none');
    } else {
      $('.col3').css('display', '');
    }

    if (this.hideShow.lastLocation == false) {
      $('.col4').css('display', 'none');
    } else {
      $('.col4').css('display', '');
    }

    if (this.hideShow.year == false) {
      $('.col5').css('display', 'none');
    } else {
      $('.col5').removeClass('extra');
      $('.col5').css('display', '');
      $('.col5').css('min-width', '200px');
    }

    if (this.hideShow.make == false) {
      $('.col6').css('display', 'none');
    } else {
      $('.col6').css('display', '');
    }

    if (this.hideShow.model == false) {
      $('.col7').css('display', 'none');
    } else {
      $('.col7').removeClass('extra');
      $('.col7').css('display', '');
      $('.col7').css('min-width', '200px');
    }

    if (this.hideShow.ownership == false) {
      $('.col8').css('display', 'none');
    } else {
      $('.col8').removeClass('extra');
      $('.col8').css('display', '');
      $('.col8').css('min-width', '200px');
    }

    if (this.hideShow.currentStatus == false) {
      $('.col9').css('display', 'none');
    } else {
      $('.col9').css('display', '');
    }

    // extra columns
    if (this.hideShow.group == false) {
      $('.col10').css('display', 'none');
    } else {
      $('.col10').removeClass('extra');
      $('.col10').css('display', '');
      $('.col10').css('min-width', '200px');
    }

    if (this.hideShow.aceID == false) {
      $('.col11').css('display', 'none');
    } else {
      $('.col11').removeClass('extra');
      $('.col11').css('display', '');
      $('.col11').css('min-width', '200px');
    }

    if (this.hideShow.aciID == false) {
      $('.col12').css('display', 'none');
    } else {
      $('.col12').removeClass('extra');
      $('.col12').css('display', '');
      $('.col12').css('min-width', '200px');
    }

    if (this.hideShow.gvwr == false) {
      $('.col13').css('display', 'none');
    } else {
      $('.col13').removeClass('extra');
      $('.col13').css('display', '');
      $('.col13').css('min-width', '200px');
    }

    if (this.hideShow.gawr == false) {
      $('.col14').css('display', 'none');
    } else {
      $('.col14').removeClass('extra');
      $('.col14').css('display', '');
      $('.col14').css('min-width', '200px');
    }
  }

  refreshData() {
    this.assetID = '';
    this.assetIdentification = '';
    this.assetType = null;
    this.suggestedAssets = [];
    this.allData = [];
    this.lastEvaluatedKey = '';
    this.dataMessage = Constants.FETCHING_DATA;
    this.fetchAssetsCount();
    // this.resetCountResult();
  }
}
