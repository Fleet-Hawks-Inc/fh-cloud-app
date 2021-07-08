import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';
import  Constants  from '../../../fleet/constants'; 

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.css']
})
export class ExpenseDetailComponent implements OnInit {

  expenseID = '';
  expenses = [];
  vendors = [];
  expenseData = {
    categoryID: null,
    expAccountID: null,
    paidAccountID: null,
    amount: 0,
    currency: null,
    recurring: {
      status: false,
      startDate: null,
      endDate: null,
      interval: null,
    },
    expDate: null,
    unitType: null,
    unitID: null,
    vendorID: null,
    countryCode: null,
    countryName: '',
    stateCode: null,
    stateName: '',
    cityName: null,
    taxes: {
      includeGST: true,
      gstPercent: '',
      gstAmount: '',
      includePST: true,
      pstPercent: '',
      pstAmount: '',
      includeHST: true,
      hstpercent: '',
      hstAmount: ''
    },
    customerID: null,
    invoiceID: null,
    documents: [],
    notes: ''
  };
  Asseturl = this.apiService.AssetUrl;
  documentSlides = [];
  pdfSrc;
  accounts = [];
  invoices = [];
  categories = [];
  constructor(private accountService: AccountService, private apiService: ApiService, private toaster: ToastrService, private route: ActivatedRoute, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.expenseID = this.route.snapshot.params['expenseID'];
    this.fetchExpenseByID();
    this.fetchVendors();
    this.fetchAccounts();
    this.fetchInvoices();
    this.fetchExpenseCategories();
  }

  fetchExpenseByID() {
    this.accountService.getData(`expense/detail/${this.expenseID}`)
      .subscribe((result: any) => {
        if (result[0] != undefined) {
          this.expenseData = result[0];

          if (result[0].documents != undefined && result[0].documents.length > 0) {
            result[0].documents.map((x) => {
              let obj = {
                name: x,
                path: `${this.Asseturl}/${result[0].carrierID}/${x}`
              }
              this.documentSlides.push(obj);
            })
          }
        }
      })
  }

  fetchVendors() {
    this.apiService.getData(`contacts/get/list`)
      .subscribe((result: any) => {
        this.vendors = result;
      })
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length - 1];
    this.pdfSrc = '';
    if (ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  fetchAccounts() {
    this.accountService.getData(`chartAc/get/list/all`)
      .subscribe((result: any) => {
        this.accounts = result;
      })
  }

  fetchInvoices() {
    this.accountService.getData('invoices/get/list').subscribe((res: any) => {
      this.invoices = res;
    });
  }

  deleteDocument(name: string, index: number) {
    console.log('this.expenseID', this.expenseID);
    this.accountService.deleteData(`expense/uploadDelete/${this.expenseID}/${name}`).subscribe((result: any) => {
      this.documentSlides.splice(index, 1);
      this.toaster.success('Attachment deleted successfully.');
    }); 
  }

  fetchExpenseCategories() {
    this.accountService.getData(`expense/categories/list`)
      .subscribe((result: any) => {
        this.categories = result;
      })
  }
}
