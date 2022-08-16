import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { map, result } from 'lodash';
import { ApiService, HereMapService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import { constants } from 'buffer';
import { Overlay, ToastrService } from "ngx-toastr";
import * as moment from 'moment'
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
  selector: 'app-sreminders',
  templateUrl: './sreminders.component.html',
  styleUrls: ['./sreminders.component.css']
})

export class SremindersComponent implements OnInit {
  
 environment = environment.isFeatureEnabled;
  @ViewChild('dt') table: Table;
  confirmEmailModal: TemplateRef<any>;
  @ViewChild('op') overlaypanel: OverlayPanel;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  searchServiceTask = null;
  status = null;
  entityID = null;
  lastItemSK = "";
  type = "null";
  allData = [];
  lastEvaluatedKey = "";
  vehiclesList = [];
  taskfunction = [];
  tasksData = {};
  serviceList = [];
  loaded = false
  filterStatus = null;
  dataMessage: string = Constants.FETCHING_DATA
  count = {
    total: '',
    overdue: '',
    dueSoon: '',
  };
  record = [];
  export = [];
  data = [];
  listView = true;
  visible = true;
  loadMsg: string = Constants.NO_RECORDS_FOUND;
  isSearch = false;
  get = _.get;
  _selectedColumns: any[];
  find = _.find;
  
  
  dataColumns = [
        {  field: 'entityID', header: 'Vehicle', type: "text" },
        {  field: 'tasks.taskID', header: 'Service Task', type: "text" },
        {  field: 'createdDate', header: 'Next Due', type: "text" },
        {  field: 'subscribers', header: 'Subscribers', type: "text" },
        {  field: 'status', header: 'Renewal Status', type: "text" },
    ];
  
  constructor(private apiService: ApiService, 
  private toastr: ToastrService,
  private httpClient: HttpClient,
  private route: ActivatedRoute,
  private spinner: NgxSpinnerService,
  private hereMap: HereMapService,
  protected _sanitizer: DomSanitizer,
  private modalService: NgbModal,) { }

 async ngOnInit() {
    this.fetchReminderList();
    this.fetchvehiclesList();
    this.fetchTasksList();
    this.fetchReminderCount();
    this.setToggleOptions();

    this.fetchVehicleIDs();
  }
  setFilterStatus(val) {
    this.filterStatus = val;
  }

  fetchReminderList() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`reminders/fetch/report/list?entityID=${this.entityID}&serviceTask=${this.searchServiceTask}&status=${this.filterStatus}&type=service&lastKey=${this.lastItemSK}`).subscribe((result: any) => {

        this.dataMessage = Constants.FETCHING_DATA
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
             this.loaded = true;
        }
        if (result.Items.length > 0) {

          if (result.LastEvaluatedKey !== undefined) {
            this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].reminderSK);
          }
          else {
            this.lastItemSK = 'end'
          }
          this.allData = this.allData.concat(result.Items)

          this.loaded = true;
        }
      });
    }
  }

  onScroll = async (event: any) =>{
    if (this.loaded) {
      this.fetchReminderList();
    }
    this.loaded = false;
  }
  searchData() {
    if (this.entityID !== null || this.searchServiceTask !== null || this.filterStatus !== null) {
      this.allData = [];
      this.lastItemSK = '';
      this.fetchReminderList();
    }
    else {
      return false;
    }
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
  
  resetData() {
    if (this.entityID !== null || this.searchServiceTask !== null || this.filterStatus !== null) {
      this.entityID = null;
      this.searchServiceTask = null;
      this.status = null;
      this.allData = [];
      this.lastItemSK = '';
      this.filterStatus = null;
      this.dataMessage = Constants.FETCHING_DATA
      this.fetchReminderList();
    } else {
      return false;
    }
  }
  
  refreshData(){
      this.allData = [];
      this.entityID = null;
      this.searchServiceTask = null;
      this.status = null;
      this.filterStatus = null;
      this.loaded = false;
      this.lastItemSK = '';
      this.fetchReminderList();
      this.dataMessage = Constants.FETCHING_DATA
  }
  
  fetchReminderCount() {
    this.apiService.getData(`reminders/fetch/count?type=service`).subscribe((result: any) => {
      this.count = result;
    })
  }
  fetchvehiclesList() {
    this.apiService.getData("vehicles/get/list").subscribe((result: any) => {
      this.vehiclesList = result;
    });
  }
  fetchTasksList() {
    this.apiService.getData('tasks/get/list?type=service').subscribe((result: any) => {
      this.tasksData = result;

    });
  }

  fetchVehicleIDs() {
    this.apiService.getData('vehicles/list/minor').subscribe((result: any) => {
      result["Items"].map((r: any) => {
        if (r.isDeleted === 0) {
          this.record.push(r);
        }
      })
    })
  }
  fetchAllExport() {
    this.apiService.getData("reminders/fetch/export?type=service").subscribe((result: any) => {
      this.data = result.Items;
      this.generateCSV();
    })
  }
  
   clear(table: Table) {
        table.clear();
    }
  
  csvData() {
    if (this.entityID !== null || this.searchServiceTask !== null || this.filterStatus !== null) {
      this.data = this.allData;
      this.generateCSV();
    } else {
      this.fetchAllExport()
    }
  }
  generateCSV() {
    if (this.data.length > 0) {
      let dataObject = []
      let csvArray = []
      this.data.forEach(element => {
        let obj = {}
        obj["Vehicle"] = this.vehiclesList[element.entityID]
        obj["Service Task"] = this.tasksData[element.tasks.taskID]
        obj["Next Due"] = element.createdDate
        obj["Subscribers"] = element.subscribers
        obj["Renewal Status"] = element.status
        dataObject.push(obj)
      });
      let headers = Object.keys(dataObject[0]).join(',')
      headers += ' \n'
      csvArray.push(headers)
      dataObject.forEach(element => {
        let obj = Object.values(element).join(',')
        obj += ' \n'
        csvArray.push(obj)
      });
      const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });

      const link = document.createElement('a');
      if (link.download !== undefined) {

        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${moment().format("YYYY/MM/DD:HH:m")}Service-Reminders-Report.csv`);
        link.style.visibility = 'hidden';
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