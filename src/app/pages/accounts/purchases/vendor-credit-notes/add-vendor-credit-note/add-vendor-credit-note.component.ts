import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AccountService, ListService } from 'src/app/services';

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

  constructor(private listService: ListService,
    private accountService: AccountService) { }

  ngOnInit() {
    this.fetchAccounts();
    this.listService.fetchVendors();
    this.vendors = this.listService.vendorList;
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

}
