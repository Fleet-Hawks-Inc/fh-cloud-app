import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import * as _ from "lodash";
import { result, subtract } from 'lodash';
import * as moment from 'moment'
import { ActivatedRoute } from '@angular/router';
import { format } from 'path';
@Component({
  selector: 'app-driver-report',
  templateUrl: './driver-report.component.html',
  styleUrls: ['./driver-report.component.css']
})
export class DriverReportComponent implements OnInit {
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  public drivIDs;
  exportData = [];

  constructor(private apiService: ApiService, private toastr: ToastrService, private route: ActivatedRoute) { }
  data = []
  driverIDs = "";
  start = null
  end = null
  driver = []
  order = []
  datee = ''
  lastEvaluatedKey = ''
  driverID = "";
  dataMessage: string = Constants.FETCHING_DATA
  driverName = ''
  
  DrivN = []
  loaded = false

  ngOnInit(): void {
    this.drivIDs = this.route.snapshot.params['drivIDs']
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, "months").format("YYYY-MM-DD");

    this.fetchTrip();
    this.fetchDriverName();
  }


  fetchDriverName() {
    this.apiService.getData(`drivers/fetch/driver/detail/${this.drivIDs}`).subscribe((result: any) => {
      this.DrivN = result.Items
    })
  }

  fetchTrip() {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService.getData(`trips/get/trip/data?driver=${this.drivIDs}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastEvaluatedKey}&date=${this.datee}`).subscribe((result: any) => {
        // this.data = result.Items
        this.data = this.data.concat(result.Items)
        for (let driv of this.data) {
          let dataa = driv
          driv.miles = 0
          for (let element of dataa.tripPlanning) {
            driv.miles += Number(element.miles);
          }
        }
        if (result.Items.length === 0) {

          this.dataMessage = Constants.NO_RECORDS_FOUND
        }
        if (result.Items.length > 0) {

          if (result.LastEvaluatedKey !== undefined) {
            this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].tripSK);
            this.datee = encodeURIComponent(result.Items[result.Items.length - 1].dateCreated);
          }
          else {
            this.lastEvaluatedKey = 'end'

          }

          this.loaded = true;
        }
      })
    }
  }
  onScroll() {
    if (this.loaded) {
      this.fetchTrip();
    }
    this.loaded = true;
  }
  searchFilter() {
    if (this.start !== null && this.end !== null) {
      this.data = []
      this.lastEvaluatedKey = ''
      this.dataMessage = Constants.FETCHING_DATA
      this.fetchTrip()

    }
    else {
      return false;
    }
  }


  fetchFullExport() {
    this.apiService.getData(`trips/fetch/driverActivity/list?driver=${this.drivIDs}&startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.exportData = result.Items;
      for (let driv of this.exportData) {
        let dataa = driv
        driv.miles = 0
        for (let element of dataa.tripPlanning) {
          driv.miles += Number(element.miles);
        }
      }
      this.generateCSV();
    });
  }
  generateCSV() {
    if (this.exportData.length > 0) {
      let dataObject = []
      let csvArray = []
      this.exportData.forEach(element => {
        let type = '';
        let location = '';
        let date = "";
        for (let i = 0; i < element.tripPlanning.length; i++) {
          const element2 = element.tripPlanning[i];
          type += element2.type
          element2.location = element2.location.replace(/,/g, ' ');
          location += element2.type + ":" + element2.location
          date += `"${element2.type} :-  ${element2.date}\n\"`
          if (i < element.tripPlanning.length - 1) {
            location += " & ";
          }
        }
        let obj = {}
        obj["Name"] = element.driverName.replace(/,/g, '&')
        obj["Trip Number"] = element.tripNo
        obj["Order Number"] = element.orderNumber.replace(/,/g, '&')
        obj["Location"] = location
        obj["Date"] = date
        obj["Total Miles"] = element.miles
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
        link.setAttribute('download', `${moment().format("YYYY/MM/DD:HH:m")}Driver-Activity-Report.csv`);
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

