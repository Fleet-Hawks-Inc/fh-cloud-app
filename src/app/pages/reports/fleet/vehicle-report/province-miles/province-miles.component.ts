import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ApiService, HereMapService} from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import Constants from 'src/app/pages/fleet/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Table } from 'primeng/table/table';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CountryStateCityService } from "src/app/services/country-state-city.service";
import * as _ from 'lodash';
@Component({
  selector: 'app-province-miles',
  templateUrl: './province-miles.component.html',
  styleUrls: ['./province-miles.component.css']
})
export class ProvinceMilesComponent implements OnInit {
  @ViewChild('dt') table: Table;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  environment = environment.isFeatureEnabled;
  allData: any = [];
  docCountries = [];
  states = [];
  start = null;
  end = null;
  dataMessage = Constants.FETCHING_DATA;
  lastItemSK = '';
  datee = '';
  loaded = false;
  exportData = [];
  stateCode = null;
  // dummyData = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  usStateArr: any;
  element3: any;
  suggestedVehicles = [];
  vehicleIdentification = '';
  vehicleId = '';
  loadMsg: string = Constants.NO_LOAD_DATA;
  isSearch = false;
  get = _.get;
  _selectedColumns: any[];
  listView = true;
  visible = true;
  
  dataColumns = [
        { field: 'vehicle', header: 'Vehicle', type: "text" },
        { field: 'tripNo', header: 'Trip', type: "text" },
        { field: 'orderName', header: 'Order', type: "text" },
        {  field: 'locationCsv', header: 'Location', type: "text", display:"none" },
        {  field: 'dateCsv', header: 'Date', type: "text", display:"none" },
        {  field: 'usStateCsv', header: 'Province (US)', type: 'text',display:"none"  },
        {  field: 'usStateMilesCsv', header: 'US Total Miles', type: 'text',display:"none" },
        {  field: 'canStateCsv', header: 'Province (Canada)', type: 'text',display:"none" },
        {  field: 'canStateMilesCsv', header: 'Canada Miles', type: 'text', display:"none"},
        { field: 'usMiles', header: 'US Province Miles', type: "text" },
        { field: 'canMiles', header: 'Canada Province Miles', type: "text" },
        { field: 'miles', header: 'Trip Miles', type: "text" },
        { field: 'newStatus', header: 'Trip Status', type: "text" },
    ];
  
