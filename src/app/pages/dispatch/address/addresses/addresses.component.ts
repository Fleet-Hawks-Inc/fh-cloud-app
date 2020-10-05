import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {

  title = 'Address List';
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



  deleteAddress(addressID) {
    this.apiService.deleteData('addresses/' + addressID)
        .subscribe((result: any) => {
          this.fetchAddresses();
        })
  }

}
