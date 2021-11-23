import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService, ListService } from 'src/app/services';
import * as moment from 'moment';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-sales-invoice',
  templateUrl: './add-sales-invoice.component.html',
  styleUrls: ['./add-sales-invoice.component.css']
})
export class AddSalesInvoiceComponent implements OnInit {
  total = 0;
  submitDisabled = false;
  response: any = '';
  errors = {};

  saleData = {
    txnDate: moment().format('YYYY-MM-DD'),
    currency: 'CAD',
    customerID: null,
    sOrderNo: '',
    sRef: '',
    dueDate: null,
    paymentTerm: null,
    salePerson: '',
    sOrderDetails: [{
      commodity: '',
      desc: '',
      qty: 0,
      qtyUnit: null,
      rate: 0,
      rateUnit: null,
      amount: 0,
      accountID: null,
    }],
    charges: {
      accFee: [
        {
          name: "",
          amount: 0,
        },
      ],
      accDed: [
        {
          name: "",
          amount: 0,
        },
      ],
      taxes: [
        {
          name: "GST",
          tax: 0,
          type: "prcnt",
          amount: 0,
        },
        {
          name: "PST",
          tax: 0,
          type: "prcnt",
          amount: 0,
        },
        {
          name: "HST",
          tax: 0,
          type: "prcnt",
          amount: 0,
        },
      ],
    },

    total: {
      detailTotal: 0,
      feeTotal: 0,
      dedTotal: 0,
      subTotal: 0,
      taxes: 0,
      finalTotal: 0,
      customerCredit: 0
    },
    taxExempt: true,
    stateTaxID: null,
    remarks: "",
    creditIds: [],
    creditData: [],
  }

  paymentTerms = [
    {
      value: "15",
      name: "15 Days",
    },
    {
      value: "30",
      name: "30 Days",
    },
    {
      value: "45",
      name: "45 Days",
    },
    {
      value: "dueReceipt",
      name: "Due on receipt",
    },
    {
      value: "dueEnd",
      name: "Due end of the month",
    },
    {
      value: "custom",
      name: "Custom",
    },
  ];

  dataMessage = Constants.NO_RECORDS_FOUND;

  salesOrder = [];
  accounts: any = [];
  customers = [];
  units = [];
  stateTaxes = [];

  customerCredits = []

  currentUser: any;
  saleID: string;
  pageTitle: string = 'Add';

  constructor(private apiService: ApiService, private route: ActivatedRoute, public listService: ListService, private httpClient: HttpClient, private location: Location, private toaster: ToastrService, private accountService: AccountService,) { }

