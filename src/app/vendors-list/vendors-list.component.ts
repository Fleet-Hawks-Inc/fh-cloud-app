import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: ['./vendors-list.component.css']
})
export class VendorsListComponent implements OnInit {
  title = 'Vendors List';
  vendors = [];

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchVendors();

  }

  fetchVendors() {
    this.apiService.getData('vendors')
        .subscribe((result: any) => {
          this.vendors = result.Items;
        });
  }


  deleteVendor(vendorID) {
    this.apiService.deleteData('vendors/' + vendorID)
        .subscribe((result: any) => {
          this.fetchVendors();
        })
  }


}
