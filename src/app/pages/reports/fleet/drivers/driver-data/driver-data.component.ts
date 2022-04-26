import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from 'src/app/services';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { HereMapService } from "src/app/services/here-map.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import Constants from 'src/app/pages/fleet/constants';
import { environment } from 'src/environments/environment';

import * as _ from "lodash";
import { CountryStateCityService } from "src/app/services/country-state-city.service";
import { NgSelectComponent } from "@ng-select/ng-select";
declare var $: any;

@Component({
  selector: 'app-driver-data',
  templateUrl: './driver-data.component.html',
  styleUrls: ['./driver-data.component.css']
})
export class DriverDataComponent implements OnInit {

  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  environment = environment.isFeatureEnabled;
  allDocumentsTypes: any;
  documentsTypesObects: any = {};

  title = "Driver List";
  mapView = false;
  listView = true;
  visible = true;
  dataMessage: string = Constants.FETCHING_DATA;

  driverCheckCount;
  selectedDriverID;
  drivers = [];
  loaded = false

  statesObject: any = {};
  countriesObject: any = {};
  citiesObject: any = {};
  vehiclesObject: any = {};
  groupssObject: any = {};

  driverID = "";
  driverName = "";
  dutyStatus = "";
  driverType = null;
  suggestedDrivers = [];
  homeworld: Observable<{}>;

  totalRecords = 10;
  pageLength = 10;
  lastEvaluatedKey = "";
  currentStatus: any;
  hideShow = {
    name: true,
    dutyStatus: true,
    location: true,
    currCycle: true,
    currVehicle: false,
    assets: false,
    contact: false,
    dl: true,
    document: false,
    status: true,
    groupID: true,
    citizenship: false,
    address: false,
    paymentType: false,
    sin: false,
    contractStart: false,
    homeTerminal: false,
    fastNumber: false,
    email: true,
    phone: true,
    driverType: true,
    startDate: true,
    licenceExpiry: true,
    licStateName: true,
  };

  driverNext = false;
  driverPrev = true;
  driverDraw = 0;
  driverPrevEvauatedKeys = [""];
  driverStartPoint = 1;
  driverEndPoint = this.pageLength;

  loadMsg: string = Constants.NO_LOAD_DATA;
  isSearch = false;


  constructor(
    private apiService: ApiService,
    private router: Router,
    private hereMap: HereMapService,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private countryStateCity: CountryStateCityService
  ) { }

  ngOnInit(): void {
    this.fetchAllDocumentsTypes();
    this.initDataTable();
    this.fetchAllVehiclesIDs();
    this.fetchAllGrorups();
    $(document).ready(() => {
      setTimeout(() => {
        $("#DataTables_Table_0_wrapper .dt-buttons")
          .addClass("custom-dt-buttons")
          .prependTo(".page-buttons");
      }, 1800);
    });
  }

  fetchAllDocumentsTypes() {
    this.httpClient
      .get(`assets/travelDocumentType.json`)
      .subscribe((data: any) => {
        this.allDocumentsTypes = data;
        this.documentsTypesObects = data.reduce((a: any, b: any) => {
          return (a[b[`code`]] = b[`description`]), a;
        }, {});
      });
  }

  jsTree() {
    $(".treeCheckbox").jstree({
      core: {
        themes: {
          responsive: false,
        },
      },
      types: {
        default: {
          icon: "fas fa-folder",
        },
        file: {
          icon: "fas fa-file",
        },
      },
      plugins: ["types", "checkbox"],
    });
  }

  export() {
    $(".buttons-excel").trigger("click");
  }

  getSuggestions = _.debounce(function (value) {
    value = value.toLowerCase();
    if (value != "") {
      this.loadMsg = Constants.LOAD_DATA;
      this.apiService
        .getData(`drivers/get/suggestions/${value}`)
        .subscribe((result) => {
          if (result.length === 0) {
            this.loadMsg = Constants.NO_LOAD_FOUND;
          }
          if (result.length > 0) {
            result.map((v) => {
              if (v.middleName != undefined && v.middleName != '') {
                v.fullName = `${v.firstName} ${v.middleName} ${v.lastName}`;
              } else {
                v.fullName = `${v.firstName} ${v.lastName}`;
              }
              return v;
            });
            this.suggestedDrivers = result;
          }
        });
    } else {
      this.suggestedDrivers = [];
    }
  }, 800);

