import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Constants from 'src/app/pages/fleet/constants';
import { CountryStateCityService } from "src/app/services/country-state-city.service";
@Component({
  selector: 'app-province-miles',
  templateUrl: './province-miles.component.html',
  styleUrls: ['./province-miles.component.css']
})
export class ProvinceMilesComponent implements OnInit {
  allData: any = [];
  docCountries = [];
  states = [];
  vehicleId = ''
  start = null;
  end = null;
  dataMessage = Constants.FETCHING_DATA;
  lastItemSK = '';
  datee = '';
  loaded = false;
  exportData = [];
  stateCode = null;
  dummyData = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  constructor(private apiService: ApiService, private toastr: ToastrService, private countryStateCity: CountryStateCityService,) { }
  ngOnInit(): void {

    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.fetchProvinceMilesData();
  }
  // async fetchStates(countryCode: any) {
  //   this.states = await this.countryStateCity.GetStatesByCountryCode([
  //     countryCode,
  //   ]);
  // }

  fetchProvinceMilesData() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`vehicles/fetch/provinceMiles?startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {
        this.allData = this.allData.concat(result.Items)
        this.dummyData = this.dummyData.concat(result.Items)
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
        const otherTrips = [];
        for (let element of result.Items) {
          element.newStatus = element.tripStatus;
          element.canRecall = false;
          let dataa = element
          element.miles = 0
          for (let element1 of dataa.tripPlanning) {
            element.miles += Number(element1.miles);
          }
          if (element.recall === true) {
            element.newStatus = `${element.tripStatus} (R)`;
          }
          else {
            if (element.stlLink === true) {
              element.newStatus = "Settled";
            }
          }
     
        }
    
        //To filter according stateCode

        // if (this.stateCode !== null) {
        //   this.allData = []
        //   for (let data of this.dummyData) {
        //     if (data.vehicleProvinces.includes(this.stateCode)) {
        //       if (data.vehicleProvinces === 0) {
        //         this.dataMessage = Constants.NO_RECORDS_FOUND
        //       }
        //       this.allData.push(data)
        //       if (this.allData === 0) {
        //         this.dataMessage = Constants.NO_RECORDS_FOUND
        //       }
        //     }
        //   }
        //   if (this.allData.length === 0) {
        //     this.dataMessage = Constants.NO_RECORDS_FOUND
        //   }

        // }
      });
    }
  }

  onScroll() {
    if (this.loaded) {
      this.fetchProvinceMilesData();
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
        this.allData = [];
        this.dummyData = [];
        this.dataMessage = Constants.FETCHING_DATA;

        this.fetchProvinceMilesData()
      }
    } else {
      return false;
    }
  }



    fetchPendingData() {
    const usProvArr = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "	LA", "ME", "MD", "MA", "MI", "MN",
      "MS", "MO", "MT", "NE", "NV", "NH", "	NJ", "	NM", "	NY", "NC", "ND", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "VI", "WA", "WV", "WI", "WY"]
    const canArr = ["AB", "BC", "MB", "NB", "NL", "NF", "NT", "NS", "NU", "ON", "PE", "PQ", "QC", "SK", "YT"]
    for (let data of this.exportData) {
      data.canMiles = 0;
      data.usMiles = 0;
      data.stateMiles = 0;
      data.finalData = ''
      data.stateName = ''
      data.provData = [];
      data.province =
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
                canProvince: [],
                usProvince: []
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
                  newObj.canProvince.push(location);
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
          else {
            return false;
          }
        })
      }
    }
  }
  fetchFullExport() {
    this.apiService.getData(`vehicles/fetch/provinceMiles/report?startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.exportData = result.Items;
      this.fetchPendingData()
      for (let veh of this.exportData) {
        let dataa = veh
        veh.miles = 0
        for (let element of dataa.tripPlanning) {
          veh.miles += Number(element.miles);
        }
      }
      // this.exportData = this.allData
      this.generateCSV();

    });
  }

  // csv() {
  //   if (this.stateCode !== null) {
  //     this.exportData = this.allData
  //     this.generateCSV();
  //   }
  //   else {
  //     this.fetchFullExport()
  //   }
  // }
  generateCSV() {
    if (this.exportData.length > 0) {
      let dataObject = []
      let csvArray = []
      this.exportData.forEach(element => {
        let Miles = 0
        let State = ''
        let usMiles = ''
        let canMiles = ''
        let usState = ''
        let canState = ''
        for (let data of element.provinceData) {
          for (let j = 0; j < data.usProvince.length; j++) {
            const element3 = data.usProvince[j];
            usState += `"${element3.StCntry}\n\"`;
            usMiles += `"${element3.Total}\n\"`;
            // if (j < data.usProvince.length - 1) {
            //   usState += " & ";
            //   usMiles += " & ";
            // }
          }
          for (let j = 0; j < data.canProvince.length; j++) {
            const element3 = data.canProvince[j];
            canState += `"${element3.StCntry}\n\"`;
            canMiles += `"${element3.Total}\n\"`;
            // if (j < data.canProvince.length - 1) {
            //   canState += " & ";
            //   canMiles += " & ";
            // }
          }


        }
        let obj = {}
        obj["Vehicle"] = element.vehicle ? element.vehicle.replace(/, /g, ' &') : '';
        obj["Trip#"] = element.tripNo;
        obj["Order#"] = element.orderName.replace(/, /g, ' &');
        obj["Province(US)"] = usState;
        obj["US Province Miles"] = usMiles;
        obj["Province(Canada)"] = canState;
        obj["Canada Province Miles"] = canMiles;
        obj["Canada Total Miles"] = element.canMiles;
        obj["US Total Miles"] = element.usMiles;
        obj["Total Miles"] = element.miles;
        obj["Trip Status"] = element.newStatus;
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
        link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}provinceMiles-Report.csv`);
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
