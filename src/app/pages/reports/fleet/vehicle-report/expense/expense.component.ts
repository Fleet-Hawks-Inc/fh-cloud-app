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

  allData = [];
  vehicleData = []
  startDate = '';
  endDate = '';
  start = null;
  end = null;
  lastItemSK = '';
  datee = '';
  loaded = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  dataMessage = Constants.FETCHING_DATA;
  date = new Date();
  exportData = [];
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  public vehicleId;
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
  filter = {
    startDate: null,
    endDate: null,
    type: null,
    paymentNo: null,
  };
  serviceLogName = []

  constructor(private apiService: ApiService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private accountService: AccountService,) {
  }

  ngOnInit(): void {
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.vehicleId = this.route.snapshot.params[`vehicleId`];

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
        }
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
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchVehicleListing()
        this.fetchFuelVehicles()
        this.fetchServiceLogName()
      }
    } else {
      return false;
    }
  }
}
