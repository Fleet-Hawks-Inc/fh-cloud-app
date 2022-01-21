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
  lastDriverSK=''
  lastEmployeeSK=''
  lastExpenceSK=''
  dataMessage=Constants.FETCHING_DATA
  filter = {
    startDate: null,
    endDate: null,
    type: null,
    mode:null
  };
paymentType=[
    {name:"Employee Payment",type:"epp"},
    {name:"Expense Payment",type:"exp"},
    {name:"Advance Payment",type:"advp"},
    {name:"Driver Payment",type:"drvp"}
  ]
  paymentMode=[
    {name:"Cash",type:"cash"},
    {name:"Cheque",type:"cheque"},
    {name:"Credit Card",type:"credit_card"}
  ]

  ngOnInit(): void {
    this.init();
  }

async init(){
  this.allPayments=[]
  await this.fetchAdvancePayments();
  await this.fetchDriverPayments();
  await this.fetchEmployeePayments();
  await this.fetchExpencePayments();
}

async fetchAdvancePayments(refresh?: boolean){
  let searchParam=null;
  if (refresh==true){
    this.lastAdvanceSK="";
  }
  if (this.lastAdvanceSK !== "end") {
    const result=await this.accountService.getData(`advance/report/paging?searchValue=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastAdvanceSK}`).toPromise();
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
}
async fetchDriverPayments(refresh?: boolean){
  let searchParam=null;
  if (refresh==true){
    this.lastDriverSK="";
  }
  if (this.lastAdvanceSK !== "end") {
    const result=await this.accountService
    .getData(
      `driver-payments/report/paging?searchValue=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastDriverSK}`
    ).toPromise();
    if(result && result.length===0){
      this.dataMessage= Constants.NO_RECORDS_FOUND
    }
    if(result && result.length>0){
      if (result[result.length - 1].sk !== undefined) {
        this.lastDriverSK = encodeURIComponent(
          result[result.length - 1].sk
        );
      } else {
        this.lastDriverSK = "end";
      }
      this.allPayments=this.allPayments.concat(result)
    }
  }
}
async fetchEmployeePayments(refresh?: boolean){
  let searchParam=null;
  if (refresh==true){
    this.lastEmployeeSK="";
  }
  if (this.lastEmployeeSK !== "end") {
    
    const result=await this.accountService
    .getData(
      `employee-payments/report/paging?paymentNo=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastEmployeeSK}`
    ).toPromise();
    if(result && result.length===0){
      this.dataMessage= Constants.NO_RECORDS_FOUND
    }
    if(result && result.length>0){
      if (result[result.length - 1].sk !== undefined) {
        this.lastEmployeeSK = encodeURIComponent(
          result[result.length - 1].sk
        );
      } else {
        this.lastEmployeeSK = "end";
      }
      this.allPayments=this.allPayments.concat(result)
    }
  }
}

async fetchExpencePayments(refresh?: boolean){
  let searchParam=null;
  if (refresh==true){
    this.lastExpenceSK="";
  }
  if (this.lastExpenceSK !== "end") {
    const result: any = await this.accountService
        .getData(
          `expense-payments/report/paging?searchValue=${searchParam}&start=${this.filter.startDate}&end=${this.filter.endDate}&lastKey=${this.lastExpenceSK}`
        )
        .toPromise();
    if(result && result.length===0){
      this.dataMessage= Constants.NO_RECORDS_FOUND
    }
    if(result && result.length>0){
      if (result[result.length - 1].sk !== undefined) {
        this.lastExpenceSK = encodeURIComponent(
          result[result.length - 1].sk
        );
      } else {
        this.lastExpenceSK = "end";
      }
      this.allPayments=this.allPayments.concat(result)
    }
  }
}

searchFilter(){
  this.allPayments=[]
  if(this.filter.type){
  switch(this.filter.type){
    case "epp":{
      this.lastEmployeeSK=''
      this.fetchEmployeePayments();
      break;
    }
    case "exp":{
      this.lastExpenceSK=''
      this.fetchExpencePayments();
      break;
    }
    case "advp":{
      this.lastAdvanceSK=''
      this.fetchAdvancePayments()
      break;
    }
    case "drvp":{
      this.lastDriverSK=''
      this.fetchDriverPayments();
      break;
    }
  }
}
}
resetFilter(){
  this.init();
}


  onScroll(){

  }
}
