import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service'
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router'



@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {

  public deviceIDText = "Device ID (Serial#)";
  constructor(private apiService: ApiService,
    private toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute) { }

  public device: any = {
    deviceName: '',
    deviceSerialNo: '',
    vehicle: {},
    asset: {},
    fleetID: '',
    deviceStatus: '',

    description: '',
    deviceType: '',

  };

  public deviceID = '';

  public vehicles: any;
  public assets: any = [];
  attachedWith = "Vehicle"
  editMode = false
  ngOnInit() {
    let deviceType = this.route.snapshot.params['deviceType'];
    let deviceSerialNo = this.route.snapshot.params['deviceSerialNo']
    if (deviceType && deviceSerialNo) {
      this.editMode = true
      this.deviceID = `${deviceType}/${deviceSerialNo}`;

      // this.deviceID=encodeURIComponent(this.deviceID);
      this.fetchDevices();
    }
    this.deviceAttachedVehicle();
  }
  deviceAttachedVehicle() {
    this.attachedWith = "Vehicle"
    this.fetchVehicles();
  }

  deviceAttachedAsset() {
    this.attachedWith = "Asset"
    this.fetchAssets();
  }
  fetchAssets() {
    this.device.vehicle = {}
    try {
      this.apiService.getData('assets/get/list').subscribe((result) => {

        if (result) {
          for (let key in result) {
            let obj = {
              assetIdentification: result[key],
              assetID: key
            }

            this.assets.push(obj)
          }

        }
      })
    }
    catch (error) {
      console.error(error)
      throw new Error(error);

    }


  }



  private fetchDevices() {
    try {
      this.apiService.getData(`devices/getDeviceBySerialNo/${this.deviceID}`).subscribe((result) => {
        if (result.Count > 0) {
          console.log(result.Items[0])
          this.device = {
            deviceName: result.Items[0].deviceName,
            deviceStatus: result.Items[0].deviceStatus,
            deviceSerialNo: result.Items[0].deviceSerialNo,
            devicesSK: result.Items[0].devicesSK,
            description: result.Items[0].description,
            deviceType: result.Items[0].deviceType,
            vehicle: result.Items[0].vehicle,
            asset: result.Items[0].asset
          }
          if (this.device.asset) {
            if (Object.keys(this.device.asset).length != 0) {
              this.deviceAttachedAsset();
            }
            else {
              this.deviceAttachedVehicle();
            }
          }
        }

      })
    }
    catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }
  private fetchVehicles() {
    this.device.asset = {}


    try {
      this.apiService.getData('vehicles').subscribe((result) => {
        if (result) {
          this.vehicles = result.Items.map((item) => {
            let obj = {
              vehicleIdentification: '',
              vehicleID: ''
            }
            obj.vehicleIdentification = item.vehicleIdentification;
            obj.vehicleID = item.vehicleID
            return obj
          })
        }

      })
    }
    catch (error) {
      console.error(error)
      throw new Error(error);

    }
  }
  public submit() {
    if (this.device) {
      if (this.device.vehicle.vehicleID) {
        this.vehicles.forEach(element => {
          if (this.device.vehicle.vehicleID == element.vehicleID) {
            this.device.vehicle.vehicleIdentification = element.vehicleIdentification;
            this.device.fleetID = element.vehicleIdentification;
          }

        });

      }
      else if (this.device.asset.assetID) {
        this.assets.forEach(element => {
          if (this.device.asset.assetID == element.assetID) {
            this.device.asset.assetIdentification = element.assetIdentification;
            this.device.fleetID = element.assetIdentification;
          }
        })
      }


      try {
        this.apiService.postData('devices', this.device).subscribe({
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
      catch (error) {
        console.error(error)
        throw new Error(error)
      }
    }

  }
  public updateAndSubmit() {
    if (this.device) {

      if (this.device.vehicle.vehicleID) {
        this.vehicles.forEach(element => {
          if (this.device.vehicle.vehicleID == element.vehicleID) {
            this.device.vehicle.vehicleIdentification = element.vehicleIdentification;
            this.device.fleetID = element.vehicleIdentification;
          }

        });

      }
      if (this.device.asset.assetID) {
        this.assets.forEach(element => {
          if (this.device.asset.assetID == element.assetID) {
            this.device.asset.assetIdentification = element.assetIdentification;
            this.device.fleetID = element.assetIdentification;
          }
        })
      }



    }
    try {
      this.apiService.putData('devices', this.device).subscribe({
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
    catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }

  /**
   * change title text depending on device type selected.
   */
  deviceTypeSelected(eventArgs: any) {
    console.log(eventArgs);
    if (eventArgs && eventArgs === "Tracker") {
      this.deviceIDText = "IMEI#";
    } else {
      this.deviceIDText = "Device Id(Serial #)";
    }
  }





}
