import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ApiService } from "../../../../services/api.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Overlay, ToastrService } from "ngx-toastr";
import Constants from "../../../fleet/constants";
import { environment } from "src/environments/environment";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import * as html2pdf from "html2pdf.js";
import * as moment from "moment";
import { ListService } from "src/app/services/list.service";
import * as _ from "lodash";
import { DashboardUtilityService } from "src/app/services/dashboard-utility.service";
import { Table } from 'primeng/table';

import { NgSelectComponent } from "@ng-select/ng-select";
import { OverlayPanel } from "primeng/overlaypanel";
import { Router } from "@angular/router";

declare var $: any;
@Component({
  selector: "app-orders-list",
  templateUrl: "./orders-list.component.html",
  styleUrls: ["./orders-list.component.css"],

})
export class OrdersListComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  environment = environment.isFeatureEnabled;
  @ViewChild('dt') table: Table;
  @ViewChild('op') overlaypanel: OverlayPanel;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  @ViewChild("confirmEmailModal", { static: true })
  confirmEmailModal: TemplateRef<any>;

  @ViewChild("schedularModal", { static: true }) schedularModal: TemplateRef<any>

  dataMessage: string = Constants.FETCHING_DATA;
  noOrdersMsg = Constants.NO_RECORDS_FOUND;
  orders = [];
  confirmOrders = [];
  dispatchOrders = [];
  deliveredOrders = [];
  tonuOrders = [];
  cancelledOrders = [];
  invoicedOrders = [];
  partiallyOrders = [];

  isSearch: boolean = false;

  lastEvaluatedKey = "";
  orderFiltr = {
    searchValue: "",
    startDate: "",
    endDate: "",
    category: null,
    start: "",
    end: "",
  };
  customerValue = "";

  totalRecords = 10;
  pageLength = 10;
  serviceUrl = "";
  activeTab = "all";

  allordersCount = 0;
  customersObjects: any = {};

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

  categoryFilter = [
    {
      name: "Order Number",
      value: "orderNumber",
    },
    {
      name: "Customer",
      value: "customer",
    },
    {
      name: "Order Type",
      value: "orderType",
    },
    {
      name: "Location",
      value: "location",
    },
    {
      name: "Order Status",
      value: "orderStatus",
    },
    {
      name: "Customer Confirmation",
      value: "cusConfirmation",
    },
    {
      name: "Customer PO",
      value: "cusPO",
    },
  ];

  statusData = [
    {
      name: "Attached",
      value: "attached",
    },
    {
      name: "Created",
      value: "created",
    },
    {
      name: "Confirmed",
      value: "confirmed",
    },
    {
      name: "Dispatched",
      value: "dispatched",
    },
    {
      name: "Cancelled Dispatch",
      value: "cancelled",
    },
    {
      name: "Delivered",
      value: "delivered",
    },
  ];
  records = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  fetchedRecordsCount = 0;
  lastFetched = {
    draw: 0,
    status: false,
  };

  emailData = {
    emails: [],
    confirmEmail: false,
  };

  confirmEmails = [];
  carriersObject = [];
  suggestions = [];

  brokerage = {
    orderNo: "",
    orderID: "",
    carrierID: null,
    finalAmount: "",
    miles: 0,
    // currency: "",
    draw: 0,
    index: 0,
    type: "",
    brokerageAmount: 0,
    brkCurrency: "",
    instructions: "",
    today: moment().format("YYYY-MM-DD"),
  };
  logoSrc = "assets/img/logo.png";
  orderData = {
    additionalContact: <any>null,
    carrierData: {
      address: "",
      companyName: "",
      phone: "",
      email: "",
      fax: "",
      logo: "",
      carrierID: "",
    },
    charges: {
      accessorialDeductionInfo: {
        accessorialDeduction: [],
      },
      accessorialFeeInfo: {
        accessorialFee: [],
      },
      freightFee: {
        amount: 0,
        currency: "",
        type: "",
      },
      fuelSurcharge: {
        amount: 0,
        currency: "",
        type: "",
      },
      cusAddressID: "",
      customerID: "",
    },
    data: [],
    finalAmount: 0,
    phone: "",
    subTotal: 0,
    taxesAmt: 0,
  };
  carrierData = {
    name: "",
    email: "",
    address: "",
    phone: "",
  };
  brokerageDisabled = false;
  brokerErr = "";
  companyLogoSrc = "";
  showModal = false;

  loaded = false;
  isLoad: boolean = false;
  isLoadText = "Load More...";


  detailUrl = []

  dataColumns: any[];
  get = _.get;
  find = _.find;
  _selectedColumns: any[];
  // pickupLocData = []
  isOrderPriceEnabled = environment.isOrderPriceEnabled
  scheduler={
    orderID:null,
    orderNumber:null,
    name:null,
    time:null,
    repeatType:null,
    type:{
      daysNo:'',
      days:[]
    },
    rangeType:null,
    dateRange:{
      to:null,
      from:null,
    },
    selectedMonths:[]
  }
  saveDisabled=false;
  repeatType=null;
  range=null;
  days=["everyday","monday","tuesday","wednesday","thursday","friday","saturday","sunday"]
  months=["selectAll","january","february","march","april","may","june","july","august","september","october","november","december"]
  display:any;
  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private listService: ListService,
    private dashboardUtilityService: DashboardUtilityService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.initDataTable();
    this.dataColumns = [
      { width: '8%', field: 'orderNumber', header: 'Order#', type: "text", },
      { width: '7%', field: 'orderMode', header: 'Type', type: "text" },
      { width: '8%', field: 'createdDate', header: 'Date', type: "text" },
      { width: '10%', field: 'customerName', header: 'Customer', type: 'text' },
      { width: '9%', field: 'cusConfirmation', header: 'Confirmation', type: 'text' },
      { width: '9%', field: 'shipperName', header: 'Shipper', type: "text" },
      { width: '9%', field: 'receiverName', header: 'Receiver', type: 'text' },
      { width: '8%', field: 'amount', header: 'Amount', type: 'text' },
      { width: '7%', field: 'invoiceData', header: 'Invoice ', type: 'text' },
      { width: '7%', field: 'paymentData', header: 'Payment ', type: 'text' },
      { width: '9%', field: 'newStatus', header: 'Order Status', type: 'text' },
    ];
    this._selectedColumns = this.dataColumns;


    this.setToggleOptions()


    this.isOrderPriceEnabled = localStorage.getItem("isOrderPriceEnabled")
      ? JSON.parse(localStorage.getItem("isOrderPriceEnabled"))
      : environment.isOrderPriceEnabled;

    this.customersObjects = await this.dashboardUtilityService.getCustomers();
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
  fetchTabData(tabType) {
    this.activeTab = tabType;
  }

  allignOrders(orders) {

    for (let i = 0; i < orders.length; i++) {
      const element = orders[i];


      element.canRecall = false;
      if (element.orderStatus === "delivered") {
        element.canRecall = true;
      }
      if (element.recptStat) {
        element.canRecall = false;
      }
      element.newStatus = element.orderStatus;

      if (element.recall) {
        element.newStatus = `${element.orderStatus} (R)`;
      }
      this.orders = [...this.orders, element];
    }
  }

  initDataTable(refresh?: boolean) {
    if (refresh === true) {
      this.lastEvaluatedKey = "";
      this.orders = [];
    }
    this.spinner.show();
    // this.orders = [];

    if (this.lastEvaluatedKey !== "end") {
      this.orderFiltr.searchValue = this.orderFiltr.searchValue.trim();
      this.apiService
        .getData(
          "orders/fetch/records/all?searchValue=" +
          this.orderFiltr.searchValue +
          "&startDate=" +
          this.orderFiltr.start +
          "&endDate=" +
          this.orderFiltr.end +
          "&category=" +
          this.orderFiltr.category +
          "&lastKey=" +
          this.lastEvaluatedKey
        )
        .subscribe(
          (result: any) => {
            if (result.Items.length == 0) {
              this.dataMessage = Constants.NO_RECORDS_FOUND;
              this.records = false;
            } else {
              this.records = true;
            }
            result.Items.map((v) => {
              v.url = `/dispatch/orders/detail/${v.orderID}`;
              this.detailUrl = v.url

            });
            this.fetchedRecordsCount += result.Count;
            this.getStartandEndVal("all");

            this.allignOrders(result[`Items`]);
            this.loaded = true;
            if (
              this.orderFiltr.searchValue !== "" ||
              this.orderFiltr.start !== ""
            ) {
              this.ordersStartPoint = 1;
              this.ordersEndPoint = this.totalRecords;
            }

            if (result["LastEvaluatedKey"] !== undefined) {
              let lastEvalKey = result[`LastEvaluatedKey`].orderSK.replace(
                /#/g,
                "--"
              );
              this.ordersNext = false;
              // for prev button
              if (!this.ordersPrevEvauatedKeys.includes(lastEvalKey)) {
                this.ordersPrevEvauatedKeys.push(lastEvalKey);
              }
              this.lastEvaluatedKey = lastEvalKey;
            } else {
              this.ordersNext = true;
              this.lastEvaluatedKey = "end";
              this.ordersEndPoint = this.totalRecords;
            }

            // multiple data for csv
            for (let res of result.Items) {
              res.commodityData = ''
              res.amount = ''
              res.shipperName = ''
              res.receiverName = ''
              res.customerData = ''
              for (let shipArr of res.shippersReceiversInfo) {
                for (let ship of shipArr.shippers) {
                  res.shipperName = ship.shiperName

                  for (let receiver of shipArr.receivers) {
                    res.receiverName = receiver.receiverName

                  }
                }

              }
              res.amount = res.charges.freightFee.currency + " " + res.totalAmount;
              if (res.invoicedTime) {
                res.invoiceData = 'Invoiced'
              }
              else if (!res.invoicedTime) {
                res.invoiceData = 'Pending'
              }
              if (res.invStatus) {
                res.paymentData = res.invStatus.replace('_', ' ')
              }
              else if (!res.invStatus) {
                res.paymentData = 'NA'
              }

              res.customerData = res.customerName + "\n" + "Confirmation:-"
                + res.cusConfirmation

            }


            // disable prev btn
            if (this.ordersDraw == 0) {
              this.ordersPrev = true;
            }

            // disable next btn when no records at last
            if (this.fetchedRecordsCount < this.totalRecords) {
              this.ordersNext = false;
            } else if (this.fetchedRecordsCount === this.totalRecords) {
              this.ordersNext = true;
            }
            this.lastFetched = {
              draw: this.ordersDraw,
              status: this.ordersNext,
            };
            this.isLoad = false;
            this.spinner.hide();
            this.isSearch = false;
          },
          (err) => {
            this.spinner.hide();
            this.isSearch = false;
          }
        );
    }
  }

  filterOrders() {
    // if (this.orderFiltr.category == null || this.orderFiltr.category == "") {
    //    this.toastr.error("Please select category");
    //    return false;
    //  }
    if (this.orderFiltr.startDate === null) this.orderFiltr.startDate = "";
    if (this.orderFiltr.endDate === null) this.orderFiltr.endDate = "";
    if (
      this.orderFiltr.searchValue !== "" ||
      this.orderFiltr.startDate !== "" ||
      this.orderFiltr.endDate !== "" ||
      this.orderFiltr.category !== null
    ) {
      if (this.orderFiltr.startDate != "" && this.orderFiltr.endDate == "") {
        this.toastr.error("Please select both start and end dates.");
        return false;
      } else if (
        this.orderFiltr.startDate == "" &&
        this.orderFiltr.endDate != ""
      ) {
        this.toastr.error("Please select both start and end dates.");
        return false;
      } else if (this.orderFiltr.startDate > this.orderFiltr.endDate) {
        this.toastr.error("Start Date should be less then end Date.");
        return false;
      } else if (
        this.orderFiltr.category !== null &&
        this.orderFiltr.searchValue == ""
      ) {
        this.toastr.error("Please enter search value.");
        return false;
      } else {
        if (this.orderFiltr.category == "location") {
          this.orderFiltr.searchValue =
            this.orderFiltr.searchValue.toLowerCase();
        }
        this.records = false;
        if (this.orderFiltr.startDate !== "") {
          this.orderFiltr.start = this.orderFiltr.startDate;
        }
        if (this.orderFiltr.endDate !== "") {
          this.orderFiltr.end = this.orderFiltr.endDate;
        }
        this.ordersDraw = 0;
        this.orders = [];
        this.confirmOrders = [];
        this.dispatchOrders = [];
        this.deliveredOrders = [];
        this.cancelledOrders = [];
        this.invoicedOrders = [];
        this.partiallyOrders = [];
        this.tonuOrders = [];
        this.dataMessage = Constants.FETCHING_DATA;
        this.activeTab = "all";
        this.lastEvaluatedKey = "";
        this.initDataTable();
      }
    }
  }

  resetFilter() {
    if (
      this.orderFiltr.category !== "" ||
      this.orderFiltr.category !== null ||
      this.orderFiltr.startDate !== "" ||
      this.orderFiltr.endDate !== "" ||
      this.orderFiltr.searchValue !== "" ||
      this.customerValue !== ""
    ) {
      this.orderFiltr = {
        searchValue: "",
        startDate: "",
        endDate: "",
        category: null,
        start: "",
        end: "",
      };
      this.customerValue = "";
      $("#categorySelect").text("Search by category");
      this.ordersDraw = 0;
      this.records = false;
      this.orders = [];
      this.confirmOrders = [];
      this.dispatchOrders = [];
      this.deliveredOrders = [];
      this.cancelledOrders = [];
      this.invoicedOrders = [];
      this.partiallyOrders = [];
      this.tonuOrders = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.lastEvaluatedKey = "";
      this.initDataTable();
    } else {
      return false;
    }
  }

  deactivateOrder(eventData) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
        .deleteData(
          `orders/delete/${eventData.orderID}/${eventData.orderNumber}/${eventData.orderStatus}`
        )
        .subscribe((result: any) => {
          this.orders = [];
          this.confirmOrders = [];
          this.dispatchOrders = [];
          this.deliveredOrders = [];
          this.cancelledOrders = [];
          this.invoicedOrders = [];
          this.partiallyOrders = [];
          this.tonuOrders = [];
          this.records = false;
          this.ordersDraw = 0;
          this.lastEvaluatedKey = "";
          this.initDataTable();
          this.toastr.success("Order deleted successfully!");
        });
    }
  }

  getStartandEndVal(type) {
    if (type == "all") {
      this.ordersStartPoint = this.ordersDraw * this.pageLength + 1;
      this.ordersEndPoint = this.ordersStartPoint + this.pageLength - 1;
    }
  }

  setActiveDiv(type) {
    this.activeTab = type;
  }

  categoryChange(event) {
    if (event == "customer" || event == "orderType" || event == "orderStatus") {
      this.orderFiltr.searchValue = null;
    } else {
      this.orderFiltr.searchValue = "";
    }
  }

  async changeStatus() {
    this.isConfirm = true;
    if (this.emailData.confirmEmail && this.emailData.emails.length === 0) {
      this.toastr.error("Please enter at least one email");
      this.isConfirm = false;
      return;
    }

    let newData = {
      emails: [],
      confirm: false,
      customerID: this.newCustomerID,
    };
    this.emailData.emails.forEach((elem) => {
      newData.emails.push(elem.label);
    });
    newData.confirm = this.emailData.confirmEmail;
    let result = await this.apiService
      .getData(
        `orders/update/orderStatus/${this.newOrderID}/${this.newOrderNumber
        }/confirmed?emailData=${encodeURIComponent(JSON.stringify(newData))}`
      )
      .toPromise();
    if (result) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.orders[this.confirmIndex].newStatus = "confirmed";
      this.confirmOrders.unshift(this.orders[this.confirmIndex]);
      this.confirmRef.close();
      this.isConfirm = false;
    } else {
      this.isConfirm = false;
    }
  }

  async confirmEmail(order, i) {
    this.emailData.emails = [];
    let ngbModalOptions: NgbModalOptions = {
      keyboard: true,
      windowClass: "email--invoice",
    };
    this.confirmRef = this.modalService.open(
      this.confirmEmailModal,
      ngbModalOptions
    );
    this.newOrderID = order.orderID;
    this.newOrderNumber = order.orderNumber;
    this.newCustomerID = order.customerID;
    this.confirmIndex = i;
    let email = await this.fetchCustomersByID(order.customerID);
    if (email != undefined && email != "") {
      this.emailData.emails = [...this.emailData.emails, { label: email }];
    }
  }

  /*
   * Get all customers's IDs of names from api
   */
  async fetchCustomersByID(id) {
    let result = await this.apiService
      .getData(`contacts/detail/${id}`)
      .toPromise();
    if (result.Items.length > 0) {
      return result.Items[0].workEmail;
    }
  }

  conEmailChange(value) {
    this.emailData.confirmEmail = value;
  }

  refreshData() {
    this.orderFiltr = {
      searchValue: "",
      startDate: "",
      endDate: "",
      category: null,
      start: "",
      end: "",
    };
    $("#categorySelect").text("Search by category");
    this.records = false;
    this.orders = [];
    this.lastEvaluatedKey = "";
    this.confirmOrders = [];
    this.dispatchOrders = [];
    this.deliveredOrders = [];
    this.cancelledOrders = [];
    this.invoicedOrders = [];
    this.partiallyOrders = [];
    this.tonuOrders = [];
    this.dataMessage = Constants.FETCHING_DATA;
    this.initDataTable();
  }

  async showBrokerageModal(order, draw, index, actionFrom) {
    this.brokerage.orderID = order.orderID;
    this.brokerage.orderNo = order.orderNumber;
    this.brokerage.miles = order.milesInfo.totalMiles;
    this.brokerage.finalAmount = order.finalAmount;
    // this.brokerage.currency = order.charges.freightFee.currency;
    this.brokerage.draw = draw;
    this.brokerage.index = index;
    this.brokerage.type = actionFrom;
    this.brokerage.carrierID = null;
    this.brokerage.brkCurrency = "";
    this.brokerage.brokerageAmount = 0;
    this.brokerage.instructions = '';
    await this.fetchCarriers();
    await this.fetchOrderData();
    this.display = true;
  }


  changeCurrency(val) {
    this.brokerage.brkCurrency = val;
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

  async fetchOrderData() {
    let result: any = await this.apiService
      .getData(`orders/invoice/${this.brokerage.orderID}`)
      .toPromise();
    this.orderData = result[0];
    if (this.orderData.carrierData.logo != "") {
      this.companyLogoSrc = `${this.Asseturl}/${this.orderData.carrierData.carrierID}/${this.orderData.carrierData.logo}`;
    }
  }

  async submitClick() {
    if (
      this.brokerage.carrierID === null ||
      this.brokerage.brokerageAmount <= 0
      || this.brokerage.brkCurrency === ""
    ) {
      this.brokerErr = "Please fill the required fields";
      return false;
    } else {
      this.brokerErr = "";
    }
    this.showModal = true;
    this.brokerageDisabled = true;
    await this.fetchCarrierDetails();
    let data = {
      carrierData: this.carrierData,
      brokerage: this.brokerage,
      orderData: this.orderData,
      showModal: this.showModal,
      companyLogo: this.companyLogoSrc,
    };
    console.log('data==', data)
    this.listService.triggerBrokeragePdf(data);
    await this.updateBrokerageStatus();
    this.display = false;
    this.brokerageDisabled = false;
  }

  async fetchCarrierDetails() {
    let result: any = await this.apiService
      .getData(`contacts/detail/${this.brokerage.carrierID}`)
      .toPromise();
    result = result.Items[0];
    this.carrierData.name = result.cName;
    this.carrierData.email = result.workEmail;
    this.carrierData.phone = result.workPhone;
    if (result.adrs[0].manual) {
      if (result.adrs[0].add1 !== "") {
        this.carrierData.address = `${result.adrs[0].add1} ${result.adrs[0].add2} ${result.adrs[0].ctyName}, ${result.adrs[0].sName}, ${result.adrs[0].cName}`;
      }
    } else {
      this.carrierData.address = result.adrs[0].userLoc;
    }
  }

  async updateBrokerageStatus() {
     let data = {
      orderID: this.brokerage.orderID,
      orderNo: this.brokerage.orderNo,
      brokerageAmount: this.brokerage.brokerageAmount,
      brkCurrency: this.brokerage.brkCurrency,
      instructions: this.brokerage.instructions,
      type: "update",
      carrierID: this.brokerage.carrierID,
    };
    this.apiService
      .postData("orders/update/brokerage", data)
      .subscribe((result: any) => {
        if (result) {
          if (this.brokerage.type === "all") {
            this.orders[this.brokerage.index].newStatus = "brokerage";
            this.orders[this.brokerage.index].orderStatus = "brokerage";
          } else if (this.brokerage.type === "section") {
            this.confirmOrders[this.brokerage.index].newStatus = "brokerage";
            this.confirmOrders[this.brokerage.index].orderStatus = "brokerage";
          }
          this.toastr.success("Order updated successfully!");
        }
      });
  }

  async updateCreatedStatus(order, draw, index) {
    if (
      confirm(
        "Are you sure you want to cancel the brokerage and mark the order as created?"
      ) === true
    ) {
      let data = {
        orderID: order.orderID,
        orderNo: order.orderNo,
        brokerageAmount: 0,
        brkCurrency: '',
        instructions: "",
        carrierID: null,
        type: "cancel",
      };
      this.apiService
        .postData("orders/update/brokerage", data)
        .subscribe((result: any) => {
          if (result) {
            this.orders[index].newStatus = "created";
            this.orders[index].orderStatus = "created";
            this.toastr.success("Order updated successfully!");
          }
        });
    }
  }

  onScroll = async (event: any) => {
    if (this.loaded) {
      this.orderFiltr.searchValue = "",
        this.orderFiltr.startDate = "",
        this.orderFiltr.endDate = "",
        this.orderFiltr.category = null,


        this.isLoad = true;
      this.isLoadText = "Loading";
      this.initDataTable();
    }
    this.loaded = false;
  }
  /**
  * Clears the table filters
  * @param table Table 
  */
  clear(table: Table) {
    table.clear();
  }
  resetSchedule(){
    this.scheduler={
      orderID:null,
      orderNumber:null,
      name:null,
      time:null,
      repeatType:null,
      type:{
        daysNo:"",
        days:[]
      },
      rangeType:null,
     dateRange:{
      to:null,
      from:null,
    },
    selectedMonths:[]
    }

  }

  openSchedulerModal(orderID, orderNumber) {
    this.resetSchedule();
    this.scheduler.orderID = orderID,
      this.scheduler.orderNumber = orderNumber
    let ngbModalOptions: NgbModalOptions = {
      keyboard: true,
      windowClass: "schedular--modal",
    };
    this.confirmRef = this.modalService.open(
      this.schedularModal,
      ngbModalOptions
    );
    this.repeatType = ''
    this.range = ''
    this.saveDisabled = false
  }

  onCheckboxChange(data, isChecked) {
    if (isChecked) {
      this.scheduler.type.days.push(data)
    }
    else {
      const index = this.scheduler.type.days.findIndex(x => x == data);
      this.scheduler.type.days.splice(index, 1)
    }
  }

  onRangeCheckboxChange(value,isChecked){
    if(isChecked){
      this.scheduler.selectedMonths.push(value)
    }
    else{
      const index=this.scheduler.selectedMonths.findIndex(x=>x==value);
      this.scheduler.type.days.splice(index,1)
    }
  }

  async saveScheduler(){
    this.saveDisabled=true;
    if(this.scheduler.orderID) this.scheduler.orderNumber=this.orders[this.scheduler.orderID]
    if(this.scheduler.orderID==null || this.scheduler.orderNumber==null)
    {
      this.toastr.error("Reference Order is required");
      this.saveDisabled=false;
      return 
    }
    if(this.scheduler.name==null){
      this.toastr.error("Scheduler Name is required");
      this.saveDisabled = false;
      return
    }
    if (this.scheduler.time == null) {
      this.toastr.error("Scheduler Time is required");
      this.saveDisabled = false;
      return;
    }
    if (this.repeatType == null) {
      this.toastr.error("Repeat Type is required");
      this.saveDisabled = false;
      return;
    }
    if (this.range == null) {
      this.toastr.error("Range is required");
      this.saveDisabled = false;
      return;
    }

    if(!this.scheduler.dateRange.from || !this.scheduler.dateRange.to){
      this.toastr.error("Date Range is required");
      this.saveDisabled=false;
      return
    }
    else if(this.scheduler.dateRange.to<this.scheduler.dateRange.from){
      this.toastr.error("Date range from must be greater")
      this.saveDisabled=false;
      return;

    }
    if(this.range=="month"){
      if(this.scheduler.selectedMonths.length===0){
        this.toastr.error("Please Select at least 1 month")
        this.saveDisabled=false;
        return
      }
    }

    if(this.repeatType=="selectDaysNo"){
      delete this.scheduler.type.days
    }
    else if (this.repeatType=="days"){
      delete this.scheduler.type.daysNo
    }
    else{
      delete this.scheduler.type
    }

    if(this.range=="everyMonth"){
      delete this.scheduler.selectedMonths;
    }
    const scheduleData={
      orderID:this.scheduler.orderID,
      orderNumber:this.scheduler.orderNumber,
      repeatType:this.repeatType,
      sName:this.scheduler.name,
      dateRange:this.scheduler.dateRange,
      sType:(this.scheduler.type)?this.scheduler.type:undefined,
      selectedMonths:this.scheduler.selectedMonths?this.scheduler.selectedMonths:undefined,
      sRange:this.range,
      sTime:this.scheduler.time,
      timezone: moment.tz.guess()
  }

    this.apiService.postData('orders/schedule',scheduleData).subscribe({
      complete:()=>{},
      error:(err)=>{
        this.saveDisabled=false
      },
      next:(res)=>{
        this.toastr.success("Schedule added successfully");
        this.modalService.dismissAll();
      }
    })

  }

  editOrder(orderID) {
    setTimeout(() => {
      this.router.navigateByUrl(`/dispatch/orders/edit/${orderID}`)
    }, 10);
  }

  createTrip(orderID, orderNumber) {
    setTimeout(() => {
      this.router.navigate([`/dispatch/trips/add-trip`], {
        queryParams: {
          orderId: orderID,
          orderNum: orderNumber
        }
      });
    }, 10);
  }

  cloneOrder(orderID) {
    setTimeout(() => {
      this.router.navigate([`/dispatch/orders/add`], {
        queryParams: {
          cloneID: orderID
        }
      });
    }, 10);
  }

  recallOrder(orderID) {
    setTimeout(() => {
      this.router.navigate([`/dispatch/orders/edit/${orderID}`], {
        queryParams: {
          state: 'recall'
        }
      });
    }, 10);
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem("isOpen", "true");
    this.listService.changeButton(false);
  }

  refreshCarrierData() {
    this.fetchCarriers();
  }

}