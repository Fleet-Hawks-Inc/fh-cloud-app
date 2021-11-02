import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { ApiService, HereMapService } from '../../../../services';
import { OnboardDefaultService } from '../../../../services/onboard-default.service';
import Constants from '../../constants';
declare var $: any;
@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css'],
})
export class VehicleListComponent implements OnInit {
  liveModalTimeout: any;
  liveStreamVehicle: string;
  environment = environment.isFeatureEnabled;
  url: any;
  dataMessage: string = Constants.FETCHING_DATA;
  title = 'Vehicle List';
  vehicles = [];
  suggestedVehicles = [];
  vehicleID = '';
  currentStatus = null;
  vehicleIdentification = '';
  allOptions: any = {};
  groupsList: any = {};
  vehicleModelList: any = {};
  vehicleManufacturersList: any = {};
  serviceProgramsList: any = {};
  driversList: any = {};
  vendorsList: any = {};
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
    trip: false,
    plateNo: true,
    fuelType: true,
    status: true,
    group: false,
    ownership: true,
    driver: true,
    serviceProgram: false,
    serviceDate: false,
    insuranceVendor: false,
    insuranceAmount: false,
    engineSummary: false,
    primaryMeter: false,
    fuelUnit: false,
    startDate: true,
    year: true,
    annualSafety: true,
    teamDriver: true
  }

  vehicleNext = false;
  vehiclePrev = true;
  vehicleDraw = 0;
  vehiclePrevEvauatedKeys = [''];
  vehicleStartPoint = 1;
  vehicleEndPoint = this.pageLength;
  vehicleTypeObects: any = {};

  constructor(private apiService: ApiService, private httpClient: HttpClient, private hereMap: HereMapService, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private onboard: OnboardDefaultService, protected _sanitizer: DomSanitizer, private modalService: NgbModal) {
  }


  ngOnInit() {

    this.onboard.checkInspectionForms();
    this.fetchGroups();
    this.fetchVehiclesCount();
    // this.fetchVehicleModelList();
    // this.fetchVehicleManufacturerList();
    this.fetchDriversList();
    this.fetchServiceProgramsList();
    this.fetchVendorList();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });

    this.httpClient.get('assets/vehicleType.json').subscribe((data: any) => {
      this.vehicleTypeObects = data.reduce((a: any, b: any) => {
        return a[b['code']] = b['name'], a;
      }, {});
    });

  }

  getSuggestions = _.debounce(function (value) {

    value = value.toLowerCase();
    if (value != '') {
      this.apiService
        .getData(`vehicles/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestedVehicles = result;
        });
    } else {
      this.suggestedVehicles = []
    }
  }, 800);

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

  // fetchVehicleManufacturerList() {
  //   this.apiService.getData('manufacturers/get/list').subscribe((result: any) => {
  //     this.vehicleManufacturersList = result;
  //   });
  // }

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

  fetchVendorList() {
    this.apiService.getData('contacts/get/list/vendor').subscribe((result: any) => {
      this.vendorsList = result;
    });
  }

  fetchVehiclesCount() {
    this.apiService.getData('vehicles/get/count?vehicle=' + this.vehicleID + '&status=' + this.currentStatus).subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.totalRecords = result.Count;
        if (this.vehicleID != '' || this.currentStatus != null) {
          this.vehicleEndPoint = this.totalRecords;
        }

        this.initDataTable();
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
  changeView() {
    if (this.currentView == 'list') {
      this.currentView = 'map'
      setTimeout(() => {
        this.hereMap.mapInit();
      }, 500);
    } else {
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
    this.apiService.getData('vehicles/fetch/records?vehicle=' + this.vehicleID + '&status=' + this.currentStatus + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe(async (result: any) => {
        if (result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedVehicles = [];
        this.getStartandEndVal();
        result['Items'].map((v) => {
          v.url = `/fleet/vehicles/detail/${v.vehicleID}`;
        })
        this.vehicles = result['Items'];

        if (this.vehicleID != '') {
          this.vehicleStartPoint = 1;
          this.vehicleEndPoint = this.totalRecords;
        }


        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].vehicleSK.replace(/#/g, '--');
          this.vehicleNext = false;
          // for prev button
          if (!this.vehiclePrevEvauatedKeys.includes(lastEvalKey)) {
            this.vehiclePrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKey = lastEvalKey;

        } else {
          this.vehicleNext = true;
          this.lastEvaluatedKey = '';
          this.vehicleEndPoint = this.totalRecords;
        }

        if (this.totalRecords < this.vehicleEndPoint) {
          this.vehicleEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.vehicleDraw > 0) {
          this.vehiclePrev = false;
        } else {
          this.vehiclePrev = true;
        }

        this.spinner.hide();
        await this.getDashCamConnection(this.vehicles);
        await this.getDashCamStatus(this.vehicles);
      });
  }

  /**
   * Get device status dashCam Connection
   * @param vehicleList all the vehicles
   */
  async getDashCamConnection(vehicleList: any) {
    if (vehicleList && vehicleList.length > 0) {
      for (const data of vehicleList) {
        if (data.deviceInfo) {
          data['isDashCam'] = true;

        }
      }
    }

  }

  /**
   * Get device status from DashCam
   * @param vehicleList all the vehicles
   */
  async getDashCamStatus(vehicleList: any) {
    if (vehicleList && vehicleList.length > 0) {
      for (const data of vehicleList) {
        if (data.deviceInfo) {
          const response: any = await this.apiService.postData('vehicles/dashCam/status', { deviceId: data.deviceInfo[0].deviceSrNo.split('#')[1] }).toPromise();
          if (response && response.isOnline !== undefined) {
            data['isDashOnline'] = response.isOnline;
          }
        }
      }
    }

  }

  searchFilter() {
    if (this.vehicleIdentification !== '' || this.currentStatus !== null) {
      this.vehicleIdentification = this.vehicleIdentification.toLowerCase();
      if (this.vehicleID == '') {
        this.vehicleID = this.vehicleIdentification;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.vehicles = [];
      this.suggestedVehicles = [];
      this.fetchVehiclesCount();
      // this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.vehicleIdentification !== '' || this.currentStatus !== null) {
      this.vehicleID = '';
      this.suggestedVehicles = [];
      this.vehicleIdentification = '';
      this.currentStatus = null;
      this.vehicles = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchVehiclesCount();
      // this.initDataTable();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  deleteVehicle(eventData) {
    if (confirm('Are you sure you want to delete?') === true) {
      // let record = {
      //   date: eventData.createdDate,
      //   time: eventData.createdTime,
      //   eventID: eventData.vehicleID,
      //   status: eventData.currentStatus
      // }
      this.apiService.deleteData(`vehicles/delete/${eventData.vehicleID}/${eventData.vehicleIdentification}`).subscribe((result: any) => {

        this.vehicles = [];
        this.vehicleDraw = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        this.fetchVehiclesCount();
        // this.initDataTable();
        this.toastr.success('Vehicle Deleted Successfully!');
      });
    }
  }

  hideShowColumn() {
    //for headers
    if (this.hideShow.vin == false) {
      $('.col1').css('display', 'none');
    } else {
      $('.col1').css('display', '');
    }

    if (this.hideShow.vehicleName == false) {
      $('.col2').css('display', 'none');
    } else {
      $('.col2').css('display', '');
    }

    if (this.hideShow.vehicleType == false) {
      $('.col3').css('display', 'none');
    } else {
      $('.col3').css('display', '');
    }

    if (this.hideShow.make == false) {
      $('.col4').css('display', 'none');
    } else {
      $('.col4').css('display', '');
    }

    if (this.hideShow.model == false) {
      $('.col5').css('display', 'none');
    } else {
      $('.col5').removeClass('extra');
      $('.col5').css('display', '');
      $('.col5').css('min-width', '120px');
    }

    if (this.hideShow.lastLocation == false) {
      $('.col6').css('display', 'none');
    } else {
      $('.col6').css('display', '');
    }

    if (this.hideShow.trip == false) {
      $('.col7').css('display', 'none');
    } else {
      $('.col7').removeClass('extra');
      $('.col7').css('display', '');
      $('.col7').css('min-width', '200px');
    }

    if (this.hideShow.plateNo == false) {
      $('.col8').css('display', 'none');
    } else {
      $('.col8').css('display', '');
    }

    if (this.hideShow.fuelType == false) {
      $('.col9').css('display', 'none');
    } else {
      $('.col9').css('display', '');
    }

    if (this.hideShow.status == false) {
      $('.col10').css('display', 'none');
    } else {
      $('.col10').css('display', '');
    }

    if (this.hideShow.group == false) {
      $('.col11').css('display', 'none');
    } else {
      $('.col11').removeClass('extra');
      $('.col11').css('display', '');
      $('.col11').css('min-width', '200px');
    }

    if (this.hideShow.ownership == false) {
      $('.col12').css('display', 'none');
    } else {
      $('.col12').removeClass('extra');
      $('.col12').css('display', '');
      $('.col12').css('min-width', '200px');
    }

    //extra columns
    if (this.hideShow.driver == false) {
      $('.col13').css('display', 'none');
    } else {
      $('.col13').removeClass('extra');
      $('.col13').css('display', '');
      $('.col13').css('min-width', '200px');
    }

    if (this.hideShow.serviceProgram == false) {
      $('.col14').css('display', 'none');
    } else {
      $('.col14').removeClass('extra');
      $('.col14').css('display', '');
      $('.col14').css('min-width', '200px');
    }

    if (this.hideShow.serviceDate == false) {
      $('.col15').css('display', 'none');
    } else {
      $('.col15').removeClass('extra');
      $('.col15').css('display', '');
      $('.col15').css('min-width', '200px');
    }

    if (this.hideShow.insuranceVendor == false) {
      $('.col16').css('display', 'none');
    } else {
      $('.col16').removeClass('extra');
      $('.col16').css('display', '');
      $('.col16').css('min-width', '200px');
    }

    if (this.hideShow.insuranceAmount == false) {
      $('.col17').css('display', 'none');
    } else {
      $('.col17').removeClass('extra');
      $('.col17').css('display', '');
      $('.col17').css('min-width', '200px');
    }

    if (this.hideShow.engineSummary == false) {
      $('.col18').css('display', 'none');
    } else {
      $('.col18').removeClass('extra');
      $('.col18').css('display', '');
      $('.col18').css('min-width', '200px');
    }

    if (this.hideShow.primaryMeter == false) {
      $('.col19').css('display', 'none');
    } else {
      $('.col19').removeClass('extra');
      $('.col19').css('display', '');
      $('.col19').css('min-width', '200px');
    }

    if (this.hideShow.fuelUnit == false) {
      $('.col20').css('display', 'none');
    } else {
      $('.col20').removeClass('extra');
      $('.col20').css('display', '');
      $('.col20').css('min-width', '200px');
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

  }

  // prev button func
  prevResults() {
    this.vehicleNext = true;
    this.vehiclePrev = true;
    this.vehicleDraw -= 1;
    this.lastEvaluatedKey = this.vehiclePrevEvauatedKeys[this.vehicleDraw];
    this.initDataTable();

  }

  resetCountResult() {
    this.vehicleStartPoint = 1;
    this.vehicleEndPoint = this.pageLength;
    this.vehicleDraw = 0;
  }

  refreshData() {
    this.vehicleID = '';
    this.suggestedVehicles = [];
    this.vehicleIdentification = '';
    this.currentStatus = null;
    this.vehicles = [];
    this.lastEvaluatedKey = '';
    this.dataMessage = Constants.FETCHING_DATA;
    this.fetchVehiclesCount();
    this.resetCountResult();
  }


  /**
   * Open Live View popup.
   * @param content
   */
  async openLiveView(content, vehicle, deviceInfo) {

    let deviceId = undefined;
    if (deviceInfo && deviceInfo.length > 0) {
      deviceId = deviceInfo[0].deviceSrNo.split('#')[1];

      const response = await this.apiService.getData(`vehicles/dashCam/liveFeed/${deviceId}`).toPromise()
      this.url = this._sanitizer.bypassSecurityTrustResourceUrl(response.feedUrl);

      this.liveStreamVehicle = `(${vehicle})`
      this.modalService.open(content, { ariaLabelledBy: 'modal-dash-cam' }).result.then((result) => {
      }, (reason) => {
      });
      this.liveModalTimeout = setTimeout(() => {
        this.modalService.dismissAll();
      }, 60000);
    } else {
      this.toastr.error('Connection to DashCam failed.')
    }
  }

  /**
   * Clears the setTimeout if required. Currently it is not viewed
   */
  clearVideoTimeout() {
    clearTimeout(this.liveModalTimeout);
  }
}