  setDriver(driverID: any) {
    if (driverID != undefined && driverID != '') {
      this.driverID = driverID;
    }
    this.loadMsg = Constants.NO_LOAD_DATA;

  }


  fetchAllGrorups() {
    this.apiService.getData("groups/get/list").subscribe((result: any) => {
      this.groupssObject = result;
    });
  }
  fetchAllCitiesIDs() {
    this.apiService.getData("cities/get/list").subscribe((result: any) => {
      this.citiesObject = result;
    });
  }
  fetchAllVehiclesIDs() {
    this.apiService.getData("vehicles/get/list").subscribe((result: any) => {
      this.vehiclesObject = result;
    });
  }

  checkboxCount = () => {
    this.driverCheckCount = 0;
    this.drivers.forEach((item) => {
      if (item.checked) {
        this.selectedDriverID = item.driverID;
        this.driverCheckCount = this.driverCheckCount + 1;
      }
    });
  };



  mapShow() {
    this.mapView = true;
    this.listView = false;
    setTimeout(() => {
      this.jsTree();
      this.hereMap.mapInit();
    }, 200);
  }

  valuechange() {
    this.visible = !this.visible;
  }


  initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService
        .getData(
          `drivers/fetch/records?driver=${this.driverID}&dutyStatus=${this.dutyStatus}&lastKey=${this.lastEvaluatedKey}&type=${this.driverType}`
        )
        .subscribe(
          (result: any) => {
            result.data.map((v) => {
              v.url = `/reports/fleet/drivers/driver-report/${v.driverID}`;
            });
            if (result.data.length === 0) {

              this.dataMessage = Constants.NO_RECORDS_FOUND
            }
            if (result.nextPage !== undefined) {
              this.lastEvaluatedKey = encodeURIComponent(result.nextPage);
            }
            else {
              this.lastEvaluatedKey = 'end'
            }
            this.drivers = this.drivers.concat(result.data);
            this.loaded = true;
            this.isSearch = false;
          });
    }
  }
  onScroll() {
    if (this.loaded) {
      this.initDataTable();
    }
    this.loaded = false;
  }
  fetchAddress(drivers: any) {
    for (let d = 0; d < drivers.length; d++) {
      drivers.map(async (e: any) => {
        e.citizenship =
          await this.countryStateCity.GetSpecificCountryNameByCode(
            e.citizenship
          );
      });

      if (drivers[d].address !== undefined) {
        drivers[d].address.map(async (a: any) => {
          if (a.manual) {
            a.countryName =
              await this.countryStateCity.GetSpecificCountryNameByCode(
                a.countryCode
              );
            a.stateName = await this.countryStateCity.GetStateNameFromCode(
              a.stateCode,
              a.countryCode
            );
          }
        });
      }


    }
  }
  searchFilter() {
    if (
      this.driverID !== "" ||
      this.dutyStatus !== "" ||
      this.driverType !== null
    ) {
      this.isSearch = true;
      this.drivers = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.lastEvaluatedKey = ''
      this.suggestedDrivers = [];
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (
      this.driverID !== "" ||
      this.dutyStatus !== "" ||
      this.driverType !== null
    ) {
      this.isSearch = true;
      this.ngSelectComponent.handleClearClick();
      this.drivers = [];
      this.driverID = "";
      this.dutyStatus = "";
      this.driverName = "";
      this.driverType = null;
      this.dataMessage = Constants.FETCHING_DATA;
      this.lastEvaluatedKey = '';
      this.initDataTable();
      this.driverDraw = 0;
      this.initDataTable();
    } else {
      return false;
    }
  }

}
