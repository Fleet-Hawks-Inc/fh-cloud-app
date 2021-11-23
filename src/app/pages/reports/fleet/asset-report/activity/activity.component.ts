import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import { ToastrService } from "ngx-toastr";
import * as _ from 'lodash';
import * as moment from 'moment';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  allData = [];
  assetsObject = [];
  startDate: '';
  endDate: '';
  start = null;
  end = null;
  assetIdentification = '';
  assetID = '';
  assetIDD: any = []
  dataMessage: string = Constants.FETCHING_DATA;
  suggestedAssets = [];
  ordersObject = []
  total = 0;

  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {

  }
  getSuggestions = _.debounce(function (value) {
    value = value.toLowerCase();
    if (value != '') {
      this.apiService
        .getData(`assets/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestedAssets = result;
        });
    } else {
      this.suggestedAssets = [];
    }
  }, 800)

  setAsset(assetID, assetIdentification) {
    this.assetIdentification = assetIdentification;
    this.assetID = assetID;
    this.suggestedAssets = [];
  }

  fetchTripData() {
    this.apiService.getData(`trips/get/tripData?asset=${this.assetID}&startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.allData = result.Items;
      for (let asst of this.allData) {
        let dataa = asst
        asst.miles = 0
        for (let element of dataa.tripPlanning) {
          asst.miles += Number(element.miles);
        }
      }
      if (result.Items.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND
      }
      this.suggestedAssets = [];

    });
  }
  searchFilter() {
    if (this.assetID != '' && this.start != null && this.end != null) {
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
        this.suggestedAssets = [];
        this.allData = []
        this.dataMessage = Constants.FETCHING_DATA
        this.fetchTripData()
      }
    }
    else {
      return false;
    }
  }

  resetFilter() {
    if (this.assetID !== '' || this.start != null && this.end != null) {
      this.assetID = '';
      this.start = null;
      this.end = null;
      this.suggestedAssets = [];
      this.allData = [];
      this.fetchTripData();
      this.dataMessage = Constants.FETCHING_DATA
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
        let miles = '';
        let location = ''
        for (let i = 0; i < element.tripPlanning.length; i++) {
          const element2 = element.tripPlanning[i];
          miles += element2.miles
        }
        for (let i = 0; i < element.tripPlanning.length; i++) {
          const element2 = element.tripPlanning[i];
          element2.location = element2.location.replace(/,/g, ' ');
          location += element2.location
          if (i < element.tripPlanning.length - 1) {
            location += " & ";
          }
        }
        let obj = {}
        obj["Asset"] = element.assetName;
        obj["Trip#"] = element.tripNo;
        obj["Order#"] = element.orderName
        obj["location"] = location;
        obj["Total Miles"] = element.miles;
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
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Asset-Report.csv`);
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
