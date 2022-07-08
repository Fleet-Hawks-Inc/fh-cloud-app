import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectComponent } from '@ng-select/ng-select';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { OverlayPanel } from "primeng/overlaypanel";
import { Table } from 'primeng/table/table';
import Constants from 'src/app/pages/fleet/constants';
import { ApiService, HereMapService } from 'src/app/services';
import { ListService } from '../../../../../services';

@Component({
  selector: 'app-contact-renewals',
  templateUrl: './contact-renewals.component.html',
  styleUrls: ['./contact-renewals.component.css']
})
export class ContactRenewalsComponent implements OnInit {
  @ViewChild('dt') table: Table;
  confirmEmailModal: TemplateRef<any>;
  @ViewChild('op') overlaypanel: OverlayPanel;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  empData: any = [];
  tasks = []
  dataMessage: string = Constants.FETCHING_DATA;
  entityID = null;
  searchServiceTask = null;
  filterStatus = null;
  lastEvaluatedKey = "";
  lastItemSK = "";
  loaded = false
  empName = [];
  status = null;
  count = {
    total: '',
    overdue: '',
    dueSoon: '',
  };
  record = []
  data: any = [];
  driversList: any = {};
  mergedList: any = {};
  employees = [];
  drivers: any;
  listView = true;
  visible = true;
  loadMsg: string = Constants.NO_RECORDS_FOUND;
  isSearch = false;
  get = _.get;
  _selectedColumns: any[];
  find = _.find;

  dataColumns = [
    { width: '7%', field: 'entityID', header: 'Contact', type: "text" },
    { width: '7%', field: 'status', header: 'Contact Renewal Type', type: "text" },
    { width: '7%', field: 'tasks.timeUnit', header: 'Send Reminder', type: "text" },
    { width: '7%', field: 'tasks.dueDate', header: 'Expiration Date', type: "text" },
    { width: '7%', field: 'subscribers', header: 'Subscribers', type: "text" },
  ];

  constructor(private listService: ListService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private hereMap: HereMapService,
    protected _sanitizer: DomSanitizer,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.listService.fetchDrivers();
    this.fetchallitems();
    this.fectchTasks();
    this.fetchEmployees();
    this.fetchReminderCount();
    this.setToggleOptions();
    this.fetchVehicleIDs();
    let driverList = new Array<any>();
    this.getValidDrivers(driverList);
    this.drivers = driverList;
  }
  fectchTasks() {
    this.apiService.getData("tasks/get/list?type=contact").subscribe((result: any) => {
      this.tasks = result;
    })
  }
  fetchReminderCount() {
    this.apiService.getData("reminders/fetch/count?type=contact").subscribe((result: any) => {
      this.count = result;
    })
  }
  fetchVehicleIDs() {
    this.apiService.getData('contacts/list/minor').subscribe((result: any) => {
      result["Items"].map((r: any) => {
        if (r.isDeleted === 0) {
          this.record.push(r);
        }
      })
    })
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

  //for search with contact name
  fetchEmployeesData() {
    this.apiService.getData('contacts/employee/records').subscribe((res) => {

      this.employees = res.Items;
    });
  }
  fetchEmployees() {
    this.apiService.getData('contacts/get/emp/list').subscribe((res) => {
      this.empName = res;
      if (res) {
        this.apiService.getData('drivers/get/list').subscribe((result) => {
          this.driversList = result;
          this.mergedList = { ...res, ...result }; // merge id lists to one
        });
      }
    });
  }
  //for search with contact name
  private getValidDrivers(driverList: any[]) {
    let ids = [];
    this.listService.driversList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.driverID)) {
          driverList.push(element2);
          ids.push(element2.driverID);
        }
      });
    });
  }
  fetchallitems() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`reminders/fetch/records?reminderIdentification=${this.entityID}&serviceTask=${this.searchServiceTask}&status=${this.filterStatus}&lastKey=${this.lastItemSK}&reminderType=contact`)
        .subscribe((result: any) => {
          this.dataMessage = Constants.FETCHING_DATA
          if (result.Items.length === 0) {
            this.loaded = true;
            this.dataMessage = Constants.NO_RECORDS_FOUND
          }
          if (result.Items.length > 0) {

            if (result.LastEvaluatedKey !== undefined) {
              this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].reminderSK);
            }
            else {
              this.lastItemSK = 'end'
            }
            this.empData = this.empData.concat(result.Items)

            this.loaded = true;
          }
        });
    }
  }

  onScroll = async (event: any) => {
    if (this.loaded) {
      this.fetchallitems();
    }
    this.loaded = false;
  }

  searchData() {
    if (this.entityID !== null || this.searchServiceTask !== null || this.filterStatus !== null) {
      this.empData = [];
      this.lastItemSK = '';
      this.dataMessage = Constants.FETCHING_DATA
      this.fetchallitems();
    }
    else {
      return false;
    }
  }

  clear(table: Table) {
    table.clear();
  }

  resetData() {
    if (this.entityID !== null || this.searchServiceTask !== null || this.filterStatus !== null) {
      this.entityID = null;
      this.searchServiceTask = null;
      this.status = null;
      this.empData = [];
      this.lastItemSK = '';
      this.filterStatus = null;
      this.dataMessage = Constants.FETCHING_DATA
      this.fetchallitems();
    } else {
      return false;
    }
  }

  refreshData() {
    this.entityID = null;
    this.searchServiceTask = null;
    this.status = null;
    this.empData = [];
    this.lastItemSK = '';
    this.filterStatus = null;
    this.dataMessage = Constants.FETCHING_DATA
    this.fetchallitems();
  }

  fetchAllExport() {
    this.apiService.getData("reminders/fetch/export?type=contact").subscribe((result: any) => {
      this.data = result.Items;
      this.generateCSV();
    })
  }
  csvData() {
    if (this.entityID !== null || this.searchServiceTask !== null || this.filterStatus !== null) {
      this.data = this.empData
      this.generateCSV();
    } else {
      this.fetchAllExport();
    }
  }
  generateCSV() {
    if (this.data.length > 0) {
      let dataObject = []
      let csvArray = []
      this.data.forEach(element => {
        let obj = {}
        obj["Contact"] = this.mergedList[element.entityID]
        obj["Renewal Type"] = this.tasks[element.tasks.taskID] + " " + element.status
        obj["Send Reminder"] = element.tasks.time + " " + element.tasks.timeUnit
        obj["Expiration Date"] = element.tasks.dueDate
        obj["Subscribers"] = element.subscribers
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
        link.setAttribute('download', `${moment().format("YYYY/MM/DD:HH:m")}Contact-Renewal-Report.csv`);
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