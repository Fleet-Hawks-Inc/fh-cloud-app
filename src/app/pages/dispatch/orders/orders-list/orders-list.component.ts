import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
  orders;
  constructor(private apiService: ApiService,) { }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders = () => {
    // this.spinner.show(); // loader init
    this.apiService.getData('documents').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.orders = result;
        }
      });
  };

}
