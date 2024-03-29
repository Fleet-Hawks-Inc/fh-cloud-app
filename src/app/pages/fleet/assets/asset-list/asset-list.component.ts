import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ApiService, DashboardUtilityService, ListService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services';
import { HttpClient } from '@angular/common/http';
import Constants from '../../constants';
import { environment } from '../../../../../environments/environment';
import { OnboardDefaultService } from '../../../../services/onboard-default.service';
import * as _ from 'lodash';
import { Table } from 'primeng/table';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css'],
})
export class AssetListComponent implements OnInit {
  @ViewChild('dt') table: Table;

  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
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
  fullExportDriver: any = [];
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
  fullExportAsset: any = [];
  lastItemSK = ''

  loadMsg: string = Constants.NO_LOAD_DATA;
  assetOptions: any[];
  _selectedColumns: any[];
  get = _.get;
  isSearch = false;

  dataColumns = [
    { field: 'assetIdentification', header: 'Asset Name/Number', type: "text" },
    { field: 'VIN', header: 'VIN', type: "text" },
    { field: 'assetT', header: 'Asset Type', type: "text" },
    { field: 'manufacturer', header: 'Make', type: "text" },
    { field: 'licencePlateNumber', header: 'Licence Plate Number', type: "text" },
    { field: 'year', header: 'Year', type: "text" },
    { field: 'ownerShip', header: 'Ownership', type: "text" },
    { field: 'comName', header: 'Company Name', type: "text" },
    { field: 'annualSafetyDate', header: 'Annual Safety Date', type: "text" },
    { field: 'currentStatus', header: 'Status', type: 'text' },
    { field: 'isImport', header: 'Added By', type: "text" },

  ];

