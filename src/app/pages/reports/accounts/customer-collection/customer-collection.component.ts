import { Component, OnInit, ViewChild, Input, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service'
import { SelectionType, ColumnMode } from "@swimlane/ngx-datatable";
import Constant from "src/app/pages/fleet/constants";
import { result } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { timeStamp } from 'console';
import * as html2pdf from "html2pdf.js";
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment'
import * as _ from "lodash";
import { NgSelectComponent } from '@ng-select/ng-select';
import { Table } from 'primeng/table';
declare var $: any;

import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Constants from 'src/app/pages/fleet/constants';
@Component({
  selector: 'app-customer-collection',
  templateUrl: './customer-collection.component.html',
  styleUrls: ['./customer-collection.component.css']
})
export class CustomerCollectionComponent implements OnInit {
    // @ViewChild('dt') table: Table;
    @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
    @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
    environment = environment.isFeatureEnabled;
  @ViewChild('myTable') table: any;
  @ViewChild("previewAllModal",{static:true}) previewAllModal:TemplateRef<any>;
  @ViewChild("previewReportModal", { static: true }) previewReportModal:TemplateRef<any>;
  //previewReportModal: TemplateRef<any>;
  
 
  
  public customerCollection = []
  SelectionType = SelectionType;
  dataMessage: string = Constants.FETCHING_DATA;
  ColumnMode = ColumnMode;

  loaded = false;
  exportLoading=false
  allData=[];
  readonly rowHeight = 70;
  readonly headerHeight = 70;
  expanded: any = {};
  printData: any ={};
  orders = []
  lastSK = ""
  isLoading = false
  pageLimit = 10
  customer = ""
  previewRef: any;
  preview:any;
  customerFiltr = {
    startDate: '',
    endDate: ''
  }
  suggestedCustomers=[]
  
  date = new Date();
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
 _selectedColumns: any[];
   driverOptions: any[];
   listView = true;
   visible = true;
   get = _.get;
 
   
   dataColumns = [
        {  field: 'cName', header: 'Customer', type: "text" },
        {  field: 'workEmail', header: 'Email', type: "text" },
        { field: 'workPhone', header: 'Phone', type: "text" },
        {  field: 'totalOrders', header: 'Orders', type: "text" },
        {  field: 'deliveredOrders', header: 'Delivered', type: "text" },
        {  field: 'totalAmount', header: 'Total Amount', type: "text" },
        {  field: 'amountReceived', header: 'Amount Received', type: "text" },
        {  field: 'balancee', header: 'Balance', type: "text" },
        {  field: 'balanceAge30', header: '30-45', type: "text" },
        {  field: 'fourtySixty', header: '45-60', type: "text" },
        {  field: 'sixtyPlus', header: '60+', type: "text" },
      
    ];
 
 
  constructor(private apiService: ApiService, 
  private toastr: ToastrService,
  private router: Router, 
  private modalService: NgbModal,
  private spinner: NgxSpinnerService) { }

    async ngOnInit(): Promise<void> {
    this.fetchCustomerCollection();
    this.setToggleOptions();
  }
  
  onScroll = async (event: any) => {
    if (this.loaded) {
      this.fetchCustomerCollection();
    }
    this.loaded = false;
  }
  
  // onScroll(offsetY: any) {
  //   const viewHeight =
  //     el.nativeElement.getBoundingClientRect().height - this.headerHeight;


  //   if (
  //     !this.isLoading &&
  //     offsetY + viewHeight + this.customerCollection.length * this.rowHeight
  //   ) {
  //     let limit = this.pageLimit;
  //     if (this.customerCollection.length === 0) {
  //       const pageSize = Math.ceil(viewHeight / this.rowHeight);

  //       limit = Math.max(pageSize, this.pageLimit);
  //     }
  //     if (this.loaded) {
  //       this.fetchCustomerCollection();
  //     }
  //     this.loaded = false;
  //   }
  // }
  
  
   setToggleOptions() {
        this.selectedColumns = this.dataColumns;
    }
        @Input() get selectedColumns(): any[] {
        return this._selectedColumns;
    }
  
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));

  }
   
   
   clear(table: Table) {
        table.clear();
    }
  
