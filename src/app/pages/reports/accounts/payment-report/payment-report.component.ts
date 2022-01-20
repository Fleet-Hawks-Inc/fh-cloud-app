import { Component, OnInit } from '@angular/core';
import Constants from 'src/app/pages/fleet/constants';
import {AccountService} from 'src/app/services'

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.css']
})
export class PaymentReportComponent implements OnInit {

  constructor(private accountService:AccountService) { }

  allPayments=[]
  lastAdvanceSK=''
  dataMessage=''
  filter = {
    searchValue: null,
    startDate: null,
    endDate: null,
    type: null,
  };
  ngOnInit(): void {
    this.fetchAdvancePayments();
  }

async fetchAdvancePayments(refresh?: boolean){
  let searchParam=null;
  if (refresh==true){
    this.lastAdvanceSK="";
    this.allPayments=[]
  }
  if (this.lastAdvanceSK !== "end") {
    if (this.filter.searchValue !== null && this.filter.searchValue !== "") {
      searchParam = this.filter.searchValue === 'paymentNo' ? encodeURIComponent(`"${this.filter.searchValue}"`) : `${this.filter.searchValue}`;
    } else {
      searchParam = null;
    }
    const result=await this.accountService.getData(`advance/report/paging?type=${this.filter.type}&searchValue=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastAdvanceSK}`).toPromise();
    if(result && result.length===0){
      this.dataMessage= Constants.NO_RECORDS_FOUND
    }
    if(result && result.length>0){
      if (result[result.length - 1].sk !== undefined) {
        this.lastAdvanceSK = encodeURIComponent(
          result[result.length - 1].sk
        );
      } else {
        this.lastAdvanceSK = "end";
      }
      this.allPayments=this.allPayments.concat(result)
    }
  }
  console.log(this.allPayments)
}
  onScroll(){

  }
}
