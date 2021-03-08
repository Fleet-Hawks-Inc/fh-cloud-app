import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  orders = [];
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

  dispatchOrdersNext = false;
  dispatchOrdersPrev = true;
  dispatchOrdersDraw = 0;
  dispatchOrdersPrevEvauatedKeys = [''];
  dispatchOrdersStartPoint = 1;
  dispatchOrdersEndPoint = this.pageLength;

  deliverOrdersNext = false;
  deliverOrdersPrev = true;
  deliverOrdersDraw = 0;
  deliverOrdersPrevEvauatedKeys = [''];
  deliverOrdersStartPoint = 1;
  deliverOrdersEndPoint = this.pageLength;

  cancelOrdersNext = false;
  cancelOrdersPrev = true;
  cancelOrdersDraw = 0;
  cancelOrdersPrevEvauatedKeys = [''];
  cancelOrdersStartPoint = 1;
  cancelOrdersEndPoint = this.pageLength;

  invoiceOrdersNext = false;
  invoiceOrdersPrev = true;
  invoiceOrdersDraw = 0;
  invoiceOrdersPrevEvauatedKeys = [''];
  invoiceOrdersStartPoint = 1;
  invoiceOrdersEndPoint = this.pageLength;

  partialPaidOrdersNext = false;
  partialPaidOrdersPrev = true;
  partialPaidOrdersDraw = 0;
  partialPaidOrdersPrevEvauatedKeys = [''];
  partialPaidOrdersStartPoint = 1;
  partialPaidOrdersEndPoint = this.pageLength;

  constructor(private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchOrders();
    this.initDataTable('all');
    this.fetchCustomersByIDs();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  fetchOrders = () => {
    this.apiService.getData('orders').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        console.log('result', result);
        this.totalRecords = result.Count; 
        for (let i = 0; i < result.Items.length; i++) {
          const element = result.Items[i];
          //if(element.isDeleted === 0) {
            this.allordersCount = this.allordersCount+1;
            this.totalRecords = this.allordersCount; 
            if(element.orderStatus == 'confirmed') {
              this.confirmedOrdersCount = this.confirmedOrdersCount+1;
            } else if(element.orderStatus == 'dispatched') {
              this.dispatchedOrdersCount = this.dispatchedOrdersCount+1;
            } else if(element.orderStatus == 'delivered') {
              this.deliveredOrdersCount = this.deliveredOrdersCount+1;
            } else if(element.orderStatus == 'cancelled') {
              this.cancelledOrdersCount = this.cancelledOrdersCount+1;
            } else if(element.orderStatus == 'quoted') {
              this.quotedOrdersCount = this.quotedOrdersCount+1;
            } else if(element.orderStatus == 'invoiced') {
              this.invoicedOrdersCount = this.invoicedOrdersCount+1;
            } else if(element.orderStatus == 'partiallyPaid') {
              this.partiallyPaidOrdersCount = this.partiallyPaidOrdersCount+1;
            }
          // }
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
    let current = this;
    console.log('tabType')
    console.log(tabType)
    $(".navtabs").removeClass('active');

    if (tabType === 'all') {
      $("#allOrders-tab").addClass('active');
      this.totalRecords = this.allordersCount;

    } else if (tabType === 'confirmed') {
      $("#confirmed-tab").addClass('active');
      this.totalRecords = this.confirmedOrdersCount;

    } else if (tabType === 'dispatched') {
      $("#dispatched-tab").addClass('active');
      this.totalRecords = this.dispatchedOrdersCount;

    } else if (tabType === 'delivered') {
      $("#delivered-tab").addClass('active');
      this.totalRecords = this.deliveredOrdersCount;

    } else if (tabType === 'cancelled') {
      $("#cancelledDispatch-tab").addClass('active');
      this.totalRecords = this.cancelledOrdersCount;

    } else if (tabType === 'quoted') {
      $("#quoted-tab").addClass('active');
      this.totalRecords = this.quotedOrdersCount;

    } else if (tabType === 'invoiced') {
      $("#invoiced-tab").addClass('active');
      this.totalRecords = this.invoicedOrdersCount;

    } else if (tabType === 'partiallyPaid') {
      $("#partiallyPaid-tab").addClass('active');
      this.totalRecords = this.partiallyPaidOrdersCount;

    }

    current.lastEvaluatedKey = '';
    current.initDataTable(tabType, 'reload');
  }

  initDataTable(tabType, ddd=null) {
    this.spinner.show();
    this.orders = [];
    this.apiService.getData('orders/fetch/records/' + tabType + '?filter=true&searchValue='+this.orderFiltr.searchValue+"&startDate="+this.orderFiltr.start+"&endDate="+this.orderFiltr.end +"&category="+this.orderFiltr.category + '&lastKey=' + this.lastEvaluatedKey)
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

  selectCategory(type) {
    let typeText = '';
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

      this.initDataTable('all', 'reload');
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
      this.initDataTable('all', 'reload');
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
          this.rerender();
          this.toastr.success('Order deleted successfully!');
          
        });
    }
  }

  getStartandEndVal(type) {
    if(type == 'all') {
      this.ordersStartPoint = this.ordersDraw * this.pageLength + 1;
      this.ordersEndPoint = this.ordersStartPoint + this.pageLength - 1;

    } 
  }

  // next button func
  nextResults(type) {
    if(type == 'all') {
      this.ordersDraw += 1;
      this.initDataTable('all');
      this.getStartandEndVal(type);

    }
  }

  // prev button func
  prevResults(type) {
    if(type == 'all') {
      this.ordersDraw -= 1;
      this.lastEvaluatedKey = this.ordersPrevEvauatedKeys[this.ordersDraw];
      this.initDataTable('all');
      this.getStartandEndVal(type);

    }
  }

  setActiveDiv(type){
    this.activeTab = type;
  }
}