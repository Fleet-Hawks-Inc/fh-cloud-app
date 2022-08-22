import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ApiService, HereMapService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import * as _ from "lodash";
import { NgSelectComponent } from "@ng-select/ng-select";
import * as moment from 'moment'
import { Table } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-driver-report',
  templateUrl: './driver-report.component.html',
  styleUrls: ['./driver-report.component.css']
})
export class DriverReportComponent implements OnInit {
  @ViewChild('dt') table: Table;

  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  public drivIDs: any;
  exportData = [];

  listView = true;
  visible = true;

  loadMsg: string = Constants.NO_LOAD_DATA;
  isSearch = false;
  get = _.get;
  _selectedColumns: any[];

  data: any = [];
  driverIDs = "";
  start = null
  end = null
  driver = []
  order = []
  datee = ''
  lastEvaluatedKey = ''
  driverID = "";
  DrivN = []
  loaded = false
  employeeOptions: any[];
  driverN = ''
  dataColumns = [
    { field: 'drin', header: 'Name', type: "text" },
    { field: 'tripNo', header: 'Trip', type: "text" },
    { field: 'locationCsv', header: 'Location', type: "text", display: "none" },
    { field: 'dateCsv', header: 'Date', type: "text", display: "none" },
    { field: 'orderNumber', header: 'Order', type: "text" },
    { field: 'csvmiles', header: 'Total Miles', type: "text" },

  ];

  constructor(private apiService: ApiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private hereMap: HereMapService,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.drivIDs = this.route.snapshot.params['drivIDs']
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, "months").format("YYYY-MM-DD");
    this.setToggleOptions();
    await this.fetchTrip();
    this.fetchDriverName();
  }


  fetchDriverName() {
    this.apiService.getData(`drivers/fetch/driver/detail/${this.drivIDs}`).subscribe((result: any) => {
      this.DrivN = result.Items
      for (let drivnn of this.DrivN) {
        this.driverN = drivnn.firstName + " " + drivnn.lastName
      }
    })
  }

  async fetchTrip() {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService.getData(`common/trips/get/trip/data?driver=${this.drivIDs}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastEvaluatedKey}&date=${this.datee}`).subscribe((result: any) => {
        // this.data = result.Items
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
        }
        this.data = this.data.concat(result.Items)
        for (let driv of this.data) {
          let dataa = driv
          driv.miles = 0
          for (let element of dataa.singledriv) {
            driv.miles += Number(element.miles);
          }
        }
        if (result.LastEvaluatedKey !== undefined) {
          this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].tripSK);
          this.datee = encodeURIComponent(result.Items[result.Items.length - 1].dateCreated);
        }
        else {
          this.lastEvaluatedKey = 'end'

        }
        this.loaded = true;
        for (let index = 0; index < result.Items.length; index++) {
          const res: any = result.Items[index];

          res.drin = ''
          res.location = []
          res.locationCsv = ''
          res.date = [];
          res.dateCsv = '';
          res.csvmiles=''
          res.drin = this.driverN


          for (let element of res.singledriv) {
            // console.log("-===", element)

            res.miles += Number(element.miles)
            res.csvmiles = res.miles.toFixed(2)
            res.location.push(element.type + ": " + element.location)
            res.date.push(element.type + ": " + element.date)
          }

          res.locationCsv = res.location.join('\r\n')
          res.dateCsv = res.date.join('\r\n')
        }
      })
    }
  }
  onScroll = async (event: any) => {
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
      this.fetchTrip();
    }
    else {
      return false;
    }
  }

  refreshData() {
    this.data = []
    this.lastEvaluatedKey = '';
    this.loaded = false;
    this.fetchTrip();
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

  clear(table: Table) {
    table.clear();
  }
}