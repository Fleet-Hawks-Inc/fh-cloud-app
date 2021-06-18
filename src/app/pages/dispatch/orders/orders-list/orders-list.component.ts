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
  noOrdersMsg = Constants.NO_RECORDS_FOUND;
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
  customersObjects: any = {};

  ordersNext = false;
  ordersPrev = true;
  ordersDraw = 0;
  ordersPrevEvauatedKeys = [''];
  ordersStartPoint = 1;
  ordersEndPoint = this.pageLength;

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
    {
      'name': 'Order Status',
      'value': 'orderStatus'
    },
  ];

  statusData = [
    {
      name: "Confirmed",
      value: 'confirmed'
    },
    {
      name: "Dispatched",
      value: 'dispatched'
    },
    {
      name: "Cancelled Dispatch",
      value: 'cancelled'
    },
    {
      name: "Invoiced",
      value: 'invoiced'
    },
    {
      name: "Partially Paid",
      value: 'partiallyPaid'
    },
    {
      name: "Delivered",
      value: 'delivered'
    },
  ]
  records = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 1 };
  fetchedRecordsCount = 0;
  lastFetched = {
    draw:0,
    status: false
  }

  constructor(private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchAllTypeOrderCount();
    this.fetchCustomersByIDs();
  }

  fetchAllTypeOrderCount = () => {
    this.allordersCount = 0;
    
    this.apiService.getData('orders/get/allTypes/count').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.allordersCount = result.allCount;
        this.totalRecords = result.allCount;

        this.initDataTable();
      }
    });
  };

  fetchOrdersCount() {
    this.apiService.getData('orders/get/filter/count?searchValue='+this.orderFiltr.searchValue+"&startDate="+this.orderFiltr.start+"&endDate="+this.orderFiltr.end +"&category="+this.orderFiltr.category).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;

        this.initDataTable();
      },
    });
  }

  /*
   * Get all customers's IDs of names from api
   */
  fetchCustomersByIDs() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.customersObjects = result;
    });
  }

  fetchTabData(tabType) {
    this.activeTab = tabType;
  }

  allignOrders(orders) {
    
    for (let i = 0; i < orders.length; i++) {
      const element = orders[i];

      for (let k = 0; k < element.shippersReceiversInfo.length; k++) {
        const element2 = element.shippersReceiversInfo[k];

        for (let m = 0; m < element2.shippers.length; m++) {
          const element3 = element2.shippers[m];
          let dateTime = element3.dateAndTime.split(' ');
          element3.date = (dateTime[0] != undefined) ? dateTime[0] : '';
          element3.time = (dateTime[1] != undefined) ? dateTime[1] : '';
        }

        for (let m = 0; m < element2.receivers.length; m++) {
          const element3 = element2.receivers[m];
          let dateTime = element3.dateAndTime.split(' ');
          element3.date = (dateTime[0] != undefined) ? dateTime[0] : '';
          element3.time = (dateTime[1] != undefined) ? dateTime[1] : '';
        }
      }

      if(element.orderStatus == 'confirmed') {
        this.confirmOrders.push(element);
      } else if(element.orderStatus == 'dispatched') {
        this.dispatchOrders.push(element);
      } else if(element.orderStatus == 'invoiced') {
        this.invoicedOrders.push(element);
      } else if(element.orderStatus == 'partiallyPaid') {
        this.partiallyOrders.push(element);
      } else if(element.orderStatus == 'cancelled') {
        this.cancelledOrders.push(element);
      } else if(element.orderStatus == 'delivered') {
        this.deliveredOrders.push(element);
      }
    }

    this.orders.push(orders);
  }

  initDataTable() {
    this.spinner.show();
    // this.orders = [];
    this.apiService.getData('orders/fetch/records/all?searchValue='+this.orderFiltr.searchValue+"&startDate="+this.orderFiltr.start+"&endDate="+this.orderFiltr.end +"&category="+this.orderFiltr.category + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
          this.records = false;
        } else {
          this.records = true;
        }
        this.fetchedRecordsCount += result.Count;
        this.getStartandEndVal('all');
        // this.orders.push(result['Items']);
        this.allignOrders(result['Items']);
        if (this.orderFiltr.searchValue !== '' || this.orderFiltr.start !== '' ) {
          this.ordersStartPoint = 1;
          this.ordersEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].orderSK.replace(/#/g,'--');
          this.ordersNext = false;
          // for prev button
          if (!this.ordersPrevEvauatedKeys.includes(lastEvalKey)) {
            this.ordersPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKey = lastEvalKey;
        } else {
          this.ordersNext = true;
          this.lastEvaluatedKey = '';
          this.ordersEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.ordersDraw == 0) {
          this.ordersPrev = true;
        } 

        // disable next btn when no records at last
        if(this.fetchedRecordsCount < this.totalRecords ){
          this.ordersNext = false;
        } else if(this.fetchedRecordsCount === this.totalRecords) {
          this.ordersNext = true;
        }
        this.lastFetched = {
          draw:this.ordersDraw,
          status: this.ordersNext
        }

        this.spinner.hide(); 
      }, err => {
        this.spinner.hide();
      });
  }

  filterOrders() {
    if(this.orderFiltr.startDate===null) this.orderFiltr.startDate=''
    if(this.orderFiltr.endDate===null) this.orderFiltr.endDate=''
    if (this.orderFiltr.searchValue !== '' || this.orderFiltr.startDate !== ''
      || this.orderFiltr.endDate !== '' || this.orderFiltr.category !== null) {
      if (this.orderFiltr.startDate != '' && this.orderFiltr.endDate == '') {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.orderFiltr.startDate == '' && this.orderFiltr.endDate != '') {
        this.toastr.error('Please select both start and end dates.');
        return false;
      }else if(this.orderFiltr.startDate>this.orderFiltr.endDate){
        this.toastr.error('Start Date should be less then end Date.');
        return false;
      }
       else if (this.orderFiltr.category !== null && this.orderFiltr.searchValue == '') {
        this.toastr.error('Please enter search value.');
        return false;
      } else {
        if (this.orderFiltr.category == 'location') {
          this.orderFiltr.searchValue = this.orderFiltr.searchValue.toLowerCase();
        }
        this.records = false;
        if (this.orderFiltr.startDate !== '') {
          this.orderFiltr.start = this.orderFiltr.startDate;
        }
        if (this.orderFiltr.endDate !== '') {
          this.orderFiltr.end = this.orderFiltr.endDate;
        }
        this.orders = [];
        this.confirmOrders = [];
        this.dispatchOrders = [];
        this.deliveredOrders = [];
        this.cancelledOrders = [];
        this.invoicedOrders = [];
        this.partiallyOrders = [];
        this.dataMessage = Constants.FETCHING_DATA;
        this.activeTab = 'all';
        this.fetchOrdersCount();
        // this.initDataTable();
      }
    }
  }

  resetFilter() {
    if (this.orderFiltr.startDate !== '' || this.orderFiltr.endDate !== '' || this.orderFiltr.searchValue !== '') {
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
      this.records = false;
      this.orders = [];
      this.confirmOrders = [];
      this.dispatchOrders = [];
      this.deliveredOrders = [];
      this.cancelledOrders = [];
      this.invoicedOrders = [];
      this.partiallyOrders = [];
      this.dataMessage = Constants.FETCHING_DATA;
      // this.fetchAllTypeOrderCount();
      this.fetchOrdersCount();
      // this.initDataTable();
      this.spinner.hide();
    } else {
      return false;
    }
  }

  deactivateOrder(eventData) {
    if (confirm('Are you sure you want to delete?') === true) {
      let record = { 
        date: eventData.createdDate,
        time: eventData.createdTime,
        eventID: eventData.orderID,
        status: eventData.orderStatus
      }
      this.apiService.postData(`orders/delete`, record).subscribe((result: any) => {
          this.orders = [];
          this.confirmOrders = [];
          this.dispatchOrders = [];
          this.deliveredOrders = [];
          this.cancelledOrders = [];
          this.invoicedOrders = [];
          this.partiallyOrders = [];

          this.records = false;
          this.ordersDraw = 0;
          this.lastEvaluatedKey = '';
          this.fetchAllTypeOrderCount();
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
      this.ordersNext = true;
      this.ordersDraw += 1;

      if(this.orders[this.ordersDraw] == undefined) {
        this.records = false;
        
        this.initDataTable();
        this.ordersPrev = false;
      } else {
        if(this.ordersDraw <= 0 ){
          this.ordersPrev = true;
        } else {
          this.ordersPrev = false;
        }
        if(this.ordersDraw < this.lastFetched.draw ){
          this.ordersNext = false;
        } else {
          this.ordersNext = this.lastFetched.status;
        }
        this.getStartandEndVal('all');
        this.ordersEndPoint = this.ordersStartPoint+this.orders[this.ordersDraw].length-1;
      }
    }
  }

  // prev button func
  prevResults(type) {
    if(type == 'all') {
      this.ordersNext = true;
      this.ordersPrev = true;
      this.ordersDraw -= 1;

      if(this.orders[this.ordersDraw] == undefined) {
        this.initDataTable();
      } else {
        if(this.ordersDraw <= 0 ){
          this.ordersPrev = true;
        } else {
          this.ordersPrev = false;
        }
        this.ordersNext = false;
        this.getStartandEndVal('all');
      }
    }   
  }

  setActiveDiv(type){
    this.activeTab = type;
  }

  categoryChange(event) {
    if(event == 'customer' || event == 'orderType' || event == 'orderStatus') {
      this.orderFiltr.searchValue = null;
    } else {
      this.orderFiltr.searchValue = '';
    }
  }
}