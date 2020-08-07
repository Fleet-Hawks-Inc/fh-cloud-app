import { Component, OnDestroy, OnInit } from "@angular/core";
import { ApiService } from "../../../api.service";
import { Router } from "@angular/router";
import { timer, Subject } from "rxjs";
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: "app-asset-list",
  templateUrl: "./asset-list.component.html",
  styleUrls: ["./asset-list.component.css"],
})
export class AssetListComponent implements OnInit {
  title = "Assets List";
  assetsData = [];
  isChecked = false;
  selectedAssetID : any;
  assetCheckCount = null;

  dtOptions: any = {};
  dtTrigger = new Subject();

  constructor(private apiService: ApiService, private router: Router,private toastr: ToastrService) {}

  ngOnInit() {

    this.dtOptions = {
      dom: 'Bfrtip', //lrtip to hide search field
      processing: true,
      colReorder: {
        fixedColumnsLeft: 1
      },
      buttons: [
        'colvis',
      ],
    }
    this.fetchAssets();
    
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

    
  // Count Checkboxes
  checkboxCount = () =>{
    this.assetCheckCount = 0;
    this.assetsData.forEach(item=>{
      if(item.checked){
        this.selectedAssetID = item.assetID;
        this.assetCheckCount= this.assetCheckCount+1;
      }  
    })
    console.log(this.assetCheckCount)
  }

  fetchAssets() {
    this.apiService.getData("assets").subscribe({
      complete: () => {
        //this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        this.assetsData = result.Items;
        // Calling the DT trigger to manually render the table
        //this.dtTrigger.next();
      },
    });
  }

  editAsset(){
    if(this.assetCheckCount == 1){
      this.router.navigateByUrl('/fleet/assets/Edit-Asset/'+this.selectedAssetID)
    } else {
      this.toastr.error('Please select only one asset!');
    }
    
  }
  deleteAsset() {
    const selectedAssets = this.assetsData.filter(product => product.checked).map(p => p.assetID)
    console.log(selectedAssets)
    if(selectedAssets && selectedAssets.length > 0) {
        for (let i = 0; i < selectedAssets.length; i++) {
            console.log(selectedAssets[i])
              this.apiService.deleteData("assets/" + selectedAssets[i]).subscribe((result: any) => {
              console.log("resul;t", result);
              // Call the dtTrigger to rerender again
              //this.dtTrigger.next();
              this.fetchAssets();
            });
        }
      
    }
  }

  

  
  checkuncheckall() {
    
    if (this.isChecked == true) {
      this.isChecked = false;
    }
    else {
      this.isChecked = true;
    }

  }
  
}
