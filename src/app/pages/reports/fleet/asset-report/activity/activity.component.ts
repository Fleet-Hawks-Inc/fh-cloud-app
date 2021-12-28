import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import { ToastrService } from "ngx-toastr";
import * as _ from 'lodash';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import { result } from 'lodash';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  exportData = [];
  allData:any = [];
  assetData = []
  startDate = '';
  endDate = '';
  start = null;
  states = [];
  end = null;
  assetIdentification = '';
  assetID = '';
  dataMessage = Constants.FETCHING_DATA;
  lastItemSK = '';
  datee = '';
  loaded = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  public astId;
  constructor(private apiService: ApiService, private toastr: ToastrService, private route: ActivatedRoute) { }
  ngOnInit() {
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.astId = this.route.snapshot.params[`astId`];
    this.fetchAssetActivity()
    this.fetchAsset();
  }
  fetchAsset() {
    this.apiService.getData(`assets/fetch/detail/${this.astId}`).subscribe((result: any) => {
      this.assetData = result.Items;
    });
  }
   fetchAssetActivity() {
        if (this.lastItemSK !== 'end') {
        this.apiService.getData(`trips/get/tripData?asset=${this.astId}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {
                this.allData = this.allData.concat(result.Items)
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
                    const usProvArr = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "	KY", "	LA", "ME", "MD", "MA", "MI", "MN",
                        "MS", "MO", "MT", "NE", "NV", "NH", "	NJ", "	NM", "	NY", "NC", "ND", "OH", "OK", "OR", "PA", "PR", "	RI", "SC", "SD", "	TN", "TX", "UT", "VT", "VA", "VI", "WA", "WV", "WI", "WY"]
                    const canArr = ["AB", "BC", "MB", "NB", "NL", "NF", "NT", "NS", "NU", "ON", "PE", "PQ", "QC", "SK", "YT"]
                for (let asst of this.allData) {
                    let dataa = asst
                    asst.miles = 0
                    for (let element of dataa.tripPlanning) {
                        asst.miles += Number(element.miles);
                    }
                }
                for (let data of this.allData) {
                    data.canMiles = 0;
                    data.usMiles = 0;
                    data.finalData = ''
                    data.provinceData = [];
                    data.vehicleProvinces = [];
                    data.vehicleIDs.map((v) => {
                        data.iftaMiles.map((ifta) => {
                            ifta.map((ifta2) => {
                                if (ifta2[v] && ifta2[v].length > 0) {
                                    let newObj = {
                                        vehicleID: v,
                                        vehicleName: data.vehicle,
                                        provinces: [],
                                        caProvince:[],
                                        usProvince:[]
                                    }
                                    ifta2[v].map((location) => {
                                        if (!data.vehicleProvinces.includes(location.StCntry)) {
                                            data.vehicleProvinces.push(location.StCntry);
                                        }
                                        newObj.provinces.push(location);
                                         if (usProvArr.includes(location.StCntry)) {
                                            newObj.usProvince.push(location);
                                         }
                                          if (canArr.includes(location.StCntry)) {
                                            newObj.caProvince.push(location);
                                         }
                                    })
                                    data.provinceData.push(newObj);
                                }
                            })
                        })
                    })
                    for (let item of data.provinceData) {
                        data.finalData = item
                        let provinceDataa = item.provinces;
                        item.provinces.map((v) => {
                            if (usProvArr.includes(v.StCntry)) {
                                data.usMiles += Number(v.Total)
                                data.usProvince = v.StCntry
                            }
                            else if (canArr.includes(v.StCntry)) {
                                data.canMiles += Number(v.Total)
                                data.canProvince = v.StCntry
                            }
                        })
                    }
                }
                if (result.Items.length === 0) {
                    this.dataMessage = Constants.NO_RECORDS_FOUND
                }
            });
        }
    }
      onScroll() {
    if (this.loaded) {
      this.fetchAssetActivity();
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
        this.dataMessage = Constants.FETCHING_DATA
        this.fetchAssetActivity()
      }
    } else {
      return false;
    }
  }
    csv() {
      this.exportData = this.allData
      this.generateCSV();
      this.fetchAssetActivity();
    }
  generateCSV() {
    if (this.exportData.length > 0) {
      let dataObject = []
      let csvArray = []
      this.exportData.forEach(element => {
        let location = ''
        let date = ''
        let Miles = 0
        let State = ''
        let usMiles = ''
        let caMiles = ''
        let usState = ''
        let caState = ''
        for (let i = 0; i < element.tripPlanning.length; i++)
        {
          const element2 = element.tripPlanning[i];
          date += element2.type + " : " + element2.date
          if (i < element.tripPlanning.length - 1)
          {
            date += " & ";
          }
          element2.location = element2.location.replace(/,/g, ' ');
          location += element2.type + ' : ' + element2.location
          if (i < element.tripPlanning.length - 1) 
          {
            location += " & ";
          }
        }
        for (let data of element.provinceData) {
          for (let j = 0; j < data.usProvince.length; j++) {
            const element3 = data.usProvince[j];
            usState += `"${element3.StCntry}\n\"`;
            usMiles += `"${element3.Total}\n\"`;
          }
          for (let j = 0; j < data.caProvince.length; j++) {
            const element3 = data.caProvince[j];
            caState += `"${element3.StCntry}\n\"`;
            caMiles += `"${element3.Total}\n\"`;
          }
        }
        let obj = {}
        obj["Asset"] = element.assetName.replace(/, /g, ' &');;
        obj["Trip#"] = element.tripNo;
        obj["Order#"] = element.orderName.replace(/, /g, ' &');
        obj["location"] = location;
        obj["	Date"] = date;
        obj["Province(US)"] = usState;
        obj["US Province Miles"] = usMiles;
        obj["US(Total)"] = element.usMiles;
        obj["Province(Canada)"] = caState;
        obj["Canada Province Miles"] = caMiles;
        obj["Canada(Total)"] = element.caMiles;
        obj["Total Miles"] = element.miles;
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
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}assetActivity-Report.csv`);
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
