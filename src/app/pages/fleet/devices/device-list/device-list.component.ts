import { Component, OnInit } from '@angular/core';
import { Console } from 'console';
import { ApiService } from '../../../../services/api.service'
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})

export class DeviceListComponent implements OnInit {

  constructor(private apiService: ApiService,
    private toastr:ToastrService) { }


  public devices: any;

  ngOnInit() {
    this.fetchDevices();
  }
  private fetchDevices() {
    try {
      this.apiService.getData('devices').subscribe((result) => {
        if (result) {
          this.devices = result.Items.map((item) => {
            let device = {
              deviceName: '',
              deviceStatus: '',
              description: '',
              deviceSerialNo: '',
              deviceType: '',
              vehicle: {
                vehicleID: '',
                vehicleIdentification: ''
              }
            }
                device.deviceName=item.deviceName,
                device.deviceStatus=item.deviceStatus,
                device.deviceSerialNo=item.deviceSerialNo,
                device.description=item.description,
                device.deviceType=item.deviceType,
                device.vehicle.vehicleID=item.vehicle.vehicleID,
                device.vehicle.vehicleIdentification=item.vehicle.vehicleIdentification
                
                return device
          })
        }
      })
    }
    catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }

  public deleteDevice(deviceType:any,deviceSerialNo:any){
    if(confirm('Are you sure you want to delete')){
      try{
        let deviceSK=`${deviceType}#${deviceSerialNo}`
        deviceSK=encodeURIComponent(deviceSK);
        this.apiService.deleteData(`devices/${deviceSK}`).subscribe((result)=>{
          if(result){
            this.fetchDevices();
            this.toastr.success("Device Deleted Successfully")
          }
        })
      }
      catch(error){
        console.error(error)
        throw new Error(error)
      }
    }
  }

}
