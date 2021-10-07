import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import Constants from "src/app/pages/fleet/constants";
import { AccountService } from "src/app/services/account.service";
import { ApiService } from "src/app/services/api.service";
import { ListService } from "src/app/services/list.service";

import { Location } from "@angular/common";
import { CountryStateCityService } from "src/app/services/country-state-city.service";
declare var $: any;

@Component({
  selector: "app-add-employee-payment",
  templateUrl: "./add-employee-payment.component.html",
  styleUrls: ["./add-employee-payment.component.css"],
})
export class AddEmployeePaymentComponent implements OnInit {
  dataMessage: string = Constants.NO_RECORDS_FOUND;
  paymentData = {
    entityId: null,
    txnDate: moment().format("YYYY-MM-DD"),
    paymentNo: "",
    payroll: {
      type: null,
      amount: 0,
      hours: 0,
      perHour: 0,
    },
    fromDate: "",
    toDate: "",
    accountID: null,
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    settledAmount: 0,
    vacPayPer: 0,
    vacPayAmount: 0,
    addition: [],
    deduction: [],
    paymentTotal: 0,
    additionTotal: 0,
    deductionTotal: 0,
    subTotal: 0,
    taxdata: {
      payPeriod: null,
      stateCode: null,
      federalCode: "claim_code_1",
      provincialCode: null,
      cpp: 0,
      ei: 0,
      federalTax: 0,
      provincialTax: 0,
      emplCPP: 0,
      emplEI: 0,
    },
    taxes: 0,
    advance: 0,
    finalTotal: 0,
    advancePayIds: [],
    advData: [],
    transactionLog: [],
  };
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  employees = [];
  empDetails = {
    paymentDetails: {
      payrollType: "",
      payrollRateUnit: "",
      payrollRate: "",
    },
  };
  additionRowData = {
    eventDate: null,
    chargeName: "",
    desc: "",
    amount: <any>"",
    currency: "CAD",
  };
  deductionRowData = {
    eventDate: null,
    chargeName: "",
    desc: "",
    amount: <any>"",
    currency: "CAD",
  };
  accounts;
  payModeLabel = "";
  errors = {};
  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";
  submitDisabled = false;
  paymentID;
  taxErr = "";
  advErr = "";
  lastAdded = {
    paymentNo: "",
    additionTotal: "",
    advance: "",
    deductionTotal: "",
    entityId: "",
    finalTotal: "",
    payMode: "",
    payModeDate: "",
    payModeNo: "",
    taxes: "",
    txnDate: "",
  };
  lastExist = false;
  empdetail = {
    companyName: "",
    contactID: "",
    firstName: "",
    lastName: "",
    userAccount: {
      department: "",
      designation: "",
    },
  };
  advancePayments = [];
  accList = [];
  payPeriods = [];
  states = [];
  claimCodes = [];
  provincalClaimCodes = [];
  showModal = false;
  employeesObj: any = {};

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private toaster: ToastrService,
    private accountService: AccountService,
    private apiService: ApiService,
    private httpClient: HttpClient,
    private countryStateCity: CountryStateCityService
  ) {}

  async ngOnInit() {
    this.paymentID = this.route.snapshot.params["paymentID"];
    if (this.paymentID) {
      this.fetchPaymentDetail();
    }
    this.fetchEmployees();
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
    this.fetchPayPeriods();
    await this.getStates();
    this.fetchClaimCodes();
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  fetchEmployees() {
    this.apiService
      .getData(`contacts/get/all/employees`)
      .subscribe((result: any) => {
        this.employees = result;
        console.log("this.employees", this.employees);

        this.employeesObj = result.reduce((a: any, b: any) => {
          return (
            (a[b["contactID"]] =
              b["isDeleted"] == 1
                ? b["firstName"] + " " + b["lastName"] + "  - Deleted"
                : b["firstName"] + " " + b["lastName"]),
            a
          );
        }, {});
      });
  }
  fetchAccounts() {
    this.accountService.getData(`chartAc/fetch/list`).subscribe((res: any) => {
      this.accounts = res;
    });
  }
  refreshAccount() {
    this.listService.fetchChartAccounts();
  }
  fetchEmployeDetail() {
    this.paymentData.payroll.type = null;
    this.paymentData.payroll.amount = 0;
    this.paymentData.payroll.perHour = 0;
    this.paymentData.paymentTotal = 0;
    this.paymentData.settledAmount = 0;
    this.paymentData.finalTotal = 0;
    this.paymentData.subTotal = 0;
    this.paymentData.advance = 0;
    this.apiService
      .getData(`contacts/detail/${this.paymentData.entityId}`)
      .subscribe((result: any) => {
        this.empDetails = result.Items[0];
        let paymentInfo = this.empDetails.paymentDetails;
        if (paymentInfo.payrollType === "Hours") {
          this.paymentData.payroll.type = "hourly";
          this.paymentData.payroll.amount =
            Number(paymentInfo.payrollRate) *
            Number(this.paymentData.payroll.hours);
          this.paymentData.payroll.perHour = Number(paymentInfo.payrollRate);
        } else if (paymentInfo.payrollType === "Flat") {
          this.paymentData.payroll.type = "flat";
          this.paymentData.payroll.amount = Number(paymentInfo.payrollRate);
          // this.paymentData.paymentTotal = this.paymentData.payroll.amount;
          this.paymentData.settledAmount = this.paymentData.payroll.amount;
          this.paymentData.paymentTotal =
            Number(this.paymentData.settledAmount) +
            Number(this.paymentData.vacPayAmount);
          this.paymentData.finalTotal = this.paymentData.payroll.amount;
          this.paymentData.subTotal = this.paymentData.payroll.amount;
        }
      });
    this.fetchLastAdded();
    this.fetchAdvancePayments();
    this.calculatePayroll();
  }

  EmpRateCalc() {
    this.paymentData.payroll.amount =
      Number(this.paymentData.payroll.perHour) *
      Number(this.paymentData.payroll.hours);
    // this.paymentData.paymentTotal = this.paymentData.payroll.amount;
    this.paymentData.settledAmount = this.paymentData.payroll.amount;
    this.paymentData.paymentTotal =
      Number(this.paymentData.settledAmount) +
      Number(this.paymentData.vacPayAmount);
    this.calculateFinalTotal();
  }

  empFlatRate() {
    this.paymentData.payroll.amount = Number(this.paymentData.payroll.amount);
    // this.paymentData.paymentTotal = this.paymentData.payroll.amount;
    this.paymentData.settledAmount = this.paymentData.payroll.amount;
    this.paymentData.paymentTotal =
      Number(this.paymentData.settledAmount) +
      Number(this.paymentData.vacPayAmount);
    this.calculateFinalTotal();
    this.calculatePayroll();
  }

  addAdditionalExp() {
    if (
      this.additionRowData.eventDate != null &&
      this.additionRowData.chargeName != "" &&
      this.additionRowData.amount != ""
    ) {
      this.additionRowData.amount = Number(this.additionRowData.amount);
      this.paymentData.addition.push(this.additionRowData);
      this.additionRowData = {
        eventDate: null,
        chargeName: "",
        desc: "",
        amount: "",
        currency: "CAD",
      };
      this.calculateAddTotal();
    }
  }

  adddeductionExp() {
    if (
      this.deductionRowData.eventDate != null &&
      this.deductionRowData.chargeName != "" &&
      this.deductionRowData.amount != ""
    ) {
      this.deductionRowData.amount = Number(this.deductionRowData.amount);
      this.paymentData.deduction.push(this.deductionRowData);
      this.deductionRowData = {
        eventDate: null,
        chargeName: "",
        desc: "",
        amount: "",
        currency: "CAD",
      };
      this.calculateDedTotal();
    }
  }

  calculateAddTotal() {
    this.paymentData.additionTotal = 0;
    for (let i = 0; i < this.paymentData.addition.length; i++) {
      const element = this.paymentData.addition[i];
      this.paymentData.additionTotal += parseFloat(element.amount);
    }
    this.calculateFinalTotal();
  }

  calculateDedTotal() {
    this.paymentData.deductionTotal = 0;
    for (let i = 0; i < this.paymentData.deduction.length; i++) {
      const element = this.paymentData.deduction[i];
      this.paymentData.deductionTotal += parseFloat(element.amount);
    }
    this.calculateFinalTotal();
  }

  delRow(index, type) {
    if (type === "additional") {
      this.paymentData.addition.splice(index, 1);
      this.calculateAddTotal();
    } else {
      this.paymentData.deduction.splice(index, 1);
      this.calculateDedTotal();
    }
  }

  changePaymentMode(type) {
    let label = "";
    if (type == "cash") {
      label = "Cash";
      this.paymentData.payModeNo = "";
    } else if (type == "cheque") {
      label = "Cheque";
      this.paymentData.payModeNo = Date.now().toString();
    } else if (type == "eft") {
      label = "EFT";
      this.paymentData.payModeNo = "";
    } else if (type == "credit_card") {
      label = "Credit Card";
      this.paymentData.payModeNo = "";
    } else if (type == "debit_card") {
      label = "Debit Card";
      this.paymentData.payModeNo = "";
    } else if (type == "demand_draft") {
      label = "Demand Draft";
      this.paymentData.payModeNo = "";
    }
    this.payModeLabel = label;
    this.paymentData.payModeDate = null;
  }

  showAcModal() {
    $("#addAccountModal").modal("show");
  }

  addRecord() {
    if (this.paymentData.settledAmount <= 0) {
      this.toaster.error("Please enter valid amount");
      return false;
    }

    this.submitDisabled = true;
    this.accountService
      .postData("employee-payments", this.paymentData)
      .subscribe({
        complete: () => {},
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, "This Field");
                this.errors[val.context.key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.submitDisabled = false;
                // this.throwErrors();
              },
              error: () => {
                this.submitDisabled = false;
              },
              next: () => {},
            });
        },
        next: (res) => {
          this.submitDisabled = false;
          this.response = res;
          this.toaster.success("Employee payment added successfully.");
          this.cancel();
        },
      });
  }

  calculateFinalTotal() {
    this.paymentData.subTotal = Number(this.paymentData.subTotal);
    this.paymentData.taxes = Number(this.paymentData.taxes);
    this.paymentData.advance = Number(this.paymentData.advance);
    this.paymentData.settledAmount = Number(this.paymentData.settledAmount);
    this.paymentData.additionTotal = Number(this.paymentData.additionTotal);
    this.paymentData.deductionTotal = Number(this.paymentData.deductionTotal);
    this.paymentData.paymentTotal =
      Number(this.paymentData.vacPayAmount) +
      Number(this.paymentData.settledAmount);
    this.paymentData.paymentTotal = Number(this.paymentData.paymentTotal);
    this.paymentData.subTotal =
      this.paymentData.paymentTotal +
      this.paymentData.additionTotal -
      this.paymentData.deductionTotal;
    this.paymentData.finalTotal =
      this.paymentData.subTotal -
      this.paymentData.taxes -
      this.paymentData.taxdata.cpp -
      this.paymentData.taxdata.ei -
      this.paymentData.advance;

    this.paymentData.subTotal = Number(this.paymentData.subTotal.toFixed(2));
    this.paymentData.finalTotal = Number(
      this.paymentData.finalTotal.toFixed(2)
    );
  }

  fetchPaymentDetail() {
    this.accountService
      .getData(`employee-payments/detail/${this.paymentID}`)
      .subscribe((result: any) => {
        this.paymentData = result[0];
        this.submitDisabled = true;
        this.assignProvincalCode();
      });
  }

  checkInput(type) {
    if (type == "tax") {
      if (Number(this.paymentData.taxes) > Number(this.paymentData.subTotal)) {
        this.taxErr = "Tax amount should be less than sub total";
        this.submitDisabled = true;
      } else {
        this.taxErr = "";
        this.submitDisabled = false;
      }
    } else if (type == "advance") {
      if (
        Number(this.paymentData.advance) > Number(this.paymentData.subTotal)
      ) {
        this.advErr = "Advance amount should be less than sub total";
        this.submitDisabled = true;
      } else {
        this.advErr = "";
        this.submitDisabled = false;
      }
    }
  }

  fetchLastAdded() {
    this.lastExist = false;
    this.accountService
      .getData(`employee-payments/last/added/${this.paymentData.entityId}`)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.lastExist = true;
          this.fetchEmpDetail(result[0].entityId);
        }
        this.lastAdded = result[0];
      });
  }

  fetchEmpDetail(empID) {
    this.apiService
      .getData(`contacts/minor/detail/${empID}`)
      .subscribe((result: any) => {
        this.empdetail = result.Items[0];
      });
  }

  fetchAdvancePayments() {
    this.advancePayments = [];
    this.dataMessage = Constants.FETCHING_DATA;
    this.accountService
      .getData(`advance/entity/${this.paymentData.entityId}?from=null&to=null`)
      .subscribe((result: any) => {
        if (result.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.advancePayments = result;
        this.advancePayments.map((v) => {
          v.selected = false;
          if (v.payMode) {
            v.payMode = v.payMode.replace("_", " ");
          }
          v.fullPayment = false;
          v.paidAmount = 0;
          v.paidStatus = false;
          v.status = v.status.replace("_", " ");
          v.errText = "";
          v.prevPaidAmount = Number(v.amount) - Number(v.pendingPayment);
          v.prevPaidAmount = v.prevPaidAmount.toFixed(2);
        });
      });
  }

  selectedAdvancepayments() {
    this.paymentData.advancePayIds = [];
    this.paymentData.advData = [];
    for (const element of this.advancePayments) {
      if (element.selected) {
        if (!this.paymentData.advancePayIds.includes(element.paymentID)) {
          let obj = {
            paymentID: element.paymentID,
            status: element.status,
            paidAmount:
              element.status === "not_deducted"
                ? element.paidAmount
                : Number(element.amount) - Number(element.pendingPayment),
            totalAmount:
              element.status === "not_deducted"
                ? element.amount
                : element.pendingPayment,
            pendingAmount: element.pendingPayment,
          };
          this.paymentData.advancePayIds.push(element.paymentID);
          this.paymentData.advData.push(obj);
        }
      }
    }
    this.paymentCalculation();
  }

  assignFullPayment(index, data) {
    if (data.fullPayment) {
      this.advancePayments[index].paidAmount = data.pendingPayment;
      this.advancePayments[index].paidStatus = true;
    } else {
      this.advancePayments[index].paidAmount = 0;
      this.advancePayments[index].paidStatus = false;
    }
    this.selectedAdvancepayments();
    this.paymentCalculation();
  }

  paymentCalculation() {
    this.paymentData.subTotal = 0;
    this.paymentData.finalTotal = 0;
    this.paymentData.advance = 0;
    let selectCount = 0;

    for (const element of this.advancePayments) {
      if (element.selected) {
        if (Number(element.paidAmount > 0)) {
          selectCount += 1;
        }
        this.paymentData.advance += Number(element.paidAmount);
        this.paymentData.advData.map((v) => {
          if (element.paymentID === v.paymentID) {
            v.paidAmount = Number(element.paidAmount);
            v.pendingAmount =
              Number(element.pendingPayment) - Number(element.paidAmount);

            if (Number(element.paidAmount) === Number(element.pendingPayment)) {
              v.status = "deducted";
            } else if (
              Number(element.paidAmount) < Number(element.pendingPayment)
            ) {
              v.status = "partially_deducted";
            } else {
              v.status = "not_deducted";
            }

            v.paidAmount = v.paidAmount.toFixed(2);
          }
        });
      }
    }
    if (selectCount > 0) {
      this.submitDisabled = false;
    } else {
      this.submitDisabled = true;
    }
    this.paymentData.advance = this.paymentData.advance
      ? Number(this.paymentData.advance)
      : 0;
    this.paymentData.taxes = this.paymentData.taxes
      ? Number(this.paymentData.taxes)
      : 0;
    this.paymentData.paymentTotal = this.paymentData.paymentTotal
      ? Number(this.paymentData.paymentTotal)
      : 0;

    this.paymentData.subTotal =
      this.paymentData.paymentTotal +
      this.paymentData.additionTotal -
      this.paymentData.deductionTotal;
    this.paymentData.finalTotal =
      this.paymentData.subTotal -
      this.paymentData.taxes -
      this.paymentData.advance;
  }

  openPayrollModel() {
    $("#payrollModal").modal("show");
  }

  calculatePayroll() {
    this.paymentData.taxdata.cpp = 0;
    this.paymentData.taxdata.ei = 0;
    this.paymentData.taxdata.federalTax = 0;
    this.paymentData.taxdata.provincialTax = 0;
    this.paymentData.taxdata.emplCPP = 0;
    this.paymentData.taxdata.emplEI = 0;
    this.paymentData.taxes = 0;
    if (!this.paymentID) {
      if (
        this.paymentData.taxdata.payPeriod &&
        this.paymentData.taxdata.stateCode
      ) {
        if (this.paymentData.subTotal > 0) {
          this.accountService
            .getData(
              `employee-payments/payroll/calculate?amount=${this.paymentData.subTotal}&pay-period=${this.paymentData.taxdata.payPeriod}&state=${this.paymentData.taxdata.stateCode}`
            )
            .subscribe((result: any) => {
              this.paymentData.taxdata.cpp = result.cpp;
              this.paymentData.taxdata.ei = result.insurance;
              this.paymentData.taxdata.federalTax = result.federalTax;
              this.paymentData.taxdata.provincialTax = result.provncTax;
              this.paymentData.taxdata.emplCPP = result.employerCpp;
              this.paymentData.taxdata.emplEI = result.employerEI;
              this.paymentData.taxes =
                this.paymentData.taxdata.federalTax +
                this.paymentData.taxdata.provincialTax;
              this.paymentData.taxes = Number(
                this.paymentData.taxes.toFixed(2)
              );
              this.calculateFinalTotal();
            });
        }
      } else {
        this.resetPayrollCalculations();
        this.calculateFinalTotal();
      }
    }
  }

  fetchPayPeriods() {
    this.httpClient
      .get("assets/jsonFiles/payroll/payPeriods.json")
      .subscribe((data: any) => {
        this.payPeriods = data;
      });
  }

  fetchClaimCodes() {
    this.httpClient
      .get("assets/jsonFiles/payroll/claimCodes.json")
      .subscribe((data: any) => {
        this.claimCodes = data;
      });
  }

  async getStates() {
    this.states = await this.countryStateCity.GetStatesByCountryCode(["CA"]);
  }

  assignProvincalCode() {
    if (
      this.paymentData.taxdata.stateCode == null ||
      this.paymentData.taxdata.stateCode == undefined
    ) {
      this.resetPayrollCalculations();
    }
    this.provincalClaimCodes = [];
    this.claimCodes[1].map((v) => {
      if (this.paymentData.taxdata.stateCode === v.stateCode) {
        this.provincalClaimCodes = v.codes;
      }
    });
    this.paymentData.taxdata.provincialCode = "claim_code_1";
    this.calculatePayroll();
    this.calculateFinalTotal();
  }

  resetPayrollCalculations() {
    this.paymentData.taxdata.cpp = 0;
    this.paymentData.taxdata.ei = 0;
    this.paymentData.taxdata.federalTax = 0;
    this.paymentData.taxdata.provincialTax = 0;
    this.paymentData.taxdata.emplCPP = 0;
    this.paymentData.taxdata.emplEI = 0;
    this.paymentData.taxes =
      this.paymentData.taxdata.federalTax +
      this.paymentData.taxdata.provincialTax;
    this.calculateFinalTotal();
  }

  showCheque() {
    this.showModal = true;
    let obj = {
      entityId: this.paymentData.entityId,
      chequeDate: this.paymentData.payModeDate,
      chequeAmount: this.paymentData.finalTotal,
      type: "employee",
      chequeNo: this.paymentData.payModeNo,
      currency: "CAD",
      formType: this.paymentID ? "edit" : "add",
      showModal: this.showModal,
      fromDate: this.paymentData.fromDate,
      toDate: this.paymentData.toDate,
      vacPayPer: this.paymentData.vacPayPer,
      vacPayAmount: this.paymentData.vacPayAmount,
      totalAmount: this.paymentData.subTotal,
      settledAmount: this.paymentData.settledAmount,
      taxdata: this.paymentData.taxdata,
      finalAmount: this.paymentData.finalTotal,
      advance: this.paymentData.advance,
      txnDate: this.paymentData.txnDate,
      page: "addForm",
    };
    this.listService.openPaymentChequeModal(obj);
  }

  calculateVacationPay() {
    this.paymentData.vacPayAmount =
      (this.paymentData.vacPayPer / 100) * this.paymentData.settledAmount;
    if (
      this.paymentData.taxdata.payPeriod &&
      this.paymentData.taxdata.stateCode
    ) {
      this.resetPayrollCalculations();
      this.calculatePayroll();
    } else {
      this.calculateFinalTotal();
    }
  }
}
