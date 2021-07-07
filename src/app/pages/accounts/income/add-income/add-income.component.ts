import { Component, OnInit } from '@angular/core';
import { AccountService, ApiService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ListService } from 'src/app/services/list.service';
import { DomSanitizer } from '@angular/platform-browser';
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
    description: '',
    attachments: []
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
  
  invoices = [];

  categories = [];
  incomeAccounts;
  depositAccounts;
  customers;
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
  };
  uploadedDocs = [];
  existingDocs = [];
  documentSlides = [];
  Asseturl = this.apiService.AssetUrl;
  carrierID = '';
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');

  constructor(private accountService: AccountService, private apiService: ApiService, private router: Router, private toaster: ToastrService, private route: ActivatedRoute, private listService: ListService, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.incomeID = this.route.snapshot.params['incomeID'];
    if(this.incomeID != undefined) {
      this.fetchIncomeByID();
    }
    this.listService.fetchChartAccounts();
    this.listService.fetchCustomers();
    this.incomeAccounts = this.listService.accountsList;
    this.depositAccounts = this.listService.accountsList;
    this.customers = this.listService.customersList;
    this.fetchIncomeCategories();
    this.fetchInvoices();
  }

  showPaymentFields(type) {
    if(type === 'creditCard') {
      this.paymentLabel = 'Credit Card';
    } else if(type === 'debitCard') {
      this.paymentLabel = 'Debit Card';
    } else if(type === 'demandDraft') {
      this.paymentLabel = 'Demand Draft';
    } else if(type === 'eft') {
      this.paymentLabel = 'EFT';
    } else if(type === 'cash') {
      this.paymentLabel = 'Cash';
    } else if(type === 'cheque') {
      this.paymentLabel = 'Cheque';
    }
    this.incomeData.paymentModeNo = '';
    this.incomeData.paymentModeDate = null;
  }

  /*
    * Selecting files before uploading
    */
  selectDocuments(event) {
    let files = [...event.target.files];
    
    for (let i = 0; i < files.length; i++) {
      this.uploadedDocs.push(files[i])
    }
  }

  addRecord() {
    this.submitDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false; 

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for (let i = 0; i < this.uploadedDocs.length; i++) {
      formData.append('uploadedDocs', this.uploadedDocs[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.incomeData));

    this.accountService.postData('income', formData, true).subscribe({
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
          this.existingDocs = result[0].attachments;
          this.carrierID = result[0].carrierID;

          if (result[0].attachments != undefined && result[0].attachments.length > 0) {
            result[0].attachments.map((x) => {
              let obj = {
                name: x,
                path: `${this.Asseturl}/${this.carrierID}/${x}`
              }
              this.documentSlides.push(obj);
            })
          }
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
    this.incomeData.attachments = this.existingDocs;

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for (let i = 0; i < this.uploadedDocs.length; i++) {
      formData.append('uploadedDocs', this.uploadedDocs[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.incomeData));

    this.accountService.putData(`income/${this.incomeID}`, formData, true).subscribe({
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

  deleteDocument(name: string, index: number) {
    this.accountService.deleteData(`income/uploadDelete/${this.incomeID}/${name}`).subscribe((result: any) => {
      this.existingDocs.splice(index, 1);
      this.documentSlides.splice(index, 1);
      this.toaster.success('Attachment deleted successfully.');
    }); 
  }

  changeDepAcc(val) {
    if(val === this.incomeData.depositAccID) {
      this.incomeData.depositAccID = null;
    }
  }

  fetchInvoices() {
    this.accountService.getData('invoices').subscribe((res: any) => {
      this.invoices = res;
    });
  }
}
