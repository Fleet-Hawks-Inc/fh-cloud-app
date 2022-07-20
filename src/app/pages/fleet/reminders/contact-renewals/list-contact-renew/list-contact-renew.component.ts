import { Component, OnInit, ViewChild, Input  } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';
declare var $: any;
import { Table } from 'primeng/table';
import * as moment from 'moment';
import * as _ from 'lodash';
import Constants from '../../../constants';
import { nullSafeIsEquivalent } from "@angular/compiler/src/output/output_ast";
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../../../environments/environment';
import { ListService } from '../../../../../services';
@Component({
  selector: 'app-list-contact-renew',
  templateUrl: './list-contact-renew.component.html',
  styleUrls: ['./list-contact-renew.component.css']
})
export class ListContactRenewComponent implements OnInit {
  @ViewChild('dt') table: Table;
  get = _.get;
  _selectedColumns: any[];
  
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  public remindersData: any = [];
  contacts: [];
  driverList: any = {};
  tasksList: any = {};
  allRemindersData = [];
  subcribersArray = [];
  groups: any = {};
  currentDate = moment().format('YYYY-MM-DD');
  sessionID: string;
  newData = [];
  filterStatus = null;
  usersList: any = {};
  contactID = null;
  firstName = '';

  searchServiceTask = null;
  suggestedContacts = [];
  filterValue = "item.reminderTasks.reminderStatus == 'OVERDUE' || item.reminderTasks.reminderStatus == 'DUE SOON'";
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  contactRenewNext = false;
  contactRenewPrev = true;
  contactRenewDraw = 0;
  contactRenewPrevEvauatedKeys = [''];
  contactRenewStartPoint = 1;
  contactRenewEndPoint = this.pageLength;
  loading = false;
  users = [];
  drivers: any;
  employeesList: any = {};
  employees = [];
  driversList: any = {};
  mergedList: any = {};
  loaded = false
  
   dataColumns = [
    { width: '15%', field: 'entityID', header: 'Contact', type: 'text' },
    { width: '19%', field: 'status', header: 'Contact Renewal Type', type: 'text' },
    { width: '17%', field: 'tasks.timeUnit', header: 'Send Reminder', type: 'text' },
    { width: '17%', field: 'tasks.dueDate', header: 'Expiration Date', type: 'text' },
    { width: '19%', field: 'subscribers', header: 'Subscribers', type: 'text' },
  ];
  
  constructor(private apiService: ApiService,
    private listService: ListService,
    private router: Router, 
    private toastr: ToastrService,
    private routerMgmtService: RouteManagementServiceService,
    private spinner: NgxSpinnerService) {
      this.sessionID = this.routerMgmtService.serviceRemindersSessionID;
    }

  ngOnInit() {
    this.listService.fetchDrivers();
    // this.fetchServiceTaks();
    this.fetchTasksList();
    this.fetchEmployeeList();
    this.initDataTable();
    this.fetchEmployees();
    this.setToggleOptions();
    
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
    let driverList = new Array<any>();
    this.getValidDrivers(driverList);
    this.drivers = driverList;
  }
  fetchEmployees() {
    this.apiService.getData('contacts/employee/records').subscribe((res) => {

      this.employees = res.Items;
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
  
  fetchEmployeeList() {
    this.apiService.getData('contacts/get/emp/list').subscribe((res) => {
      this.employeesList = res;
      if (res) {
        this.apiService.getData('drivers/get/list').subscribe((result) => {
          this.driversList = result;
          this.mergedList = { ...res, ...result }; // merge id lists to one
        });
      }
    });
  }
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
  fetchTasksList() {
    this.apiService.getData('tasks/get/list?type=contact').subscribe((result: any) => {
      this.tasksList = result;
    });
  }

  setFilterStatus(val) {
    this.filterStatus = val;
  }

  initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService.getData('reminders/fetch/records?reminderIdentification=' + this.contactID + '&serviceTask=' + this.searchServiceTask + '&status=' + this.filterStatus + '&reminderType=contact' + '&lastKey=' + this.lastEvaluatedKey)
        .subscribe((result: any) => {
          if (result.Items.length === 0) {

            this.dataMessage = Constants.NO_RECORDS_FOUND
            this.loaded = true;
          }

          if (result.Items.length > 0) {

            if (result.LastEvaluatedKey !== undefined) {
              this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].reminderSK);
              let lastEvalKey = result[`LastEvaluatedKey`].reminderSK.replace(/#/g, '--');
              this.lastEvaluatedKey = lastEvalKey;
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

  searchFilter() {
    if (this.contactID != null || this.searchServiceTask != null || this.filterStatus !== null) {
      this.remindersData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.lastEvaluatedKey = ''
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.contactID != null || this.searchServiceTask != null || this.filterStatus !== null) {
      this.contactID = null;
      this.firstName = '';
      this.searchServiceTask = null;
      this.filterStatus = null;
      this.lastEvaluatedKey = ''
      this.dataMessage = Constants.FETCHING_DATA;
      this.remindersData = [];
      this.initDataTable();
    } else {
      return false;
    }
  }

  deleteRenewal(eventData) {
    if (confirm('Are you sure you want to delete?') === true) {
      // let record = {
      //   date: eventData.createdDate,
      //   time: eventData.createdTime,
      //   eventID: eventData.reminderID,
      //   type: eventData.type
      // }
      this.apiService.deleteData(`reminders/delete/${eventData.reminderID}/${eventData.type}`).subscribe((result: any) => {
        this.remindersData = [];
        this.contactRenewDraw = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        this.initDataTable();
        this.toastr.success('Contact Renewal Deleted Successfully!');
      });
    }
  }

  sendEmailNotification(value) {
    if (value.status !== undefined && value.status !== '') {
      this.apiService.getData(`reminders/send/email-notification/${value.reminderID}?type=contact&status=${value.status}`).subscribe((result) => {
        this.toastr.success('Email sent successfully');
      });
    } else {
      this.toastr.error('Contact renewal is upto date');
      return false;
    }
  }


  refreshData() {
    this.contactID = null;
    this.firstName = '';
    this.searchServiceTask = null;
    this.filterStatus = null;
    this.lastEvaluatedKey = '';
    this.dataMessage = Constants.FETCHING_DATA;
    this.remindersData = [];
    this.initDataTable();
  }
  
  clear(table: Table) {
    table.clear();
  }
}
