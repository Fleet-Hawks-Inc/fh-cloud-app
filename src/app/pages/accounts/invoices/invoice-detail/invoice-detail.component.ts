import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService, ApiService } from '../../../../services';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
  invID = '';
  showDetails = false;
  invoice = {
    invNo: '',
    txnDate: null,
    invRef: '',
    invCur: '',
    invDueDate: null,
    invPayTerms: '',
    customerID: null,
    invSalesman: null,
    invSubject: '',
    cusAddressID: null,
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
    transactionLog: [],
    finalAmount: 0,
    discountAmount: 0,
    taxAmount: 0,
    amountReceived: 0,
    fullPayment: false,
    balance: 0,
  };
  customerName = '';
  customerAddress = '';
  customerCityName = '';
  customerStateName = '';
  customerCountryName = '';
  customerZipcode = '';
  customerPhone = '';
  customerAddressType = '';
  customerEmail = '';
  customerfax = '';
  total = 0;
  customersObjects = {};
  accountsObjects = {};
  accountsIntObjects = {};
  statesObjects = {};
  carrier = {
    carrierName: '',
    phone: '',
    email: ''
};
  carrierAddress = {
    address: '',
    userLocation: '',
    manual: '',
    stateName: '',
    countryName: '',
    cityName: '',
    zipCode: '',

  };
  constructor(private accountService: AccountService, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    this.invID = this.route.snapshot.params[`invID`];
    if (this.invID) {
      this.fetchInvoice();
    }

    this.fetchCustomersByIDs();
    this.fetchAccountsByIDs();
    this.fetchAccountsByInternalIDs();
    this.fetchStatesByIDs();
  }
  fetchCarrier() {
    this.apiService.getData(`carriers/${this.invoice[`pk`]}`)
        .subscribe((result: any) => {
          this.carrier = result.Items[0];
          this.fetchAddress(this.carrier[`addressDetails`]);
        });
  }

  fetchAddress(address: any) {
   for (const adr of address) {
     if (adr.addressType === 'yard' && adr.defaultYard === true) {
        if (adr.manual) {
           adr.countryName =  CountryStateCity.GetSpecificCountryNameByCode(adr.countryCode);
           adr.stateName = CountryStateCity.GetStateNameFromCode(adr.stateCode, adr.countryCode);
        }
        this.carrierAddress = adr;
        this.showDetails = true;
        break;
     }
   }
  }
  fetchInvoice() {
    this.accountService.getData(`invoices/detail/${this.invID}`).subscribe((res) => {
      this.invoice = res[0];
      this.invoice.invStatus = this.invoice.invStatus.replace('_', ' ');
      this.invoice.transactionLog.map((v: any) => {
        v.type = v.type.replace('_', ' ');
      });
      this.fetchCustomerByID();
      this.calculateTotal();
      this.fetchCarrier(); // fetch carrier details

    });
  }
  fetchStatesByIDs() {
    this.apiService.getData('stateTaxes/get/list').subscribe((result: any) => {
      this.statesObjects = result;
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
  calculateTotal() {
    let midTotal = 0;
    for (const element of this.invoice.details) {
      midTotal += Number(element.amount);
    }
    this.total = Number(midTotal) + Number(this.invoice.taxAmount);
  }
  fetchCustomerByID() {
    this.apiService.getData(`contacts/detail/${this.invoice.customerID}`).subscribe((result: any) => {

      if(result.Items.length > 0) {
        result = result.Items[0];
        this.customerName = `${result.companyName}`;
        let newCusAddress = result.address.filter((elem: any) => {
          if (elem.addressID === this.invoice.cusAddressID) {
            return elem;
          }
        });
        newCusAddress = newCusAddress[0];
        if (result.address.length > 0) {
          if (newCusAddress.manual) {
            this.customerAddress = newCusAddress.address1;
          } else {
            this.customerAddress = newCusAddress.userLocation;
          }
          this.customerAddressType = newCusAddress.addressType;
          this.customerCityName = newCusAddress.cityName;
          this.customerStateName = newCusAddress.stateName;
          this.customerCountryName = newCusAddress.countryName;
          this.customerZipcode = newCusAddress.zipCode;
          this.customerPhone = result.workPhone;
          this.customerEmail = result.workEmail;
        }
      }

    });
  }
  generatePDF() {
    const data = document.getElementById('print_wrap');

    html2pdf(data, {
      margin:       0,
      filename:     `invoice-${this.invoice.invNo}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },

    });

  }
}
