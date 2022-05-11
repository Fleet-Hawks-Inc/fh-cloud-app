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
    currency: "",
    draw: 0,
    index: 0,
    type: "",
    brokerageAmount: 0,
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
  _selectedColumns: any[];
  // pickupLocData = []
  isOrderPriceEnabled = environment.isOrderPriceEnabled

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
      { width: '7%', field: 'orderNumber', header: 'Order#', type: "text", },
      { width: '6%', field: 'orderMode', header: 'Type', type: "text" },
      { width: '8%', field: 'createdDate', header: 'Date', type: "text" },
      { width: '9%', field: 'customerData', header: 'Customer', type: 'text' },
      { width: '14%', field: 'pickupLocData', header: ' Pickup Location', type: 'text' },
      { width: '14%', field: 'dropLocData', header: 'Drop Off Location', type: 'text' },
      { width: '9%', field: 'commodityData', header: 'Commodity', type: 'text' },
      { width: '8%', field: 'amount', header: 'Amount', type: 'text' },
      { width: '7%', field: 'invoiceData', header: 'Status', type: 'text' },
      { width: '10%', field: 'newStatus', header: 'Order Status', type: 'text' },
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
              res.pickupLocData = ''
              res.dropLocData = ''
              res.customerData = ''
              for (let shipArr of res.shippersReceiversInfo) {
                for (let ship of shipArr.shippers) {
                  for (let shipPickUp of ship.pickupPoint) {
                    let shipDate = shipPickUp
                    for (let commoD of shipDate.commodity) {
                      res.commodityData = " Name:-" + commoD.name + '\n'
                        + " Qty:-" + commoD.quantity + commoD.quantityUnit

                    }
                    if (shipPickUp.address.manual) {
                      res.pickupLocData = " Date:-" + shipPickUp.dateAndTime + '\n'
                        + " Location:-" + shipPickUp.address.address + ' ' +
                        + ' ' + shipPickUp.address.cityName + ' ' + shipPickUp.address.stateName + ' ' +
                        shipPickUp.address.countryName + ' ' + shipPickUp.address.zipCode
                    }
                    else if (!shipPickUp.address.manual) {
                      res.pickupLocData = " Date:-" + shipPickUp.dateAndTime + '\n'
                        + " Location:-" + shipPickUp.address.pickupLocation
                    }
                    else if (shipPickUp.length > 1) {
                      res.pickupLocData = shipPickUp.length - 1
                    }

                  }
                  for (let receiver of shipArr.receivers) {
                    for (let receiveDropOf of receiver.dropPoint) {
                      if (receiveDropOf.address.manual) {
                        res.dropLocData = " Date:-" + receiveDropOf.dateAndTime + '\n'
                          + " Location:-" + receiveDropOf.address.address + ' ' +
                          + ' ' + receiveDropOf.address.cityName + ' ' + receiveDropOf.address.stateName + ' ' +
                          receiveDropOf.address.countryName + ' ' + receiveDropOf.address.zipCode
                      }
                      else if (!receiveDropOf.address.manual) {
                        res.dropLocData = " Date:-" + receiveDropOf.dateAndTime + '\n'
                          + " Location:-" + receiveDropOf.address.dropOffLocation
                      }
                      else if (receiveDropOf.length > 1) {
                        res.dropLocData = receiveDropOf.length - 1
                      }
                    }
                  }
                }

              }
              res.amount = res.charges.freightFee.currency + " " + res.totalAmount;
              if (res.invoicedTime) {
                res.invoiceData = 'Invoiced:-' + 'yes'
              }
              else if (!res.invoicedTime) {
                res.invoiceData = 'Invoiced:-' + 'No'
              }
              if (res.invStatus) {
                res.invoiceData += " Payment:- " + res.invStatus.replace('_', ' ')
              }
              else if (!res.invStatus) {
                res.invoiceData += 'Payment:-' + 'NA'
              }

              res.customerData = res.customerName + "\n" + " Confirmation:-"
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
    this.brokerage.currency = order.charges.freightFee.currency;
    this.brokerage.draw = draw;
    this.brokerage.index = index;
    this.brokerage.type = actionFrom;
    await this.fetchCarriers();
    await this.fetchOrderData();
    $("#orderStatusModal").modal("show");
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
    ) {
      this.brokerErr = "Please fill the required fields";
      return false;
    } else if (
      Number(this.brokerage.brokerageAmount) >
      Number(this.brokerage.finalAmount)
    ) {
      this.brokerErr =
        "Brokerage amount should not be greater than order total.";
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
    this.listService.triggerBrokeragePdf(data);
    await this.updateBrokerageStatus();
    $("#orderStatusModal").modal("hide");
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
}
