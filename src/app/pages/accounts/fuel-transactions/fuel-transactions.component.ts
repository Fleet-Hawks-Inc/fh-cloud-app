import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { AccountService, ApiService, ListService } from 'src/app/services';
import Constants from '../../fleet/constants';
import * as moment from 'moment'
import * as _ from 'lodash'
import { map } from "rxjs/operators";
import { from } from "rxjs";
declare var $: any;

@Component({
  selector: 'app-fuel-transactions',
  templateUrl: './fuel-transactions.component.html',
  styleUrls: ['./fuel-transactions.component.css'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class FuelTransactionsComponent implements OnInit {

  @ViewChild('dt') table: Table;
  dataMessage: string = Constants.FETCHING_DATA;
  title = 'Fuel Transactions';
  fromDate: any = '';
  toDate: any = '';
  fuelID = '';
  uploadedDocs = []
  disable = false;
  csvHeader = []
  vehicleList: any = {};
  assetList: any = {};
  WEXCodeList: any = {};
  fuelCodeList: any = {};
  countries = [];
  checked = false;
  isChecked = false;
  headCheckbox = false;
  selectedfuelID: any;
  fuelCheckCount = null;
  countryName: any = '';
  formattedFromDate: any = '';
  formattedToDate: any = '';
  fuelList = [];
  suggestedUnits = [];
  vehicleID = '';
  amount = '';
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  vehicleIdentification = '';
  unitID = null;
  assetUnitID = null;
  unitName: string; 
  start: any = '';
  end: any = '';
  lastTimeCreated = ''
  lastEvaluatedKey = '';
  error = {
    hasError: false,
    message: '',
    attributes: []
  }
  wexCategories: any = {};
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  readonly rowHeight = 60;
  readonly headerHeight = 70;
  pageLimit = 10
  loaded = false;
  _selectedColumns: any[];
  dataColumns = [
    { width: '12%', field: 'data.date', header: 'Date Time', type: "date" },
    { width: '12%', field: 'data.cardNo', header: 'Fuel Card #', type: "text" },
    { width: '12%', field: 'data.unitNo', header: 'Unit #', type: 'text' },
    { width: '12%', field: 'data.useType', header: 'Use Type', type: 'text' },
    { width: '12%', field: 'data.type', header: ' Type', type: 'text' },
    { width: '12%', field: 'data.amt', header: 'Fuel Amount', type: 'text' },
    { width: '12%', field: 'gst', header: 'GST', type: 'text' },
    { width: '12%', field: 'data.site', header: 'Site', type: 'text' },
    { width: '12%', field: 'data.city', header: 'Province', type: 'text' }
  ];
  accounts:any = {};
  txnData = {
    drAccountID: null,
    crAccountID: null,
    fuelData: [],
    txnType: null
  }
  submitDisabled = false;
  errors = {};

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private el: ElementRef,
    private router: Router,
    private listService: ListService,
    private accountService: AccountService,
    private toaster: ToastrService,
  ) { }

  ngOnInit() {
    this.fetchWexCategories();
    this.fetchVehicleList();
    this.fetchAssetList();
    this.initDataTable();
    this.listService.fetchChartAccounts();
    // this.contacts = this.listService.customersList;
    this.accounts = this.listService.accountsList;
  }

  initDataTable() {
    this.apiService.getData('fuelEntries/fetch/transactions?unitID=' + this.unitID + '&from=' + this.start + '&to=' + this.end + '&asset=' + this.assetUnitID + '&lastKey=' + this.lastEvaluatedKey + '&date=' + this.lastTimeCreated).subscribe((result: any) => {
      this.loaded = true
      if (result.Items.length == 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
      this.suggestedUnits = [];
      // this.getStartandEndVal();
      result[`Items`].forEach(element => {
        element.gst = '';
        element.pst = '';
        if(element.data && element.data.tax) {
          for (const iterator of element.data.tax) {
            if(iterator.taxCode) {
              if(iterator.taxCode === 'GST') {
                element.gst = iterator.amount;
              } else if (iterator.taxCode === 'PST') {
                element.pst = iterator.amount;
              }
            }
          }
        }
        
        element.selected = false;
        let date: any = moment(element.date)
        if (element.time) {
          let time = moment(element.time, 'h mm a')
          date.set({
            hour: time.get('hour'),
            minute: time.get('minute')
          })
          date = date.format('MMM Do YYYY, h:mm a')
        }
        else {
          date = date.format('MMM Do YYYY')
        }
        element.dateTime = date
      });

      this.fuelList = this.fuelList.concat(_.orderBy(result.Items, [(obj) => new Date(obj.data.date)], ['desc']))
      if (result.LastEvaluatedKey.fuelSK !== undefined) {
        // for prev button
        this.lastEvaluatedKey = encodeURIComponent(result.LastEvaluatedKey.fuelSK)
        if (result.LastEvaluatedKey.date !== undefined) {
          this.lastTimeCreated = result.LastEvaluatedKey.date
        }
        this.loaded = true
      } else {
        this.lastEvaluatedKey = 'end';
      }
    })
  }

  fetchWexCategories() {
    this.httpClient.get('assets/jsonFiles/fuel/wexCategories.json').subscribe((result: any) => {

      this.wexCategories = result;
    })
  }

  onScroll(offsetY) {
    const viewHeight =
      this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;

    if (
      offsetY + viewHeight + this.fuelList.length * this.rowHeight
    ) {
      let limit = this.pageLimit;
      if (this.fuelList.length === 0) {
        const pageSize = Math.ceil(viewHeight / this.rowHeight);

        limit = Math.max(pageSize, this.pageLimit);
      }
      if (this.loaded) {
        this.initDataTable();
      }
      this.loaded = false;
    }
  }

  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }

  fetchAssetList() {
    this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetList = result;
    });
  }

  openTransactFuelModel() {
    let fuelIds = [];
    this.txnData = {
      drAccountID: null,
      crAccountID: null,
      txnType: null,
      fuelData: []
    }

    for (const iterator of this.fuelList) {
      if(iterator.selected && !fuelIds.includes(iterator.data.fuelID)) {
        fuelIds.push(iterator.data.fuelID);
        let obj = {
          fuelID: iterator.data.fuelID,
          amount: iterator.data.amt,
          currency: iterator.data.currency,
          gst: iterator.gst
        }
        this.txnData.fuelData.push(obj);
      }
    }
    if(fuelIds.length > 0) {
      $("#fuelTxnModel").modal("show");
    }
  }

  saveFuelTxn() {
    if(this.txnData.drAccountID && this.txnData.crAccountID) {
      this.submitDisabled = true;
      this.accountService.postData("chartAc/add/fuel/txn", this.txnData, true).subscribe({
        complete: () => {},
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, "This Field");
                this.errors[val.context.key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.submitDisabled = false;
                // this.throwErrors();
              },
              error: () => {
                this.submitDisabled = false;
              },
              next: () => {},
            });
        },
        next: (res) => {
          this.submitDisabled = false;
          this.toaster.success("Fuel Transaction added successfully.");
          this.fuelList = [];
          $("#fuelTxnModel").modal("hide");
          this.lastEvaluatedKey = ''
          this.lastTimeCreated = ''
          this.initDataTable();
        },
      });
    }
    
  }

  /**
    * Clears the table filters
    * @param table Table 
  */
  clear(table: Table) {
    table.clear();
  }

  searchFilter() {
    if (this.fromDate !== '' || this.toDate !== '' || this.unitID !== null || this.assetUnitID !== null) {
      if (this.fromDate !== '') {
        this.start = this.fromDate;
      }
      if (this.toDate !== '') {
        this.end = this.toDate;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.fuelList = [];
      this.lastEvaluatedKey = ''
      this.initDataTable();
      //this.fuelEntriesCount();
    } else {
      return false;
    }
  }

  resetFilter() {
    this.unitID = null;
    this.fromDate = '';
    this.toDate = '';
    this.assetUnitID = null;
    this.start = '';
    this.end = '';
    this.dataMessage = Constants.FETCHING_DATA;
    this.fuelList = [];
    this.lastEvaluatedKey = ''
    this.lastTimeCreated = ''
    this.initDataTable();
    //this.fuelEntriesCount();
    //this.resetCountResult();

  }

}
