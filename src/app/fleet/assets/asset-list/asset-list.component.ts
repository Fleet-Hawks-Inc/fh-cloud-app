import { Component, OnDestroy, OnInit } from "@angular/core";
import { ApiService } from "../../../api.service";
import { Router } from "@angular/router";
import { timer, Subject } from "rxjs";
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

  dtOptions: any = {};
  dtTrigger = new Subject();

  constructor(private apiService: ApiService, private router: Router) {}

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
    let count = 0;
    this.assetsData.forEach(item=>{
      if(item.checked){
        console.log(item);
        this.selectedAssetID = item.assetID;
        count= count+1;
      }  
    })
    console.log(count)
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
        this.dtTrigger.next();
      },
    });
  }

  editAsset(){
    console.log(this.selectedAssetID);
    this.router.navigateByUrl('/fleet/assets/Edit-Asset/'+this.selectedAssetID)
  }
  deleteAsset() {
    console.log(this.selectedAssetID)
     /******** Clear DataTable ************/
     if ($.fn.DataTable.isDataTable("#datatable-default")) {
      $("#datatable-default").DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData("assets/" + this.selectedAssetID).subscribe((result: any) => {
      
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
      this.fetchAssets();
    });
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
