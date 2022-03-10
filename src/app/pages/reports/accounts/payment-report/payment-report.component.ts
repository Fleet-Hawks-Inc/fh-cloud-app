import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import Constants from 'src/app/pages/fleet/constants';
import {AccountService,ApiService} from 'src/app/services'
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as html2pdf from "html2pdf.js";
import { DashboardUtilityService } from 'src/app/services';


@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.css']
})
export class PaymentReportComponent implements OnInit {

  @ViewChild("previewModal",{static:false}) previewModal:TemplateRef<any>;

  constructor(private accountService:AccountService,private modalService: NgbModal,private dashboardUtilityService:DashboardUtilityService,private apiService:ApiService) { }

  allPayments=[]
  allExportData=[]
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  lastAdvanceSK=''
  lastDriverSK=''
  lastEmployeeSK=''
  lastExpenceSK=''
  searching=false
  exporting=false
  printing=false
  dataMessage=Constants.FETCHING_DATA
  filter = {
    startDate: null,
    endDate: null,
    type: null,
    mode:null,
    payModeNo:null,
    receiver:null,
    searchType:null,
    receiverType:null,
    searchValue:null
  };
  searchBy=[
    {name:'Cheque Number',value: "chequeNo"},
    {name:"Receiver",value:"receiver"}
  ]
  receivers=[
    {name: "Driver", value:"driver"},
    {name: "Owner Operator",value:"ownerOperator"},
    {name:"Vendor",value:"vendor"},
    {name:"Employee", value:"employee"},
    {name:"Carrier",value:"carrier"}
  ]
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
  driversObject:any={}
  carriersObject:any={}
  ownerOpObject:any={}
  employees:any={}
  vendors:any={}


  async ngOnInit() {
    await this.init();
    this.driversObject = await this.dashboardUtilityService.getDrivers();
    this.carriersObject = await this.dashboardUtilityService.getContactsCarriers();
    this.ownerOpObject = await this.dashboardUtilityService.getOwnerOperators();
    this.employees = await this.dashboardUtilityService.getEmployees();
    this.vendors = await this.dashboardUtilityService.getVendors();
  }

async init(){
  this.allPayments=[]
  await this.fetchAdvancePayments();
  await this.fetchDriverPayments();
  await this.fetchEmployeePayments();
  await this.fetchExpencePayments();
}


unitTypeChange(){
  this.filter.searchValue=null
}
async fetchAdvancePayments(refresh?: boolean){
  if (refresh==true){
    this.lastAdvanceSK="";
  }
  if (this.lastAdvanceSK !== "end") {
    const result=await this.accountService.getData(`advance/report/paging?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&payModeNo=${this.filter.payModeNo}&paymentTo=${this.filter.receiverType}&entityID=${this.filter.searchValue}&lastKey=${this.lastAdvanceSK}`).toPromise();
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
      `driver-payments/report/paging?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&payModeNo=${this.filter.payModeNo}&paymentTo=${this.filter.receiverType}&entityID=${this.filter.searchValue}&lastKey=${this.lastDriverSK}`
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
      `employee-payments/report/paging?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&payModeNo=${this.filter.payModeNo}&paymentTo=${this.filter.receiverType}&entityID=${this.filter.searchValue}&lastKey=${this.lastEmployeeSK}`
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
          `expense-payments/report/paging?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&payModeNo=${this.filter.payModeNo}&paymentTo=${this.filter.receiverType}&entityID=${this.filter.searchValue}&lastKey=${this.lastExpenceSK}`
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
  this.searching=true
  this.resetVariables();
  this.dataMessage=Constants.FETCHING_DATA
  if(this.filter.type){
  switch(this.filter.type){
    case "epp":{
      await this.fetchEmployeePayments();
      break;
    }
    case "exp":{
      await this.fetchExpencePayments();
      break;
    }
    case "advp":{
      await this.fetchAdvancePayments()
      break;
    }
    case "drvp":{
      await this.fetchDriverPayments();
      break;
    }
  }
}
else{
  await this.init();
}
this.searching=false
}
async resetFilter(){
  this.resetVariables();
  this.filter={
    startDate:null,
    endDate:null,
    mode:null,
    type:null,
    payModeNo:null,
    receiver:null,
    searchType:null,
    receiverType:null,
    searchValue:null
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
  async showPDF(){
    this.allExportData=[]
    this.exporting=true;
    if(this.filter.type){
      switch(this.filter.type){
        case "epp":{
          const employeeData=await this.accountService.getData(`employee-payments/report/export?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&payModeNo=${this.filter.payModeNo}&paymentTo=${this.filter.receiverType}&entityID=${this.filter.searchValue}`).toPromise();
          this.allExportData=this.allExportData.concat(employeeData)
          break;
        }
        case "exp":{
          const expenseData = await this.accountService.getData(`expense-payments/report/export?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&payModeNo=${this.filter.payModeNo}&paymentTo=${this.filter.receiverType}&entityID=${this.filter.searchValue}`).toPromise();
          this.allExportData=this.allExportData.concat(expenseData)
          break;
        }
        case "advp":{
          const advanceData=await this.accountService.getData(`advance/report/export?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&payModeNo=${this.filter.payModeNo}&paymentTo=${this.filter.receiverType}&entityID=${this.filter.searchValue}`).toPromise();
          this.allExportData=this.allExportData.concat(advanceData)
          break;
        }
        case "drvp":{
          const driverData=await this.accountService.getData(`driver-payments/report/export?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&payModeNo=${this.filter.payModeNo}&paymentTo=${this.filter.receiverType}&entityID=${this.filter.searchValue}`).toPromise();
          this.allExportData=this.allExportData.concat(driverData)
          break;
        }
      }
    }
    else{
      await this.fetchAllPayment();
    }
    let ngbModalOptions:NgbModalOptions={
      keyboard:true,
      windowClass:"preview"
    };
    this.modalService.open(this.previewModal,ngbModalOptions)
    this.exporting=false;
  }

  generatePDF(){
    this.printing=true;
    let data=document.getElementById("print_wrap")
    console.log(data)
    html2pdf(data, {
      margin: 0,
     pagebreak: { mode: "avoid-all" },
      filename: "payment-report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2Canvas: {
        dpi: 300,
        letterRendering: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" }
    })
this.printing=false;
  }
async fetchAllPayment(){
  const advanceData=await this.accountService.getData(`advance/report/export?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&payModeNo=${this.filter.payModeNo}&paymentTo=${this.filter.receiverType}&entityID=${this.filter.searchValue}`).toPromise();
    const driverData=await this.accountService
    .getData(
      `driver-payments/report/export?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&payModeNo=${this.filter.payModeNo}&paymentTo=${this.filter.receiverType}&entityID=${this.filter.searchValue}`
    ).toPromise();
    const employeeData=await this.accountService
    .getData(
      `employee-payments/report/export?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&payModeNo=${this.filter.payModeNo}&paymentTo=${this.filter.receiverType}&entityID=${this.filter.searchValue}`
    ).toPromise();
    const expenseData = await this.accountService
    .getData(
      `expense-payments/report/export?startPay=${this.filter.startDate}&endPay=${this.filter.endDate}&paymentMode=${this.filter.mode}&payModeNo=${this.filter.payModeNo}&paymentTo=${this.filter.receiverType}&entityID=${this.filter.searchValue}`
    )
    .toPromise();
    this.allExportData=this.allExportData.concat(advanceData)
    this.allExportData=this.allExportData.concat(driverData)
    this.allExportData=this.allExportData.concat(employeeData)
    this.allExportData=this.allExportData.concat(expenseData)
}
  
}
