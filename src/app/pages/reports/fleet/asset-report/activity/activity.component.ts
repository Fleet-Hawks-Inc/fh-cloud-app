import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import { ToastrService } from "ngx-toastr";
import * as _ from 'lodash';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import { result } from 'lodash';
import { CountryStateCityService } from "src/app/services/country-state-city.service";
import { Table } from 'primeng/table';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  @ViewChild('dt') table: Table;
  exportData = [];
  allData: any = [];
  assetData = []
  startDate = '';
  endDate = '';
  start = null;
  states = [];
  stateCode = null;
  dummyData = [];
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
  get = _.get;
  find = _.find;

  _selectedColumns: any[];
  dataColumns: any[];
  constructor(private apiService: ApiService, private toastr: ToastrService, private route: ActivatedRoute, private countryStateCity: CountryStateCityService) { }
  ngOnInit() {
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.astId = this.route.snapshot.params[`astId`];
    this.fetchAssetActivity()
    this.fetchAsset();
    this.dataColumns = [
      { width: '6%', field: 'assetName', header: 'Asset', type: "text", },
      { width: '6%', field: 'tripNo', header: 'Trip#', type: "text" },
      { width: '6%', field: 'orderName', header: 'Order#', type: "text" },
      { width: '6%', field: 'vehicle', header: 'Vehicle', type: 'text' },
      { width: '13%', field: 'driverName', header: 'Driver', type: 'text' },
      { width: '25%', field: 'location', header: 'Location', type: "text" },
      { width: '8%', field: 'date', header: 'Date', type: "text" },
      { width: '8%', field: 'usState', header: 'Province (US)', type: 'text' },
      { width: '8%', field: 'usStateMiles', header: 'US Miles', type: 'text' },
      { width: '7%', field: 'usMiles', header: 'US Total', type: 'text' },
      { width: '9%', field: 'canState', header: 'Province (Canada)', type: 'text' },
      { width: '8%', field: 'canStateMiles', header: 'Canada Miles', type: 'text' },
      { width: '8%', field: 'canMiles', header: 'Canada Total', type: 'text' },
      { width: '8%', field: 'miles', header: 'Total Miles', type: 'text' },
    ]
    this._selectedColumns = this.dataColumns;
    this.setToggleOptions()
  }

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


  fetchAsset() {
    this.apiService.getData(`assets/fetch/detail/${this.astId}`).subscribe((result: any) => {
      this.assetData = result.Items;
    });
  }
  onScroll() {
    if (this.loaded) {
      this.fetchAssetActivity();
    }
    this.loaded = false;
  }
  async fetchStates(countryCode: any) {
    this.states = await this.countryStateCity.GetStatesByCountryCode([
      countryCode,
    ]);
  }
  fetchAssetActivity() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`common/trips/get/tripData?asset=${this.astId}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {
        this.allData = this.allData.concat(result.Items)
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
        for (let res of result.Items) {

          res.miles = 0
          res.location = []
          res.locationData
          res.date = []
          res.usState = []
          res.usStateMiles = []
          res.canState = []
          res.canStateMiles = []
          for (let element of res.tripPlanning) {
            res.miles += Number(element.miles);
            res.location.push(element.type + ": " + element.location )
        
            res.date.push(element.type + ": " + element.date)
          } 
          for (let data of res.provinceData) {
            for (let provD of data.usProvince) {
              res.usState.push(provD.StCntry)
              res.usStateMiles.push( provD.Total)
            }

            for (let canProvD of data.canProvince) {
              res.canState.push(canProvD.StCntry)
              res.canStateMiles.push(canProvD.Total)
            }
          }
        }


        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
        }
      });
    }
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

  fetchFullExport() {
    this.apiService.getData(`trips/fetch/assetActivity/list?asset=${this.astId}&startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.exportData = result.Items;
      for (let ast of this.exportData) {
        let dataa = ast
        ast.miles = 0
        for (let element of dataa.tripPlanning) {
          ast.miles += Number(element.miles);
        }
      }
      this.generateCSV();
    });
  }
  clear(table: Table) {
    table.clear();
  }
  refreshData() {
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.allData = [];
    this.lastItemSK = '';
    this.loaded = false;
    this.dataMessage = Constants.FETCHING_DATA;
    this.fetchAssetActivity()
    this.fetchAsset();
  }

  generateCSV() {
    if (this.exportData.length > 0) {
      let dataObject = []
      let csvArray = []
      this.exportData.forEach(element => {
        let location = ''
        let date = ''
        let usMiles = ''
        let canMiles = ''
        let usState = ''
        let canState = ''
        for (let i = 0; i < element.tripPlanning.length; i++) {
          const element2 = element.tripPlanning[i];
          date += `"${element2.type} :-  ${element2.date}\n\"`
          element2.location = element2.location.replace(/,/g, ' ');
          location += `"${element2.type} :-  ${element2.location}\n\"`
        }
        if (element.provinceData && element.provinceData.length > 0) {
          for (let i = 0; i < element.provinceData.length; i++) {
            const element2 = element.provinceData[i];
            for (let j = 0; j < element2.usProvince.length; j++) {
              const element3 = element2.usProvince[j];
              usState += `"${element3.StCntry}\n\"`;
              usMiles += `"${element3.Total}\n\"`;
            }
            for (let k = 0; k < element2.canProvince.length; k++) {
              const element4 = element2.canProvince[k];
              canState += `"${element4.StCntry}\n\"`;
              canMiles += `"${element4.Total}\n\"`;
            }
          }
        }
        let obj = {}
        obj["Asset"] = element.assetName.replace(/, /g, ' &');
        obj["Trip#"] = element.tripNo;
        obj["Order#"] = element.orderName.replace(/, /g, ' &');
        obj["Vehicle"] = element.vehicle.replace(/, /g, ' &');
        obj["Drivers"] = element.driverName.replace(/, /g, ' &');
        obj["location"] = location;
        obj["	Date"] = date;
        obj["Province(US)"] = usState;
        obj["US Miles"] = usMiles;
        obj["US(Total)"] = element.usMiles;
        obj["Province(Canada)"] = canState;
        obj["Canada Miles"] = canMiles;
        obj["Canada(Total)"] = element.canMiles;
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