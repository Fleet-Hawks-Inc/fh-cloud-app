import { AccountService, ApiService } from "../../../../services";
import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import Constants from "../../../fleet/constants";
import { Router } from "@angular/router";
import * as moment from 'moment'
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as html2pdf from "html2pdf.js";
declare var $: any;
@Component({
  selector: "app-invoice-list",
  templateUrl: "./invoice-list.component.html",
  styleUrls: ["./invoice-list.component.css"],
})
export class InvoiceListComponent implements OnInit {
  @ViewChild("previewInvoiceModal", { static: true }) previewInvoiceModal: TemplateRef<any>;

  dataMessage = Constants.NO_RECORDS_FOUND;
  invoices = [];
  fetchedManualInvoices = [];
  fetchedOrderInvoices = [];
  customersObjects = {};
  invNewStatus: string;
  invID: string;
  totalCAD = 0;
  totalUSD = 0;
  exportLoading = false;
  openInvoices = [];
  openTotalCAD = 0;
  openTotalUSD = 0;
  paidInvoices = [];
  unPaidInvoices = [];
  paidTotalCAD = 0;
  paidTotalUSD = 0;
  emailedInvoices = [];
  emailedTotalUSD = 0;
  emailedTotalCAD = 0;
  partiallyPaidInvoices = [];
  partiallyPaidTotalCAD = 0;
  partiallyPaidTotalUSD = 0;
  voidedInvoices = [];
  voidedTotalCAD = 0;
  voidedTotalUSD = 0;
  invoiceTypeObject = { all: "all", open: "Open", paid: "paid", partially_paid: "Partial Paid", unpaid: "Unpaid" }
  allData = []
  // Order Invoice
  orderInvoices = [];
  openOrderInvoices = [];
  paidOrderInvoices = [];
  unPaidOrderInvoices = [];
  emailedOrderInvoices = [];
  partiallyPaidOrderInvoices = [];
  voidedOrderInvoices = [];
  invGenStatus: boolean;
  filter = {
    startDate: null,
    endDate: null,
    category: null,
    searchValue: null,
    invNo: null,
    customer: null,
    invType: null
  };
  lastItemSK = "";
  lastItemOrderSK = "";
  loaded = false;
  loadedOrder = false;
  disableSearch = false;
  disableSearchOrder = false;
  searchActive = false;
  invoicesCAD = [];
  invoicesUSD = [];
  overdueTotalCAD = 0;
  overdueTotalUSD = 0;
  preview: any;

  constructor(
    private accountService: AccountService,
    private apiService: ApiService,
    private toaster: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.lastItemSK = "";
    this.lastItemOrderSK = "";
    this.invoices = [];
    this.orderInvoices = [];
    this.fetchCustomersByIDs();
    this.fetchInvoices();
    this.getInvoices();
  }
  fetchInvoices() {
    this.accountService
      .getData("order-invoice/all/invoices")
      .subscribe((res: any) => {
        this.fetchedOrderInvoices = res;
        this.getTotalInvoices(this.fetchedOrderInvoices, "order");
      });
    this.accountService
      .getData("invoices/all/invoices")
      .subscribe((res: any) => {
        this.fetchedManualInvoices = res;
        this.getTotalInvoices(this.fetchedManualInvoices, "manual");
      });
  }

