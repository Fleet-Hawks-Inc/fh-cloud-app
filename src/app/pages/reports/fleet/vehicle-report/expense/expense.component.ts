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
  fuel = []
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
  expensePay = []
  filter = {
    startDate: null,
    endDate: null,
    type: null,
    paymentNo: null,
  };
  serviceLogName = []
  payment = []
  driver: any = []
  pay: any = []
  entityId: any
  lastDrvP = ''
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
    this.fetchExpensePayment()
  }


  async fetchDriverPayment() {
    if (this.lastDrvP !== 'end') {
      // const result: any = await this.accountService.getData(`driver-payments/get/driver/payment?drivers=${encodeURIComponent(JSON.stringify(this.driver))}&lastKey=${this.lastDrvP}`)
      const result: any = await this.accountService.getData(`driver-payments/get/driver/payment?drivers=${encodeURIComponent(JSON.stringify(this.driver))}`)
        .toPromise();
      this.payments = result;

      // this.lastDrvP = "end";


      if (result.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND
      }

      // if (result.length > 0) {
      //   if (result[result.length - 1].entityId !== undefined) {
      //     console.log('result[result.length - 1].entityId', result[result.length - 1].entityId)
      //     this.lastDrvP = encodeURIComponent(result[result.length - 1].entityId);
      //   }
      //   else {
      //     this.lastDrvP = 'end'
      //   }
      //   // this.loaded = true;

      // }
      // this.payments = this.payments.concat(result)
      console.log('this.payments', this.payments)

      // })
    }
  }
  async fetchExpensePayment() {
    console.log('----fgfhffgfhs', this.vehicleId)
    const rsult: any = await this.accountService.getData(`expense-transaction/get/expense/pay/byTrp?vehicleId${encodeURIComponent(JSON.stringify(this.vehicleId))}`).toPromise();
    this.expensePay = rsult;
    console.log('this.expensePay', this.expensePay)
    // })
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
      if (result.Items.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND
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
  fetchFuelVehicles() {
    this.apiService.getData(`fuelEntries/getBy/vehicle/trips/${this.vehicleId}?startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.fuel = result.Items;
      if (result.Items.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND
      }
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
        this.fetchDriverPayment();
        // this.fetchExpensePayment()
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
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastItemSK = '';
        this.allData = [];
        this.fuel = [];
        this.fuelList = [];
        this.serviceLogName = [];
        this.payments = [];
        this.expensePay = [];
        this.settlements = [];
        this.fetchVehicleListing()
        this.fetchFuelVehicles()
        this.fetchServiceLogName()
        this.fetchDriverPayment();
        // this.fetchExpensePayment();
      }
    } else {
      return false;
    }
  }

  // generateCSV(type = '') {
  //   if (this.allData.length > 0) {
  //     let dataObject = []
  //     let csvArray = []
  //     // this.allData.forEach(element => {
  //     let location = ''
  //     let driver = ''
  //     let date = ''
  //     let tripDetail = []
  //     if (type === 'trip') {
  //       tripDetail = this.allData
  //     }
  //     else {
  //       return false;
  //     }

  //     tripDetail.forEach((element) => {
  //       let driver = ''
  //       console.log('element.driver', element.driverName)

  //       let obj = {}
  //       if (type === 'trip') {
  //         obj["Vehicle"] = element.vehicle.replace(/, /g, ' &');
  //         obj["Trip#"] = element.tripNo;
  //         obj["Order#"] = element.orderName.replace(/, /g, ' &');
  //         obj["Total Miles"] = element.miles;
  //       }
  //       else {
  //         return false
  //       }
  //       dataObject.push(obj)
  //       // });
  //     })

  //     let headers = Object.keys(dataObject[0]).join(',')
  //     headers += ' \n'
  //     csvArray.push(headers)

  //     dataObject.forEach(element => {
  //       let obj = Object.values(element).join(',')
  //       obj += ' \n'
  //       csvArray.push(obj)
  //     });
  //     const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });
  //     const link = document.createElement('a');
  //     if (link.download !== undefined) {
  //       const url = URL.createObjectURL(blob);
  //       link.setAttribute('href', url);
  //       link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}vehicleActivity-Report.csv`);
  //       link.style.visibility = 'hidden';
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     }
  //   }
  //   else {
  //     this.toastr.error("No Records found")
  //   }
  // }






  // fuelCSV() {
  //   if (this.fuel.length > 0) {
  //     let dataObject = []
  //     let csvArray = []
  //     // this.fuel.forEach(element => {
  //     let location = ''
  //     let driver = ''
  //     let date = ''
  //     let fuelDetail = []
  //     // if (type === 'trip') {
  //     fuelDetail = this.fuel
  //     // }
  //     // else {
  //     //   return false;
  //     // }

  //     fuelDetail.forEach((element) => {
  //       console.log('element', element)

  //       driver = element.vehicle
  //       console.log('driver', driver)
  //       let obj = {}
  //       // if (type === 'trip') {
  //       obj["Vehicle"] = element.vehicle.replace(/, /g, ' &');
  //       obj["Fuel Card"] = element.data.cardNo;
  //       obj["Fuel Type"] = element.data.type;
  //       obj["Date/Time"] = element.data.date;
  //       obj["Province"] = element.data.city;
  //       obj["Amount"] = element.data.amt;
  //       // }
  //       // else {
  //       //   return false
  //       // }
  //       dataObject.push(obj)
  //       console.log('ddataobj---', dataObject)
  //       // });
  //     })

  //     let headers = Object.keys(dataObject[0]).join(',')
  //     headers += ' \n'
  //     csvArray.push(headers)

  //     dataObject.forEach(element => {
  //       let obj = Object.values(element).join(',')
  //       obj += ' \n'
  //       csvArray.push(obj)
  //     });
  //     const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });
  //     const link = document.createElement('a');
  //     if (link.download !== undefined) {
  //       const url = URL.createObjectURL(blob);
  //       link.setAttribute('href', url);
  //       link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}vehicleActivity-Report.csv`);
  //       link.style.visibility = 'hidden';
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     }
  //   }
  //   else {
  //     this.toastr.error("No Records found")
  //   }
  // }
}
