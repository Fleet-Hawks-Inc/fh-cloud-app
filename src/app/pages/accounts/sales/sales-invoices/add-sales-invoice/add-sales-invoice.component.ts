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
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';
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
  creditIds = [];
  creditData = [];
  sOrderID: any;
  saleData = {
    txnDate: moment().format('YYYY-MM-DD'),
    currency: 'CAD',
    customerID: null,
    cusAddressID: '',
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
      remarks: "",
      cName: "Adjustments",
      cType: "add",
      cAmount: 0,
      accountID: null,
      discount: 0,
      discountUnit: '%',
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
      subTotal: 0,
      taxes: 0,
      feeTotal: 0,
      finalTotal: 0,
      customerCredit: 0,
      discountAmount: 0
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
  stateTaxes = [];

  customerCredits = [];
  stlCreditsData = [];

  currentUser: any;
  saleID: string;
  pageTitle: string = 'Add';
sessionID: string;
  constructor(private apiService: ApiService, private route: ActivatedRoute, public listService: ListService, private httpClient: HttpClient, private location: Location, private toaster: ToastrService, private accountService: AccountService, private routerMgmtService: RouteManagementServiceService) { this.sessionID = this.routerMgmtService.ManualJournalSessionID; }

  ngOnInit() {
    this.saleID = this.route.snapshot.params[`saleID`];
    if (this.saleID) {
      this.pageTitle = 'Edit';
      this.fetchSaleInvoice();
    } else {
      this.pageTitle = 'Add';
      this.fetchAccounts();
    }

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
      let amount: any = this.saleData.sOrderDetails[i].qty * this.saleData.sOrderDetails[i].rate;
      this.saleData.sOrderDetails[i].amount = parseFloat(amount.toFixed(2));
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
    this.saleData.cusAddressID = '';
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
      await this.getCustomerCredit(ID);
      await this.getOrders(ID);
      await this.calculateAmount(null)
      await this.calculateFinalTotal();
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

  assignFullPayment(index, data, type: string) {

    if (data.fullPayment) {
      if (type === 'unstl') {
        this.customerCredits[index].paidAmount = data.balance.toFixed(2);
        this.customerCredits[index].paidStatus = true;
        this.customerCredits[index].selected = true;
      } else {
        this.stlCreditsData[index].paidAmount = data.balance.toFixed(2);
        this.stlCreditsData[index].paidStatus = true;
        this.stlCreditsData[index].selected = true;
      }
    } else {
      if (type === 'unstl') {
        this.customerCredits[index].paidAmount = 0;
        this.customerCredits[index].paidStatus = false;
      } else {
        this.stlCreditsData[index].paidAmount = 0;
        this.stlCreditsData[index].paidStatus = false;
      }

    }
    this.selectedCredits(type);
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
    if (getSaleOrder && getSaleOrder != undefined) {
      this.saleData.cusAddressID = getSaleOrder.cusInfo.addressID;
      this.saleData.sOrderDetails = [...getSaleOrder.sOrderDetails];
      await this.calculateAmount(null);
      this.calculateFinalTotal();
    }


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


  async calculateFinalTotal() {
    this.saleData.total.subTotal =
      Number(this.saleData.total.detailTotal) +
      Number(this.saleData.charges.cAmount)

    this.allTax();
    let discount: number;
    if (this.saleData.charges.discountUnit != '' && this.saleData.charges.discountUnit != null) {
      if (this.saleData.charges.discountUnit === '%') {
        discount = (this.saleData.total.subTotal * this.saleData.charges.discount) / 100;
      } else {
        discount = this.saleData.charges.discount;
      }
    }
    this.saleData.total.discountAmount = discount;
    this.saleData.total.finalTotal =
      Number(this.saleData.total.subTotal) +
      Number(this.saleData.total.taxes) - Number(discount) - Number(this.saleData.total.customerCredit);

  }

  accessorialFeeTotal() {
    if (this.saleData.charges.cType === "add") {
      this.saleData.total.feeTotal = Number(this.saleData.charges.cAmount);
    } else if (this.saleData.charges.cType === "ded") {
      this.saleData.total.feeTotal = -Number(this.saleData.charges.cAmount);
    }
    this.calculateFinalTotal();
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
  async taxExempt() {
    this.saleData.charges.taxes.map((v) => {
      v.tax = 0;
    });
    this.saleData.stateTaxID = null;
    this.allTax();
    this.taxTotal();
    this.calculateFinalTotal();
  }


  getCurrentUser = async () => {
    this.saleData.salePerson = localStorage.getItem("currentUserName");
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


  selectedCredits(type: string) {

    if (type === 'unstl') {
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
            this.creditIds = [...this.creditIds, element.creditID];
            this.creditData = [...this.creditData, obj];
          }
        } else {
          this.removeElements(element.creditID)
        }
      }
    } else if (type === 'stl') {

      for (const element of this.stlCreditsData) {
        if (element.selected) {
          if (!this.saleData.creditIds.includes(element.creditID)) {
            let obj = {
              creditID: element.creditID,
              status: element.status,
              paidAmount:
                element.status === "deducted"
                  ? element.paidAmount
                  : Number(element.paidAmount) - Number(element.balance),
              totalAmount:
                element.status === "deducted"
                  ? element.totalAmt
                  : Number(element.paidAmount) - Number(element.balance),
              pendingAmount: element.status === "deducted"
                ? element.totalAmt
                : Number(element.paidAmount) - Number(element.balance),
            };
            this.creditIds = [...this.creditIds, element.creditID];
            this.creditData = [...this.creditData, obj];
          }
        } else {
          this.removeElements(element.creditID)
        }
      }
    }
    console.log('this.creditData', this.creditData)
    this.saleData.creditIds = this.creditIds;
    this.saleData.creditData = this.creditData;
    this.creditCalculation();
    this.calculateFinalTotal();
  }

  removeElements(id: string) {
    console.log('edit', id)
    let index = this.creditIds.indexOf(id);
    console.log('index', index)
    if (index != -1) {
      this.creditIds.splice(index, 1);
    }
    var index1 = this.creditData.findIndex(p => p.creditID == id);
    if (index1 != -1) {
      this.creditData.splice(index1, 1);
    }
  }

  creditCalculation() {
    this.saleData.total.customerCredit = 0;
    let creditTotal = 0;
    for (const element of this.customerCredits) {
      if (element.selected) {
        creditTotal += Number(element.paidAmount);
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
    for (const element of this.stlCreditsData) {
      if (element.selected) {
        creditTotal += Number(element.paidAmount);
        this.saleData.creditData.map((v) => {
          if (element.creditID === v.creditID) {
            v.paidAmount = Number(element.paidAmount);
            v.pendingAmount =
              Number(element.totalAmt) - Number(element.balance);
            if (Number(element.paidAmount) === Number(element.prevPaidAmount)) {
              v.status = "deducted";
            } else if (Number(element.paidAmount) < Number(element.prevPaidAmount)) {
              v.status = "partially_deducted";
            } else {
              v.status = "not_deducted";
            }
          }
        });
      }
    }
    this.saleData.total.customerCredit = creditTotal;

  }

  changeTaxExempt() {
    this.taxTotal()
  }

  checkEmailStat(type) {
    if (type === "yes") {
      this.saleData["sendEmail"] = true;
    } else {
      this.saleData["sendEmail"] = false;
    }
    this.addInvoice();
  }

  addInvoice() {
    this.submitDisabled = true;

    for (const elem of this.customerCredits) {
      if (elem.selected && (elem.paidAmount === 0 || elem.paidAmount === '')) {
        this.toaster.error('Please add credits amount')
        this.submitDisabled = false;
        return false;
      }
    };

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
    result = result[0];
    this.saleData['sInvNo'] = result.sInvNo;
    this.saleData.txnDate = result.txnDate;
    this.saleData.currency = result.currency;
    this.saleData.customerID = result.customerID;
    this.saleData.cusAddressID = result.cusAddressID;
    this.saleData.sRef = result.sRef;
    this.saleData.paymentTerm = result.paymentTerm;
    this.saleData.dueDate = result.dueDate;
    this.saleData.salePerson = result.salePerson;

    this.saleData.creditData = result.creditData;
    this.saleData.creditIds = result.creditIds;
    this.creditIds = result.creditIds;
    this.creditData = result.creditData;

    this.saleData.charges = result.charges;
    this.saleData.remarks = result.remarks;

    await this.fetchAccounts();
    await this.getCustomerOrders(result.customerID);
    this.saleData.sOrderNo = result.sOrderNumber;
    this.sOrderID = result.sOrderNo;

    await this.getOrderDetail(result.sOrderNo);
    if (this.saleData.creditIds.length > 0) {

      await this.fetchStlCreditsData(this.saleData.creditIds);
    }

    this.saleData.sOrderDetails = result.sOrderDetails;

    this.saleData.total = result.total;

  }

  async fetchStlCreditsData(creditIds) {
    let ids = encodeURIComponent(JSON.stringify(creditIds));
    let result = await this.accountService.getData(`customer-credits/get/selected?entities=${ids}`).toPromise();

    if (result && result.length > 0) {
      let settledCredits = [];
      if (this.saleData.creditData.length > 0) {
        for (let i = 0; i < result.length; i++) {
          const elem1 = result[i];
          for (let index = 0; index < this.saleData.creditData.length; index++) {
            const elem2 = this.saleData.creditData[index];
            if (elem1.creditID === elem2.creditID) {
              let obj = {
                cCrNo: elem1.cCrNo,
                creditID: elem1.creditID,
                currency: elem1.currency,
                status: elem1.status,
                txnDate: elem1.txnDate,
                sRef: elem1.crRef,
                fullPayment: elem1.status == 'deducted' ? true : false,
                prevPaidAmount: elem2.paidAmount,
                paidAmount: elem2.paidAmount,
                balance: elem2.pendingAmount,
                totalAmt: elem2.totalAmount,
                selected: true
              }
              settledCredits.push(obj);
            }
          }
        }
        this.stlCreditsData = settledCredits;

      }
    }
  }

  updateInvoice() {
    this.customerCredits.forEach(elem => {
      if (elem.selected && (elem.paidAmount === 0 || elem.paidAmount === '')) {
        this.toaster.error('Please add credits amount')
        return;
      }
    })

    this.submitDisabled = true;
    this.saleData.sOrderNo = this.sOrderID;
    console.log('this.saleData', this.saleData)
    return
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
