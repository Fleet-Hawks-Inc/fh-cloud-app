import { Component, OnInit } from '@angular/core';
import { result } from 'lodash';
import * as moment from 'moment'
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-renewals',
  templateUrl: './contact-renewals.component.html',
  styleUrls: ['./contact-renewals.component.css']
})
export class ContactRenewalsComponent implements OnInit {
  empData = [];
  tasks = []
  // tasks: any = {};
  dataMessage: string = Constants.NO_RECORDS_FOUND;
  entityID = null;
  searchServiceTask = null;
  filterStatus = null;
  lastEvaluatedKey = "";
  lastItemSK = "";
  loaded = false
  empName = [];
  count = {
    total: '',
    overdue: '',
    dueSoon: '',
  };
  status = null;
  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchEmpData();
    this.fetchallitems();
    this.fectchTasks();
    this.getRemindersCount();
    this.fetchEmployees();
    this.fetchReminderCount();
  }

  fectchTasks() {
    this.apiService.getData("tasks/get/list").subscribe((result: any) => {
      this.tasks = result;
      console.log("tasks", result)
    })
  }
  fetchReminderCount() {
    this.apiService.getData(`reminders/fetch/count?type=service`).subscribe((result: any) => {
      this.count = result;
    })
  }
  fetchEmployees() {
    this.apiService.getData('contacts/get/emp/list').subscribe((res) => {
      console.log('result', res);
      this.empName = res;
    });
  }
  fetchEmpData() {
    this.apiService.getData("reminders").subscribe((result: any) => {
      this.empData = result.Items;
      console.log('empData', result)
    });
  }
  getRemindersCount() {
    this.apiService.getData(`reminders/get/count?reminderIdentification=${this.entityID}&serviceTask=${this.searchServiceTask}&status=${this.filterStatus}&reminderType=contact`).subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {

        this.fetchallitems();
      },
    });
  }
  fetchallitems() {
    this.apiService.getData(`reminders/fetch/records?reminderIdentification=${this.entityID}&serviceTask=${this.searchServiceTask}&status=${this.filterStatus}&reminderType=contact&lastKey=${this.lastEvaluatedKey}`)
      .subscribe((result: any) => {
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.empData = result[`Items`];
        console.log(' this.empData', this.empData);
        if (this.entityID != null || this.searchServiceTask != null) {
        }
        if (result[`LastEvaluatedKey`] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].reminderSK.replace(/#/g, '--');
        }
      },
      );
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
  generateCSV() {
    if (this.empData.length > 0) {
      let dataObject = []
      let csvArray = []
      this.empData.forEach(element => {
        let obj = {}
        obj["Contact"] = this.empName[element.entityID]
        obj["Contact Renewal Type"] = this.tasks[element.tasks.taskID]
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
        link.setAttribute('download', `${moment().format("YYYY/MM/DD:HH:m")}vehicle-renewal-Report.csv`);
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