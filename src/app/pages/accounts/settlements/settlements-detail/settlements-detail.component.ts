import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService } from "src/app/services";

@Component({
  selector: "app-settlements-detail",
  templateUrl: "./settlements-detail.component.html",
  styleUrls: ["./settlements-detail.component.css"],
})
export class SettlementsDetailComponent implements OnInit {
  noRecordMsg: string = Constants.NO_RECORDS_FOUND;
  settlementID = "";
  driverDetail = {
    firstName: "",
    lastName: "",
    paymentDetails: {
      paymentType: "",
    },
  };
  settlementData = {
    type: null,
    entityId: null,
    setNo: "",
    txnDate: null,
    fromDate: null,
    toDate: null,
    tripIds: [],
    miles: {
      tripsTotal: 0,
      driverTotal: 0,
      tripsLoaded: 0,
      driverLoaded: 0,
      tripsEmpty: 0,
      driverEmpty: 0,
      tripsTeam: 0,
      driverHours: 0,
      teamHours: 0,
      totalHours: 0,
    },
    addition: [],
    deduction: [],
    additionTotal: 0,
    deductionTotal: 0,
    paymentTotal: 0,
    taxes: 0,
    finalTotal: 0,
    subTotal: 0,
    transactionLog: [],
    currency: "",
    paymentInfo: {
      lMiles: 0,
      lMileTeam: 0,
      eMileTeam: 0,
      rate: 0,
      eMiles: 0,
      pRate: 0,
      dRate: 0,
      pType: "",
      // drivers: [],
    },
  };
  expenses = [];
  tripsObj = [];
  accounts = [];
  operatorDetail = {
    cName: "",
  };

  entityName = "";
  entityPaymentType = "";
  accountsObjects = {};
  accountsIntObjects = {};
  payments = [];
  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.settlementID = this.route.snapshot.params[`settlementID`];
    this.fetchSettlementDetail();
    this.fetchTrips();
    this.fetchAccountsByIDs();
    this.fetchAccountsByInternalIDs();
    this.fetchPayments();
  }

  fetchSettlementDetail() {
    this.accountService
      .getData(`settlement/detail/${this.settlementID}`)
      .subscribe((result: any) => {
        this.settlementData = result[0];
        this.settlementData.transactionLog.map((v: any) => {
          v.type = v.type.replace("_", " ");
        });
        if (this.settlementData.paymentInfo) {
          this.entityPaymentType = this.settlementData.paymentInfo.pType;
        }
        if (this.settlementData.type === "driver") {
          this.fetchDriverDetail(this.settlementData.entityId);
        } else {
          this.fetchContact(this.settlementData.entityId);
        }
      });
  }

  fetchDriverDetail(driverID) {
    this.apiService.getData(`drivers/${driverID}`).subscribe((result: any) => {
      this.driverDetail = result.Items[0];
      this.entityName = `${this.driverDetail.firstName} ${this.driverDetail.lastName} `;
    });
  }

  fetchContact(contactID) {
    this.apiService
      .getData(`contacts/detail/${contactID}`)
      .subscribe((result: any) => {
        this.operatorDetail = result.Items[0];
        this.entityName = this.operatorDetail.cName;
      });
  }

  fetchTrips() {
    this.apiService.getData(`trips/get/list`).subscribe((result: any) => {
      this.tripsObj = result;
    });
  }

  fetchAccountsByIDs() {
    this.accountService
      .getData("chartAc/get/list/all")
      .subscribe((result: any) => {
        this.accountsObjects = result;
      });
  }

  fetchAccountsByInternalIDs() {
    this.accountService
      .getData("chartAc/get/internalID/list/all")
      .subscribe((result: any) => {
        this.accountsIntObjects = result;
      });
  }

  fetchPayments() {
    this.accountService
      .getData(`driver-payments/settlement/${this.settlementID}`)
      .subscribe((result: any) => {
        result.map((v) => {
          let obj = {
            paymentNo: v.paymentNo,
            txnDate: v.txnDate,
            amount: 0,
          };
          v.settlData.map((k) => {
            if (k.settlementId === this.settlementID) {
              obj.amount += Number(k.paidAmount);
            }
          });

          this.payments.push(obj);
          this.payments.sort((a, b) => {
            return (
              new Date(a.txnDate).valueOf() - new Date(b.txnDate).valueOf()
            );
          });
        });
      });
  }
}
