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
  serviceProgramsList:any = {};
  driversList:any = {};
  vendorsList:any = {};
  currentView = 'list';

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  hideShow = {
    vin: true,
    vehicleName: true,
    vehicleType: true,
    make: true,
    model: true,
    lastLocation: true,
    trip: true,
    plateNo: true,
    fuelType: true,
    status: true,
    group: true,
    ownership: true,
    driver: false,
    serviceProgram: false,
    serviceDate: false,
    insuranceVendor: false,
    insuranceAmount: false,
    engineSummary: false,
    primaryMeter: false,
    fuelUnit: false,
  }

  constructor(private apiService: ApiService, private hereMap: HereMapService, private toastr: ToastrService) {}

  ngOnInit() {
    this.fetchGroups();
    this.fetchVehicles();
    this.fetchVehicleModelList();
    this.fetchVehicleManufacturerList();
    this.fetchDriversList();
    this.fetchServiceProgramsList();
    this.fetchVehiclesList();
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
  fetchDriversList() {
    this.apiService.getData('drivers/get/list').subscribe((result: any) => {
      this.driversList = result;
    });
  }

  fetchServiceProgramsList() {
    this.apiService.getData('servicePrograms/get/list').subscribe((result: any) => {
      this.serviceProgramsList = result;
    });
  }

  fetchVehiclesList() {
    this.apiService.getData('vendors/get/list').subscribe((result: any) => {
      this.vendorsList = result;
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
        { "targets": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], "orderable": false },
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
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
      this.vehicles = [];
      this.fetchVehicles();
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
      this.vehicles = [];
      this.fetchVehicles();
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

        this.vehicles = [];
        this.fetchVehicles();
        this.rerender();
        this.toastr.success('Vehicle Deleted Successfully!');
      });
    }
  }

  hideShowColumn() {
    //for headers
    if(this.hideShow.vin == false) {
      $('.col1').css('display','none');
    } else {
      $('.col1').css('display','');
    }

    if(this.hideShow.vehicleName == false) {
      $('.col2').css('display','none');
    } else {
      $('.col2').css('display','');
    }

    if(this.hideShow.vehicleType == false) {
      $('.col3').css('display','none');
    } else {
      $('.col3').css('display','');
    }

    if(this.hideShow.make == false) {
      $('.col4').css('display','none');
    } else {
      $('.col4').css('display','');
    }

    if(this.hideShow.model == false) {
      $('.col5').css('display','none');
    } else {
      $('.col5').css('display','');
    }

    if(this.hideShow.lastLocation == false) {
      $('.col6').css('display','none');
    } else {
      $('.col6').css('display','');
    }

    if(this.hideShow.trip == false) {
      $('.col7').css('display','none');
    } else {
      $('.col7').css('display','');
    }

    if(this.hideShow.plateNo == false) {
      $('.col8').css('display','none');
    } else {
      $('.col8').css('display','');
    }

    if(this.hideShow.fuelType == false) {
      $('.col9').css('display','none');
    } else {
      $('.col9').css('display','');
    }

    if(this.hideShow.status == false) {
      $('.col10').css('display','none');
    } else {
      $('.col10').css('display','');
    }

    if(this.hideShow.group == false) {
      $('.col11').css('display','none');
    } else {
      $('.col11').css('display','');
    }

    if(this.hideShow.ownership == false) {
      $('.col12').css('display','none');
    } else {
      $('.col12').css('display','');
    }

    //extra columns
    if(this.hideShow.driver == false) {
      $('.col13').css('display','none');
    } else { 
      $('.col13').removeClass('extra');
      $('.col13').css('display','');
    }

    if(this.hideShow.serviceProgram == false) {
      $('.col14').css('display','none');
    } else { 
      $('.col14').removeClass('extra');
      $('.col14').css('display','');
    }

    if(this.hideShow.serviceDate == false) {
      $('.col15').css('display','none');
    } else { 
      $('.col15').removeClass('extra');
      $('.col15').css('display','');
    }
    
    if(this.hideShow.insuranceVendor == false) {
      $('.col16').css('display','none');
    } else { 
      $('.col16').removeClass('extra');
      $('.col16').css('display','');
    }

    if(this.hideShow.insuranceAmount == false) {
      $('.col17').css('display','none');
    } else { 
      $('.col17').removeClass('extra');
      $('.col17').css('display','');
    }

    if(this.hideShow.engineSummary == false) {
      $('.col18').css('display','none');
    } else { 
      $('.col18').removeClass('extra');
      $('.col18').css('display','');
    }

    if(this.hideShow.primaryMeter == false) {
      $('.col19').css('display','none');
    } else { 
      $('.col19').removeClass('extra');
      $('.col19').css('display','');
    }

    if(this.hideShow.fuelUnit == false) {
      $('.col20').css('display','none');
    } else { 
      $('.col20').removeClass('extra');
      $('.col20').css('display','');
    }
  }
}
