import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-servicelogs',
  templateUrl: './servicelogs.component.html',
  styleUrls: ['./servicelogs.component.css']
})
export class ServicelogsComponent implements OnInit {
  allData = [];
  vendorsObject: any = {};
  tasks = [];
  taskID = null;
  vehiclesObject: any = {};
  assetsObject: any = {};
  startDate: '';
  endDate: '';
  start = null;
  end = null;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  dataMessage: string = Constants.FETCHING_DATA;
  lastItemSK = '';
  asset: any;
  loaded = false;
  searchValue = null;
  category = null;
  categoryFilter = [
    {
      'name': 'Vehicle',
      'value': 'vehicle'
    },
    {
      'name': 'Asset',
      'value': 'asset'
    },
  ]

  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchSlogsList();
    this.fetchAllVendorsIDs();
    this.fetchAllVehiclesIDs();
    this.fetchAllAssetsIDs();
    this.fetchTasks();
  }
  onScroll() {
    if (this.loaded) {
      this.fetchSlogsList();
    }
    this.loaded = false;
  }
  fetchSlogsList() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`serviceLogs/fetch/serviceLogReport?searchValue=${this.searchValue}&category=${this.category}&taskID=${this.taskID}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}`)
        .subscribe((result: any) => {
          console.log('lastItemSK', this.lastItemSK)
          console.log('lastItemSK', this.allData.length)
          this.dataMessage = Constants.FETCHING_DATA
          if (result.Items.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND
          }
          if (result.LastEvaluatedKey !== undefined) {
            this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].logSK);
          }
          else {
            this.lastItemSK = 'end';
          }
          if (result.Items.length > 0) {
            this.loaded = true;
            result['Items'].map((v: any) => {
              if (v.isDeleted === 0) {
                v.entityStatus = 'Active';
                if (v.currentStatus === 'outOfService') {
                  v.entityStatus = 'Out of service';
                } else if (v.currentStatus === 'active') {
                  v.entityStatus = 'Active';
                } else if (v.currentStatus === 'inactive') {
                  v.entityStatus = 'In-active';
                } else if (v.currentStatus === 'inActive') {
                  v.entityStatus = 'In-active';
                } else if (v.currentStatus === 'sold') {
                  v.entityStatus = 'Sold';
                }
                this.allData.push(v);
              }
            })
          }
        })
    }
  }
  fetchAllVendorsIDs() {
    this.apiService.getData('contacts/get/list/vendor')
      .subscribe((result: any) => {
        this.vendorsObject = result;
      });
  }

  fetchTasks() {
    this.apiService.getData('tasks').subscribe((result: any) => {
      this.tasks = result.Items;
    });
  }

  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/get/list')
      .subscribe((result: any) => {
        this.vehiclesObject = result;

      });
  }
  fetchAllAssetsIDs() {
    this.apiService.getData('assets/get/list')
      .subscribe((result: any) => {
        this.assetsObject = result;
      });
  }
  categoryChange() {
    this.searchValue = null;

  }
  searchFilter() {
    if (this.searchValue != null || this.category != null || this.taskID != null || this.start !== null || this.end !== null) {
      if (this.start != null && this.end == null) {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.start == null && this.end != null) {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.start > this.end) {
        this.toastr.error('Start Date should be less then end date.');
        return false;
      }
      else {
        this.dataMessage = Constants.FETCHING_DATA
        this.lastItemSK = '';
        this.allData = []
        this.fetchSlogsList()
      }
    }
    else {
      return false;
    }
  }
  resetFilter() {
    if (this.searchValue != null || this.category != null || this.taskID != null || this.start !== null || this.end !== null) {
      this.searchValue = null;
      this.category = null;
      this.taskID = null;
      this.start = null;
      this.end = null;
      this.dataMessage = Constants.FETCHING_DATA
      this.lastItemSK = '';
      this.allData = []
      this.fetchSlogsList()
    }
    else {
      return false;
    }
  }

  generateCSV() {
    if (this.allData.length > 0) {
      let dataObject = []
      let csvArray = []
      this.allData.forEach(element => {
        let taskName = '';
        for (let i = 0; i < element.allServiceTasks.serviceTaskList.length; i++) {
          const element2 = element.allServiceTasks.serviceTaskList[i];
          taskName += element2.taskName;
          if (i < element.allServiceTasks.serviceTaskList.length - 1) {
            taskName += ' & ';
          }
        }
        let obj = {}
        obj["Unit Type"] = element.unitType
        obj["Vehicle/Asset"] = element.unitName
        obj["Odometer"] = element.odometer
        obj["Vendor"] = this.vendorsObject[element.vendorID]
        obj["Service"] = taskName
        obj["Service Date"] = moment(element.completionDate).format("YYYY/MM/DD")
        obj["Status"] = element.entityStatus
        obj["Service Cost"] = element.allServiceTasks.subTotal + "." + "00" + " " + element.allServiceTasks.currency
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
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}ServiceLog-Report.csv`);
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
