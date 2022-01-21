import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
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

  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  title = 'Issues List';
  issues = [];
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
  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.initDataTable();
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
    this.apiService.getData('users/get/list').subscribe((result: any) => {
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


  initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService.getData('issues/fetch/records?searchValue=' + this.searchValue + '&category=' + this.category + '&issueName=' + this.issueName + '&currentStatus=' + this.issueStatus + '&lastKey=' + this.lastEvaluatedKey)
        .subscribe((result: any) => {
          if (result.Items.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND
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
          }
        });
    }
  }
  categoryChange() {
    this.searchValue = null;

  }
  onScroll() {
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
}
