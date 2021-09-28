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
          if (result.Items.length == 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          else {
            this.devices = result.Items.map((item) => {
              let device = {
                deviceName: '',
                deviceStatus: '',
                description: '',
                deviceSerialNo: '',
                devicesSK: '',
                deviceType: '',
                vehicle: {
                  vehicleID: '',
                  vehicleIdentification: ''
                },
                asset: {}
              }
              device.deviceName = item.deviceName,
                device.deviceStatus = item.deviceStatus,
                device.deviceSerialNo = item.deviceSerialNo,
                device.description = item.description,
                device.deviceType = item.deviceType,
                device.devicesSK = item.devicesSK


              if (item.vehicle) {
                device.vehicle.vehicleID = item.vehicle.vehicleID,
                  device.vehicle.vehicleIdentification = item.vehicle.vehicleIdentification
              }

              if (item.asset) {
                device.asset = item.asset
              }

              return device
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

  public deactivateDevice(devicesType: any, deviceSerialNo: any) {
    if (confirm('Are you sure you want to deactivate') === true) {
      try {
        deviceSerialNo = deviceSerialNo.split('#')
        let body: any = {
          deviceType: deviceSerialNo[0],
          deviceSerialNo: deviceSerialNo[1]
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
