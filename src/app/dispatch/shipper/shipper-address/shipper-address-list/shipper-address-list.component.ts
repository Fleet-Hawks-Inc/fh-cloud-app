import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: 'app-shipper-address-list',
  templateUrl: './shipper-address-list.component.html',
  styleUrls: ['./shipper-address-list.component.css']
})
export class ShipperAddressListComponent implements OnInit {

  title = "Address List";
  addresses = [];
  shippers = [];
  shipperID = "";
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchShippers();
    this.getAddress();
  }

  fetchShippers() {
    this.apiService.getData("shippers").subscribe((result: any) => {
      this.shippers = result.Items;
    });
    //console.log(this.drivers);
  }

  // getAddress() {
  //   this.apiService.getData(`eventLogs/HOSSummary?userName=${this.userName}&fromDate=${from}&toDate=${to}`).subscribe((result: any) => {
  //     this.addresses = result;
  //   });
  //   console.log(this.addresses);
  // }

  getAddress() {
    this.apiService.getData('addresses?docID=${this.shipperID}')
        .subscribe({
          complete: () => {
            this.initDataTable();
          },
          error: () => {},
          next: (result: any) => {
            console.log(result);
            this.addresses = result.Items;
          },
        });
  }

  deleteAddress(addressID) {

             /******** Clear DataTable ************/
             if ($.fn.DataTable.isDataTable('#datatable-default')) {
              $('#datatable-default').DataTable().clear().destroy();
              }
              /******************************/

    this.apiService.deleteData('addresses/' + addressID)
        .subscribe((result: any) => {
          this.getAddress();
        })
  }
  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }

}
