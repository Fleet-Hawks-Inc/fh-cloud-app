import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Constants from 'src/app/pages/fleet/constants';
@Component({
  selector: 'app-province-miles',
  templateUrl: './province-miles.component.html',
  styleUrls: ['./province-miles.component.css']
})
export class ProvinceMilesComponent implements OnInit {
  allData = [];
  vehicleId = ''
  start = null;
  end = null;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  dataMessage = Constants.FETCHING_DATA;
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  constructor(private apiService: ApiService, private toastr: ToastrService) { }
  ngOnInit(): void {
    this.fetchMilesData();
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
  }

  fetchMilesData() {
    this.apiService.getData(`vehicles/fetch/provinceMiles?startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.allData = result.Items;
      for (let data of this.allData){
        data.miles = ''
        for(let element of data.iftaMiles){
          // console.log('element',element)
        }
      }
      if (result.Items.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND
      }
      // console.log('allData==-',this.allData)
    });
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
        this.allData = []
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchMilesData()
      }
    } else {
      return false;
    }
  }

}
