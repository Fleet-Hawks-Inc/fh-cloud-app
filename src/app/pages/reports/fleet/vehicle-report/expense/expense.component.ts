import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import Constants from 'src/app/pages/fleet/constants';
import { environment } from '../../../../../../environments/environment';
import { OnboardDefaultService } from '../../../../../services/onboard-default.service';
import * as _ from 'lodash';
import { result } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from "src/app/services";

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  data = []
  allData = [];
  vehicleData = []
  startDate = '';
  endDate = '';
  start: any = null;
  end: any = null;
  lastItemSK = '';
  datee = '';
  loaded = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  dataMessage = Constants.FETCHING_DATA;
  date = new Date();
  exportData = [];
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  public vehicleId;
  driverList = []
  fuelList = []
  allVehicles = []
  lastEvaluatedKey = ''
  unitName: string;
  vehicle = []
  public unitID;
  assetUnitID = null;
  lastTimeCreated = ''
  //service log data
  logs = []
  issuesObject = []
  vehicleID = null;
  taskID = null;
  assetID = null;
  vehiclesObject = []
  tasks = []
  // payment
  settlements = []
  contacts = []
  payments = [];
  filter = {
    startDate: null,
    endDate: null,
    type: null,
    paymentNo: null,
  };
  serviceLogName = []
  payment = []
  driver: any = []
  finalAmount = ''
  entityId: any

  constructor(private apiService: ApiService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private accountService: AccountService,) {
  }

  ngOnInit(): void {
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.vehicleId = this.route.snapshot.params[`vehicleId`];
    this.fetchVehicleListing();
    this.fetchVehicleName();
    this.fetchAllIssuesIDs()
    this.fetchFuelVehicles();
    this.fetchServiceLogName();

    this.fetchSettlement();

  }


  fetchDriverByTrip() {
    this.accountService.getData(`driver-payments/get/driver/enitity/expense?drivers=${encodeURIComponent(JSON.stringify(this.driver))}`).subscribe((result: any) => {
      this.payments = result
      // for (var i = 0; i < this.driver.length; i++) {
      //   for (var j = 0; j < this.driver.length; j++) {
      //     if (i != j) {
      //       if (this.driver[i] == this.driver[j]) {
      //         return true; // means there are duplicate values
      //       }
      //     }
      //   }
      // }
      // return false; // means there are no duplicate values.
    })
  }
  fetchSettlement() {
    this.accountService
      .getData(`settlement/get/list`)
      .subscribe((result: any) => {
        this.settlements = result;
      });
  }


  fetchAllIssuesIDs() {
    this.apiService.getData("issues/get/list").subscribe((result: any) => {
      this.issuesObject = result;
    });
  }

  fetchServiceLogName() {

    this.apiService.getData(`serviceLogs/getBy/vehicle/name/trips/${this.vehicleId}?startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.serviceLogName = result.Items
    })
  }

  fetchVehicleName() { //show vehicle name in tile
    this.apiService.getData(`vehicles/fetch/detail/${this.vehicleId}`).subscribe((result: any) => {
      this.vehicleData = result.Items;
    });
  }
  fetchFuelVehicles() { // all data in fuel detail
    this.apiService.getData(`fuelEntries/getBy/vehicle/trips/${this.vehicleId}?startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.vehicle = result.Items;
    });
  }

  fetchVehicleListing() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`vehicles/fetch/TripData?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
        }
        this.allData = this.allData.concat(result.Items)
        for (let veh of this.allData) {
          let dataa = veh
          veh.miles = 0

          for (let element of dataa.tripPlanning) {
            veh.miles += Number(element.miles);
          }
          for (let driv of dataa.driverIDs) {
            this.driver.push(driv)
          }
        }
        this.fetchDriverByTrip();
        if (result.LastEvaluatedKey !== undefined) {

          this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].tripSK);
          this.datee = encodeURIComponent(result.Items[result.Items.length - 1].dateCreated)

        }
        else {
          this.lastItemSK = 'end';
        }
        this.loaded = true;
      });
    }

  }
  onScroll() {
    if (this.loaded) {
      // this.fetchVehicleListing();
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
        this.lastEvaluatedKey = ''
        this.allData = []
        this.vehicle = []
        this.fuelList = []
        this.serviceLogName = []
        this.payments = []
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchVehicleListing()
        this.fetchFuelVehicles()
        this.fetchServiceLogName()
        this.fetchDriverByTrip();
      }
    } else {
      return false;
    }
  }
}
