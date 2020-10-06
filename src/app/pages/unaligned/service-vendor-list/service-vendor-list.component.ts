import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-service-vendor-list',
  templateUrl: './service-vendor-list.component.html',
  styleUrls: ['./service-vendor-list.component.css']
})
export class ServiceVendorListComponent implements OnInit {

  title = 'Service Vendor List';
  serviceVendors;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.fetchServiceVendors();
  }

  fetchServiceVendors() {
    this.apiService.getData('serviceVendors')
        .subscribe((result: any) => {
          this.serviceVendors = result.Items;
        });
  }

  deleteServiceVendor(serviceVendorId) {
    this.apiService.deleteData('serviceVendors/' + serviceVendorId)
        .subscribe((result: any) => {
          this.fetchServiceVendors();
        })
  }
}
