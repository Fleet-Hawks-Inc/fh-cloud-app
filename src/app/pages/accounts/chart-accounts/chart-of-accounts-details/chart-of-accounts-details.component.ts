import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService, ApiService } from "../../../../services";
import Constants from "../../../fleet/constants";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-chart-of-accounts-details",
  templateUrl: "./chart-of-accounts-details.component.html",
  styleUrls: ["./chart-of-accounts-details.component.css"],
})
export class ChartOfAccountsDetailsComponent implements OnInit {
  dataMsgUsd = Constants.FETCHING_DATA;
  dataMsgCad = Constants.FETCHING_DATA;
  customersObject: any = {};
  drivers: any = {};
  categories: any = {};
  empList: any = {};
  actID = "";
  account = {
    first: "",
    last: "",
    actName: "",
    actClassID: "",
    actType: "",
    actNo: 0,
    actDesc: "",
    actDash: false,
    opnBalCAD: 0,
    opnBalTypeCAD: "debit",
    actDate: "",
    closingAmtCAD: 0,
    transactionLogCAD: [],
    opnBalUSD: 0,
    opnBalTypeUSD: "debit",
    closingAmtUSD: 0,
    transactionLogUSD: [],
    isFeatEnabled: true,
  };
  periodVarianceCAD = 0;
  periodVarianceUSD = 0;
  dataMessage: string = Constants.FETCHING_DATA;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  accountsClassObjects = {};
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  filter = {
    startDate: null,
    endDate: null,
  };
  merged = {};
  lastKey = "";
  transactionLogCAD = [];
  transactionLogUSD = [];
  currTab = "CAD";
  loaded = false;
  lastTimestamp = "";
  lastKeyUsd = "";
  lastTimestampUsd = "";
  isLoad = false;
  isLoadText = "Load More";

  constructor(
    private accountService: AccountService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.actID = this.route.snapshot.params[`actID`];
    if (this.actID) {
      this.fetchAccount();
      this.logsCADPaging();
    }
  }
  fetchAccountClassByIDs() {
    this.accountService
      .getData("chartAc/get/accountClass/list/all")
      .subscribe((result: any) => {
        this.accountsClassObjects = result;
      });
  }
  getEntityList() {
    this.apiService.getData("contacts/get/list").subscribe((result: any) => {
      this.customersObject = result;
      if (result) {
        this.apiService
          .getData(`drivers/get/list`)
          .subscribe((result1: any) => {
            this.drivers = result1;
            if (result1) {
              this.accountService
                .getData(`income/categories/list`)
                .subscribe((res: any) => {
                  this.categories = res;
                  if (res) {
                    this.apiService
                      .getData("contacts/get/emp/list")
                      .subscribe((empList) => {
                        this.empList = empList;
                        this.merged = {
                          ...this.customersObject,
                          ...this.drivers,
                          ...this.categories,
                          ...this.empList,
                        };
                      });
                  }
                });
            }
          });
      }
    });
  }

