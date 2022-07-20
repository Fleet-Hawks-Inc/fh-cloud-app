import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services';
import Constants from '../../../constants';

@Component({
  selector: 'app-deleted-customer',
  templateUrl: './deleted-customer.component.html',
  styleUrls: ['./deleted-customer.component.css']
})
export class DeletedCustomerComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  company: any = null;
  type: any = null;
  lastItemSK = "";
  contactID = '';
  cName = '';
  loaded: boolean = false;
  customers = [];
  addressBookList: any = [];
  array = [];
  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initDataTable()
  }


  initDataTable() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`contacts/deleted/fetch/records?company=${this.company}&type=${this.type}&lastKey=${this.lastItemSK}`)
        .subscribe((result: any) => {

          if (result.Items.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          if (result.Items.length > 0) {
            if (result.LastEvaluatedKey !== undefined) {
              this.lastItemSK = encodeURIComponent(result.LastEvaluatedKey.contactSK);
            }
            else {
              this.lastItemSK = 'end'
            }

            for (var i = 0; i < result.Items.length; i++) {
              if (result.Items[i].eTypes.includes('fc')) {
                var index = result.Items[i].eTypes.indexOf('fc');
                if (index !== -1) {
                  result.Items[i].eTypes[index] = 'Factoring Company';
                }
              }
              if (result.Items[i].eTypes.includes('owner_operator')) {
                var index = result.Items[i].eTypes.indexOf('owner_operator');
                if (index !== -1) {
                  result.Items[i].eTypes[index] = 'Owner Operator';
                }
              }
            }
            this.customers = this.customers.concat(result.Items);
            this.loaded = true;
          }

        })
    }
  }
  searchFilter() {
    if (this.company !== null || this.type !== null) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.customers = [];
      this.lastItemSK = '';
      this.initDataTable();
    } else {
      return false
    }
  }

  onScroll() {
    if (this.loaded) {
      this.initDataTable();
    }
    this.loaded = false;
  }

  resetFilter() {
    if (this.company !== null || this.type !== null || this.lastItemSK !== '') {
      this.company = null;
      this.type = null;
      this.lastItemSK = '';
      this.dataMessage = Constants.FETCHING_DATA;
      this.customers = [];
      this.initDataTable();
    }
    else {
      return false;
    }
  }

  restoreCustomer(eventData) {
    if (confirm('Are you sure you want to restore?') === true) {
      this.apiService.deleteData(`contacts/restore/customer/${eventData.contactID}/${eventData.cName}`).subscribe((result: any) => {
        this.customers = [];
        this.lastItemSK = "";
        this.dataMessage = Constants.FETCHING_DATA;
        this.initDataTable();
        this.toastr.success('Customer is restored!');
      });
    }
  }
}
