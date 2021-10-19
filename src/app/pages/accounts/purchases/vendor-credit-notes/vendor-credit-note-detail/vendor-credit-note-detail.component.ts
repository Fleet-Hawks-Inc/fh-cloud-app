import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService, ApiService } from 'src/app/services';

@Component({
  selector: 'app-vendor-credit-note-detail',
  templateUrl: './vendor-credit-note-detail.component.html',
  styleUrls: ['./vendor-credit-note-detail.component.css']
})
export class VendorCreditNoteDetailComponent implements OnInit {

  creditID: any;
  purOrder: string;
  currency: string;
  crRef: string;
  txnDate: string;
  vCrNo: string;
  vendorID: string;
  crDetails: any;
  remarks: string;
  totalAmt: any;
  status: string;

  vendors = [];

  constructor(public accountService: AccountService, public apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.creditID = this.route.snapshot.params[`creditID`];
    if (this.creditID) {
      this.fetchCredit();
    }
    this.fetchVendors();
  }

  fetchCredit() {
    this.accountService.getData(`vendor-credits/detail/${this.creditID}`).subscribe(res => {
      let result = res[0];
      this.purOrder = result.purOrder;
      this.currency = result.currency;
      this.crRef = result.crRef;
      this.txnDate = result.txnDate;
      this.vCrNo = result.vCrNo;
      this.vendorID = result.vendorID;
      this.crDetails = result.crDetails;
      this.remarks = result.remarks;
      this.status = result.status;
      this.totalAmt = result.totalAmt;
    });
  }

  fetchVendors() {
    this.apiService.getData(`contacts/get/list/vendor`)
      .subscribe((result: any) => {
        this.vendors = result;
      })
  }

}
