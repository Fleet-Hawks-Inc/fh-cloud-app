import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { AccountService } from "src/app/services/account.service";
import { ApiService } from "src/app/services/api.service";
import { ListService } from "src/app/services/list.service";
declare var $: any;

@Component({
  selector: "app-add-employee-payment",
  templateUrl: "./add-employee-payment.component.html",
  styleUrls: ["./add-employee-payment.component.css"],
})
export class AddEmployeePaymentComponent implements OnInit {
  paymentData = {
    entityId: null,
    txnDate: null,
    paymentNo: '',
    payroll: {
      type: null,
      amount: 0,
      hours: 0,
      perHour: 0,
    },
    accountID: null,
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    addition: [],
    deduction: [],
    paymentTotal: 0,
    additionTotal: 0,
    deductionTotal: 0,
    subTotal: 0,
    taxes: 0,
    advance: 0,
    finalTotal: 0,
  };
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  employees = [];
  empDetails = {
    paymentDetails: {
      payrollType: '',
      payrollRateUnit: '',
      payrollRate:'',
    }
  };
  additionRowData = {
    eventDate: null,
    chargeName: "",
    desc: "",
    amount: "",
    currency: "CAD",
  };
  deductionRowData = {
    eventDate: null,
    chargeName: "",
    desc: "",
    amount: "",
    currency: "CAD",
  };
  accounts;
  payModeLabel = '';
  errors = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  submitDisabled = false;
  paymentID;
  taxErr = '';
  advErr = '';
  lastAdded = {
    additionTotal: '',
    advance: '',
    deductionTotal: '',
    entityId: '',
    finalTotal: '',
    payMode: '',
    payModeDate: '',
    payModeNo: '',
    taxes: '',
    txnDate: '',
  };
  lastExist = false;
  empdetail = {
    companyName: '',
    contactID: '',
    firstName: '',
    lastName: '',
    userAccount: {
      department: '',
      designation: ''
    }
  };

  constructor(private listService: ListService, private route: ActivatedRoute, private router: Router, private toaster: ToastrService, private accountService: AccountService, private apiService: ApiService) { }

  ngOnInit() {
    this.paymentID = this.route.snapshot.params["paymentID"];
    if(this.paymentID) {
      this.fetchPaymentDetail();
    } else {
      this.fetchLastAdded();
    }
    this.fetchEmployees();
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
  }

  fetchEmployees() {
    this.apiService.getData(`contacts/get/list/employee`).subscribe((result: any) => {
      this.employees = result;
    })
  }

  fetchEmployeDetail() {
    this.paymentData.payroll.type = null;
    this.paymentData.payroll.amount = 0;
    this.paymentData.payroll.perHour = 0;
    this.apiService.getData(`contacts/detail/${this.paymentData.entityId}`).subscribe((result: any) => {
      this.empDetails = result.Items[0];
      let paymentInfo = this.empDetails.paymentDetails;
      if(paymentInfo.payrollType === 'Hours') {
        this.paymentData.payroll.type = 'hourly';
        this.paymentData.payroll.amount = Number(paymentInfo.payrollRate) * Number(this.paymentData.payroll.hours);
        this.paymentData.payroll.perHour = Number(paymentInfo.payrollRate);
      } else if (paymentInfo.payrollType === 'Flat') {
        this.paymentData.payroll.type = 'flat';
        this.paymentData.payroll.amount = Number(paymentInfo.payrollRate);
      }
    })
  }

  EmpRateCalc() {
    this.paymentData.payroll.amount = Number(this.paymentData.payroll.perHour) * Number(this.paymentData.payroll.hours);
    this.paymentData.paymentTotal = this.paymentData.payroll.amount;
    this.calculateFinalTotal() ;
  }

  addAdditionalExp() {
    if (
      this.additionRowData.eventDate != null &&
      this.additionRowData.chargeName != "" &&
      this.additionRowData.amount != ""
    ) {
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
    if (type === 'additional') {
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
    } else if (type == "cheque") {
      label = "Cheque";
    } else if (type == "eft") {
      label = "EFT";
    } else if (type == "credit_card") {
      label = "Credit Card";
    } else if (type == "debit_card") {
      label = "Debit Card";
    } else if (type == "demand_draft") {
      label = "Demand Draft";
    }
    this.payModeLabel = label;
    this.paymentData.payModeDate = null;
    this.paymentData.payModeNo = '';
  }

  showAcModal() {
    $('#addAccountModal').modal('show');
  }

  addRecord() {
    if(this.paymentData.paymentTotal <= 0) {
      this.toaster.error('Please enter valid amount');
      return false;
    }
    this.submitDisabled = true;
    this.accountService.postData('employee-payments', this.paymentData).subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
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
            next: () => {
            },
          });
        },
        next: (res) => {
          this.submitDisabled = false;
          this.response = res;
          this.toaster.success('Employee payment added successfully.');
          this.router.navigateByUrl('/accounts/payments/employee-payments/list');
        },
    });
  }

  calculateFinalTotal() {
    this.paymentData.subTotal = this.paymentData.paymentTotal + this.paymentData.additionTotal - this.paymentData.deductionTotal;
    this.paymentData.finalTotal = this.paymentData.subTotal + this.paymentData.taxes - this.paymentData.advance;
  }

  fetchPaymentDetail() {
    this.accountService.getData(`employee-payments/detail/${this.paymentID}`).subscribe((result: any) => {
      this.paymentData = result[0];
      this.submitDisabled = true;
    })
  }

  checkInput(type) {
    if(type == 'tax') {
      if(this.paymentData.taxes > this.paymentData.subTotal) {
        this.taxErr = 'Tax amount should be less than sub total';
        this.submitDisabled = true;
      } else {
        this.taxErr = '';
        this.submitDisabled = false;
      }
    } else if(type == 'advance') {
      if(this.paymentData.advance > this.paymentData.subTotal) {
        this.advErr = 'Advance amount should be less than sub total';
        this.submitDisabled = true;
      } else {
        this.advErr = '';
        this.submitDisabled = false;
      }
    } 
  }

  fetchLastAdded() {
    this.accountService.getData(`employee-payments/last/added`).subscribe((result: any) => {
      if(result.length > 0) {
        this.lastExist = true;
        this.fetchEmpDetail(result[0].entityId);
      }
      this.lastAdded = result[0];
    })
  }

  fetchEmpDetail(empID) {
    this.apiService.getData(`contacts/minor/detail/${empID}`).subscribe((result: any) => {
      this.empdetail = result.Items[0];
    })
  }
}