  fetchAccount() {
    this.accountService
      .getData(`chartAc/account/${this.actID}`)
      .subscribe((res) => {
        this.account = res;
        if (!this.account.isFeatEnabled) {
          this.fetchAccountClassByIDs();
          this.getEntityList();
        } else {
          // this.transactionLogCAD = res.transactionLogCAD;
        }

        // -----
        this.account[`first`] = this.account.actName.substring(
          0,
          this.account.actName.indexOf(" ")
        );
        this.account[`last`] = this.account.actName.substring(
          this.account.actName.indexOf(" ") + 1,
          this.account.actName.length
        );
        for (const element of this.account.transactionLogCAD) {
          element.type = element.type.replace("_", " "); // replacing _ with white space in trx type
        }
        for (const element of this.account.transactionLogUSD) {
          element.type = element.type.replace("_", " "); // replacing _ with white space in trx type
        }

        this.periodVarianceCAD = Math.abs(
          Number(this.account.opnBalCAD) - Number(this.account.closingAmtCAD)
        );
        // if (this.account.closingAmtCAD > this.account.opnBalCAD) {
        //   this.periodVarianceCAD = +(
        //     this.account.closingAmtCAD - this.account.opnBalCAD
        //   ).toFixed(2);
        // } else if (
        //   this.account.opnBalCAD > this.account.closingAmtCAD &&
        //   this.account.closingAmtCAD === 0
        // ) {
        //   this.periodVarianceCAD = +(
        //     this.account.opnBalCAD - this.account.closingAmtCAD
        //   ).toFixed(2);
        // } else if (
        //   this.account.opnBalCAD > this.account.closingAmtCAD &&
        //   this.account.closingAmtCAD > 0
        // ) {
        //   this.periodVarianceCAD = +(
        //     this.account.opnBalCAD - this.account.closingAmtCAD
        //   ).toFixed(2);
        // } else if (this.account.opnBalCAD === this.account.closingAmtCAD) {
        //   this.periodVarianceCAD = +(
        //     this.account.closingAmtCAD - this.account.opnBalCAD
        //   ).toFixed(2);
        // } else if (
        //   this.account.closingAmtCAD < 0 &&
        //   this.account.opnBalCAD > 0
        // ) {
        //   this.periodVarianceCAD = +(
        //     this.account.opnBalCAD + this.account.closingAmtCAD
        //   ).toFixed(2);
        // } else if (
        //   this.account.opnBalCAD === 0 &&
        //   this.account.closingAmtCAD < 0
        // ) {
        //   this.periodVarianceCAD = -1 * +this.account.closingAmtCAD.toFixed(2);
        // }

        this.periodVarianceUSD = Math.abs(
          Number(this.account.opnBalUSD) - Number(this.account.closingAmtUSD)
        );
        // if (this.account.closingAmtUSD > this.account.opnBalUSD) {
        //   this.periodVarianceUSD = +(
        //     this.account.closingAmtUSD - this.account.opnBalUSD
        //   ).toFixed(2);
        // } else if (
        //   this.account.opnBalUSD > this.account.closingAmtUSD &&
        //   this.account.closingAmtUSD === 0
        // ) {
        //   this.periodVarianceUSD = +(
        //     this.account.opnBalUSD - this.account.closingAmtUSD
        //   ).toFixed(2);
        // } else if (
        //   this.account.opnBalUSD > this.account.closingAmtUSD &&
        //   this.account.closingAmtUSD > 0
        // ) {
        //   this.periodVarianceUSD = +(
        //     this.account.opnBalUSD - this.account.closingAmtUSD
        //   ).toFixed(2);
        // } else if (this.account.opnBalUSD === this.account.closingAmtUSD) {
        //   this.periodVarianceUSD = +(
        //     this.account.closingAmtUSD - this.account.opnBalUSD
        //   ).toFixed(2);
        // } else if (
        //   this.account.closingAmtUSD < 0 &&
        //   this.account.opnBalUSD > 0
        // ) {
        //   this.periodVarianceUSD = +(
        //     this.account.opnBalUSD + this.account.closingAmtUSD
        //   ).toFixed(2);
        // } else if (
        //   this.account.opnBalUSD === 0 &&
        //   this.account.closingAmtUSD < 0
        // ) {
        //   this.periodVarianceUSD = -1 * +this.account.closingAmtUSD.toFixed(2);
        // }
      });
  }

