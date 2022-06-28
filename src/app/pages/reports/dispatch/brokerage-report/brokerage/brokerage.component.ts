import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services'
import Constant from 'src/app/pages/fleet/constants'
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment'
declare var $: any;



@Component({
  selector: 'app-brokerage',
  templateUrl: './brokerage.component.html',
  styleUrls: ['./brokerage.component.css']
})
export class BrokerageComponent implements OnInit {
  @ViewChild('dt') table: Table;
  brokerage: any = [];
  get = _.get;
  _selectedColumns: any[];
  lastItemSK = '';
  dataMessage = ''
  brkDateEnUS:any = [];
  carriersObject = [];
  orderNumber = '';
  loaded = false;
  dataColumns = [
    { width: '10%', field: 'orderNumber', header: 'Order No', type: "text" },
    { width: '10%', field: 'tripData.tripNo', header: 'Trip No', type: "text" },
    { width: '12%', field: 'cName', header: 'Carrier', type: "text" },
    { width: '10%', field: 'createdDate', header: 'Order Date', type: "text" },
    { width: '12%', field: 'date', header: 'Brokerage Date', type: "text" },
    { width: '12%', field: 'pickUpLoc', header: 'Pickup Location', type: "text" },
    { width: '12%', field: 'dropOffLoc', header: 'Delivery Location', type: "text" },
    { width: '10%', field: 'amount', header: 'Order Amount', type: "text" },
    { width: '12%', field: 'bAmount', header: 'Brokerage Amount', type: "text" },
  ];
  constructor(
  private apiService: ApiService,
   private toastr: ToastrService,
   private router: Router,
  ) { }

  ngOnInit(): void {
  this.fetchBrokerageReport();
  this.setToggleOptions();
  this.fetchCarriers();
  }




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


  async fetchCarriers() {
    let result: any = await this.apiService
      .getData("contacts/get/type/carrier")
      .toPromise();
    let carrs = [];
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      if (element.isDeleted === 0) {
        carrs.push(element);
      }
    }
    this.carriersObject = carrs.reduce((a: any, b: any) => {
      return (a[b["contactID"]] = b["companyName"]), a;
    }, {});
  }




    async fetchBrokerageReport(refresh?: boolean) {
    if(refresh === true){
    this.lastItemSK = '',
    this.brokerage = [];
    }
    if(this.lastItemSK !== 'end'){
    const result = await this.apiService.getData(`orders/report/getBrokerageReport?orderNumber=${this.orderNumber}&lastKey=${this.lastItemSK}`).toPromise();
    this.dataMessage = Constant.FETCHING_DATA;
    if(result.Items.length === 0){
    this.dataMessage = Constant.NO_RECORDS_FOUND;
    this.loaded = true;
    }
    if(result.Items.length > 0){
    if(result.LastEvaluatedKey !== undefined){
    this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].orderSK);
    }else{
    this.lastItemSK = 'end'
    }
    this.brokerage = this.brokerage.concat(result.Items);
    this.loaded = true;
    }
    }
    }
    
    
      onScroll = async (event: any) => {
    if (this.loaded) {
      this.fetchBrokerageReport();
    }
    this.loaded = false;
  }
  
  
  searchFilter(){
  if(this.orderNumber !== ''){
  this.orderNumber = this.orderNumber;
  this.brokerage = [];
  this.dataMessage = Constant.FETCHING_DATA;
  this.lastItemSK = '';
  this.fetchBrokerageReport();
  }else{
  return false;
  }
  }
  
  resetFilter(){
  if(this.orderNumber !== ''){
  this.brokerage = [];
  this.loaded = false;
  this.lastItemSK = '';
  this.orderNumber = '';
  this.fetchBrokerageReport();
  this.dataMessage = Constant.FETCHING_DATA;
  }else{
  return false;
  }
  }
  
  refreshData() {
    this.brokerage = [];
    this.lastItemSK = '';
    this.loaded = false;
    this.fetchBrokerageReport();
    this.dataMessage = Constant.FETCHING_DATA;
  }
  
  
  exportBrokerage(){
  if(this.brokerage.length > 0){
  let dataObject = []
  let csvArray = []
  this.brokerage.forEach(element => {
  let obj = {}
  obj['Order No'] = element.orderNumber
  obj['Trip No'] = element.tripData.tripNo
  obj['Carrier'] = this.carriersObject[element.brkCarrID] 
  obj['Order Date'] = element.createdDate
  obj['Brokerage Date'] = element.date
  obj['Order Amount'] = element.amount
  obj['Brokerage Amount'] = element.bAmount
  dataObject.push(obj)
  });
  let headers = Object.keys(dataObject[0]).join(',')
            headers += '\n'
            csvArray.push(headers)
            dataObject.forEach(element => {
                let obj = Object.values(element).join(',')
                obj += '\n'
                csvArray.push(obj)
            });
            const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Driver-Report.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
  }
  else {
   this.toastr.error("No Records found")
  }
  }
  
  
    /**
 * Clears the table filters
 * @param table Table 
 */
  clear(table: Table) {
    table.clear();
  }
}
