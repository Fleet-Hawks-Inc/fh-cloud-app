import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../api.service";
import {Router} from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  title = 'Customers List';
  customers = [];

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.apiService.getData('customers')
        .subscribe({
          complete: () => {
            this.initDataTable();
          },
          error: () => {},
          next: (result: any) => {
            console.log(result);
            this.customers = result.Items;
          },
        });
  }



  deleteCustomer(customerID) {

        /******** Clear DataTable ************/
        if ($.fn.DataTable.isDataTable('#datatable-default')) {
          $('#datatable-default').DataTable().clear().destroy();
          }
          /******************************/

    this.apiService.deleteData('customers/' + customerID)
        .subscribe((result: any) => {
          this.fetchCustomers();
        })
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}
