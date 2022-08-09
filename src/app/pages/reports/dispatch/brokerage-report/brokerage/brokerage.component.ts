import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services'
import Constant from 'src/app/pages/fleet/constants'
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment'
declare var $: any;



@Component({
  selector: 'app-brokerage',
  templateUrl: './brokerage.component.html',
  styleUrls: ['./brokerage.component.css']
})
export class BrokerageComponent implements OnInit {
  @ViewChild('dt') table: Table;
  brokerage: any = [];
  pickUpLocation = '';
  delVrLocation = '';
  get = _.get;
  _selectedColumns: any[];
  lastItemSK = '';
  dataMessage = ''
  brkDateEnUS:any = [];
  carriersObject = [];
  orderNumber = '';
  customers = {}
  loaded = false;
  dataColumns = [
    { field: 'orderNumber', header: 'Order#', type: "text" },
    { field: 'tripData.tripNo', header: 'Trip#', type: "text" },
    { field: 'customerName', header: 'Customers', type: "text" },
    { field: 'cName', header: 'Carrier', type: "text" },
    { field: 'createdDate', header: 'Order Date', type: "text" },
    { field: 'date', header: 'Bkg. Date', type: "text" },
    { field: 'pickupAddress', header: 'Pickup Location', type: "text" },
    { field: 'dropoffAddress', header: 'Delivery Location', type: "text" },
    { field: 'amount', header: 'Order Amount', type: "text" },
    { field: 'bAmount', header: 'Bkg Amount', type: "text" },
  ];
  constructor(
  private apiService: ApiService,
   private toastr: ToastrService,
   private router: Router,
  ) { }

  ngOnInit(): void {
  this.fetchBrokerageReport();
  this.setToggleOptions();
  this.fetchCarriers();
  this.fetchCustomers();
  }




  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
  }


  async fetchCarriers() {
    let result: any = await this.apiService
      .getData("contacts/get/type/carrier")
      .toPromise();
    let carrs = [];
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      if (element.isDeleted === 0) {
        carrs.push(element);
      }
    }
    this.carriersObject = carrs.reduce((a: any, b: any) => {
      return (a[b["contactID"]] = b["companyName"]), a;
    }, {});
  }


  async fetchCustomers() {
    const customers = await this.apiService.getData(`contacts/fetch/order/customers`).toPromise();
    customers.forEach(element => {
      this.customers[element.contactID] = element.companyName
    });
  }

  
async fetchBrokerageReport(refresh ?: boolean) {
    if (refresh === true) {
        this.lastItemSK = '',
            this.brokerage = [];
    }
    if (this.lastItemSK !== 'end') {
        const result = await this.apiService.getData(`orders/report/getBrokerageReport?orderNumber=${this.orderNumber}&lastKey=${this.lastItemSK}`).toPromise();
        this.dataMessage = Constant.FETCHING_DATA;
        if (result.Items.length === 0) {
            this.dataMessage = Constant.NO_RECORDS_FOUND;
            this.loaded = true;
        }
        if (result.Items.length > 0) {
            if (result.LastEvaluatedKey !== undefined) {
                this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].orderSK);
            } else {
                this.lastItemSK = 'end'
            }
            this.brokerage = this.brokerage.concat(result.Items);
            this.loaded = true;
            for (let res of result.Items) {
                for (let shipInfo of res.shippersReceiversInfo) {
                    for (let shipData of shipInfo.shippers) {
                        for (let shipPickUp of shipData.pickupPoint) {
                            if (shipPickUp.address.manual) {
                                res.pickupAddress = shipPickUp.address.address + ' ' +
                                    + ' ' + shipPickUp.address.cityName + ' ' + shipPickUp.address.stateName + ' ' +
                                    shipPickUp.address.countryName + ' ' + shipPickUp.address.zipCode
                            } else if (!shipPickUp.address.manual) {
                                res.pickupAddress = shipPickUp.address.pickupLocation
                            }
                            else if (shipPickUp.length > 1) {
                                res.pickupAddress = shipPickUp.length - 1
                            }
                        }
                    }
                    for (let receiver of shipInfo.receivers) {
                        for (let receiveDropOf of receiver.dropPoint) {
                            if (receiveDropOf.address.manual) {
                                res.dropoffAddress = receiveDropOf.address.address + ' ' +
                                    + ' ' + receiveDropOf.address.cityName + ' ' + receiveDropOf.address.stateName + ' ' +
                                    receiveDropOf.address.countryName + ' ' + receiveDropOf.address.zipCode
                            }
                            else if (!receiveDropOf.address.manual) {
                                res.dropoffAddress = receiveDropOf.address.dropOffLocation
                            }
                            else if (receiveDropOf.length > 1) {
                                res.dropoffAddress = receiveDropOf.length - 1
                            }
                        }
                    }
                }
            }
        }
    }
}
    
    
  onScroll = async (event: any) => {
    if (this.loaded) {
      this.fetchBrokerageReport();
    }
    this.loaded = false;
  }
  
  
  searchFilter(){
  if(this.orderNumber !== ''){
  this.orderNumber = this.orderNumber;
  this.brokerage = [];
  this.dataMessage = Constant.FETCHING_DATA;
  this.lastItemSK = '';
  this.fetchBrokerageReport();
  }else{
  return false;
  }
  }
  
  resetFilter(){
  if(this.orderNumber !== ''){
  this.brokerage = [];
  this.loaded = false;
  this.lastItemSK = '';
  this.orderNumber = '';
  this.fetchBrokerageReport();
  this.dataMessage = Constant.FETCHING_DATA;
  }else{
  return false;
  }
  }
  
  refreshData() {
    this.brokerage = [];
    this.lastItemSK = '';
    this.loaded = false;
    this.fetchBrokerageReport();
    this.dataMessage = Constant.FETCHING_DATA;
  }
  
  
  exportBrokerage(){
  if(this.brokerage.length > 0){
  let dataObject = []
  let csvArray = []
  this.brokerage.forEach(element => {
  let obj = {}
  obj['Order#'] = element.orderNumber
  obj['Trip#'] = element.tripData.tripNo
  obj['Customers'] = this.customers[element.customerID] 
  obj['Carrier'] = this.carriersObject[element.brkCarrID] 
  obj['Order Date'] = element.createdDate
  obj['Bkg. Date'] = element.date
  obj['Order Amount'] = element.amount
  obj['Bkg. Amount'] = element.bAmount
  dataObject.push(obj)
  });
  let headers = Object.keys(dataObject[0]).join(',')
            headers += '\n'
            csvArray.push(headers)
            dataObject.forEach(element => {
                let obj = Object.values(element).join(',')
                obj += '\n'
                csvArray.push(obj)
            });
            const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Brokerage-Report.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
  }
  else {
   this.toastr.error("No Records found")
  }
  }
  
  
    directToDetail(orderID: string) {
    setTimeout(() => {
      this.router.navigateByUrl(`/dispatch/orders/detail/${orderID}`);
    }, 10);
  }
  
  
    /**
 * Clears the table filters
 * @param table Table 
 */
  clear(table: Table) {
    table.clear();
  }
}