getSuggestions=_.debounce(async function (value){
  value=value.toLowerCase();
  if(value!=''){
    const result=await this.apiService.getData(`contacts/reports/suggestions/${value}`).toPromise();
    this.suggestedCustomers=result
  }
  else{
    this.suggestedCustomers=[]
  }

},500)
setCustomer(cName){
  if(cName!=''){
  this.customer=cName;
  this.suggestedCustomers=[]
  }
}
  async fetchCustomerCollection(refresh?: boolean) {
    this.dataMessage = Constant.FETCHING_DATA
    this.isLoading = true;
    if (refresh === true) {
      this.lastSK = ""
      this.customerCollection = []
    }
    if (this.lastSK != 'end') {
      const result = await this.apiService.getData(`contacts/get/customer/collection?lastKey=${this.lastSK}&customer=${this.customer}&start=${this.customerFiltr.startDate}&end=${this.customerFiltr.endDate}`).toPromise();
      // console.log(result)
      this.dataMessage = Constant.FETCHING_DATA
      if (result.Items.length == 0) {
        this.dataMessage = Constant.NO_RECORDS_FOUND
      }
      if (result.Items.length > 0) {
        this.isLoading = false;
        // console.log(result)
        if (result.LastEvaluatedKey.contactSK !== undefined) {
          this.lastSK = encodeURIComponent(result.LastEvaluatedKey.contactSK)
          this.loaded = true
        }
        else {
          this.lastSK = "end"
        }
        // console.log(this.lastSK)
        this.customerCollection = this.customerCollection.concat(result.Items)
      }
    }
  }
  
  // async onDetailToggle(event) {

  // }
