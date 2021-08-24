import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service'
import {Router, ActivatedRoute} from '@angular/router'
import {ToastrService} from 'ngx-toastr'

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit {

  public device:any={
    deviceName:'',
    deviceStatus:'',
    description:'',
    deviceSerialNo:'',
    deviceType:'',
    vehicle:{
      vehicleID:''
    },
    asset:{}
    
  };
  public deviceID

  constructor(private apiService: ApiService,
    private route:ActivatedRoute,
    private toastr: ToastrService,
    private router:Router) { }

  ngOnInit() {
    let deviceType = this.route.snapshot.params['deviceType'];
    let deviceSerialNo=this.route.snapshot.params['deviceSerialNo']
    this.deviceID=`${deviceType}/${deviceSerialNo}`;
    //this.deviceID=encodeURIComponent(this.deviceID);
    this.fetchDevice();
  }

  private fetchDevice(){
    try{
      this.apiService.getData(`devices/getDeviceBySerialNo/${this.deviceID}`).subscribe((result)=>{
        console.log(result)
        if(result.Count>0){
        this.device={
          deviceName:result.Items[0].deviceName,
          deviceStatus:result.Items[0].deviceStatus,
          deviceSerialNo:result.Items[0].deviceSerialNo,
          description:result.Items[0].description,
          deviceType:result.Items[0].deviceType,
        }
        if(result.Items[0].vehicle && Object.keys(result.Items[0].vehicle).length!=0){
       
          this.device.vehicle=result.Items[0].vehicle
        }
      }
      if(result.Items[0].asset){
        this.device.asset=result.Items[0].asset
      }
      })
    }
    catch(error){
      console.error(error)
      throw new Error(error)
    }
  }

  public deactivateDevice(){
    try{
     let deviceSerialNo=this.device.deviceSerialNo.split('#')
     let body:any={
       deviceType:deviceSerialNo[0],
       deviceSerialNo:deviceSerialNo[1]
     }
      this.apiService.putData(`devices/deactivate`,body).subscribe((result)=>{
        if(result){
          
          this.toastr.success("Device Deaacativated Successfully")
          this.router.navigate(['/manage/devices/list'])
        }
      })
    }
    catch(error){
      console.error(error)
      throw new Error(error)
    }
}

}
