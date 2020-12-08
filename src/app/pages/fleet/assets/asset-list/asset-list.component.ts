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

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css'],
})
export class AssetListComponent implements OnInit {
  allAssetTypes: any;
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
  dtTrigger = new Subject();

  suggestedAssets = [];
  assetID = '';
  currentStatus = '';
  assetIdentification = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private httpClient: HttpClient,
    private hereMap: HereMapService) {}

  ngOnInit() {
      this.dataTableOptions();
      this.fetchAssets();
      this.fetchAllAssetTypes();
      // $(document).ready(() => {
      //   setTimeout(() => {
      //     $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      //   }, 2000);

      // });
  }

  ngOnDestroy = (): void => {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
  dataTableOptions = () => {
    this.allOptions = { // All list options
      pageLength: 10,
      processing: true,
      // select: {
      //     style:    'multi',
      //     selector: 'td:first-child'
      // },
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
         {
              extend: 'colvis',
              columns: ':not(.noVis)'
          }
      ],
      colReorder: true,
      columnDefs: [
        {
            targets: 1,
            className: 'noVis'
        },
        {
            targets: 2,
            className: 'noVis'
        },
        {
            targets: 3,
            className: 'noVis'
        },
        {
            targets: 4,
            className: 'noVis'
        },
        {
            targets: 8,
            className: 'noVis'
        },
        
    ],
    "fnDrawCallback": function(oSettings) {
        if ($('.dataTables_wrapper tbody tr').length <= 10) {
            $('.dataTables_paginate .previous, .dataTables_paginate .next').hide();
        }
    }
    };

    this.reeferOptions = { // Reefer list options
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
         {
              extend: 'colvis',
              columns: ':not(.noVis)'
          }
      ],
      colReorder: {
        fixedColumnsLeft: 1
      },
      columnDefs: [
        {
            targets: 0,
            className: 'noVis'
        },
        {
            targets: 1,
            className: 'noVis'
        },
        {
            targets: 2,
            className: 'noVis'
        },
        {
            targets: 3,
            className: 'noVis'
        },
        {
            targets: 4,
            className: 'noVis'
        },
        {
            targets: 9,
            className: 'noVis'
        }
    ],
    "fnDrawCallback": function(oSettings) {
        if ($('.dataTables_wrapper tbody tr').length <= 10) {
            $('.dataTables_paginate .previous, .dataTables_paginate .next').hide();
        }
    }
    };

    this.dryboxOptions = this.flatbedOptions = this.curtainOptions = { // Reefer list options
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
         {
              extend: 'colvis',
              columns: ':not(.noVis)'
          }
      ],
      colReorder: {
        fixedColumnsLeft: 1
      },
      columnDefs: [
          {
              targets: 0,
              className: 'noVis'
          },
          {
              targets: 1,
              className: 'noVis'
          },
          {
              targets: 2,
              className: 'noVis'
          },
          {
              targets: 3,
              className: 'noVis'
          },
          {
              targets: 8,
              className: 'noVis'
          }
      ],
      "fnDrawCallback": function(oSettings) {
        if ($('.dataTables_wrapper tbody tr').length <= 10) {
            $('.dataTables_paginate .previous, .dataTables_paginate .next').hide();
        }
    }
    };
  }

  fetchAssets = () => {
    this.allData = [];
    this.autoCarrier = [];
    this.beverageRack = [];
    this.flatbed = [];
    this.controlledTemp = [];
    this.gondola = [];
    this.hopper = [];
    this.horseTrailer = [];
    this.liveStock = [];
    this.lowboy = [];
    this.stake = [];
    this.stepDeck = [];
    this.tanker = [];
    this.spinner.show(); // loader init
    this.apiService.getData(`assets?assetID=${this.assetID}&status=${this.currentStatus}`).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        console.log(result)
        this.spinner.hide(); // loader hide
        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].isDeleted === 0) {
            this.allData.push(result.Items[i]);
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
      this.allAssetTypes =  data.reduce( (a: any, b: any) => {
        return a[b['code']] = b['description'], a;
    }, {});
      console.log('trailers', this.allAssetTypes);
    })
  }

  deactivateAsset(value, assetID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`assets/isDeleted/${assetID}/${value}`)
      .subscribe((result: any) => {
        console.log('result', result);
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
}
