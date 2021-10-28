import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService } from 'src/app/services';
import * as moment from 'moment';

@Component({
  selector: 'app-add-sales-invoice',
  templateUrl: './add-sales-invoice.component.html',
  styleUrls: ['./add-sales-invoice.component.css']
})
export class AddSalesInvoiceComponent implements OnInit {
  total = 0;
  saleData = {
    txnDate: moment().format('YYYY-MM-DD'),
    currency: 'CAD',
    customerID: null,
    sOrderNo: '',
    sRef: '',
    dueDate: null,
    paymentTerm: null,
    salePerson: '',
    sOrderDetail: [{
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
    },
    taxExempt: true,
    stateTaxID: null,
    remarks: "",
  }

  paymentTerms = [
    {
      value: "15_days",
      name: "15 Days",
    },
    {
      value: "30_days",
      name: "30 Days",
    },
    {
      value: "45_days",
      name: "45 Days",
    },
    {
      value: "due_on_receipt",
      name: "Due on receipt",
    },
    {
      value: "due_end_of_month",
      name: "Due end of the month",
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

  constructor(private apiService: ApiService, private httpClient: HttpClient, private accountService: AccountService,) { }

  ngOnInit() {
    this.fetchCustomers();
    this.fetchAccounts();
    this.fetchQuantityUnits();
    this.getCurrentUser();
    this.fetchStateTaxes();
  }

  fetchQuantityUnits() {
    this.httpClient
      .get("assets/jsonFiles/quantityTypes.json")
      .subscribe((data: any) => {
        this.units = data;
      });
  }

  fetchCustomers() {
    this.apiService
      .getData(`contacts/get/list`)
      .subscribe((result: any) => {
        this.customers = result;
      });
  }

  changeUnit(value: string, i: any) {
    this.saleData.sOrderDetail[i].qtyUnit = value;
    this.saleData.sOrderDetail[i].rateUnit = value;
  }

  async calculateAmount(i: number) {
    let total: any = 0;
    this.saleData.sOrderDetail[i].amount = this.saleData.sOrderDetail[i].qty * this.saleData.sOrderDetail[i].rate;
    this.saleData.sOrderDetail.forEach(element => {
      total += element.amount;
    });
    this.saleData.total.detailTotal = parseFloat(total);
  }

  async getCustomerOrders(ID: string) {
    this.saleData.sOrderNo = '';
    this.salesOrder = [];
    this.saleData.sOrderDetail = [{
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
      await this.getOrders(ID);
      await this.getCustomerCredit(ID);
    }

  }

  async getOrders(ID: string) {
    let result = await this.accountService.getData(`sales-orders/specific/${ID}`).toPromise();
    if (result.length > 0) {
      this.salesOrder = result;
    }
  }

  async getCustomerCredit(ID: string) {
    this.dataMessage = Constants.FETCHING_DATA;
    let result = await this.accountService.getData(`customer-credits/specific/${ID}`).toPromise();
    if (result.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
    }
    if (result.length > 0) {
      this.customerCredits = result;
      console.log('customer-credits', result)
    }
  }

  getOrderDetail(ID: string) {
    let getSaleOrder = this.salesOrder.find(elem => elem.saleID === ID);
    console.log('getSaleOrder*******', getSaleOrder.sOrderDetails);
    this.saleData.sOrderDetail = [...getSaleOrder.sOrderDetails]
    console.log('this.saleData.sOrderDetail*******', this.saleData.sOrderDetail);
  }


  fetchAccounts() {
    this.accountService.getData(`chartAc/fetch/list`).subscribe((res: any) => {
      this.accounts = res;
    });
  }

  addDetails() {
    this.saleData.sOrderDetail.push({
      commodity: '',
      desc: '',
      qty: 0,
      qtyUnit: null,
      rate: 0,
      rateUnit: null,
      amount: 0,
      accountID: null,
    });
  }

  deleteDetail(d: number) {
    this.total -= this.saleData.sOrderDetail[d].amount;
    this.saleData.sOrderDetail.splice(d, 1);
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
      Number(this.saleData.total.taxes);
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

  addOrder() {
    console.log('order data', this.saleData);
  }
}
