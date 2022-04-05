import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import * as _ from "lodash";
import { environment } from 'src/environments/environment';
import { result } from 'lodash';



@Component({
  selector: 'app-serviceprogram',
  templateUrl: './serviceprogram.component.html',
  styleUrls: ['./serviceprogram.component.css']
})
export class ServiceprogramComponent implements OnInit {
  serviceProgramList: any = [];
  searchVehicle: any = [];
  dataMessage: string = Constants.FETCHING_DATA;
  lastItemSK = "";
  loaded: any = false;
  description: any
  total_Cost: any
  vehicles = {};
  vehicle: any = null;
  programName: any = null;
  serviceTasks: any[];
  record: any = [];
  disableSearch = false;
  exportFull = []
  constructor(private apiService: ApiService, private toastr: ToastrService) { }


  ngOnInit() {
    this.fetchvehiclesList()
    this.fetchServiceVehicleList()

  }

  async fetchServiceVehicleList() {
    if (this.lastItemSK !== 'end') {
      const result = await this.apiService.getData(`servicePrograms/fetch/report?vehicle=${this.vehicle}&programName=${this.programName}&lastKey=${this.lastItemSK}`).toPromise();
      this.dataMessage = Constants.FETCHING_DATA
      if (result.Items.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND
      }
      if (result.Items.length > 0) {
        if (result.LastEvaluatedKey !== undefined) {
          this.lastItemSK = encodeURIComponent(result.LastEvaluatedKey.sk);
        }
        else {
          this.lastItemSK = 'end'
        }
        this.serviceProgramList = this.serviceProgramList.concat(result.Items);
        this.loaded = true;
      }
      this.disableSearch = false;
    }
  }

  fetchvehiclesList() {
    this.apiService.getData("vehicles/get/list").subscribe((result: any) => {
      this.vehicles = result;
    });
  }

  searchFilter() {
    if (this.vehicle !== null || this.programName !== null) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.disableSearch = true;
      this.serviceProgramList = [];
      this.lastItemSK = '';
      this.fetchServiceVehicleList();
    } else {
      return false
    }

  }

  onScroll() {
    if (this.loaded) {
      this.fetchServiceVehicleList();
    }
    this.loaded = false;
  }

  resetFilter() {
    if (this.vehicle !== null || this.programName !== null || this.lastItemSK !== '') {
      this.disableSearch = true;
      this.vehicle = null;
      this.programName = null;
      this.lastItemSK = '';
      this.dataMessage = Constants.FETCHING_DATA
      this.serviceProgramList = []
      this.fetchServiceVehicleList()
    }
    else {
      return false;
    }
  }
  fetchExportfullList() {
    this.apiService.getData('servicePrograms/fetch/report/export').subscribe((result: any) => {
      this.exportFull = result;
      this.generateCSV();
    })

  }
  csv() {
    if (this.vehicle !== null || this.programName !== null) {
      this.exportFull = this.serviceProgramList
      this.generateCSV();
    }
    else {
      this.fetchExportfullList()
    }
  }
 
  generateCSV() {
    if (this.exportFull.length > 0) {
      let dataObject = []
      let csvArray = []
      this.exportFull.forEach(element => {
        let obj = {}
        let ab  = ''
        let allVehicles:any = []
        for (const el of element.vehicles) {
          allVehicles.push(this.vehicles[el])
        }
        if(allVehicles.length > 1){
         ab =  '& ';
        }
        let veh = ''
        
        obj["Vehicle"] = allVehicles.join(" & ")
        obj["Service Program Name"] = element.programName
        obj["Description"] = element.description
        dataObject.push(obj)
      });
      let headers = Object.keys(dataObject[0]).join(',')
      headers += '\n'
      csvArray.push(headers)
      dataObject.forEach(element => {
        let obj = Object.values(element).join(',')
        obj += '\n'
        csvArray.push(obj)
      });
      const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Service-Program.csv`);
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