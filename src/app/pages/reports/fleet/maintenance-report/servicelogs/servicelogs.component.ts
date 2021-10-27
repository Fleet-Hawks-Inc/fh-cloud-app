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
  vehicleID = null;
  assetID = null;
  taskID = null;
  vehiclesObject: any = {};
  assetsObject: any = {};
  // startDate: '';
  // endDate: '';
  start = null;
  end = null;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  dataMessage: string = Constants.FETCHING_DATA;
  asset: any;
  // taskname = ''

  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchServicelogs();
    this.fetchAllVendorsIDs();
    this.fetchAllVehiclesIDs();
    this.fetchAllAssetsIDs();
    this.fetchTasks();


  }
  fetchServicelogs() {
    this.apiService.getData(`serviceLogs/fetch/serviceLogReport?vehicleID=${this.vehicleID}&asset=${this.assetID}&taskID=${this.taskID}&startDate=${this.start}&endDate=${this.end}`)
      .subscribe((result: any) => {
        this.allData = result.Items;
        console.log('this.allData', this.allData)
        this.dataMessage = Constants.FETCHING_DATA
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
        }
        result['Items'].map((v: any) => {
          v.entityStatus = 'Active';
          if (v.currentStatus === 'outOfService') {
            v.entityStatus = 'Out of service';
          } else if (v.currentStatus === 'active') {
            v.entityStatus = 'Active';
          } else if (v.currentStatus === 'inActive') {
            v.entityStatus = 'In-active';
          } else if (v.currentStatus === 'sold') {
            v.entityStatus = 'Sold';
          }
        })

      })
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
      // this.tasks["tasks"] += this.taskname;
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
        console.log('this assetsObject', this.assetsObject)
      });
  }
  searchFilter() {
    if (this.vehicleID != null || this.assetID != null || this.taskID != null || this.start !== null || this.end !== null) {
      this.dataMessage = Constants.FETCHING_DATA
      this.allData = []
      this.fetchServicelogs()
    }
    else {
      return false;
    }
  }
  resetFilter() {
    if (this.vehicleID != null || this.assetID != null || this.taskID != null || this.start !== null || this.end !== null) {
      this.vehicleID = null;
      this.assetID = null;
      this.taskID = null;
      this.start = null;
      this.end = null;
      this.dataMessage = Constants.FETCHING_DATA
      this.allData = []
      this.fetchServicelogs()
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
        let obj = {}
        obj["Unit Type"] = element.unitType
        obj["Vehicle/Asset"] = element.unitName
        obj["Odometer"] = element.odometer
        obj["Vendor"] = this.vendorsObject[element.vendorID]
        obj["Service"] = element.taskname
        obj["Service Date"] = element.completionDate
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
