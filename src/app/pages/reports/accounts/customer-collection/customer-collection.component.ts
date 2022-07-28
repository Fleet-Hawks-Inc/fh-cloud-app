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
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  environment = environment.isFeatureEnabled;
  @ViewChild('myTable') table: any;




  public customerCollection = []
  SelectionType = SelectionType;
  dataMessage: string = Constants.FETCHING_DATA;
  ColumnMode = ColumnMode;

  loaded = false;
  exportLoading = false
  allData = [];
  readonly rowHeight = 70;
  readonly headerHeight = 70;
  expanded: any = {};
  printData: any = {};
  orders = []
  lastSK = ""
  isLoading = false
  pageLimit = 10
  customer = null
  previewRef: any;
  preview: any;
  customerFiltr = {
    startDate: '',
    endDate: ''
  }
  suggestedCustomers = []

  date = new Date();
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  _selectedColumns: any[];
  driverOptions: any[];
  listView = true;
  visible = true;
  allCustomerData = []
  dataColumns: any[];
  get = _.get;
  find = _.find;
  customersObjects = {};



  constructor(private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService) { }

  async ngOnInit(): Promise<void> {

    this.fetchCustomerData();
    this.fetchCustomersByIDs();
    this.dataColumns = [
      { width: '9%', field: 'customerName', header: 'Customer', type: "text" },
      { width: '10%', field: 'customerEmail', header: 'Email', type: "text" },
      { width: '7%', field: 'customerPhone', header: 'Phone', type: "text" },
      { width: '7%', field: 'cusConfirmation', header: ' Conf#', type: "text" },
      { width: '8%', field: 'txnDate', header: 'Inv. Date#', type: "text" },
      { width: '6%', field: 'invNo', header: 'Inv.#', type: "text" },
      { width: '9%', field: 'finalAmount', header: 'Inv Amount#', type: "text" },
      { width: '8%', field: 'balance', header: 'Balance', type: "text" },
      { width: '8%', field: 'invStatus', header: 'Inv Status', type: "text" },
      { width: '6%', field: 'elapsedDays', header: 'Days', type: "text" },
      { width: '7%', field: 'Age30', header: '30-45', type: "text" },
      { width: '7%', field: 'Age45', header: '45-60', type: "text" },
      { width: '8%', field: 'Age60', header: '60-90+', type: "text" },


    ];
    this._selectedColumns = this.dataColumns;
    this.setToggleOptions();
  }

  fetchCustomersByIDs() {
    this.apiService.getData("contacts/get/list").subscribe((result: any) => {
      this.customersObjects = result;
    });
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


  clear(table: Table) {
    table.clear();
  }

  getSuggestions = _.debounce(async function (value) {
    value = value.toLowerCase();
    if (value != '') {
      const result = await this.apiService.getData(`contacts/reports/suggestions/${value}`).toPromise();
      this.suggestedCustomers = result
    }
    else {
      this.suggestedCustomers = []
    }

  }, 500)
  setCustomer(cName) {
    if (cName != '') {
      this.customer = cName;
      this.suggestedCustomers = []
    }
  }

  async fetchCustomerData() {
    const result = await this.apiService.getData(`contacts/get/reports/collection-report?customerId=${this.customer}&start=${this.customerFiltr.startDate}&end=${this.customerFiltr.endDate}`).toPromise();
    this.allCustomerData = result.Items;
    if (result.Items.length === 0) {
      this.loaded = true;
      this.dataMessage = Constants.NO_RECORDS_FOUND
    }
    for (let data of result.Items) {
      data.Age30 = '';
      data.Age45 = '';
      data.Age60 = '';
      if (data.cadBalanceAge30 != 0) {
        data.Age30 = "$" + data.cadBalanceAge30 + " " + "CAD"
      }
      else if (data.usBalanceAge30 != 0) {
        data.Age30 = "$" + data.usBalanceAge30 + " " + "USD"


      }

      if (data.cadBalanceAge45 != 0) {
        data.Age45 = "$" + data.cadBalanceAge45 + " " + "CAD"
      }
      else if (data.usBalanceAge45 != 0) {
        data.Age45 = "$" + data.usBalanceAge45 + " " + "USD"

      }

      if (data.cadBalanceAge60 != 0) {
        data.Age60 = "$" + data.cadBalanceAge60 + " " + "CAD"

      }
      else if (data.usBalanceAge60 != 0) {
        data.Age60 = "$" + data.usBalanceAge60 + " " + "USD"

      }


      data.elapsedDays = 0
      const startedDate = new Date(data.txnDate);
      const currentDate = new Date(moment().format("YYYY-MM-DD"));
      data.elapsedDays = getDifferenceInDays(startedDate, currentDate);
    }


    function getDifferenceInDays(startedDate, currentDate) {
      const diffInMs = Math.abs(currentDate - startedDate);
      return diffInMs / (1000 * 60 * 60 * 24);
    }




  }
  searchFilter() {
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
    // if () {
    else if (this.customer !== null || this.customerFiltr.startDate !== null && this.customerFiltr.endDate !== null) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.allCustomerData = [];
      this.fetchCustomerData();
    }

  }

  reset() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.customer = null
    this.customerFiltr.startDate = ''
    this.customerFiltr.endDate = ''
    this.allCustomerData = [];
    this.fetchCustomerData();

  }

  refreshData() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.customer = null
    this.customerFiltr.startDate = ''
    this.customerFiltr.endDate = ''
    this.allCustomerData = [];
    this.fetchCustomerData();
  }
}
