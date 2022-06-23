import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApiService, HereMapService } from 'src/app/services'
import { NgxSpinnerService } from "ngx-spinner";
import { Overlay } from "ngx-toastr";
import Constant from 'src/app/pages/fleet/constants'
import { CurrencyPipe } from '@angular/common'
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import * as html2pdf from "html2pdf.js";
import { environment } from "src/environments/environment";
import * as moment from 'moment'
import { ToastrService } from "ngx-toastr";
import { ListService } from "src/app/services/list.service";
import * as _ from "lodash";
import { DashboardUtilityService } from "src/app/services/dashboard-utility.service";
import { Table } from 'primeng/table';
import { NgSelectComponent } from "@ng-select/ng-select";
import { OverlayPanel } from "primeng/overlaypanel";
import { Router } from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-detailreport',
  templateUrl: './detailreport.component.html',
  styleUrls: ['./detailreport.component.css']
})
export class DetailreportComponent implements OnInit {

  
  
  Asseturl = this.apiService.AssetUrl;
   environment = environment.isFeatureEnabled;
  @ViewChild('dt') table: Table;
  @ViewChild('op') overlaypanel: OverlayPanel;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  @ViewChild("confirmEmailModal", { static: true })
  confirmEmailModal: TemplateRef<any>;

  @ViewChild("schedularModal", {static:true}) schedularModal:TemplateRef<any>

  dataMessage: string = Constant.FETCHING_DATA;
  noOrdersMsg = Constant.NO_RECORDS_FOUND;
  totalOrdersCount = 0
  dispatchedCount = 0
  delieverdCount = 0
  deletedCount = 0
  canceledCount = 0
  tonuCount = 0

 isSearch: boolean = false;
  records: any = []

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
  
  customerValue = "";

  totalRecords = 10;
  pageLength = 10;
  ordersNext = false;
  ordersPrev = true;
  ordersDraw = 0;
  ordersPrevEvauatedKeys = [""];
  ordersStartPoint = 1;
  ordersEndPoint = this.pageLength;

  newOrderID: string;
  newOrderNumber: string;
  newCustomerID: string;
  confirmIndex: number;
  confirmRef: any;

  isConfirm: boolean = false;
  
  isLoad: boolean = false;
  isLoadText = "Load More...";
  listView = true;
  visible = true;

  detailUrl = []
  disableSearch = false;
  filterStatus = null;

  dataColumns: any[];
  get = _.get;
  find = _.find;
  _selectedColumns: any[];
  // pickupLocData = []
  isOrderPriceEnabled = environment.isOrderPriceEnabled
  customersObjects: any = {};

   constructor(private apiService: ApiService,
  private currencyPipe: CurrencyPipe,
  private toastr: ToastrService,
  private modalService: NgbModal,
  private spinner: NgxSpinnerService,
  private listService: ListService,
  private dashboardUtilityService: DashboardUtilityService,
  private router: Router,
  protected _sanitizer: DomSanitizer,
  private hereMap: HereMapService) { }
  

  async ngOnInit() {
    this.months = moment.months()
    this.years.push(moment().year())
    this.years.push(moment().subtract(1, 'year').year())
    this.fetchCustomers();

    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.fetchDetailReport();
     this.fetchOrderReport();
     this.dataColumns = [
      { width: '7%', field: 'orderNumber', header: 'Order', type: "text", },
      { width: '7%', field: 'tripData.tripNo', header: 'Trip', type: "text", },
      { width: '7%', field: 'orderMode', header: 'Type', type: "text" },
      { width: '8%', field: 'createdDate', header: 'Date', type: "text" },
      { width: '10%', field: 'customers', header: 'Customer', type: 'text' },
      { width: '9%', field: 'cusConfirmation', header: 'Confirmation', type: 'text' },
      { width: '7%', field: 'vehicles', header: 'Vehicles', type: 'text' },
      { width: '9%', field: 'tripData.assetIDs', header: 'Assets', type: 'text' },
      { width: '10%', field: 'drivers', header: 'Drivers', type: 'text' },
      { width: '8%', field:'cusPOs', header: 'Customer PO', type: 'text' },
      { width: '8%', field: 'milesInfo.totalMiles', header: 'Miles', type: 'text' },
      { width: '8%', field: 'totalAmount', header: 'Amount', type: 'text' },
      { width: '8%', field: 'orderStatus', header: 'Status', type: 'text' },
    ];
    this._selectedColumns = this.dataColumns;
     this.setToggleOptions();
  }
  
    setFilterStatus(val) {
    this.filterStatus = val;
  }
  
   setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  
  clear(table: Table) {
    table.clear();
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));

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
        console.log('result',this.records)
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
        obj["Confirmation#"] = element.cusConfirmation.split(',').join('/');
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
