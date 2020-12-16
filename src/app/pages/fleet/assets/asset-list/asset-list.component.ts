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
  dtOptions: DataTables.Settings = {};
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
  // dataTableOptions = () => {
  //   this.allOptions = { // All list options
  //     pageLength: 10,
  //     processing: true,
  //     // select: {
  //     //     style:    'multi',
  //     //     selector: 'td:first-child'
  //     // },
  //     dom: 'Bfrtip',
  //     // Configure the buttons
  //     buttons: [
  //        {
  //             extend: 'colvis',
  //             columns: ':not(.noVis)'
  //         }
  //     ],
  //     colReorder: true,
  //     columnDefs: [
  //       {
  //           targets: 1,
  //           className: 'noVis'
  //       },
  //       {
  //           targets: 2,
  //           className: 'noVis'
  //       },
  //       {
  //           targets: 3,
  //           className: 'noVis'
  //       },
  //       {
  //           targets: 4,
  //           className: 'noVis'
  //       },
  //       {
  //           targets: 8,
  //           className: 'noVis'
  //       },
        
  //   ],
  //   "fnDrawCallback": function(oSettings) {
  //       if ($('.dataTables_wrapper tbody tr').length <= 10) {
  //           $('.dataTables_paginate .previous, .dataTables_paginate .next').hide();
  //       }
  //   }
  //   };

  //   this.reeferOptions = { // Reefer list options
  //     pageLength: 10,
  //     processing: true,
  //     dom: 'Bfrtip',
  //     // Configure the buttons
  //     buttons: [
  //        {
  //             extend: 'colvis',
  //             columns: ':not(.noVis)'
  //         }
  //     ],
  //     colReorder: {
  //       fixedColumnsLeft: 1
  //     },
  //     columnDefs: [
  //       {
  //           targets: 0,
  //           className: 'noVis'
  //       },
  //       {
  //           targets: 1,
  //           className: 'noVis'
  //       },
  //       {
  //           targets: 2,
  //           className: 'noVis'
  //       },
  //       {
  //           targets: 3,
  //           className: 'noVis'
  //       },
  //       {
  //           targets: 4,
  //           className: 'noVis'
  //       },
  //       {
  //           targets: 9,
  //           className: 'noVis'
  //       }
  //   ],
  //   "fnDrawCallback": function(oSettings) {
  //       if ($('.dataTables_wrapper tbody tr').length <= 10) {
  //           $('.dataTables_paginate .previous, .dataTables_paginate .next').hide();
  //       }
  //   }
  //   };

  //   this.dryboxOptions = this.flatbedOptions = this.curtainOptions = { // Reefer list options
  //     pageLength: 10,
  //     processing: true,
  //     dom: 'Bfrtip',
  //     // Configure the buttons
  //     buttons: [
  //        {
  //             extend: 'colvis',
  //             columns: ':not(.noVis)'
  //         }
  //     ],
  //     colReorder: {
  //       fixedColumnsLeft: 1
  //     },
  //     columnDefs: [
  //         {
  //             targets: 0,
  //             className: 'noVis'
  //         },
  //         {
  //             targets: 1,
  //             className: 'noVis'
  //         },
  //         {
  //             targets: 2,
  //             className: 'noVis'
  //         },
  //         {
  //             targets: 3,
  //             className: 'noVis'
  //         },
  //         {
  //             targets: 8,
  //             className: 'noVis'
  //         }
  //     ],
  //     "fnDrawCallback": function(oSettings) {
  //       if ($('.dataTables_wrapper tbody tr').length <= 10) {
  //           $('.dataTables_paginate .previous, .dataTables_paginate .next').hide();
  //       }
  //   }
  //   };
  // }

  fetchAssets = () => {
    // this.allData = [];
    // this.autoCarrier = [];
    // this.beverageRack = [];
    // this.flatbed = [];
    // this.controlledTemp = [];
    // this.gondola = [];
    // this.hopper = [];
    // this.horseTrailer = [];
    // this.liveStock = [];
    // this.lowboy = [];
    // this.stake = [];
    // this.stepDeck = [];
    // this.tanker = [];
    this.totalRecords = 0;
    this.spinner.show(); // loader init
    // this.apiService.getData(`assets?assetID=${this.assetID}&status=${this.currentStatus}`).subscribe({
      this.apiService.getData(`assets`).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        // console.log(result);
        this.spinner.hide(); // loader hide
        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].isDeleted === 0) {
            // this.allData.push(result.Items[i]);
            this.totalRecords += 1
            // if (result.Items[i].assetDetails.assetType === 'TC') {
            //   this.autoCarrier.push(result.Items[i]);
            // } else if (result.Items[i].assetDetails.assetType === 'BI') {
            //   this.beverageRack.push(result.Items[i]);
            // } else if (result.Items[i].assetDetails.assetType === 'FT' || result.Items[i].assetDetails.assetType === 'FR' ||
            //            result.Items[i].assetDetails.assetType === 'FH' || result.Items[i].assetDetails.assetType === 'FN') {
            //   this.flatbed.push(result.Items[i]);
            // } else if (result.Items[i].assetDetails.assetType === 'RT' || result.Items[i].assetDetails.assetType === 'TW') {
            //   this.controlledTemp.push(result.Items[i]);
            // } else if (result.Items[i].assetDetails.assetType === 'RG' || result.Items[i].assetDetails.assetType === 'RO') {
            //   this.gondola.push(result.Items[i]);
            // } else if (result.Items[i].assetDetails.assetType === 'HC' || result.Items[i].assetDetails.assetType === 'HP' ||
            //           result.Items[i].assetDetails.assetType === 'HO') {
            //   this.hopper.push(result.Items[i]);
            // } else if (result.Items[i].assetDetails.assetType === 'HE') {
            //   this.horseTrailer.push(result.Items[i]);
            // } else if (result.Items[i].assetDetails.assetType === 'Livestock') {
            //   this.liveStock.push(result.Items[i]);
            // } else if (result.Items[i].assetDetails.assetType === 'Lowboy') {
            //   this.lowboy.push(result.Items[i]);
            // } else if (result.Items[i].assetDetails.assetType === 'Stake') {
            //   this.stake.push(result.Items[i]);
            // } else if (result.Items[i].assetDetails.assetType === 'Step Deck') {
            //   this.stepDeck.push(result.Items[i]);
            // } else {
            //   this.tanker.push(result.Items[i]);
            // }
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
      // console.log('trailers', this.allAssetTypes);
    })
  }

  deactivateAsset(value, assetID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`assets/isDeleted/${assetID}/${value}`)
      .subscribe((result: any) => {
        // console.log('result', result);
        this.fetchAssets();
      });
    }
  }


  editAsset = () => {
    if (this.assetCheckCount === 1) {
      this.router.navigateByUrl('/fleet/assets/edit/' + this.selectedAssetID);
    } else {
      this.toastr.error('Please select only one asset!');
    }
  }
  deleteAssetOld = () => {
    const selectedAssets = this.allData.filter(product => product.checked).map(p => p.assetID);
    if (selectedAssets && selectedAssets.length > 0) {
      for (const i of selectedAssets) {
        this.apiService.deleteData('assets/' + i).subscribe((result: any) => {
          this.fetchAssets();
          this.toastr.success('Assets Deleted Successfully!');
        });

      }
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
    // console.log(tableID, data.length )
    if (data.length > 0) {
      if (tableID === '#DataTables_Table_0_wrapper') {
        console.log('if');
        setTimeout(() => {
          $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons').show();
        }, 2000);
      } else {
        console.log('else');
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


  // Count Checkboxes
  // checkboxCount = (arr) => {
  //   this.assetCheckCount = 0;
  //   arr.forEach(item => {
  //     console.log('item', item);
  //     console.log('array', arr);
  //     if (item.checked === true) {
  //       this.selectedAssetID = item.assetID;
  //       this.assetCheckCount = this.assetCheckCount + 1;
  //       console.log('check', arr.length, this.assetCheckCount)
  //       if (arr.length === this.assetCheckCount) {
  //         this.headCheckbox = true;
  //       }
  //     } else {
  //       this.headCheckbox = false;
  //     }
  //   });
  // }

  // checked-unchecked all checkboxes
  // checkuncheckall = (ev) => {
  //   if (ev.target.checked === true) {
  //     this.isChecked = true;
  //   } else {
  //     this.isChecked = false;
  //   }
  // }

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
