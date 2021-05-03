import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service'
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { from } from 'rxjs';
import {  map } from 'rxjs/operators';


@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {

  constructor(private apiService: ApiService, 
    private toastr: ToastrService,
    private location: Location) { }
  public device: any = {
    deviceName: '',
    deviceSerialNo: '',
    deviceStatus: '',
    vehicleID: '',
    description: '',
    deviceType: '',
    
  }

  public vehicles:any;
  ngOnInit() {
    this.fetchVehicles();
  }
  private fetchVehicles() {
    try{
    this.apiService.getData('vehicles/').subscribe((result)=>{
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
      try{
        this.apiService.postData('eldDevices/',this.device).subscribe({
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

  }



}
