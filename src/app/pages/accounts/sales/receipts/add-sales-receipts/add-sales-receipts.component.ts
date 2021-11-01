import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService, ApiService, ListService } from 'src/app/services';
import { Location } from '@angular/common';
import * as moment from 'moment';
import Constants from 'src/app/pages/fleet/constants';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-sales-receipts',
  templateUrl: './add-sales-receipts.component.html',
  styleUrls: ['./add-sales-receipts.component.css']
})
export class AddSalesReceiptsComponent implements OnInit {
  dataMessage = Constants.NO_RECORDS_FOUND;
  submitDisabled = false;

  paymentData = {
    txnDate: moment().format('YYYY-MM-DD'),
    customerID: null,
    payRef: '',
    currency: 'CAD',
    accountID: null,
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    remarks: '',
    totalAmt: 0,
    invoiceIds: [],
    invoiceData: []
  }
  customers = [];
  customerInvoices = [];

  paymentModes = [
    {
      value: "cash",
      name: "Cash",
    },
    {
      value: "cheque",
      name: "Cheque",
    },
    {
      value: "eft",
      name: "EFT",
    },
    {
      value: "credit_card",
      name: "Credit Card",
    },
    {
      value: "debit_card",
      name: "Debit Card",
    },
    {
      value: "demand_draft",
      name: "Demand Draft",
    },
  ];

  accounts: any = [];
  response: any = '';
  errors = {};

  payModeLabel = "";

  constructor(private apiService: ApiService, private route: ActivatedRoute, public listService: ListService, private httpClient: HttpClient, private location: Location, private toaster: ToastrService, private accountService: AccountService,) { }

  ngOnInit() {

    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
    this.listService.fetchCustomers();

    let customerList = new Array<any>();
    this.getValidCustomers(customerList);
    this.customers = customerList;
  }

  refreshAccount() {
    this.listService.fetchChartAccounts();
  }

  private getValidCustomers(customerList: any[]) {
    let ids = [];
    this.listService.customersList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
          customerList.push(element2);
          ids.push(element2.contactID);
        }
      });
    });
  }

  async getCustomerInvoices(ID: string) {
    this.customerInvoices = [];
    this.dataMessage = Constants.FETCHING_DATA;
    let result = await this.accountService.getData(`sales-invoice/specific/${ID}`).toPromise();
    if (result.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
    }
    if (result.length > 0) {

      result.map((v) => {
        v.selected = false;
        v.prevPaidAmount = Number(v.totalAmt) - Number(v.balance);
        v.paidStatus = false;
        v.fullPayment = false;
        v.paidAmount = 0;
        v.newStatus = v.status.replace("_", " ");
      });
      this.customerInvoices = result;
    }
  }

  fetchAccounts() {
    this.accountService.getData(`chartAc/fetch/list`).subscribe((res: any) => {
      this.accounts = res;
    });
  }

  assignFullPayment(index, data) {
    console.log('data', data)
    if (data.fullPayment) {
      this.customerInvoices[index].paidAmount = data.balance;
      this.customerInvoices[index].paidStatus = true;
    } else {
      this.customerInvoices[index].paidAmount = 0;
      this.customerInvoices[index].paidStatus = false;
    }
  }

  selectedCredits() {
    this.paymentData.invoiceIds = [];
    this.paymentData.invoiceData = [];

    for (let i = 0; i < this.customerInvoices.length; i++) {
      const element = this.customerInvoices[i];
      if (element.selected) {
        this.paymentData.totalAmt += Number(element.paidAmount);

        let status = "";
        if (Number(element.paidAmount) === Number(element.balance)) {
          status = "deducted";
        } else if (
          Number(element.paidAmount) > 0 &&
          Number(element.paidAmount) < Number(element.balance)
        ) {
          status = "partially_deducted";
        } else {
          status = "not_deducted";
        }

        element.status = status;
        if (!this.paymentData.invoiceIds.includes(element.saleID)) {
          this.paymentData.invoiceIds.push(element.saleID);
          let obj = {
            saleID: element.saleID,
            status: status,
            paidAmount: element.paidAmount,
            totalAmount: element.balance,
            balance:
              Number(element.balance) - Number(element.paidAmount),
          };
          this.paymentData.invoiceData.push(obj);
        }
      }
    }

    this.calculateFinalTotal();
  }

  calculateFinalTotal() {
    let total = 0;
    console.log('this.paymentData.invoiceData', this.paymentData.invoiceData)
    this.paymentData.invoiceData.forEach(elem => {
      total += elem.paidAmount;
    })
    this.paymentData.totalAmt = total;
  }

  addReceipt() {

    console.log('dara', this.paymentData)

    this.accountService.postData(`sales-receipts`, this.paymentData).subscribe({
      complete: () => { },
      error: (err: any) => {
        this.submitDisabled = false;
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
              // this.submitDisabled = false;
            },
            next: () => {
            },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toaster.success('Receipt added successfully.');
        this.cancel();
      },
    });
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  changePaymentMode(type) {
    let label = "";
    if (type == "cash") {
      label = "Cash";
      this.paymentData.payModeNo = null;
    } else if (type == "cheque") {
      label = "Cheque";
      this.paymentData.payModeNo = null;
    } else if (type == "eft") {
      label = "EFT";
      this.paymentData.payModeNo = null;
    } else if (type == "credit_card") {
      label = "Credit Card";
      this.paymentData.payModeNo = null;
    } else if (type == "debit_card") {
      label = "Debit Card";
      this.paymentData.payModeNo = null;
    } else if (type == "demand_draft") {
      label = "Demand Draft";
      this.paymentData.payModeNo = null;
    }
    this.payModeLabel = label;
    this.paymentData.payModeDate = null;
  }

}