  ngOnInit() {
    this.saleID = this.route.snapshot.params[`saleID`];
    if (this.saleID) {
      this.pageTitle = 'Edit';
      this.fetchSaleInvoice();
    } else {
      this.pageTitle = 'Add';
      this.fetchAccounts();
    }

    this.fetchQuantityUnits();
    this.getCurrentUser();
    this.fetchStateTaxes();
    this.listService.fetchCustomers();

    let customerList = new Array<any>();
    this.getValidCustomers(customerList);
    this.customers = customerList;
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

  fetchQuantityUnits() {
    this.httpClient
      .get("assets/jsonFiles/quantityTypes.json")
      .subscribe((data: any) => {
        this.units = data;
      });
  }

  fetchCustomer() {
    this.listService.fetchCustomers();
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem("isOpen", "true");
    this.listService.changeButton(false);
  }

  changeUnit(value: string, i: any) {
    this.saleData.sOrderDetails[i].qtyUnit = value;
    this.saleData.sOrderDetails[i].rateUnit = value;
    this.calculateAmount(null)
    this.calculateFinalTotal();
  }

  async calculateAmount(i: number) {
    let total: any = 0;
    if (i != null) {
      this.saleData.sOrderDetails[i].amount = this.saleData.sOrderDetails[i].qty * this.saleData.sOrderDetails[i].rate;
    }

    this.saleData.sOrderDetails.forEach(element => {
      total += element.amount;
    });
    this.saleData.total.detailTotal = parseFloat(total);
    this.saleData.total.finalTotal = this.saleData.total.detailTotal;
    this.calculateFinalTotal();
  }

  async getCustomerOrders(ID: string) {
    this.saleData.sOrderNo = '';
    this.salesOrder = [];
    this.saleData.sOrderDetails = [{
      commodity: '',
      desc: '',
      qty: 0,
      qtyUnit: null,
      rate: 0,
      rateUnit: null,
      amount: 0,
      accountID: null,
    }];
    if (ID != undefined) {
      this.getCustomerCredit(ID);
      this.getOrders(ID);
      this.calculateAmount(null)
      this.calculateFinalTotal();
    }

  }

  async getOrders(ID: string) {
    let result = await this.accountService.getData(`sales-orders/specific/${ID}`).toPromise();
    if (result.length > 0) {
      this.salesOrder = result;
    }
  }

  getInvDueDate(e: any) {
    if (e === '15') {
      const test = moment().add(15, 'd');
      const test1 = moment(test).format('YYYY-MM-DD');
      this.saleData.dueDate = test1;
    } else if (e === '30') {
      const test = moment().add(30, 'd');
      const test1 = moment(test).format('YYYY-MM-DD');
      this.saleData.dueDate = test1;
    } else if (e === '45') {
      const test = moment().add(45, 'd');
      const test1 = moment(test).format('YYYY-MM-DD');
      this.saleData.dueDate = test1;
    } else if (e === 'dueReceipt') {
      this.saleData.dueDate = moment().format('YYYY-MM-DD');
    } else if (e === 'dueEnd') {
      this.saleData.dueDate = moment().endOf('month').format('YYYY-MM-DD');
    } else {
      this.saleData.dueDate = null;
    }
  }

  assignFullPayment(index, data) {
    if (data.fullPayment) {
      this.customerCredits[index].paidAmount = data.balance.toFixed(2);
      this.customerCredits[index].paidStatus = true;
    } else {
      this.customerCredits[index].paidAmount = 0;
      this.customerCredits[index].paidStatus = false;
    }
    this.selectedCredits();
  }

  changeCur() {
    if (this.saleData.customerID != '') {
      this.getCustomerCredit(this.saleData.customerID)
    }

  }
  async getCustomerCredit(ID: string) {
    this.customerCredits = [];
    this.dataMessage = Constants.FETCHING_DATA;
    let result = await this.accountService.getData(`customer-credits/specific/${ID}?currency=${this.saleData.currency}`).toPromise();
    if (result.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
    }

    if (result.length > 0) {
      result.map((v) => {
        v.prevPaidAmount = Number(v.totalAmt) - Number(v.balance);
        v.paidStatus = false;
        v.fullPayment = false;
        v.paidAmount = 0;
        v.newStatus = v.status.replace("_", " ");
      });
      this.customerCredits = result;
    }

  }

  async getOrderDetail(ID: string) {
    let getSaleOrder = this.salesOrder.find(elem => elem.saleID === ID);
    this.saleData.sOrderDetails = [...getSaleOrder.sOrderDetails]
    await this.calculateAmount(null);
    this.calculateFinalTotal();
  }


  async fetchAccounts() {
    this.accountService.getData(`chartAc/fetch/list`).subscribe((res: any) => {
      this.accounts = res;
    });
  }

  addDetails() {
    let obj = {
      commodity: '',
      desc: '',
      qty: 0,
      qtyUnit: null,
      rate: 0,
      rateUnit: null,
      amount: 0,
      accountID: null,
    };
    const lastAdded: any = this.saleData.sOrderDetails[this.saleData.sOrderDetails.length - 1];
    if (
      lastAdded.commodity !== "" &&
      lastAdded.qty !== "" &&
      lastAdded.qtyUnit !== null &&
      lastAdded.rate !== "" &&
      lastAdded.rateUnit !== null &&
      lastAdded.amount !== 0 &&
      lastAdded.accountID !== null
    ) {
      this.saleData.sOrderDetails.push(obj);
    }
    this.calculateAmount(null);
    this.calculateFinalTotal();
  }

  deleteDetail(d: number) {
    this.total -= this.saleData.sOrderDetails[d].amount;
    this.saleData.sOrderDetails.splice(d, 1);
    this.calculateAmount(null);
    this.calculateFinalTotal();
  }

  addAccessorialArr(type) {
    let obj = {
      name: "",
      amount: 0,
    };
    if (type === "fee") {
      const lastAdded =
        this.saleData.charges.accFee[this.saleData.charges.accFee.length - 1];
      if (lastAdded.name !== "" && lastAdded.amount !== 0) {
        this.saleData.charges.accFee.push(obj);
      }
    } else if (type === "ded") {
      const lastAdded =
        this.saleData.charges.accDed[this.saleData.charges.accDed.length - 1];
      if (lastAdded.name !== "" && lastAdded.amount !== 0) {
        this.saleData.charges.accDed.push(obj);
      }
    }
  }

  dedAccessorialArr(type, index) {
    if (type === "fee") {
      this.saleData.charges.accFee.splice(index, 1);
      this.accessorialFeeTotal();
    } else if (type === "ded") {
      this.saleData.charges.accDed.splice(index, 1);
      this.accessorialDedTotal();
      this.calculateFinalTotal();
    }

  }

  accessorialFeeTotal() {
    this.saleData.total.feeTotal = 0;
    this.saleData.charges.accFee.forEach((element) => {
      this.saleData.total.feeTotal += Number(element.amount);
    });
    this.calculateFinalTotal();
  }

  accessorialDedTotal() {
    this.saleData.total.dedTotal = 0;
    this.saleData.charges.accDed.forEach((element) => {
      this.saleData.total.dedTotal += Number(element.amount);
    });
    this.calculateFinalTotal();
  }

  calculateFinalTotal() {
    this.saleData.total.subTotal =
      Number(this.saleData.total.detailTotal) +
      Number(this.saleData.total.feeTotal) -
      Number(this.saleData.total.dedTotal);

    this.allTax();
    this.saleData.total.finalTotal =
      Number(this.saleData.total.subTotal) +
      Number(this.saleData.total.taxes) - Number(this.saleData.total.customerCredit);
  }

  taxcalculation(index) {
    this.saleData.charges.taxes[index].amount =
      (this.saleData.charges.taxes[index].tax *
        this.saleData.total.subTotal) /
      100;

    this.taxTotal();
  }

  allTax() {
    let countTax = 0;
    this.saleData.charges.taxes.forEach((element) => {
      element.amount = (element.tax * this.saleData.total.subTotal) / 100;
      countTax += element.amount;
    });
    this.saleData.total.taxes = countTax
  }

  taxTotal() {
    this.saleData.total.taxes = 0;
    this.saleData.charges.taxes.forEach((element) => {
      this.saleData.total.taxes += Number(element.amount);
    });
    this.calculateFinalTotal();
  }

  async fetchStateTaxes() {
    let result = await this.apiService.getData("stateTaxes").toPromise();
    this.stateTaxes = result.Items;
  }

  taxExempt(value: boolean) {
    if (value === true) {
      this.saleData.total.finalTotal = this.saleData.total.subTotal;
    }
    this.calculateFinalTotal();
  }

  getCurrentUser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.saleData.salePerson = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  };

