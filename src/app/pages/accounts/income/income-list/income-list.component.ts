import { Component, OnInit } from '@angular/core';
import { AccountService, ApiService } from 'src/app/services';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.css']
})
export class IncomeListComponent implements OnInit {

  incomeAccounts = [];
  customers = [];
  categories = [];
  constructor(private accountService: AccountService, private apiService: ApiService, private router: Router, private toaster: ToastrService) { }

  ngOnInit() {
    this.fetchAccounts();
    this.fetchCustomers();
    this.fetchIncomeCategories();
  }

  fetchAccounts() {
    this.accountService.getData(`income`)
      .subscribe((result: any) => {
        if (result[0] != undefined) {
          this.incomeAccounts = result;
          this.incomeAccounts.map((v) => {
            if(v.paymentMode === 'creditCard') {
              v.paymentMode = 'Credit Card';
            } else if(v.paymentMode === 'debitCard') {
              v.paymentMode = 'Debit Card';
            } else if(v.paymentMode === 'demandDraft') {
              v.paymentMode = 'Demand Card';
            } else if(v.paymentMode === 'eft') {
              v.paymentMode = 'EFT';
            } else if(v.paymentMode === 'cash') {
              v.paymentMode = 'Cash';
            } else if(v.paymentMode === 'cheque') {
              v.paymentMode = 'Cheque';
            }
          })
        }
      })
  }

  fetchCustomers() {
    this.apiService.getData(`contacts/get/list/customer`)
      .subscribe((result: any) => {
        this.customers = result;
      })
  }

  deleteIncome(incomeID) {
    this.accountService.getData(`income/delete/${incomeID}`)
      .subscribe((result: any) => {
        this.fetchAccounts();
        this.toaster.success('Manual income deleted successfully.');
      })
  }

  fetchIncomeCategories() {
    this.accountService.getData(`income/categories/list`)
      .subscribe((result: any) => {
        this.categories = result;
      })
  }

}
