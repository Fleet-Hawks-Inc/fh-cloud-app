import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service'
import { Router, ActivatedRoute } from '@angular/router'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit {

  public device: any = {
    deviceName: '',
    deviceStatus: '',
    description: '',
    deviceSerialNo: '',
    deviceType: '',
    vehicle: {
      vehicleID: ''
    },
    asset: {}

  };
  public deviceID

  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    let deviceType = this.route.snapshot.params['deviceType'];
    let deviceSerialNo = this.route.snapshot.params['deviceSerialNo']
    this.deviceID = `${deviceType}/${deviceSerialNo}`;
    //this.deviceID=encodeURIComponent(this.deviceID);
    this.fetchDevice();
  }

  private fetchDevice() {
    try {
      this.apiService.getData(`devices/getDeviceBySerialNo/${this.deviceID}`).subscribe((result) => {

        if (result) {
          this.device = {
            deviceName: result.deviceName,
            deviceStatus: result.deviceStatus === true ? 'Active' : 'Inactive',
            deviceSerialNo: result.deviceSerialNo.split('#')[1],
            description: result.description,
            deviceType: result.deviceType,
          }
          if (result.vehicleID) {

            this.device.vehicle = {
              vehicleIdentification: result.vehicleIdentification,
              vehicleID: result.vehicleID
            }
          } else {
            this.device.asset = {
              assetIdentification: result.assetIdentification,
              assetID: result.assetID
            }

          }
        }

      })
    }
    catch (error) {

      throw new Error(error)
    }
  }

  public deactivateDevice() {
    try {

      let body: any = {
        deviceType: this.device.deviceType,
        deviceID: this.device.deviceID
      }
      this.apiService.putData(`devices/deactivate`, body).subscribe((result) => {
        if (result) {

          this.toastr.success("Device De-activated Successfully")
          this.router.navigate(['/manage/devices/list'])
        }
      })
    }
    catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }

}
