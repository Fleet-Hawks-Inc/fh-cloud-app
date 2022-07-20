import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import Constants from 'src/app/pages/fleet/constants';
<<<<<<< HEAD
import { environment } from '../../../../../../environments/environment';
import { OnboardDefaultService } from '../../../../../services/onboard-default.service';
import * as _ from 'lodash';
import { result } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from "src/app/services";

=======
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from "src/app/services";
>>>>>>> 96717babcce47571d1060031474203ddd3364440
@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
<<<<<<< HEAD

=======
  data = []
>>>>>>> 96717babcce47571d1060031474203ddd3364440
  allData = [];
  vehicleData = []
  startDate = '';
  endDate = '';
<<<<<<< HEAD
  start = null;
  end = null;
  lastItemSK = '';
  datee = '';
  loaded = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  dataMessage = Constants.FETCHING_DATA;
=======
  start: any = null;
  end: any = null;
  lastItemSK = '';
  datee = '';
  expDate = ''
  loaded = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  dataMessage = Constants.FETCHING_DATA;
  logMessage = Constants.FETCHING_DATA;
  expenseMessage = Constants.FETCHING_DATA;
  fuelMessage = Constants.FETCHING_DATA;
  drvPayMessage = Constants.FETCHING_DATA;
>>>>>>> 96717babcce47571d1060031474203ddd3364440
  date = new Date();
  exportData = [];
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  public vehicleId;
<<<<<<< HEAD
  public driverId;
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
=======
  lastEvaluatedKey = ''
  fuel = []
  payments = [];
  expensePay = []
>>>>>>> 96717babcce47571d1060031474203ddd3364440
  filter = {
    startDate: null,
    endDate: null,
    type: null,
    paymentNo: null,
  };
<<<<<<< HEAD
  serviceLogName = []

=======
  serviceLogData = []
  payment = []
  driver: any = []
  lastExpPay = ''
  totalExpense = 0
  totalDriverPay = 0
