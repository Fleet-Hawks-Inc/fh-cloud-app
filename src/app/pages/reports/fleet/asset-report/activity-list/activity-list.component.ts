import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../../services';
import { HttpClient } from '@angular/common/http';
import Constants from 'src/app/pages/fleet/constants';
import { environment } from '../../../../../../environments/environment';
import { OnboardDefaultService } from '../../../../../services/onboard-default.service';
import * as _ from 'lodash';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  @ViewChild('dt') table: Table;
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
  disableSearch = false;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';

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


  assetPrevEvauatedKeys = [''];
  assetStartPoint = 1;
  assetEndPoint = this.pageLength;
  contactsObjects = [];
  loaded = false;
  get = _.get;
  find = _.find;
  _selectedColumns: any[];
  dataColumns = [
    { field: 'assetIdentification', header: 'Asset Name/Number', type: "text", },
    { field: 'VIN', header: 'VIN', type: "text" },
    { field: 'astTyp', header: 'Asset Type', type: "text" },
    {field: 'manufacturer', header: 'Make', type: 'text' },
    { field: 'licencePlateNumber', header: 'License Plate Number', type: "text" },
    { field: 'year', header: 'Year', type: "text" },
    { field: 'ownerShip', header: 'Ownership', type: "text" },
    { field: 'operatorCompany', header: 'Company Name', type: "text" },
    { field: 'annualSafetyDate', header: 'Annual Safety Date', type: "text" },
  ]


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
    this.fetchContacts();
    this.setToggleOptions()
  }
  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
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


  fetchContacts() {
    this.apiService.getData('contacts/get/list/ownerOperator').subscribe((result: any) => {
      this.contactsObjects = result;
    });
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


  onScroll() {
    if (this.loaded) {
      this.initDataTable();
    }
    this.loaded = false;
  }
  async initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      const result = await this.apiService.getData('assets/fetch/records?asset=' + this.assetIdentification + '&assetType=' + this.assetType + '&lastKey=' + this.lastEvaluatedKey).toPromise();
      if (result.data.length === 0) {
        this.disableSearch = false;
        this.loaded = true;
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
      this.suggestedAssets = [];

      result[`data`].map((v: any) => {
        v.url = `/reports/fleet/asset/activity/${v.assetID}`;
      })

      if (result.data.length > 0) {
        this.disableSearch = false;
        if (result.nextPage !== undefined) {
          this.lastEvaluatedKey = encodeURIComponent(result.nextPage);
        }
        else {
          this.lastEvaluatedKey = 'end';
        }
        this.allData = this.allData.concat(result.data)
        this.loaded = true;

        for (let i = 0; i < this.allData.length; i++) {
          const res: any = this.allData[i];
          res.astTyp = '';
          if(res.assetType){
            res.astTyp = res.assetType.replace("_", " ")
          }
          

        }

      }

    }
  }
  searchFilter() {
    if (this.assetIdentification !== '' || this.assetType !== null) {
      this.assetIdentification = this.assetIdentification.toLowerCase();
      if (this.assetID == '') {
        this.assetID = this.assetIdentification;
      }
      this.disableSearch = true;
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
      this.disableSearch = true;
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
  refreshData() {
    this.allData = [];
    this.assetID = '';
    this.assetIdentification = '';
    this.assetType = [];
    this.suggestedAssets = [];
    this.lastEvaluatedKey = '';
    this.loaded = false;
    this.initDataTable();
    this.dataMessage = Constants.FETCHING_DATA;

  }
  clear(table: Table) {
    table.clear();
  }

}