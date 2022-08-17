import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng/table';
import { NgSelectComponent } from "@ng-select/ng-select";
import Constants from '../../../constants';
import { environment } from '../../../../../../environments/environment';
import * as _ from 'lodash';
import { result } from 'lodash';
declare var $: any;

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
  @ViewChild('dt') table: Table;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  title = 'Issues List';
  issues = [];
  get = _.get;
  driverList: any = {};
  vehicleList: any = {};
  assetList: any = {};
  vehicleName: string;
  contactName: string;
  dtOptions: any = {};
  unitID = null;
  unitName = '';
  issueName = '';
  issueStatus = null;
  suggestedUnits = [];
  usersList: any = {};
  assetUnitName = '';
  assetUnitID = null;
  suggestedUnitsAssets = [];

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  issuesNext = false;
  issuesPrev = true;
  issuesDraw = 0;
  issuesPrevEvauatedKeys = [''];
  issuesStartPoint = 1;
  issuesEndPoint = this.pageLength;
  // allVehicles = [];
  // allAssets = [];
  suggestedIssues = [];
  loaded = false
  searchValue = null;
  category = null;
  _selectedColumns: any[];
  employeeOptions: any[];

  categoryFilter = [
    {
      'name': 'Vehicle',
      'value': 'vehicle'
    },
    {
      'name': 'Asset',
      'value': 'asset'
    },
  ]
  // columns of data table
  dataColumns = [
    { field: 'unitType', header: 'Unit Type', type: "text" },
    { field: 'vehAstName', header: 'Vehicle/Asset', type: "text" },
    { field: 'issueName', header: 'Issue Name', type: "text" },
    { field: 'reportedDate', header: 'Reported On', type: "text" },
    { field: 'reportedBy', header: 'Reported By', type: "text" },
    { field: 'assignedTo', header: 'Assigned To', type: "text" },
    { field: 'currentStatus', header: 'Status', type: "text" },
  ];
  constructor(private apiService: ApiService, private modalService: NgbModal, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  async ngOnInit(): Promise<void> {
    this.setToggleOptions();
    this.setEmployeeOptions();
    await this.initDataTable();
    this.fetchVehicleList();
    this.fetchDriverList();
    this.fetchAssetList();
    this.fetchUsersList();
    // this.fetchAllAssets();
    // this.fetchAllVehicles();

    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }



  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }
  setEmployeeOptions() {
    this.employeeOptions = [
      { 'value': 'vehicle', 'name': 'Vehicle' },
      { 'value': 'asset', 'name': 'Asset' }
    ];
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
  }


  getSuggestions = _.debounce(function (searchvalue) {
    searchvalue = searchvalue.toLowerCase();

    if (searchvalue != '') {
      this.apiService
        .getData(`issues/get/suggestions/${searchvalue}`)
        .subscribe((result) => {
          this.suggestedIssues = result;
        });
    } else {
      this.suggestedIssues = [];
    }
  }, 800);

  setIssue(value) {
    this.issueName = value;
    this.suggestedIssues = [];
  }

  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
  fetchDriverList() {
    this.apiService.getData('drivers/get/list').subscribe((result: any) => {
      this.driverList = result;
    });
  }
  fetchAssetList() {
    this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetList = result;
    });
  }
  fetchUsersList() {
    this.apiService.getData('common/users/get/list').subscribe((result: any) => {
      this.usersList = result;
    });
  }


  deleteIssue(entryID: any, issueName: any) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
        .deleteData(`issues/isDeleted/${entryID}/${issueName}/` + 1)
        .subscribe((result: any) => {
          this.issuesDraw = 0;
          this.lastEvaluatedKey = '';
          this.dataMessage = Constants.FETCHING_DATA;
          this.initDataTable();
          this.issues = [];
          this.toastr.success('Issue Deleted Successfully!');
        });
    }
  }


  async initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService.getData('issues/fetch/records?searchValue=' + this.searchValue + '&category=' + this.category + '&issueName=' + this.issueName + '&currentStatus=' + this.issueStatus + '&lastKey=' + this.lastEvaluatedKey)
        .subscribe((result: any) => {
          if (result.Items.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND
            this.loaded = true
          }
          this.suggestedIssues = [];
          if (result.Items.length > 0) {
            if (result.LastEvaluatedKey !== undefined) {
              this.lastEvaluatedKey = encodeURIComponent(result.LastEvaluatedKey.sk);
            }
            else {
              this.lastEvaluatedKey = 'end'
            }
            this.issues = this.issues.concat(result.Items)
            this.loaded = true;
            for(let res of result.Items){
            if(res.unitType === 'asset'){
            res.vehAstName = this.assetList[res.unitID] ? this.assetList[res.unitID] : '-'
            }
            else if(res.unitType === 'vehicle'){
            res.vehAstName = this.vehicleList[res.unitID] ? this.vehicleList[res.unitID] : '-'
            }
            }
          }
        });
    }
  }
  categoryChange() {
    this.searchValue = null;

  }
  onScroll = async (event: any) => {
    if (this.loaded) {
      this.initDataTable();
    }
    this.loaded = false;
  }
  searchFilter() {
    if (this.searchValue != null || this.issueName != '' || this.issueStatus != null || this.category != null) {
      if (this.searchValue != null && this.category == null) {
        this.toastr.error('Please select both searchValue and category ');
        return false;
      } else if (this.searchValue == null && this.category != null) {
        this.toastr.error('Please select both searchValue and category ');
        return false;
      }
      else {
        this.lastEvaluatedKey = ''
        this.issues = [];

        this.dataMessage = Constants.FETCHING_DATA;
        this.initDataTable();
      }
    }
    else {
      return false;
    }
  }

  clearInput() {
    this.suggestedIssues = null;
  }

  clearSuggestions() {
    this.issueName = null;
  }

  resetFilter() {
    if (this.searchValue != null || this.issueName != '' || this.issueStatus != null || this.category != null) {
      this.searchValue = null;
      this.unitName = '';
      this.issueName = '';
      this.issueStatus = null;
      this.category = null;
      this.suggestedIssues = [];
      this.lastEvaluatedKey = ''
      this.initDataTable();
      this.dataMessage = Constants.FETCHING_DATA;
      this.issues = [];
    } else {
      return false;
    }
  }


  // fetchAllVehicles() {
  //   this.apiService.getData('vehicles').subscribe((result: any) => {
  //     this.allVehicles = result.Items;
  //   });
  // }

  // fetchAllAssets() {
  //   this.apiService.getData('assets').subscribe((result: any) => {
  //     this.allAssets = result.Items;
  //   });
  // }

  refreshData() {
    this.searchValue = null;
    this.unitName = '';
    this.issueName = '';
    this.issueStatus = null;
    this.category = null;
    this.suggestedIssues = [];
    this.lastEvaluatedKey = '';
    this.initDataTable();
    this.dataMessage = Constants.FETCHING_DATA;
    this.issues = [];


  }

  cloneIssue(id: string) {
  }

  /**
 * Clears the table filters
 * @param table Table 
 */
  clear(table: Table) {
    table.clear();
  }
}