  constructor(private apiService: ApiService, 
  private toastr: ToastrService, 
  private countryStateCity: CountryStateCityService,
  private hereMap: HereMapService,
  protected _sanitizer: DomSanitizer,
  private modalService: NgbModal,
  private route: ActivatedRoute,
  private spinner: NgxSpinnerService,
  private httpClient: HttpClient,) { }
  
  
  async ngOnInit(): Promise<void> {
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.fetchProvinceMilesData();
    this.setToggleOptions();
  }
  // async fetchStates(countryCode: any) {
  //   this.states = await this.countryStateCity.GetStatesByCountryCode([
  //     countryCode,
  //   ]);
  // }
  getSuggestions = _.debounce(function (value) {

    value = value.toLowerCase();
    if (value != '') {
      this.apiService
        .getData(`vehicles/suggestion/${value}`)
        .subscribe((result) => {

          this.suggestedVehicles = result;
        });
    } else {
      this.suggestedVehicles = []
    }
  }, 800);
  setVehicle(vehicleIDs, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleId = vehicleIDs;
    this.suggestedVehicles = [];
  }
  fetchProvinceMilesData() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`vehicles/fetch/provinceMiles?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {
        this.allData = this.allData.concat(result.Items)
        // this.dummyData = this.dummyData.concat(result.Items)
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
        for (let veh of result.Items) {
          veh.newStatus = veh.tripStatus;

          let dataa = veh
          veh.miles = 0
          if(veh.stlLink === true) {
            veh.newStatus = "settled";
         
          }
          else {
            if (veh.recall === true) {
              veh.newStatus = `${veh.tripStatus} (R)`;
            }
          }
          // if (element.recall === true) {
          //   element.newStatus = `${element.tripStatus} (R)`;
          // }
          // else {
          //   if (element.stlLink === true) {
          //     element.newStatus = "settled";
          //   }
          // }
          
          for (let element of dataa.tripPlanning) {
            veh.miles += Number(element.miles);
          }
        }
        
        for (let i = 0; i < result.Items.length; i++) {
        const veh: any = result.Items[i];
        veh.miles = 0
        veh.vehNm = ''
        veh.location = []
        veh.locationCsv = ''
        veh.date = [];
        veh.dateCsv = '';
        veh.usState = []
        veh.usStateCsv = ''
        veh.usStateMiles = []
        veh.usStateMilesCsv = ''
        veh.canState = []
        veh.canStateCsv = ''
        veh.canStateMiles = []
        veh.canStateMilesCsv = ''
       
          for (let element of veh.tripPlanning) {
          veh.miles += Number(element.miles);
          veh.location.push(element.type + ': ' + element.location)
          veh.date.push(element.type + ': ' + element.date)
        }
        
         veh.locationCsv = veh.location.join('\r\n')
        veh.dateCsv = veh.date.join('\r\n')
        for (let data of veh.provinceData) {
          for (let provUS of data.usProvince) {  
             veh.usState.push(provUS.StCntry)
            veh.usStateMiles.push(provUS.Total)
          } 
           veh.usStateCsv = veh.usState.join('\r\n')
          veh.usStateMilesCsv = veh.usStateMiles.join('\r\n')
          for (let canProv of data.canProvince) {
             veh.canState.push(canProv.StCntry)
            veh.canStateMiles.push(canProv.Total)
          }
          veh.canStateCsv = veh.canState.join('\r\n')
          veh.canStateMilesCsv = veh.canStateMiles.join('\r\n')
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

  onScroll= async (event: any) => {
    if (this.loaded) {
      this.fetchProvinceMilesData();
    }
    this.loaded = false;
  }
  searchFilter() {
    if (this.vehicleIdentification !== null || this.start != null && this.end != null) {
      this.vehicleIdentification = this.vehicleIdentification.toLowerCase();
      if (this.vehicleId == '') {
        this.vehicleId = this.vehicleIdentification;
      }
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
        this.suggestedVehicles = [];
        this.allData = [];
        // this.dummyData = [];
        this.dataMessage = Constants.FETCHING_DATA;

        this.fetchProvinceMilesData()
      }
    } else {
      return false;
    }
  }
  
   refreshData() {
        this.end = moment().format("YYYY-MM-DD");
        this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
        this.allData = []
        this.lastItemSK = '';
        this.loaded = false;
        this.fetchProvinceMilesData();
        this.dataMessage = Constants.FETCHING_DATA;
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
    
    
  reset() {
    if (this.vehicleIdentification !== '') {
      this.vehicleId = '';
      this.suggestedVehicles = [];
      this.vehicleIdentification = '';
      this.lastItemSK = '';
      this.allData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchProvinceMilesData();
    } else {
      return false;
    }
  }
  fetchFullExport(type = '') {
    this.apiService.getData(`vehicles/fetch/provinceMiles/report?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.exportData = result.Items;
      for (let veh of this.exportData) {
        let dataa = veh
        veh.miles = 0
        veh.newStatus = veh.tripStatus;
        if (veh.recall === true) {
          veh.newStatus = `${veh.tripStatus} (R)`;
        }
        else {
          if (veh.stlLink === true) {
            veh.newStatus = "settled";
          }
        }
        for (let element of dataa.tripPlanning) {
          veh.miles += Number(element.miles);
        }
      }
      this.generateCSV(type);

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
  generateCSV(type = '') {
    if (this.exportData.length > 0) {
      let dataObject = []
      let csvArray = []
      this.exportData.forEach(element => {
        let canMiles = ''
        let canState = ''
        let stateArr = [];
        if (type === 'CAN') {
          stateArr = element.canStatesData;
        } else if (type === 'US') {
          stateArr = element.usStatesData;
        }
        stateArr.forEach((tripUSState, stateIndex) => {
          if (element.provinceData && element.provinceData.length > 0) {

            for (let i = 0; i < element.provinceData.length; i++) {
              const element2 = element.provinceData[i];
              for (let k = 0; k < element2.canProvince.length; k++) {
                const element4 = element2.canProvince[k];
                canState += `"${element4.StCntry}\n\"`;
                canMiles += `"${element4.Total}\n\"`;

           
              }
              let obj = {}
              obj["Vehicle"] = element.vehicle;
              obj["Trip#"] = element.tripNo;
              obj["Order#"] = element.orderName.replace(/, /g, ' &');
              obj["Date"] = element.createdDate;
              if (type === 'US') {
                obj["Province(US)"] = element2.usProvince[stateIndex].StCntry;
                obj["US Province Miles"] = element2.usProvince[stateIndex].Total;
                obj["US Total Miles"] = element.usMiles.toFixed(2);
              }
              else {
                obj["Province(Canada)"] = element2.canProvince[stateIndex].StCntry;
                obj["Canada Province Miles"] = element2.canProvince[stateIndex].Total;
                obj["Canada Total Miles"] = element.canMiles.toFixed(2);   
              }

              obj["Trip Miles"] = element.miles;
              obj["Trip Status"] = element.newStatus;
              dataObject.push(obj)
            }
          }

        });
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
        if(type === 'US'){
          link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}US-ProvinceMiles-Report.csv`);
        }
        else{
          link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}CAN-ProvinceMiles-Report.csv`);
        }
      
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
  
  
  clear(table: Table) {
        table.clear();
    }
}