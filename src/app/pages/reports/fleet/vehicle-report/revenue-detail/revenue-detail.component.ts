import { Component, OnInit } from '@angular/core';
import { ApiService, AccountService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from "@angular/router";
import * as moment from 'moment';
import Constants from 'src/app/pages/fleet/constants';
import * as _ from 'lodash';
import { map } from 'lodash';
@Component({
  selector: 'app-revenue-detail',
  templateUrl: './revenue-detail.component.html',
  styleUrls: ['./revenue-detail.component.css']
})
export class RevenueDetailComponent implements OnInit {
  // vehicleId = null;
  start = null;
  end = null;
  allData: any = [];
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
  totalMiles: any = 0;
  totalInv = 0;
  totalRec = 0;
  currTab = "CAD";
  currency = 'CAD';
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
    // console.log(this.currency)
    this.apiService.getData(`vehicles/fetch/revenue/report?currency=${this.currency}&vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {
      this.allData = this.allData.concat(result.Items);
      if (result.Items.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND
      }
      if (result.LastEvaluatedKey !== undefined) {

        this.lastItemSK = encodeURIComponent(result.LastEvaluatedKey.tripSK);
        console.log('this.lastSk--', this.lastItemSK)
        this.datee = encodeURIComponent(result.LastEvaluatedKey.dateCreated)
      }
      else {
        this.lastItemSK = 'end';
      }
      this.loaded = true;
      // for (let i = 0; i < result.Items.length; i++) {
      //   if (this.currTab === 'CAD') {
      //     this.currency = 'CAD'
      //     const data = result.Items[i]
      //     // console.log('data--', data)
      //     // for (let invD of data.invoiceData) {
      //     data.invoiceData.map((elem) => {
      //       if (elem.charges.fuelSurcharge.currency === 'CAD') {
      //         this.allData = result.Items
      //         console.log('this==', this.allData)

      //       }
      //     })
      //     // for (let idn of invD.charges) {
      //     //   console.log('idn-', idn)

      //     // }
      //     // }
      //   }
      //   else if (this.currTab === 'USD') {
      //     this.currency = 'USD'
      //     const data = result.Items[i]
      //     data.invoiceData.map((elem) => {
      //       if (elem.charges.fuelSurcharge.currency === 'USD') {
      //         this.allData = result.Items
      //         console.log('this==', this.allData)

      //       }
      //     })

      //   }
      // }
      for (let i = 0; i < result.Items.length; i++) {
        const data = result.Items[i]
        data.miles = 0;
        for (let tripD of data.tripPlanning) {
          data.miles += Number(tripD.miles);
        }
        this.totalMiles += parseFloat(data.miles)
        for (let invData of data.invoiceData) {

          this.totalInv += parseFloat(invData.finalAmount)
        }

        for (let recData of data.receiptData) {
          for (let rec of recData) {
            // console.log('rec==', rec)
            this.totalRec += parseFloat(rec.recAmount)
            // console.log('this.totalRec', this.totalRec)
          }
        }
      }



    })
  }
  //For Switching Tab
  changeTab(type) {
    this.currTab = type;
    this.allData = [];
    if (this.currTab === "CAD") {
      this.currency = 'CAD'
      this.totalMiles = 0;
      this.totalInv = 0;
      this.totalRec = 0;
      this.fetchRevenueData();
    } else if (this.currTab === "USD") {
      this.currency = 'USD'
      this.totalMiles = 0;
      this.totalInv = 0;
      this.totalRec = 0;
      this.fetchRevenueData();
    }
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
        this.totalMiles = 0;
        this.totalInv = 0;
        this.totalRec = 0;
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

  generateCSV() {
    if (this.allData.length > 0) {
      let dataObject = []
      let csvArray = []
      this.allData.forEach(element => {
        let invNo = ''
        for (let item1 of element.invoiceData) {
          if (item1.invStatus === 'paid') {
            invNo = item1.invNo
            console.log('inv', invNo)
          }
        }
        let obj = {}
        obj["Trip#"] = element.tripNo;
        obj["Order#"] = element.orderName.replace(/, /g, ' &');
        obj["Trip Date"] = element.dateCreated;
        obj["Total Miles"] = element.miles;
        obj["Invoice#"] = invNo;
        // obj["Trip Date"] = element.dateCreated;
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
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Asset-Report.csv`);
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