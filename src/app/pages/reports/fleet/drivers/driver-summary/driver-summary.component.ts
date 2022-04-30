import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import Constants from 'src/app/pages/fleet/constants';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from 'src/app/services/here-map.service';

import * as moment from 'moment'
import * as _ from 'lodash';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Table } from 'primeng/table';
import { OnboardDefaultService } from 'src/app/services/onboard-default.service';
@Component({
    selector: 'app-driver-summary',
    templateUrl: './driver-summary.component.html',
    styleUrls: ['./driver-summary.component.css']
})
export class DriverSummaryComponent implements OnInit {
    @ViewChild('dt') table: Table;
    
    @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
    environment = environment.isFeatureEnabled;
    dataMessage: string = Constants.FETCHING_DATA;
    drivers: any = [];
    title = "Driver Summary";
    driverID = '';
    driversCount = {
        total: '',
        active: '',
        inactive: '',
    };
    driverStatus = null;
    driverName = '';
    fullExportDriver: any = [];
    lastItemSK = '';
    suggestedDrivers = [];
    disableSearch = false;
    loaded = false;
    loadMsg: string = Constants.NO_LOAD_DATA;
    isSearch = false;
    _selectedColumns: any[];
    statusOptions: any[];
    listView = true;
    visible = true;
    get = _.get;
    
     dataColumns = [
        { field: 'firstName', header: 'First Name', type: "text" },
        { field: 'lastName', header: 'Last Name', type: "text" },
        { field: 'email', header: 'Email', type: "text" },
        { field: 'userName', header: 'Username', type: "text" },
        { field: 'driverType', header: 'Driver Type', type: "text" },
        { field: 'startDate', header: 'Start Date', type: "text" },
        { field: 'DOB', header: 'Date of Birth', type: "text" }, 
        { field: 'CDL_Number', header: 'CDL#', type: "text" },
        { field: 'licenceExpiry', header: 'Licence Expiry', type: "text" },     
        { field: 'licStateName', header: 'Licence Province', type: "text" }, 
        { field: 'phone', header: 'Phone', type: "text" },                
        { field: "driverStatus", header: 'Status', type: 'text' },

    ];
    
    constructor(private apiService: ApiService, 
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private hereMap: HereMapService,
    private onboard: OnboardDefaultService) { }
    
    async ngOnInit(): Promise<void> {
        this.fetchDriversCount();
        this.fetchPagination();
        this.setToggleOptions();
        this.setAssetOptions();
    }
    


     setToggleOptions() {
        this.selectedColumns = this.dataColumns;
    }
    
    setAssetOptions() {
    this.statusOptions = [{ "value": "active", "name": "Active" },
    { "value": "inActive", "name": "InActive" },
    ];
    }
    
     @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));

  }
    
    async fetchPagination(refresh?: boolean) {
        if (refresh === true) {
            this.lastItemSK = '';
            this.drivers = [];
        }
        if (this.lastItemSK !== 'end') {
            const result = await this.apiService.getData(`drivers/fetch/records?driver=${this.driverID}&driverStatus=${this.driverStatus}&lastKey=${this.lastItemSK}`).toPromise();
            if (result.data.length === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND
            }
            this.suggestedDrivers = [];
            if (result.nextPage !== undefined) {
                this.lastItemSK = encodeURIComponent(result.nextPage);
            }
            else {
                this.lastItemSK = 'end'
            }
            this.drivers = this.drivers.concat(result.data);
            this.loaded = true;
            this.isSearch = false;
        }
    }
    onScroll = async (event: any) => {
        if (this.loaded) {
            this.fetchPagination();
        }
        this.loaded = false;
    }
    
    fetchDriversCount() {
        this.apiService.getData(`drivers/fetch/driverCount`).subscribe((result: any) => {
            this.driversCount = result;
        })
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
    searchDriver() {
        if (this.driverID !== '' || this.driverStatus !== null) {
            this.isSearch = true;
            this.drivers = [];
           // this.suggestedDrivers = [];
            this.lastItemSK = '';
            this.dataMessage = Constants.FETCHING_DATA;
            this.fetchPagination();
        }
        else {
            return false;
        }
    }
    
    clearInput() {
    this.suggestedDrivers = null;
  }
  
  clearSuggestions() {
    this.driverName = '';
  }

    resetDriver() {
        if (this.driverID !== '' || this.driverStatus !== null || this.lastItemSK !== '') {
            //this.ngSelectComponent.handleClearClick();
            this.driverName = '';
            this.isSearch = true;
            this.driverID = '';
            this.driverStatus = null;
            this.lastItemSK = '';
            this.drivers = [];
            this.loaded = false;
            this.dataMessage = Constants.FETCHING_DATA;
            this.suggestedDrivers = null;
            this.fetchPagination();
        }
        else {
            return false;
        }
    }
    
     refreshData() {
        this.drivers = [];
        this.driverID = '';
        this.driverStatus = null;
        this.driverName = '';
        this.lastItemSK = '';
        this.loaded = false;
        this.fetchPagination();
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