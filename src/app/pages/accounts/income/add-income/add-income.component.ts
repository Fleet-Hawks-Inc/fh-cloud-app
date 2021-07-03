import { Component, OnInit } from '@angular/core';
import { AccountService, ApiService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ListService } from 'src/app/services/list.service';
declare var $: any;

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.css']
})
export class AddIncomeComponent implements OnInit {

  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
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

  paymentMode = [
    {
      name: "Cash",
      value: "cash"
    },
    {
      name: "Cheque",
      value: "cheque"
    },
    {
      name: "EFT",
      value: "eft"
    },
    {
      name: "Credit Card",
      value: "creditCard"
    },
    {
      name: "Debit Card",
      value: "debitCard"
    },
    {
      name: "Demand Draft",
      value: "demandDraft"
    },
  ];
  
  invoices = [
    {
      invID: '1',
      invNo : '1001'
    },
    {
      invID: '2',
      invNo : '1002'
    },
    {
      invID: '3',
      invNo : '1003'
    }
  ];

  categories = [];
  incomeAccounts;
  depositAccounts;
  customers = [];
  paymentLabel = '';
  errors = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  submitDisabled = false;
  incomeID;
  categoryData = {
    categoryName:'',
    categoryDescription:''
  }

  constructor(private accountService: AccountService, private apiService: ApiService, private router: Router, private toaster: ToastrService, private route: ActivatedRoute, private listService: ListService) { }

  ngOnInit() {
    this.incomeID = this.route.snapshot.params['incomeID'];
    if(this.incomeID != undefined) {
      this.fetchIncomeByID();
    }
    this.listService.fetchChartAccounts();
    this.incomeAccounts = this.listService.accountsList;
    this.depositAccounts = this.listService.accountsList;
    this.fetchCustomers();
    this.fetchIncomeCategories();
  }

  fetchCustomers() {
    this.apiService.getData(`contacts/get/type/customer`)
      .subscribe((result: any) => {
        if (result[0] != undefined) {
          this.customers = result;
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

  addRecord() {
    this.submitDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    this.accountService.postData('income', this.incomeData).subscribe({
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
        this.toaster.success('Income transaction added successfully.');
        this.router.navigateByUrl('/accounts/income/list');
      },
    });
  }

  fetchIncomeByID() {
    this.accountService.getData(`income/detail/${this.incomeID}`)
      .subscribe((result: any) => {
        if (result[0] != undefined) {
          this.incomeData = result[0];
        }
      })
  }

  fetchIncomeCategories() {
    this.accountService.getData(`income/categories`)
      .subscribe((result: any) => {
        if (result[0] != undefined) {
          this.categories = result;
        }
      })
  }

  updateRecord() {
    this.submitDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    this.accountService.putData(`income/${this.incomeID}`, this.incomeData).subscribe({
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
        this.toaster.success('Income transaction updated successfully.');
        this.router.navigateByUrl('/accounts/income/list');
      },
    });
  }

  showAcModal() {
    $('#addAccountModal').modal('show');
  }

  showCategoryModal() {
    $('#addIncomeCategoryModal').modal('show');
  }

  addCategory() {
    this.submitDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    this.accountService.postData('income/category/add', this.categoryData).subscribe({
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
        this.fetchIncomeCategories();
        this.submitDisabled = false;
        this.response = res;
        $('#addIncomeCategoryModal').modal('hide');
        this.categoryData = {
          categoryName:'',
          categoryDescription:''
        }
        this.toaster.success('Income category added successfully.');
      },
    });
  }
}
