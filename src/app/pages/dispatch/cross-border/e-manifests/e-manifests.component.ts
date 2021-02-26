import { Component, OnInit } from "@angular/core";
import { AfterViewInit, OnDestroy, ViewChild } from "@angular/core";
import { ApiService } from "../../../../services";
import { Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { Subject, timer } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { QueryList, ViewChildren } from "@angular/core";
import * as moment from "moment";

declare var $: any;
@Component({
  selector: "app-e-manifests",
  templateUrl: "./e-manifests.component.html",
  styleUrls: ["./e-manifests.component.css"],
})
export class EManifestsComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChildren(DataTableDirective)
  dtElement: QueryList<DataTableDirective>;

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  dtElementACI: DataTableDirective;

  dtOptionsACI: any = {};
  dtTriggerACI: Subject<any> = new Subject();

  activeDiv = "ace";
  countries = [];
  ACEList = [];
  ACIList = [];
  aceSearch: string = "";
  aciSearch: string = "";
  vehicleID: string = "";
  vehicleIdentification: string;
  currentStatus = "";
  suggestedVehicles = [];
  vehicleIDACI: string = "";
  vehicleIdentificationACI: string;
  suggestedVehiclesACI = [];
  currentStatusACI = "";
  vehicles = [];
  vehiclesList: any = {};
  assetsList: any = {};
  driversList: any = {};
  consigneesList: any = {};
  shippersList: any = {};
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';
  totalACIRecords = 20;
  pageLengthACI = 10;
  lastEvaluatedKeyACI = '';
  aceClass = 'active';
  aciClass = '';
  // Date related fields
  startDate = '';
  endDate = '';
  aciStartDate = '';
  aciEndDate = '';
  aciFromDate = '';
  aciToDate = '';
  fromDate = '';
  toDate = '';
  constructor(
    private apiService: ApiService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.fetchCountries();
    this.ACEEntries();
    this.ACIEntries();
    this.fetchVehiclesList();
    this.fetchAssetsList();
    this.fetchShippersList();
    this.fetchDriversList();
    this.fetchConsigneesList();
    this.initDataTable();
    this.initDataTableACI();
  }
  getSuggestions(value) {
    this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedVehicles = result.Items;
        if (this.suggestedVehicles.length == 0) {
          this.vehicleID = "";
        }
      });
  }
  setVehicle(vehicleID, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleID = vehicleID;

    this.suggestedVehicles = [];
  }
  getSuggestionsACI(value) {
    this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedVehiclesACI = result.Items;
        if (this.suggestedVehiclesACI.length == 0) {
          this.vehicleIDACI = '';
        }
      });
  }
  setVehicleACI(vehicleID, vehicleIdentification) {
    this.vehicleIdentificationACI = vehicleIdentification;
    this.vehicleIDACI = vehicleID;
    this.suggestedVehiclesACI = [];
  }
  fetchVehiclesList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehiclesList = result;
    });
  }
  fetchAssetsList() {
    this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetsList = result;
    });
  }
  fetchDriversList() {
    this.apiService.getData('drivers/get/list').subscribe((result: any) => {
      this.driversList = result;
    });
  }
  fetchConsigneesList() {
    this.apiService.getData('receivers/get/list').subscribe((result: any) => {
      this.consigneesList = result;
    });
  }
  fetchShippersList() {
    this.apiService.getData('shippers/get/list').subscribe((result: any) => {
      this.shippersList = result;
    });
  }
  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
    });
  }
  ACEEntries() {
    this.spinner.show(); // loader init
    this.apiService.getData('ACEeManifest').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
        this.spinner.hide(); // loader hide
      },
    });
  }

  initDataTable() {
    let current = this;
    this.dtOptions = {
      // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [
        //sortable false
        { targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], orderable: false },
      ],
      dom: "lrtip",
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService
          .getDatatablePostData(
            'ACEeManifest/fetchRecords?vehicleID=' +
              this.vehicleID +
              '&aceSearch=' +
              this.aceSearch +
              '&fromDate=' +
              this.fromDate +
              '&toDate=' +
              this.toDate +
              '&lastKey=' +
              this.lastEvaluatedKey,
            dataTablesParameters
          )
          .subscribe((resp) => {
            current.ACEList = resp[`Items`];
            if (resp[`LastEvaluatedKey`] !== undefined) {
              this.lastEvaluatedKey = resp[`LastEvaluatedKey`].entryID;
            } else {
              this.lastEvaluatedKey = '';
            }

            callback({
              recordsTotal: current.totalRecords,
              recordsFiltered: current.totalRecords,
              data: [],
            });
          });
      },
    };
  }
  ngAfterViewInit(): void {
    // if(this.activeDiv == 'ace') {
    this.dtTrigger.next();
    // } else {
    this.dtTriggerACI.next();
    // }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    if (this.activeDiv == 'ace') {
      this.dtTrigger.unsubscribe();
    } else {
      this.dtTriggerACI.unsubscribe();
    }
  }


  searchACEFilter() {
    if (
      this.vehicleID !== '' ||
      this.aceSearch !== '' ||
      this.fromDate !== '' ||
      this.toDate !== ''
    ) {
      // if (this.startDate !== '') {
      //   this.fromDate = moment(this.startDate, 'DD-MM-YYYY').format(
      //     'YYYY-MM-DD'
      //   );
      // } else {
      //   this.fromDate = this.startDate;
      // }
      // if (this.endDate !== '') {
      //   this.toDate = moment(this.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
      // } else {
      //   this.toDate = this.endDate;
      // }

      this.rerender('reset');
    } else {
      return false;
    }
    // console.log('fromdate', this.fromDate, 'to date', this.toDate);
  }

  resetACEFilter() {
    if (
      this.vehicleID !== '' ||
      this.aceSearch !== '' ||
      this.fromDate !== '' ||
      this.toDate !== ''
    ) {
      this.vehicleID = '';
      this.vehicleIdentification = '';
      this.currentStatus = '';
      this.aceSearch = '';
      this.fromDate = '';
      this.toDate = '';
      this.rerender();
    } else {
      return false;
    }
  }
  deleteACEEntry(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
        .getData(`ACEeManifest/isDeleted/${entryID}/` + 1)
        .subscribe((result: any) => {
          this.rerender();
          this.toastr.success('ACE eManifest Entry Deleted Successfully!');
        });
    }
  }

  rerender(status = ""): void {
    this.dtElement.forEach((dtElement: DataTableDirective) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        let tableId = dtInstance.table().node().id;
        if (this.activeDiv == tableId) {
          if (tableId == "ace") {
            // Destroy the table first
            dtInstance.destroy();
            if (status === "reset") {
              this.dtOptions.pageLength = this.totalRecords;
            } else {
              this.dtOptions.pageLength = 10;
            }
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          } else {
            // Destroy the table first
            dtInstance.destroy();
            if (status === "reset") {
              this.dtOptionsACI.pageLength = this.totalACIRecords;
            } else {
              this.dtOptionsACI.pageLength = 10;
            }
            // Call the dtTrigger to rerender again
            this.dtTriggerACI.next();
          }
        }
      });
    });
  }

  // ACI operations
  ACIEntries() {
    // this.activeDiv = 'aci';
    this.spinner.show(); // loader init
    this.apiService.getData("ACIeManifest").subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        // this.ACIList = result.Items;
        this.totalACIRecords = result.Count;
        this.spinner.hide(); // loader hide
      },
    });
  }
  initDataTableACI() {
    let current = this;
    this.dtOptionsACI = {
      // All list options
      pagingType: "full_numbers",
      pageLength: this.pageLengthACI,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [
        //sortable false
        { targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], orderable: false },
      ],
      dom: "lrtip",
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService
          .getDatatablePostData(
            'ACIeManifest/fetchRecords?vehicleID=' +
              this.vehicleIDACI +
              '&aciSearch=' +
              this.aciSearch +
              '&fromDate=' +
              this.aciFromDate +
              '&toDate=' +
              this.aciToDate +
              '&lastKey=' +
              this.lastEvaluatedKeyACI,
            dataTablesParameters
          )
          .subscribe((resp) => {
            current.ACIList = resp[`Items`];
            if (resp[`LastEvaluatedKey`] !== undefined) {
              this.lastEvaluatedKeyACI = resp[`LastEvaluatedKey`].entryID;
            } else {
              this.lastEvaluatedKeyACI = '';
            }

            callback({
              recordsTotal: current.totalACIRecords,
              recordsFiltered: current.totalACIRecords,
              data: [],
            });
          });
      },
    };
  }
  searchACIFilter() {
    if (
      this.vehicleIDACI !== '' ||
      this.aciSearch !== '' ||
      this.aciFromDate !== '' ||
      this.aciToDate !== ''
    ) {
      this.rerender('reset');
    } else {
      return false;
    }
  }

  resetACIFilter() {
    if (
      this.vehicleIDACI !== '' ||
      this.aciSearch !== '' || this.aciFromDate !== '' ||
      this.aciToDate !== ''
    ) {
      this.vehicleIDACI = '';
      this.vehicleIdentificationACI = '';
      this.aciSearch = '';
      this.aciFromDate = '';
      this.aciToDate = '';
      this.rerender();
    } else {
      return false;
    }
  }

  deleteACIEntry(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
        .getData(`ACIeManifest/isDeleted/${entryID}/` + 1)
        .subscribe((result: any) => {
          this.rerender();
          this.toastr.success('ACI eManifest Entry Deleted Successfully!');
        });
    }
  }

  changeTab(tabType) {
    this.activeDiv = tabType;
    if (tabType === 'ace') {
      this.aceClass = 'active';
      this.aciClass = '';
      $('#ace-emanifest').show();
      $('#aci-emanifest').hide();
    } else if (tabType === 'aci') {
      this.aceClass = '';
      this.aciClass = 'active';
      $('#ace-emanifest').hide();
      $('#aci-emanifest').show();
    }
  }
   /***
    * change class of status dynamically
    */
   changeClass(manifestStatus){
  //   switch(manifestStatus) {
  //     case 'Cancelled Manifest': {
  //        console.log('hello') ;
  //        break;
  //     }
  //     default: {
  //        console.log('default view');
  //        break;
  //     }
  //  }
  return 'redBtn';
   }
   manifestClass = 'statusBtn';
}
