import { Component, Input, OnInit, TemplateRef, ViewChild  } from '@angular/core';
import { ApiService } from 'src/app/services';
import { result, map, last } from 'lodash';
import { resourceUsage } from 'process';
import Constants from 'src/app/pages/fleet/constants';
import * as moment from 'moment';
import { ToastrService, Overlay } from "ngx-toastr";
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from 'src/app/services/here-map.service';
import { OnboardDefaultService } from 'src/app/services/onboard-default.service';
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
  selector: 'app-servicelogs',
  templateUrl: './servicelogs.component.html',
  styleUrls: ['./servicelogs.component.css']
})
export class ServicelogsComponent implements OnInit {
  @ViewChild('dt') table: Table;
  confirmEmailModal: TemplateRef<any>;
  @ViewChild('op') overlaypanel: OverlayPanel;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  allData = [];
  vendorsObject: any = {};
  tasks = [];
  taskID = null;
  vehiclesData = []
  assetsData: any = {};
  startDate: '';
  endDate: '';
  start = null;
  end = null;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  dataMessage: string = Constants.FETCHING_DATA;
  lastItemSK = '';
  datee = '';
  asset: any;
  loaded = false;
  searchValue = null;
  category = null;
  data = []
  categoryFilter = [
    {
      'name': 'Vehicle',
      'value': 'vehicle'
    },
    {
      'name': 'Asset',
      'value': 'asset'
    },
  ]
  listView = true;
  visible = true;
  loadMsg: string = Constants.NO_RECORDS_FOUND;
   isSearch = false;
  get = _.get;
  _selectedColumns: any[];
  find = _.find;
  filterStatus = null;
     
     
  dataColumns = [
        {  field: 'unitType', header: 'Unit Type', type: "text" },
        {  field: 'unitName', header: 'Vehicle/Asset', type: "text" },
        {  field: 'odometer', header: 'Odometer', type: "text" },
        {  field: 'vendorName', header: 'Vendor', type: "text" },
        {  field: 'taskName', header: 'Service Task', type: "text" },
        {  field: 'completionDate', header: 'Service Date', type: "text" },
        {  field: 'currentStatus', header: 'Status', type: "text" },
        {  field: 'allServiceTasks.subTotal', header: 'Service Cost', type: "text" },
        
    ];
     
  constructor(private apiService: ApiService, 
  private toastr: ToastrService,
  private httpClient: HttpClient,
  private router: Router,
  private spinner: NgxSpinnerService,
  private hereMap: HereMapService,
  protected _sanitizer: DomSanitizer,
  private modalService: NgbModal) { }

    async ngOnInit(): Promise<void> {
    await this.fetchSlogsList();
     this.setToggleOptions();
    this.fetchAllVendorsIDs();
    this.fetchAllVehiclesIDs();
    this.fetchAllAssetsIDs();
    this.fetchTasks();
  }
   setFilterStatus(val) {
    this.filterStatus = val;
  }
  
