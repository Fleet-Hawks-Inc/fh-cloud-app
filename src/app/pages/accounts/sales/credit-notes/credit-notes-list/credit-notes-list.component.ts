import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService } from 'src/app/services';
import * as _ from "lodash";
import { Table } from 'primeng/table';
@Component({
  selector: 'app-credit-notes-list',
  templateUrl: './credit-notes-list.component.html',
  styleUrls: ['./credit-notes-list.component.css']
})
export class CreditNotesListComponent implements OnInit {
  allCredits = [];
  customers = [];
  lastItemSK = "";

  isSearch: boolean = false;
  dataMessage = Constants.FETCHING_DATA;

  filterData = {
    customerID: null,
    startDate: "",
    endDate: "",
    lastItemSK: "",
  };
  _selectedColumns: any[];
  dataColumns: any[];
  get = _.get;
  find = _.find;
  loaded = false;
  constructor(private accountService: AccountService,
    private apiService: ApiService,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.fetchCredits();
    this.fetchCustomers();
    this.dataColumns = [
      { width: '10%', field: 'txnDate', header: 'Date', type: "text" },
      { width: '15%', field: 'cCrNo', header: 'Customer Credit#', type: "text" },
      { width: '10%', field: 'crRef', header: 'Reference#', type: "text" },
      { width: '15%', field: 'customerID', header: 'Customer', type: "text" },
      { width: '15%', field: 'totalAmt', header: 'Credit Amount', type: "text" },
      { width: '15%', field: 'balance', header: 'Balance Amount', type: "text" },
      { width: '14%', field: 'status', header: 'Status', type: "text" },
    ];


    this._selectedColumns = this.dataColumns;
    this.setToggleOptions()
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

  fetchCustomers() {
    this.apiService
      .getData(`contacts/get/list`)
      .subscribe((result: any) => {
        this.customers = result;
      });
  }

  async fetchCredits(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = "";
      this.allCredits = [];
    }
    if (this.lastItemSK !== "end") {
      this.accountService
        .getData(
          `customer-credits/paging?customer=${this.filterData.customerID}&startDate=${this.filterData.startDate}&endDate=${this.filterData.endDate}&lastKey=${this.lastItemSK}`
        )
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.isSearch = false;
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }

          if (result.length > 0) {
            this.isSearch = false;
            result.map((v) => {
              v.status = v.status.replace("_", " ");
              this.allCredits.push(v);
            });

            if (this.allCredits[this.allCredits.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(
                this.allCredits[this.allCredits.length - 1].sk
              );
            } else {
              this.lastItemSK = "end";
            }

            this.loaded = true;
          }
        });
    }
  }

  searchCredits() {
    if (
      this.filterData.customerID !== "" ||
      this.filterData.startDate !== "" ||
      this.filterData.endDate !== "" ||
      this.filterData.lastItemSK !== ""
    ) {
      if (this.filterData.startDate !== "" && this.filterData.endDate === "") {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (
        this.filterData.startDate === "" &&
        this.filterData.endDate !== ""
      ) {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filterData.startDate > this.filterData.endDate) {
        this.toaster.error("Start date should be less then end date");
        return false;
      } else {
        this.isSearch = true;
        this.allCredits = [];
        this.lastItemSK = "";
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchCredits();
      }
    }
  }

  resetFilter() {
    this.isSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filterData = {
      customerID: null,
      startDate: "",
      endDate: "",
      lastItemSK: "",
    };
    this.lastItemSK = '';
    this.allCredits = [];
    this.fetchCredits();
  }


  deleteCredit(creditID: string) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.accountService
        .deleteData(`customer-credits/delete/${creditID}`)
        .subscribe((res) => {
          if (res) {
            this.lastItemSK = '';
            this.allCredits = [];
            this.dataMessage = Constants.FETCHING_DATA;
            this.fetchCredits();
          }
        });
    }
  }
  onScroll() {
    if (this.loaded) {
      this.fetchCredits();
    }
    this.loaded = false;
  }
  clear(table: Table) {
    table.clear();
  }
}
