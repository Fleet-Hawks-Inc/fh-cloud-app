import { ApiService, AccountService, ListService } from '../../../../services';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
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
  invoiceData = {
    invNo: '',
    invDate: null,
    invRef: '',
    invDueDate: null,
    invPayTerms: '',
    invCustomerID: null,
    invSalesman: null,
    invSubject: '',
    amountReceived: 0,
    fullPayment: false,
    balance: 0,
    details: [{
      commodityService: '',
      qtyHours: '',
      priceRate: '',
      amount: 0,
      amtCur: null,
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
    totalAmount: 0,
    taxAmount: 0,
    transactionLog: [],
    discountAmount: 0
  };
  midAmt = 0; // midAmt is sum of all the amount values in details table
  totalAmount: any = 0;
  customersObjects = {};
  /**
   *Customer related properties
   */
  customers: any = [];
  customerSelected = {
    additionalContact: [],
    address: [],
    officeAddr: false,
    email: '',
    phone: ''
  };
  notOfficeAddress = false;
  /**
   *Accounts
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
  ngOnInit() {
    this.listService.fetchCustomers();
    this.customers = this.listService.customersList;
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
    this.fetchStateTaxes();
    this.invID = this.route.snapshot.params[`invID`];
    if (this.invID) {
      this.pageTitle = 'Edit Invoice';
      this.fetchInvoice();
    } else {
      this.pageTitle = 'Add Invoice';
    }
    this.fetchCustomersByIDs();
  }
  selectedCustomer(customerID: any) {
    this.apiService
      .getData(`contacts/detail/${customerID}`)
      .subscribe((result: any) => {
        if (result.Items.length > 0) {
          this.customerSelected = result.Items[0];
          for (let i = 0; i < this.customerSelected.address.length; i++) {
            const element = this.customerSelected.address[i];
            if (element.addressType === 'Office') {
              this.notOfficeAddress = false;
              this.customerSelected.officeAddr = true;
              this.customerSelected.email = result.Items[0].workEmail;
              this.customerSelected.phone = result.Items[0].workPhone;
            } else {
              this.notOfficeAddress = true;
            }
          }
        }

      });
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
    this.tax = (parseInt(selected.GST) ? selected.GST : 0) + (parseInt(selected.HST) ? selected.HST : 0) + (parseInt(selected.PST) ? selected.PST : 0);

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
      for (let i = 0; i < this.newTaxes.length; i++) {
        const element = this.newTaxes[i];
        element.taxAmount = (this.invoiceData.subTotal * element.amount) / 100;
      }
    }
  }

  addDetails() {
    this.invoiceData.details.push({
      commodityService: '',
      qtyHours: '',
      priceRate: '',
      amount: 0,
      amtCur: null,
      accountID: null,
    });
  }

  deleteDetail(amount: number, d: number) {
    this.invoiceData.details.splice(d, 1);
  }

  addInvoice() {
    console.log('this.invoiceData', this.invoiceData);
    this.invoiceData.balance = this.invoiceData.totalAmount;
    this.accountService.postData(`invoices`, this.invoiceData).subscribe((res) => {
      this.toaster.success('Invoice Added Successfully.');
      this.acRecDebitFn();
      this.acCreditFn();
      this.acTaxFn();
      this.acDiscountFn();
      this.router.navigateByUrl('/accounts/invoices/list');
    });
  }

  async calculateAmount() {
    this.midAmt = 0;
    for (let i = 0; i < this.invoiceData.details.length; i++) {
      this.midAmt += Number(this.invoiceData.details[i].amount);
    }
    this.invoiceData.subTotal = this.midAmt;
    if (this.invoiceData.discountUnit === '%') {
      this.invoiceData.subTotal = this.midAmt - ((this.invoiceData.discount * this.midAmt) / 100);
      this.invoiceData.discountAmount = (this.invoiceData.discount * this.midAmt) / 100;
    } else if (this.invoiceData.discountUnit === 'CAD') {
      this.invoiceData.subTotal = this.midAmt - this.invoiceData.discount;
      this.invoiceData.discountAmount = this.invoiceData.discount;
    } else {
      this.invoiceData.subTotal = this.midAmt - this.invoiceData.discount;
      this.invoiceData.discountAmount = this.invoiceData.discount;
    }
    this.totalAmount = (this.invoiceData.subTotal).toFixed(0);
    const gst = this.invoiceData.taxesInfo[0].amount ? this.invoiceData.taxesInfo[0].amount : 0;
    const pst = this.invoiceData.taxesInfo[1].amount ? this.invoiceData.taxesInfo[1].amount : 0;
    const hst = this.invoiceData.taxesInfo[2].amount ? this.invoiceData.taxesInfo[2].amount : 0;
    const totalTax = parseInt(gst)  + parseInt(pst) + parseInt(hst);
    const taxAmount =  parseInt(this.totalAmount) * totalTax / 100;
    this.invoiceData.taxAmount = taxAmount;
    const final = parseInt(this.totalAmount) + taxAmount;

    this.invoiceData.totalAmount = final;
    this.newTaxes = this.invoiceData.taxesInfo;
    if (this.invoiceData.subTotal > 0) {
      for (let i = 0; i < this.newTaxes.length; i++) {
        const element = this.newTaxes[i];
        element.taxAmount = (this.invoiceData.subTotal * element.amount) / 100;
      }
    }
  }

  fetchInvoice() {
    this.accountService.getData(`invoices/detail/${this.invID}`).subscribe((res) => {
      this.invoiceData = res[0];
      this.invoiceData.invStateProvince = this.invoiceData.invStateProvince;
      this.fetchStateTaxes();
      this.invoiceData.details = res[0].details;
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
    this.invoiceData.balance = this.invoiceData.totalAmount;
    this.accountService.putData(`invoices/update/${this.invID}`, this.invoiceData).subscribe((res) => {
      this.toaster.success('Invoice Updated Successfully.');
      this.router.navigateByUrl('/accounts/invoices/list');
    });
  }
  acDiscountFn() {
    const internalID = 'ACT29';
    const customerName = this.customersObjects[this.invoiceData.invCustomerID];
    const data = {
      trxDate: moment().format('YYYY-MM-DD'),
      name: customerName,
      trxType: 'debit', // It can be debit or credit
      type: 'invoice discount', // Type means either it's from invoice, bill etc.
      amount: this.invoiceData.discount,
      currency: 'CAD',
      trxRunTotal: 0,
      desc: `Invoice is created for ${customerName}`
    };
    this.accountService.putData(`chartAc/internalActID/${internalID}`, data).subscribe();
  }
  acTaxFn() {
    const internalID = 'ACT38';
    const customerName = this.customersObjects[this.invoiceData.invCustomerID];
    const data = {
      trxDate: moment().format('YYYY-MM-DD'),
      name: customerName,
      trxType: 'credit', // It can be debit or credit
      type: 'invoice tax', // Type means either it's from invoice, bill etc.
      amount: this.invoiceData.taxAmount,
      currency: 'CAD',
      trxRunTotal: 0,
      desc: `Invoice is created for ${customerName}`
    };
    this.accountService.putData(`chartAc/internalActID/${internalID}`, data).subscribe();
  }
  acRecDebitFn() {
    const internalID = 'ACT2'; // Accounts receivable internal account id
    const customerName = this.customersObjects[this.invoiceData.invCustomerID];
    const data = {
      trxDate: moment().format('YYYY-MM-DD'),
      name: customerName,
      trxType: 'debit', // It can be debit or credit
      type: 'invoice', // Type means either it's from invoice, bill etc.
      amount: this.invoiceData.totalAmount,
      currency: 'CAD',
      trxRunTotal: 0,
      desc: `Invoice is created for ${customerName}`
    };
    this.accountService.putData(`chartAc/internalActID/${internalID}`, data).subscribe();
  }
  acCreditFn() {
    try {
      for(let i=0; i < this.invoiceData.details.length; i++) {
        const customerName = this.customersObjects[this.invoiceData.invCustomerID];
        const data = {
          trxDate: moment().format('YYYY-MM-DD'),
          name: customerName,
          trxType: 'credit', // It can be debit or credit
          type: 'invoice', // Type means either it's from invoice, bill etc.
          amount: this.invoiceData.totalAmount,
          currency: 'CAD',
          trxRunTotal: 0,
          desc: `Invoice is created for ${customerName}`
        };
        this.accountService.putData(`chartAc/trx/${this.invoiceData.details[i].accountID}`, data).subscribe();
      }
    } catch (error) {
      throw new Error(error);
    }

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
