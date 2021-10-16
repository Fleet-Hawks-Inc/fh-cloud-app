import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService, ListService } from 'src/app/services';

import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-add-vendor-credit-note',
  templateUrl: './add-vendor-credit-note.component.html',
  styleUrls: ['./add-vendor-credit-note.component.css']
})
export class AddVendorCreditNoteComponent implements OnInit {

  creditData: any = {
    vCrDate: moment().format('YYYY-MM-DD'),
    currency: null,
    crRef: '',
    purOrder: '',
    vendorID: null,
    crDetails: [{
      commodity: '',
      qty: 0,
      qtyUnit: null,
      rate: 0,
      rateUnit: null,
      amount: 0,
      accountID: null,
    }],
    remarks: '',
  }

  accounts: any = [];
  vendors: any = [];

  errors = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  pageTitle = 'Add';

  notesID: any;
  units = [];

  constructor(private listService: ListService, private route: ActivatedRoute, private toaster: ToastrService, private location: Location,
    private accountService: AccountService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.notesID = this.route.snapshot.params[`invID`];
    if (this.notesID) {
      this.pageTitle = 'Edit';
      // await this.fetchInvoice();
    } else {
      this.pageTitle = 'Add';
    }

    this.fetchAccounts();
    this.fetchQuantityUnits();
    this.listService.fetchVendors();
    this.vendors = this.listService.vendorList;
  }

  fetchQuantityUnits() {
    this.httpClient
      .get("assets/jsonFiles/quantityUnits.json")
      .subscribe((data: any) => {
        this.units = data;
      });
  }


  fetchAccounts() {
    this.accountService.getData(`chartAc/fetch/list`).subscribe((res: any) => {
      this.accounts = res;
    });
  }

  addDetails() {
    this.creditData.crDetails.push({
      commodity: '',
      qty: 0,
      qtyUnit: '',
      rate: 0,
      rateUnit: '',
      amount: 0,
      accountID: null,
    });
  }

  deleteDetail(d: number) {
    this.creditData.crDetails.splice(d, 1);
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  addNotes() {
    console.log("data", this.creditData)

    this.accountService.postData(`vendor-credits`, this.creditData).subscribe({
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
              //this.submitDisabled = false;
              // this.throwErrors();
            },
            error: () => {
              // this.submitDisabled = false;
            },
            next: () => {
            },
          });
      },
      next: (res) => {
        // this.submitDisabled = false;
        this.response = res;
        this.toaster.success('Invoice Added Successfully.');
        this.cancel();
      },
    });
  }

}
