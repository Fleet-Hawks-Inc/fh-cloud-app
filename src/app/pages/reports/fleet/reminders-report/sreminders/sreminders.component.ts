import { Component, OnInit } from '@angular/core';
import { map, result } from 'lodash';
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
  entityID = null;
  lastItemSK = "";
  type = "null";
  allData = [];
  lastEvaluatedKey = "";
  vehiclesList = [];
  taskfunction = [];
  tasksData = {};
  serviceList = [];
  loaded = false
  filterStatus = null;
  dataMessage: string = Constants.FETCHING_DATA
  count = {
    total: '',
    overdue: '',
    dueSoon: '',
  };
  record = [];
  export = [];
  data = [];

  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchReminderList();
    this.fetchvehiclesList();
    this.fetchTasksList();
    this.fetchReminderCount();

    this.fetchVehicleIDs();
  }
  setFilterStatus(val) {
    this.filterStatus = val;
  }

  fetchReminderList() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`reminders/fetch/report/list?entityID=${this.entityID}&serviceTask=${this.searchServiceTask}&status=${this.filterStatus}&type=service&lastKey=${this.lastItemSK}`).subscribe((result: any) => {

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
      this.fetchReminderList();
    }
    this.loaded = false;
  }
  searchData() {
    if (this.entityID !== null || this.searchServiceTask !== null || this.filterStatus !== null) {
      this.allData = [];
      this.lastItemSK = '';
      this.fetchReminderList();
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
      this.allData = [];
      this.lastItemSK = '';
      this.filterStatus = null;
      this.dataMessage = Constants.FETCHING_DATA
      this.fetchReminderList();
    } else {
      return false;
    }
  }
  fetchReminderCount() {
    this.apiService.getData(`reminders/fetch/count?type=service`).subscribe((result: any) => {
      this.count = result;
    })
  }
  fetchvehiclesList() {
    this.apiService.getData("vehicles/get/list").subscribe((result: any) => {
      this.vehiclesList = result;
    });
  }
  fetchTasksList() {
    this.apiService.getData('tasks/get/list?type=service').subscribe((result: any) => {
      this.tasksData = result;

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
  fetchAllExport() {
    this.apiService.getData("reminders/fetch/export?type=service").subscribe((result: any) => {
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
        link.setAttribute('download', `${moment().format("YYYY/MM/DD:HH:m")}Service-Reminders-Report.csv`);
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