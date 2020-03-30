import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {

  title = 'Addresses List';
  addresses;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchAddresses();

  }

  fetchAddresses() {
    this.apiService.getData('addresses')
        .subscribe((result: any) => {
          this.addresses = result.Items;
        });
  }



  deleteAddress(documentId) {
    this.apiService.deleteData('addresses/' + documentId)
        .subscribe((result: any) => {
          this.fetchAddresses();
        })
  }

}
