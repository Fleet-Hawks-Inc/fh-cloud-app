import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services/here-map.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css'],
})
export class AssetListComponent implements OnInit {
  title = 'Assets List';
  mapView: boolean = false ;
  listView: boolean = true;
  visible = true;
  allData = [];
  refers = [];
  drybox = [];
  flatbed = [];
  curtainSlide = [];
  autoHauler = [];
  dumpTipper = [];
  interModal = [];
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

  constructor(
    private apiService: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private hereMap: HereMapService) {}

  ngOnInit() {
      this.dataTableOptions();
      this.fetchAssets();
      $(document).ready(() => {
        setTimeout(() => {
          $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
        }, 2000);
        
      });
  }

  ngOnDestroy = (): void => {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
        }
    ],
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

    };
  }

  fetchAssets = () => {
    this.spinner.show(); // loader init
    this.apiService.getData('assets').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        console.log(result)
        this.spinner.hide(); // loader hide
        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].isActivate === 1) {
            alert(1);
            this.allData.push(result.Items[i]);
            if (result.Items[i].assetDetails.assetType === 'Reefer') {
              this.refers.push(result.Items[i]);
            } else if (result.Items[i].assetDetails.assetType === 'Drybox') {
              this.drybox.push(result.Items[i]);
            } else if (result.Items[i].assetDetails.assetType === 'Flatbed') {
              this.flatbed.push(result.Items[i]);
            } else if (result.Items[i].assetDetails.assetType === 'Curtain Side') {
              this.curtainSlide.push(result.Items[i]);
            } else if (result.Items[i].assetDetails.assetType === 'Auto Hauler') {
              this.autoHauler.push(result.Items[i]);
            } else if (result.Items[i].assetDetails.assetType === 'Dump/Tipper') {
              this.dumpTipper.push(result.Items[i]);
            } else if (result.Items[i].assetDetails.assetType === 'Intermodal Chassis') {
              this.interModal.push(result.Items[i]);
            } else if (result.Items[i].assetDetails.assetType === 'Livestock') {
              this.liveStock.push(result.Items[i]);
            } else if (result.Items[i].assetDetails.assetType === 'Lowboy') {
              this.lowboy.push(result.Items[i]);
            } else if (result.Items[i].assetDetails.assetType === 'Stake') {
              this.stake.push(result.Items[i]);
            } else if (result.Items[i].assetDetails.assetType === 'Step Deck') {
              this.stepDeck.push(result.Items[i]);
            } else {
              this.tanker.push(result.Items[i]);
            }
          }
        }
      },
    });
  }

  deactivateAsset(value, assetID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData('assets/' + assetID)
      .subscribe((result: any) => {
        result = result.Items[0];
        result.isActivate = 0;
        delete result['carrierID'];
        console.log('result', result);
        this.apiService.putData('assets', result).subscribe({
          next: (res) => {
            this.response = res;
            this.hasSuccess = true;
            this.toastr.success('Asset Deleted successfully');
            this.fetchAssets();
            this.Success = '';
          },
        });
      });
    }
    // return x; 
    // $('#confirmModal').modal('show');
    // console.log(value, assetID);
    
  }

  deleteAsset() {
    this.hasError = false;
    this.hasSuccess = false;
    // this.apiService.putData('assets', this.assetsData).subscribe({
    //   complete: () => { },
    //   error: (err) => {
    //     from(err.error)
    //       .pipe(
    //         map((val: any) => {
    //           const path = val.path;
    //           // We Can Use This Method
    //           const key = val.message.match(/'([^']+)'/)[1];
    //           console.log(key);
    //           val.message = val.message.replace(/'.*'/, 'This Field');
    //           // this.errors[key] = val.message;
    //         })
    //       )
    //       .subscribe({
    //         complete: () => {
    //           // this.throwErrors();
    //         },
    //         error: () => { },
    //         next: () => { },
    //       });
    //   },
    //   next: (res) => {
    //     this.response = res;
    //     this.hasSuccess = true;
    //     this.toastr.success('Asset updated successfully');
    //     this.router.navigateByUrl('/fleet/assets/Assets-List');
    //     this.Success = '';
    //   },
    // });
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
