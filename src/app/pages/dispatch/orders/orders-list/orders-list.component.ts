import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

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
  lastEvaluated = {
    value1: '',
    value2: ''
  };
  orderFiltr = {
    searchValue: '',
    startDate: '',
    endDate: '',
    category: ''
  };
  totalRecords = 20;
  pageLength = 10;
  serviceUrl = '';

  allordersCount = 0;
  confirmedOrdersCount = 0;
  dispatchedOrdersCount = 0;
  deliveredOrdersCount = 0;
  cancelledOrdersCount = 0;
  quotedOrdersCount = 0;
  invoicedOrdersCount = 0;
  partiallyPaidOrdersCount = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchOrders();
    this.initDataTable('all');
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

        for (let i = 0; i < result.Items.length; i++) {
          const element = result.Items[i];
          if(element.isDeleted === '0') {
            this.allordersCount = this.allordersCount+1;
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
          }
        }
      }
    });
  };

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

    current.lastEvaluated = {
      value1: '',
      value2: ''
    }
    current.initDataTable(tabType, 'reload');
  }


  initDataTable(tabType, check = '', filters:any = '') {
    let current = this;
    
    if(tabType !== 'all') {
      this.lastEvaluated = {
        value1: '',
        value2: ''
      };
    }

    if(tabType === 'all') {
      this.serviceUrl = 'orders/fetch-records/'+tabType+ "?value1=";
    } else {
      this.serviceUrl = 'orders/fetch-records/'+tabType + "?recLimit="+this.allordersCount+"&value1=";
    }

    if(filters === 'yes') {
      let startDatee:any = '';
      let endDatee:any = '';
      // if(this.tripsFiltr.startDate !== ''){
      //   startDatee = new Date(this.tripsFiltr.startDate).getTime();
      // }
      // if(this.tripsFiltr.endDate !== ''){
      //   endDatee = new Date(this.tripsFiltr.endDate+" 00:00:00").getTime();
      // }
      this.orderFiltr.category = 'orderNumber';
      this.serviceUrl = this.serviceUrl+'&filter=true&searchValue='+this.orderFiltr.searchValue+"&startDate="+startDatee+"&endDate="+endDatee+"&category="+this.orderFiltr.category+"&value1=";
    }

    // console.log(this.serviceUrl);

    if (check !== '') {
      current.rerender();
    }

    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: current.pageLength,
      serverSide: true,
      processing: true,
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData(this.serviceUrl +current.lastEvaluated.value1 + 
        '&value2=' + current.lastEvaluated.value2, dataTablesParameters).subscribe(resp => {
          this.orders = resp['Items'];

          if (resp['LastEvaluatedKey'] !== undefined) {
            if (resp['LastEvaluatedKey'].carrierID !== undefined) {
              current.lastEvaluated = {
                value1: resp['LastEvaluatedKey'].orderID,
                value2: resp['LastEvaluatedKey'].carrierID
              }
            } else {
              current.lastEvaluated = {
                value1: resp['LastEvaluatedKey'].orderID,
                value2: ''
              }
            }

          } else {
            current.lastEvaluated = {
              value1: '',
              value2: ''
            }
          }

          callback({
            recordsTotal: current.totalRecords,
            recordsFiltered: current.totalRecords,
            data: []
          });
        });
      }
    };
  }

  selectCategory(type) {
    let typeText = '';
    this.orderFiltr.category = type;
    $("#categorySelect").text(type);
  }

  filterTrips() {
    this.totalRecords = this.allordersCount;
    this.initDataTable('all', 'reload','yes');
  }
}