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
  assetTypesObects: any = {};
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

  message: any;
  // dtTrigger = new Subject();

  suggestedAssets = [];
  assetID = '';
  currentStatus = '';
  assetIdentification = '';

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

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
      this.initDataTable();
      // $(document).ready(() => {
      //   setTimeout(() => {
      //     $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      //   }, 2000);

      // });
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
      this.assetTypesObects =  data.reduce( (a: any, b: any) => {
        return a[b['code']] = b['description'], a;
    }, {});
    })
  }

  deactivateAsset(value, assetID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`assets/isDeleted/${assetID}/${value}`)
      .subscribe((result: any) => {
        this.toastr.success('Asset deleted successfully');
        this.rerender();
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
        console.log('if');
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
    // console.log('this.pageLengths');
    // console.log(this.pageLength)
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0],"orderable": false},
        {"targets": [1],"orderable": false},
        {"targets": [2],"orderable": false},
        {"targets": [3],"orderable": false},
        {"targets": [4],"orderable": false},
        {"targets": [5],"orderable": false},
        {"targets": [6],"orderable": false},
        {"targets": [7],"orderable": false},
        {"targets": [8],"orderable": false},
        {"targets": [9],"orderable": false},
      ],
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('assets/fetch/records?assetID='+this.assetID+'&status='+this.currentStatus+'&lastKey='+this.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
            current.allData = resp['Items'];
            // console.log(resp)
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
      this.rerender();
      // this.spinner.hide();
    } else {
      return false;
    }
  }

}
