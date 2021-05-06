import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service'
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { from } from 'rxjs';
import {  map } from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router'


@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {

  constructor(private apiService: ApiService, 
    private toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute) { }

  public device: any = {
    deviceName: '',
    deviceSerialNo: '',
    devicesSK:'',
    deviceStatus: '',
    vehicle: {
      vehicleID:'',
      vehicleIdentification:''
    },
    description: '',
    deviceType: '',
    
  };

 public deviceID='';
  

  public vehicles:any;
  ngOnInit() {
    let deviceType = this.route.snapshot.params['deviceType'];
    let deviceSerialNo=this.route.snapshot.params['deviceSerialNo']
    if(deviceType&&deviceSerialNo){
    this.deviceID=`${deviceType}#${deviceSerialNo}`;
    this.deviceID=encodeURIComponent(this.deviceID);
    this.fetchDevices();
    }
    this.fetchVehicles();
  }

  private fetchDevices(){
    try{
      this.apiService.getData(`devices/${this.deviceID}`).subscribe((result)=>{
        if(result.Count>0){
        this.device={
          deviceName:result.Items[0].deviceName,
          deviceStatus:result.Items[0].deviceStatus,
          deviceSerialNo:result.Items[0].deviceSerialNo,
          devicesSK:result.Items[0].devicesSK,
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
  private fetchVehicles() {
    try{
    this.apiService.getData('vehicles').subscribe((result)=>{
      if(result){
        this.vehicles=result.Items.map((item)=>{
          let obj={
            vehicleIdentification:'',
            vehicleID:''
          }
          obj.vehicleIdentification=item.vehicleIdentification;
          obj.vehicleID=item.vehicleID
          return obj
        })
      }

    })
  }
  catch(error){
    console.error(error)
    throw new Error(error);

  }
  }
  public submit(){
    if(this.device){
      const today=new Date()
      const dd=today.getDate()
      const mm= today.getMonth()+1;
      const yyyy=today.getFullYear();

      const HH=today.getHours();
      const MM =today.getMinutes();
      const SS=today.getSeconds();
      this.device.devicesSK=`${this.device.deviceType}#${this.device.deviceSerialNo}#${yyyy}-${mm}-${dd}#${HH}:${MM}:${SS}`
      if(this.device.vehicle.vehicleID){
      this.vehicles.forEach(element => {
        if(element.vehicleID==this.device.vehicle.vehicleID){
          
          this.device.vehicle.vehicleIdentification=element.vehicleIdentification
        }
        
      });
      
    }
      try{
        this.apiService.postData('devices',this.device).subscribe({
          complete: () => { },
          error: (err: any) => {
            from(err.error)
              .pipe(
                map((val: any) => {
                  val.message = val.message.replace(/".*"/, 'This Field');
                  
                })
              )
              .subscribe({
                complete: () => {
                  
                },
                error: () => { },
                next: () => { },
              });
          },
          next: (res) => {
            this.toastr.success('Device Created successfully');
            this.location.back();
          }
        });
      
      }
      catch(error){
        console.error(error)
        throw new Error(error)
      }
    }

  }
 public  updateAndSubmit(){
  if(this.device){
    if(this.device.vehicle.vehicleID){
    this.vehicles.forEach(element => {
      if(element.vehicleID==this.device.vehicle.vehicleID){
        
        this.device.vehicle.vehicleIdentification=element.vehicleIdentification
      }
      
    });
    
  }
    try{
      this.apiService.putData('devices',this.device).subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                
              })
            )
            .subscribe({
              complete: () => {
                
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.toastr.success('Device Updated successfully');
          this.location.back();
        }
      });
    
    }
    catch(error){
      console.error(error)
      throw new Error(error)
    }
  }


  }



}
