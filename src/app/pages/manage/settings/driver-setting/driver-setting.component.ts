import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../services';
import Constants from '../../constants';
import * as _ from 'lodash';
@Component({
  selector: 'app-driver-setting',
  templateUrl: './driver-setting.component.html',
  styleUrls: ['./driver-setting.component.css']
})
export class DriverSettingComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  driverID = '';
  driverName = '';
  lastEvaluatedKey = '';
  currentStatus: any;
  loaded = false;
  suggestedDrivers = [];
  driverType = null;
  drivers = [];

  constructor( private apiService: ApiService, private toastr: ToastrService,) { }

  ngOnInit() {
    this.initDataTable();
  }
  
  
    getSuggestions = _.debounce(function (value) {
    this.driverID = '';
    value = value.toLowerCase();
    if (value !== '') {
      this.apiService
        .getData(`drivers/get/deleted/drivers/suggestions/${value}`)
        .subscribe((result) => {
          result.map((v) => {
            if (v.lastName === undefined) {
              v.lastName = '';
            }
            return v;
          });
          this.suggestedDrivers = result;
        });
    } else {
      this.suggestedDrivers = [];
    }
  }, 800);
  
    setDriver(driverID, firstName = "", lastName = "", middleName = "") {
    if (middleName !== "") {
      this.driverName = `${firstName} ${middleName} ${lastName}`;
      // this.driverID = driverID;
      this.driverID = `${firstName} ${middleName} ${lastName}`;
    } else {
      this.driverName = `${firstName} ${lastName}`;
      this.driverID = `${firstName} ${lastName}`;
    }
    this.suggestedDrivers = [];
  }

      async initDataTable() {
        if (this.lastEvaluatedKey !== 'end') {
            const result = await this.apiService.getData(`drivers/deleted/fetch/records?driver=${this.driverID}&lastKey=${this.lastEvaluatedKey}&type=${this.driverType}`).toPromise();
            if (result.Items.length === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND
            }
            result.Items.map((v) => {
          v.url = `/fleet/drivers/detail/${v.driverID}`;
        });
            this.suggestedDrivers = [];
            if (result.Items.length > 0) {
                if (result.LastEvaluatedKey !== undefined) {
                    this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].driverSK);
                }
                else {
                    this.lastEvaluatedKey = 'end'
                }
                this.drivers = this.drivers.concat(result.Items);
                this.loaded = true;
            }
        }
    }
    onScroll() {
        if (this.loaded) {
            this.initDataTable();
        }
        this.loaded = false;
    }

    refreshData() {
      this.drivers = [];
      this.driverID = '';
      this.driverName = '';
      this.driverType = null;
      this.lastEvaluatedKey = '';
      this.dataMessage = Constants.FETCHING_DATA;
    }
    
    searchFilter() {
      if (
      this.driverName !== ''  || 
      this.driverType !== null
      ) {
        this.driverName = this.driverName.toLowerCase();
        if (this.driverID == '') {
          this.driverID = this.driverName;
        }
        this.drivers = [];
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        this.suggestedDrivers = [];
        this.initDataTable();
      } else {
        return false;
      }
    }
    
    resetFilter() {
      if (
      this.driverName !== ''  || 
      this.driverType !== null ||
      this.lastEvaluatedKey !== '') {
        this.driverID = '';
        this.driverName = '';
        this.driverType = null;
        this.drivers = [];
        this.lastEvaluatedKey = '';
        this.dataMessage = Constants.FETCHING_DATA;
        this.initDataTable();
      } else {
        return false;
      }
    }
    
    restoreDriver(eventData) {
      if (confirm('Are you sure you want to restore?') === true) {
        this.apiService.deleteData(`drivers/restore/driver/${eventData.driverID}/${eventData.firstName}/${eventData.lastName}/${eventData.userName}`).subscribe((result: any) => {
          this.drivers = [];
          this.dataMessage = Constants.FETCHING_DATA;
          this.lastEvaluatedKey = '';
          this.initDataTable();
          this.toastr.success('Driver is restored!');
        });
      }
    }
}
