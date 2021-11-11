import { Component, OnInit } from '@angular/core';
import { Console } from 'console';
import { ApiService } from '../../../../services/api.service'
import { ToastrService } from 'ngx-toastr';
import Constants from '../../constants';


@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})

export class DeviceListComponent implements OnInit {

  constructor(private apiService: ApiService,
    private toastr: ToastrService) { }


  dataMessage: string = Constants.FETCHING_DATA;
  public devices: any = [];

  ngOnInit() {
    this.fetchDevices();
  }
  private fetchDevices() {
    try {
      this.apiService.getData('devices').subscribe((result) => {

        if (result) {
          if (result.length == 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          else {
            this.devices = result.map((item) => {
              let device = {
                deviceName: '',
                deviceStatus: '',
                description: '',
                deviceSerialNo: '',
                deviceType: '',
                vehicle: {
                  vehicleID: '',
                  vehicleIdentification: ''
                },
                asset: {
                  assetID: '',
                  assetIdentification: ''
                },
                deviceID: ''
              }
              device.deviceName = item.deviceName;
              device.deviceStatus = item.deviceStatus;
              device.deviceSerialNo = item.deviceSerialNo;
              device.description = item.description;
              device.deviceType = item.deviceType;
              device.deviceID = item.deviceID;
              if (item.vehicleIdentification) {
                device.vehicle.vehicleID = item.vehicleID;
                device.vehicle.vehicleIdentification = item.vehicleIdentification;
              }
              if (item.assetIdentification) {
                device.asset.assetID = item.assetID;
                device.asset.assetIdentification = item.assetIdentification;
              }
              return device;
            })
          }
        }
      })
    }
    catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }

  public deactivateDevice(devicesType: any, deviceID: string, activate: boolean) {
    const confirmationText = activate == true ? 'activate' : 'deactivate';
    if (confirm(`Are you sure you want to ${confirmationText}?`) === true) {
      try {
        let body: any = {
          deviceType: devicesType,
          deviceID: deviceID,
          activate: activate
        }
        this.apiService.putData(`devices/deactivate`, body).subscribe((result) => {
          if (result) {
            this.fetchDevices();
            this.toastr.success("Device De-activated Successfully")
          }
        })
      }
      catch (error) {
        console.error(error)
        throw new Error(error)
      }
    }
  }
}
