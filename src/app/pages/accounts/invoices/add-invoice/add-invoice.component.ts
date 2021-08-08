import { ApiService, AccountService, ListService } from '../../../../services';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import {Auth} from 'aws-amplify';
@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css']
})
export class AddInvoiceComponent implements OnInit {

  constructor(
    private accountService: AccountService,
    private listService: ListService,
    private apiService: ApiService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router) { }
    pageTitle = 'Add Invoice';
    dateMinLimit = { year: 2021, month: 1, day: 1 };
    date = new Date();
    futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
    users: any = [];
  invoiceData = {
    invNo: '',
    txnDate: moment().format('YYYY-MM-DD'),
    invRef: '',
    invCur: null,
    invDueDate: null,
    invPayTerms: '',
    customerID: null,
    cusAddressID: null,
    invSalesman: null,
    invSubject: '',
    amountReceived: 0,
    amountPaid: 0,
    fullPayment: false,
    balance: 0,
    details: [{
      commodityService: '',
      qtyHours: 0,
      priceRate: 0,
      amount: 0,
      accountID: null,
    }],
    remarks: '',
    discount: 0,
    discountUnit: '%',
    invStateProvince: null,
    invStatus: 'open',
    invType: 'manual',
    subTotal: 0,
    taxesInfo: [],
    finalAmount: 0,
    taxAmount: 0,
    transactionLog: [],
    discountAmount: 0
  };
  midAmt = 0; // midAmt is sum of all the amount values in details table
  finalAmount: any = 0;
  customersObjects = {};
  /**
   * Customer related properties
   */
  customers: any = [];
  customerSelected = [{
    additionalContact: [],
    address: [],
    officeAddr: false,
    email: '',
    phone: ''
  }];
  notOfficeAddress = false;
  /**
   * Accounts
   *
   */
  accounts: any = [];
  /**
   * Taxes part
   */
  tax: any = 0;
  stateTaxes = [];
  stateTaxID = '';
  newTaxes = [
    {
      type: '',
      amount: 0,
      taxAmount: 0
    }
  ];
  invID: string;
  errors = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  submitDisabled = false;
  currentUser:any = '';
  ngOnInit() {
    this.listService.fetchCustomers();
    this.getCurrentuser();
    this.customers = this.listService.customersList;
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
    this.fetchStateTaxes();
    this.fetchUsers();
    this.invID = this.route.snapshot.params[`invID`];
    if (this.invID) {
      this.pageTitle = 'Edit Invoice';
      this.fetchInvoice();
    } else {
      this.pageTitle = 'Add Invoice';
    }
    this.fetchCustomersByIDs();
  }
  fetchUsers() {
    this.apiService.getData('contacts/get/type/employee').subscribe((result: any) => {
      this.users = result;
    });
  }
  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.currentUser = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    this.invoiceData.invSalesman = this.currentUser;
}
  selectedCustomer(customerID: any) {
    this.apiService
      .getData(`contacts/detail/${customerID}`)
      .subscribe((result: any) => {
        if (result.Items.length > 0) {

          this.customerSelected = result.Items;
          for (let i = 0; i < this.customerSelected[0].address.length; i++) {
            const element = this.customerSelected[0].address[i];
            element[`isChecked`] = false;
          }
          if (this.invID) {
            this.customerSelected[0].address.filter( elem => {
              if (elem.addressID === this.invoiceData.cusAddressID) {
                elem.isChecked = true;
              }
            });
          } else {
            this.customerSelected[0].address[0].isChecked = true;
            if (this.customerSelected[0].address.length > 0) {
              this.invoiceData.cusAddressID = this.customerSelected[0].address[0].addressID;
            }
            const addressLength = this.customerSelected[0].address.length;
            const getType = this.customerSelected[0].address[0].addressType;

            if (addressLength === 1 && (getType === '' || getType === null)) {
              this.notOfficeAddress = true;
            } else {
              this.notOfficeAddress = false;
            }
          }
        }

      });
  }
  getAddressID(value: boolean, i: number, id: string) {
    if (value === true) {
      this.invoiceData.cusAddressID = id;
      for (let index = 0; index < this.customerSelected[0].address.length; index++) {
        const element = this.customerSelected[0].address[index];
        element.isChecked = false;
      }
      this.customerSelected[0].address[i].isChecked = true;
    }
  }
  getInvDueDate(e: any) {
 if (e === '15') {
  const test = moment().add(15, 'd');
  const test1 = moment(test).format('YYYY-MM-DD');
  this.invoiceData.invDueDate = test1;
 } else if (e === '30') {
  const test = moment().add(30, 'd');
  const test1 = moment(test).format('YYYY-MM-DD');
  this.invoiceData.invDueDate = test1;
 } else if (e === '45') {
  const test = moment().add(45, 'd');
  const test1 = moment(test).format('YYYY-MM-DD');
  this.invoiceData.invDueDate = test1;
 } else if (e === 'dueReceipt') {
  this.invoiceData.invDueDate = moment().format('YYYY-MM-DD');
 } else if (e === 'dueEnd') {
  this.invoiceData.invDueDate   = moment().endOf('month').format('YYYY-MM-DD');
 } else {
  this.invoiceData.invDueDate   = null;
 }
  }
  calculateDetailAmt(e: number, d: number, type: string) {
    if (type === 'price') {
      this.invoiceData.details[d].amount = this.invoiceData.details[d].qtyHours * e;
      this.calculateAmount();
    } else {
      this.invoiceData.details[d].amount = this.invoiceData.details[d].priceRate * e;
      this.calculateAmount();
    }
  }
  async stateSelectChange() {
    const selected: any = this.stateTaxes.find(o => o.stateTaxID === this.invoiceData.invStateProvince);
    this.invoiceData.taxesInfo = [];

    this.invoiceData.taxesInfo = [
      {
        name: 'GST',
        amount: selected.GST,
      },
      {
        name: 'HST',
        amount: selected.HST,
      },
      {
        name: 'PST',
        amount: selected.PST,
      },
    ];
    this.tax = (Number(selected.GST) ? selected.GST : 0)
             + (Number(selected.HST) ? selected.HST : 0) + (Number(selected.PST) ? selected.PST : 0);
    await this.calculateAmount();
  }

  async fetchStateTaxes() {
    const result = await this.apiService.getData(`stateTaxes`).toPromise();
    this.stateTaxes = result.Items;
    if (!this.invID) {
      this.invoiceData.invStateProvince = this.stateTaxes[0].stateTaxID;
      this.invoiceData.taxesInfo = [
        {
          name: 'GST',
          amount: result.Items[0].GST,
        },
        {
          name: 'HST',
          amount: result.Items[0].HST,
        },
        {
          name: 'PST',
          amount: result.Items[0].PST,
        },
      ];
    } else {
         this.stateTaxes.map((v: any) => {
          if (this.invoiceData.invStateProvince === v.stateTaxID) {
            this.invoiceData.taxesInfo = [
              {
                name: 'GST',
                amount: v.GST,
              },
              {
                name: 'HST',
                amount: v.HST,
              },
              {
                name: 'PST',
                amount: v.PST,
              },
            ];
          }
        });
      }

    this.newTaxes = this.invoiceData.taxesInfo;
    if (this.invoiceData.subTotal > 0) {
      for (const element of this.newTaxes) {
        element.taxAmount = (this.invoiceData.subTotal * element.amount) / 100;
      }
    }
  }

  addDetails() {
    this.invoiceData.details.push({
      commodityService: '',
      qtyHours: 0,
      priceRate: 0,
      amount: 0,
      accountID: null,
    });
  }

  deleteDetail(amount: number, d: number) {
    this.invoiceData.details.splice(d, 1);
    this.calculateAmount();
  }

  addInvoice() {
    this.invoiceData.balance = this.invoiceData.finalAmount;
    this.submitDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    this.accountService.postData(`invoices`, this.invoiceData).subscribe({
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
        this.toaster.success('Invoice Added Successfully.');
        this.router.navigateByUrl('/accounts/invoices/list');
      },
    });
  }
 cancelFn() {
  this.router.navigateByUrl('/accounts/invoices/list');
 }
  async calculateAmount() {
    this.midAmt = 0;
    for (const element of this.invoiceData.details) {
      this.midAmt += Number(element.amount);
    }
    this.invoiceData.subTotal = this.midAmt;
    if (this.invoiceData.discountUnit === '%') {
      this.invoiceData.subTotal = this.midAmt - (this.invoiceData.discount * this.midAmt) / 100;
      this.invoiceData.discountAmount = (this.invoiceData.discount * this.midAmt) / 100;
    } else if (this.invoiceData.discountUnit === 'CAD') {
      this.invoiceData.subTotal = this.midAmt - this.invoiceData.discount;
      this.invoiceData.discountAmount = this.invoiceData.discount;
    } else {
      this.invoiceData.subTotal = this.midAmt - this.invoiceData.discount;
      this.invoiceData.discountAmount = this.invoiceData.discount;
    }
    this.finalAmount = (this.invoiceData.subTotal).toFixed(2);
    const gst = this.invoiceData.taxesInfo[0].amount ? this.invoiceData.taxesInfo[0].amount : 0;
    const pst = this.invoiceData.taxesInfo[1].amount ? this.invoiceData.taxesInfo[1].amount : 0;
    const hst = this.invoiceData.taxesInfo[2].amount ? this.invoiceData.taxesInfo[2].amount : 0;
    const totalTax = parseInt(gst, 10)  + parseInt(pst, 10) + parseInt(hst, 10);
    const taxAmount =  parseInt(this.finalAmount, 10) * totalTax / 100;
    this.invoiceData.taxAmount = +taxAmount.toFixed(2);
    const final = parseInt(this.finalAmount, 10) + taxAmount;

    this.invoiceData.finalAmount = final;
    this.newTaxes = this.invoiceData.taxesInfo;
    if (this.invoiceData.subTotal > 0) {
      for (const element of this.newTaxes) {
        element.taxAmount = (this.invoiceData.subTotal * element.amount) / 100;
      }
    }
  }

  fetchInvoice() {
    this.accountService.getData(`invoices/detail/${this.invID}`).subscribe((res) => {
      this.invoiceData = res[0];
      this.selectedCustomer(this.invoiceData.customerID);
      this.invoiceData.invStateProvince = this.invoiceData.invStateProvince;
      this.fetchStateTaxes();
      this.invoiceData.details = res[0].details;
      this.invoiceData.transactionLog = res[0].transactionLog;
      this.calculateAmount();
      const state = this.stateTaxes.find(o => o.stateTaxID === res[0].invStateProvince);

      this.invoiceData.taxesInfo = [
        {
          name: 'GST',
          amount: (state) ? state.GST : '',
        },
        {
          name: 'HST',
          amount: (state) ? state.HST : '',
        },
        {
          name: 'PST',
          amount: (state) ? state.PST : '',
        },
      ];

      });
  }
  updateInvoice() {
    this.submitDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    this.invoiceData.balance = this.invoiceData.finalAmount;
    this.accountService.putData(`invoices/update/${this.invID}`, this.invoiceData).subscribe({
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
        this.toaster.success('Invoice Updated Successfully.');
        this.router.navigateByUrl('/accounts/invoices/list');
      },
    });
  }
    /*
   * Get all customers's IDs of names from api
   */
    fetchCustomersByIDs() {
      this.apiService.getData('contacts/get/list').subscribe((result: any) => {
        this.customersObjects = result;
      });
    }
}
