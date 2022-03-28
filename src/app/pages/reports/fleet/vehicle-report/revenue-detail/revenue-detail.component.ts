import { Component, OnInit } from '@angular/core';
import { ApiService, AccountService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from "@angular/router";
import * as moment from 'moment';
import Constants from 'src/app/pages/fleet/constants';
import * as _ from 'lodash';
@Component({
  selector: 'app-revenue-detail',
  templateUrl: './revenue-detail.component.html',
  styleUrls: ['./revenue-detail.component.css']
})
export class RevenueDetailComponent implements OnInit {
  // vehicleId = null;
  start = null;
  end = null;
  allData:any = [];
  vehicleData = [];
  lastItemSK = ''
  datee = ''
  fuel = []
  dataMessage = Constants.FETCHING_DATA;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  loaded = false;
  vehicleIdentification = ''
  suggestedVehicles = [];
  public vehicleId;
  totalQty = 0;
  recptData = []
  orderIDs: any = []
  constructor(private apiService: ApiService, private accountService: AccountService, private toastr: ToastrService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(5, 'months').format('YYYY-MM-DD');

    this.vehicleId = this.route.snapshot.params[`vehicleId`];
    this.fetchRevenueData()
    // this.fetchFuel()
    this.fetchVehicleName()
  }
  fetchVehicleName() {
    this.apiService.getData(`vehicles/fetch/detail/${this.vehicleId}`).subscribe((result: any) => {
      this.vehicleData = result.Items;
    });
  }

  fetchRevenueData() {
    this.apiService.getData(`vehicles/fetch/revenue/report?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {
      this.allData = this.allData.concat(result.Items)
      if (result.Items.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND
      }
      // for(let data of this.allData){
      //   for(let recData of data.receiptData){
      //     for(let rec of recData){
      //       data.recInv = []
      //       data.recInv.push(rec.invNOs)
      //     }
      //   }
      // }
      if (result.LastEvaluatedKey !== undefined) {
        this.lastItemSK = encodeURIComponent(result.LastEvaluatedKey.tripSK);
        this.datee = encodeURIComponent(result.LastEvaluatedKey.dateCreated)
      }
      else {
        this.lastItemSK = 'end';
      }
      this.loaded = true;
    })
  }

  // onScroll() {
  //   if (this.loaded) {

  //     this.fetchRevenueData();
  //     // this.fetchFuel();
  //     // this.fetchVehicleName();
  //   }
  //   this.loaded = false;
  // }
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
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchRevenueData();
        this.fetchVehicleName();
      }
    } else {
      return false;
    }
  }
  fetchFuel() {
    this.apiService.getData(`fuelEntries/getBy/vehicle/trips/${this.vehicleId}?startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.fuel = result.Items;
      let total = 0;
      for (let element of this.fuel) {
        if (element.data && element.data.qty) {
          total += parseFloat(element.data.qty)
        }
      }
      this.totalQty = total;
    });
  }
}