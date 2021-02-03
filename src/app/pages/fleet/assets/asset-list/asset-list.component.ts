import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
declare var $: any;
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css'],
})
export class AssetListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  allAssetTypes: any;
  assetTypesObjects: any = {};
  title = 'Assets List';
  mapView: boolean = false ;
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
  // dtTrigger = new Subject();

  suggestedAssets = [];
  assetID = '';
  currentStatus = '';
  assetIdentification = '';

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';
  manufacturersObjects: any = {};
  modelsObjects: any = {};

  constructor(
    private apiService: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private httpClient: HttpClient,
    private hereMap: HereMapService) {}

  ngOnInit(): void {
      // this.dataTableOptions();
      this.fetchAssets();
      this.fetchAllAssetTypes();
      this.fetchGroups();
      this.initDataTable();
      this.fetchManufacturesByIDs();
      this.fetchModalsByIDs();
  }

  getSuggestions(value) {
    this.apiService
      .getData(`assets/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedAssets = result.Items;
        if(this.suggestedAssets.length == 0){
          this.assetID = '';
        }
      });
  }

  setAsset(assetID, assetIdentification) {
    this.assetIdentification = assetIdentification;
    this.assetID = assetID;

    this.suggestedAssets = [];
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
  

  fetchAssets = () => {
   
    this.totalRecords = 0;
    this.spinner.show(); // loader init
   
      this.apiService.getData(`assets`).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.spinner.hide(); // loader hide
        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].isDeleted === 0) {
            // this.allData.push(result.Items[i]);
            this.totalRecords += 1
            
          }
        }
      },
    });
  }

  /*
   * Get all assets types from trailers.json file
   */

  fetchAllAssetTypes() {
    this.httpClient.get("assets/trailers.json").subscribe((data: any) =>{
      this.allAssetTypes = data;
      this.assetTypesObjects =  data.reduce( (a: any, b: any) => {
        return a[b['code']] = b['description'], a;
    }, {});
    })
  }

  deactivateAsset(value, assetID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`assets/isDeleted/${assetID}/${value}`)
      .subscribe((result: any) => {
        this.allData = [];
        this.fetchAssets();
        this.rerender();
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

  uncheckCheckbox = (data, tableID) => {
    if (data.length > 0) {
      if (tableID === '#DataTables_Table_0_wrapper') {
        setTimeout(() => {
          $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons').show();
        }, 2000);
      } else {
        setTimeout(() => {
          // $('.page-buttons').find('.dt-buttons').hide();
          $(tableID).find('.dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons').show();
        }, 2000);
      }
    } else {
      $('.page-buttons').find('.dt-buttons').hide();
    }

    // arr.forEach(item => {
    //   item.checked = false;
    // });
    // this.headCheckbox = false;
  }


  initDataTable() {
    let current = this;
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('assets/fetch/records?assetID='+this.assetID+'&status='+this.currentStatus+'&lastKey='+this.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
            current.allData = resp['Items'];
            if (resp['LastEvaluatedKey'] !== undefined) {
              this.lastEvaluatedKey = resp['LastEvaluatedKey'].assetID;
              
            } else {
              this.lastEvaluatedKey = '';
            }

            callback({
              recordsTotal: current.totalRecords,
              recordsFiltered: current.totalRecords,
              data: []
            });
          });
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(status=''): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      if(status === 'reset') {
        this.dtOptions.pageLength = this.totalRecords;
      } else {
        this.dtOptions.pageLength = 10;
      }
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  searchFilter() {
    if(this.assetID !== '' || this.currentStatus !== '') {
      this.allData = [];
      this.fetchAssets();
      this.rerender('reset');
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.assetID !== '' || this.currentStatus !== '') {
      // this.spinner.show();
      this.assetID = '';
      this.assetIdentification = '';
      this.currentStatus = '';

      this.allData = [];
      this.fetchAssets();
      this.rerender();
      // this.spinner.hide();
    } else {
      return false;
    }
  }

  hideShowColumn() {
    //for headers
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

    //extra columns
    if(this.hideShow.group == false) {
      $('.col10').css('display','none');
    } else { 
      $('.col10').removeClass('extra');
      $('.col10').css('display','');
      $('.col10').css('width','200px');
    }

    if(this.hideShow.aceID == false) {
      $('.col11').css('display','none');
    } else { 
      $('.col11').removeClass('extra');
      $('.col11').css('display','');
      $('.col11').css('width','200px');
    }

    if(this.hideShow.aciID == false) {
      $('.col12').css('display','none');
    } else { 
      $('.col12').removeClass('extra');
      $('.col12').css('display','');
      $('.col12').css('width','200px');
    }
    
    if(this.hideShow.gvwr == false) {
      $('.col13').css('display','none');
    } else { 
      $('.col13').removeClass('extra');
      $('.col13').css('display','');
      $('.col13').css('width','200px');
    }

    if(this.hideShow.gawr == false) {
      $('.col14').css('display','none');
    } else { 
      $('.col14').removeClass('extra');
      $('.col14').css('display','');
      $('.col14').css('width','200px');
    }
  }

}
