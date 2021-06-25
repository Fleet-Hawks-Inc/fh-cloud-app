import { ApiService, AccountService, ListService } from '../../../../services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css']
})
export class AddInvoiceComponent implements OnInit {

  constructor(private accountService: AccountService, private listService: ListService, private apiService: ApiService) { }
  invNo: number;
  invDate: string;
  invRef: string;
  invDueDate: string;
  invPayTerms: string;
  invCustomerID: string;
  invSalesman: string;
  invSubject: string;
  // details: [
  //   {
  //     commodityService: string;
  //     qtyHours: string;
  //     priceRate: string;
  //     amount: number;
  //     amtCur: string;
  //     accountID: string;
  //   },
  // ];
  remarks: string;
  discount: number;
  discountUnit: string;
  invStateProvince: string;
  // gst: number;
  // pst: number;
  // hst: number;
  subTotal: any = 0;
  details = [{
    commodityService: '',
    qtyHours: '',
    priceRate: '',
    amount: 0,
    amtCur: '',
    accountID: '',
  }];
  taxesInfo = [];
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
  ngOnInit() {
    this.listService.fetchCustomers();
    this.customers = this.listService.customersList;
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
    this.fetchStateTaxes();
  }
  selectedCustomer(customerID: any) {
    this.apiService
      .getData(`contacts/detail/${customerID}`)
      .subscribe((result: any) => {
        if (result.Items.length > 0) {
          this.customerSelected = result.Items[0];
          for (let i = 0; i < this.customerSelected.address.length; i++) {
            const element = this.customerSelected.address[i];
            if (element.addressType == 'Office') {
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
    let selected: any = this.stateTaxes.find(o => o.stateTaxID === this.invStateProvince);
    this.taxesInfo = [];

    this.taxesInfo = [
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
    // await this.calculateAmount();

  }

  async fetchStateTaxes() {

    let result = await this.apiService
      .getData(`stateTaxes`).toPromise();
    this.stateTaxes = result.Items;
    this.invStateProvince = this.stateTaxes[0].stateTaxID;
    this.stateTaxes.map((v: any) => {
      if (this.invStateProvince === v.stateTaxID) {
        this.taxesInfo = [
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
      }
    });


    this.newTaxes = this.taxesInfo;
    if (this.subTotal > 0) {
      for (let i = 0; i < this.newTaxes.length; i++) {
        const element = this.newTaxes[i];
        element.taxAmount = (this.subTotal * element.amount) / 100;
      }
    }
  }
  addDetails() {
    this.details.push({
      commodityService: '',
      qtyHours: '',
      priceRate: '',
      amount: 0,
      amtCur: '',
      accountID: '',
    });
  }
  deleteDetail(d) {
    this.details.splice(d, 1);
  }
  addInvoice() {
    const data = {
      invNo: this.invNo,
      invDate: this.invDate,
      invRef: this.invRef,
      invDueDate: this.invDueDate,
      invPayTerms: this.invPayTerms,
      invCustomerID: this.invCustomerID,
      invSalesman: this.invSalesman,
      invSubject: this.invSubject,
      details: this.details,
      remarks: this.remarks,
      discount: this.discount,
      discountUnit: this.discountUnit,
      invStateProvince: this.invStateProvince,
    };
    console.log('input', data);
     this.accountService.postData(`invoices`, data).subscribe((res) => {
     console.log('res', res);
     });
  }
}
