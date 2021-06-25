import { ApiService, AccountService, ListService } from '../../../../services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css']
})
export class AddInvoiceComponent implements OnInit {

  constructor( private accountService: AccountService, private listService: ListService, private apiService: ApiService,) { }
  invNo: number;
  invDate: string;
  invRef: string;
  invDueDate: string;
  invPayTerms: string;
  invCustomerID: string;
  invSalesman: string;
  invSubject: string;
  details: [
      {
          commodityService: string;
          qtyHours: string;
          priceRate: string;
          amount: number;
          amtCur: string;
          accountID: string;
      },
  ];
  remarks: string;
  discount: number;
  discountUnit: string;
  invStateProvince: string;
  gst: number;
  pst: number;
  hst: number;
  /**
   *Customer related properties
   */
  customers: any = [];
  customerSelected = {
    additionalContact : [],
    address:[],
    officeAddr: false,
    email: '',
    phone: ''
  };
  notOfficeAddress: boolean = false;
  ngOnInit() {
    this.listService.fetchCustomers();
    this.customers = this.listService.customersList;
    console.log('this.customers', this.customers);
  }
  selectedCustomer(customerID: any) {
    this.apiService
      .getData(`contacts/detail/${customerID}`)
      .subscribe((result: any) => {
        if(result.Items.length > 0) {
          this.customerSelected = result.Items[0];
          for (let i = 0; i < this.customerSelected.address.length; i++) {
            const element = this.customerSelected.address[i];
            if(element.addressType == 'Office') {
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
   addInvoice() {
    const data = {
      invNo: this.invNo,
      // invDate: this.invDate,
      // invRef: this.invRef,
      // invDueDate: this.invDueDate,
      // invPayTerms: this.invPayTerms,
      // invCustomerID: this.invCustomerID,
      // invSalesman: this.invSalesman,
      // invSubject: this.invSubject,
      // details: [],
      // remarks: this.remarks,
      // discount: this.discount,
      // discountUnit: this.discountUnit,
      // invStateProvince: this.invStateProvince,
      // gst: this.gst,
      // pst: this.pst,
      // hst: this.hst,
    };
     this.accountService.postData(`invoices`, data).subscribe((res) => {
     console.log('res', res);
     });
   }
}
