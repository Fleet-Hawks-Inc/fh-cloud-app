import { Component, OnInit } from '@angular/core';
import { result } from 'lodash';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import { ToastrService } from "ngx-toastr";
import * as moment from 'moment'
@Component({
  selector: 'app-contact-renewals',
  templateUrl: './contact-renewals.component.html',
  styleUrls: ['./contact-renewals.component.css']
})
export class ContactRenewalsComponent implements OnInit {
  allData = [];
  findData = [];
  Users = [];
  contact = []
  employee = [];
  lastEvaluatedKey = "";
  contactID = "";
  searchServiceTask = null;
  filterStatus = null;
  loaded = false
  status = null;
  dataMessage: string = Constants.FETCHING_DATA

  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchdata();
    this.fetchallData();
    this.findallData();
    this.fetchemp();
    this.fetchVehiclesdata();
  }


  fetchdata() {
    this.apiService.getData("tasks/get/list").subscribe((result: any) => {
      this.Users = result;
      console.log("Users", result)
    })
  }
  fetchallData() {
    this.apiService.getData("reminders").subscribe((result: any) => {
      this.allData = result.Items;
      console.log('alldata', result)
    });
  }
  findallData() {
    this.apiService.getData("contacts/employee/records").subscribe((result: any) => {
      this.findData = result.Items;
      console.log('findData', result)
    });
  }
  fetchemp() {
    this.apiService.getData("contacts/get/emp/list").subscribe((result: any) => {
      this.employee = result;
      console.log("employee", result)
    })
  }
  fetchVehiclesdata() {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService.getData(`reminders/fetch/report/list?reminderIdentification=${this.contactID}&serviceTask=${this.searchServiceTask}&status=${this.filterStatus}&type=service&lastKey=${this.lastEvaluatedKey}`).subscribe((result: any) => {

        console.log('this.data', result)
        this.allData = result.Items;
        this.dataMessage = Constants.FETCHING_DATA
        if (result.Items.length === 0) {

          this.dataMessage = Constants.NO_RECORDS_FOUND
        }
        if (result.Items.length > 0) {

          if (result.LastEvaluatedKey !== undefined) {
            this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].reminderSK);
          }
          else {
            this.lastEvaluatedKey = 'end'
          }
          this.allData = this.allData.concat(result.Items)

          this.loaded = true;
        }


      });
    }
  }

  onScroll() {
    if (this.loaded) {
      this.fetchVehiclesdata();
    }
    this.loaded = false;
  }
  srchVeh() {
    if (this.contactID !== null || this.searchServiceTask !== null || this.filterStatus !== null) {

      // if (this.contactID  !== ''){
      // this.contactID  = this.contactID ;
      this.allData = [];
      this.lastEvaluatedKey = '';
      this.fetchVehiclesdata();
    }
    else {
      return false;
    }
  }

  resetData() {
    if (this.contactID !== '' || this.searchServiceTask !== null || this.filterStatus !== null) {
      this.contactID = null;
      this.searchServiceTask = null;
      this.status = null;
      this.allData = [];
      this.lastEvaluatedKey = '';
      this.dataMessage = Constants.FETCHING_DATA
      this.fetchVehiclesdata();
    } else {
      return false;
    }
  }
  generateCSV() {
    if (this.allData.length > 0) {
      let dataObject = []
      let csvArray = []


      this.allData.forEach(element => {
        let obj = {}
        obj["Contact"] = this.findData[element.contactID]
        obj["Employee ID"] = this.allData[element.tasks.taskID]
        obj["Contact Renewal Type"] = element.createdDate
        obj["Send Reminder"] = element.subscribers
        obj["Expiration"] = element.tasks.dueDate
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
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}serviceReminder-Report.csv`);
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