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
  driverLoaded=false;
  employeeLoaded=false;
  expenseLoaded=false;
  advanceLoaded=false;


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
  if (refresh==true){
    this.lastAdvanceSK="";
  }
  if (this.lastAdvanceSK !== "end") {
    const result=await this.accountService.getData(`advance/report/paging?&startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&lastKey=${this.lastAdvanceSK}`).toPromise();
    if(result && result.length===0){
      this.dataMessage= Constants.NO_RECORDS_FOUND
    }
    if(result && result.length>0){
      if (result[result.length - 1].sk !== undefined) {
        this.lastAdvanceSK = encodeURIComponent(
          result[result.length - 1].sk
        );
        this.advanceLoaded=true
      } else {
        this.lastAdvanceSK = "end";
      }
      this.allPayments=this.allPayments.concat(result)
      
    }
  }
}
async fetchDriverPayments(refresh?: boolean){
  if (refresh==true){
    this.lastDriverSK="";
  }
  if (this.lastAdvanceSK !== "end") {
    const result=await this.accountService
    .getData(
      `driver-payments/report/paging?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&lastKey=${this.lastDriverSK}`
    ).toPromise();
    if(result && result.length===0){
      this.dataMessage= Constants.NO_RECORDS_FOUND
    }
    if(result && result.length>0){
      if (result[result.length - 1].sk !== undefined) {
        this.lastDriverSK = encodeURIComponent(
          result[result.length - 1].sk
        );
        this.driverLoaded=true;
      } else {
        this.lastDriverSK = "end";
      }
      this.allPayments=this.allPayments.concat(result)
      
    }
  }
}
async fetchEmployeePayments(refresh?: boolean){
  if (refresh==true){
    this.lastEmployeeSK="";
  }
  if (this.lastEmployeeSK !== "end") {
    
    const result=await this.accountService
    .getData(
      `employee-payments/report/paging?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&lastKey=${this.lastEmployeeSK}`
    ).toPromise();
    if(result && result.length===0){
      this.dataMessage= Constants.NO_RECORDS_FOUND
    }
    if(result && result.length>0){
      
      if (result[result.length - 1].sk !== undefined) {
        this.lastEmployeeSK = encodeURIComponent(
          result[result.length - 1].sk
        );
        this.employeeLoaded=true;
      } else {
        this.lastEmployeeSK = "end";
      }
      this.allPayments=this.allPayments.concat(result)
      
    }
  }
}

async fetchExpencePayments(refresh?: boolean){
  if (refresh==true){
    this.lastExpenceSK="";
  }
  if (this.lastExpenceSK !== "end") {
    const result: any = await this.accountService
        .getData(
          `expense-payments/report/paging?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&lastKey=${this.lastExpenceSK}`
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
        this.expenseLoaded=true;
      } else {
        this.lastExpenceSK = "end";
      }
      
      this.allPayments=this.allPayments.concat(result)
    }
  }
}
resetVariables(){
  this.lastEmployeeSK=''
  this.lastDriverSK=''
  this.lastAdvanceSK=''
  this.lastExpenceSK=''
  this.employeeLoaded=false;
  this.expenseLoaded=false;
  this.advanceLoaded=false;
  this.driverLoaded=false;
}
async searchFilter(){
  this.allPayments=[]
  this.resetVariables();
  if(this.filter.type){
  switch(this.filter.type){
    case "epp":{
      this.fetchEmployeePayments();
      break;
    }
    case "exp":{
      this.fetchExpencePayments();
      break;
    }
    case "advp":{
      this.fetchAdvancePayments()
      break;
    }
    case "drvp":{
      this.fetchDriverPayments();
      break;
    }
  }
}
else{
  await this.init();
}
}
async resetFilter(){
  this.resetVariables();
  this.filter={
    startDate:null,
    endDate:null,
    mode:null,
    type:null
  }
  await this.init();
}


  onScroll(){
    // console.log("Expense",this.expenseLoaded)
    // console.log("Advance",this.advanceLoaded)
    // console.log("Driver",this.driverLoaded)
    // console.log("employee",this.employeeLoaded)
      if(this.expenseLoaded) this.fetchExpencePayments();
      if(this.advanceLoaded) this.fetchAdvancePayments();
      if(this.driverLoaded) this.fetchDriverPayments();
      if(this.employeeLoaded) this.fetchEmployeePayments();
   
   this.expenseLoaded=false
   this.advanceLoaded=false
   this.driverLoaded=false
   this.employeeLoaded=false

  }
}
