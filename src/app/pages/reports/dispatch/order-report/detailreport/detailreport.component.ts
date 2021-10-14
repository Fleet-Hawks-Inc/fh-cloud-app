import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services'
import Constant from 'src/app/pages/fleet/constants'
import { CurrencyPipe } from '@angular/common'
import * as moment from 'moment'


@Component({
  selector: 'app-detailreport',
  templateUrl: './detailreport.component.html',
  styleUrls: ['./detailreport.component.css']
})
export class DetailreportComponent implements OnInit {

  constructor(private apiService: ApiService, private currencyPipe: CurrencyPipe) { }
  totalOrdersCount = 0
  dispatchedCount = 0
  delieverdCount = 0
  deletedCount = 0
  canceledCount = 0
  tonuCount = 0
  records = []
  dataMessage = ''
  customers = {}
  lastItemSK = ''
  loaded = false
  months = []
  years = []
  ngOnInit() {
    this.months = moment.months()
    this.years.push(moment().year())
    this.years.push(moment().subtract(1, 'year').year())
    this.fetchCustomers();
    this.fetchDetailReport();
    this.fetchOrderReport();
  }
  async fetchOrderReport(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = '',
        this.records = []
    }
    if (this.lastItemSK !== 'end') {
      const result = await this.apiService.getData(`orders/report/paging?lastKey=${this.lastItemSK}`).toPromise();
      console.log(result)

      if (result.Items.length === 0) {

        this.dataMessage = Constant.NO_RECORDS_FOUND
      }
      if (result.Items.length > 0) {
        if (result.LastEvaluatedKey !== undefined) {
          this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].orderSK);
        }
        else {
          this.lastItemSK = 'end'
        }
        this.records = this.records.concat(result.Items)

        this.loaded = true;
      }
    }
  }
  async fetchCustomers() {
    const customers = await this.apiService.getData(`contacts/fetch/order/customers`).toPromise();
    customers.forEach(element => {
      this.customers[element.contactID] = element.companyName
    });
  }
  onScroll() {
    if (this.loaded) {
      this.fetchOrderReport();
    }
    this.loaded = false;
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
    // this.records = result.Items
    // console.log(this.records)
  }
  generateCSV() {
    let dataObject = []
    let csvArray = []
    this.records.forEach(element => {
      let obj = {}
      obj["Order#"] = element.orderNumber
      obj["Type"] = element.orderMode
      obj["DateTime"] = element.createdDate + element.createdTime
      obj["Cutomer"] = this.customers[element.customerID]
      obj["Confirmation#"] = element.cusConfirmation
      element.shippersReceiversInfo.forEach(item => {
        item.shippers.forEach(shipper => {
          obj["Pickup"] = this.customers[shipper.shipperID]
          shipper.pickupPoint.forEach(pickup => {
            obj["Pickup"] += " " + pickup.address.address + " " + pickup.address.cityName + " " +
              pickup.address.stateName + " " + pickup.address.countryCode
              + " " + pickup.address.zipCode
          });
        });

        item.receivers.forEach(receiver => {
          obj["DropOff"] = this.customers[receiver.receiverID]
          receiver.dropPoint.forEach(drop => {
            obj["DropOff"] += " " + drop.address.address + " " + drop.address.cityName + " " +
              drop.address.stateName + " " + drop.address.countryCode
              + " " + drop.address.zipCode
          });
        });
      });
      obj["Miles"] = element.milesInfo.totalMiles
      obj["Amount"] = this.currencyPipe.transform(element.totalAmount, element.charges.freightFee.currency)
      obj["Status"] = element.orderStatus
      dataObject.push(obj)
    });
    let headers = Object.keys(dataObject[0]).join(',')
    csvArray.push(headers)
    dataObject.forEach(element => {
      csvArray.push(Object.values(element).join(','))
    });
    console.log(csvArray);
  }

}
