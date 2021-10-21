import { Component, OnInit } from '@angular/core';
// import { Constants } from '@aws-amplify/core';
import { result } from 'lodash';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import { constants } from 'buffer';
import * as moment from 'moment'
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-sreminders',
  templateUrl: './sreminders.component.html',
  styleUrls: ['./sreminders.component.css']
})

export class SremindersComponent implements OnInit {
  searchServiceTask = null;
  status = null;
  entityID = "";
  lastItemSK = "";
  type = "null";
  allData = [];
  allDatta = [];
  pageLength = "10";
  vehicleList = {};
  vehicleTask = {};
  OverdueService = 0;
  due = 0;
  totalRecords = "10";
  suggestedVehicles = [];
  searchValues = "";
  carrierID = "";
  currentStatus = "null";
  lastEvaluatedKey = "";
  carrierEndPoint = this.pageLength;
  vehiclesList = [];
  taskfunction = [];
  serviceTask = [];
  tasksData = [];
  taskName: string;
  serviceTasks = [];
  tasksList = "";
  loaded = false
  totalCount = 0;
  deletedCount = 0;
  filterStatus = null;
  dataMessage: string = Constants.FETCHING_DATA
  Vehicles = {}
  tasks = {}

  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    // this.newfunction();
    // this.linkfunction();
    this.tasksfunction();
    this.fetchVehiclesdata();
    this.fetchvehicleSList();
    this.fetchTasksList();
    // this. fetchServiceTaks()
    this.fetchReminderCount();



  }
  setFilterStatus(val) {
    this.filterStatus = val;
  }
  // &type=service
  fetchVehiclesdata() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`reminders/fetch/report/list?entityID=${this.entityID}&serviceTask=${this.searchServiceTask}&status=${this.filterStatus}&type=service&lastKey=${this.lastItemSK}`).subscribe((result: any) => {

        console.log('this.data', result)
        // this.allData = result.Items;
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
    if (this.entityID !== null || this.searchServiceTask !== null || this.filterStatus !== null) {

      // if (this.entityID !== ''){
      // this.entityID = this.entityID;
      this.allData = [];
      this.lastItemSK = '';
      this.fetchVehiclesdata();
    }
    else {
      return false;
    }
  }

  resetData() {
    if (this.entityID !== '' || this.searchServiceTask !== null || this.filterStatus !== null) {
      this.entityID = null;
      this.searchServiceTask = null;
      this.status = null;
      this.allData = [];
      this.lastItemSK = '';
      this.dataMessage = Constants.FETCHING_DATA
      this.fetchVehiclesdata();
    } else {
      return false;
    }
  }




  // newfunction() {
  //   this.apiService.getData("reminders").subscribe((result: any) => {
  //     this.allData = result.Items;
  //     console.log("this.allData", this.allData);

  //   })
  // }
  async fetchReminderCount() {
    const result = await this.apiService.getData('reminders').toPromise()
    this.totalCount = result.Count
    if (this.totalCount == 0) this.dataMessage = Constants.NO_RECORDS_FOUND
    result.Items.forEach(element => {
      if (element.isDeleted == 1) this.deletedCount++
      if (element.status == "overdue") this.OverdueService++
      if (element.status == "dueSoon") this.due++
    });
  }


  fetchvehicleSList() {
    this.apiService.getData("vehicles/get/list").subscribe((result: any) => {
      this.vehiclesList = result;
      console.log("vehicleList", result)
    });
  }

  fetchTasksList() {
    this.apiService.getData('tasks/get/list').subscribe((result: any) => { //this is for service task listing
      this.tasksData = result;
      console.log("tasksData", result)
    });
  }

  tasksfunction() {
    this.apiService.getData("tasks/get/list").subscribe((result: any) => {
      console.log("this.allData", result)
      this.taskfunction = result;

      // for (let i = 0; i < this.allData.length; i++) {
      //   if (this.allData[i].status === 'overdue') {
      //     this.OverdueService += 1;
      //   }
      //   else {
      //     this.due += 1;
      //   }

      // }
      // console.log("OverdueService", this.OverdueService)
    })
  }

  generateCSV() {
    if (this.allData.length > 0) {
      let dataObject = []
      let csvArray = []

      this.allData.forEach(element => {
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

