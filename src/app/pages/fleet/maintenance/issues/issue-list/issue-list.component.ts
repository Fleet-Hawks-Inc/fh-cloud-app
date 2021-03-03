import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {

  title = 'Issues List';
  issues = [];
  driverList: any = {};
  vehicleList: any = {};
  assetList: any = {};
  vehicleName: string;
  contactName: string;
  dtOptions: any = {};
  unitID = '';
  unitName = '';
  issueName = '';
  issueStatus = '';
  suggestedUnits = [];

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  issuesNext = false;
  issuesPrev = true;
  issuesDraw = 0;
  issuesPrevEvauatedKeys = [''];
  issuesStartPoint = 1;
  issuesEndPoint = this.pageLength;

  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchIssuesCount();
    this.fetchVehicleList();
    this.fetchDriverList();
    this.fetchAssetList();
    this.initDataTable();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }

  setUnit(unitID, unitName) {
    this.unitName = unitName;
    this.unitID = unitID;
    this.suggestedUnits = [];
  }

  getSuggestions(value) {
    this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        result = result.Items;

        this.suggestedUnits = [];
        for (let i = 0; i < result.length; i++) {
          this.suggestedUnits.push({
            unitID: result[i].vehicleID,
            unitName: result[i].vehicleIdentification
          });
        }
        this.getAssetsSugg(value);
      });
  }

  getAssetsSugg(value) {
    this.apiService
      .getData(`assets/suggestion/${value}`)
      .subscribe((result) => {
        result = result.Items;
        for (let i = 0; i < result.length; i++) {
          this.suggestedUnits.push({
            unitID: result[i].assetID,
            unitName: result[i].assetIdentification
          });
        }
      });
    if (this.suggestedUnits.length === 0) {
      this.unitID = '';
    }
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
  fetchIssuesCount() {
    this.apiService.getData('issues/get/count?unitID=' + this.unitID + '&issueName=' + this.issueName + '&currentStatus=' + this.issueStatus).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
      },
    });
  }

  deleteIssue(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`issues/isDeleted/${entryID}/` + 1)
      .subscribe((result: any) => {
        this.fetchIssuesCount();
        this.issues = [];
        this.initDataTable();
        this.toastr.success('Issue Deleted Successfully!');
      });
    }
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('issues/fetch/records?unitID=' + this.unitID + '&issueName=' + this.issueName + '&currentStatus=' + this.issueStatus + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        this.issues = result['Items'];
        if (this.unitID !== '' || this.issueName !== '' || this.issueStatus !== '') {
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
    if (this.unitID !== '' || this.issueName !== '' || this.issueStatus !== '') {
      this.fetchIssuesCount();
      this.issues = [];
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.unitID !== '' || this.issueName !== '' || this.issueStatus !== '') {
      this.unitID = '';
      this.unitName = '';
      this.issueName = '';
      this.issueStatus = '';

      this.fetchIssuesCount();
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
    this.issuesDraw += 1;
    this.initDataTable();
    this.getStartandEndVal();
  }

  // prev button func
  prevResults() {
    this.issuesDraw -= 1;
    this.lastEvaluatedKey = this.issuesPrevEvauatedKeys[this.issuesDraw];
    this.initDataTable();
    this.getStartandEndVal();
  }

  resetCountResult() {
    this.issuesStartPoint = 1;
    this.issuesEndPoint = this.pageLength;
    this.issuesDraw = 0;
  }
}
