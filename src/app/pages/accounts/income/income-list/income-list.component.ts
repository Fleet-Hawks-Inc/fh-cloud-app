import { Component, OnInit } from '@angular/core';
import { AccountService, ApiService } from 'src/app/services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import  Constants  from '../../../fleet/constants';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.css']
})
export class IncomeListComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
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
          if(result.length == 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
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
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchAccounts();
        this.toaster.success('Income transaction deleted successfully.');
      })
  }

  fetchIncomeCategories() {
    this.accountService.getData(`income/categories/list`)
      .subscribe((result: any) => {
        this.categories = result;
      })
  }

}
