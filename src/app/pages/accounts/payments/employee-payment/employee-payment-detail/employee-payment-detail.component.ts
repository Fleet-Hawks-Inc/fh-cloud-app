import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService, ListService } from 'src/app/services';

@Component({
  selector: 'app-employee-payment-detail',
  templateUrl: './employee-payment-detail.component.html',
  styleUrls: ['./employee-payment-detail.component.css']
})
export class EmployeePaymentDetailComponent implements OnInit {
  dataMessage = Constants.NO_RECORDS_FOUND;
  paymentID;
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
    transactionLog: []
  };
  employees = [];
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
  accounts = [];

  constructor(private listService: ListService, private route: ActivatedRoute, private router: Router, private toaster: ToastrService, private accountService: AccountService, private apiService: ApiService) { }

  ngOnInit() {
    this.paymentID = this.route.snapshot.params["paymentID"];
    this.fetchPaymentDetail();
    this.fetchEmployees();
    this.fetchAllAccounts();
  }

  fetchPaymentDetail() {
    this.accountService.getData(`employee-payments/detail/${this.paymentID}`).subscribe((result: any) => {
      this.paymentData = result[0];
      if(this.paymentData.payMode) {
        this.paymentData.payMode = this.paymentData.payMode.replace("_"," ");
      }
      this.fetchEmpDetail(result[0].entityId);
    })
  }

  fetchEmployees() {
    this.apiService.getData(`contacts/get/list/employee`).subscribe((result: any) => {
      this.employees = result;
    })
  }

  fetchEmpDetail(empID) {
    this.apiService.getData(`contacts/minor/detail/${empID}`).subscribe((result: any) => {
      this.empdetail = result.Items[0];
    })
  }

  fetchAllAccounts() {
    this.accountService.getData(`chartAc/get/all/list`).subscribe((result: any) => {
      this.accounts = result;
    });
  }

}
