import { Component, OnInit,  Input, ViewChild } from '@angular/core';
import { ApiService } from '../../../../services';
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
  
  loadMsg: string = Constants.NO_LOAD_DATA;
  assetOptions: any[];
  _selectedColumns: any[];
  get = _.get;
  isSearch = false;
  
  dataColumns = [
        { field: 'assetIdentification', header: 'Asset Name/Number', type: "text" },
        { field: 'VIN', header: 'VIN', type: "text" },
        { field: 'assetType', header: 'Asset Type', type: "text" },
        { field: 'assetDetails.manufacturer', header: 'Make', type: "text" },
        { field: 'assetDetails.licencePlateNumber', header: 'Licence Plate Number', type: "text" },
        { field: 'assetDetails.year', header: 'Year', type: "text" },
        { field: 'assetDetails.ownerShip', header: 'Ownership', type: "text" },
        { field: 'assetDetails.ownCname', header: 'Company Name', type: "text" },
        { field: 'assetDetails.annualSafetyDate', header: 'Annual Safety Date', type: "text" },
        { field: "currentStatus", header: 'Status', type: 'text' },

    ];
  
  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private hereMap: HereMapService,
    private onboard: OnboardDefaultService) { }

  async ngOnInit(): Promise<void> {
    this.setToggleOptions();
    this.setAssetOptions();
    this.onboard.checkInspectionForms();
    this.fetchGroups();
  // await this.initDataTable();
   this.initDataTable();
    this.fetchContacts();

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
          this.suggestedAssets = result;
        });
    } else {
      //this.suggestedAssets = [];
    }

  }, 800)

  setAsset(assetIdentification) {
    this.assetIdentification = assetIdentification;
    //this.suggestedAssets = [];
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

  initDataTable() {
    if (this.lastEvaluatedKey !== 'end')
      this.apiService.getData('assets/fetch/records?asset=' + this.assetIdentification + '&assetType=' + this.assetType + '&lastKey=' + this.lastEvaluatedKey)
        .subscribe((result: any) => {
          this.dataMessage = Constants.FETCHING_DATA
          if (result.Items.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND
          }
          if (result.Items.length > 0) {
            result[`Items`].map((v: any) => {
              v.url = `/fleet/assets/detail/${v.assetID}`;
              v.assetType = v.assetType.replace("_", " ")
            })
            if (result.LastEvaluatedKey !== undefined) {
              this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].assetSK);
            }
            else {
              this.lastEvaluatedKey = 'end'
            }
            this.allData = this.allData.concat(result.Items)
            this.loaded = true;
            this.isSearch = false;
          }
        });
  }
  
  onScroll = async(event: any) => {
    if (this.loaded) {
      this.initDataTable();
    }
    this.loaded = false;
  }

  searchFilter() {
    if (this.assetIdentification !== '' ||  this.assetType !== null) {
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
    this.allData = [];
    this.assetID = '';
    this.assetIdentification = '';
    this.assetType = null;
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
