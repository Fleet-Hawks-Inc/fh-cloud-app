import { Component, OnInit,  Input, TemplateRef, ViewChild  } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Constants from 'src/app/pages/fleet/constants';
import * as _ from 'lodash';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { OverlayPanel } from "primeng/overlaypanel";
import { Table } from 'primeng/table/table';


@Component({
  selector: 'app-province-summary',
  templateUrl: './province-summary.component.html',
  styleUrls: ['./province-summary.component.css']
})
export class ProvinceSummaryComponent implements OnInit {
  @ViewChild('dt') table: Table;
  confirmEmailModal: TemplateRef<any>;
  @ViewChild('op') overlaypanel: OverlayPanel;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  allData: any = [];
  start = null;
  end = null;
  dataMessage = Constants.FETCHING_DATA;
  lastItemSK = '';
  datee = '';
  loaded = false;
  exportData = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  // suggestedVehicles = [];
  vehicleIdentification = '';
  vehicleId = '';
  dataM = []
  visible = true;
  loadMsg: string = Constants.NO_RECORDS_FOUND;
  isSearch = false;
  get = _.get;
  _selectedColumns: any[];
  find = _.find;
  
  dataColumns = [
    { width: '7%', field: 'vehicle', header: 'Vehicle', type: "text" },
    { width: '7%', field: 'caProvinces', header: 'Province(Canada)', type: "text" },
    { width: '7%', field: 'usProvinces', header: 'Province(US)', type: "text" },
    { width: '7%', field: 'newStatus', header: 'Trip Status', type: "text" }
  ];
  
  constructor(private apiService: ApiService, 
  private toastr: ToastrService,
  private spinner: NgxSpinnerService) { }
  
  ngOnInit(): void {
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.fetchProvinceMilesData();
    this.setToggleOptions();
  }
  // getSuggestions = _.debounce(function (value) {

  //   value = value.toLowerCase();
  //   if (value != '') {
  //     this.apiService
  //       .getData(`vehicles/suggestion/${value}`)
  //       .subscribe((result) => {

  //         this.suggestedVehicles = result;
  //       });
  //   } else {
  //     this.suggestedVehicles = []
  //   }
  // }, 800);
  // setVehicle(vehicleIDs, vehicleIdentification) {
  //   this.vehicleIdentification = vehicleIdentification;
  //   this.vehicleId = vehicleIDs;
  //   this.suggestedVehicles = [];
  // }
  
  
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
  
  fetchProvinceMilesData() {
    if (this.lastItemSK !== 'end') {
      this.apiService.getData(`vehicles/fetch/provinceMiles?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {
        if (result.Items.length !== 0) {
          this.allData = this.allData.concat(result.summaryResult);
        }
        this.dataM = result.Items;
        if (result.Items.length == 0) {
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


        for (let element of result.summaryResult) {
          element.newStatus = element.status;


          if (element.stlLink === true) {
            element.newStatus = "settled";
          }
          else {
            if (element.recall === true) {
              element.newStatus = `${element.status} (R)`;
            }
          }
        }
      });
    }
  }

  onScroll = async (event: any) => {
    if (this.loaded) {
      this.fetchProvinceMilesData();
    }
    this.loaded = false;
  }
  
  clear(table: Table) {
    table.clear();
  }
  
  searchFilter() {
    if (this.start != null && this.end != null) {
      // this.vehicleIdentification = this.vehicleIdentification.toLowerCase();
      // if (this.vehicleId == '') {
      //   this.vehicleId = this.vehicleIdentification;
      // }
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
        // this.suggestedVehicles = [];
        this.allData = [];
        this.dataM = [];
        // this.dummyData = [];
        this.dataMessage = Constants.FETCHING_DATA;

        this.fetchProvinceMilesData()
      }
    } else {
      return false;
    }
  }
  // reset() {
  //   if (this.vehicleIdentification !== '') {
  //     this.vehicleId = '';
  //     // this.suggestedVehicles = [];
  //     this.vehicleIdentification = '';
  //     this.lastItemSK = '';
  //     this.allData = [];
  //     this.dataMessage = Constants.FETCHING_DATA;
  //     this.fetchProvinceMilesData();
  //   } else {
  //     return false;
  //   }
  // }
  fetchFullExport(type = '') {
    this.apiService.getData(`vehicles/fetch/provinceMiles/report?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.exportData = result.summaryResult;
      for (let veh of this.exportData) {
        veh.newStatus = veh.status;
        if (veh.stlLink === true) {
          veh.newStatus = "settled";
        }
        else {
          if (veh.recall === true) {
            veh.newStatus = `${veh.status} (R)`;
          }
        }
        veh.canStateMiles = []
        veh.canStates = []
        veh.usStateMiles = []
        veh.usStates = []
        veh.caProvinces.forEach(a => Object.keys(a).forEach(b => veh.canStateMiles.push(a[b])))
        veh.caProvinces.forEach(a => Object.keys(a).forEach(b => veh.canStates.push(b)))
        veh.usProvinces.forEach(a => Object.keys(a).forEach(b => veh.usStateMiles.push(a[b])))
        veh.usProvinces.forEach(a => Object.keys(a).forEach(b => veh.usStates.push(b)))
      }
      this.generateCSV(type);

    });
  }
  generateCSV(type = '') {
    if (this.exportData.length > 0) {
      let dataObject = []
      let csvArray = []
      this.exportData.forEach(element => {

        let stateArr = [];
        if (type === 'CAN') {
          stateArr = element.canStates;
        } else if (type === 'US') {
          stateArr = element.usStates;
        }
        stateArr.forEach((tripUSState, stateIndex) => {
          let obj = {}
          obj["Vehicle"] = element.vehicle;
          if (type === 'US') {
            obj["US States"] = element.usStates[stateIndex];
            obj["US States Miles"] = element.usStateMiles[stateIndex];
          }
          else {
            obj["Canada States "] = element.canStates[stateIndex];
            obj["Canada States Miles"] = element.canStateMiles[stateIndex];
          }

          obj["Trip Status"] = element.newStatus;
          dataObject.push(obj)
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
        if (type === 'US') {
          link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}US-ProvinceMiles-Report.csv`);
        }
        else {
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

}
