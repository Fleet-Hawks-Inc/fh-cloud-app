import { ApiService, AccountService, ListService } from '../../../../services';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth } from 'aws-amplify';
import { Location } from '@angular/common';
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
    private location: Location,
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
    discountAmount: 0,
    taxExempt: true
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
    adrs: [],
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
  currentUser: any = '';
  async ngOnInit() {

    this.getCurrentuser();
    // this.customers = this.listService.customersList;
    this.fetchStateTaxes();
    // this.fetchUsers();
    this.fetchAccounts();
    this.invID = this.route.snapshot.params[`invID`];
    if (this.invID) {
      this.pageTitle = 'Edit Invoice';
      await this.fetchInvoice();
    } else {
      this.pageTitle = 'Add Invoice';
    }
    this.listService.fetchCustomers();
    this.fetchCustomersByIDs();

    let customerList = new Array<any>();
    this.getValidcustomers(customerList);
    this.customers = customerList;
  }

  private getValidcustomers(customerList: any[]) {
    let ids = [];
    this.listService.customersList.forEach((element) => {
      element.forEach((element2) => {
        if (
          element2.isDeleted === 1 &&
          element2.contactID === this.invoiceData.customerID
        ) {
          this.invoiceData.customerID = null;
        }
        if (
          element2.isDeleted === 0 &&
          !ids.includes(element2.contactID)
        ) {
          customerList.push(element2);
          ids.push(element2.contactID);
        }
      });
    })
  }

  fetchUsers() {
    this.apiService.getData('contacts/get/type/employee').subscribe((result: any) => {
      this.users = result;
    });
  }
  fetchAccounts() {
    this.accountService.getData(`chartAc/fetch/list`).subscribe((res: any) => {
      this.accounts = res;
    });
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.currentUser = localStorage.getItem("currentUserName");
    this.invoiceData.invSalesman = this.currentUser;
  }
  selectedCustomer(customerID: any) {
    this.apiService
      .getData(`contacts/detail/${customerID}`)
      .subscribe((result: any) => {
        if (result.Items.length > 0) {

          this.customerSelected = result.Items;
          for (let i = 0; i < this.customerSelected[0].adrs.length; i++) {
            const element = this.customerSelected[0].adrs[i];
            element[`isChecked`] = false;
          }
          if (this.invID) {
            this.customerSelected[0].adrs.filter(elem => {
              if (elem.addressID === this.invoiceData.cusAddressID) {
                elem.isChecked = true;
              }
            });
          } else {
            this.customerSelected[0].adrs[0].isChecked = true;
            if (this.customerSelected[0].adrs.length > 0) {
              this.invoiceData.cusAddressID = this.customerSelected[0].adrs[0].addressID;
            }
            const addressLength = this.customerSelected[0].adrs.length;
            const getType = this.customerSelected[0].adrs[0].aType;

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
      for (let index = 0; index < this.customerSelected[0].adrs.length; index++) {
        const element = this.customerSelected[0].adrs[index];
        element.isChecked = false;
      }
      this.customerSelected[0].adrs[i].isChecked = true;
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
      this.invoiceData.invDueDate = moment().endOf('month').format('YYYY-MM-DD');
    } else {
      this.invoiceData.invDueDate = null;
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
        element.taxAmount = +((this.invoiceData.subTotal * element.amount) / 100).toFixed(2);
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
        this.cancel();
      },
    });
  }
  async calculateAmount() {
    this.midAmt = 0;
    for (const element of this.invoiceData.details) {
      this.midAmt += Number(element.amount);
    }
    this.invoiceData.subTotal = this.midAmt;
    if (this.invoiceData.discountUnit === '%') {
      let discount = (this.invoiceData.discount * this.midAmt) / 100;
      this.invoiceData.subTotal = this.midAmt - discount;
      this.invoiceData.discountAmount = discount;
    } else if (this.invoiceData.discountUnit === 'CAD') {
      this.invoiceData.subTotal = this.midAmt - this.invoiceData.discount;
      this.invoiceData.discountAmount = this.invoiceData.discount;
    } else {
      this.invoiceData.subTotal = this.midAmt - this.invoiceData.discount;
      this.invoiceData.discountAmount = this.invoiceData.discount;
    }
    this.finalAmount = (this.invoiceData.subTotal).toFixed(2);

    if (!this.invoiceData.taxExempt) {
      const gst = this.invoiceData.taxesInfo[0].amount ? this.invoiceData.taxesInfo[0].amount : 0;
      const pst = this.invoiceData.taxesInfo[1].amount ? this.invoiceData.taxesInfo[1].amount : 0;
      const hst = this.invoiceData.taxesInfo[2].amount ? this.invoiceData.taxesInfo[2].amount : 0;
      const totalTax = parseInt(gst, 10) + parseInt(pst, 10) + parseInt(hst, 10);
      const taxAmount = this.midAmt * totalTax / 100;
      this.invoiceData.taxAmount = +taxAmount.toFixed(2);
      const final = parseInt(this.finalAmount, 10) + taxAmount;

      this.invoiceData.finalAmount = final;
      this.newTaxes = this.invoiceData.taxesInfo;
      if (this.invoiceData.subTotal > 0) {
        for (const element of this.newTaxes) {
          element.taxAmount = +((this.midAmt * element.amount) / 100).toFixed(2);
        }
      }
    } else {
      this.invoiceData.taxAmount = 0;
      this.invoiceData.finalAmount = this.finalAmount;
    }

  }

  async fetchInvoice() {
    let res: any = await this.accountService.getData(`invoices/detail/${this.invID}`).toPromise();
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
        this.cancel();
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

  refreshCustomerData() {
    this.listService.fetchCustomers();
  }
  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem('isOpen', 'true');
    this.listService.changeButton(false);
  }

  changeTax(value) {
    if (!value && this.stateTaxes.length === 0) {
      this.fetchStateTaxes();
    }
    this.calculateAmount();
  }
}