>>>>>>> 96717babcce47571d1060031474203ddd3364440
  constructor(private apiService: ApiService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private accountService: AccountService,) {
  }

  ngOnInit(): void {
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.vehicleId = this.route.snapshot.params[`vehicleId`];
<<<<<<< HEAD

    this.driverId = this.route.snapshot.params[`driverId`];
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.fetchVehicleListing();
    this.fetchVehicleName();
    this.serviceLogData();
    this.fetchAllVehiclesIDs();
    this.fetchSettlement();
    this.fetchDriverPayments();
    this.fetchAllIssuesIDs()
    this.fetchFuelVehicles();
    this.fetchServiceLogName();
    this.fetchDrivers();

  }


  fetchSettlement() {
    this.accountService
      .getData(`settlement/get/list`)
      .subscribe((result: any) => {
        this.settlements = result;
      });
  }
  // fetchContactsList() {
  //   this.apiService.getData(`contacts/get/list`).subscribe((result: any) => {
  //     this.contacts = result;
  //   });
  // }
  fetchDrivers() {
    this.apiService.getData(`drivers/get/list`).subscribe((result: any) => {
      this.driverList = result;
    });
  }

  fetchDriverPayments(refresh?: boolean) {
    let searchParam = null;
    if (refresh === true) {
      this.lastItemSK = "";
      this.payments = [];
    }
    if (this.lastItemSK !== "end") {
      if (this.filter.paymentNo !== null && this.filter.paymentNo !== "") {
        searchParam = encodeURIComponent(`"${this.filter.paymentNo}"`);
      } else {
        searchParam = null;
      }
      this.accountService
        .getData(
          `driver-payments/paging?type=${this.filter.type}&paymentNo=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}`
        )
        .subscribe((result: any) => {
          if (result.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;

          }
          if (result.length > 0) {

            if (result[result.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(
                result[result.length - 1].sk
              );
            } else {
              this.lastItemSK = "end";
            }
            result.map((v) => {
              v.currency = v.currency ? v.currency : "CAD";
              v.url = `/accounts/payments/driver-payments/detail/${v.paymentID}`;
              if (v.payMode) {
                v.payMode = v.payMode.replace("_", " ");
              } else {
                v.payMode = "-";
              }
              v.paymentTo = v.paymentTo.replace("_", " ");
              v.settlData.map((k) => {
                k.status = k.status.replace("_", " ");
              });
              this.payments.push(v);
            });
            this.loaded = true;
          }
        });
    }
  }


  // fetchTasks() {
  //   this.apiService.getData('tasks?type=service').subscribe((result: any) => {
  //     this.tasks = result;
  //   })
  // }

 
  fetchAllVehiclesIDs() {
    this.apiService.getData("vehicles/get/list").subscribe((result: any) => {
      this.vehiclesObject = result;
    });
  }

  fetchAllIssuesIDs() {
    this.apiService.getData("issues/get/list").subscribe((result: any) => {
      this.issuesObject = result;
    });
  }

  fetchServiceLogName() {
    console.log("vehicleID", this.vehicleId)
    this.apiService.getData(`serviceLogs/getBy/vehicle/name/trips/${this.vehicleId}`).subscribe((result: any) => {
      this.serviceLogName = result.Items
      console.log("service", this.serviceLogName)
    })
  }


  serviceLogData() {
    if (this.lastEvaluatedKey !== "end") {
      this.apiService.getData("serviceLogs/fetch/records?vehicleID=" + this.vehicleId + "&taskID=" + this.taskID + "&asset=" + this.assetID + "&lastKey=" + this.lastEvaluatedKey).subscribe((result: any) => {
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }

        if (result.Items.length > 0) {
          if (result.LastEvaluatedKey !== undefined) {
            this.lastEvaluatedKey = encodeURIComponent(
              result.Items[result.Items.length - 1].logSK
            );
            let lastEvalKey = result[`LastEvaluatedKey`].logSK.replace(
              /#/g,
              "--"
            );
            this.lastEvaluatedKey = lastEvalKey;
          } else {
            this.lastEvaluatedKey = "end";
          }
          this.logs = this.logs.concat(result.Items);

          this.loaded = true;
        }
      });
    }
  }
  fetchVehicleName() { //show vehicle name in tile
    this.apiService.getData(`vehicles/fetch/detail/${this.vehicleId}`).subscribe((result: any) => {
      this.vehicleData = result.Items;
    });
  }
  fetchFuelVehicles() { // all data in fuel detail
    this.apiService.getData(`fuelEntries/getBy/vehicle/trips/${this.vehicleId}`).subscribe((result: any) => {
      this.vehicle = result.Items;
=======
    this.fetchTrpByVehicle();
    this.fetchVehicleName();
    this.fetchFuelByVehicle();
    this.fetchSlogByVehicle();
    this.fetchExpensePayment()
  }


  async fetchDriverPayment() {
    const result: any = await this.accountService.getData(`driver-payments/get/driver/payment?drivers=${encodeURIComponent(JSON.stringify(this.driver))}&startDate=${this.start}&endDate=${this.end}`)
      .toPromise();
    // this.payments = result;
    if (result.length === 0) {
      this.drvPayMessage = Constants.NO_RECORDS_FOUND
    }
    for (let i = 0; i < result.length; i++) {
      const paymentdata = result[i]
      this.totalDriverPay += parseFloat(paymentdata.finalAmount)
    }
    result.map((v) => {
      v.currency = v.currency ? v.currency : "CAD";
      if (v.payMode) {
        v.payMode = v.payMode.replace("_", " ");
      } else {
        v.payMode = "-";
      }
      v.paymentTo = v.paymentTo.replace("_", " ");
      v.settlData.map((k) => {
        k.status = k.status.replace("_", " ");
      });
      this.payments.push(v);
    });
  }
  fetchExpensePayment() {
    if (this.lastExpPay !== 'end') {
      this.accountService.getData(`expense/get/expense/pay/byTrp/${encodeURIComponent(JSON.stringify(this.vehicleId))}?startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastExpPay}&date=${this.expDate}`).subscribe((result: any) => {
        if (result.Items.length === 0) {
          this.expenseMessage = Constants.NO_RECORDS_FOUND
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
        result.Items.map((v) => {
          v.disableEdit = false;
          if (v.status) {
            v.newStatus = v.status.replace("_", " ");
            if (
              v.status === "deducted" ||
              v.status === "partially_deducted"
            ) {
              v.disableEdit = true;
            }
          }

          this.expensePay.push(v);
        });
        // this.expensePay = this.expensePay.concat(result.Items)
      })
    }
  }
  fetchSlogByVehicle() {
    this.apiService.getData(`serviceLogs/getBy/vehicle/name/trips/${this.vehicleId}?startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.serviceLogData = result.Items
      if (result.Items.length === 0) {
        this.logMessage = Constants.NO_RECORDS_FOUND
      }
    })
  }

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
        this.fuelMessage = Constants.NO_RECORDS_FOUND
      }
      result[`Items`].forEach(element => {


        let date: any = moment(element.data.date)
        if (element.data.time) {
          let time = moment(element.data.time, 'h mm a')
          date.set({
            hour: time.get('hour'),
            minute: time.get('minute')
          })
          date = date.format(' h:mm a')
        }
        else {
          date = date.format('MMM Do YYYY')
        }
        element.dateTime = date

      });
>>>>>>> 96717babcce47571d1060031474203ddd3364440

    });
  }

<<<<<<< HEAD
 
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
        }
        if (result.LastEvaluatedKey !== undefined) {
          this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].tripSK);
          this.datee = encodeURIComponent(result.Items[result.Items.length - 1].dateCreated)
=======
  fetchTrpByVehicle() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`vehicles/fetch/TripData?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {

        this.allData = this.allData.concat(result.Items)
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
        }
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
        if (this.loaded) {
          this.payments = []
          this.totalDriverPay = 0;
          this.drvPayMessage = Constants.FETCHING_DATA
        }
        this.fetchDriverPayment();
        if (result.LastEvaluatedKey !== undefined) {

          this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].tripSK);
          this.datee = encodeURIComponent(result.Items[result.Items.length - 1].dateCreated)

>>>>>>> 96717babcce47571d1060031474203ddd3364440
        }
        else {
          this.lastItemSK = 'end';
        }
        this.loaded = true;
      });
    }
