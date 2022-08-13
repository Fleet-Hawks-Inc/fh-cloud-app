import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiService, HereMapService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import Constants from 'src/app/pages/fleet/constants';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { NgSelectComponent } from "@ng-select/ng-select";
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
    @ViewChild('dt') table: Table;

    @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
    environment = environment.isFeatureEnabled;
    dataMessage: string = Constants.FETCHING_DATA;
    vehicles = [];
    title = "Driver List";
    vehicleIdentification = '';
    suggestedVehicles = [];
    vehicleManufacturersList: any = {};
    vehicleModelList: any = {};
    modelID: any = {};
    exportList: any = [];
    manufacturerID: any = {};
    createdTime: any = {};
    vehicleType: any = {};
    inActiveVehiclesCount = 0;
    activeVehiclesCount = 0;
    soldVehiclesCount = 0;
    currentStatus = null;
    totalVehicleCount = 0;
    lastItemSK = '';
    loaded = false;
    vehiclesCount = {
    total: '',
    active: '',
    inactive: '',
    sold: '',
  };
    vehicleID: any;
    mapView = false;
  listView = true;
  actualSrNo;
  visible = true;
  loadMsg: string = Constants.NO_LOAD_DATA;
  isSearch = false;
  get = _.get;
  _selectedColumns: any[];
  liveModalTimeout: any;
  liveStreamVehicle: string;
  url: any;
  currentView = 'list';
 
  dataColumns = [
    {  field: 'vehicleIdentification', header: 'Vehicle Name/Number', type: "text" },
    {  field: 'VIN', header: 'VIN', type: "text" },
    {  field: 'year', header: 'Year', type: "text" },
    {  field: 'manufacturerID', header: 'Make', type: "text" },
    {  field: 'modelID', header: 'Model', type: "text" },
    {  field: 'vehicleType', header: 'Type', type: "text" },
    {  field: 'ownership', header: 'Ownership', type: "text" },
    {  field: 'plateNumber', header: 'Plate Number', type: "text" },
    {  field: 'currentStatus', header: 'Status', type: 'text' },
    
  ];
  
    constructor(private apiService: ApiService,
    private httpClient: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private hereMap: HereMapService,
    private spinner: NgxSpinnerService) { }
    
   async ngOnInit(): Promise<void> {
        this.getVehiclePage();
        this.fetchVehiclesCount();
        this.setToggleOptions();
    }
  
    async getVehiclePage(refresh?: boolean) {
        if (refresh === true) {
            this.lastItemSK = '';
                this.vehicles = []
        }
        if (this.lastItemSK !== 'end') {
            const result = await this.apiService.getData(`vehicles/fetch/summary/list?name=${this.vehicleIdentification}&currentStatus=${this.currentStatus}&lastKey=${this.lastItemSK}`).toPromise();
           
            if (result.Items.length === 0) {
                this.loaded = true;
                this.dataMessage = Constants.NO_RECORDS_FOUND
            }
            this.suggestedVehicles = [];
            if (result.Items.length > 0) {

                if (result.LastEvaluatedKey !== undefined) {
                    this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].vehicleSK);
                }
                else {
                    this.lastItemSK = 'end';
                }
                this.vehicles = this.vehicles.concat(result.Items);
                this.loaded = true;
            }
        }
    }
    fetchVehiclesCount() {
    this.apiService.getData('vehicles/fetch/vehicleCount').subscribe((result: any) => {
      this.vehiclesCount = result;
    })
  }
    onScroll = async (event: any) => {
        if (this.loaded) {
            this.getVehiclePage();
        }
        this.loaded = false;
    }
    getSuggestions = _.debounce(function (value) {

    value = value.toLowerCase();
    if(value != '') {
      this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedVehicles = result;
      });
    } else {
      this.suggestedVehicles = []
    }
  }, 800);
  
  setVehicle(vehicleID, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleID = vehicleIdentification;
    this.suggestedVehicles = [];
  }
    searchVehicle() {
        if (this.vehicleIdentification !== '' || this.currentStatus !== null) {
            this.vehicleIdentification = this.vehicleIdentification.toLowerCase();
            this.currentStatus = this.currentStatus;
            this.vehicles = [];
            this.lastItemSK = '';
            this.dataMessage = Constants.FETCHING_DATA;
            this.suggestedVehicles = [];
            this.getVehiclePage();
        } else {
            return false;
        }
    }
    resetVehicle() {
       if (this.vehicleIdentification !== '' || this.currentStatus !== null || this.lastItemSK) {
      this.vehicleIdentification = '';
      this.currentStatus = null;
      this.vehicles = [];
      this.lastItemSK = '';
      this.dataMessage = Constants.FETCHING_DATA;
      this.suggestedVehicles = [];
      this.getVehiclePage();
    } else {
      return false;
    }
  }
  
   refreshData() {
    this.vehicleID = '';
    this.suggestedVehicles = [];
    this.vehicleIdentification = '';
    this.currentStatus = null;
    this.vehicles = [];
    this.lastItemSK = '';
    this.loaded = false;
    this.getVehiclePage();
    this.dataMessage = Constants.FETCHING_DATA;
  }
  
   setToggleOptions() {
        this.selectedColumns = this.dataColumns;
    }
    
     @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));

  }
  
    generateVehicleCSV() {
        if (this.exportList.length > 0) {
            let dataObject = []
            let csvArray = []
            this.exportList.forEach(element => {
                let obj = {}
                obj["Vehicle Name"] = element.vehicleIdentification
                obj["VIN#"] = element.VIN
                obj["Year"] = element.year
                obj["Make"] = element.manufacturerID
                obj["Model"] = element.modelID  ? element.modelID : '-'
                obj["Type"] = element.vehicleType
                obj["Plate#"] = element.plateNumber
                obj["Ownership"] = element.ownership ? element.ownership  : '-'
                obj["Status"] = element.currentStatus
                dataObject.push(obj)
            });
            let headers = Object.keys(dataObject[0]).join(',')
            headers += '\n'
            csvArray.push(headers)
            dataObject.forEach(element => {
                let obj = Object.values(element).join(',')
                obj += '\n'
                csvArray.push(obj)
            });
            const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Vehicle-Report.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        else {
            this.toastr.error("No Records found")
        }
    }
    
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
    
    
    vehicleExport() {
        this.apiService.getData(`vehicles/fetch/export`).subscribe((result: any) => {
            this.exportList = result.Items;
            this.generateVehicleCSV();
        })
    }
    
    csvExport() {
        if (this.vehicleIdentification  !== '' || this.currentStatus !== null) {
            this.exportList = this.vehicles
            this.generateVehicleCSV();
        } else {
            this.vehicleExport();
        }
    }
    
     clearVideoTimeout() {
    clearTimeout(this.liveModalTimeout);
  }

    
     clear(table: Table) {
        table.clear();
    }
}
