import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../api.service";
import {Router} from "@angular/router";
import { timer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-shipper-list',
  templateUrl: './shipper-list.component.html',
  styleUrls: ['./shipper-list.component.css']
})
export class ShipperListComponent implements OnInit {

  title = 'Shipper List';
  shippers = [];

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.fetchShippers();
  }

  fetchShippers() {
    this.apiService.getData('shippers')
        .subscribe({
          complete: () => {
            this.initDataTable();
          },
          error: () => {},
          next: (result: any) => {
            console.log(result);
            this.shippers = result.Items;
          },
        });
  }

  deleteShipper(shipperID) {

         /******** Clear DataTable ************/
         if ($.fn.DataTable.isDataTable('#datatable-default')) {
          $('#datatable-default').DataTable().clear().destroy();
          }
          /******************************/

    this.apiService.deleteData('shippers/' + shipperID)
        .subscribe((result: any) => {
          this.fetchShippers();
        });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }

}
