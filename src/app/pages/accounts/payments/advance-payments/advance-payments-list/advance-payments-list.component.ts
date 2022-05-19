import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService, DashboardUtilityService } from "src/app/services";

@Component({
  selector: "app-advance-payments-list",
  templateUrl: "./advance-payments-list.component.html",
  styleUrls: ["./advance-payments-list.component.css"],
})
export class AdvancePaymentsListComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  payments = [];
  filter = {
    searchValue: null,
    startDate: null,
    endDate: null,
    type: null,
    payType: null
  };
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  drivers = [];
  contacts: any = {};

  lastItemSK = "";
  loaded = false;
  disableSearch = false;

  driversObject: any = {};
  carriersObject: any = {};
  ownerOpObjects: any = {};
  employees: any = {};
  vendors: any = {};

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private toaster: ToastrService,
    private dashboardUtilityService: DashboardUtilityService
  ) { }

  async ngOnInit() {
    this.fetchPayments();
    this.driversObject = await this.dashboardUtilityService.getDrivers();
    this.carriersObject = await this.dashboardUtilityService.getContactsCarriers();
    this.ownerOpObjects = await this.dashboardUtilityService.getOwnerOperators();
    this.employees = await this.dashboardUtilityService.getEmployees();
    this.vendors = await this.dashboardUtilityService.getVendors();
  }

  fetchPayments(refresh?: boolean) {
    let searchParam = null;
    if (refresh === true) {
      this.lastItemSK = "";
      this.payments = [];
    }
    if (this.lastItemSK !== "end") {

      if (this.filter.searchValue !== null && this.filter.searchValue !== "") {
        searchParam = this.filter.type === 'paymentNo' ? encodeURIComponent(`"${this.filter.searchValue}"`) : `${this.filter.searchValue}`;
      } else {
        searchParam = null;
      }
      this.accountService
        .getData(
          `advance/paging?type=${this.filter.type}&searchValue=${searchParam}&payType=${this.filter.payType}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}`
        )
        .subscribe((result: any) => {
          if (result.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.disableSearch = false;
          }
          if (result.length > 0) {
            this.disableSearch = false;
            if (result[result.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(
                result[result.length - 1].sk
              );
            } else {
              this.lastItemSK = "end";
            }
            result.map((v) => {
              v.url = `/accounts/payments/advance-payments/detail/${v.paymentID}`;
              v.paymentTo = v.paymentTo.replace("_", " ");
              if (v.payMode) {
                v.payMode = v.payMode.replace("_", " ");
              } else {
                v.payMode = "-";
              }
              v.newStatus = v.status.replace("_", " ");
              v.paidAmount = v.amount - v.pendingPayment;
              v.paidAmount = v.paidAmount.toFixed(2);
              this.payments.push(v);
            });
            this.loaded = true;
          }
        }, err => {
          this.disableSearch = false;
        });
    }
  }


  deletePayment(paymentID) {
    if (confirm("Are you sure you want to void?") === true) {
      this.accountService
        .deleteData(`advance/delete/${paymentID}`)
        .subscribe((result: any) => {
          this.lastItemSK = "";
          this.payments = [];
          this.dataMessage = Constants.FETCHING_DATA;
          this.fetchPayments();
          this.toaster.success("Advance payment voided successfully.");
        });
    }
  }

  searchFilter() {
    if (this.filter.type != null && this.filter.searchValue == null) {
      this.toaster.error('Please type value')
      this.disableSearch = false;
      return;
    }
    if (
      this.filter.type !== null ||
      this.filter.searchValue !== null ||
      this.filter.payType !== null ||
      this.filter.endDate !== null ||
      this.filter.startDate !== null
    ) {
      this.disableSearch = true;
      if (this.filter.startDate != "" && this.filter.endDate == "") {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filter.startDate == "" && this.filter.endDate != "") {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toaster.error("Start date should be less then end date");
        return false;
      } else {
        this.dataMessage = Constants.FETCHING_DATA;
        this.payments = [];
        this.lastItemSK = "";
        this.fetchPayments();
      }
    }
  }

  resetFilter() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      startDate: null,
      endDate: null,
      type: null,
      payType: null,
      searchValue: null,
    };
    this.payments = [];
    this.lastItemSK = "";
    this.fetchPayments();
  }

  onScroll() {
    if (this.loaded) {
      this.fetchPayments();
    }
    this.loaded = false;
  }

  refreshData() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      searchValue: null,
      startDate: null,
      endDate: null,
      type: null,
      payType: null,
    };
    this.payments = [];
    this.lastItemSK = "";
    this.fetchPayments();
  }

  unitTypeChange() {
    this.filter.searchValue = null;
  }
}
