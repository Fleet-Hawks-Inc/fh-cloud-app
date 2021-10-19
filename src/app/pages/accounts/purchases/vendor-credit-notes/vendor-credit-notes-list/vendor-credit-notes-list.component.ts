import { Component, OnInit } from '@angular/core';
import { AccountService, ApiService } from 'src/app/services';

@Component({
  selector: 'app-vendor-credit-notes-list',
  templateUrl: './vendor-credit-notes-list.component.html',
  styleUrls: ['./vendor-credit-notes-list.component.css']
})
export class VendorCreditNotesListComponent implements OnInit {
  allCredits = [];
  vendors = [];

  filterData = {
    vendorID: null,
    startDate: '',
    endDate: '',
    lastItemSK: ''
  }

  constructor(private accountService: AccountService, private apiService: ApiService) { }

  ngOnInit() {
    this.getCredits();
    this.fetchVendors();
    this.getInvoices();
  }

  getCredits() {
    this.accountService.getData(`vendor-credits`).subscribe(res => {
      this.allCredits = res;
    });
  }



  fetchVendors() {
    this.apiService.getData(`contacts/get/list/vendor`)
      .subscribe((result: any) => {
        this.vendors = result;
      })
  }

  deleteCredit(creditID: string) {
    if (confirm('Are you sure you want to void?') === true) {
      this.accountService.deleteData(`vendor-credits/delete/${creditID}`).subscribe(res => {
        if (res) {
          this.getCredits();
        }
      });
    }

  }

  async getInvoices(refresh?: boolean) {
    this.accountService.getData(`vendor-credits/paging?vendor=${this.filterData.vendorID}&startDate=${this.filterData.startDate}&endDate=${this.filterData.endDate}&lastKey=${''}`)
      .subscribe(async (result: any) => {

      });
  }

}
