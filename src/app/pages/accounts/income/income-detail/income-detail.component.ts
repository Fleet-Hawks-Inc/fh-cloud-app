import { Component, OnInit } from '@angular/core';
import { AccountService, ApiService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-income-detail',
  templateUrl: './income-detail.component.html',
  styleUrls: ['./income-detail.component.css']
})
export class IncomeDetailComponent implements OnInit {

  incomeID;
  incomeData = {
    categoryID: null,
    incomeAccID: null,
    depositAccID: null,
    incomeDate: null,
    invoiceID: null,
    paymentMode: null,
    paymentModeNo: null,
    paymentModeDate: null,
    customerID: null,
    recAmount: 0,
    recCurr: null,
    description: ''
  }
  paymentLabel = 'Cash';
  customers = [];
  accounts = [];
  categories = [];

  constructor(private accountService: AccountService, private apiService: ApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.incomeID = this.route.snapshot.params['incomeID'];
    this.fetchIncomeByID();
    this.fetchCustomers();
    this.fetchAccounts();
    this.fetchIncomeCategories();
  }

  fetchIncomeByID() {
    this.accountService.getData(`income/detail/${this.incomeID}`)
      .subscribe((result: any) => {
        if (result[0] != undefined) {
          this.incomeData = result[0];
          this.showPaymentFields(this.incomeData.paymentMode);
        }
      })
  }

  showPaymentFields(type) {
    if(type === 'creditCard') {
      this.paymentLabel = 'Credit Card';
    } else if(type === 'debitCard') {
      this.paymentLabel = 'Debit Card';
    } else if(type === 'demandDraft') {
      this.paymentLabel = 'Demand Card';
    } else if(type === 'eft') {
      this.paymentLabel = 'EFT';
    } else if(type === 'cash') {
      this.paymentLabel = 'Cash';
    } else if(type === 'cheque') {
      this.paymentLabel = 'Cheque';
    }
  }

  fetchCustomers() {
    this.apiService.getData(`contacts/get/list/customer`)
      .subscribe((result: any) => {
        this.customers = result;
      })
  }

  fetchAccounts() {
    this.accountService.getData(`chartAc/get/list/all`)
      .subscribe((result: any) => {
        this.accounts = result;
      })
  }

  fetchIncomeCategories() {
    this.accountService.getData(`income/categories/list`)
      .subscribe((result: any) => {
        this.categories = result;
      })
  }
}