  isUpgrade = false;

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private hereMap: HereMapService,
    private dashboardUtilityService: DashboardUtilityService,
    private listService: ListService,
    private onboard: OnboardDefaultService) { }

  async ngOnInit(): Promise<void> {
    this.setToggleOptions();
    this.setAssetOptions();
    this.onboard.checkInspectionForms();
    this.fetchGroups();
    this.initDataTable();
    this.fetchContacts();
    this.isSubscriptionsValid();
  }

  private async isSubscriptionsValid() {
    this.dashboardUtilityService.refreshAstCount = true;
    this.dashboardUtilityService.refreshPlans = true;
    let curAstCount = await this.dashboardUtilityService.fetchAssetsCount();
    this.listService.maxUnit.subscribe((res: any) => {
      if (res) {
        let data = [];
        for (const item of res) {
          if (item.planCode.startsWith('TRA-') || item.planCode.startsWith('REF-')) {
            data.push({ assets: item.assets, planCode: item.planCode })
          }
        }

        if (data.length > 0) {

          let assetTotal = Math.max(...data.map(o => o.assets))
          if (assetTotal == -1) { // -1 returns when subscribed Enterprise plan with no limit
            this.isUpgrade = false;
          } else {
            this.isUpgrade = curAstCount >= assetTotal ? true : false;
            if (this.isUpgrade) {

              let obj = {
                summary: Constants.RoutingPlanExpired,
                detail: 'You will not be able to add more assets.',
                severity: 'error'
              }
              this.dashboardUtilityService.notify(obj);
            }
          }
        }
      }
    })
  }

  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }
  setAssetOptions() {
    this.assetOptions = [{ "value": "container", "name": "Container" },
    { "value": "double_drop", "name": "Double Drop" },
    { "value": "dump_trailer", "name": "Dump Trailer" },
    { "value": "flat_bed", "name": "Flat bed" },
    { "value": "lowboy", "name": "Lowboy" },
    { "value": "stepDeck", "name": "StepDeck" },
    { "value": "removable_gooseneck", "name": "Removable Gooseneck" },
    { "value": "dry_van", "name": "Dry Van" },
    { "value": "reefer", "name": "Reefer" },
    { "value": "power_only", "name": "Power Only" },
    { "value": "conestoga_trailer", "name": "Conestoga Trailer" },
    { "value": "side_kit_trailer", "name": "Side Kit Trailer" },
    { "value": "enclosed_trailer", "name": "Enclosed Trailer" },
    { "value": "scrap_trailer", "name": "Scrap Trailer" },
    { "value": "semi_trailer", "name": "Semi Trailer" },
    { "value": "chassis", "name": "Chassis" },
    { "value": "tank_trailer", "name": "Tank Trailer" },
    ];
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
  }

  getSuggestions = _.debounce(function (value) {
    value = value.toLowerCase();
    if (value != '') {
      this.loadMsg = Constants.LOAD_DATA;
      this.apiService
        .getData(`assets/suggestion/${value}`)
        .subscribe((result) => {
          if (result.length === 0) {
            this.suggestedAssets = [];
            this.loadMsg = Constants.NO_LOAD_FOUND;
          }

          if (result.length > 0) {
            this.suggestedAssets = result;
          } else {
            this.suggestedAssets = [];
          }
        });
    } else {
      this.suggestedAssets = [];
    }
  }, 800);

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


  deleteAsset(eventData) {
    ;
    // }
    if (confirm('Are you sure you want to delete?') === true) {
      // let record = {
      //   date: eventData.createdDate,
      //   time: eventData.createdTime,
      //   eventID: eventData.assetID,
      //   status: eventData.currentStatus
      // }
      this.apiService.deleteData(`assets/delete/${eventData.assetID}/${eventData.assetIdentification}`).subscribe((result: any) => {
        this.allData = [];
        this.assetDraw = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        this.initDataTable();
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

  async initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      let result = await this.apiService.getData('assets/fetch/records?asset=' + this.assetIdentification + '&assetType=' + this.assetType + '&lastKey=' + this.lastEvaluatedKey).toPromise();
      if (result.data.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
        this.loaded = true;
      }
      result.data.map((v) => {
        v.url = `/fleet/assets/detail/${v.assetID}`;
      });
      if (result.nextPage !== undefined) {
        this.lastEvaluatedKey = encodeURIComponent(result.nextPage);
      }
      else {
        this.lastEvaluatedKey = 'end'
      }
      this.allData = this.allData.concat(result.data)
      this.loaded = true;
      this.isSearch = false;
      for(let res of result.data){
          if(res.ownerShip === 'rented') {
            res.comName = res.ownCname ? res.ownCname : "-" 
             }
          if(res.ownerShip === 'leased') {
           res.comName = res.ownCname ? res.ownCname : "-" 
             }
           if(res.ownerShip === 'ownerOperator') {
           res.comName = res.ownerOperator ? this.contactsObjects[res.ownerOperator] : '-'
        }
       res.assetT = res.assetType ? res.assetType.replace("_", " ") : "-" 
        }
    }
  }


  onScroll = async (event: any) => {
    if (this.loaded) {
      this.initDataTable();
    }
    this.loaded = false;
  }

  searchFilter() {
    if (this.assetIdentification !== '' || this.assetType !== null) {
      this.assetIdentification = this.assetIdentification.toLowerCase();
      if (this.assetID == '') {
        this.assetID = this.assetIdentification;
      }
      this.isSearch = true;
      this.allData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.lastEvaluatedKey = ''
      this.initDataTable();

    } else {
      return false;
    }
  }


/*
  requiredExport() {
    this.apiService.getData(`assets/fetch/assetList`).subscribe((result: any) => {
      this.fullExportAsset = result.Items;
      this.generateDriverCSV();
    })
  }

  requiredCSV() {
    if (this.assetIdentification !== '' || this.assetType !== null) {
      this.assetID = '';
      this.fullExportDriver = this.allData
      this.generateDriverCSV();
    } else {
      this.requiredExport();
    }
  }
*/
  clearInput() {
    this.suggestedAssets = null;
  }

  clearSuggestions() {
    this.assetIdentification = '';
  }

  resetFilter() {
    if (this.assetIdentification !== '' || this.assetType !== null) {
      this.assetID = '';
      this.assetIdentification = '';
      this.assetType = null;
      this.suggestedAssets = [];
      this.allData = [];
      this.isSearch = true;
      this.dataMessage = Constants.FETCHING_DATA;
      this.lastEvaluatedKey = ''
      this.initDataTable();

    } else {
      return false;
    }
  }

  refreshData() {
    this.allData = [];
    this.assetID = '';
    this.assetIdentification = '';
    this.assetType = [];
    this.suggestedAssets = [];
    this.lastEvaluatedKey = '';
    this.loaded = false;
    this.initDataTable();
    this.fullExportAsset = []
    this.dataMessage = Constants.FETCHING_DATA;

  }

  clear(table: Table) {
    table.clear();
  }
}
