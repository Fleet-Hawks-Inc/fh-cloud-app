import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services'
import Constant from 'src/app/pages/fleet/constants'
import { CurrencyPipe } from '@angular/common'
import * as moment from 'moment'
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-detailreport',
  templateUrl: './detailreport.component.html',
  styleUrls: ['./detailreport.component.css']
})
export class DetailreportComponent implements OnInit {

  constructor(private apiService: ApiService, private currencyPipe: CurrencyPipe, private toastr: ToastrService) { }
  totalOrdersCount = 0
  dispatchedCount = 0
  delieverdCount = 0
  deletedCount = 0
  canceledCount = 0
  tonuCount = 0

  records: any = []

  dataMessage = ''
  customers = {}
  lastItemSK = ''
  loaded = false
  months = []
  years = []
  selectedMonth = ''
  selectedYear = ''

  vehicles = {}
  assets = {}
  drivers = {}

  ngOnInit() {
    this.months = moment.months()
    this.years.push(moment().year())
    this.years.push(moment().subtract(1, 'year').year())
    this.fetchCustomers();

    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.fetchDetailReport();
    this.fetchOrderReport();
  }

  async fetchVehicles() {
    const result = await this.apiService.getData('vehicles/get/list').toPromise();
    this.vehicles = result

  }
  async fetchAssets() {
    const result = await this.apiService.getData('assets/get/list').toPromise();
    this.assets = result
  }
  async fetchDrivers() {
    const result = await this.apiService.getData('drivers/get/list').toPromise()
    this.drivers = result
  }
  async search() {
    this.totalOrdersCount = 0
    this.deletedCount = 0
    this.delieverdCount = 0
    this.dispatchedCount = 0
    this.canceledCount = 0
    this.tonuCount = 0

    if (this.selectedYear && this.selectedMonth) {
      this.lastItemSK = 'end';
      this.records = []
      this.dataMessage = Constant.FETCHING_DATA
      const result = await this.apiService.getData(`orders/report/search?month=${this.selectedMonth}&year=${this.selectedYear}`).toPromise();
      if (result.Items.length > 0) {

        this.totalOrdersCount = result.Count
        result.Items.forEach(element => {

          if (element.isDeleted == 1) this.deletedCount++
          if (element.orderStatus == "delivered") this.delieverdCount++
          if (element.orderStatus == "dispatched") this.dispatchedCount++
          if (element.orderStatus == "canceled") this.canceledCount++
          if (element.orderStatus == "tonu") this.tonuCount++

        });

        this.records = result.Items
      }
      else {
        this.dataMessage = Constant.NO_RECORDS_FOUND
      }


    }
    else {
      this.toastr.error("Year and Month required")
    }
  }
  reset() {
    this.selectedMonth = ''
    this.selectedYear = ''
    this.lastItemSK = '';
    this.records = []

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
      this.dataMessage = Constant.FETCHING_DATA


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
        this.records = this.records.concat(result.Items);
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

    this.totalOrdersCount = 0;
    this.delieverdCount = 0;
    this.dispatchedCount = 0;
    this.canceledCount = 0
    this.tonuCount = 0

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
    if (this.records.length > 0) {
      let dataObject = []
      let csvArray = []
      this.records.forEach(element => {
        let obj = {}
        obj["Order#"] = element.orderNumber

        obj["Trip#"] = element.tripData && element.tripData.tripNo ? element.tripData.tripNo : ''

        obj["Type"] = element.orderMode
        obj["DateTime"] = element.createdDate + " " + element.createdTime
        obj["Cutomer"] = this.customers[element.customerID]
        obj["Confirmation#"] = element.cusConfirmation;
        obj["Customer PO#"] = element.cusPOs && element.cusPOs.length > 0 ? element.cusPOs.join('/') : ' '
        obj["Drivers"] = ''
        obj["Vehicles"] = ''
        obj["Assets"] = ''
        if (element.tripData && element.tripData.driverIDs && element.tripData.driverIDs.length > 0) {

          element.tripData.driverIDs.forEach(element => {

            obj["Drivers"] += this.drivers[element] + ";"
          });
        }
        if (element.tripData && element.tripData.vehicleIDs && element.tripData.vehicleIDs.length > 0) {

          element.tripData.vehicleIDs.forEach(element => {
            obj["Vehicles"] += this.vehicles[element] + ";"
          });
        }
        if (element.tripData && element.tripData.assetIDs && element.tripData.assetIDs.length > 0) {

          element.tripData.assetIDs.forEach(element => {
            obj["Assets"] += this.assets[element] + ";"
          });
        }
        element.shippersReceiversInfo.forEach(item => {
          item.shippers.forEach(shipper => {
            obj["Pickup"] = this.customers[shipper.shipperID]
            if (shipper.pickupPoint.length > 0) {
              shipper.pickupPoint.forEach(pickup => {
                pickup.address.address = pickup.address.address.split(',').join(' ')
                obj["Pickup"] += " " + pickup.address.address + " " + pickup.address.cityName + " " +
                  pickup.address.stateName + " " + pickup.address.countryCode
                  + " " + pickup.address.zipCode + " "
                if (pickup.commodity.length > 0) {
                  pickup.commodity.forEach(element => {
                    obj["Pickup"] += "PU# " + element.pu
                  });
                }
              });
            }

          });

          item.receivers.forEach(receiver => {
            obj["DropOff"] = this.customers[receiver.receiverID]
            if (receiver.dropPoint.length > 0) {
              receiver.dropPoint.forEach(drop => {
                drop.address.address = drop.address.address.split(',').join(' ')
                obj["DropOff"] += " " + drop.address.address + " " + drop.address.cityName + " " +
                  drop.address.stateName + " " + drop.address.countryCode
                  + " " + drop.address.zipCode + " "
                if (drop.commodity.length > 0) {
                  drop.commodity.forEach(element => {
                    obj["DropOff"] += "DEL# " + element.del

                  });
                }
              });
            }

          });
        });
        obj["Miles"] = element.milesInfo.totalMiles
        obj["Amount"] = element.charges.freightFee.currency + ' ' + element.totalAmount
        obj["Status"] = element.orderStatus
        dataObject.push(obj)
      });
      let headers = Object.keys(dataObject[0]).join(',')
      headers += ' \n'
      csvArray.push(headers)
      dataObject.forEach(element => {
        let obj = Object.values(element).join(',')
        obj += ' \n'
        csvArray.push(obj)
      });
      const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });

      const link = document.createElement('a');
      if (link.download !== undefined) {

        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Order-Report.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      }
    }
    else {
      this.toastr.error("No Records found")
    }
  }

}
