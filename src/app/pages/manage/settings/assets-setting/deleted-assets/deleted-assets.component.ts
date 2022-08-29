import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import Constants from '../../../constants';
import { ApiService } from '../../../../../services';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { NgSelectComponent } from "@ng-select/ng-select";
import { Table } from 'primeng/table/table';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-deleted-assets',
  templateUrl: './deleted-assets.component.html',
  styleUrls: ['./deleted-assets.component.css']
})
export class DeletedAssetsComponent implements OnInit {
  @ViewChild("dt") table: Table;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
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
  get = _.get;
  visible = true;
  _selectedColumns: any[];
   assetOptions: any[];
   companyName=[];


  
   dataColumns = [
    { field: 'assetIdentification', header: 'Asset Name/Number', type: "text" },
    { field: 'VIN', header: 'VIN', type: "text" },
    { field: 'aType', header: 'Asset Type', type: "text" },
    { field: 'assetDetails.manufacturer', header: 'Make', type: "text" },
    { field: 'assetDetails.licencePlateNumber', header: 'Licence Plate Number', type: "text" },
    { field: 'assetDetails.year', header: 'Year', type: "text" },
    { field: 'assetDetails.model', header: 'Model', type: "text" },
    { field: 'assetDetails.ownerShip', header:'Ownership', type: "text" },
    { field: 'comName', header: 'Company Name', type: "text" },
    { field: 'currentStatus', header: 'Status', type: 'text' }
  ];
  
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
            private spinner: NgxSpinnerService,
            private toastr: ToastrService,
            private modalService: NgbModal,
            private el: ElementRef) { }

  async ngOnInit(): Promise<void> {
    this.initDataTable();
    this.fetchContacts();
    this.setToggleOptions();
  }
  
  fetchContacts() {
    this.apiService.getData('contacts/get/list/ownerOperator').subscribe((result: any) => {
      this.contactsObjects = result;
    });
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

    async initDataTable() {
        if (this.lastEvaluatedKey !== 'end') {
            const result = await this.apiService.getData('assets/fetch/deleted/records?asset=' + this.assetIdentification+ '&assetType=' + this.assetType + '&lastKey=' + this.lastEvaluatedKey).toPromise();
            if (result.Items.length === 0) {
                this.loaded = true;
                this.dataMessage = Constants.NO_RECORDS_FOUND
            }
            this.suggestedAssets = [];
            if (result.Items.length > 0) {
                if (result.LastEvaluatedKey !== undefined) {
                    this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].assetSK);
                }
                else {
                    this.lastEvaluatedKey = 'end'
                }
                this.allData = this.allData.concat(result.Items);
                this.loaded = true;
                
                for(let res of result.Items){
                    res.aType = res.assetType.split('_').join(' ');
                    if(res.assetDetails.ownerShip === 'rented') {
                      res.comName = res.assetDetails.ownCname ? res.assetDetails.ownCname : "-" 
                    }
                     if(res.assetDetails.ownerShip === 'leased') {
                      res.comName = res.assetDetails.ownCname ? res.assetDetails.ownCname : "-" 
                    }
                    if(res.assetDetails.ownerShip === 'ownerOperator') {
                      res.comName = res.assetDetails.ownerOperator ? this.contactsObjects[res.assetDetails.ownerOperator] : "-"
                    }
                }
            }
        }
    }
    
    onScroll = async (event: any) => {
        if (this.loaded) {
            this.initDataTable();
        }
        this.loaded = false;
    }
    
    refreshData(){
      this.allData = [];
      this.loaded = false;
      this.lastEvaluatedKey = '';
      this.initDataTable(); 
      this.dataMessage = Constants.FETCHING_DATA;
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
  
   clear(table: Table) {
        table.clear();
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
