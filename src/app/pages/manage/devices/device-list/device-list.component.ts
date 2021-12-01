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

  next: any = 'null';

  dataMessage: string = Constants.FETCHING_DATA;
  public devices: any = [];

  ngOnInit() {

    this.fetchDevices();
  }
  private fetchDevices() {
    try {
      if (this.next === 'end') {
        return;
      }
      this.apiService.getData(`devices/getDevices/${this.next}`).subscribe((result) => {
        if (result && result.length !== 0) {
          //console.log(result)
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
          this.dataMessage = Constants.NO_RECORDS_FOUND;
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

  onScroll() {
    this.fetchDevices();

  }
}
