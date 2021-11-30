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
  assetData = []
  startDate = '';
  endDate = '';
  start = null;
  end = null;
  assetIdentification = '';
  assetID = '';
  dataMessage = Constants.FETCHING_DATA;
  lastItemSK = '';
  datee = '';
  loaded = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  public astId;
  constructor(private apiService: ApiService, private toastr: ToastrService, private route: ActivatedRoute,) { }


  ngOnInit() {
    this.astId = this.route.snapshot.params[`astId`];
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.fetchAssetActivity()
    this.fetchAsset();
  }
  fetchAsset() {
    this.apiService.getData(`assets/fetch/detail/${this.astId}`).subscribe((result: any) => {
      this.assetData = result.Items;
    });
  }

  onScroll() {
    if (this.loaded) {
      this.fetchAssetActivity();
    }
    this.loaded = false;
  }
  fetchAssetActivity() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`trips/get/tripData?asset=${this.astId}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {
        this.allData = this.allData.concat(result.Items)
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
        if (result.Items.length > 0) {
          if (result.LastEvaluatedKey !== undefined) {
            this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].tripSK);
            this.datee = encodeURIComponent(result.Items[result.Items.length - 1].dateCreated)
          }

          else {
            this.lastItemSK = 'end';
          }
          this.loaded = true;
        }
      });
    }
  }
  searchFilter() {
    if (this.start != null && this.end != null) {
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
        this.allData = []
        this.dataMessage = Constants.FETCHING_DATA
        this.fetchAssetActivity()
      }
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
        for (let i = 0; i < element.tripPlanning.length; i++) {
          const element2 = element.tripPlanning[i];
          element2.location = element2.location.replace(/,/g, ' ');
          location += element2.location
          if (i < element.tripPlanning.length - 1) {
            location += " & ";
          }
        }
        let obj = {}
        obj["Asset"] = element.assetName.replace(/, /g, ' &');;
        obj["Trip#"] = element.tripNo;
        obj["Order#"] = element.orderName.replace(/, /g, ' &');
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
