import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService, ListService } from 'src/app/services';

@Component({
  selector: 'app-employee-payment-list',
  templateUrl: './employee-payment-list.component.html',
  styleUrls: ['./employee-payment-list.component.css']
})
export class EmployeePaymentListComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  employees = [];
  payments = [];
  filter = {
    startDate: null,
    endDate: null,
    amount: ''
  }
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  lastItemSK = '';
  constructor(private listService: ListService, private route: ActivatedRoute, private router: Router, private toaster: ToastrService, private accountService: AccountService, private apiService: ApiService) { }

  ngOnInit() {
    this.fetchEmployees();
    this.fetchPayments();
  }

  fetchEmployees() {
    this.apiService.getData(`contacts/get/list/employee`).subscribe((result: any) => {
      this.employees = result;
    })
  }

  fetchPayments() {
    if (this.lastItemSK !== 'end') {
      this.accountService.getData(`employee-payments/paging?amount=${this.filter.amount}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}`).subscribe((result: any) => {
        if(result.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        if(result.length > 0) {
          if (result[result.length - 1].sk !== undefined) {
            this.lastItemSK = encodeURIComponent(result[result.length - 1].sk);
          } else {
            this.lastItemSK = 'end';
          }
  
          result.map((v) => {
            v.payMode = v.payMode.replace("_", " ");
            this.payments.push(v);
          })
        }
        
      })
    }
  }

  searchFilter() {
    if (this.filter.amount !== '' || this.filter.endDate !== null || this.filter.startDate !== null) {
      if (
        this.filter.startDate != "" &&
        this.filter.endDate == ""
      ) {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (
        this.filter.startDate == "" &&
        this.filter.endDate != ""
      ) {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toaster.error("Start date should be less then end date");
        return false;
      } else {
        this.dataMessage = Constants.FETCHING_DATA;
        this.payments = [];
        this.lastItemSK = '';
        this.fetchPayments();
      }
    }
  }

  resetFilter() {
      this.dataMessage = Constants.FETCHING_DATA;
      this.filter = {
          startDate: null,
          endDate: null,
          amount: ''
      }
      this.payments = [];
      this.lastItemSK = '';
      this.fetchPayments();
  }

  onScroll() {
    this.fetchPayments(); 
  }
}
