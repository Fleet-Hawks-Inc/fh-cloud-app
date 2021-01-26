import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject,timer } from 'rxjs';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { HereMapService } from '../../../../services';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css'],
})
export class VehicleListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = 'Vehicle List';
  vehicles = [];
  // dtOptions: any = {};
  suggestedVehicles = [];
  vehicleID = '';
  currentStatus = '';
  vehicleIdentification = '';
  allOptions: any = {};
  groupsList: any = {};
  vehicleModelList: any = {};
  vehicleManufacturersList: any = {};
  constructor(private apiService: ApiService,private toastr: ToastrService, private hereMap: HereMapService) {}
  currentView = 'list';


  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  // constructor(private apiService: ApiService, private hereMap: HereMapService, private toastr: ToastrService) {}


  ngOnInit() {
    this.fetchGroups();
    this.fetchVehicles();
    this.fetchVehicleModelList();
    this.fetchVehicleManufacturerList();
    this.initDataTable();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }
  getSuggestions(value) {
    this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedVehicles = result.Items;
        if(this.suggestedVehicles.length == 0){
          this.vehicleID = '';
        }
      });
  }
  fetchGroups() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groupsList = result;
    });
  }
  fetchVehicleModelList() {
    this.apiService.getData('vehicleModels/get/list').subscribe((result: any) => {
      this.vehicleModelList = result;
    });
  }
  fetchVehicleManufacturerList() {
    this.apiService.getData('manufacturers/get/list').subscribe((result: any) => {
      this.vehicleManufacturersList = result;
    });
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        // this.vehicles = result.Items;
        this.totalRecords = result.Count;
      },
    });
  }
  setVehicle(vehicleID, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleID = vehicleID;

    this.suggestedVehicles = [];
  }

/*
  deleteVehicle(vehicleId) {
    this.apiService
      .deleteData('vehicles/' + vehicleId)
      .subscribe((result: any) => {
        this.toastr.success('Vehicle Deleted Successfully!');
        this.fetchVehicles();
      });
  }
  */


  /**
   * change the view of summary
   */
  changeView(){
    if(this.currentView == 'list'){
      this.currentView = 'map'
      setTimeout(() => {
        this.hereMap.mapInit();
      }, 500);
    }else {
      this.currentView = 'list';
    }
  }

  /**
   * export excel
   */
  export() {
    $('.buttons-excel').trigger('click');
  }

  initDataTable() {
    let current = this;
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        { "targets": [0,1,2,3,4,5,6,7,8,9,10,11,12], "orderable": false },
      ],
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('vehicles/fetch-records?vehicleID='+this.vehicleID+'&status='+this.currentStatus + '&lastKey=' + this.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
          current.vehicles = resp['Items'];
          if (resp['LastEvaluatedKey'] !== undefined) {
            this.lastEvaluatedKey = resp['LastEvaluatedKey'].vehicleID;

          } else {
            this.lastEvaluatedKey = '';
          }

          callback({
            recordsTotal: current.totalRecords,
            recordsFiltered: current.totalRecords,
            data: []
          });
        });
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(status = ''): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      if (status === 'reset') {
        this.dtOptions.pageLength = this.totalRecords;
      } else {
        this.dtOptions.pageLength = 10;
      }
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  searchFilter() {
    if (this.vehicleID !== '' || this.currentStatus !== '') {
      this.rerender('reset');
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.vehicleID !== '' || this.currentStatus !== '') {
      this.vehicleID = '';
      this.vehicleIdentification = '';
      this.currentStatus = '';
      this.rerender();
    } else {
      return false;
    }
  }

  deleteVehicle(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`vehicles/isDeleted/${entryID}/`+1)
      .subscribe((result: any) => {
        this.rerender();
        this.toastr.success('Vehicle Deleted Successfully!');
      });
    }
  }
}
