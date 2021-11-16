import { Component, OnInit } from '@angular/core';
import { result } from 'lodash';
import { resourceUsage } from 'process';
import { VehicleListComponent } from 'src/app/pages/fleet/vehicles/vehicle-list/vehicle-list.component';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import { ToastrService } from "ngx-toastr";
import * as moment from 'moment'

@Component({
  selector: 'app-vehicle-renewals',
  templateUrl: './vehicle-renewals.component.html',
  styleUrls: ['./vehicle-renewals.component.css']
})
export class VehicleRenewalsComponent implements OnInit {
  vehiclesList = {};
  tasksData = [];
  allData = [];
  entityID = null;
  serviceTasks = [];
  lastEvaluatedKey = "";
  loaded = false
  lastItemSK = "";
  filterStatus = null;
  searchServiceTask = null;
  status = null;
  count = {
    total: '',
    overdue: '',
    dueSoon: '',
  }
  dataMessage: string = Constants.FETCHING_DATA
  // record: any = {};
  record = [];
  data = [];

  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchvehiclesList();
    this.fetchTasksList();
    this.fetchReminderCount();
    this.fetchVehiclesdata();
    this.fetchServiceTask();
    this.fetchVehicleIDs();
    // this.fetchAllExport();
  }
  setFilterStatus(val) {
    this.filterStatus = val;
  }
  fetchReminderCount() {
    this.apiService.getData("reminders/fetch/count?type=vehicle").subscribe((result: any) => {
      this.count = result;
    })
  }
  fetchServiceTask() {
    let test = [];
    this.apiService.getData('tasks').subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === 'vehicle');
    });
  }
  fetchVehiclesdata() {
    if (this.lastItemSK !== 'end')
      this.apiService.getData(`reminders/fetch/records?reminderIdentification=${this.entityID}&serviceTask=${this.searchServiceTask}&status=${this.filterStatus}&lastKey=${this.lastItemSK}&reminderType=vehicle`).subscribe((result: any) => {
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
  fetchvehiclesList() {
    this.apiService.getData("vehicles/get/list").subscribe((result: any) => {
      this.vehiclesList = result;
    });

  }
  fetchVehicleIDs() {
    this.apiService.getData('vehicles/list/minor').subscribe((result: any) => {
      result["Items"].map((r: any) => {
        if (r.isDeleted === 0) {
          this.record.push(r);
        }
      })
    })
  }

  fetchTasksList() {
    this.apiService.getData('tasks/get/list').subscribe((result: any) => { //this is for service task listing
      this.tasksData = result;
    });
  }
  searchData() {
    if (this.entityID !== null || this.searchServiceTask !== null || this.filterStatus !== null) {
      this.allData = [];
      this.lastItemSK = '';
      this.fetchVehiclesdata();
    }
    else {
      return false;
    }
  }
  onScroll() {
    if (this.loaded) {
      this.fetchVehiclesdata();
    }
    this.loaded = false;
  }
  resetData() {
    if (this.entityID !== null || this.searchServiceTask !== null || this.filterStatus !== null) {
      this.entityID = null;
      this.searchServiceTask = null;
      this.filterStatus = null;
      this.status = null;
      this.allData = [];
      this.lastItemSK = '';
      this.dataMessage = Constants.FETCHING_DATA
      this.fetchVehiclesdata();
    } else {
      return false;
    }
  }
  fetchAllExport() {
    this.apiService.getData("reminders/fetch/export?type=vehicle").subscribe((result: any) => {
      this.data = result.Items;
      this.generateCSV();
    })
  }
  csvData() {
    if (this.entityID !== null || this.searchServiceTask !== null || this.filterStatus !== null) {
      this.data = this.allData;
      this.generateCSV();
    } else {
      this.fetchAllExport()
    }
  }
  generateCSV() {
    if (this.data.length > 0) {
      let dataObject = []
      let csvArray = []
      this.data.forEach(element => {
        let obj = {}
        obj["Vehicle"] = this.vehiclesList[element.entityID]
        obj["Renewal Type"] = this.tasksData[element.tasks.taskID] + " " + element.status
        obj["Due Date"] = element.tasks.dueDat
        obj["Send Reminder"] = element.tasks.time + " " + element.tasks.timeUnit
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
        link.setAttribute('download', `${moment().format("YYYY/MM/DD:HH:m")}Vehicle-Renewals-Report.csv`);
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

