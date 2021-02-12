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

  allordersCount = 0;
  confirmedOrdersCount = 0;
  dispatchedOrdersCount = 0;
  deliveredOrdersCount = 0;
  cancelledOrdersCount = 0;
  quotedOrdersCount = 0;
  invoicedOrdersCount = 0;
  partiallyPaidOrdersCount = 0;

  customersObjects: any = {};

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


  initDataTable(tabType, check = '', filters:any = '') {
    let current = this;
    
    if(tabType !== 'all') {
      this.lastEvaluatedKey = ''
    }

    if(tabType === 'all') {
      this.serviceUrl = 'orders/fetch-records/'+tabType;
    } else {
      this.serviceUrl = 'orders/fetch-records/'+tabType + "?recLimit="+this.allordersCount+"&value1=";
    }

    // this.orderFiltr.category = 'orderNumber';
    this.serviceUrl = this.serviceUrl+'?filter=true&searchValue='+this.orderFiltr.searchValue+"&startDate="+this.orderFiltr.start+"&endDate="+this.orderFiltr.end +"&category="+this.orderFiltr.category+"&value1=";

    if (check !== '') {
      current.rerender();
    }

    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: current.pageLength,
      serverSide: true,
      processing: true,
      dom: 'lrtip',
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5,6,7],"orderable": false},
      ],
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData(this.serviceUrl +current.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
          this.orders = resp['Items'];
          console.log('this.orders', this.orders)
          if (resp['LastEvaluatedKey'] !== undefined) {
            // if (resp['LastEvaluatedKey'].carrierID !== undefined) {
              current.lastEvaluatedKey = resp['LastEvaluatedKey'].orderID
            // } else {
            //   current.lastEvaluatedKey = ''
            // }

          } else {
            current.lastEvaluatedKey = ''
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

      this.initDataTable('all', 'reload','yes');
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
      this.initDataTable('all', 'reload','yes');
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
}