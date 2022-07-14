import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Console } from 'console';
import { ApiService } from '../../../../services/api.service'
import { ToastrService } from 'ngx-toastr';
import Constants from '../../constants';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import * as _ from "lodash";


@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})

export class DeviceListComponent implements OnInit {
  @ViewChild('dt') table: Table;
  get = _.get;
  _selectedColumns: any[];
      loaded = false;
      dataColumns = [
        { width: '20%', field: 'deviceType', header: 'Type', type: "text" },
        { width: '20%', field: 'deviceSerialNo', header: 'Serial/IMEI', type: "text" },
        { width: '20%', field: 'deviceName', header: 'Device Name', type: "text" },
        { width: '20%', field: 'vehicle.vehicleIdentification', header: 'Vehicle/Asset', type: "text" },
        { width: '20%', field: 'deviceStatus', header: 'Status', type: "text" },
    ];
    
    constructor(private apiService: ApiService,
    private toastr: ToastrService, private router: Router) { }

  next: any = "null";
  vehicleIdentification = '';
  assetIdentification = '';
  dataMessage: string = Constants.FETCHING_DATA;
  public devices: any = [];

  async ngOnInit() {
    this.setToggleOptions();
    this.next = 'null';
    this.devices = [];
    await this.fetchDevices();
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



  refreshData() {
    this.next = 'null';
    this.devices = [];
    this.fetchDevices();
  }


  private async fetchDevices() {
    try {
      if (this.next === 'end') {
       return;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      const result: any = await this.apiService.getData(`devices/getDevices/${this.next}?searchTerm=${this.vehicleIdentification}`).toPromise();
      if(result.data.length === 0){
        this.dataMessage = Constants.NO_RECORDS_FOUND;
        this.loaded = true;
      }
      if (result && result.data.length > 0) {
        result.data.forEach(device => {
          let deviceItem: any = {
            deviceName: device.deviceName,
            deviceStatus: device.deviceStatus,
            deviceSerialNo: device.deviceSerialNo,
            description: device.description,
            deviceType: device.deviceType,
            deviceID: device.deviceID,
            vehicle: {
              vehicleID: '',
              vehicleIdentification: ''
            },
            asset: {
              assetID: '',
              assetIdentification: ''
            }
          }
          if (device.vehicleIdentification) {
            deviceItem.vehicle.vehicleID = device.vehicleID;
            deviceItem.vehicle.vehicleIdentification = device.vehicleIdentification;
          }
          if (device.assetIdentification) {
            deviceItem.asset.assetID = device.assetID;
            deviceItem.asset.assetIdentification = device.assetIdentification;
          }
          this.devices.push(deviceItem);
        });
        this.next = result.nextPage || 'end';
      } else {
        this.next = 'end'
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
        this.loaded = true;
    }
    catch (error) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
      console.error(error)
      throw new Error(error)
    }
  }


  searchFilter(){
  if(this.vehicleIdentification !== '' || this.assetIdentification !== ''){
  this.vehicleIdentification = this.vehicleIdentification;
  this.assetIdentification = this.assetIdentification;
  this.devices = [];
  this.dataMessage = Constants.FETCHING_DATA;
  this.next = "null"
  this.fetchDevices();
  }else{
  return false;
  }
  }
  
  resetFilter(){
  if(this.vehicleIdentification !== '' || this.assetIdentification !== ''){
  this.vehicleIdentification = '';
  this.assetIdentification = '';
  this.devices = [];
  this.dataMessage = Constants.FETCHING_DATA;
  this.next = "null"
  this.loaded = false;
  this.fetchDevices();
  this.dataMessage = Constants.FETCHING_DATA;
  }else{
  return false;
  }
  }


  public deactivateDevice(devicesType: any, deviceID: string, activate: boolean) {
    const confirmationText = activate == true ? 'activate' : 'deactivate';
    const status = activate == true ? 'activated' : 'deactivated';
    if (confirm(`Are you sure you want to ${confirmationText}?`) === true) {
      try {
        let body: any = {
          deviceType: devicesType,
          deviceID: deviceID,
          activate: activate
        }
        this.apiService.putData(`devices/deactivate`, body).subscribe((result) => {
          if (result) {
            this.devices = [];
            this.next = 'null';
            this.fetchDevices();
            this.toastr.success(`Device ${status} Successfully`)
          }
        })
      }
      catch (error) {
        console.error(error)
        throw new Error(error)
      }
    }
  }
        onScroll(){
        if (this.loaded) {
         this.fetchDevices();
        }
        this.loaded = false;
    }

   clear(table: Table) {
        table.clear();
    }
  
  gotoAssetTracker(device) {
    this.router.navigate(
      [`/fleet/tracking/asset-tracker/${device.asset.assetIdentification}`],
      {
        queryParams: { assetId: device.asset.assetID },
      }
    );
  }
}
