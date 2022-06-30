import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApiService, HereMapService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import * as moment from 'moment';
import { map, result } from 'lodash';
import { constants } from 'buffer';
import { Overlay, ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import * as html2pdf from "html2pdf.js";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { environment } from '../../../../../../environments/environment';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Table } from 'primeng/table/table';
import { DomSanitizer } from '@angular/platform-browser';
import { OverlayPanel } from "primeng/overlaypanel";
import { Router } from "@angular/router";


@Component({
  selector: 'app-serviceprogram',
  templateUrl: './serviceprogram.component.html',
  styleUrls: ['./serviceprogram.component.css']
})
export class ServiceprogramComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  @ViewChild('dt') table: Table;
  confirmEmailModal: TemplateRef<any>;
  @ViewChild('op') overlaypanel: OverlayPanel;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  serviceProgramList: any = [];
  searchVehicle: any = [];
  dataMessage: string = Constants.FETCHING_DATA;
  lastItemSK = "";
  loaded: any = false;
  description: any
  total_Cost: any
  vehicles = {};
  vehicle: any = null;
  programName: any = null;
  serviceTasks: any[];
  record: any = [];
  disableSearch = false;
  exportFull = []
  listView = true;
  visible = true;
  loadMsg: string = Constants.NO_RECORDS_FOUND;
  isSearch = false;
  get = _.get;
  _selectedColumns: any[];
  find = _.find;
  dataColumns: any[];
  filterStatus = null;
  
  constructor(private apiService: ApiService, 
  private toastr: ToastrService,
   private httpClient: HttpClient,
  private route: ActivatedRoute,
  private spinner: NgxSpinnerService,
  protected _sanitizer: DomSanitizer,
  private hereMap: HereMapService,
  private modalService: NgbModal,) { }


  async ngOnInit() {
  await this.fetchServiceVehicleList()
     this.fetchvehiclesList()
     this.dataColumns = [
        {  field: 'vehicles', header: 'Vehicle', type: "text" },
        {  field: 'programName', header: 'Service Program Name', type: "text" },
        {  field: 'description', header: 'Description', type: "text" },
    ];
    this._selectedColumns = this.dataColumns;
    this.setToggleOptions();
  }
  
    setFilterStatus(val) {
    this.filterStatus = val;
  }

  
  async fetchServiceVehicleList() {
    if (this.lastItemSK !== 'end') {
      const result = await this.apiService.getData(`servicePrograms/fetch/report?vehicle=${this.vehicle}&programName=${this.programName}&lastKey=${this.lastItemSK}`).toPromise();
      this.dataMessage = Constants.FETCHING_DATA
      if (result.Items.length === 0) {
        this.loaded = true;
        this.dataMessage = Constants.NO_RECORDS_FOUND
      }
      if (result.Items.length > 0) {
        if (result.LastEvaluatedKey !== undefined) {
          this.lastItemSK = encodeURIComponent(result.LastEvaluatedKey.sk);
        }
        else {
          this.lastItemSK = 'end'
        }
        this.serviceProgramList = this.serviceProgramList.concat(result.Items);
        this.loaded = true;
      }
      this.disableSearch = false;
    }
  }

  fetchvehiclesList() {
    this.apiService.getData("vehicles/get/list").subscribe((result: any) => {
      this.vehicles = result;
    });
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
    
    clear(table: Table) {
        table.clear();
    }

  searchFilter() {
    if (this.vehicle !== null || this.programName !== null) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.disableSearch = true;
      this.serviceProgramList = [];
      this.lastItemSK = '';
      this.fetchServiceVehicleList();
    } else {
      return false
    }

  }

  onScroll = async (event: any) =>{
    if (this.loaded) {
      this.fetchServiceVehicleList();
    }
    this.loaded = false;
  }

  resetFilter() {
    if (this.vehicle !== null || this.programName !== null || this.lastItemSK !== '') {
      this.disableSearch = true;
      this.vehicle = null;
      this.programName = null;
      this.lastItemSK = '';
      this.dataMessage = Constants.FETCHING_DATA
      this.serviceProgramList = []
      this.fetchServiceVehicleList()
    }
    else {
      return false;
    }
  }
  
  refreshData(){
    this.disableSearch = true;
    this.vehicle = null;
    this.programName = null;
    this.lastItemSK = '';
    this.dataMessage = Constants.FETCHING_DATA
    this.serviceProgramList = []
    this.fetchServiceVehicleList()
  }
  
  fetchExportfullList() {
    this.apiService.getData('servicePrograms/fetch/report/export').subscribe((result: any) => {
      this.exportFull = result;
      this.generateCSV();
    })

  }
  csv() {
    if (this.vehicle !== null || this.programName !== null) {
      this.exportFull = this.serviceProgramList
      this.generateCSV();
    }
    else {
      this.fetchExportfullList()
    }
  }
 
  generateCSV() {
    if (this.exportFull.length > 0) {
      let dataObject = []
      let csvArray = []
      this.exportFull.forEach(element => {
        let obj = {}
        let ab  = ''
        let allVehicles:any = []
        for (const el of element.vehicles) {
          allVehicles.push(this.vehicles[el])
        }
        if(allVehicles.length > 1){
         ab =  '& ';
        }
        let veh = ''
        
        obj["Vehicle"] = allVehicles.join(" & ")
        obj["Service Program Name"] = element.programName
        obj["Description"] = element.description
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
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Service-Program.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    else {
      this.toastr.error("No Records found")
    }
  }


}