<<<<<<< HEAD
  }
  onScroll() {
    if (this.loaded) {
      // this.fetchVehicleListing();
    }
    this.loaded = false;
  }

=======

  }
  // onScroll() {
  //   if (this.loaded) {
  //     this.fetchTrpByVehicle();
  //   }
  //   this.loaded = false;
  // }
  // onScrollExpense() {
  //   if (this.loaded) {
  //     this.fetchExpensePayment();
  //   }
  //   this.loaded = false;
  // }
>>>>>>> 96717babcce47571d1060031474203ddd3364440
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
<<<<<<< HEAD
        this.lastItemSK = '';
        this.lastEvaluatedKey = ''
        this.allData = []
        this.vehicle = []
        this.fuelList = []
        this.serviceLogName = []
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchVehicleListing()
        this.fetchFuelVehicles()
        this.fetchServiceLogName()
=======
        // this.dataMessage = Constants.FETCHING_DATA;
        this.lastItemSK = '';
        this.lastExpPay = ''
        this.allData = [];
        this.fuel = [];
        this.serviceLogData = [];
        this.payments = [];
        this.expensePay = [];
        this.totalExpense = 0;
        this.totalDriverPay = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.logMessage = Constants.FETCHING_DATA;
        this.expenseMessage = Constants.FETCHING_DATA;
        this.fuelMessage = Constants.FETCHING_DATA;
        this.drvPayMessage = Constants.FETCHING_DATA;
        this.fetchTrpByVehicle()
        this.fetchFuelByVehicle()
        this.fetchSlogByVehicle()
        this.fetchExpensePayment();
>>>>>>> 96717babcce47571d1060031474203ddd3364440
      }
    } else {
      return false;
    }
  }
<<<<<<< HEAD
=======

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
>>>>>>> 96717babcce47571d1060031474203ddd3364440
}
