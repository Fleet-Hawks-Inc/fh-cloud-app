import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Constants from 'src/app/pages/fleet/constants';
import { CountryStateCityService } from "src/app/services/country-state-city.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-province-summary',
  templateUrl: './province-summary.component.html',
  styleUrls: ['./province-summary.component.css']
})
export class ProvinceSummaryComponent implements OnInit {
  allData: any = [];
  docCountries = [];
  states = [];
  start = null;
  end = null;
  dataMessage = Constants.FETCHING_DATA;
  lastItemSK = '';
  datee = '';
  loaded = false;
  exportData = [];
  stateCode = null;
  // dummyData = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  usStateArr: any;
  element3: any;
  suggestedVehicles = [];
  vehicleIdentification = '';
  vehicleId = '';
  constructor(private apiService: ApiService, private toastr: ToastrService, private countryStateCity: CountryStateCityService,) { }
  ngOnInit(): void {

    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.fetchProvinceMilesData();
  }
  getSuggestions = _.debounce(function (value) {

    value = value.toLowerCase();
    if (value != '') {
      this.apiService
        .getData(`vehicles/suggestion/${value}`)
        .subscribe((result) => {

          this.suggestedVehicles = result;
        });
    } else {
      this.suggestedVehicles = []
    }
  }, 800);
  setVehicle(vehicleIDs, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleId = vehicleIDs;
    this.suggestedVehicles = [];
  }
  fetchProvinceMilesData() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`vehicles/fetch/provinceMiles?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {
        this.allData = this.allData.concat(result.summaryResult)
        // console.log('allData-',this.allData)
        if (result.summaryResult.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
        }
        if (result.LastEvaluatedKey !== undefined) {
          this.lastItemSK = encodeURIComponent(result.LastEvaluatedKey.tripSK);
          this.datee = encodeURIComponent(result.LastEvaluatedKey.dateCreated)
        }
        else {
          this.lastItemSK = 'end';
        }
        this.loaded = true;


        for (let element of result.summaryResult) {
          element.newStatus = element.status;
          if (element.stlLink === true) {
            element.newStatus = "settled";
          }
          else {
            if (element.recall === true) {
              element.newStatus = `${element.status} (R)`;
            }
          }

        }
      });
    }
  }

  onScroll() {
    if (this.loaded) {
      this.fetchProvinceMilesData();
    }
    this.loaded = false;
  }
  searchFilter() {
    if (this.vehicleIdentification !== '' || this.start != null && this.end != null) {
      this.vehicleIdentification = this.vehicleIdentification.toLowerCase();
      if (this.vehicleId == '') {
        this.vehicleId = this.vehicleIdentification;
      }
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
        this.lastItemSK = '';
        this.suggestedVehicles = [];
        this.allData = [];
        // this.dummyData = [];
        this.dataMessage = Constants.FETCHING_DATA;

        this.fetchProvinceMilesData()
      }
    } else {
      return false;
    }
  }
  reset() {
    if (this.vehicleIdentification !== '') {
      this.vehicleId = '';
      this.suggestedVehicles = [];
      this.vehicleIdentification = '';
      this.lastItemSK = '';
      this.allData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchProvinceMilesData();
    } else {
      return false;
    }
  }
  fetchFullExport(type = '') {
    this.apiService.getData(`vehicles/fetch/provinceMiles/report?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.exportData = result.summaryResult;
      console.log('  this.exportData', this.exportData)
      for (let veh of this.exportData) {
        veh.miles = 0
        veh.newStatus = veh.status;
        if (veh.recall === true) {
          veh.newStatus = `${veh.status} (R)`;
        }
        else {
          if (veh.stlLink === true) {
            veh.newStatus = "settled";
          }
        }
      }
      this.generateCSV(type);

    });
  }
  generateCSV(type = '') {
    if (this.exportData.length > 0) {
      let dataObject = []
      let csvArray = []
      this.exportData.forEach(element => {
        let canMiles = ''
        let canState = ''
        let us = ''
        let can = ''
        let stateArr = [];
        if (type === 'CAN') {
          stateArr = element.canStates;
          // console.log('stateArr 1', stateArr)
        } else if (type === 'US') {
          stateArr = element.usStates;
          // console.log('stateArr 22', stateArr)
        }
        stateArr.forEach((tripUSState, stateIndex) => {
          // if (element.provinceData && element.provinceData.length > 0) {
          // for(let element1 of element.caProvinces ){
          //   for(let element of element1.caProvinces ){

          //   }
          // }
          // for (let data of element.usProvinces) {
          //   for (let data1 of data) {
          //     us += `"${data1.key}: ${data1.value}\n\"`;
          //     console.log('us--', us)
          //   }
          // }
          // for (let i = 0; i < element.provinceData.length; i++) {
          //   const element2 = element.provinceData[i];
          //   for (let k = 0; k < element2.canProvince.length; k++) {
          //     const element4 = element2.canProvince[k];
          //     canState += `"${element4.StCntry}\n\"`;
          //     canMiles += `"${element4.Total}\n\"`;
          //   }
          let obj = {}
          obj["Vehicle"] = element.vehicle;
          if (type === 'US') {
            obj["Province(US)"] = element.usProvinces[stateIndex];
          }
          else {
            obj["Province(Canada)"] = element.caProvinces[stateIndex];
          }

          obj["Trip Status"] = element.newStatus;
          dataObject.push(obj)
          // console.log('obj', obj)
          // console.log('dataObject', dataObject)
          // }
          // }

        });
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
        if (type === 'US') {
          link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}US-ProvinceMiles-Report.csv`);
        }
        else {
          link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}CAN-ProvinceMiles-Report.csv`);
        }

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
