import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: 'app-receiver-address-list',
  templateUrl: './receiver-address-list.component.html',
  styleUrls: ['./receiver-address-list.component.css']
})
export class ReceiverAddressListComponent implements OnInit {

  title = "Address List";
  addresses = [];
  receivers = [];
  receiverID = "";
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchreceivers();
    this.getAddress();
  }

  fetchreceivers() {
    this.apiService.getData("receivers").subscribe((result: any) => {
      this.receivers = result.Items;
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
    this.apiService.getData('addresses?docID=${this.receiverID}')
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