  onScroll = async (event: any) => {
    if (this.loaded) {
      this.fetchSlogsList();
    }
    this.loaded = false;
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
  
  fetchSlogsList() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`serviceLogs/fetch/serviceLogReport?searchValue=${this.searchValue}&category=${this.category}&taskID=${this.taskID}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`)
        .subscribe((result: any) => {
          this.dataMessage = Constants.FETCHING_DATA
          if (result.Items.length === 0) {
            this.loaded = true;
            this.dataMessage = Constants.NO_RECORDS_FOUND
          }
          if (result.LastEvaluatedKey !== undefined) {
            this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].logSK);
            this.datee = encodeURIComponent(result.Items[result.Items.length - 1].completionDate)
          }
          else {
            this.lastItemSK = 'end';
            this.datee = 'end';
          }
          if (result.Items.length > 0) {
            this.loaded = true;
            result['Items'].map((v: any) => {
              if (v.isDeleted === 0) {
                v.entityStatus = 'Active';
                if (v.currentStatus === 'outOfService') {
                  v.entityStatus = 'Out of service';
                } else if (v.currentStatus === 'active') {
                  v.entityStatus = 'Active';
                } else if (v.currentStatus === 'inactive') {
                  v.entityStatus = 'In-active';
                } else if (v.currentStatus === 'inActive') {
                  v.entityStatus = 'In-active';
                } else if (v.currentStatus === 'sold') {
                  v.entityStatus = 'Sold';
                }
                this.allData.push(v);
              }
            })
          }
          result.Items.forEach(element => {
          element.taskName = '';
        for (let i = 0; i < element.allServiceTasks.serviceTaskList.length; i++) {
          const element2 = element.allServiceTasks.serviceTaskList[i];
         element.taskName += element2.taskName;
          if (i < element.allServiceTasks.serviceTaskList.length - 1) {
            element.taskName += ' & ';
          }
        }
       })      
       })
    }
  }
  fetchAllVendorsIDs() {
    this.apiService.getData('contacts/get/list/vendor')
      .subscribe((result: any) => {
        this.vendorsObject = result;
      });
  }

  fetchTasks() {
    this.apiService.getData('tasks?type=service').subscribe((result: any) => {
      this.tasks = result;
    });
  }

  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/list/minor')
      .subscribe((result: any) => {
        result['Items'].map((v: any) => {
          if (v.isDeleted === 0) {
            this.vehiclesData.push(v);
          }
        })
      });
  }

  fetchAllAssetsIDs() {
    this.apiService.getData('assets/get/minor/details')
      .subscribe((result: any) => {
        this.assetsData = result.Items;

      })

  }
  
    clear(table: Table) {
        table.clear();
    }

  categoryChange() {
    this.searchValue = null;

  }
  searchFilter() {
    if (this.searchValue != null || this.category != null || this.taskID != null || this.start !== null || this.end !== null) {
      if (this.start != null && this.end == null) {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.start == null && this.end != null) {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.start > this.end) {
        this.toastr.error('Start Date should be less then end date.');
        return false;
      }
      else {
        this.dataMessage = Constants.FETCHING_DATA
        this.datee = null;
        this.lastItemSK = '';
        this.allData = []
        this.fetchSlogsList()
      }
    }
    else {
      return false;
    }
  }
  resetFilter() {
    if (this.searchValue != null || this.category != null || this.taskID != null || this.start !== null || this.end !== null) {
      this.searchValue = null;
      this.category = null;
      this.taskID = null;
      this.start = null;
      this.end = null;
      this.dataMessage = Constants.FETCHING_DATA
      this.lastItemSK = '';
      this.datee = null;
      this.allData = []
      this.fetchSlogsList()
    }
    else {
      return false;
    }
  }
  
  refreshData(){
    this.allData = []
    this.searchValue = null;
    this.category = null;
    this.taskID = null;
    this.start = null;
    this.datee = null;
    this.end = null;
    this.loaded = false;
    this.lastItemSK = '';
    this.fetchSlogsList()
    this.dataMessage = Constants.FETCHING_DATA
  }
  
  fetchExportList() {
    this.apiService.getData('serviceLogs/fetch/ServiceLogList')
      .subscribe((result: any) => {
        // this.data = result.Items;
        if (result.Items.length > 0) {
          this.loaded = true;
          result['Items'].map((v: any) => {
            if (v.isDeleted === 0) {
              v.entityStatus = 'Active';
              if (v.currentStatus === 'outOfService') {
                v.entityStatus = 'Out of service';
              } else if (v.currentStatus === 'active') {
                v.entityStatus = 'Active';
              } else if (v.currentStatus === 'inactive') {
                v.entityStatus = 'In-active';
              } else if (v.currentStatus === 'inActive') {
                v.entityStatus = 'In-active';
              } else if (v.currentStatus === 'sold') {
                v.entityStatus = 'Sold';
              }
              this.data.push(v);
            }
          })
        }
        this.generateCSV();
      })

  }

  csv() {
    if (this.searchValue != null || this.category != null || this.taskID != null || this.start !== null || this.end !== null) {
      this.data = this.allData;
      this.generateCSV();
    }
    else {
      this.fetchExportList();
    }
  }
  generateCSV() {
    if (this.data.length > 0) {
      let dataObject = []
      let csvArray = []
      this.data.forEach(element => {
        let taskName = '';
        for (let i = 0; i < element.allServiceTasks.serviceTaskList.length; i++) {
          const element2 = element.allServiceTasks.serviceTaskList[i];
          taskName += element2.taskName;
          if (i < element.allServiceTasks.serviceTaskList.length - 1) {
            taskName += ' & ';
          }
        }
        let obj = {}
        obj["Unit Type"] = element.unitType
        obj["Vehicle/Asset"] = element.unitName
        obj["Odometer"] = element.odometer
        obj["Vendor"] = this.vendorsObject[element.vendorID]
        obj["Service"] = taskName
        obj["Service Date"] = moment(element.completionDate).format("YYYY/MM/DD")
        obj["Status"] = element.entityStatus
        obj["Service Cost"] = element.allServiceTasks.subTotal + "." + "00" + " " + element.allServiceTasks.currency
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
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}ServiceLog-Report.csv`);
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