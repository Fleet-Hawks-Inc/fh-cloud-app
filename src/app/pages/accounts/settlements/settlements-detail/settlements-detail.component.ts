import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService, ListService } from "src/app/services";

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
    entityName: '',
    setNo: "",
    txnDate: "",
    fromDate: null,
    toDate: null,
    tripIds: [],
    tripNames: [],
    trpData: [],
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
      drivers: [],
      driverLoadedTeam: 0,
      driverEmptyTeam: 0,
    },
    addition: [],
    deduction: [],
    additionTotal: 0,
    deductionTotal: 0,
    taxObj: {
      gstPrcnt: 0,
      pstPrcnt: 0,
      hstPrcnt: 0,
      gstAmount: 0,
      pstAmount: 0,
      hstAmount: 0,
      carrLocalTax: 0,
      carrLocalAmount: 0,
      carrFedTax: 0,
      carrFedAmount: 0,
    },
    paymentTotal: 0,
    taxes: 0,
    subTotal: 0,
    finalTotal: 0,
    fuelAdd: 0,
    fuelDed: 0,
    status: "unpaid",
    paymentLinked: false,
    pendingPayment: 0,
    currency: "CAD",
    paymentInfo: {
      lMiles: 0,
      lMileTeam: 0,
      eMileTeam: 0,
      rate: 0,
      eMiles: 0,
      pRate: 0,
      dRate: 0,
      pType: "",
    },
    fuelIds: [],
    fuelData: [],
    transactionLog: [],
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
  showModal = true;
  selectedFuelEnteries = [];
  showDetailBtn = false;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private listService: ListService
  ) { }

  ngOnInit() {
    this.settlementID = this.route.snapshot.params[`settlementID`];
    this.fetchSettlementDetail();
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
        this.entityName = this.settlementData.entityName;
        this.fetchSelectedFuelExpenses();
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

  showPreviewModal() {
    this.showModal = true;
    let obj = {
      showModal: this.showModal,
      settlementData: this.settlementData,
      entityName: this.entityName,
      fuelEnteries: this.selectedFuelEnteries,
    };
    this.listService.showSettlementsDetailPreview(obj);
  }

  async fetchSelectedFuelExpenses() {
    if (this.settlementData.fuelIds.length > 0) {
      let fuelIDs = encodeURIComponent(
        JSON.stringify(this.settlementData.fuelIds)
      );
      let result = await this.apiService
        .getData(`fuelEntries/get/selected/ids?fuel=${fuelIDs}`)
        .toPromise();
      this.showDetailBtn = true;
      result.map((k) => {
        k.fuelID = k.data.fuelID;
        k.fuelDate = k.data.date;
        k.cityName = k.data.city;
        k.locationCountry = k.data.country;
        k.fuelCardNumber = k.data.cardNo;
        k.unitOfMeasure = k.data.uom;
        k.subTotal = k.data.amt;
        k.billingCurrency = k.data.currency;
        k.type = k.data.type;
        this.settlementData.fuelData.map((v) => {
          if (v.fuelID === k.fuelID) {
            k.action = v.action === "add" ? "Added" : "Deducted";
            if (v.convert) {
              k.convert = v.convert;
              k.total = v.actAmount;
              k.convertRate = v.convertRate;
              k.currency = this.settlementData.currency;
              k.subTotal = v.amount;
            } else {
              k.convert = false;
            }
          }
        });
      });
      this.selectedFuelEnteries = result;
      this.selectedFuelEnteries.sort(function compare(a, b) {
        let dateA: any = new Date(a.fuelDate);
        let dateB: any = new Date(b.fuelDate);
        return dateA - dateB;
      });
    } else {
      this.showDetailBtn = true;
    }
  }
}
