import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  title = 'Customers List';
  customers;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchCustomers();

  }

  fetchCustomers() {
    this.apiService.getData('customers')
        .subscribe((result: any) => {
          this.customers = result.Items;
        });
  }



  deleteCustomer(customerId) {
    this.apiService.deleteData('customers/' + customerId)
        .subscribe((result: any) => {
          this.fetchCustomers();
        })
  }

}
