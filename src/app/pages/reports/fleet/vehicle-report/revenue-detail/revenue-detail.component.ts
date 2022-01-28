import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
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
  allData = [];
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
  constructor(private apiService: ApiService, private toastr: ToastrService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');

    this.vehicleId = this.route.snapshot.params[`vehicleId`];
    this.fetchRevenueData()
    this.fetchFuel()
    // this.fetchVehicleName()
    // console.log(' this.vehicleId', this.vehicleId)
  }
  // fetchVehicleName() {
  //   this.apiService.getData(`vehicles/fetch/detail/${this.vehicleId}`).subscribe((result: any) => {
  //     this.vehicleData = result.Items;
  //   });
  // }
  // getSuggestions = _.debounce(function (value) {

  //   value = value.toLowerCase();
  //   if (value != '') {
  //     this.apiService
  //       .getData(`vehicles/suggestion/${value}`)
  //       .subscribe((result) => {

  //         this.suggestedVehicles = result;
  //       });
  //   } else {
  //     this.suggestedVehicles = []
  //   }
  // }, 800);
  // setVehicle(vehicleIDs, vehicleIdentification) {
  //   this.vehicleIdentification = vehicleIdentification;
  //   this.vehicleId = vehicleIDs;
  //   this.suggestedVehicles = [];
  // }

  fetchRevenueData() {
    this.apiService.getData(`vehicles/fetch/revenue/report?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {
      this.allData = this.allData.concat(result.Items)
      // console.log(' this.allData', this.allData)
      if (result.Items.length === 0) {
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
    })
  }
  onScroll() {
    if (this.loaded) {

      this.fetchRevenueData();
      this.fetchFuel();
      // this.fetchVehicleName();
    }
    this.loaded = false;
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
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchRevenueData();
        // this.fetchVehicleName();
      }
    } else {
      return false;
    }
  }
  // fuelQuery() {
  //   let veh = encodeURIComponent(JSON.stringify(this.vehicleId));
  //   // console.log('veh', veh)
  //   this.apiService.getData(`fuelEntries/get/vehicle/enteries?vehicle=${veh}&start=${this.start}&end=${this.end}`).subscribe((result: any) => {

  //     this.data = result
  //     console.log('data', this.data)

  //   })
  // }

  fetchFuel() {
    this.apiService.getData(`fuelEntries/getBy/vehicle/trips/${this.vehicleId}?startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.fuel = result.Items;
      // for (let element of this.fuel) {
      //   let fuelData = element
      //   element.abc = 0
      //   for (let fuel of fuelData.data) {
      //     element.abc += Number(fuel.qty);
      //     console.log(' fuel', fuel)
      //   }
      // }
      console.log('fuel', this.fuel)
    });
  }

}
