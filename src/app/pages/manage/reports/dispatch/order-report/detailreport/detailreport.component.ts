import { Component, OnInit } from '@angular/core';
import { ApiService, ListService } from '../../../../../../services'
import Constant from 'src/app/pages/fleet/constants'

@Component({
  selector: 'app-detailreport',
  templateUrl: './detailreport.component.html',
  styleUrls: ['./detailreport.component.css']
})
export class DetailreportComponent implements OnInit {

  constructor(private apiService: ApiService, private listService: ListService) { }
  totalOrdersCount = 0
  dispatchedCount = 0
  delieverdCount = 0
  deletedCount = 0
  canceledCount = 0
  tonuCount = 0
  records = []
  dataMessage = ''
  customers = {}
  ngOnInit() {
    this.fetchCustomers();
    this.fetchDetailReport();
  }
  async fetchCustomers() {
    const customers = await this.apiService.getData(`contacts/fetch/order/customers`).toPromise();
    customers.forEach(element => {
      this.customers[element.contactID] = element.companyName
    });
  }

  async fetchDetailReport() {
    const result = await this.apiService.getData('orders/report/detail').toPromise()
    this.totalOrdersCount = result.Count
    if (this.totalOrdersCount == 0) this.dataMessage = Constant.NO_RECORDS_FOUND
    result.Items.forEach(element => {
      if (element.isDeleted == 1) this.deletedCount++
      if (element.orderStatus == "delivered") this.delieverdCount++
      if (element.orderStatus == "dispatched") this.dispatchedCount++
      if (element.orderStatus == "canceled") this.canceledCount++
      if (element.orderStatus == "tonu") this.tonuCount++

    });
    this.records = result.Items
    console.log(this.records)


  }

}
