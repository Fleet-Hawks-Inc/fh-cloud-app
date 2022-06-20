import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services'
import Constant from 'src/app/pages/fleet/constants'
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import * as _ from 'lodash';
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
  loaded = false;
  dataColumns = [
    { width: '10%', field: 'orderNumber', header: 'Order No', type: "text" },
    { width: '10%', field: 'tripData.tripNo', header: 'Trip No', type: "text" },
    { width: '12%', field: 'cName', header: 'Carrier', type: "text" },
    { width: '10%', field: 'createdDate', header: 'Order Date', type: "text" },
    { width: '12%', field: 'brokerDate', header: 'Brokerage Date', type: "text" },
    { width: '12%', field: 'pickUpLoc', header: 'Pickup Location', type: "text" },
    { width: '12%', field: 'dropOffLoc', header: 'Delivery Location', type: "text" },
    { width: '10%', field: 'finalAmount', header: 'Order Amount', type: "text" },
    { width: '12%', field: 'brkAmount', header: 'Brokerage Amount', type: "text" },
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
    const result = await this.apiService.getData(`orders/report/getBrokerageReport?lastKey=${this.lastItemSK}`).toPromise();
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
    for(let i=0;i<this.brokerage.length;i++){
    if(this.brokerage[i].brkDate>0){
    this.brkDateEnUS = new Date(this.brokerage[i].brkDate).toLocaleDateString("en-US")
    }
    }
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
  
    /**
 * Clears the table filters
 * @param table Table 
 */
  clear(table: Table) {
    table.clear();
  }
}
