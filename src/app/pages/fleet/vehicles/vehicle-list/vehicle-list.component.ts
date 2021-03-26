import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { HereMapService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import  Constants  from '../../constants';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css'],
})
export class VehicleListComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  title = 'Vehicle List';
  vehicles = [];
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

  vehicleNext = false;
  vehiclePrev = true;
  vehicleDraw = 0;
  vehiclePrevEvauatedKeys = [''];
  vehicleStartPoint = 1;
  vehicleEndPoint = this.pageLength;

  constructor(private apiService: ApiService, private hereMap: HereMapService, private toastr: ToastrService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.fetchGroups();
    this.fetchVehiclesCount();
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

    value = value.toLowerCase();
    if(value != '') {
      this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedVehicles = result.Items;
      });
    } else {
      this.suggestedVehicles = []
    }
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
  
  fetchVehiclesCount() {
    this.apiService.getData('vehicles/get/count?vehicle='+this.vehicleID+'&status='+this.currentStatus).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;

        if(this.vehicleID != '' || this.currentStatus != '') {
          this.vehicleEndPoint = this.totalRecords;
        }
      },
    });
  }

  setVehicle(vehicleID, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleID = vehicleIdentification;
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
    this.spinner.show();
    this.apiService.getData('vehicles/fetch/records?vehicle='+this.vehicleID+'&status='+this.currentStatus + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedVehicles = [];
        this.getStartandEndVal();
        this.vehicles = result['Items'];

        if(this.vehicleID != '') {
          this.vehicleStartPoint = 1;
          this.vehicleEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.vehicleNext = false;
          // for prev button
          if (!this.vehiclePrevEvauatedKeys.includes(result['LastEvaluatedKey'].vehicleID)) {
            this.vehiclePrevEvauatedKeys.push(result['LastEvaluatedKey'].vehicleID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].vehicleID;
          
        } else {
          this.vehicleNext = true;
          this.lastEvaluatedKey = '';
          this.vehicleEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.vehicleDraw > 0) {
          this.vehiclePrev = false;
        } else {
          this.vehiclePrev = true;
        }
        this.spinner.hide();
      });
  }

  searchFilter() {
    if (this.vehicleIdentification !== '' || this.currentStatus !== '') {
      if(this.vehicleID == '') {
        this.vehicleID = this.vehicleIdentification;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.vehicles = [];
      this.suggestedVehicles = [];
      this.fetchVehiclesCount();
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.vehicleIdentification !== '' || this.currentStatus !== '') {
      this.vehicleID = '';
      this.suggestedVehicles = [];
      this.vehicleIdentification = '';
      this.currentStatus = '';
      this.vehicles = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchVehiclesCount();
      this.initDataTable();
      this.resetCountResult();
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
        this.fetchVehiclesCount();
        this.initDataTable();
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

  getStartandEndVal() {
    this.vehicleStartPoint = this.vehicleDraw * this.pageLength + 1;
    this.vehicleEndPoint = this.vehicleStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.vehicleNext = true;
    this.vehiclePrev = true;
    this.vehicleDraw += 1;
    this.initDataTable();
    // this.getStartandEndVal();
  }

  // prev button func
  prevResults() {
    this.vehicleNext = true;
    this.vehiclePrev = true;
    this.vehicleDraw -= 1;
    this.lastEvaluatedKey = this.vehiclePrevEvauatedKeys[this.vehicleDraw];
    this.initDataTable();
    // this.getStartandEndVal();
  }

  resetCountResult() {
    this.vehicleStartPoint = 1;
    this.vehicleEndPoint = this.pageLength;
    this.vehicleDraw = 0;
  }
}
