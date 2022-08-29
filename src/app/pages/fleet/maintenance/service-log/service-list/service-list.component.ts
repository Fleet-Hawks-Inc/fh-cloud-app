import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { ApiService } from "../../../../../services";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';
declare var $: any;
import { Table } from 'primeng/table';
import { ToastrService } from "ngx-toastr";
import * as _ from 'lodash';
import Constants from "../../../constants";
import { environment } from "../../../../../../environments/environment";
import { nullSafeIsEquivalent } from "@angular/compiler/src/output/output_ast";
@Component({
  selector: "app-service-list",
  templateUrl: "./service-list.component.html",
  styleUrls: ["./service-list.component.css"],
})
export class ServiceListComponent implements OnInit {
  @ViewChild('dt') table: Table;
    get = _.get;
  _selectedColumns: any[];

  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  dataMessageVendorDtl: string = Constants.FETCHING_DATA;
  title = "Service Logs";
  // dtOptions: any = {};
  logs = [];
  sessionID: string;

  suggestedVehicles = [];
  vehicleID = null;
  taskID = null;
  currentStatus = "";
  vehicleIdentification = "";
  vehiclesObject: any = {};
  vendorsObject: any = {};
  issuesObject: any = {};
  assetsObject: any = {};
  datee = '';
  tasks = [];
  startDate: '';
  endDate: '';
  start = null;
  end = null;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = "";

  serviceLogNext = false;
  serviceLogPrev = true;
  serviceLogDraw = 0;
  serviceLogPrevEvauatedKeys = [""];
  serviceLogStartPoint = 1;
  serviceLogEndPoint = this.pageLength;

  vendorAddress: any;
  vendorsData: any;
  vendorTextStatus = false;
  basicActive = "active";
  dataColumns: any[];
  addressActive = "";
  allVehicles = [];
  allAssets = [];
  assetID = null;
  loaded = false;
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
  
   // columns of data table

  constructor(
    private apiService: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private routerMgmtService: RouteManagementServiceService
  ) {
      this.sessionID = this.routerMgmtService.serviceLogSessionID;
  }

  ngOnInit() {
    this.initDataTable();
    this.dataColumns = [
    { field: 'unitType', header: 'Unit Type', type: 'text' },
    { field: 'unitName', header: 'Vehicle/Asset', type: 'text' },
    { field: 'odometer', header: 'Odometer', type: 'text' },
    { field: 'taskList', header: 'Service Task', type: 'text' },
    { field: 'completionDate', header: 'Completion Date', type: 'text' },
    { field: 'logsTotal', header: 'Total', type: 'text' },
    { field: 'currentStatus', header: 'Status', type: 'text' },
  ];
  this._selectedColumns = this.dataColumns;
    this.fetchTasks();
    this.setToggleOptions();
    this.fetchAllVehiclesIDs();
    this.fetchAllIssuesIDs();
    this.fetchAllAssetsIDs();
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



  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/list/minor').subscribe((result: any) => {
      this.vehiclesObject = result.Items;

    });
  }

  fetchAllIssuesIDs() {
    this.apiService.getData("issues/get/list").subscribe((result: any) => {
      this.issuesObject = result;
    });
  }

  fetchAllAssetsIDs() {
    this.apiService.getData('assets/get/minor/details').subscribe((result: any) => {
      this.assetsObject = result.Items;
    });
  }

  /*
   * Get all tasks from api
   */
  fetchTasks() {
    this.apiService.getData('tasks?type=service').subscribe((result: any) => {
      this.tasks = result;
    })
  }

  gotoIssue(issue) {
    localStorage.setItem("issueID", issue);
    this.router.navigateByUrl("/fleet/maintenance/issues/detail/" + issue);
  }

  openComponent(vendorID) {
    this.vendorsData = [];
    localStorage.setItem("vendorID", vendorID);
    $("#vendorDtlModal").modal("show");
    this.basicActive = "active";
    this.addressActive = "";
    this.vendorTextStatus = true;
    this.apiService.getData(`contacts/detail/${vendorID}`).subscribe((res) => {
      this.vendorTextStatus = false;
      this.vendorsData = res.Items[0];
      this.vendorAddress = res.Items[0].adrs;
    });
  }

  initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
        this.apiService.getData(`serviceLogs/fetch/serviceLogReport?searchValue=${this.searchValue}&category=${this.category}&taskID=${this.taskID}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastEvaluatedKey}&date=${this.datee}`)
        .subscribe((result: any) => {
          if (result.Items.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.loaded = true;
          }
           if (result.Items.length > 0) {
            if (result.LastEvaluatedKey !== undefined) {
              this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].logSK);
            }
            else {
              this.lastEvaluatedKey = 'end'
            }
            this.logs = this.logs.concat(result.Items)
            this.loaded = true;
            for(let data of result.Items){
            data.logsTotal = (data.allServiceParts.total + data.allServiceTasks.total) + ' ' + data.allServiceParts.currency
            for(let item of data.allServiceTasks.serviceTaskList){
            data.taskList = item.taskName ? item.taskName : '-';
            }
            }
          }
        });
    }
  }
  

  
  categoryChange() {
    this.searchValue = null;

  }
  searchFilter() {
    if (this.searchValue != null || this.category != null || this.taskID != null || this.start !== null || this.end !== null) {
      if (this.searchValue != null && this.category == null) {
        this.toastr.error('Please select both searchValue and category.');
        return false;
      } else if (this.searchValue == null && this.category != null) {
        this.toastr.error('Please select both searchValue and category.');
        return false;
      }
      else {
        this.dataMessage = Constants.FETCHING_DATA;
        this.logs = [];
        this.lastEvaluatedKey = "";
        this.initDataTable();
      }
    }
    else {
      return false;
    }
  }

  resetFilter() {
    if (this.searchValue != null || this.category != null || this.taskID != null || this.start !== null || this.end !== null) {
      this.vehicleID = null;
      this.dataMessage = Constants.FETCHING_DATA;
      this.searchValue = null;
      this.category = null;
      this.taskID = null;
      this.start = null;
      this.end = null;
      this.datee = null;
      this.lastEvaluatedKey = "";
      this.logs = [];
      this.initDataTable();
      // this.resetCountResult();
    } else {
      return false;
    }
  }

  refreshData() {
    this.vehicleID = null;
    this.searchValue = null;
    this.category = null;
    this.dataMessage = Constants.FETCHING_DATA;
    this.taskID = null;
    this.logs = [];
    this.lastEvaluatedKey = "";
    this.initDataTable();
  }
        onScroll = async (event: any) => {
        if (this.loaded) {
            this.initDataTable();
        }
        this.loaded = false;
    }

  clearInput() {
    this.suggestedVehicles = null;
  }


  clearSuggestions() {
    this.vehicleIdentification = null;
  }



  deleteProgram(eventData) {
    if (confirm("Are you sure you want to delete?") === true) {
      let record = {
        eventID: eventData.logID,
        entityID: eventData.unitID,
      };
      this.apiService
        .deleteData(
          `serviceLogs/delete/${eventData.logID}/${eventData.unitType}/${eventData.unitID}`
        )
        .subscribe((result: any) => {
          this.logs = [];
          this.serviceLogDraw = 0;
          this.lastEvaluatedKey = "";
          this.dataMessage = Constants.FETCHING_DATA;
          this.initDataTable();
          this.toastr.success("Service log deleted successfully!");
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
  
}