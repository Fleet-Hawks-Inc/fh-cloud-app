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
  serviceTasks = [];
  count = {
    total: '',
  }
  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchallitems();
    this.fectchTasks();
    this.fetchEmployees();
    this.fetchServiceTaks();
    this.fetchReminderCount();
  }
  fectchTasks() {
    this.apiService.getData("tasks/get/list").subscribe((result: any) => {
      this.tasks = result;
    })
  }
  fetchReminderCount() {
    this.apiService.getData("reminders/fetch/count?type=contact").subscribe((result: any) => {
      this.count = result;
    })
  }
  fetchEmployees() {
    this.apiService.getData('contacts/get/emp/list').subscribe((res) => {
      console.log('empName', res);
      this.empName = res;
    });
  }
  fetchServiceTaks() {
    let test = [];
    this.apiService.getData('tasks').subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === 'contact');
    });
  }
  fetchallitems() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`reminders/fetch/records?reminderIdentification=${this.entityID}&serviceTask=${this.searchServiceTask}&status=${this.filterStatus}&lastKey=${this.lastItemSK}&reminderType=contact`)
        .subscribe((result: any) => {
          this.dataMessage = Constants.FETCHING_DATA
          if (result.Items.length === 0) {

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

  onScroll() {
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
        obj["Renewal Type"] = this.tasks[element.tasks.taskID]
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