  async stateSelectChange() {
    let selected: any = this.stateTaxes.find(
      (o) => o.stateTaxID == this.saleData.stateTaxID
    );

    this.saleData.charges.taxes = [];

    this.saleData.charges.taxes = [
      {
        name: "GST",
        tax: selected.GST ? selected.GST : 0,
        type: '',
        amount: 0,
      },
      {
        name: "HST",
        tax: selected.HST ? selected.HST : 0,
        type: '',
        amount: 0,
      },
      {
        name: "PST",
        tax: selected.PST ? selected.PST : 0,
        type: '',
        amount: 0,
      },
    ];
    this.calculateFinalTotal();

    // this.tax =
    //   (parseInt(selected.GST) ? selected.GST : 0) +
    //   (parseInt(selected.HST) ? selected.HST : 0) +
    //   (parseInt(selected.PST) ? selected.PST : 0);
  }


  selectedCredits() {
    this.saleData.creditIds = [];
    this.saleData.creditData = [];
    for (const element of this.customerCredits) {
      if (element.selected) {
        if (!this.saleData.creditIds.includes(element.creditID)) {
          let obj = {
            creditID: element.creditID,
            status: element.status,
            paidAmount:
              element.status === "not_deducted"
                ? element.paidAmount
                : Number(element.totalAmt) - Number(element.balance),
            totalAmount:
              element.status === "not_deducted"
                ? element.amount
                : element.balance,
            pendingAmount: element.balance,
          };
          this.saleData.creditIds.push(element.creditID);
          this.saleData.creditData.push(obj);
        }
      }
    }
    this.creditCalculation();
    this.calculateFinalTotal();
  }

  creditCalculation() {
    this.saleData.total.customerCredit = 0;
    for (const element of this.customerCredits) {
      if (element.selected) {
        this.saleData.total.customerCredit += Number(element.paidAmount);
        this.saleData.creditData.map((v) => {
          if (element.creditID === v.creditID) {
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

  addInvoice() {
    this.customerCredits.forEach(elem => {
      if (elem.selected && (elem.paidAmount === 0 || elem.paidAmount === '')) {
        this.toaster.error('Please add credits amount')
        return;
      }
    })

    this.accountService.postData(`sales-invoice`, this.saleData).subscribe({
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
        this.toaster.success('Invoice added successfully.');
        this.cancel();
      },
    });
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }


  async fetchSaleInvoice() {
    let result = await this.accountService.getData(`sales-invoice/detail/${this.saleID}`).toPromise();
    this.saleData = result[0];
    await this.getCustomerCredit(this.saleData.customerID);
    await this.getOrders(this.saleData.customerID);
    await this.fetchAccounts();
    this.getOrderDetail(this.saleData.sOrderNo)
  }

  updateInvoice() {
    this.accountService.putData(`sales-invoice/update/${this.saleID}`, this.saleData).subscribe({
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
        this.toaster.success('Invoice updated successfully.');
        this.cancel();
      },
    });
  }
}
