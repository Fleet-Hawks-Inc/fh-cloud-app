import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import Constants from '../../../constants';
import { environment } from '../../../../../../environments/environment';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {

  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  dataMessageVendorDtl: string = Constants.FETCHING_DATA;
  title = 'Service Logs';
  // dtOptions: any = {};
  logs = [];

  suggestedVehicles = [];
  vehicleID = null;
  taskID = null;
  currentStatus = '';
  vehicleIdentification = '';
  vehiclesObject: any = {};
  vendorsObject: any = {};
  issuesObject: any = {};
  assetsObject: any = {};

  tasks = [];
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  serviceLogNext = false;
  serviceLogPrev = true;
  serviceLogDraw = 0;
  serviceLogPrevEvauatedKeys = [''];
  serviceLogStartPoint = 1;
  serviceLogEndPoint = this.pageLength;

  vendorAddress: any;
  vendorsData: any;
  vendorTextStatus = false;
  basicActive = 'active';
  addressActive = '';
  allVehicles = [];
  allAssets = [];
  assetID = null;

  constructor(
      private apiService: ApiService,
      private router: Router,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
    ) {}

  ngOnInit() {
    this.fetchLogsCount();
    this.fetchTasks();
    this.fetchAllVehiclesIDs();
    this.fetchAllVendorsIDs();
    this.fetchAllIssuesIDs();
    this.fetchAllAssetsIDs();
    this.initDataTable();
    this.fetchAllAssets();
    this.fetchAllVehicles();
  }

  getSuggestions(value) {
    this.suggestedVehicles = [];
    this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedVehicles = result.Items;
      });
  }

  setVehicle(vehicleID, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleID = vehicleID;

    this.suggestedVehicles = [];
  }

  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/get/list')
      .subscribe((result: any) => {
        this.vehiclesObject = result;
      });
  }

  fetchAllVendorsIDs() {
    this.apiService.getData('vendors/get/list')
      .subscribe((result: any) => {
        this.vendorsObject = result;
      });
  }

  fetchAllIssuesIDs() {
    this.apiService.getData('issues/get/list')
      .subscribe((result: any) => {
        this.issuesObject = result;
      });
  }

  fetchAllAssetsIDs() {
    this.apiService.getData('assets/get/list')
      .subscribe((result: any) => {
        this.assetsObject = result;
      });
  }

  /*
   * Get all tasks from api
   */
  fetchTasks() {
    this.apiService.getData('tasks').subscribe((result: any) => {
      this.tasks = result.Items;
    });
  }

  fetchLogsCount() {
    this.apiService.getData('serviceLogs/get/count?vehicleID='+this.vehicleID+'&asset=' +this.assetID+ '&taskID='+this.taskID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;

        if(this.vehicleID != null || this.assetID != null || this.taskID != null) {
          this.serviceLogEndPoint = this.totalRecords;
        }
      },
    });
  }

  gotoIssue(issue){
    localStorage.setItem('issueID', issue);
    this.router.navigateByUrl('/fleet/maintenance/issues/detail/'+issue);
  }

  openComponent(vendorID) {
    this.vendorsData = [];
    localStorage.setItem('vendorID', vendorID);
    $('#vendorDtlModal').modal('show');
    this.basicActive = 'active';
    this.addressActive = '';
    this.vendorTextStatus = true;
    this.apiService.getData(`vendors/${vendorID}`).subscribe(res => {
      this.vendorTextStatus = false;
      this.vendorsData =  res.Items[0];
      this.vendorAddress = res.Items[0].address;
    })
  }
  initDataTable() {

    this.apiService.getData('serviceLogs/fetch/records?vehicleID='+this.vehicleID + '&taskID='+this.taskID +'&asset=' +this.assetID + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedVehicles = [];
        this.getStartandEndVal();

        this.logs = result['Items'];
        if(this.vehicleID != null || this.assetID != null || this.taskID != null) {
          this.serviceLogStartPoint = 1;
          this.serviceLogEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.serviceLogNext = false;
          // for prev button
          if (!this.serviceLogPrevEvauatedKeys.includes(result['LastEvaluatedKey'].logID)) {
            this.serviceLogPrevEvauatedKeys.push(result['LastEvaluatedKey'].logID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].logID;
          
        } else {
          this.serviceLogNext = true;
          this.lastEvaluatedKey = '';
          this.serviceLogEndPoint = this.totalRecords;
        }

        if(this.totalRecords < this.serviceLogEndPoint) {
          this.serviceLogEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.serviceLogDraw > 0) {
          this.serviceLogPrev = false;
        } else {
          this.serviceLogPrev = true;
        }
        this.spinner.hide();
      }, err => {
        
      });
  }

  searchFilter() {
    if(this.vehicleID != null || this.assetID != null || this.taskID != null) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.logs = [];
      this.fetchLogsCount();
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.vehicleID != null || this.assetID != null || this.taskID != null) {
      this.vehicleID = null;
      this.dataMessage = Constants.FETCHING_DATA;
      this.vehicleIdentification = '';
      this.assetID = null;
      this.taskID = null;
      this.logs = [];
      this.fetchLogsCount();
      this.initDataTable();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  deleteProgram(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`serviceLogs/isDeleted/${entryID}/`+1)
      .subscribe((result: any) => {
        this.logs = [];
        this.serviceLogDraw = 0;
        this.lastEvaluatedKey = '';
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchLogsCount();
        this.initDataTable();
        this.toastr.success('Service log deleted successfully!');
      });
    }
  }
  
  getStartandEndVal() {
    this.serviceLogStartPoint = this.serviceLogDraw * this.pageLength + 1;
    this.serviceLogEndPoint = this.serviceLogStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.serviceLogNext = true;
    this.serviceLogPrev = true;
    this.serviceLogDraw += 1;
    this.initDataTable();
  }

  // prev button func
  prevResults() {
    this.serviceLogNext = true;
    this.serviceLogPrev = true;
    this.serviceLogDraw -= 1;
    this.lastEvaluatedKey = this.serviceLogPrevEvauatedKeys[this.serviceLogDraw];
    this.initDataTable();
  }

  resetCountResult() {
    this.serviceLogStartPoint = 1;
    this.serviceLogEndPoint = this.pageLength;
    this.serviceLogDraw = 0;
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
