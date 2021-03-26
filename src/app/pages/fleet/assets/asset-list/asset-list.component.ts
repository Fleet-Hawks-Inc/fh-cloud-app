import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services';
import { HttpClient } from '@angular/common/http';
import  Constants  from '../../constants';
declare var $: any;

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css'],
})
export class AssetListComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  allAssetTypes: any;
  assetTypesObjects: any = {};
  title = 'Assets List';
  mapView: boolean = false;
  listView: boolean = true;
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
  Error: string = '';
  Success: string = '';

  hideShow = {
    assetName: true,
    type: true,
    plateNo: true,
    lastLocation: true,
    year: true,
    make: true,
    model: true,
    ownership: true,
    status: true,
    group: false,
    aceID: false,
    aciID: false,
    gvwr: false,
    gawr: false,
  }

  message: any;
  groupsList:any = {};

  suggestedAssets = [];
  assetID = '';
  currentStatus = '';
  assetIdentification = '';
  assetTypeList: any  = {};
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

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private hereMap: HereMapService) {}

  ngOnInit(): void {
      this.fetchAssetsCount();
      this.fetchAllAssetTypes();
      this.fetchGroups();
      this.initDataTable();
      this.fetchManufacturesByIDs();
      this.fetchModalsByIDs();
      this.fetchAllAssetTypesList();
  }

  getSuggestions(value) {
    value = value.toLowerCase();
    if(value != '') {
      this.apiService
      .getData(`assets/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedAssets = result.Items;
      });
    } else {
      this.suggestedAssets = [];
    }
    
  }

  setAsset(assetID, assetIdentification) {
    this.assetIdentification = assetIdentification;
    this.assetID = assetIdentification;

    this.suggestedAssets = [];
  }
  fetchAllAssetTypesList() {
    this.apiService.getData('assetTypes/get/list')
    .subscribe((result: any) => {
      this.assetTypeList = result;
    });
  }
  fetchGroups() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groupsList = result;
    });
  }

  fetchManufacturesByIDs() {
    this.apiService.getData('assetManufacturers/get/list').subscribe((result: any) => {
      this.manufacturersObjects = result;
    });
  }

  fetchModalsByIDs() {
    this.apiService.getData('vehicleModels/get/list').subscribe((result: any) => {
      this.modelsObjects = result;
    });
  }

  someClickHandler(info: any): void {
    this.message = info.id + ' - ' + info.firstName;
  }

  fetchAssetsCount() {
    this.apiService.getData('assets/get/count?asset=' + this.assetID + '&status=' + this.currentStatus).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;

        if(this.assetID != '' || this.currentStatus != '') {
          this.assetEndPoint = this.totalRecords;
        }
      },
    });
  }

  /*
   * Get all assets types from trailers.json file
   */

  fetchAllAssetTypes() {
    this.apiService.getData('assetTypes')
    .subscribe((result: any) => {
      this.allAssetTypes = result.Items;
    });
  }

  deactivateAsset(value, assetID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`assets/isDeleted/${assetID}/${value}`)
      .subscribe((result: any) => {
        this.allData = [];
        this.fetchAssetsCount();
        // this.rerender();
        this.toastr.success('Asset deleted successfully');
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

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('assets/fetch/records?asset='+this.assetID+'&status='+this.currentStatus+'&lastKey='+this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedAssets = [];
        this.getStartandEndVal();

        this.allData = result['Items'];

        if(this.assetID != '') {
          this.assetStartPoint = 1;
          this.assetEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.assetNext = false;
          // for prev button
          if (!this.assetPrevEvauatedKeys.includes(result['LastEvaluatedKey'].assetID)) {
            this.assetPrevEvauatedKeys.push(result['LastEvaluatedKey'].assetID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].assetID;
          
        } else {
          this.assetNext = true;
          this.lastEvaluatedKey = '';
          this.assetEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.assetDraw > 0) {
          this.assetPrev = false;
        } else {
          this.assetPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  searchFilter() {
    if (this.assetIdentification !== '' || this.currentStatus !== '') {
      if(this.assetID == '') {
        this.assetID = this.assetIdentification;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.allData = [];
      this.suggestedAssets = [];
      this.fetchAssetsCount();
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.assetIdentification !== '' || this.currentStatus !== '') {
      this.assetID = '';
      this.assetIdentification = '';
      this.currentStatus = '';
      this.suggestedAssets = [];
      this.allData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchAssetsCount();
      this.initDataTable();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  hideShowColumn() {
    // for headers
    if(this.hideShow.assetName == false) {
      $('.col1').css('display','none');
    } else {
      $('.col1').css('display','');
    }

    if(this.hideShow.type == false) {
      $('.col2').css('display','none');
    } else {
      $('.col2').css('display','');
    }

    if(this.hideShow.plateNo == false) {
      $('.col3').css('display','none');
    } else {
      $('.col3').css('display','');
    }

    if(this.hideShow.lastLocation == false) {
      $('.col4').css('display','none');
    } else {
      $('.col4').css('display','');
    }

    if(this.hideShow.year == false) {
      $('.col5').css('display','none');
    } else {
      $('.col5').css('display','');
    }

    if(this.hideShow.make == false) {
      $('.col6').css('display','none');
    } else {
      $('.col6').css('display','');
    }

    if(this.hideShow.model == false) {
      $('.col7').css('display','none');
    } else {
      $('.col7').css('display','');
    }

    if(this.hideShow.ownership == false) {
      $('.col8').css('display','none');
    } else {
      $('.col8').css('display','');
    }

    if(this.hideShow.status == false) {
      $('.col9').css('display','none');
    } else {
      $('.col9').css('display','');
    }

    // extra columns
    if(this.hideShow.group == false) {
      $('.col10').css('display','none');
    } else {
      $('.col10').removeClass('extra');
      $('.col10').css('display','');
      $('.col10').css('min-width','200px');
    }

    if(this.hideShow.aceID == false) {
      $('.col11').css('display','none');
    } else {
      $('.col11').removeClass('extra');
      $('.col11').css('display','');
      $('.col11').css('min-width','200px');
    }

    if(this.hideShow.aciID == false) {
      $('.col12').css('display','none');
    } else {
      $('.col12').removeClass('extra');
      $('.col12').css('display','');
      $('.col12').css('min-width','200px');
    }

    if(this.hideShow.gvwr == false) {
      $('.col13').css('display','none');
    } else {
      $('.col13').removeClass('extra');
      $('.col13').css('display','');
      $('.col13').css('min-width','200px');
    }

    if(this.hideShow.gawr == false) {
      $('.col14').css('display','none');
    } else {
      $('.col14').removeClass('extra');
      $('.col14').css('display','');
      $('.col14').css('min-width','200px');
    }
  }

  getStartandEndVal() {
    this.assetStartPoint = this.assetDraw * this.pageLength + 1;
    this.assetEndPoint = this.assetStartPoint + this.pageLength - 1;
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
