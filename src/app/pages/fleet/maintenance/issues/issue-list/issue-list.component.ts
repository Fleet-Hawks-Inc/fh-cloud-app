import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Constants from '../../../constants';
import { environment } from '../../../../../../environments/environment';
import * as _ from 'lodash';
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
  usersList:any = {};
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
  allVehicles = [];
  allAssets = [];
  suggestedIssues = [];

  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchIssuesCount();
    this.fetchVehicleList();
    this.fetchDriverList();
    this.fetchAssetList();
    this.fetchUsersList();
    this.initDataTable();
    this.fetchAllAssets();
    this.fetchAllVehicles();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }

  getSuggestions = _.debounce(function (value) {
    value = value.toLowerCase();

    if(value != '') {
      this.apiService
      .getData(`issues/get/suggestions/${value}`)
      .subscribe((result) => {
        this.suggestedIssues = result;
      });
    } else {
      this.suggestedIssues = [];
    }
  }, 800);

  setIssue(issueName) {
    this.issueName = issueName;
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
  fetchIssuesCount() {
    this.apiService.getData('issues/get/count?unitID=' + this.unitID + '&issueName=' + this.issueName + '&asset=' + this.assetUnitID + '&currentStatus=' + this.issueStatus).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;

        if(this.unitID != null || this.issueName != '' || this.issueStatus != null || this.assetUnitID != null) {
          this.issuesEndPoint = this.totalRecords;
        }
      },
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
        this.fetchIssuesCount();
        this.issues = [];
        this.initDataTable();
        this.toastr.success('Issue Deleted Successfully!');
      });
    }
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('issues/fetch/records?unitID=' + this.unitID + '&issueName=' + this.issueName + '&currentStatus=' + this.issueStatus + '&asset=' + this.assetUnitID + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedIssues = [];
        this.getStartandEndVal();

        this.issues = result['Items'];
        if(this.unitID != null || this.issueName != '' || this.issueStatus != null || this.assetUnitID != null) {
          this.issuesStartPoint = 1;
          this.issuesEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.issuesNext = false;
          // for prev button
          if (!this.issuesPrevEvauatedKeys.includes(result['LastEvaluatedKey'].issueID)) {
            this.issuesPrevEvauatedKeys.push(result['LastEvaluatedKey'].issueID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].issueID;

        } else {
          this.issuesNext = true;
          this.lastEvaluatedKey = '';
          this.issuesEndPoint = this.totalRecords;
        }

        if(this.totalRecords < this.issuesEndPoint) {
          this.issuesEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.issuesDraw > 0) {
          this.issuesPrev = false;
        } else {
          this.issuesPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  searchFilter() {
    if(this.unitID != null || this.issueName != '' || this.issueStatus != null || this.assetUnitID != null) {
      this.issueName = this.issueName.toLowerCase();
      this.fetchIssuesCount();
      this.dataMessage = Constants.FETCHING_DATA;
      this.issues = [];
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.unitID != null || this.issueName != '' || this.issueStatus != null || this.assetUnitID != null) {
      this.unitID = null;
      this.unitName = '';
      this.issueName = '';
      this.issueStatus = null;
      this.assetUnitID = null;
      this.suggestedIssues = [];
      this.fetchIssuesCount();
      this.dataMessage = Constants.FETCHING_DATA;
      this.issues = [];
      this.initDataTable();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  getStartandEndVal() {
    this.issuesStartPoint = this.issuesDraw * this.pageLength + 1;
    this.issuesEndPoint = this.issuesStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.issuesNext = true;
    this.issuesPrev = true;
    this.issuesDraw += 1;
    this.initDataTable();
  }

  // prev button func
  prevResults() {
    this.issuesNext = true;
    this.issuesPrev = true;
    this.issuesDraw -= 1;
    this.lastEvaluatedKey = this.issuesPrevEvauatedKeys[this.issuesDraw];
    this.initDataTable();
  }

  resetCountResult() {
    this.issuesStartPoint = 1;
    this.issuesEndPoint = this.pageLength;
    this.issuesDraw = 0;
  }

  fetchAllVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.allVehicles = result.Items;
    });
  }

  fetchAllAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.allAssets = result.Items;
    });
  }
}
