import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../services/api.service";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-add-device",
  templateUrl: "./add-device.component.html",
  styleUrls: ["./add-device.component.css"],
})
export class AddDeviceComponent implements OnInit {
  public errorMessage = "";
  public deviceIDText = "Device ID (Serial#)";
  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  public device: any = {
    deviceName: "",
    deviceSerialNo: "",
    fleetID: "",
    deviceStatus: "Active",
    description: "",
    deviceType: null,
    vehicleID: null,
    assetID: null,
    deviceID: "",
    vehicle: {},
    asset: {},
  };

  deviceVehicle = [
    { value: "Tracker", text: "Solar Tracker" },
    { value: "Tracker", text: "Wired Tracker" },
    { value: "DashCam", text: "Dash Camera" },
    { value: "ELD", text: "ELD" },
  ];

  deviceAsset = [
    { value: "Tracker", text: "Solar Tracker" },
    { value: "Tracker", text: "Wired Tracker" },
  ];

  devicesTypes = this.deviceVehicle;

  public deviceID = "";

  public vehicles: any = [];
  public assets: any = [];
  attachedWith = "Vehicle";
  editMode = false;

  async ngOnInit() {
    let deviceType = this.route.snapshot.params["deviceType"];
    let deviceSerialNo = this.route.snapshot.params["deviceSerialNo"];

    if (deviceType && deviceSerialNo) {
      this.editMode = true;
      this.deviceID = `${deviceType}/${deviceSerialNo}`;

      // this.deviceID=encodeURIComponent(this.deviceID);
      this.fetchDevices();
    }
    await this.deviceAttachedVehicle();
  }

  async deviceAttachedVehicle() {
    if (!this.editMode) {
      this.devicesTypes = this.deviceVehicle;
      this.attachedWith = "Vehicle";
      await this.fetchVehicles();
    }
  }

  deviceAttachedAsset() {
    if (!this.editMode) {
      this.devicesTypes = this.deviceAsset;

      this.attachedWith = "Asset";
      this.fetchAssets();
    }
  }
  fetchAssets() {
    this.device.vehicle = {};
    try {
      this.apiService
        .getData("assets/get/minor/details")
        .subscribe((result) => {
          this.assets = result.Items;
          // console.log("result", result);
          // this.assets
          // if (result) {
          //   for (let key in result) {
          //     let obj = {
          //       assetIdentification: result[key],
          //       assetID: key
          //     }
          //     this.assets.push(obj)
          //   }
          // }
        });
    } catch (error) {
      throw new Error(error);
    }
  }

  private fetchDevices() {
    try {
      this.apiService
        .getData(`devices/getDeviceBySerialNo/${this.deviceID}`)
        .subscribe(async (result) => {
          if (result) {
            this.device = {
              deviceName: result.deviceName,
              deviceStatus:
                result.deviceStatus === true ? "Active" : "Inactive",
              deviceSerialNo: result.deviceSerialNo.split("#")[1],
              description: result.description,
              deviceType: result.deviceType,
              deviceID: result.deviceID,
            };
            if (result.assetID) {
              this.device.assetID = result.assetID;
              this.attachedWith = "Asset";
              await this.fetchAssets();
            } else {
              this.device.vehicleID = result.vehicleID;
              this.attachedWith = "Vehicle";
              await this.fetchVehicles();
            }
          }
        });
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Fetch vehicles
   */
  private async fetchVehicles() {
    this.device.asset = {};
    const resultVehicles = [];
    try {
      const result = await this.apiService.getData("vehicles").toPromise();
      if (result && result.Items) {
        for (const item of result.Items) {
          if (item.isDeleted === 0) {
            let obj = {
              vehicleIdentification: "",
              vehicleID: "",
            };
            obj.vehicleIdentification = item.vehicleIdentification;
            obj.vehicleID = item.vehicleID;
            resultVehicles.push(obj);
          }
        }
      }
      this.vehicles = resultVehicles;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Fires when submit button is clicked
  public submit() {
    if (this.device) {
      if (this.device.vehicleID) {
        this.vehicles.forEach((element) => {
          if (this.device.vehicleID == element.vehicleID) {
            this.device.vehicle.vehicleIdentification =
              element.vehicleIdentification;
            this.device.vehicle.vehicleID = element.vehicleID;

            this.device.fleetID = element.vehicleIdentification;
          }
        });

        this.device.asset = undefined;
      } else if (this.device.assetID) {
        this.assets.forEach((element) => {
          if (this.device.assetID == element.assetID) {
            this.device.asset.assetIdentification = element.assetIdentification;
            this.device.asset.assetID = element.assetID;
            this.device.fleetID = element.assetIdentification;
          }
        });

        this.device.vehicle = undefined;
      }
      this.device.deviceID = undefined;
      this.device.assetID = undefined;
      this.device.vehicleID = undefined;

      try {
        this.apiService.postData("devices", this.device).subscribe({
          complete: () => {},
          error: (err: any) => {},
          next: (res) => {
            this.toastr.success("Device Created successfully");
            this.location.back();
          },
        });
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    }
  }

  // fires when submit button is clicked
  public updateAndSubmit() {
    if (this.device.deviceStatus === "Active") {
      this.device.deviceStatus = true;
    }
    if (this.device.deviceStatus === "Inactive") {
      this.device.deviceStatus = false;
    }
    this.device.vehicleID = undefined;
    this.device.assetID = undefined;
    this.device.vehicle = undefined;
    this.device.asset = undefined;
    try {
      this.apiService.putData("devices", this.device).subscribe({
        complete: () => {},
        error: (err: any) => {
          console.log(err);
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, "This Field");
              })
            )
            .subscribe({
              complete: () => {},
              error: () => {},
              next: () => {},
            });
        },
        next: (res) => {
          this.toastr.success("Device Updated successfully");
          this.location.back();
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  /**
   * change title text depending on device type selected.
   */
  deviceTypeSelected(eventArgs: any) {
    if (eventArgs && eventArgs === "Tracker") {
      this.deviceIDText = "IMEI#";
    } else {
      this.deviceIDText = "Device Id(Serial #)";
    }
  }
}
