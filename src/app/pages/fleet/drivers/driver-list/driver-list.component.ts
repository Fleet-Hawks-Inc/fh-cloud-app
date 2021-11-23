import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../services";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { HereMapService } from "../../../../services/here-map.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import Constants from "../../constants";
import { environment } from "../../../../../environments/environment";

import * as _ from "lodash";
import { CountryStateCityService } from "src/app/services/country-state-city.service";
declare var $: any;

@Component({
  selector: "app-driver-list",
  templateUrl: "./driver-list.component.html",
  styleUrls: ["./driver-list.component.css"],
})
export class DriverListComponent implements OnInit {
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

  statesObject: any = {};
  countriesObject: any = {};
  citiesObject: any = {};
  vehiclesObject: any = {};
  groupssObject: any = {};

  driverID = '';
  driverName = '';
  dutyStatus = '';
  driverType = null;
  suggestedDrivers = [];
  //homeworld: Observable<{}>;

  //totalRecords = 10;
  //pageLength = 10;
  lastEvaluatedKey = '';
  currentStatus: any;
  loaded = false;
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

 //driverNext = false;
  //driverPrev = true;
  //driverDraw = 0;
  //driverPrevEvauatedKeys = [""];
  //driverStartPoint = 1;
  //driverEndPoint = this.pageLength;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private hereMap: HereMapService,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private countryStateCity: CountryStateCityService
  ) {}

  ngOnInit(): void {
    this.fetchAllDocumentsTypes();
    //this.fetchDriversCount();
    this.fetchAllVehiclesIDs();
    this.fetchAllGrorups();
    this.initDataTable();
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
    this.driverID = "";
    value = value.toLowerCase();
    if (value != "") {
      this.apiService
        .getData(`drivers/get/suggestions/${value}`)
        .subscribe((result) => {
          result.map((v) => {
            if (v.lastName == undefined) {
              v.lastName = "";
            }
            return v;
          });
          this.suggestedDrivers = result;
        });
    } else {
      this.suggestedDrivers = [];
    }
  }, 800);

  setDriver(driverID, firstName = "", lastName = "", middleName = "") {
    if (middleName !== "") {
      this.driverName = `${firstName} ${middleName} ${lastName}`;
      // this.driverID = driverID;
      this.driverID = `${firstName}-${middleName}-${lastName}`;
    } else {
      this.driverName = `${firstName} ${lastName}`;
      this.driverID = `${firstName}-${lastName}`;
    }

    this.suggestedDrivers = [];
  }

  
  
  //code 9433
  
  
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

  editDriver = () => {
    if (this.driverCheckCount === 1) {
      this.router.navigateByUrl(
        "/fleet/drivers/edit-driver/" + this.selectedDriverID
      );
    } else {
      this.toastr.error("Please select only one asset!");
    }
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

  deactivateDriver(eventData) {
    if (confirm("Are you sure you want to delete?") === true) {
      // let record = {
      //   date: eventData.createdDate,
      //   time: eventData.createdTime,
      //   eventID: eventData.driverID,
      //   status: eventData.driverStatus
      // }
      this.apiService
        .deleteData(
          `drivers/delete/${eventData.driverID}/${eventData.firstName}/${eventData.lastName}/${eventData.userName}`
        )
        .subscribe((result: any) => {
          this.drivers = [];
         // this.driverDraw = 0;
          this.dataMessage = Constants.FETCHING_DATA;
          this.lastEvaluatedKey = "";
         // this.fetchDriversCount();
          this.toastr.success("Driver is deleted!");
        });
    }
  }

















//initDataTable






  
      async initDataTable() {
        if (this.lastEvaluatedKey !== 'end') {
            const result = await this.apiService.getData(`drivers/fetch/records?driver=${this.driverID}&dutyStatus=${this.dutyStatus}&lastKey=${this.lastEvaluatedKey}&type=${this.driverType}`).toPromise();
            if (result.Items.length === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND
            }
              result.Items.map((v) => {
            v.url = `/fleet/drivers/detail/${v.driverID}`;
          });
                        this.suggestedDrivers = [];
            if (result.Items.length > 0) {
                if (result.LastEvaluatedKey !== undefined) {
                    this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].driverSK);
                }
                else {
                    this.lastEvaluatedKey = 'end'
                }
                this.drivers = this.drivers.concat(result.Items);
                this.loaded = true;
            }
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
      // for(let i=0;i<drivers[d].address.length; i++){
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
      // }
    }
  }
  
  searchFilter() {
    if (
      this.driverName !== '' ||
      this.dutyStatus !== '' ||
      this.driverType !== null
    ) {
      this.driverName = this.driverName.toLowerCase();
      if (this.driverID == '') {
        this.driverID = this.driverName;
      }
      this.drivers = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.lastEvaluatedKey = '';
      this.suggestedDrivers = [];
      this.initDataTable();
     // this.fetchDriversCount();
    } else {
      return false;
    }
  }
  resetFilter() {
    if (
      this.driverName !== '' ||
      this.dutyStatus !== '' ||
      this.driverType !== null
    ) {
     this.driverID = '';
      this.dutyStatus = '';
      this.driverName = '';
      this.driverType = null;
      this.drivers = [];
      this.dataMessage = Constants.FETCHING_DATA;

      //this.lastEvaluatedKey = '';
      this.initDataTable();
      //this.fetchDriversCount();
      //this.driverDraw = 0;
      //this.resetCountResult();
    } else {
      return false;
    }
  }
  hideShowColumn() {
    //for headers
    if (this.hideShow.name == false) {
      $(".col1").css("display", "none");
    } else {
      $(".col1").css("display", "");
    }

    if (this.hideShow.dutyStatus == false) {
      $(".col2").css("display", "none");
    } else {
      $(".col2").css("display", "");
    }

    if (this.hideShow.location == false) {
      $(".col18").css("display", "none");
    } else {
      $(".col18").css("display", "");
    }

    if (this.hideShow.currCycle == false) {
      $(".col11").css("display", "none");
    } else {
      $(".col11").css("display", "");
    }

    if (this.hideShow.currVehicle == false) {
      $(".col12").css("display", "none");
    } else {
      $(".col12").removeClass("extra");
      $(".col12").css("display", "");
      $(".col12").css("min-width", "200px");
    }

    if (this.hideShow.assets == false) {
      $(".col13").css("display", "none");
    } else {
      $(".col13").removeClass("extra");
      $(".col13").css("display", "");
      $(".col13").css("min-width", "200px");
    }

    if (this.hideShow.contact == false) {
      $(".col14").css("display", "none");
    } else {
      $(".col14").removeClass("extra");
      $(".col14").css("display", "");
      $(".col14").css("min-width", "200px");
    }

    if (this.hideShow.dl == false) {
      $(".col15").css("display", "none");
    } else {
      $(".col15").removeClass("extra");
      $(".col15").css("display", "");
      $(".col15").css("min-width", "200px");
    }

    if (this.hideShow.document == false) {
      $(".col16").css("display", "none");
    } else {
      $(".col16").removeClass("extra");
      $(".col16").css("display", "");
      $(".col16").css("min-width", "200px");
    }

    if (this.hideShow.status == false) {
      $(".col17").css("display", "none");
    } else {
      $(".col17").css("display", "");
    }

    //extra columns
    if (this.hideShow.groupID == false) {
      $(".col3").css("display", "none");
    } else {
      $(".col3").removeClass("extra");
      $(".col3").css("display", "");
      $(".col3").css("min-width", "200px");
    }

    if (this.hideShow.citizenship == false) {
      $(".col4").css("display", "none");
    } else {
      $(".col4").removeClass("extra");
      $(".col4").css("display", "");
      $(".col4").css("min-width", "200px");
    }

    if (this.hideShow.address == false) {
      $(".col5").css("display", "none");
    } else {
      $(".col5").removeClass("extra");
      $(".col5").css("display", "");
      $(".col5").css("min-width", "200px");
    }

    if (this.hideShow.paymentType == false) {
      $(".col6").css("display", "none");
    } else {
      $(".col6").removeClass("extra");
      $(".col6").css("display", "");
      $(".col6").css("min-width", "200px");
    }

    if (this.hideShow.sin == false) {
      $(".col7").css("display", "none");
    } else {
      $(".col7").removeClass("extra");
      $(".col7").css("display", "");
      $(".col7").css("min-width", "200px");
    }

    if (this.hideShow.contractStart == false) {
      $(".col8").css("display", "none");
    } else {
      $(".col8").removeClass("extra");
      $(".col8").css("display", "");
      $(".col8").css("min-width", "200px");
    }

    if (this.hideShow.homeTerminal == false) {
      $(".col9").css("display", "none");
    } else {
      $(".col9").removeClass("extra");
      $(".col9").css("display", "");
      $(".col9").css("min-width", "200px");
    }

    if (this.hideShow.fastNumber == false) {
      $(".col10").css("display", "none");
    } else {
      $(".col10").removeClass("extra");
      $(".col10").css("display", "");
      $(".col10").css("min-width", "200px");
    }
  }
  
  /*
  getStartandEndVal() {
    this.driverStartPoint = this.driverDraw * this.pageLength + 1;
    this.driverEndPoint = this.driverStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.driverNext = true;
    this.driverPrev = true;
    this.driverDraw += 1;
    this.initDataTable();
  }

  // prev button func
  prevResults() {
    this.driverNext = true;
    this.driverPrev = true;
    this.driverDraw -= 1;
    this.lastEvaluatedKey = this.driverPrevEvauatedKeys[this.driverDraw];
    this.initDataTable();
  }

  resetCountResult() {
    this.driverStartPoint = 1;
    this.driverEndPoint = this.pageLength;
    this.driverDraw = 0;
  }
  */
    refreshData() {
    this.drivers = [];
    this.driverID = '';
    this.dutyStatus = '';
    this.driverName = '';
    this.driverType = null;
    this.lastEvaluatedKey = '';
    this.initDataTable();
    this.dataMessage = Constants.FETCHING_DATA;
    //this.fetchDriversCount();
   // this.driverDraw = 0;
   // this.resetCountResult();
  }
}