  logsCADPaging() {
    if (this.lastKey !== "end") {
      this.accountService
        .getData(
          `chartAc/logs/pagination/CAD/${this.actID}?lastkey=${this.lastKey}&recTime=${this.lastTimestamp}&start=${this.filter.startDate}&end=${this.filter.endDate}`
        )
        .subscribe((res) => {
          this.lastKey = "end";
          if (res.length === 0) {
            this.dataMsgCad = Constants.NO_RECORDS_FOUND;
          }
          if (res.length > 0) {
            if (res[res.length - 1].sk !== undefined) {
              this.lastKey = encodeURIComponent(res[res.length - 1].sk);
            }
            if (res[res.length - 1].trxCreated !== undefined) {
              this.lastTimestamp = encodeURIComponent(
                res[res.length - 1].trxCreated
              );
            }
          }
          res.map((v) => {
            v.entityType = v.entityType.replace("_", " ");
          });
          this.loaded = true;
          this.transactionLogCAD = this.transactionLogCAD.concat(res);
        });
    }
  }

  logsUSDPaging() {
    if (this.lastKeyUsd !== "end") {
      this.accountService
        .getData(
          `chartAc/logs/pagination/USD/${this.actID}?lastkey=${this.lastKeyUsd}&recTime=${this.lastTimestampUsd}&start=${this.filter.startDate}&end=${this.filter.endDate}`
        )
        .subscribe((res) => {
          this.lastKeyUsd = "end";
          if (res.length === 0) {
            this.dataMsgUsd = Constants.NO_RECORDS_FOUND;
          }
          if (res.length > 0) {
            if (res[res.length - 1].sk !== undefined) {
              this.lastKeyUsd = encodeURIComponent(res[res.length - 1].sk);
            }
            if (res[res.length - 1].trxCreated !== undefined) {
              this.lastTimestampUsd = encodeURIComponent(
                res[res.length - 1].trxCreated
              );
            }
          }
          res.map((v) => {
            v.entityType = v.entityType.replace("_", " ");
          });
          this.loaded = true;
          this.transactionLogUSD = this.transactionLogUSD.concat(res);
        });
    }
  }

