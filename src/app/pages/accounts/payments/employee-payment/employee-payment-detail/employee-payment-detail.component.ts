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
    fromDate: '',
    toDate: '',
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
  customersObjects = {};
  accountsObjects = {};
  accountsIntObjects = {};
  showModal = false;
  downloadDisabled = false;

  constructor(private listService: ListService, private route: ActivatedRoute, private router: Router, private toaster: ToastrService, private accountService: AccountService, private apiService: ApiService) { }

  ngOnInit() {
    this.paymentID = this.route.snapshot.params["paymentID"];
    this.fetchPaymentDetail();
    this.fetchEmployees();
    this.fetchCustomersByIDs();
    this.fetchAccountsByIDs();
    this.fetchAccountsByInternalIDs();
  }

  fetchPaymentDetail() {
    this.accountService.getData(`employee-payments/detail/${this.paymentID}`).subscribe((result: any) => {
      this.paymentData = result[0];
      if(this.paymentData.payMode) {
        this.paymentData.payMode = this.paymentData.payMode.replace("_"," ");
      }
      this.paymentData.transactionLog.map((v: any) => {
        v.type = v.type.replace('_', ' ');
      });
      this.fetchEmpDetail(result[0].entityId);
    })
  }

  fetchEmployees() {
    this.apiService.getData(`contacts/get/emp/list`).subscribe((result: any) => {
      this.employees = result;
    })
  }

  fetchEmpDetail(empID) {
    this.apiService.getData(`contacts/minor/detail/${empID}`).subscribe((result: any) => {
      this.empdetail = result.Items[0];
    })
  }

  fetchCustomersByIDs() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.customersObjects = result;
    });
  }

  fetchAccountsByIDs() {
    this.accountService.getData('chartAc/get/list/all').subscribe((result: any) => {
      this.accountsObjects = result;
    });
  }
  fetchAccountsByInternalIDs() {
    this.accountService.getData('chartAc/get/internalID/list/all').subscribe((result: any) => {
      this.accountsIntObjects = result;
    });
  }

  downloadPaymentPdf() {
    this.showModal = true;
    this.paymentData[`advData`] = [];
    this.paymentData[`paymentTo`] = "employee";
    let obj = {
      showModal: this.showModal,
      data: this.paymentData,
    }
    this.listService.triggerDownloadPaymentPdf(obj);
    this.downloadDisabled = true;

    setTimeout(() => {
      this.downloadDisabled = false;
    }, 15000)
  }

}
