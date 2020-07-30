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
  

  fetchAssets() {
    this.apiService.getData("assets").subscribe({
      complete: () => {
        //this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log("res",result);
        this.assetsData = result.Items;
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      },
    });
  }

  deleteAsset(assetId) {
     /******** Clear DataTable ************/
     if ($.fn.DataTable.isDataTable("#datatable-default")) {
      $("#datatable-default").DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData("assets/" + assetId).subscribe((result: any) => {
      this.fetchAssets();
    });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
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
