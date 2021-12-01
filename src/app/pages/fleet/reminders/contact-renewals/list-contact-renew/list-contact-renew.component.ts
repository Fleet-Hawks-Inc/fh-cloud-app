import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;
import * as moment from 'moment';
import Constants from '../../../constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../../../environments/environment';
import { ListService } from '../../../../../services';
@Component({
  selector: 'app-list-contact-renew',
  templateUrl: './list-contact-renew.component.html',
  styleUrls: ['./list-contact-renew.component.css']
})
export class ListContactRenewComponent implements OnInit {

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
  newData = [];
  filterStatus = null;
  usersList: any = {};
  contactID = null;
  firstName = '';
  serviceTasks = [];
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
  constructor(private apiService: ApiService,
    private listService: ListService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.listService.fetchDrivers();
    this.fetchServiceTaks();
    this.fetchTasksList();
    this.fetchEmployeeList();
    this.initDataTable();
    this.fetchEmployees();
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
    this.apiService.getData('tasks/get/list').subscribe((result: any) => {
      this.tasksList = result;
    });
  }
  fetchServiceTaks() {
    let test = [];
    this.apiService.getData('tasks').subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === 'contact');
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
  onScroll() {
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
}
