import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { ApiService } from 'src/app/services';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { HereMapService } from "src/app/services/here-map.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import Constants from 'src/app/pages/fleet/constants';
import { environment } from 'src/environments/environment';
import * as moment from 'moment'
import * as _ from "lodash";
import { Table } from 'primeng/table';
import { CountryStateCityService } from "src/app/services/country-state-city.service";
import { NgSelectComponent } from "@ng-select/ng-select";
declare var $: any;

@Component({
  selector: 'app-driver-data',
  templateUrl: './driver-data.component.html',
  styleUrls: ['./driver-data.component.css']
})
export class DriverDataComponent implements OnInit {
 @ViewChild('dt') table: Table;
 
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
  disableSearch = false;
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
    _selectedColumns: any[];
    driverTypeOption: any[];
    get = _.get;
    
    dataColumns = [
        { field: 'firstName', header: 'Name', type: "text" },
        { field: 'email', header: 'Email', type: "text" },
        { field: 'phone', header: 'Phone', type: "text" },   
        { field: 'employeeContractorId', header: 'Employee ID', type: "text" }, 
        { field: 'userName', header: 'User Name', type: "text" },
        { field: 'driverType', header: 'Driver Type', type: "text" },
        { field: 'startDate', header: 'Start Date', type: "text" },
        { field: 'CDL_Number', header: 'CDL#', type: "text" },
        { field: 'licenceExpiry', header: 'Licence Expiry', type: "text" }, 
        { field: 'licStateName', header: 'Licence Province', type: "text" },
    ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private hereMap: HereMapService,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private countryStateCity: CountryStateCityService
  ) { }

 async ngOnInit(): Promise<void> {
    this.fetchAllDocumentsTypes();
     await this.initDataTable();
    this.fetchAllVehiclesIDs();
    this.fetchAllGrorups();
    this.setdriverTypeOption();
    this.setToggleOptions();
    
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

   setToggleOptions() {
        this.selectedColumns = this.dataColumns;
    }
    
    setdriverTypeOption() {
        this.driverTypeOption = [{ "value": "contractor", "name": "Contractor" }, { "name": "Employee", "value": "employee" }, { "name": "All", "value": "null" }];
    }
    
      @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));

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


  async initDataTable() {
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
<<<<<<< HEAD
            if (result.Items.length === 0) {
              this.disableSearch = false;
=======
            if (result.data.length === 0) {

>>>>>>> 96717babcce47571d1060031474203ddd3364440
              this.dataMessage = Constants.NO_RECORDS_FOUND
            }
            if (result.nextPage !== undefined) {
              this.lastEvaluatedKey = encodeURIComponent(result.nextPage);
            }
<<<<<<< HEAD
            if (result.Items.length > 0) {
              this.disableSearch = false;
              if (result.LastEvaluatedKey !== undefined) {
                this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].driverSK);
              }
              else {
                this.lastEvaluatedKey = 'end'
              }
              this.drivers = this.drivers.concat(result.Items)

              this.loaded = true;
=======
            else {
              this.lastEvaluatedKey = 'end'
>>>>>>> 96717babcce47571d1060031474203ddd3364440
            }
            this.drivers = this.drivers.concat(result.data);
            this.loaded = true;
            this.isSearch = false;
          });
    }
  }
  onScroll = async(event:any) => {
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
      this.disableSearch = true;
      this.dataMessage = Constants.FETCHING_DATA;
      this.lastEvaluatedKey = ''
      this.suggestedDrivers = []
      this.initDataTable();
    } else {
      return false;
    }
  }
  
   resetFilter() {

        if (
            this.driverID !== '' ||
            this.dutyStatus !== '' ||
            this.driverType !== null
        ) {


            this.isSearch = true;
            this.driverID = '';
            this.dutyStatus = '';
            this.driverName = null;
            this.driverType = null;
            this.drivers = [];
            this.loaded = false;
            this.lastEvaluatedKey = '';
            this.suggestedDrivers = null;
            this.initDataTable();

        } else {
            return false;
        }
    }
  
  clearInput() {
    this.suggestedDrivers = null;
  }
  
   refreshData() {
        this.drivers = [];
        this.driverID = '';
        this.dutyStatus = '';
        this.driverName = '';
        this.driverType = null;
        this.lastEvaluatedKey = '';
        this.loaded = false;
        this.initDataTable();
        this.dataMessage = Constants.FETCHING_DATA;

<<<<<<< HEAD
  resetFilter() {
    if (
      this.driverName !== "" ||
      this.dutyStatus !== "" ||
      this.driverType !== null
    ) {
        
      this.drivers = [];
      this.disableSearch = true;
      this.driverID = "";
      this.dutyStatus = "";
      this.driverName = "";
      this.driverType = null;
      this.dataMessage = Constants.FETCHING_DATA;
      this.lastEvaluatedKey = ''
      this.initDataTable();
      this.driverDraw = 0;
    } else {
      return false;
=======
>>>>>>> 96717babcce47571d1060031474203ddd3364440
    }

  
  clearSuggestions() {
    this.driverName = null;
  }
  
   clear(table: Table) {
        table.clear();
    }

}
