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
  async fetchStates(countryCode: any) {
    this.states = await this.countryStateCity.GetStatesByCountryCode([
      countryCode,
    ]);
  }

  fetchProvinceMilesData() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`vehicles/fetch/provinceMiles?startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {
        this.allData = this.allData.concat(result.Items)
        this.dummyData = this.dummyData.concat(result.Items)
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
        }
        if (result.LastEvaluatedKey !== undefined) {
          this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].tripSK);
          this.datee = encodeURIComponent(result.Items[result.Items.length - 1].dateCreated)
        }
        else {
          this.lastItemSK = 'end';
        }
        this.loaded = true;
        for (let veh of this.allData) {
          let dataa = veh
          veh.miles = 0
          for (let element of dataa.tripPlanning) {
            veh.miles += Number(element.miles);
          }
        }
        for (let data of this.allData) {
          data.canMiles = 0;
          data.usMiles = 0;
          data.finalData = ''
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
                    provinces: []
                  }
                  ifta2[v].map((location) => {

                    if (!data.vehicleProvinces.includes(location.StCntry)) {
                      data.vehicleProvinces.push(location.StCntry);
                    }
                    newObj.provinces.push(location);
                  })
                  data.provinceData.push(newObj);


                }
              })
            })
          })
          const usProvArr = ["DE", "FL", "GA", "MD", "NC", "NJ", "NY", "SC", "VA", "US"]
          const canArr = ["AB", "BC", "MB", "NB", "NL", "NT", "NS", "NU", "ON", "PE", "QC", "SK", "US", "YT"]
          for (let item of data.provinceData) {
            data.finalData = item
           
            let provinceDataa = item.provinces;
            item.provinces.map((v) => {
              if (usProvArr.includes(v.StCntry)) {
          
                data.usMiles += Number(v.Total)
              }
              else if (canArr.includes(v.StCntry)) {
                console.log('v.StCntry', v.StCntry);
                console.log('exx', v);
                data.canMiles += Number(v.Total)
              }
              else {
                return false;
              }
            })
          }
        }
        //To filter according stateCode

        if (this.stateCode !== null) {
          this.allData = []
          for (let data of this.dummyData) {
            if (data.vehicleProvinces.includes(this.stateCode)) {
              if (data.vehicleProvinces === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND
              }
              this.allData.push(data)
              if (this.allData === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND
              }
            }
          }
          if (this.allData.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND
          }

        }
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
  fetchFullExport() {
    this.apiService.getData(`vehicles/fetch/provinceMiles/report?startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.exportData = result.Items;
      for (let veh of this.exportData) {
        let dataa = veh
        veh.miles = 0
        for (let element of dataa.tripPlanning) {
          veh.miles += Number(element.miles);
        }
      }
      for (let data of this.exportData) {
        data.canMiles = 0;
        data.usMiles = 0;
        data.finalData = ''
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
                  provinces: []
                }
                ifta2[v].map((location) => {

                  if (!data.vehicleProvinces.includes(location.StCntry)) {
                    data.vehicleProvinces.push(location.StCntry);
                  }
                  newObj.provinces.push(location);
                })
                data.provinceData.push(newObj);


              }
            })
          })
        })
        const usProvArr = ["DE", "FL", "GA", "MD", "NC", "NJ", "NY", "SC", "VA", "US"]
        const canArr = ["AB", "BC", "MB", "NB", "NL", "NT", "NS", "NU", "ON", "PE", "QC", "SK", "US", "YT"]
        for (let item of data.provinceData) {
          data.finalData = item
         
          let provinceDataa = item.provinces;
          item.provinces.map((v) => {
            if (usProvArr.includes(v.StCntry)) {
        
              data.usMiles += Number(v.Total)
            }
            else if (canArr.includes(v.StCntry)) {
              console.log('v.StCntry', v.StCntry);
              console.log('exx', v);
              data.canMiles += Number(v.Total)
            }
            else {
              return false;
            }
          })
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
        let location = ''
        let date = ''
        for (let i = 0; i < element.tripPlanning.length; i++) {
          const element2 = element.tripPlanning[i];
          date += element2.type + " : " + element2.date
          if (i < element.tripPlanning.length - 1) {
            date += " & ";
          }
          element2.location = element2.location.replace(/,/g, ' ');
          location += element2.type + ' : ' + element2.location
          if (i < element.tripPlanning.length - 1) {
            location += " & ";
          }
        }
        let stateMiles = ''
        for(let data of element.provinceData){
       
          for(let j =0; j < data.provinces.length; j++){
            const element3 = data.provinces[j];
            stateMiles += element3.StCntry + " : " + element3.Total
            if (j < data.provinces.length - 1) {
              stateMiles += " & ";
            }
          }
        }
        let obj = {}
        obj["Vehicle"] = element.vehicle ? element.vehicle.replace(/, /g, ' &') : '';
        obj["Trip#"] = element.tripNo;
        obj["Order#"] = element.orderName.replace(/, /g, ' &');
        obj["location"] = location;
        obj["Date"] = date;
        obj["Total Miles"] = element.miles;
        obj["State Miles"] = stateMiles;
        obj["Canada Miles"] = element.canMiles;
        obj["US Miles"] = element.usMiles;
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
