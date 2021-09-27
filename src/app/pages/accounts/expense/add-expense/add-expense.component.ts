import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';
import { ListService } from 'src/app/services/list.service';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';
declare var $: any;

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {
  pageTitle = 'Add Other Expense';
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
    tripID: null,
    stlStatus: null,
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
      hstAmount: null,
    },
    taxAmount: 0,
    customerID: null,
    invoiceID: null,
    documents: [],
    notes: '',
    transactionLog: [],
  };

  expenseCategories = [];
  recInterval = [
    {
      value: 'weekly',
      name: 'Weekly'
    },
    {
      value: 'biWeekly',
      name: 'Biweekly'
    },
    {
      value: 'monthly',
      name: 'Monthly'
    },
    {
      value: 'yearly',
      name: 'Yearly'
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
  Error = '';
  Success = '';
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
  catDisabled = false;
  trips: any = [];
  constructor(private listService: ListService,
    private location: Location, private apiService: ApiService, private accountService: AccountService, private router: Router,
    private toaster: ToastrService,
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private countryStateCity: CountryStateCityService) { }

  async ngOnInit() {
    this.expenseID = this.route.snapshot.params[`expenseID`];
    if (this.expenseID != undefined) {
      await this.fetchExpenseByID();
      this.pageTitle = 'Edit Other Expense';
    }
    this.fetchTrips();
    await this.fetchCountries();
    this.fetchExpenseCategories();
    this.fetchStateTaxes();
    //  this.fetchInvoices();
    this.listService.fetchChartAccounts();
    this.listService.fetchAssets();
    this.listService.fetchVehicles();
    this.listService.fetchVendors();
    this.expenseAccounts = this.listService.accountsList;
    this.paidThroughAccounts = this.listService.accountsList;

    let vehicleList = new Array<any>();
    this.getValidVehicles(vehicleList);
    this.vehicles = vehicleList;

    let assetList = new Array<any>();
    this.getValidAssets(assetList);
    this.assets = assetList;

    let vendorList = new Array<any>();
    this.getValidvendors(vendorList);
    this.vendors = vendorList;
  }

  private getValidVehicles(vehicleList: any[]) {
    let ids = [];
    this.listService.vehicleList.forEach((element) => {
      element.forEach((element2) => {
        if (
          element2.vehicleIdentification &&
          element2.isDeleted === 1 &&
          element2.vehicleID === this.expenseData.unitID
        ) {
          this.expenseData.unitID = null;
        }
        if (
          element2.vehicleIdentification &&
          element2.isDeleted === 0 &&
          !ids.includes(element2.vehicleID)
        ) {
          vehicleList.push(element2);
          ids.push(element2.vehicleID);
        }
      });
    });
  }

  private getValidAssets(assetList: any[]) {
    let ids = [];
    this.listService.assetsList.forEach((element) => {
      element.forEach((element2) => {
        if (
          element2.isDeleted === 1 &&
          element2.assetID === this.expenseData.unitID
        ) {
          this.expenseData.unitID = null;
        }
        if (
          element2.isDeleted === 0 &&
          !ids.includes(element2.assetID)
        ) {
          assetList.push(element2);
          ids.push(element2.assetID);
        }
      });
    })
  }

  private getValidvendors(vendorList: any[]) {
    let ids = [];
    this.listService.vendorList.forEach((element) => {
      element.forEach((element2) => {
        if (
          element2.isDeleted === 1 &&
          element2.contactID === this.expenseData.vendorID
        ) {
          this.expenseData.vendorID = null;
        }
        if (
          element2.isDeleted === 0 &&
          !ids.includes(element2.contactID)
        ) {
          vendorList.push(element2);
          ids.push(element2.contactID);
        }
      });
    })
  }

  resetUnitVal() {
    this.expenseData.unitID = null;
  }
  refreshExpenseAccount() {
    this.listService.fetchChartAccounts();
  }
  refreshPaidAccount() {
    this.listService.fetchChartAccounts();
  }
  async fetchCountries() {
    this.countries = await this.countryStateCity.GetAllCountries();
  }

  async getStates(countryCode) {
    this.states = await this.countryStateCity.GetStatesByCountryCode([countryCode]);
    this.expenseData.countryName = await this.countryStateCity.GetSpecificCountryNameByCode(countryCode);
  }

  async getCities(countryCode = '', stateCode) {
    this.cities = await this.countryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
    this.expenseData.stateName = await this.countryStateCity.GetStateNameFromCode(stateCode, countryCode);

    if (stateCode !== undefined && stateCode != null) {
      let selected: any = this.stateTaxes.filter(o => o.stateCode === stateCode);
      this.expenseData.taxes.gstPercent = selected[0].GST;
      this.expenseData.taxes.pstPercent = selected[0].PST;
      this.expenseData.taxes.hstpercent = selected[0].HST;

      this.calculateFinalTotal();
    }
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  fetchTrips() {
    this.apiService.getData('trips').subscribe((result: any) => {
      // this.trips = result.Items;
      result.Items.forEach((element) => {
        if(element.isDeleted === 0) {
          this.trips.push(element);
        }
        if(element.isDeleted === 1 && element.tripID === this.expenseData.tripID) {
          this.expenseData.tripID = null;
        }
      });
    });
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
    this.expenseData.stlStatus = this.expenseData.tripID;
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
        this.cancel();
      },
    });
  }

  async fetchExpenseByID() {
    let result:any = await this.accountService.getData(`expense/detail/${this.expenseID}`).toPromise();
    if (result[0] != undefined) {
      this.expenseData = result[0];

      this.expenseData.transactionLog = result[0].transactionLog;
      this.expenseData.taxAmount = result[0].taxAmount;
      this.existingDocs = result[0].documents;
      this.carrierID = result[0].carrierID;
      this.states = await this.countryStateCity.GetStatesByCountryCode([result[0].countryCode]);
      this.cities = await this.countryStateCity.GetCitiesByStateCodes(result[0].countryCode, result[0].stateCode);

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
    this.expenseData.stlStatus = this.expenseData.tripID;
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
        this.cancel();
      },
    });
  }

  addCategory() {
    this.catDisabled = true;
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
              this.catDisabled = false;
              // this.throwErrors();
            },
            error: () => {
              this.catDisabled = false;
            },
            next: () => {
            },
          });
      },
      next: (res) => {
        this.fetchExpenseCategories();
        this.catDisabled = false;
        this.response = res;
        $('#addExpenseTypeModal').modal('hide');
        this.categoryData = {
          catName: '',
          catDesc: ''
        };
        this.toaster.success('Expense type added successfully.');
      },
    });
  }

  fetchExpenseCategories() {
    this.accountService.getData(`expense/categories`)
      .subscribe((result: any) => {
        if (result[0] !== undefined) {
          this.expenseCategories = result;
        }
      });
  }

  refreshCategory() {
    this.fetchExpenseCategories();
  }
  deleteDocument(name: string, index: number) {
    this.accountService.deleteData(`expense/uploadDelete/${this.expenseID}/${name}`).subscribe((result: any) => {
      this.existingDocs.splice(index, 1);
      this.documentSlides.splice(index, 1);
      this.toaster.success('Attachment deleted successfully.');
    });
  }

  calculateFinalTotal() {
    this.expenseData.taxAmount = 0;
    this.expenseData.finalTotal = +this.expenseData.amount;
    if (this.expenseData.taxes.gstPercent != null && this.expenseData.taxes.includeGST) {
      this.expenseData.taxes.gstAmount = (this.expenseData.amount * this.expenseData.taxes.gstPercent) / 100;
      this.expenseData.taxAmount += this.expenseData.taxes.gstAmount;
      this.expenseData.finalTotal += +this.expenseData.taxes.gstAmount;
    }
    if (this.expenseData.taxes.hstpercent != null && this.expenseData.taxes.includeHST) {
      this.expenseData.taxes.hstAmount = (this.expenseData.amount * this.expenseData.taxes.hstpercent) / 100;
      this.expenseData.finalTotal += +this.expenseData.taxes.hstAmount;
      this.expenseData.taxAmount += this.expenseData.taxes.hstAmount;
    }
    if (this.expenseData.taxes.pstPercent != null && this.expenseData.taxes.includePST) {
      this.expenseData.taxes.pstAmount = (this.expenseData.amount * this.expenseData.taxes.pstPercent) / 100;
      this.expenseData.finalTotal += +this.expenseData.taxes.pstAmount;
      this.expenseData.taxAmount += this.expenseData.taxes.pstAmount;
    }
    this.expenseData.taxAmount = +this.expenseData.taxAmount.toFixed(2);
    this.expenseData.finalTotal = this.expenseData.finalTotal.toFixed(2);
  }

  changeDepAcc(val) {
    if (val === this.expenseData.paidAccountID) {
      this.expenseData.paidAccountID = null;
    }
  }
  refreshVendorData() {
    this.listService.fetchVendors();
  }
  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem('isOpen', 'true');
    this.listService.changeButton(false);
  }
}
