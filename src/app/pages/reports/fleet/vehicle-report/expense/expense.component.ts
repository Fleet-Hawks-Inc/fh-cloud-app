import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import Constants from 'src/app/pages/fleet/constants';
import * as _ from 'lodash';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Table } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from "src/app/services";
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  @ViewChild('dt') table: Table;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  environment = environment.isFeatureEnabled;
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
  logMessage = Constants.FETCHING_DATA;
  expenseMessage = Constants.FETCHING_DATA;
  fuelMessage = Constants.FETCHING_DATA;
  drvPayMessage = Constants.FETCHING_DATA;
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
  totalDriverPay = 0
  get = _.get;
  _selectedColumns: any[];
  _fuelSelectedColumns: any[];
  _mainSelectedColumns: any[];
  _driSelectedColumns: any[];
  
      dataColumns = [
        {  field: 'tripNo', header: 'Trip', type: "text" },
        {  field: 'orderName', header: 'Order', type: "text" },
        {  field: 'orderType', header: 'Type', type: "text" },
        {  field: 'driverName', header: 'Driver', type: "text" },
        {  field: 'location', header: 'Location', type: "text" },
        {  field: 'date', header: 'Date', type: "text" },
        {  field: 'miles', header: 'Total Miles', type: "text" },
    ];
    
      dataColumnsFuel= [
        {  field: 'vehicle', header: 'Vehicle', type: "text" },
        {  field: 'data.cardNo', header: 'Fuel Card', type: "text" },
        {  field: 'data.type', header: 'Fuel Type', type: "text" },
        {  field: 'dateTime', header: 'Date/Time', type: "text" },
        {  field: 'data.country', header: 'Status', type: "text" },
        {  field: 'data.amt', header: 'Status', type: "text" },
    ];
    
     dataColumnsMain= [
        {   field: 'vehicle', header: 'Vehicles', type: "text" },
        {   field: 'completionDate', header: 'Completion Date/Odometer', type: "text" },
        {   field: 'allServiceTasks', header: 'Service Task(s)', type: "text" },
        {   field: 'allServiceParts', header: 'Total', type: "text" },
    ];
    
     dataColumnsDriver= [
        {   field: 'paymentNo', header: 'Payment', type: "text" },
        {   field: 'txnDate', header: 'Date', type: "text" },
        {   field: 'payMode', header: 'Payment Mode Information', type: "text" },
        {   field: 'settlementName', header: 'Settlement', type: "text" },
        {   field: 'entityName', header: 'Paid To', type: "text" },
        {   field: 'finalAmount', header: 'Amount', type: "text" },
    ];
   
  constructor(private apiService: ApiService, 
  private toastr: ToastrService,
  private route: ActivatedRoute, 
  private spinner: NgxSpinnerService, 
  private accountService: AccountService,) {
  }

  ngOnInit(): void {
    this.setToggleOptions();
    this.setToggleOptionsFuel();
    this.setToggleOptionsMain();
    this.setToggleOptionsdr();
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.vehicleId = this.route.snapshot.params[`vehicleId`];
    this.fetchTrpByVehicle();
    this.fetchVehicleName();
    this.fetchFuelByVehicle();
    this.fetchSlogByVehicle();
    this.fetchExpensePayment()
  }
   //trip table
  setToggleOptions() {
        this.selectedColumns = this.dataColumns;
    }
    
    @Input() get selectedColumns(): any[] {
        return this._selectedColumns;
    }

    set selectedColumns(val: any[]) {
        //restore original order
        this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
    }
    
    // fuel table
    setToggleOptionsFuel() {
        this.fuelSelectedColumns = this.dataColumnsFuel;
    }
    
      @Input() get fuelSelectedColumns(): any[] {
        return this._fuelSelectedColumns;
    }
    
    set fuelSelectedColumns(val: any[]) {
        //restore original order
        this._fuelSelectedColumns = this.dataColumnsFuel.filter(col => val.includes(col));
    }
    
    // maintenance table
    
     setToggleOptionsMain() {
        this.mainSelectedColumns = this.dataColumnsMain;
    }
    
      @Input() get mainSelectedColumns(): any[] {
        return this._mainSelectedColumns;
    }
    
    set mainSelectedColumns(val: any[]) {
        //restore original order
        this._mainSelectedColumns = this.dataColumnsMain.filter(col => val.includes(col));
    }

   // Driver payment table 
    
     setToggleOptionsdr() {
        this.drSelectedColumns = this.dataColumnsDriver;
    }
    
     @Input() get drSelectedColumns(): any[] {
        return this._driSelectedColumns;
    }
    
    set drSelectedColumns(val: any[]) {
        //restore original order
        this._driSelectedColumns = this.dataColumnsDriver.filter(col => val.includes(col));
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

    });
  }
 
 clear(table: Table) {
        table.clear();
    }

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

        }
        else {
          this.lastItemSK = 'end';
        }
        this.loaded = true;
      });
    }

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
