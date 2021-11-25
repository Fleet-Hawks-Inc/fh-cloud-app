import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import { ToastrService } from "ngx-toastr";
import * as _ from 'lodash';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import { result } from 'lodash';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  allData = [];
  assetData = [];
  lastItemSK = '';
  loaded = false
  assetsObject = [];
  startDate = '';
  endDate = '';
  start = null;
  end = null;
  assetIdentification = '';
  assetID = '';
  dataMessage = Constants.NO_RECORDS_FOUND
  suggestedAssets = [];
  ordersObject = []
  total = 0;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  public astId;
  constructor(private apiService: ApiService, private toastr: ToastrService, private route: ActivatedRoute,) { }


  ngOnInit() {
    this.astId = this.route.snapshot.params[`astId`];
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.fetchTripData()
    this.fetchAsset();
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
  fetchAsset() {
    this.apiService.getData('assets/get/minor/details').subscribe((result: any) => {
      this.assetData = result;
    });
  }

  fetchTripData() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`trips/get/tripData?asset=${this.astId}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}`).subscribe((result: any) => {
        this.allData = result.Items;
        for (let asst of this.allData) {
          let dataa = asst
          asst.miles = 0
          asst.ordr = ''

          for (let element of dataa.tripPlanning) {
            asst.miles += Number(element.miles);
          }
        }
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
        }
        this.suggestedAssets = [];
        if (result.Items.length > 0) {

          if (result.LastEvaluatedKey !== undefined) {
            this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].tripSK);
          }
          else {
            this.lastItemSK = 'end'
          }
          // this.allData = this.allData.concat(result.Items)

          this.loaded = true;
        }
      });
    }
  }
  onScroll() {
    if (this.loaded) {
      this.fetchTripData();
    }
    this.loaded = false;
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
        this.lastItemSK = '';
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
      this.assetIdentification = '';
      this.start = null;
      this.end = null;
      this.suggestedAssets = [];
      this.allData = [];
      this.lastItemSK = '';
      this.fetchTripData();
      this.dataMessage = Constants.FETCHING_DATA
      this.dataMessage = Constants.NO_RECORDS_FOUND
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
        let location = ''
        let j: any
        let order = ''
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
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}assetActivity-Report.csv`);
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
