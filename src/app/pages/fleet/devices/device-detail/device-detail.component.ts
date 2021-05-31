import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service'
import {Router, ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit {

  public device={
    deviceName:'',
    deviceStatus:'',
    description:'',
    deviceSerialNo:'',
    deviceType:'',
    vehicle:{
      vehicleID:'',
      vehicleIdentification:''
    }
  };
  public deviceID

  constructor(private apiService: ApiService,
    private route:ActivatedRoute) { }

  ngOnInit() {
    let deviceType = this.route.snapshot.params['deviceType'];
    let deviceSerialNo=this.route.snapshot.params['deviceSerialNo']
    this.deviceID=`${deviceType}#${deviceSerialNo}`;
    this.deviceID=encodeURIComponent(this.deviceID);
    this.fetchDevice();
  }

  private fetchDevice(){
    try{
      this.apiService.getData(`devices/${this.deviceID}`).subscribe((result)=>{
        if(result.Count>0){
        this.device={
          deviceName:result.Items[0].deviceName,
          deviceStatus:result.Items[0].deviceStatus,
          deviceSerialNo:result.Items[0].deviceSerialNo,
          description:result.Items[0].description,
          deviceType:result.Items[0].deviceType,
          vehicle:{
            vehicleID:result.Items[0].vehicle.vehicleID,
            vehicleIdentification:result.Items[0].vehicle.vehicleIdentification
          }
        }
      }
      })
    }
    catch(error){
      console.error(error)
      throw new Error(error)
    }
  }


}