  // getTotalOrderInvoices(invoices: any) {
  //   if (invoices.length > 0) {
  //     for (const element of invoices) {
  //       if (element.invStatus === 'open') {
  //         this.openTotal = this.openTotal + Number(element.finalAmount);
  //         this.openTotal = +(this.openTotal).toFixed(2);
  //       } else if (element.invStatus === 'paid') {
  //         this.paidTotal = this.paidTotal + Number(element.finalAmount);
  //         this.paidTotal = +(this.paidTotal).toFixed(2);
  //       } else if (element.invStatus === 'emailed') {
  //         this.emailedTotal = this.emailedTotal + Number(element.finalAmount);
  //         this.emailedTotal = +(this.emailedTotal).toFixed(2);
  //       } else if (element.invStatus === 'partially_paid') {
  //         this.partiallyPaidTotal = this.partiallyPaidTotal + Number(element.finalAmount);
  //         this.partiallyPaidTotal = +(this.partiallyPaidTotal).toFixed(2);
  //       } else if (element.invStatus === 'voided') {
  //         this.voidedTotal = this.voidedTotal + Number(element.finalAmount);
  //         this.voidedTotal = +(this.voidedTotal).toFixed(2);
  //       }
  //     }
  //     this.total = this.openTotal + this.paidTotal + this.emailedTotal + this.partiallyPaidTotal + this.voidedTotal;
  //     this.total = +(this.total).toFixed(2);
  //   }
  // }
  getTotalInvoices(invoices: any, type: string) {
    // const invoicesCAD = [];
    // const invoicesUSD = [];
    this.openTotalUSD = 0;
    this.paidTotalUSD = 0;
    this.emailedTotalUSD = 0;
    this.partiallyPaidTotalUSD = 0;
    this.voidedTotalUSD = 0;
    this.openTotalCAD = 0;
    this.paidTotalCAD = 0;
    this.emailedTotalCAD = 0;
    this.partiallyPaidTotalCAD = 0;
    this.voidedTotalCAD = 0;
    this.overdueTotalCAD = 0;
    this.overdueTotalUSD = 0;

    if (type === "manual") {
      invoices.map((e: any) => {
        if (e.invCur === "CAD") {
          this.invoicesCAD.push(e);
        } else {
          this.invoicesUSD.push(e);
        }
      });
    } else {
      invoices.map((e: any) => {
        if (e.charges.freightFee.currency === "CAD") {
          this.invoicesCAD.push(e);
        } else {
          this.invoicesUSD.push(e);
        }
      });
    }
    if (this.invoicesCAD.length > 0 || this.invoicesUSD.length > 0) {
      for (const element of this.invoicesCAD) {
        if (element.invStatus === "open") {
          this.openTotalCAD = this.openTotalCAD + Number(element.finalAmount);
          this.openTotalCAD = +this.openTotalCAD.toFixed(2);
        } else if (element.invStatus === "paid") {
          this.paidTotalCAD = this.paidTotalCAD + Number(element.finalAmount);
          this.paidTotalCAD = +this.paidTotalCAD.toFixed(2);
        } else if (element.invStatus === "emailed") {
          this.emailedTotalCAD =
            this.emailedTotalCAD + Number(element.finalAmount);
          this.emailedTotalCAD = +this.emailedTotalCAD.toFixed(2);
        } else if (
          element.invStatus === "partially_paid" ||
          element.invStatus === "partially paid"
        ) {
          this.partiallyPaidTotalCAD =
            this.partiallyPaidTotalCAD + Number(element.finalAmount);
          this.partiallyPaidTotalCAD = +this.partiallyPaidTotalCAD.toFixed(2);
        } else if (element.invStatus === "voided") {
          this.voidedTotalCAD =
            this.voidedTotalCAD + Number(element.finalAmount);
          this.voidedTotalCAD = +this.voidedTotalCAD.toFixed(2);
        } else if (element.invStatus === "overdue") {
          this.overdueTotalCAD =
            this.overdueTotalCAD + Number(element.finalAmount);
          this.overdueTotalCAD = +this.overdueTotalCAD.toFixed(2);
        }
      }
      for (const element of this.invoicesUSD) {
        if (element.invStatus === "open") {
          this.openTotalUSD = this.openTotalUSD + Number(element.finalAmount);
          this.openTotalUSD = +this.openTotalUSD.toFixed(2);
        } else if (element.invStatus === "paid") {
          this.paidTotalUSD = this.paidTotalUSD + Number(element.finalAmount);
          this.paidTotalUSD = +this.paidTotalUSD.toFixed(2);
        } else if (element.invStatus === "emailed") {
          this.emailedTotalUSD =
            this.emailedTotalUSD + Number(element.finalAmount);
          this.emailedTotalUSD = +this.emailedTotalUSD.toFixed(2);
        } else if (
          element.invStatus === "partially_paid" ||
          element.invStatus === "partially paid"
        ) {
          this.partiallyPaidTotalUSD =
            this.partiallyPaidTotalUSD + Number(element.finalAmount);
          this.partiallyPaidTotalUSD = +this.partiallyPaidTotalUSD.toFixed(2);
        } else if (element.invStatus === "voided") {
          this.voidedTotalUSD =
            this.voidedTotalUSD + Number(element.finalAmount);
          this.voidedTotalUSD = +this.voidedTotalUSD.toFixed(2);
        } else if (element.invStatus === "overdue") {
          this.overdueTotalUSD =
            this.overdueTotalUSD + Number(element.finalAmount);
          this.overdueTotalUSD = +this.overdueTotalUSD.toFixed(2);
        }
      }
      this.totalUSD =
        this.openTotalUSD +
        this.paidTotalUSD +
        this.emailedTotalUSD +
        this.partiallyPaidTotalUSD +
        this.voidedTotalUSD +
        this.overdueTotalUSD;
      this.totalUSD = +this.totalUSD.toFixed(2);
      this.totalCAD =
        this.openTotalCAD +
        this.paidTotalCAD +
        this.emailedTotalCAD +
        this.partiallyPaidTotalCAD +
        this.voidedTotalCAD +
        this.overdueTotalCAD;
      this.totalCAD = +this.totalCAD.toFixed(2);
    }
  }
  async getInvoices(refresh?: boolean) {
    let searchParam = null;
    let searchParamOrder = null;
    if (refresh === true) {
      this.lastItemSK = "";
      this.invoices = [];
      this.openInvoices = [];
      this.paidInvoices = [];
      this.emailedInvoices = [];
      this.partiallyPaidInvoices = [];
      this.voidedInvoices = [];
      this.unPaidInvoices = []
    }
    if (this.lastItemSK !== "end") {
      if (this.filter.category !== null && this.filter.category !== "") {
        searchParam = (this.filter.category === 'invNo' || this.filter.category === 'cusConfirm') ? encodeURIComponent(`"${this.filter.searchValue}"`) : this.filter.searchValue;
        searchParam = searchParam.toUpperCase();
      } else {
        searchParam = null;
      }

      let result: any = await this.accountService
        .getData(
          `invoices/paging?searchValue=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}&category=${this.filter.category}&invType=${this.filter.invType}`
        )
        .toPromise();
      // .subscribe(async (result: any) => {
      if (result.length === 0) {
        // this.dataMessage = Constants.NO_RECORDS_FOUND;
        this.loaded = true;
        this.disableSearch = false;
        // this.categorizeInvoices(result);
      }
      if (result.length > 0) {
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          this.disableSearch = false;
          element.invStatus = element.invStatus.replace("_", " ");
          this.invoices.push(element);
        }
        if (this.invoices[this.invoices.length - 1].sk !== undefined) {
          this.lastItemSK = encodeURIComponent(
            this.invoices[this.invoices.length - 1].sk
          );
        } else {
          this.lastItemSK = "end";
        }
        this.loaded = true;
        this.categorizeInvoices(this.invoices);
        if (this.searchActive) {
          this.invoicesCAD = [];
          this.invoicesUSD = [];

          this.getTotalInvoices(this.invoices, "manual");
        }
      }
      // });
    }
    // Order invoices
    searchParamOrder = await this.getOrderInvoices(refresh, searchParamOrder);
  }

  emptyPrevCalculation() {
    this.totalCAD = 0;
    this.totalUSD = 0;
    this.openTotalCAD = 0;
    this.openTotalUSD = 0;
    this.paidTotalCAD = 0;
    this.paidTotalUSD = 0;
    this.partiallyPaidTotalCAD = 0;
    this.partiallyPaidTotalUSD = 0;
    this.voidedTotalCAD = 0;
    this.voidedTotalUSD = 0;
    this.invoicesUSD = [];
    this.invoicesCAD = [];
  }


  resetValue() {
    this.filter.searchValue = null
  }
  private getOrderInvoices(refresh: boolean, searchParamOrder: any) {
    if (refresh === true) {
      this.lastItemOrderSK = "";
      this.orderInvoices = [];
      this.openOrderInvoices = [];
      this.paidOrderInvoices = [];
      this.unPaidOrderInvoices = []
      this.emailedOrderInvoices = [];
      this.partiallyPaidOrderInvoices = [];
      this.voidedOrderInvoices = [];
    }
    if (this.lastItemOrderSK !== "end") {

      if (
        this.filter.category !== null && this.filter.category !== ""
      ) {
        searchParamOrder = this.filter.category === 'invNo' || this.filter.category === 'cusConfirm' ? encodeURIComponent(`"${this.filter.searchValue}"`) : this.filter.searchValue;
      } else {
        searchParamOrder = null;
      }
      this.accountService
        .getData(
          `order-invoice/paging?searchValue=${searchParamOrder}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemOrderSK}&category=${this.filter.category}&invType=${this.filter.invType}`
        )
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.disableSearchOrder = false;
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.loadedOrder = true;
            this.categorizeOrderInvoices(result);
          }
          if (result.length > 0) {
            this.disableSearchOrder = false;
            for (let index = 0; index < result.length; index++) {
              const element = result[index];
              element.invStatus = element.invStatus.replace("_", " ");
              this.orderInvoices.push(element);
            }
            if (
              this.orderInvoices[this.orderInvoices.length - 1].sk !== undefined
            ) {
              this.lastItemOrderSK = encodeURIComponent(
                this.orderInvoices[this.orderInvoices.length - 1].sk
              );
            } else {
              this.lastItemOrderSK = "end";
            }
            this.loadedOrder = true;
            this.categorizeOrderInvoices(this.orderInvoices);
            if (this.searchActive) {
              // this.invoicesCAD = [];
              // this.invoicesUSD = [];
              this.getTotalInvoices(this.orderInvoices, "order");
            }
            this.searchActive = false;
          }
        });
    }
    return searchParamOrder;
  }

  onScroll() {
    if (this.loaded && this.loadedOrder) {
      this.getInvoices();
    }
  }
  routeFn(invID: string, type: string) {
    if (type === "manual") {
      this.router.navigateByUrl(`/accounts/invoices/detail/${invID}`);
    } else {
      this.router.navigateByUrl(
        `/accounts/invoices/load-invoice-detail/${invID}`
      );
    }
  }
  categorizeOrderInvoices(invoices: any) {
    if (invoices.length > 0) {
      this.openOrderInvoices = [];
      this.paidOrderInvoices = [];
      this.unPaidOrderInvoices = [];
      this.emailedOrderInvoices = [];
      this.partiallyPaidOrderInvoices = [];
      this.voidedOrderInvoices = [];
      for (const element of invoices) {
        if (element.invStatus === "open") {
          this.openOrderInvoices.push(element);
          this.unPaidOrderInvoices.push(element);
        } else if (element.invStatus === "paid") {
          this.paidOrderInvoices.push(element);
        } else if (element.invStatus === "emailed") {
          this.emailedOrderInvoices.push(element);
        } else if (element.invStatus === "partially paid") {
          this.partiallyPaidOrderInvoices.push(element);
          this.unPaidOrderInvoices.push(element);
        } else if (element.invStatus === "voided") {
          this.voidedOrderInvoices.push(element);
        }
      }
    } else {
      this.openOrderInvoices = [];
      this.paidOrderInvoices = [];
      this.unPaidOrderInvoices = [];
      this.emailedOrderInvoices = [];
      this.partiallyPaidOrderInvoices = [];
      this.voidedOrderInvoices = [];
    }
  }
  categorizeInvoices(invoices: any) {
    if (invoices.length > 0) {
      this.openInvoices = [];
      this.paidInvoices = [];
      this.unPaidInvoices = [];
      this.emailedInvoices = [];
      this.partiallyPaidInvoices = [];
      this.voidedInvoices = [];
      this.findOverDueInvoice(this.openInvoices);
      for (const element of invoices) {
        if (element.invStatus === "open") {
          this.openInvoices.push(element);
          this.unPaidInvoices.push(element);
          this.findOverDueInvoice(this.openInvoices);
        } else if (element.invStatus === "paid") {
          this.paidInvoices.push(element);
        } else if (element.invStatus === "emailed") {
          this.emailedInvoices.push(element);
        } else if (element.invStatus === "partially paid") {
          this.partiallyPaidInvoices.push(element);
          this.unPaidInvoices.push(element);
        } else if (element.invStatus === "voided") {
          this.voidedInvoices.push(element);
        }
      }
    } else {
      this.openInvoices = [];
      this.paidInvoices = [];
      this.emailedInvoices = [];
      this.partiallyPaidInvoices = [];
      this.voidedInvoices = [];
      this.unPaidInvoices = [];
    }
  }
  findOverDueInvoice(invoices: any) {
    for (const operator of invoices) {
      const curDate = new Date().getTime();
      const dueDate = Date.parse(operator.invDueDate);
      if (curDate >= dueDate) {
        delete operator.invStatus;
        operator[`invStatus`] = "overdue";
      } else {
        operator[`invStatus`] = "open";
      }
    }
  }

  /*
   * Get all customers's IDs of names from api
   */
  fetchCustomersByIDs() {
    this.apiService.getData("contacts/get/list").subscribe((result: any) => {
      this.customersObjects = result;
    });
  }

  voidInvoice(invID: string) {
    if (confirm("Are you sure you want to void?") === true) {
      this.disableSearch = true;
      this.disableSearchOrder = true;
      this.accountService
        .deleteData(`invoices/manual/${invID}`)
        .subscribe((result) => {
          if (result !== undefined) {
            this.lastItemSK = "";
            this.lastItemOrderSK = "";
            this.totalCAD = 0;
            this.totalUSD = 0;
            this.openInvoices = [];
            this.openTotalCAD = 0;
            this.openTotalUSD = 0;
            this.paidInvoices = [];
            this.unPaidInvoices = [];
            this.paidTotalCAD = 0;
            this.paidTotalUSD = 0;
            this.emailedInvoices = [];
            this.emailedTotalCAD = 0;
            this.emailedTotalUSD = 0;
            this.partiallyPaidInvoices = [];
            this.partiallyPaidTotalCAD = 0;
            this.partiallyPaidTotalUSD = 0;
            this.voidedInvoices = [];
            this.voidedTotalCAD = 0;
            this.voidedTotalUSD = 0;
            this.invoices = [];
            this.fetchedManualInvoices = [];
            this.orderInvoices = [];
            this.openOrderInvoices = [];
            this.paidOrderInvoices = [];
            this.unPaidOrderInvoices = [];
            this.emailedOrderInvoices = [];
            this.partiallyPaidOrderInvoices = [];
            this.voidedOrderInvoices = [];
            this.fetchedOrderInvoices = [];
            this.fetchInvoices();
            this.getInvoices();
            this.toaster.success("Invoice Deleted Successfully.");
          }
        });
    }
  }

  changeStatus(invID: string) {
    this.invID = invID;
    $("#updateStatusModal").modal("show");
  }
  editFn(invID: string) {
    this.router.navigateByUrl(`/accounts/invoices/edit/${invID}`);
  }
  updateInvStatus() {
    this.accountService
      .getData(`invoices/status/${this.invID}/${this.invNewStatus}`)
      .subscribe(() => {
        this.toaster.success("Invoice Status Updated Successfully.");
        this.fetchInvoices();
        $("#updateStatusModal").modal("hide");
      });
  }
  voidOrderInvoice(invID: string, orderID: string, orderNo: any) {
    if (confirm("Are you sure you want to void?") === true) {
      this.disableSearch = true;
      this.disableSearchOrder = true;
      this.accountService
        .deleteData(`order-invoice/delete/${invID}`)
        .subscribe(() => {
          this.invGenStatus = false;
          this.apiService
            .getData(
              `orders/invoiceStatus/${orderID}/${orderNo}/${this.invGenStatus}`
            )
            .subscribe((res) => {
              if (res !== undefined) {
                this.lastItemSK = "";
                this.lastItemOrderSK = "";
                this.totalCAD = 0;
                this.totalUSD = 0;
                this.openInvoices = [];
                this.openTotalCAD = 0;
                this.openTotalUSD = 0;
                this.paidInvoices = [];
                this.unPaidInvoices = [];
                this.paidTotalCAD = 0;
                this.paidTotalUSD = 0;
                this.emailedInvoices = [];
                this.emailedTotalCAD = 0;
                this.emailedTotalUSD = 0;
                this.partiallyPaidInvoices = [];
                this.partiallyPaidTotalCAD = 0;
                this.partiallyPaidTotalUSD = 0;
                this.voidedInvoices = [];
                this.voidedTotalCAD = 0;
                this.voidedTotalUSD = 0;
                this.invoices = [];
                this.fetchedManualInvoices = [];
                this.orderInvoices = [];
                this.openOrderInvoices = [];
                this.paidOrderInvoices = [];
                this.unPaidOrderInvoices = []
                this.emailedOrderInvoices = [];
                this.partiallyPaidOrderInvoices = [];
                this.voidedOrderInvoices = [];
                this.fetchedOrderInvoices = [];
                this.fetchInvoices();
                this.getInvoices();
                this.toaster.success("Invoice Deleted Successfully.");
              }
            });
        });
    }
  }

  searchFilter() {
    this.lastItemSK = "";
    if (
      this.filter.endDate !== null ||
      this.filter.startDate !== null ||
      this.filter.searchValue !== null ||
      this.filter.category !== null ||
      this.filter.invType !== null
    ) {
      // this.dataMessage = Constants.FETCHING_DATA;
      if (this.filter.startDate !== "" && this.filter.endDate === "") {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filter.startDate === "" && this.filter.endDate !== "") {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toaster.error("Start date should be less than end date");
        return false;
      } else {
        this.disableSearch = true;
        this.disableSearchOrder = true;
        this.searchActive = true;
        this.invoices = [];
        this.orderInvoices = [];
        this.lastItemSK = "";
        this.lastItemOrderSK = "";
        this.dataMessage = Constants.FETCHING_DATA;
        this.emptyPrevCalculation();
        this.getInvoices();
      }
    }
  }

  setMessage() {
    if (this.invoices.length === 0 && this.orderInvoices.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
    }
  }
  resetFilter() {
    this.disableSearch = true;
    this.disableSearchOrder = true;
    // this.searchActive = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      startDate: null,
      endDate: null,
      category: null,
      searchValue: null,
      invNo: null,
      customer: null,
      invType: null,
    };
    this.lastItemSK = "";
    this.lastItemOrderSK = "";
    this.totalCAD = 0;
    this.totalUSD = 0;
    this.openInvoices = [];
    this.openTotalCAD = 0;
    this.openTotalUSD = 0;
    this.paidInvoices = [];
    this.unPaidInvoices = [];
    this.paidTotalCAD = 0;
    this.paidTotalUSD = 0;
    this.emailedInvoices = [];
    this.emailedTotalUSD = 0;
    this.emailedTotalCAD = 0;
    this.partiallyPaidInvoices = [];
    this.partiallyPaidTotalCAD = 0;
    this.partiallyPaidTotalUSD = 0;
    this.voidedInvoices = [];
    this.voidedTotalCAD = 0;
    this.voidedTotalUSD = 0;
    this.invoices = [];
    this.orderInvoices = [];
    this.fetchedManualInvoices = [];
    this.fetchedOrderInvoices = [];
    this.emptyPrevCalculation();
    this.fetchInvoices();
    this.getInvoices();
  }

  refreshData() {
    this.disableSearch = true;
    this.disableSearchOrder = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      startDate: null,
      endDate: null,
      category: null,
      searchValue: null,
      invNo: null,
      customer: null,
      invType: null
    };
    this.lastItemSK = "";
    this.lastItemOrderSK = "";
    this.totalCAD = 0;
    this.totalUSD = 0;
    this.openInvoices = [];
    this.openTotalCAD = 0;
    this.openTotalUSD = 0;
    this.paidInvoices = [];
    this.unPaidInvoices = [];
    this.paidTotalCAD = 0;
    this.paidTotalUSD = 0;
    this.emailedInvoices = [];
    this.emailedTotalCAD = 0;
    this.emailedTotalUSD = 0;
    this.partiallyPaidInvoices = [];
    this.partiallyPaidTotalCAD = 0;
    this.partiallyPaidTotalUSD = 0;
    this.voidedInvoices = [];
    this.voidedTotalCAD = 0;
    this.voidedTotalUSD = 0;
    this.invoices = [];
    this.orderInvoices = [];
    this.fetchedManualInvoices = [];
    this.fetchedOrderInvoices = [];
    this.fetchInvoices();
    this.getInvoices();
  }

  async getData() {
    this.allData = []
    let searchParam = null;
    let searchParamOrder = null
    this.lastItemOrderSK = ""
    this.lastItemSK = ""
    if (
      this.filter.invNo !== null &&
      this.filter.invNo !== "" &&
      this.filter.invNo !== "%22null%22"
    ) {
      searchParamOrder = this.filter.invNo
    } else {
      searchParamOrder = null;
    }
    if (this.filter.invNo !== null && this.filter.invNo !== "") {
      searchParam = this.filter.invNo
    } else {
      searchParam = null;
    }
    let result: any = await this.accountService
      .getData(
        `invoices/export?invNo=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}&customer=${this.filter.customer}&invType=${this.filter.invType}`
      )
      .toPromise();
    if (result && result.length > 0) {
      this.allData = this.allData.concat(result)
    }
    let orderInvoice: any = await this.accountService
      .getData(
        `order-invoice/export?invNo=${searchParamOrder}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemOrderSK}&customer=${this.filter.customer}&invType=${this.filter.invType}`
      ).toPromise();
    if (orderInvoice && orderInvoice.length > 0) {
      this.allData = this.allData.concat(orderInvoice)
    }
  }
  async generateCSV() {
    this.exportLoading = true;
    let dataObject = []
    let csvArray = []

    try {
      await this.getData();

      if (this.allData.length > 0) {
        for (const element of this.allData) {
          let obj = {}
          obj["invoice#"] = element.invNo
          obj["Date"] = element.txnDate
          obj["Customer"] = this.customersObjects[element.customerID]
          obj["Order#"] = element.invNo
          obj["Freight Amount"] = (element.charges !== undefined) ? element.charges.freightFee.amount : "-"
          obj["Tax"] = (element.taxesAmt === undefined) ? element.taxAmount : element.taxesAmt
          obj["Total Amount"] = element.subTotal
          obj["Amount Received"] = element.amountReceived
          obj["Balance"] = element.balance
          obj["Due Date"] = element.invDueDate
          obj["Invoice Status"] = element.invStatus
          dataObject.push(obj)
        }
        let headers = Object.keys(dataObject[0]).join(',')
        headers += '\n'
        csvArray.push(headers)
        for (const element of dataObject) {
          let value = Object.values(element).join(',')
          value += '\n'
          csvArray.push(value)
        }
        const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8' })
        const link = document.createElement('a');
        if (link.download !== undefined) {

          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}-invoice.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        this.exportLoading = false
      }
      else {
        this.toaster.success("No Data Found")
        this.exportLoading = false
      }
    } catch (error) {
      this.exportLoading = false
    }
  }

  async openPDFPreview() {
    this.exportLoading = true
    await this.getData();
    let ngbModalOptions: NgbModalOptions = {
      keyboard: true,
      windowClass: "preview"
    };
    this.preview = this.modalService.open(this.previewInvoiceModal,
      ngbModalOptions
    )
    this.exportLoading = false
  }
  generatePDF() {
    let data = document.getElementById("print_wrap");
    html2pdf(data, {
      margin: 0,
      pagebreak: { mode: "avoid-all" },
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2Canvas: {
        dpi: 200,
        letterRendering: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" }
    })
    $("#previewInvoiceModal").modal("hide");

  }
}
