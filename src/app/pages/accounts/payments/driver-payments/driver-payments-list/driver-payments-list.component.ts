import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService, DashboardUtilityService, ListService } from "src/app/services";

@Component({
  selector: "app-driver-payments-list",
  templateUrl: "./driver-payments-list.component.html",
  styleUrls: ["./driver-payments-list.component.css"],
})
export class DriverPaymentsListComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;

  payments = [];
  settlementIds = [];
  filter = {
    startDate: null,
    endDate: null,
    type: null,
    searchValue: null,
  };
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  lastItemSK = "";
  loaded = false;
  disableSearch = false;
  driversObject: any = {};
  carriersObject: any = {};
  ownerOpObjects: any = {};

  constructor(
    private toaster: ToastrService,
    private accountService: AccountService,
    private apiService: ApiService,
    private dashboardUtilityService: DashboardUtilityService,
    private listService: ListService,
  ) { }

  async ngOnInit() {

    this.fetchDriverPayments();
    this.driversObject = await this.dashboardUtilityService.getDrivers();
    this.carriersObject = await this.dashboardUtilityService.getContactsCarriers();
    this.ownerOpObjects = await this.dashboardUtilityService.getOwnerOperators();
  }

  unitTypeChange() {
    this.filter.searchValue = null;
  }

  fetchDriverPayments(refresh?: boolean) {
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
          `driver-payments/paging?type=${this.filter.type}&searchValue=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}`
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
              v.currency = v.currency ? v.currency : "CAD";
              v.url = `/accounts/payments/driver-payments/detail/${v.paymentID}`;
              if (v.payMode) {
                v.payMode = v.payMode.replace("_", " ");
              } else {
                v.payMode = "-";
              }
              v.paymentTo = v.paymentTo.replace("_", " ");
              v.settlData.map((k) => {
                k.status = k.status.replace("_", " ");
              });
              this.payments.push(v);
            });
            this.loaded = true;
          }
        });
    }
  }


  searchFilter() {
    if (
      this.filter.type !== null ||
      this.filter.searchValue !== "" ||
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
        this.fetchDriverPayments();
      }
    }
  }

  resetFilter() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.payments = [];
    this.filter = {
      startDate: null,
      endDate: null,
      type: null,
      searchValue: null,
    };
    this.lastItemSK = "";
    this.fetchDriverPayments();
  }

  onScroll() {
    if (this.loaded) {
      this.fetchDriverPayments();
    }
    this.loaded = false;
  }

  refreshData() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.payments = [];
    this.filter = {
      startDate: null,
      endDate: null,
      type: null,
      searchValue: null,
    };
    this.lastItemSK = "";
    this.fetchDriverPayments();
  }

  async voidPayment(payData) {
    console.log('innnnnnn') 
    let payObj = {
      showModal: true,
      page: "list",
      paymentNo: payData.paymentNo,
      paymentID: payData.paymentID
    };
    this.listService.triggerVoidDriverPayment(payObj);

    // let result = await this.accountService.getData(`driver-payments/void/${paymentID}`).toPromise();
    // console.log('result', result);
  }
}
