import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'

@Component({
  selector: 'app-customer-collection',
  templateUrl: './customer-collection.component.html',
  styleUrls: ['./customer-collection.component.css']
})
export class CustomerCollectionComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchCustomerCollection
  }

  async fetchCustomerCollection() {
    const result = await this.apiService.getData('contacts/get/customer/collection').toPromise();
  }

}
