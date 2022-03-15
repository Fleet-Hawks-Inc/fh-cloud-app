import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../../services";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
declare var $: any;
import { ToastrService } from "ngx-toastr";
import Constants from "../../../constants";
import { environment } from "../../../../../../environments/environment";
import { nullSafeIsEquivalent } from "@angular/compiler/src/output/output_ast";
@Component({
  selector: "app-service-list",
  templateUrl: "./service-list.component.html",
  styleUrls: ["./service-list.component.css"],
})
export class ServiceListComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  dataMessageVendorDtl: string = Constants.FETCHING_DATA;
  title = "Service Logs";
  // dtOptions: any = {};
  logs = [];

  suggestedVehicles = [];
  vehicleID = null;
  taskID = null;
  currentStatus = "";
  vehicleIdentification = "";
  vehiclesObject: any = {};
  vendorsObject: any = {};
  issuesObject: any = {};
  assetsObject: any = {};

  tasks = [];
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
  constructor(
    private apiService: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.initDataTable();
    this.fetchTasks();
    this.fetchAllVehiclesIDs();
    this.fetchAllVendorsIDs();
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

  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/list/minor').subscribe((result: any) => {
      this.vehiclesObject = result.Items;

    });
  }

  fetchAllVendorsIDs() {
    this.apiService
      .getData("contacts/get/list/vendor")
      .subscribe((result: any) => {
        this.vendorsObject = result;
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
    if (this.lastEvaluatedKey !== "end") {
      this.apiService
        .getData(
          "serviceLogs/fetch/records?searchValue=" +
          this.searchValue +
          "&taskID=" +
          this.taskID +
          "&category=" +
          this.category +
          "&lastKey=" +
          this.lastEvaluatedKey
        )
        .subscribe((result: any) => {
          if (result.Items.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }

          if (result.Items.length > 0) {
            if (result.LastEvaluatedKey !== undefined) {
              this.lastEvaluatedKey = encodeURIComponent(
                result.Items[result.Items.length - 1].logSK
              );
              let lastEvalKey = result[`LastEvaluatedKey`].logSK.replace(
                /#/g,
                "--"
              );
              this.lastEvaluatedKey = lastEvalKey;
            } else {
              this.lastEvaluatedKey = "end";
            }
            this.logs = this.logs.concat(result.Items);

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
    if (this.searchValue != null || this.category != null || this.taskID != null) {
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
    if (this.searchValue != null || this.category != null || this.taskID != null) {
      this.vehicleID = null;
      this.dataMessage = Constants.FETCHING_DATA;
      this.searchValue = null;
      this.category = null;
      this.taskID = null;
      this.lastEvaluatedKey = "";
      this.logs = [];
      this.initDataTable();
      // this.resetCountResult();
    } else {
      return false;
    }
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
}