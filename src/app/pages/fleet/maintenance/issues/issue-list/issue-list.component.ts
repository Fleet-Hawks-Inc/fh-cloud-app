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
  allVehicles = [];
  allAssets = [];
  suggestedIssues = [];
  loaded = false

  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.initDataTable();
    this.fetchVehicleList();
    this.fetchDriverList();
    this.fetchAssetList();
    this.fetchUsersList();
    this.fetchAllAssets();
    this.fetchAllVehicles();

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
          console.log('suggestion',this.suggestedIssues )
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

// with items
  initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService.getData('issues/fetch/records?unitID=' + this.unitID + '&issueName=' + this.issueName + '&currentStatus=' + this.issueStatus + '&asset=' + this.assetUnitID + '&lastKey=' + this.lastEvaluatedKey)
        .subscribe((result: any) => {
         
          // this.issues = result.Items
           console.log(' this.issues',  this.issues)
          if (result.Items.length === 0) {

            this.dataMessage = Constants.NO_RECORDS_FOUND
          }
          this.suggestedIssues = [];
          if (result.Items.length > 0) {
            console.log('result.LastEvaluatedKey ', result.LastEvaluatedKey)

            if (result.LastEvaluatedKey !== undefined) {
              console.log(' this.lastEvaluatedKey ', this.lastEvaluatedKey)
              this.lastEvaluatedKey = encodeURIComponent(result.LastEvaluatedKey.sk);
        
              // this.lastEvaluatedKey = encodeURIComponent(this.issues[this.issues.length - 1].sk);
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

  // initDataTable() {
  //   if (this.lastEvaluatedKey !== 'end') {
  //     this.apiService.getData('issues/fetch/records?unitID=' + this.unitID + '&issueName=' + this.issueName + '&currentStatus=' + this.issueStatus + '&asset=' + this.assetUnitID + '&lastKey=' + this.lastEvaluatedKey)
  //       .subscribe((result: any) => {
  //         // console.log('result', result)
  //         if (result.length === 0) {

  //           this.dataMessage = Constants.NO_RECORDS_FOUND
  //         }
  //         this.suggestedIssues = [];
  //         if (result.length > 0) {
  //           console.log('result.LastEvaluatedKey ', result.LastEvaluatedKey)

  //           if (result.LastEvaluatedKey !== undefined) {
  //             console.log(' this.lastEvaluatedKey ', this.lastEvaluatedKey)
  //             this.lastEvaluatedKey = encodeURIComponent(result.LastEvaluatedKey.sk);
        
  //             // this.lastEvaluatedKey = encodeURIComponent(this.issues[this.issues.length - 1].sk);
  //           }
  //           else {
  //             this.lastEvaluatedKey = 'end'
  //           }
  //           this.issues = this.issues.concat(result)

  //           this.loaded = true;
  //         }
  //       });
  //   }
  // }



  onScroll() {
    if (this.loaded) {
      this.initDataTable();
    }
    this.loaded = false;
  }
  searchFilter() {
    if (this.unitID != null || this.issueName != '' || this.issueStatus != null || this.assetUnitID != null) {
      // this.issueName = this.issueName.toLowerCase();
      this.initDataTable();
      this.lastEvaluatedKey = ''
      this.dataMessage = Constants.FETCHING_DATA;
      this.issues = [];
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.unitID != null || this.issueName != '' || this.issueStatus != null || this.assetUnitID != null) {
      this.unitID = null;
      this.unitName = '';
      this.issueName = '';
      this.issueStatus = null;
      this.assetUnitID = null;
      this.suggestedIssues = [];
      this.lastEvaluatedKey = ''
      this.initDataTable();
      this.dataMessage = Constants.FETCHING_DATA;
      this.issues = [];
    } else {
      return false;
    }
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

  refreshData() {
    this.unitID = null;
    this.unitName = '';
    this.issueName = '';
    this.issueStatus = null;
    this.assetUnitID = null;
    this.suggestedIssues = [];
    this.lastEvaluatedKey = '';
    this.initDataTable();
    this.dataMessage = Constants.FETCHING_DATA;
    this.issues = [];


  }

  cloneIssue(id: string) {
  }
}
