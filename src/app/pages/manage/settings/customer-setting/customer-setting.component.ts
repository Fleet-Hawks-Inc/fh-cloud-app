import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-setting',
  templateUrl: './customer-setting.component.html',
  styleUrls: ['./customer-setting.component.css']
})
export class CustomerSettingComponent implements OnInit {
  
    dataMessage: string;
    company: any = null;
    type: any = null;
    lastItemSK = "";
    contactID = '';
    cName = '';
    loaded: boolean = false;
    customers = [];
    addressBookList: any = [];

  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
  this.initDataTable()
  }

  initDataTable() {
    if( this.lastItemSK !== 'end'){
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
                this.customers =this.customers.concat(result.Items);
                this.loaded = true;
        }
        
      })
    }
}

  
  searchFilter() {
      if(this.company !== null || this.type !== null){
        this.dataMessage = Constants.FETCHING_DATA;
        this.customers = [];
        this.lastItemSK = '';
        this.initDataTable();
      }else{
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
    if (this.company !== null || this.type !== null) {
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
  
  restoreCustomer(eventData){
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