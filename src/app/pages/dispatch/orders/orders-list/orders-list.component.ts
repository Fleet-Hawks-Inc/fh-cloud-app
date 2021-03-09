import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
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
    category: '',
    start: '',
    end: ''
  };
  totalRecords = 20;
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
  }

  fetchOrders = () => {
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
    this.orders = [];
    this.apiService.getData('orders/fetch/records/all?filter=true&searchValue='+this.orderFiltr.searchValue+"&startDate="+this.orderFiltr.start+"&endDate="+this.orderFiltr.end +"&category="+this.orderFiltr.category + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
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
    this.confirmOrders = [];
    this.apiService.getData('orders/fetch/records/confirmed?filter=true&searchValue=&startDate=&endDate=&category=&lastKey=' + this.confirmLastEvaluatedKey)
      .subscribe((result: any) => {
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
          this.confirmOrdersEndPoint = this.confirmedOrdersCount;
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
    this.dispatchOrders = [];
    this.apiService.getData('orders/fetch/records/dispatched?filter=true&searchValue=&startDate=&endDate=&category=&lastKey=' + this.dispatchLastEvaluatedKey)
      .subscribe((result: any) => {
        this.dispatchOrders = result['Items'];
       
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
    this.deliveredOrders = [];
    this.apiService.getData('orders/fetch/records/delivered?filter=true&searchValue=&startDate=&endDate=&category=&lastKey=' + this.deliverLastEvaluatedKey)
      .subscribe((result: any) => {
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
    this.cancelledOrders = [];
    this.apiService.getData('orders/fetch/records/cancelled?filter=true&searchValue=&startDate=&endDate=&category=&lastKey=' + this.cancelLastEvaluatedKey)
      .subscribe((result: any) => {
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
    this.invoicedOrders = [];
    this.apiService.getData('orders/fetch/records/invoiced?filter=true&searchValue=&startDate=&endDate=&category=&lastKey=' + this.invoiceLastEvaluatedKey)
      .subscribe((result: any) => {
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
    this.partiallyOrders = [];
    this.apiService.getData('orders/fetch/records/partiallyPaid?filter=true&searchValue=&startDate=&endDate=&category=&lastKey=' + this.partialPaidLastEvaluatedKey)
      .subscribe((result: any) => {
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

  selectCategory(type) {
    this.orderFiltr.category = type;
    $("#categorySelect").text(type);
  }

  filterOrders() { 
    if(this.orderFiltr.searchValue !== '' || this.orderFiltr.startDate !== '' 
    || this.orderFiltr.endDate !== '' || this.orderFiltr.category !== '') {
      let sdate;
      let edate;
      if(this.orderFiltr.startDate !== ''){
        sdate = this.orderFiltr.startDate.split('-');
        if(sdate[0] < 10) {
          sdate[0] = '0'+sdate[0]
        }
        this.orderFiltr.start = sdate[2]+'-'+sdate[1]+'-'+sdate[0];
      }
      if(this.orderFiltr.endDate !== ''){
        edate = this.orderFiltr.endDate.split('-');
        if(edate[0] < 10) {
          edate[0] = '0'+edate[0]
        }
        this.orderFiltr.end = edate[2]+'-'+edate[1]+'-'+edate[0];
      }
      this.pageLength = this.allordersCount;
      this.totalRecords = this.allordersCount;
      this.orderFiltr.category = 'orderNumber';

      this.activeTab = 'all';
      this.initDataTable();
    }
  }

  resetFilter() {
    if(this.orderFiltr.startDate !== '' || this.orderFiltr.endDate !== '' || this.orderFiltr.searchValue !== '') {
      this.spinner.show();
      this.orderFiltr = {
        searchValue: '',
        startDate: '',
        endDate: '',
        category: '',
        start: '',
        end: ''
      };
      $("#categorySelect").text('Search by category');
      this.pageLength = 10;
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
          this.initDataTable();
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
      this.ordersDraw += 1;
      this.initDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'confirmed') {
      this.confirmOrdersDraw += 1;
      this.initDataTableConfirmed();
      this.getStartandEndVal(type);

    } else if(type == 'dispatched') {
      this.dispatchOrdersDraw += 1;
      this.initDataTableDispatched();
      this.getStartandEndVal(type);

    } else if(type == 'delivered') {
      this.deliverOrdersDraw += 1;
      this.initDataTableDelivered();
      this.getStartandEndVal(type);

    } else if(type == 'cancelled') {
      this.cancelOrdersDraw += 1;
      this.initDataTableCancelled();
      this.getStartandEndVal(type);

    } else if(type == 'invoiced') {
      this.invoiceOrdersDraw += 1;
      this.initDataTableInvoiced();
      this.getStartandEndVal(type);

    } else if(type == 'partiallyPaid') {
      this.partialPaidOrdersDraw += 1;
      this.initDataTablePartlyPaid();
      this.getStartandEndVal(type);

    }
  }

  // prev button func
  prevResults(type) {
    if(type == 'all') {
      this.ordersDraw -= 1;
      this.lastEvaluatedKey = this.ordersPrevEvauatedKeys[this.ordersDraw];
      this.initDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'confirmed') {
      this.confirmOrdersDraw -= 1;
      this.confirmLastEvaluatedKey = this.confirmOrdersPrevEvauatedKeys[this.confirmOrdersDraw];
      this.initDataTableConfirmed();
      this.getStartandEndVal(type);

    } else if(type == 'dispatched') {
      this.dispatchOrdersDraw -= 1;
      this.dispatchLastEvaluatedKey = this.dispatchOrdersPrevEvauatedKeys[this.dispatchOrdersDraw];
      this.initDataTableDispatched();
      this.getStartandEndVal(type);

    } else if(type == 'delivered') {
      this.deliverOrdersDraw -= 1;
      this.deliverLastEvaluatedKey = this.deliverOrdersPrevEvauatedKeys[this.deliverOrdersDraw];
      this.initDataTableDispatched();
      this.getStartandEndVal(type);

    } else if(type == 'cancelled') {
      this.cancelOrdersDraw -= 1;
      this.cancelLastEvaluatedKey = this.cancelOrdersPrevEvauatedKeys[this.cancelOrdersDraw];
      this.initDataTableCancelled();
      this.getStartandEndVal(type);

    } else if(type == 'invoiced') {
      this.invoiceOrdersDraw -= 1;
      this.invoiceLastEvaluatedKey = this.invoiceOrdersPrevEvauatedKeys[this.invoiceOrdersDraw];
      this.initDataTableInvoiced();
      this.getStartandEndVal(type);

    } else if(type == 'partiallyPaid') {
      this.partialPaidOrdersDraw -= 1;
      this.partialPaidLastEvaluatedKey = this.partialPaidOrdersPrevEvauatedKeys[this.partialPaidOrdersDraw];
      this.initDataTablePartlyPaid();
      this.getStartandEndVal(type);

    }
  }

  setActiveDiv(type){
    this.activeTab = type;
  }
}