//   toggleExpandRow(row, expanded) {
// this.table.rowDetail.toggleExpandRow(row);
//   }

  async search() {
    if (!this.customer && !this.customerFiltr.startDate && !this.customerFiltr.endDate) {
      this.toastr.error("At least one field required")
    }
    else if (this.customerFiltr.startDate && !this.customerFiltr.endDate) {
      this.toastr.error("End Date is required")
    }
    else if (this.customerFiltr.endDate && !this.customerFiltr.startDate) {
      this.toastr.error("Start Date is required")
    }
    else if (this.customerFiltr.startDate > this.customerFiltr.endDate) {
      this.toastr.error("Start date can not exceeds End Date")
    }
    else {
      this.loaded = false
      this.customerCollection = []
      this.lastSK = ''
      this.fetchCustomerCollection();
    }
  }

  reset() {
    this.lastSK = ''
    this.customer = ''
    this.customerFiltr.startDate = ''
    this.customerFiltr.endDate = ''
    this.customerCollection = []

    this.fetchCustomerCollection();

  }
  
  refreshData(){
    this.lastSK = ''
    this.customer = ''
    this.customerFiltr.startDate = ''
    this.customerFiltr.endDate = ''
    this.customerCollection = []

    this.fetchCustomerCollection(); 
  }

  async showReport(event:any,data: any) {
    event.target.disabled = true;
    this.printData = data

    const result = await this.apiService.getData(`contacts/get/customer/collection/all?customer=${this.printData.cName}&start=${this.customerFiltr.startDate}&end=${this.customerFiltr.endDate}`).toPromise();
    this.printData.orders = result.Items[0].orders
    let ngbModalOptions: NgbModalOptions = {
      keyboard: true,
      windowClass: "preview--report"
    };
    this.previewRef = this.modalService.open(this.previewReportModal,
      ngbModalOptions
    )
    event.target.disabled=false
  }
  
  
  //   async showReport(event:any, data:any) {
  //   event.target.disabled = true;
  // // this.printData = data

  //   const result = await this.apiService.getData(`contacts/get/customer/collection/all?customer=${data.cName}&start=${this.customerFiltr.startDate}&end=${this.customerFiltr.endDate}`).toPromise();
  //   data.orders = result.Items[0].orders
  //   let ngbModalOptions: NgbModalOptions = {
  //     keyboard: true,
  //     windowClass: "preview--report"
  //   };
  //   this.previewRef = this.modalService.open(this.previewReportModal,
  //     ngbModalOptions
  //   )
  //   event.target.disabled=false
  // }
  
  
  
  async allCustomerPDF(){
    this.exportLoading=true
    const result = await this.apiService.getData(`contacts/get/customer/collection/all?customer=${this.customer}&start=${this.customerFiltr.startDate}&end=${this.customerFiltr.endDate}`).toPromise();
    this.allData=result.Items
    let ngbModalOptions: NgbModalOptions = {
      keyboard: true,
      windowClass: "preview"
    };
    // this.preview = this.modalService.open(this.previewAllModal,
    //   ngbModalOptions
    // )
    let data=document.getElementById("print_all_wrap")
    html2pdf(data, {
      margin: 0,
     pagebreak: { mode: "avoid-all" },
      filename: "allCustomerReport.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2Canvas: {
        dpi: 300,
        letterRendering: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" }
    })
    this.exportLoading=false
  }
  async generatePDF() {
    let data = document.getElementById("print_wrap");
    html2pdf(data, {
      margin: 0,
      //pagebreak: { mode: "avoid-all" },
      filename: "customerReport.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2Canvas: {
        dpi: 200,

        letterRendering: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" }
    })
    $("#previewReportModal").modal("hide");
  }
  async generateCSV() {
    this.exportLoading=true
    let dataObject = []
    let ordersData = []
    let csvArray = []
    const result = await this.apiService.getData(`contacts/get/customer/collection/all?customer=${this.customer}&start=${this.customerFiltr.startDate}&end=${this.customerFiltr.endDate}`).toPromise();
    //console.log(result)
    for (const element of result.Items) {

      let obj = {}
      obj["Customer"] = element.cName
      obj["Email"] = element.workEmail
      obj["Phone"] = element.workPhone
      obj["Total Orders"] = element.totalOrders
      obj["Delivered Orders"] = element.deliveredOrders
      obj["Invoice Generated"] = element.invoiceGenerated
      obj["Total Amount CAD"] = `CAD ${element.totalAmount.cad}`
      obj["Total Amount USD"] = `USD${element.totalAmount.usd}`
      obj["Amount Received CAD"] = `CAD ${element.amountReceived.cad}`
      obj["Amount Received USD"] = `USD${element.amountReceived.usd}`
      obj["Balance CAD"] = `CAD ${element.balance.cad}`
      obj["Balance USD"] = `USD${element.balance.usd}`
      obj["30-45 CAD"] = `CAD ${element.balanceAge30.cad}`
      obj["30-45 USD"] = `USD${element.balanceAge30.usd}`
      obj["45-60 CAD"] = `CAD ${element.balanceAge45.cad}`
      obj["45-60 USD"] = `USD${element.balanceAge45.usd}`
      obj["60-90 CAD"] = `CAD ${element.balanceAge60.cad}`
      obj["60-90 USD"] = `USD${element.balanceAge60.usd}`
      dataObject.push(obj)

      obj["orders"] = element.orders
      ordersData.push(obj)
    }

    let headers = Object.keys(dataObject[0]).join(',')
    headers += '\n'
    csvArray.push(headers)
    for (const element of ordersData) {
      let orders = element.orders
      let orderHeaders = ''
      let oArray = []
      if (orders.length > 0) {
        delete orders[0].orderSK
        delete orders[0].isDeleted
        orderHeaders = "," + Object.keys(orders[0]).join(',')
        orderHeaders += '\n'
        for (const i of orders) {
          i.milesInfo = i.milesInfo.totalMiles
          i.charges = i.charges.freightFee.currency
          delete i.orderSK
          delete i.isDeleted
          let o = "," + Object.values(i).join(',')
          o += '\n'
          oArray.push(o)
        }
      }
      else {
        oArray = ['']
      }
      delete element.orders
      let obj = Object.values(element).join(',')
      obj += '\n'
      obj += orderHeaders
      obj += oArray.join('')
      csvArray.push(obj)
    }
    const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8' })
    const link = document.createElement('a');
    if (link.download !== undefined) {

      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Collection-Report.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
this.exportLoading=false
    }

  }


}
