import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-shipper-list',
  templateUrl: './shipper-list.component.html',
  styleUrls: ['./shipper-list.component.css']
})
export class ShipperListComponent implements OnInit {

  title = 'Shipper List';
  shippers;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.fetchShippers();
  }

  fetchShippers() {
    this.apiService.getData('shippers')
        .subscribe((result: any) => {
          this.shippers = result.Items;
        });
  }

  deleteShipper(shipperId) {
    this.apiService.deleteData('shippers/' + shipperId)
        .subscribe((result: any) => {
          this.fetchShippers();
        })
  }

}
