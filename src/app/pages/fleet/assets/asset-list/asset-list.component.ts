import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css'],
})
export class AssetListComponent implements OnInit {
  title = 'Assets List';
  allData = [];
  refers = [];
  drybox = [];
  flatbed = [];
  curtainSlide = [];
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

  message: any;
  dtTrigger = new Subject();

  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) {}

  ngOnInit() {
      this.dataTableOptions();
      this.fetchAssets();
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
      select: {
          style:    'multi',
          selector: 'td:first-child'
      },
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
          orderable: false,
          className: 'select-checkbox noVis',
          targets:   0
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
      rowCallback: (row: Node, allData: any[] | Object, index: number) => {
        const self = this;
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          console.log(row);
          console.log($(row).data().length);
          self.someClickHandler(allData);
          console.log(allData, this.message)
        });
        return row;
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
        this.allData = result.Items;
        this.spinner.hide(); // loader hide
        console.log(this.allData);
        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].assetDetails.assetType === 'Reefer') {
            this.refers.push(this.allData[i]);
          } else if (result.Items[i].assetDetails.assetType === 'Drybox') {
            this.drybox.push(this.allData[i]);
          } else if (result.Items[i].assetDetails.assetType === 'Flatbed') {
            this.flatbed.push(this.allData[i]);
          } else if (result.Items[i].assetDetails.assetType === 'Curtain Side') {
            this.curtainSlide.push(this.allData[i]);
          } else {
            this.allData = this.allData;
          }
        }
      },
    });
  }

  editAsset = () => {
    if (this.assetCheckCount === 1) {
      this.router.navigateByUrl('/fleet/assets/Edit-Asset/' + this.selectedAssetID);
    } else {
      this.toastr.error('Please select only one asset!');
    }
  }
  deleteAsset = () => {
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

  uncheckCheckbox = (arr) => {
    arr.forEach(item => {
      item.checked = false;
    });
    this.headCheckbox = false;
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
  checkuncheckall = (ev) => {
    if (ev.target.checked === true) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }
}
