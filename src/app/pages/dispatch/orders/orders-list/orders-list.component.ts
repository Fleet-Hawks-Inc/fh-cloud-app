import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import  Constants  from '../../../fleet/constants';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  orders = [];
  confirmOrders = [];
  dispatchOrders = [];
  deliveredOrders = [];
  cancelledOrders = [];
  invoicedOrders = [];
  partiallyOrders = [];

  lastEvaluatedKey = '';
  orderFiltr = {
    searchValue: '',
    startDate: '',
    endDate: '',
    category: null,
    start: '',
    end: ''
  };
  totalRecords = 10;
  pageLength = 10;
  serviceUrl = '';
  activeTab = 'all';

  allordersCount = 0;
  confirmedOrdersCount = 0;
  dispatchedOrdersCount = 0;
  deliveredOrdersCount = 0;
  cancelledOrdersCount = 0;
  quotedOrdersCount = 0;
  invoicedOrdersCount = 0;
  partiallyPaidOrdersCount = 0;
  customersObjects: any = {};

  ordersNext = false;
  ordersPrev = true;
  ordersDraw = 0;
  ordersPrevEvauatedKeys = [''];
  ordersStartPoint = 1;
  ordersEndPoint = this.pageLength;

  confirmOrdersNext = false;
  confirmOrdersPrev = true;
  confirmOrdersDraw = 0;
  confirmOrdersPrevEvauatedKeys = [''];
  confirmOrdersStartPoint = 1;
  confirmOrdersEndPoint = this.pageLength;
  confirmLastEvaluatedKey = '';

  dispatchOrdersNext = false;
  dispatchOrdersPrev = true;
  dispatchOrdersDraw = 0;
  dispatchOrdersPrevEvauatedKeys = [''];
  dispatchOrdersStartPoint = 1;
  dispatchOrdersEndPoint = this.pageLength;
  dispatchLastEvaluatedKey = '';

  deliverOrdersNext = false;
  deliverOrdersPrev = true;
  deliverOrdersDraw = 0;
  deliverOrdersPrevEvauatedKeys = [''];
  deliverOrdersStartPoint = 1;
  deliverOrdersEndPoint = this.pageLength;
  deliverLastEvaluatedKey = '';

  cancelOrdersNext = false;
  cancelOrdersPrev = true;
  cancelOrdersDraw = 0;
  cancelOrdersPrevEvauatedKeys = [''];
  cancelOrdersStartPoint = 1;
  cancelOrdersEndPoint = this.pageLength;
  cancelLastEvaluatedKey = '';

  invoiceOrdersNext = false;
  invoiceOrdersPrev = true;
  invoiceOrdersDraw = 0;
  invoiceOrdersPrevEvauatedKeys = [''];
  invoiceOrdersStartPoint = 1;
  invoiceOrdersEndPoint = this.pageLength;
  invoiceLastEvaluatedKey = '';

  partialPaidOrdersNext = false;
  partialPaidOrdersPrev = true;
  partialPaidOrdersDraw = 0;
  partialPaidOrdersPrevEvauatedKeys = [''];
  partialPaidOrdersStartPoint = 1;
  partialPaidOrdersEndPoint = this.pageLength;
  partialPaidLastEvaluatedKey = '';
  categoryFilter = [
    {
      'name': 'Order Number',
      'value': 'orderNumber'
    },
    {
      'name': 'Customer',
      'value': 'customer'
    },
    {
      'name': 'Order Type',
      'value': 'orderType'
    },
    {
      'name': 'Location',
      'value': 'location'
    },
  ]

  constructor(private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchOrders();
    this.initDataTable();
    this.fetchCustomersByIDs();
    this.initDataTableConfirmed();
    this.initDataTableDispatched();
    this.initDataTableDelivered();
    this.initDataTableCancelled();
    this.initDataTableInvoiced();
    this.initDataTablePartlyPaid();
  }

  fetchOrders = () => {
    this.allordersCount = 0;
    this.confirmedOrdersCount = 0;
    this.dispatchedOrdersCount = 0;
    this.deliveredOrdersCount = 0;
    this.cancelledOrdersCount = 0;
    this.quotedOrdersCount = 0;
    this.invoicedOrdersCount = 0;
    this.partiallyPaidOrdersCount = 0;
    
    this.apiService.getData('orders').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count; 
        for (let i = 0; i < result.Items.length; i++) {
          const element = result.Items[i];
          this.allordersCount = this.allordersCount + 1;
          this.totalRecords = this.allordersCount;
          if (element.orderStatus == 'confirmed') {
            this.confirmedOrdersCount = this.confirmedOrdersCount + 1;
          } else if (element.orderStatus == 'dispatched') {
            this.dispatchedOrdersCount = this.dispatchedOrdersCount + 1;
          } else if (element.orderStatus == 'delivered') {
            this.deliveredOrdersCount = this.deliveredOrdersCount + 1;
          } else if (element.orderStatus == 'cancelled') {
            this.cancelledOrdersCount = this.cancelledOrdersCount + 1;
          } else if (element.orderStatus == 'quoted') {
            this.quotedOrdersCount = this.quotedOrdersCount + 1;
          } else if (element.orderStatus == 'invoiced') {
            this.invoicedOrdersCount = this.invoicedOrdersCount + 1;
          } else if (element.orderStatus == 'partiallyPaid') {
            this.partiallyPaidOrdersCount = this.partiallyPaidOrdersCount + 1;
          }
        }
      }
    });
  };

  fetchOrdersCount() {
    this.apiService.getData('orders/get/filter/count?searchValue='+this.orderFiltr.searchValue+"&startDate="+this.orderFiltr.start+"&endDate="+this.orderFiltr.end +"&category="+this.orderFiltr.category).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
      },
    });
  }

  /*
   * Get all customers's IDs of names from api
   */
  fetchCustomersByIDs() {
    this.apiService.getData('customers/get/list').subscribe((result: any) => {
      this.customersObjects = result;
    });
  }

  fetchTabData(tabType) {
    this.activeTab = tabType;
  }

  initDataTable() {
    this.spinner.show();
    // this.orders = [];
    this.apiService.getData('orders/fetch/records/all?searchValue='+this.orderFiltr.searchValue+"&startDate="+this.orderFiltr.start+"&endDate="+this.orderFiltr.end +"&category="+this.orderFiltr.category + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.getStartandEndVal('all');
        this.orders = result['Items'];
        if (this.orderFiltr.searchValue !== '' || this.orderFiltr.start !== '' ) {
          this.ordersStartPoint = 1;
          this.ordersEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.ordersNext = false;
          // for prev button
          if (!this.ordersPrevEvauatedKeys.includes(result['LastEvaluatedKey'].orderID)) {
            this.ordersPrevEvauatedKeys.push(result['LastEvaluatedKey'].orderID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].orderID;
        } else {
          this.ordersNext = true;
          this.lastEvaluatedKey = '';
          this.ordersEndPoint = this.totalRecords;
        }

        if(this.totalRecords < this.ordersEndPoint) {
          this.ordersEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.ordersDraw > 0) {
          this.ordersPrev = false;
        } else {
          this.ordersPrev = true;
        }
        this.spinner.hide(); 
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableConfirmed() {
    this.spinner.show();
    // this.confirmOrders = [];
    this.apiService.getData('orders/fetch/records/confirmed?searchValue=&startDate=&endDate=&category=&lastKey=' + this.confirmLastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.getStartandEndVal('confirmed');
        console.log('confirmed result',result);
        this.confirmOrders = result['Items'];
       
        if (result['LastEvaluatedKey'] !== undefined) {
          this.confirmOrdersNext = false;
          // for prev button
          if (!this.confirmOrdersPrevEvauatedKeys.includes(result['LastEvaluatedKey'].orderID)) {
            this.confirmOrdersPrevEvauatedKeys.push(result['LastEvaluatedKey'].orderID);
          }
          this.confirmLastEvaluatedKey = result['LastEvaluatedKey'].orderID;
        } else {
          this.confirmOrdersNext = true;
          this.confirmLastEvaluatedKey = '';
          this.confirmOrdersEndPoint = this.confirmOrdersEndPoint;
        }

        if(this.confirmOrdersEndPoint < this.ordersEndPoint) {
          this.ordersEndPoint = this.confirmedOrdersCount;
        }

        // disable prev btn
        if (this.confirmOrdersDraw > 0) {
          this.confirmOrdersPrev = false;
        } else {
          this.confirmOrdersPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableDispatched() {
    this.spinner.show();
    // this.dispatchOrders = [];
    this.apiService.getData('orders/fetch/records/dispatched?searchValue=&startDate=&endDate=&category=&lastKey=' + this.dispatchLastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.getStartandEndVal('dispatched');
        this.dispatchOrders = result['Items'];

        console.log('this.dispatchOrders', result)
       
        if (result['LastEvaluatedKey'] !== undefined) {
          this.dispatchOrdersNext = false;
          // for prev button
          if (!this.dispatchOrdersPrevEvauatedKeys.includes(result['LastEvaluatedKey'].orderID)) {
            this.dispatchOrdersPrevEvauatedKeys.push(result['LastEvaluatedKey'].orderID);
          }
          this.dispatchLastEvaluatedKey = result['LastEvaluatedKey'].orderID;
        } else {
          this.dispatchOrdersNext = true;
          this.dispatchLastEvaluatedKey = '';
          this.dispatchOrdersEndPoint = this.dispatchedOrdersCount;
        }

        if(this.dispatchedOrdersCount < this.dispatchOrdersEndPoint) {
          this.dispatchOrdersEndPoint = this.dispatchedOrdersCount;
        }

        // disable prev btn
        if (this.dispatchOrdersDraw > 0) {
          this.dispatchOrdersPrev = false;
        } else {
          this.dispatchOrdersPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableDelivered() {
    this.spinner.show();
    // this.deliveredOrders = [];
    this.apiService.getData('orders/fetch/records/delivered?searchValue=&startDate=&endDate=&category=&lastKey=' + this.deliverLastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.getStartandEndVal('delivered');
        this.deliveredOrders = result['Items'];
       
        if (result['LastEvaluatedKey'] !== undefined) {
          this.deliverOrdersNext = false;
          // for prev button
          if (!this.deliverOrdersPrevEvauatedKeys.includes(result['LastEvaluatedKey'].orderID)) {
            this.deliverOrdersPrevEvauatedKeys.push(result['LastEvaluatedKey'].orderID);
          }
          this.deliverLastEvaluatedKey = result['LastEvaluatedKey'].orderID;
        } else {
          this.deliverOrdersNext = true;
          this.deliverLastEvaluatedKey = '';
          this.deliverOrdersEndPoint = this.deliveredOrdersCount;
        }

        if(this.deliveredOrdersCount < this.deliverOrdersEndPoint) {
          this.deliverOrdersEndPoint = this.deliveredOrdersCount;
        }

        // disable prev btn
        if (this.deliverOrdersDraw > 0) {
          this.deliverOrdersPrev = false;
        } else {
          this.deliverOrdersPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableCancelled() {
    this.spinner.show();
    // this.cancelledOrders = [];
    this.apiService.getData('orders/fetch/records/cancelled?searchValue=&startDate=&endDate=&category=&lastKey=' + this.cancelLastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.getStartandEndVal('cancelled');
        this.cancelledOrders = result['Items'];
       
        if (result['LastEvaluatedKey'] !== undefined) {
          this.cancelOrdersNext = false;
          // for prev button
          if (!this.cancelOrdersPrevEvauatedKeys.includes(result['LastEvaluatedKey'].orderID)) {
            this.cancelOrdersPrevEvauatedKeys.push(result['LastEvaluatedKey'].orderID);
          }
          this.cancelLastEvaluatedKey = result['LastEvaluatedKey'].orderID;
        } else {
          this.cancelOrdersNext = true;
          this.cancelLastEvaluatedKey = '';
          this.cancelOrdersEndPoint = this.cancelledOrdersCount;
        }

        if(this.cancelledOrdersCount < this.cancelOrdersEndPoint) {
          this.cancelOrdersEndPoint = this.cancelledOrdersCount;
        }

        // disable prev btn
        if (this.cancelOrdersDraw > 0) {
          this.cancelOrdersPrev = false;
        } else {
          this.cancelOrdersPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableInvoiced() {
    this.spinner.show();
    // this.invoicedOrders = [];
    this.apiService.getData('orders/fetch/records/invoiced?searchValue=&startDate=&endDate=&category=&lastKey=' + this.invoiceLastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.getStartandEndVal('invoiced');
        this.invoicedOrders = result['Items'];
       
        if (result['LastEvaluatedKey'] !== undefined) {
          this.invoiceOrdersNext = false;
          // for prev button
          if (!this.invoiceOrdersPrevEvauatedKeys.includes(result['LastEvaluatedKey'].orderID)) {
            this.invoiceOrdersPrevEvauatedKeys.push(result['LastEvaluatedKey'].orderID);
          }
          this.invoiceLastEvaluatedKey = result['LastEvaluatedKey'].orderID;
        } else {
          this.invoiceOrdersNext = true;
          this.invoiceLastEvaluatedKey = '';
          this.invoiceOrdersEndPoint = this.invoicedOrdersCount;
        }

        if(this.invoicedOrdersCount < this.invoiceOrdersEndPoint) {
          this.invoiceOrdersEndPoint = this.invoicedOrdersCount;
        }

        // disable prev btn
        if (this.invoiceOrdersDraw > 0) {
          this.invoiceOrdersPrev = false;
        } else {
          this.invoiceOrdersPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTablePartlyPaid() {
    this.spinner.show();
    // this.partiallyOrders = [];
    this.apiService.getData('orders/fetch/records/partiallyPaid?searchValue=&startDate=&endDate=&category=&lastKey=' + this.partialPaidLastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.getStartandEndVal('partiallyPaid');
        this.partiallyOrders = result['Items'];
       
        if (result['LastEvaluatedKey'] !== undefined) {
          this.partialPaidOrdersNext = false;
          // for prev button
          if (!this.partialPaidOrdersPrevEvauatedKeys.includes(result['LastEvaluatedKey'].orderID)) {
            this.partialPaidOrdersPrevEvauatedKeys.push(result['LastEvaluatedKey'].orderID);
          }
          this.partialPaidLastEvaluatedKey = result['LastEvaluatedKey'].orderID;
        } else {
          this.partialPaidOrdersNext = true;
          this.partialPaidLastEvaluatedKey = '';
          this.partialPaidOrdersEndPoint = this.partiallyPaidOrdersCount;
        }

        if(this.partiallyPaidOrdersCount < this.partialPaidOrdersEndPoint) {
          this.partialPaidOrdersEndPoint = this.partiallyPaidOrdersCount;
        }

        // disable prev btn
        if (this.partialPaidOrdersDraw > 0) {
          this.partialPaidOrdersPrev = false;
        } else {
          this.partialPaidOrdersPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  filterOrders() { 
    if(this.orderFiltr.searchValue !== '' || this.orderFiltr.startDate !== '' 
    || this.orderFiltr.endDate !== '' || this.orderFiltr.category !== null) {
      if(this.orderFiltr.startDate != '' && this.orderFiltr.endDate == '') {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if(this.orderFiltr.startDate == '' && this.orderFiltr.endDate != '') {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if(this.orderFiltr.category !== null && this.orderFiltr.searchValue == ''){
        this.toastr.error('Please enter search value.');
        return false;
      }else {
        if(this.orderFiltr.category == 'location') {
          this.orderFiltr.searchValue = this.orderFiltr.searchValue.toLowerCase();
        }
        let sdate;
        let edate;
        if(this.orderFiltr.startDate !== ''){
          this.orderFiltr.start = this.orderFiltr.startDate;
        }
        if(this.orderFiltr.endDate !== ''){
          this.orderFiltr.end = this.orderFiltr.endDate;
        }
        this.orders = [];
        this.dataMessage = Constants.FETCHING_DATA;
        this.activeTab = 'all';
        this.fetchOrdersCount();
        this.initDataTable();
      }
    }
  }

  resetFilter() {
    if(this.orderFiltr.startDate !== '' || this.orderFiltr.endDate !== '' || this.orderFiltr.searchValue !== '') {
      this.spinner.show();
      this.orderFiltr = {
        searchValue: '',
        startDate: '',
        endDate: '',
        category: null,
        start: '',
        end: ''
      };
      $("#categorySelect").text('Search by category');
      // this.pageLength = 10;
      this.orders = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchOrders();
      this.fetchOrdersCount();
      this.initDataTable();
      this.spinner.hide();
    } else {
      return false;
    }
  }

  deactivateOrder(status: number, orderID: string) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
        .getData(`orders/isDeleted/${orderID}/${status}`)
        .subscribe((result: any) => {
          this.ordersDraw = 0;
          this.lastEvaluatedKey = '';
          this.fetchOrders();
          this.initDataTable();

          if(this.activeTab == 'confirmed') {
            this.confirmOrdersDraw = 0;
            this.confirmLastEvaluatedKey = '';
            this.initDataTableConfirmed();

          } else if(this.activeTab == 'dispatched') {
            this.dispatchOrdersDraw = 0;
            this.dispatchLastEvaluatedKey = '';
            this.initDataTableDispatched();

          } else if(this.activeTab == 'delivered') {
            this.deliverOrdersDraw = 0;
            this.deliverLastEvaluatedKey = '';
            this.initDataTableDelivered();

          } else if(this.activeTab == 'cancelled') {
            this.cancelOrdersDraw = 0;
            this.cancelLastEvaluatedKey = '';
            this.initDataTableCancelled();

          } else if(this.activeTab == 'invoiced') {
            this.invoiceOrdersDraw = 0;
            this.invoiceLastEvaluatedKey = '';
            this.initDataTableInvoiced();
            
          } else if(this.activeTab == 'partiallyPaid') {
            this.partialPaidOrdersDraw = 0;
            this.partialPaidLastEvaluatedKey = '';
            this.initDataTablePartlyPaid();
            
          }

          this.toastr.success('Order deleted successfully!');
        });
    }
  }

  getStartandEndVal(type) {
    if(type == 'all') {
      this.ordersStartPoint = this.ordersDraw * this.pageLength + 1;
      this.ordersEndPoint = this.ordersStartPoint + this.pageLength - 1;

    } else if(type == 'confirmed') {
      this.confirmOrdersStartPoint = this.confirmOrdersDraw * this.pageLength + 1;
      this.confirmOrdersEndPoint = this.confirmOrdersStartPoint + this.pageLength - 1;

    } else if(type == 'dispatched') {
      this.dispatchOrdersStartPoint = this.dispatchOrdersDraw * this.pageLength + 1;
      this.dispatchOrdersEndPoint = this.dispatchOrdersStartPoint + this.pageLength - 1;

    } else if(type == 'delivered') {
      this.deliverOrdersStartPoint = this.deliverOrdersDraw * this.pageLength + 1;
      this.deliverOrdersEndPoint = this.deliverOrdersStartPoint + this.pageLength - 1;

    } else if(type == 'cancelled') {
      this.cancelOrdersStartPoint = this.cancelOrdersDraw * this.pageLength + 1;
      this.cancelOrdersEndPoint = this.cancelOrdersStartPoint + this.pageLength - 1;

    } else if(type == 'invoiced') {
      this.invoiceOrdersStartPoint = this.invoiceOrdersDraw * this.pageLength + 1;
      this.invoiceOrdersEndPoint = this.invoiceOrdersStartPoint + this.pageLength - 1;

    } else if(type == 'partiallyPaid') {
      this.partialPaidOrdersStartPoint = this.partialPaidOrdersDraw * this.pageLength + 1;
      this.partialPaidOrdersEndPoint = this.partialPaidOrdersStartPoint + this.pageLength - 1;

    } 
  }

  // next button func
  nextResults(type) {
    if(type == 'all') {
      this.ordersNext = true;
      this.ordersPrev = true;
      this.ordersDraw += 1;
      this.initDataTable();
      // this.getStartandEndVal(type);

    } else if(type == 'confirmed') {
      this.confirmOrdersNext = true;
      this.confirmOrdersPrev = true;
      this.confirmOrdersDraw += 1;
      this.initDataTableConfirmed();
      // this.getStartandEndVal(type);

    } else if(type == 'dispatched') {
      this.dispatchOrdersNext = true;
      this.dispatchOrdersPrev = true;
      this.dispatchOrdersDraw += 1;
      this.initDataTableDispatched();
      // this.getStartandEndVal(type);

    } else if(type == 'delivered') {
      this.deliverOrdersNext = true;
      this.deliverOrdersPrev = true;
      this.deliverOrdersDraw += 1;
      this.initDataTableDelivered();
      // this.getStartandEndVal(type);

    } else if(type == 'cancelled') {
      this.cancelOrdersNext = true;
      this.cancelOrdersPrev = true;
      this.cancelOrdersDraw += 1;
      this.initDataTableCancelled();
      // this.getStartandEndVal(type);

    } else if(type == 'invoiced') {
      this.invoiceOrdersNext = true;
      this.invoiceOrdersPrev = true;
      this.invoiceOrdersDraw += 1;
      this.initDataTableInvoiced();
      // this.getStartandEndVal(type);

    } else if(type == 'partiallyPaid') {
      this.partialPaidOrdersNext = true;
      this.partialPaidOrdersPrev = true;
      this.partialPaidOrdersDraw += 1;
      this.initDataTablePartlyPaid();
      // this.getStartandEndVal(type);

    }
  }

  // prev button func
  prevResults(type) {
    if(type == 'all') {
      this.ordersNext = true;
      this.ordersPrev = true;
      this.ordersDraw -= 1;
      this.lastEvaluatedKey = this.ordersPrevEvauatedKeys[this.ordersDraw];
      this.initDataTable();
      // this.getStartandEndVal(type);

    } else if(type == 'confirmed') {
      this.confirmOrdersNext = true;
      this.confirmOrdersPrev = true;
      this.confirmOrdersDraw -= 1;
      this.confirmLastEvaluatedKey = this.confirmOrdersPrevEvauatedKeys[this.confirmOrdersDraw];
      this.initDataTableConfirmed();
      // this.getStartandEndVal(type);

    } else if(type == 'dispatched') {
      this.dispatchOrdersNext = true;
      this.dispatchOrdersPrev = true;
      this.dispatchOrdersDraw -= 1;
      this.dispatchLastEvaluatedKey = this.dispatchOrdersPrevEvauatedKeys[this.dispatchOrdersDraw];
      this.initDataTableDispatched();
      // this.getStartandEndVal(type);

    } else if(type == 'delivered') {
      this.deliverOrdersNext = true;
      this.deliverOrdersPrev = true;
      this.deliverOrdersDraw -= 1;
      this.deliverLastEvaluatedKey = this.deliverOrdersPrevEvauatedKeys[this.deliverOrdersDraw];
      this.initDataTableDispatched();
      // this.getStartandEndVal(type);

    } else if(type == 'cancelled') {
      this.cancelOrdersNext = true;
      this.cancelOrdersPrev = true;
      this.cancelOrdersDraw -= 1;
      this.cancelLastEvaluatedKey = this.cancelOrdersPrevEvauatedKeys[this.cancelOrdersDraw];
      this.initDataTableCancelled();
      // this.getStartandEndVal(type);

    } else if(type == 'invoiced') {
      this.invoiceOrdersNext = true;
      this.invoiceOrdersPrev = true;
      this.invoiceOrdersDraw -= 1;
      this.invoiceLastEvaluatedKey = this.invoiceOrdersPrevEvauatedKeys[this.invoiceOrdersDraw];
      this.initDataTableInvoiced();
      // this.getStartandEndVal(type);

    } else if(type == 'partiallyPaid') {
      this.partialPaidOrdersNext = true;
      this.partialPaidOrdersPrev = true;
      this.partialPaidOrdersDraw -= 1;
      this.partialPaidLastEvaluatedKey = this.partialPaidOrdersPrevEvauatedKeys[this.partialPaidOrdersDraw];
      this.initDataTablePartlyPaid();
      // this.getStartandEndVal(type);

    }
  }

  setActiveDiv(type){
    this.activeTab = type;
  }

  categoryChange(event) {
    if(event == 'customer' || event == 'orderType') {
      this.orderFiltr.searchValue = null;
    } else {
      this.orderFiltr.searchValue = '';
    }
  }
}