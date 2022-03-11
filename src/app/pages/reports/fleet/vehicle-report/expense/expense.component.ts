import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import Constants from 'src/app/pages/fleet/constants';
import * as _ from 'lodash';
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
  expDate = ''
  loaded = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  dataMessage = Constants.FETCHING_DATA;
  date = new Date();
  exportData = [];
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  public vehicleId;
  lastEvaluatedKey = ''
  fuel = []
  payments = [];
  expensePay = []
  filter = {
    startDate: null,
    endDate: null,
    type: null,
    paymentNo: null,
  };
  serviceLogData = []
  payment = []
  driver: any = []
  lastExpPay = ''
  totalExpense = 0
  constructor(private apiService: ApiService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private accountService: AccountService,) {
  }

  ngOnInit(): void {
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.vehicleId = this.route.snapshot.params[`vehicleId`];
    this.fetchTrpByVehicle();
    this.fetchVehicleName();
    this.fetchFuelByVehicle();
    this.fetchSlogByVehicle();
    this.fetchExpensePayment()
    // this.fetchVehiclesList();
  }


  async fetchDriverPayment() {
    const result: any = await this.accountService.getData(`driver-payments/get/driver/payment?drivers=${encodeURIComponent(JSON.stringify(this.driver))}`)
      .toPromise();
    this.payments = result;
    if (result.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND
    }
  }
  fetchExpensePayment() {
    if (this.lastExpPay !== 'end') {
      this.accountService.getData(`expense/get/expense/pay/byTrp/${encodeURIComponent(JSON.stringify(this.vehicleId))}?startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastExpPay}&date=${this.expDate}`).subscribe((result: any) => {
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
        }
        for (let i = 0; i < result.Items.length; i++) {
          const expenseData = result.Items[i]
          this.totalExpense += parseFloat(expenseData.finalTotal)
        }
        if (result.LastEvaluatedKey !== undefined) {
          this.lastExpPay = encodeURIComponent(result.LastEvaluatedKey.sk);
          this.expDate = encodeURIComponent(result.LastEvaluatedKey.transDate);
        }
        else {
          this.lastExpPay = 'end'
        }
        this.loaded = true;
        this.expensePay = this.expensePay.concat(result.Items)
      })
    }
  }
  fetchSlogByVehicle() {
    this.apiService.getData(`serviceLogs/getBy/vehicle/name/trips/${this.vehicleId}?startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.serviceLogData = result.Items
      if (result.Items.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND
      }
    })
  }


  // fetchVehiclesList() {
  //   this.apiService.getData("vehicles/get/list").subscribe((result: any) => {
  //     this.vehicleList = result;
  //   });
  // }

  fetchVehicleName() { //vehicle name in tile
    this.apiService.getData(`vehicles/fetch/detail/${this.vehicleId}`).subscribe((result: any) => {
      this.vehicleData = result.Items;
      if (result.Items.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND
      }
    });
  }
  fetchFuelByVehicle() {
    this.apiService.getData(`fuelEntries/getBy/vehicle/trips/${this.vehicleId}?startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.fuel = result.Items;
      if (result.Items.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND
      }
    });
  }

  fetchTrpByVehicle() {
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
        this.fetchDriverPayment();
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
      this.fetchTrpByVehicle();
    }
    this.loaded = false;
  }
  onScrollExpense() {
    if (this.loaded) {
      this.fetchExpensePayment();
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
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastItemSK = '';
        this.lastExpPay = ''
        this.allData = [];
        this.fuel = [];
        // this.fuelList = [];
        this.serviceLogData = [];
        this.payments = [];
        this.expensePay = [];
        this.totalExpense = 0;
        // this.fetchTrpByVehicle()
        // this.fetchFuelByVehicle()
        // this.fetchSlogByVehicle()
        this.fetchExpensePayment();
      }
    } else {
      return false;
    }
  }

  generateCSV() {
    if (this.expensePay.length > 0) {
      let dataObject = []
      let csvArray = []
      this.expensePay.forEach(element => {
        let obj = {}
        obj["Vehicle Name/Number"] = element.vehicleName;
        obj["Expense Type"] = element.categoryName;
        obj["Amount"] = element.finalTotal + " " + element.currency;

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
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}VehicleExpense-Report.csv`);
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
