import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { Router } from '@angular/router';
import { timer, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

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
  isChecked = false;
  selectedAssetID: any;
  assetCheckCount = null;

  dtOptions: any = {};
  dtTrigger = new Subject();

  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) {}

  ngOnInit() {

    this.dtOptions = {
      dom: 'Bfrtip', // lrtip to hide search field
      processing: true,
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
      buttons: [
          {
              extend: 'colvis',
              columns: ':not(.noVis)'
          }
      ],
      colReorder: {
        fixedColumnsLeft: 1
      },
      // buttons: [
      //   'colvis',
      // ],
    };
    this.fetchAssets();
  }

  ngOnDestroy = (): void => {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  // Count Checkboxes
  checkboxCount = () => {
    this.assetCheckCount = 0;
    this.allData.forEach(item => {
      console.log(item.checked);
      if (item.checked) {
        this.selectedAssetID = item.assetID;
        this.assetCheckCount = this.assetCheckCount + 1;
      }
    });
  }

  fetchAssets = () => {
    this.spinner.show(); // loader init
    this.apiService.getData('assets').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.allData = result.Items;
        this.spinner.hide(); // loader hide
        //console.log(this.allData)
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
            console.log('this.allData', this.allData)
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

  checkuncheckall = () => {
    this.allData.forEach(item => {
      if (item.checked === true) {
        item.checked = false;
      } else {
        item.checked = true;
      }
    });
    
  }
}
