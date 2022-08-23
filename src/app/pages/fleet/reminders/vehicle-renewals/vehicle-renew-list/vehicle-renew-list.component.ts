import { Component, OnInit, ViewChild, Input  } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { Table } from 'primeng/table';
import Constants from '../../../constants';
import { environment } from '../../../../../../environments/environment';
import { nullSafeIsEquivalent } from "@angular/compiler/src/output/output_ast";
import * as _ from 'lodash';
import { OverlayPanel } from "primeng/overlaypanel";

declare var $: any;

@Component({
  selector: 'app-vehicle-renew-list',
  templateUrl: './vehicle-renew-list.component.html',
  styleUrls: ['./vehicle-renew-list.component.css']
})
export class VehicleRenewListComponent implements OnInit {
  @ViewChild('dt') table: Table;
  @ViewChild('rm') overlaypanel: OverlayPanel;
  get = _.get;
  _selectedColumns: any[];
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  public remindersData = [];
  // dtOptions: any = {};
    sessionID: string;

  vehicles = [];
  vehicleName: string;
  vehicleList: any = {};
  tasksList: any = {};
  groups; any = {};
  group: string;
  subcribersArray = [];
  allRemindersData = [];
  vehicleIdentification = '';
  currentDate = moment().format('YYYY-MM-DD');
  newData = [];
  suggestedVehicles = [];
  vehicleID = null;
  unitID = '';
  unitName = '';
  searchServiceTask = null;

  filterStatus = null;

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  vehicleRenewNext = false;
  vehicleRenewPrev = true;
  vehicleRenewDraw = 0;
  vehicleRenewPrevEvauatedKeys = [''];
  vehicleRenewStartPoint = 1;
  vehicleRenewEndPoint = this.pageLength;
  allVehicles = [];
  users = [];
  loaded = false
  
  // columns of data table
   dataColumns = [
    { field: 'vehicleNames', header: 'Vehicle', type: 'text' },
    { field: 'vehDetails', header: 'Vehicle Renewal Type', type: 'text' },
    { field: 'tasks.dueDate', header: 'Due Date', type: 'text' },
    { field: 'taskTime', header: 'Send Reminder', type: 'text' },
    { field: 'subscribers', header: 'Subscribers', type: 'text' },
  ];

  constructor(private apiService: ApiService, 
  private router: Router, 
  private spinner: NgxSpinnerService, 
  private routerMgmtService: RouteManagementServiceService,
  private toastr: ToastrService) { 
  this.sessionID = this.routerMgmtService.serviceRemindersSessionID;
  }

  async ngOnInit() {
    this.initDataTable();
    this.fetchVehicleList();
    this.fetchTasksList();
    this.setToggleOptions();
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

  fetchTasksList() {
    this.apiService.getData('tasks/get/list?type=vehicle').subscribe((result: any) => {
      this.tasksList = result;
    });
  }

   fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
  setFilterStatus(val) {
    this.filterStatus = val;
  }

  deleteRenewal(eventData) {
    if (confirm('Are you sure you want to delete?') === true) {
      let record = {
        date: eventData.createdDate,
        time: eventData.createdTime,
        eventID: eventData.reminderID,
        type: eventData.type
      }
      this.apiService.deleteData(`reminders/delete/${eventData.reminderID}/${eventData.type}`).subscribe((result: any) => {
        this.remindersData = [];
        this.vehicleRenewDraw = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        this.initDataTable();
        this.toastr.success('Vehicle Renewal Deleted Successfully!');
      });
    }
  }




  initDataTable(refresh?: boolean) {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService.getData('reminders/fetch/records?reminderIdentification=' + this.vehicleID + '&serviceTask=' + this.searchServiceTask + '&status=' + this.filterStatus + '&reminderType=vehicle' + '&lastKey=' + this.lastEvaluatedKey)
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
            for(let res of result.Items){
            res.vehicleNames = this.vehicleList[res.entityID];
            
            if(res.status === 'dueSoon'){
            res.vehStatus = res.status;
            }else{
            res.vehStatus = res.status;
            }
            res.vehTasks = this.tasksList[res.tasks.taskID];
            res.vehDetails = res.vehStatus.toUpperCase().replace('undefined') + '\n' + res.vehTasks;
            res.tTime = res.tasks.time
            res.taskTime = res.tTime + ' ' + res.tasks.timeUnit + ' ' + '(s)' + ' ' + 'Before'
            } 
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
  
  searchFilter() {
    if (this.vehicleID != null || this.searchServiceTask != null || this.filterStatus != null) {
      this.remindersData = [];
      this.lastEvaluatedKey = ''
      this.dataMessage = Constants.FETCHING_DATA;
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.vehicleID != null || this.searchServiceTask != null || this.filterStatus != null) {
      this.vehicleID = null;
      this.vehicleIdentification = '';
      this.searchServiceTask = null;
      this.filterStatus = null;
      this.lastEvaluatedKey = ''
      this.remindersData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.initDataTable();
    } else {
      return false;
    }
  }

  sendEmailNotification(value) {
    if (value.status !== undefined && value.status !== '') {
      this.apiService.getData(`reminders/send/email-notification/${value.reminderID}?type=vehicle&status=${value.status}`).subscribe((result) => {
        this.toastr.success('Email sent successfully');
      });
    } else {
      this.toastr.error('Vehicle renewal is upto date');
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
  
  clear(table: Table) {
    table.clear();
  }

}
