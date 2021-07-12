import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';
import { ListService } from 'src/app/services/list.service';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
import * as moment from "moment";
declare var $: any;

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {

  expenseData = {
    categoryID: null,
    expAccountID: null,
    paidAccountID: null,
    amount: null,
    finalTotal: null,
    currency: null,
    recurring: {
      status: false,
      endDate: null,
      interval: null,
    },
    txnDate: moment().format('YYYY-MM-DD'),
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
      gstPercent: null,
      gstAmount: null,
      includePST: true,
      pstPercent: null,
      pstAmount: null,
      includeHST: true,
      hstpercent: null,
      hstAmount: null
    },
    customerID: null,
    invoiceID: null,
    documents: [],
    notes: ''
  };

  expenseCategories = [];
  recInterval = [
    {
      value:'weekly',
      name:'Weekly'
    },
    {
      value:'biWeekly',
      name:'Biweekly'
    },
    {
      value:'monthly',
      name:'Monthly'
    },
    {
      value:'yearly',
      name:'Yearly'
    },
  ];
  expenseAccounts;
  paidThroughAccounts;
  customers;
  vehicles;
  assets;
  vendors;
  countries = [];
  states = [];
  cities = [];
  stateTaxes = [];
  invoices = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  submitDisabled = false;
  errors = {};
  response: any = '';
  uploadedDocs = [];
  existingDocs = [];
  documentSlides = [];
  Asseturl = this.apiService.AssetUrl;
  carrierID = '';
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');
  expenseID;
  categoryData = {
    catName: '',
    catDesc: ''
  };

  constructor(private listService: ListService, private apiService: ApiService, private accountService: AccountService, private router: Router, private toaster: ToastrService, private domSanitizer: DomSanitizer, private route: ActivatedRoute) { }

  ngOnInit() {
    this.expenseID = this.route.snapshot.params['expenseID'];
    if(this.expenseID != undefined) {
      this.fetchExpenseByID();
    }
    this.fetchCountries();
    this.fetchExpenseCategories();
    this.fetchStateTaxes();
    this.fetchInvoices();
    this.listService.fetchChartAccounts();
    this.listService.fetchCustomers();
    this.listService.fetchAssets();
    this.listService.fetchVehicles();
    this.listService.fetchVendors();
    this.expenseAccounts = this.listService.accountsList;
    this.paidThroughAccounts = this.listService.accountsList;
    this.customers = this.listService.customersList;
    this.vehicles = this.listService.vehicleList;
    this.assets = this.listService.assetsList;
    this.vendors = this.listService.vendorList;
  }

  resetUnitVal() {
    this.expenseData.unitID = null;
  }

  fetchCountries() {
    this.countries = CountryStateCity.GetAllCountries();
  }

  getStates(countryCode) {
    this.states = CountryStateCity.GetStatesByCountryCode([countryCode]);
    this.expenseData.countryName = CountryStateCity.GetSpecificCountryNameByCode(countryCode);
  }

  getCities(countryCode='', stateCode) {
    this.cities = CountryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
    this.expenseData.stateName = CountryStateCity.GetStateNameFromCode(stateCode, countryCode);

    if(stateCode != undefined && stateCode != null) {
      let selected:any = this.stateTaxes.filter(o => o.stateCode == stateCode);
      this.expenseData.taxes.gstPercent = selected[0].GST;
      this.expenseData.taxes.pstPercent = selected[0].PST;
      this.expenseData.taxes.hstpercent = selected[0].HST;

      this.calculateFinalTotal();
    }
  }

  fetchStateTaxes() {
    this.apiService.getData('stateTaxes').subscribe((res: any) => {
      this.stateTaxes = res.Items;
    });
  }

  fetchInvoices() {
    this.accountService.getData('invoices').subscribe((res: any) => {
      this.invoices = res;
    });
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

    this.expenseData.amount = parseFloat(this.expenseData.amount);
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for (let i = 0; i < this.uploadedDocs.length; i++) {
      formData.append('uploadedDocs', this.uploadedDocs[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.expenseData));

    this.accountService.postData('expense', formData, true).subscribe({
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
        this.toaster.success('Expense transaction added successfully.');
        this.router.navigateByUrl('/accounts/expense/list');
      },
    });
  }

  fetchExpenseByID() {
    this.accountService.getData(`expense/detail/${this.expenseID}`)
      .subscribe((result: any) => {
        if (result[0] != undefined) {
          this.expenseData = result[0];
          this.existingDocs = result[0].documents;
          this.carrierID = result[0].carrierID;
          this.states = CountryStateCity.GetStatesByCountryCode([result[0].countryCode]);
          this.cities = CountryStateCity.GetCitiesByStateCodes(result[0].countryCode, result[0].stateCode);

          if (result[0].documents != undefined && result[0].documents.length > 0) {
            result[0].documents.map((x) => {
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

  updateRecord() {
    this.submitDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false; 
    this.expenseData.amount = parseFloat(this.expenseData.amount);

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for (let i = 0; i < this.uploadedDocs.length; i++) {
      formData.append('uploadedDocs', this.uploadedDocs[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.expenseData));

    this.accountService.putData(`expense/${this.expenseID}`, formData, true).subscribe({
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
        this.toaster.success('Expense transaction updated successfully.');
        this.router.navigateByUrl('/accounts/expense/list');
      },
    });
  }

  addCategory() {
    this.submitDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    this.accountService.postData('expense/category/add', this.categoryData).subscribe({
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
        this.fetchExpenseCategories();
        this.submitDisabled = false;
        this.response = res;
        $('#addExpenseTypeModal').modal('hide');
        this.categoryData = {
          catName:'',
          catDesc:''
        }
        this.toaster.success('Expense type added successfully.');
      },
    });
  }

  fetchExpenseCategories() {
    this.accountService.getData(`expense/categories`)
      .subscribe((result: any) => {
        if (result[0] != undefined) {
          this.expenseCategories = result;
        }
      })
  }

  deleteDocument(name: string, index: number) {
    this.accountService.deleteData(`expense/uploadDelete/${this.expenseID}/${name}`).subscribe((result: any) => {
      this.existingDocs.splice(index, 1);
      this.documentSlides.splice(index, 1);
      this.toaster.success('Attachment deleted successfully.');
    }); 
  }

  calculateFinalTotal() {
    this.expenseData.finalTotal = +this.expenseData.amount;
    if(this.expenseData.taxes.gstPercent != null && this.expenseData.taxes.includeGST) {
      this.expenseData.taxes.gstAmount = (this.expenseData.amount*this.expenseData.taxes.gstPercent)/100;
      this.expenseData.finalTotal += +this.expenseData.taxes.gstAmount;
    }
    if(this.expenseData.taxes.hstpercent != null && this.expenseData.taxes.includeHST) {
      this.expenseData.taxes.hstAmount = (this.expenseData.amount*this.expenseData.taxes.hstpercent)/100;
      this.expenseData.finalTotal += +this.expenseData.taxes.hstAmount;
    }
    if(this.expenseData.taxes.pstPercent != null && this.expenseData.taxes.includePST) {
      this.expenseData.taxes.pstAmount = (this.expenseData.amount*this.expenseData.taxes.pstPercent)/100;
      this.expenseData.finalTotal += +this.expenseData.taxes.pstAmount;
    }
  }

  changeDepAcc(val) {
    if(val === this.expenseData.paidAccountID) {
      this.expenseData.paidAccountID = null;
    }
  }
}
