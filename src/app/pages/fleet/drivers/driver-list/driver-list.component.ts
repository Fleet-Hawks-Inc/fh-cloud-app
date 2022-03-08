import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgSelectComponent } from "@ng-select/ng-select";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { Table } from 'primeng/table';
import { CountryStateCityService } from "src/app/services/country-state-city.service";
import { environment } from "../../../../../environments/environment";
import { ApiService } from "../../../../services";
import Constants from "../../constants";
declare var $: any;


@Component({
    selector: "app-driver-list",
    templateUrl: "./driver-list.component.html",
    styleUrls: ["./driver-list.component.css"],
})
export class DriverListComponent implements OnInit {
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
    statesObject: any = {};
    countriesObject: any = {};
    citiesObject: any = {};
    vehiclesObject: any = {};
    groupssObject: any = {};
    vendorsObject: any = {};
    ownerOperatorsObject: any = {};
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
    employeeOptions: any[];
    groupName: any = '';
    groupId: any = '';
    groupsObjects: any = {};

    loadMsg: string = Constants.NO_LOAD_DATA;
    isSearch = false;
    get = _.get;
    _selectedColumns: any[];

    // columns of data table
    dataColumns = [
        { field: 'firstName', header: 'First Name', type: "text" },
        { field: 'lastName', header: 'Last Name', type: "text" },
        { field: 'email', header: 'Email', type: "text" },
        { field: 'phone', header: 'Phone', type: "text" },
        { field: 'userName', header: 'Username', type: "text" },
        { field: 'driverType', header: 'Type', type: "text" },
        { field: 'companyName', header: 'Company', type: "text" },
        { field: 'startDate', header: 'Start Date', type: "text" },
        { field: 'CDL_Number', header: 'CDL#', type: "text" },
        { field: 'licenceDetails.licenceExpiry', header: 'CDL Expiry', type: "text" },
        { field: "driverStatus", header: 'Status', type: 'text' },

    ];

    constructor(
        private apiService: ApiService,
        private httpClient: HttpClient,
        private toastr: ToastrService,
        private countryStateCity: CountryStateCityService
    ) { }

    async ngOnInit(): Promise<void> {
        this.setToggleOptions();
        this.setEmployeeOptions();
        // this.fetchAllDocumentsTypes();
        // this.fetchAllVehiclesIDs();
        // this.fetchAllVendorsIDs();
        // this.fetchOwnerOperatorsByIDss();
        await this.fetchDrivers();


    }

    setToggleOptions() {
        this.selectedColumns = this.dataColumns;
    }
    setEmployeeOptions() {
        this.employeeOptions = [{ "value": "contractor", "name": "Contractor" }, { "name": "Employee", "value": "employee" }, { "name": "All", "value": "null" }];
    }
    @Input() get selectedColumns(): any[] {
        return this._selectedColumns;
    }

    set selectedColumns(val: any[]) {
        //restore original order
        this._selectedColumns = this.dataColumns.filter(col => val.includes(col));

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



    getSuggestions = _.debounce(function (value) {

        value = value.toLowerCase();
        if (value != "") {
            this.loadMsg = Constants.LOAD_DATA;
            this.apiService
                .getData(`drivers/get/suggestions/${value}`)
                .subscribe((result) => {
                    if (result.length === 0) {
                        this.suggestedDrivers = [];
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
                    } else {

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
        this.apiService.getData(`groups/get/list?type=drivers&groupId=${this.groupId}`).subscribe((result: any) => {
            this.groupssObject = result;
        });
    }
    fetchGroups() {
        this.apiService.getData(`groups/get/driverlist?type=drivers`).subscribe((result: any) => {
            this.groupsObjects = result;
        });
    }
    fetchAllVendorsIDs() {
        this.apiService.getData('contacts/get/list/vendor')
            .subscribe((result: any) => {
                this.vendorsObject = result;
            });
    }
    fetchOwnerOperatorsByIDss() {
        this.apiService
            .getData(`contacts/get/list/ownerOperator`)
            .subscribe((result: any) => {
                this.ownerOperatorsObject = result;
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
                    this.fetchDrivers();
                    // this.fetchDriversCount();
                    this.toastr.success("Driver is deleted!");
                });
        }
    }
    async fetchDrivers() {
        if (this.lastEvaluatedKey !== 'end') {
            let result = await this.apiService.getData(`drivers/fetch/records?driver=${this.driverID}&dutyStatus=${this.dutyStatus}&type=${this.driverType}&lastKey=${this.lastEvaluatedKey}`).toPromise();
            if (result.data.length === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND;
                this.loaded = true;
            }
            result.data.map((v) => {
                v.url = `/fleet/drivers/detail/${v.driverID}`;
            });
            this.suggestedDrivers = [];
            if (result.nextPage !== undefined) {
                this.lastEvaluatedKey = encodeURIComponent(result.nextPage);
            }
            else {
                this.lastEvaluatedKey = 'end'
            }
            console.log(this.lastEvaluatedKey, result.nextPage)
            this.drivers = this.drivers.concat(result.data);
            this.loaded = true;

            this.isSearch = false;
        }
    }



    onScroll = async (event: any) => {


        if (this.loaded) {
            this.fetchDrivers();

        }
        this.loaded=false;

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
            this.driverID !== '' ||
            this.dutyStatus !== '' ||
            this.driverType !== null
        ) {
            this.isSearch = true;
            this.drivers = [];
            this.dataMessage = Constants.FETCHING_DATA;
            this.lastEvaluatedKey = '';
            this.fetchDrivers();

        } else {
            return false;
        }
    }

    clearInput() {
        this.suggestedDrivers = null;
    }

    clearSuggestions() {
        this.driverName = null;
    }
    resetFilter() {
        console.log(this.driverID)
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
            this.fetchDrivers();

        } else {
            return false;
        }
    }



    refreshData() {
        this.drivers = [];
        this.driverID = '';
        this.dutyStatus = '';
        this.driverName = '';
        this.driverType = null;
        this.lastEvaluatedKey = '';
        this.loaded = false;
        this.fetchDrivers();
        this.dataMessage = Constants.FETCHING_DATA;

    }



    /**
     * Clears the table filters
     * @param table Table 
     */
    clear(table: Table) {
        table.clear();
    }

}

