import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: 'app-factoring-company-address-list',
  templateUrl: './factoring-company-address-list.component.html',
  styleUrls: ['./factoring-company-address-list.component.css']
})
export class FactoringCompanyAddressListComponent implements OnInit {

  title = "Address List";
  addresses = [];
  factoringCompany = [];
  factoringCompanyID = "";
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchfactoringCompany();
    this.getAddress();
  }

  fetchfactoringCompany() {
    this.apiService.getData("factoring-companys").subscribe((result: any) => {
      this.factoringCompany = result.Items;
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
    this.apiService.getData('addresses?docID=${this.factoringCompanyID}')
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
