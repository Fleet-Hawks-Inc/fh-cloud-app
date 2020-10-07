import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: ['./vendors-list.component.css'],
})
export class VendorsListComponent implements OnInit {
  title = 'Vendor List';
  vendors = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchVendors();
  }

  fetchVendors() {
    this.apiService.getData('vendors').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.vendors = result.Items;
      },
    });
  }

  deleteVendor(vendorID) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData('vendors/' + vendorID)
      .subscribe((result: any) => {
        this.fetchVendors();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
