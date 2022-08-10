import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';
import * as moment from 'moment';
import { Table } from 'primeng/table';
import * as _ from 'lodash';
import Constants from '../../../constants';
import { OverlayPanel } from "primeng/overlaypanel";

declare var $: any;
import { nullSafeIsEquivalent } from "@angular/compiler/src/output/output_ast";
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  @ViewChild('dt') table: Table;
  @ViewChild('rm') overlaypanel: OverlayPanel;
  get = _.get;
  _selectedColumns: any[];
  
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  public remindersData = [];
  // dtOptions: any = {};
  vehicles = [];
  reminderIdentification = '';
  reminderID = '';
  task: string;
  vehicleList: any = {};
  groups: any = {};
  serviceLogs: any = [];
  allRemindersData = [];
  vehicleIdentification = '';
  unitID = '';
  unitName = '';
  suggestedUnits = [];
  currentDate = moment().format('YYYY-MM-DD');
  currentOdometer = 1500;
  taskName: string;
  newData = [];
  suggestedVehicles = [];
  vehicleID = null;
  sessionID: string;

  tasksList: any = {}

  searchServiceTask = null;
  filterStatus = null;
  inServiceOdometer: string;
  myMath = 'Math';
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  serviceNext = false;
  servicePrev = true;
  serviceDraw = 0;
  servicePrevEvauatedKeys = [''];
  serviceStartPoint = 1;
  serviceEndPoint = this.pageLength;
  allVehicles: any = [];
  users = [];
  loaded = false
  
  
  // columns of data table
   dataColumns = [
    { field: 'vehicleList', header: 'Vehicle', type: 'text' },
    { field: 'status', header: '	Service Task', type: 'text' },
    { field: 'nextDueDays', header: '	Next Due', type: 'text' },
    { field: 'lastServiceDate', header: 'Last Completed', type: 'text' },
    { field: 'subscribers', header: 'Subscribers', type: 'text' },
  ];
  
  constructor(private apiService: ApiService, 
  private router: Router, 
  private toastr: ToastrService, 
  private routerMgmtService: RouteManagementServiceService,
  private spinner: NgxSpinnerService) { 
  this.sessionID = this.routerMgmtService.serviceRemindersSessionID;
  }

  ngOnInit() {
    this.initDataTable();
    this.fetchTasksList();
    this.fetchVehicleList();
    this.setToggleOptions();
  
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
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
  
  clearInput() {
    this.suggestedVehicles = null;
  }


  clearSuggestions() {
    this.vehicleIdentification = null;
  }



  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }

  fetchTasksList() {
    this.apiService.getData('tasks/get/list?type=service').subscribe((result: any) => {
      this.tasksList = result;

    });
  }

  setFilterStatus(val) {
    this.filterStatus = val;
  }



  resolveReminder(unitID) {
    let unitType = 'vehicle';
    const unit = {
      unitID: unitID,
      unitType: unitType,
    };
    window.localStorage.setItem('reminderUnitID', JSON.stringify(unit));
    this.router.navigateByUrl('/fleet/maintenance/service-log/add-service');
  }

  deleteReminder(eventData) {
    if (confirm('Are you sure you want to delete?') === true) {
      let record = {
        date: eventData.createdDate,
        time: eventData.createdTime,
        eventID: eventData.reminderID,
        type: eventData.type
      }
      this.apiService.deleteData(`reminders/delete/${eventData.reminderID}/${eventData.type}`).subscribe((result: any) => {
        this.remindersData = [];
        this.serviceDraw = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        this.initDataTable();
        this.toastr.success('Service Reminder Deleted Successfully!');
      });
    }
  }

  initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService.getData('reminders/fetch/records?reminderIdentification=' + this.vehicleID + '&serviceTask=' + this.searchServiceTask + '&status=' + this.filterStatus + '&reminderType=service' + '&lastKey=' + this.lastEvaluatedKey)
        .subscribe((result: any) => {

          if (result.Items.length === 0) {

            this.dataMessage = Constants.NO_RECORDS_FOUND
            this.loaded = true;
          }
          if (result.Items.length > 0) {

            if (result.LastEvaluatedKey !== undefined) {
              this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].reminderSK);
            }
            else {
              this.lastEvaluatedKey = 'end'
            }
            this.remindersData = this.remindersData.concat(result.Items)

            this.loaded = true;
          }
        });
    }
  }
  
  onScroll = async(event: any) => {
    if (this.loaded) {
      this.initDataTable();
    }
    this.loaded = false;
  }
  
  searchData() {
    if (this.searchServiceTask !== null || this.filterStatus !== null || this.vehicleID !== null) {
      this.remindersData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.lastEvaluatedKey = ''
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetData() {
    if (this.searchServiceTask !== null || this.filterStatus !== null || this.vehicleID !== null) {
      this.vehicleID = null;
      this.vehicleIdentification = '';
      this.searchServiceTask = null;
      this.lastEvaluatedKey = ''
      this.filterStatus = null;
      this.remindersData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.initDataTable();
    } else {
      return false;
    }
  }

  sendEmailNotification(value) {

    if (value.status !== undefined && value.status !== '') {
      this.apiService.getData(`reminders/send/email-notification/${value.reminderID}?status=${value.status}`).subscribe((result) => {
        this.toastr.success('Email sent successfully');
      });
    } else {
      this.toastr.error('Service task is upto date');
      return false;
    }
  }

  refreshData() {
    this.vehicleID = null;
    this.vehicleIdentification = '';
    this.searchServiceTask = null;
    this.filterStatus = null;
    this.lastEvaluatedKey = '';
    this.remindersData = [];
    this.dataMessage = Constants.FETCHING_DATA;
    this.initDataTable();
  }
  
    /**
 * Clears the table filters
 * @param table Table 
 */
  clear(table: Table) {
    table.clear();
  }
  
}