  searchFilter() {
    // this.periodVarianceUSD = 0;
    // this.periodVarianceCAD = 0;
    if (this.filter.endDate !== null || this.filter.startDate !== null) {
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
        if (!this.account.isFeatEnabled) {
          this.account = {
            first: "",
            last: "",
            actName: "",
            actType: "",
            actNo: 0,
            actClassID: "",
            actDash: false,
            actDesc: "",
            opnBalCAD: 0,
            opnBalTypeCAD: "debit",
            actDate: "",
            closingAmtCAD: 0,
            transactionLogCAD: [],
            opnBalUSD: 0,
            opnBalTypeUSD: "debit",
            closingAmtUSD: 0,
            transactionLogUSD: [],
            isFeatEnabled: false,
          };
          this.dataMessage = Constants.FETCHING_DATA;
          this.fetchDetails();
        } else {
          if (this.currTab === "CAD") {
            this.lastKey = "";
            this.lastTimestamp = "";
            this.lastKeyUsd = "";
            this.lastTimestampUsd = "";
            this.dataMsgCad = Constants.FETCHING_DATA;
            this.dataMsgUsd = Constants.FETCHING_DATA;
            this.transactionLogCAD = [];
            this.transactionLogUSD = [];
            this.logsCADPaging();
          } else if (this.currTab === "USD") {
            this.lastKeyUsd = "";
            this.lastTimestampUsd = "";
            this.dataMsgUsd = Constants.FETCHING_DATA;
            this.dataMsgCad = Constants.FETCHING_DATA;
            this.lastKey = "";
            this.lastTimestamp = "";
            this.transactionLogUSD = [];
            this.transactionLogCAD = [];
            this.logsUSDPaging();
          }
        }
      }
    }
  }
  resetFilter() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      startDate: null,
      endDate: null,
    };
    this.fetchAccount();
  }
  fetchDetails() {
    this.accountService
      .getData(
        `chartAc/search/detail-page?actID=${this.actID}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}`
      )
      .subscribe((result: any) => {
        this.account = result[0];
        this.periodVarianceCAD = 0;
        for (const element of this.account.transactionLogCAD) {
          element.type = element.type.replace("_", " "); // replacing _ with white space in trx type
        }
        if (this.account.closingAmtCAD > this.account.opnBalCAD) {
          this.periodVarianceCAD = +(
            this.account.closingAmtCAD - this.account.opnBalCAD
          ).toFixed(2);
        } else if (
          this.account.opnBalCAD > this.account.closingAmtCAD &&
          this.account.closingAmtCAD > 0
        ) {
          this.periodVarianceCAD = +(
            this.account.opnBalCAD - this.account.closingAmtCAD
          ).toFixed(2);
        } else if (
          this.account.opnBalCAD > this.account.closingAmtCAD &&
          this.account.closingAmtCAD === 0
        ) {
          this.periodVarianceCAD = +(
            this.account.opnBalCAD - this.account.closingAmtCAD
          ).toFixed(2);
        } else if (this.account.opnBalCAD === this.account.closingAmtCAD) {
          this.periodVarianceCAD = +(
            this.account.closingAmtCAD - this.account.opnBalCAD
          ).toFixed(2);
        } else if (
          this.account.closingAmtCAD < 0 &&
          this.account.opnBalCAD > 0
        ) {
          this.periodVarianceCAD = +(
            this.account.opnBalCAD + this.account.closingAmtCAD
          ).toFixed(2);
        } else if (
          this.account.opnBalCAD === 0 &&
          this.account.closingAmtCAD < 0
        ) {
          this.periodVarianceCAD = -1 * +this.account.closingAmtCAD.toFixed(2);
        }

        this.periodVarianceUSD = 0;
        for (const element of this.account.transactionLogUSD) {
          element.type = element.type.replace("_", " "); // replacing _ with white space in trx type
        }
        if (this.account.closingAmtUSD > this.account.opnBalUSD) {
          this.periodVarianceUSD = +(
            this.account.closingAmtUSD - this.account.opnBalUSD
          ).toFixed(2);
        } else if (
          this.account.opnBalUSD > this.account.closingAmtUSD &&
          this.account.closingAmtUSD > 0
        ) {
          this.periodVarianceUSD = +(
            this.account.opnBalUSD - this.account.closingAmtUSD
          ).toFixed(2);
        } else if (
          this.account.opnBalUSD > this.account.closingAmtUSD &&
          this.account.closingAmtUSD === 0
        ) {
          this.periodVarianceUSD = +(
            this.account.opnBalUSD - this.account.closingAmtUSD
          ).toFixed(2);
        } else if (this.account.opnBalUSD === this.account.closingAmtUSD) {
          this.periodVarianceUSD = +(
            this.account.closingAmtUSD - this.account.opnBalUSD
          ).toFixed(2);
        } else if (
          this.account.closingAmtUSD < 0 &&
          this.account.opnBalUSD > 0
        ) {
          this.periodVarianceUSD = +(
            this.account.opnBalUSD + this.account.closingAmtUSD
          ).toFixed(2);
        } else if (
          this.account.opnBalUSD === 0 &&
          this.account.closingAmtUSD < 0
        ) {
          this.periodVarianceUSD = -1 * +this.account.closingAmtUSD.toFixed(2);
        }
      });
  }

  onScroll() {
    if (this.loaded && this.account.isFeatEnabled) {
      this.isLoad = true;
      this.isLoadText = "Loading";
      if (this.currTab === "CAD") {
        this.logsCADPaging();
      } else if (this.currTab === "USD") {
        this.logsUSDPaging();
      }
    }
    this.loaded = false;
  }

  changeTab(type) {
    this.currTab = type;
    if (this.currTab === "CAD") {
      if (this.transactionLogCAD.length == 0) {
        this.logsCADPaging();
      }
    } else if (this.currTab === "USD") {
      if (this.transactionLogUSD.length == 0) {
        this.logsUSDPaging();
      }
    }
  }

  // fetchAccount() {
  //   this.accountService
  //     .getData(`chartAc/account/${this.actID}`)
  //     .subscribe((res) => {
  //       this.account = res;
  //       if(!this.account.isFeatEnabled) {
  //         this.fetchAccountClassByIDs();
  //       }
  //       this.account[`first`] = this.account.actName.substring(
  //         0,
  //         this.account.actName.indexOf(" ")
  //       );
  //       this.account[`last`] = this.account.actName.substring(
  //         this.account.actName.indexOf(" ") + 1,
  //         this.account.actName.length
  //       );
  //       for (const element of this.account.transactionLogCAD) {
  //         element.type = element.type.replace("_", " "); // replacing _ with white space in trx type
  //       }
  //       for (const element of this.account.transactionLogUSD) {
  //         element.type = element.type.replace("_", " "); // replacing _ with white space in trx type
  //       }
  //       if (this.account.closingAmtCAD > this.account.opnBalCAD) {
  //         this.periodVarianceCAD = +(
  //           this.account.closingAmtCAD - this.account.opnBalCAD
  //         ).toFixed(2);
  //       } else if (
  //         this.account.opnBalCAD > this.account.closingAmtCAD &&
  //         this.account.closingAmtCAD === 0
  //       ) {
  //         this.periodVarianceCAD = +(
  //           this.account.opnBalCAD - this.account.closingAmtCAD
  //         ).toFixed(2);
  //       } else if (
  //         this.account.opnBalCAD > this.account.closingAmtCAD &&
  //         this.account.closingAmtCAD > 0
  //       ) {
  //         this.periodVarianceCAD = +(
  //           this.account.opnBalCAD - this.account.closingAmtCAD
  //         ).toFixed(2);
  //       } else if (this.account.opnBalCAD === this.account.closingAmtCAD) {
  //         this.periodVarianceCAD = +(
  //           this.account.closingAmtCAD - this.account.opnBalCAD
  //         ).toFixed(2);
  //       } else if (
  //         this.account.closingAmtCAD < 0 &&
  //         this.account.opnBalCAD > 0
  //       ) {
  //         this.periodVarianceCAD = +(
  //           this.account.opnBalCAD + this.account.closingAmtCAD
  //         ).toFixed(2);
  //       } else if (
  //         this.account.opnBalCAD === 0 &&
  //         this.account.closingAmtCAD < 0
  //       ) {
  //         this.periodVarianceCAD = -1 * +this.account.closingAmtCAD.toFixed(2);
  //       }

  //       if (this.account.closingAmtUSD > this.account.opnBalUSD) {
  //         this.periodVarianceUSD = +(
  //           this.account.closingAmtUSD - this.account.opnBalUSD
  //         ).toFixed(2);
  //       } else if (
  //         this.account.opnBalUSD > this.account.closingAmtUSD &&
  //         this.account.closingAmtUSD === 0
  //       ) {
  //         this.periodVarianceUSD = +(
  //           this.account.opnBalUSD - this.account.closingAmtUSD
  //         ).toFixed(2);
  //       } else if (
  //         this.account.opnBalUSD > this.account.closingAmtUSD &&
  //         this.account.closingAmtUSD > 0
  //       ) {
  //         this.periodVarianceUSD = +(
  //           this.account.opnBalUSD - this.account.closingAmtUSD
  //         ).toFixed(2);
  //       } else if (this.account.opnBalUSD === this.account.closingAmtUSD) {
  //         this.periodVarianceUSD = +(
  //           this.account.closingAmtUSD - this.account.opnBalUSD
  //         ).toFixed(2);
  //       } else if (
  //         this.account.closingAmtUSD < 0 &&
  //         this.account.opnBalUSD > 0
  //       ) {
  //         this.periodVarianceUSD = +(
  //           this.account.opnBalUSD + this.account.closingAmtUSD
  //         ).toFixed(2);
  //       } else if (
  //         this.account.opnBalUSD === 0 &&
  //         this.account.closingAmtUSD < 0
  //       ) {
  //         this.periodVarianceUSD = -1 * +this.account.closingAmtUSD.toFixed(2);
  //       }
  //     });
  // }
}
