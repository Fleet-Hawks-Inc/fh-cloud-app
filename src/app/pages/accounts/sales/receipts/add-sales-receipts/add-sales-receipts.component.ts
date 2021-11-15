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
declare var $: any;

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
    invoiceData: [],
    invoiceTotal: 0
  }

  editDisabled = false;
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

  docs = [];
  filesError = '';
  files: any;

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
    if (data.fullPayment) {
      this.customerInvoices[index].paidAmount = data.balance;
      this.customerInvoices[index].paidStatus = true;
    } else {
      this.customerInvoices[index].paidAmount = 0;
      this.customerInvoices[index].paidStatus = false;
    }
    this.selectedCredits()
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
          };
          this.paymentData.invoiceData.push(obj);
        }
      }
    }
    this.creditCalculation();
    // this.calculateFinalTotal();
  }

  creditCalculation() {
    this.paymentData.invoiceTotal = 0;
    for (const element of this.customerInvoices) {
      if (element.selected) {
        this.paymentData.invoiceTotal += Number(element.paidAmount);
        this.paymentData.invoiceData.map((v) => {
          if (element.saleID === v.saleID) {
            v.paidAmount = Number(element.paidAmount);
            v.pendingAmount =
              Number(element.balance) - Number(element.paidAmount);
            if (Number(element.paidAmount) === Number(element.balance)) {
              v.status = "deducted";
            } else if (Number(element.paidAmount) < Number(element.balance)) {
              v.status = "partially_deducted";
            } else {
              v.status = "not_deducted";
            }
          }
        });
      }
    }
  }

  calculateFinalTotal() {
    this.creditCalculation();
  }

  addReceipt() {
    this.submitDisabled = true;

    if (this.paymentData.invoiceData.length === 0) {
      this.toaster.error('Please select at least one invoice');
      this.submitDisabled = false;
      return
    }
    this.customerInvoices.forEach(elem => {
      if (elem.selected && (elem.paidAmount === 0 || elem.paidAmount === '')) {
        this.toaster.error('Please add invoice amount')
        this.submitDisabled = false;
        return;
      }
    });

    // create form data instance
    const formData = new FormData();

    //append docs if any
    for (let j = 0; j < this.docs.length; j++) {
      formData.append("docs", this.docs[j]);
    }

    //append other fields
    formData.append("data", JSON.stringify(this.paymentData));

    this.accountService.postData(`sales-receipts`, formData, true).subscribe({
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


  uploadDocs(documents) {
    let files = [...documents];
    let filesSize = 0;
    if (files.length > 5) {
      this.toaster.error("Files count limit exceeded");
      this.filesError = "Files should not be more than 5";
      return;
    }

    for (let i = 0; i < files.length; i++) {
      filesSize += files[i].size / 1024 / 1024;
      if (filesSize > 10) {
        this.toaster.error("Files size limit exceeded");
        this.filesError = 'Files size limit exceeded. Files size should be less than 10mb';
        return;
      } else {
        let name = files[i].name.split(".");
        let ext = name[name.length - 1].toLowerCase();
        if (
          ext == "doc" ||
          ext == "docx" ||
          ext == "pdf" ||
          ext == "jpg" ||
          ext == "jpeg" ||
          ext == "png"
        ) {
          this.docs.push(files[i]);
        } else {
          this.filesError =
            "Only .doc, .docx, .pdf, .jpg, .jpeg and png files allowed.";
        }
      }
    }
  }
}
