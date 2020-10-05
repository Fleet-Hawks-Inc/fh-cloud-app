import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-quantum",
  templateUrl: "./add-quantum.component.html",
  styleUrls: ["./add-quantum.component.css"],
})
export class AddQuantumComponent implements OnInit {
  parentTitle = "Quantums";
  title = "Add Quantum";
  carriers = [];

  /********** Form Fields ***********/
  serialNo = "";
  macId = "";
  status = "";
  year = "";
  model = "";
  carrierID = "";
  simSerial = "";
  phoneNumber = "";
  serviceProvider = "";
  currentFirmwareVersion = "";
  applicationVersion = "";
  lastCertificateRotation = "";
  apiURL = "";
  deviceType = "";
  key = "";
  secret: "";

  /******************/

  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchCarriers();
  }

  addQuantum() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      sNo: this.serialNo,
      macID: this.macId,
      status: {
        year: this.year,
        model: this.model,
      },
      carrierID: this.carrierID,
      simDetails: {
        simNo: this.simSerial,
        phoneNo: this.phoneNumber,
      },
      currentFirmwareVersion: this.currentFirmwareVersion,
      applicationVersion: this.applicationVersion,
      lastCertificateRotation: this.lastCertificateRotation,
      apiURL: this.apiURL,
      currentStatus: this.status,
      deviceType: this.deviceType,
      key: {
        key: this.key,
        secret: this.secret
      }
    };
    this.apiService.postData("devices", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Device Added successfully";

        this.serialNo = "";
        this.macId = "";
        this.status = "";
        this.year = "";
        this.model = "";
        this.carrierID = "";
        this.simSerial = "";
        this.phoneNumber = "";
        this.serviceProvider = "";
        this.currentFirmwareVersion = "";
        this.applicationVersion = "";
        this.lastCertificateRotation = "";
        this.apiURL = "";
      },
    });
  }

  fetchCarriers(){
    this.apiService.getData('carriers').subscribe((result) => {
      this.carriers = result.Items;
    })
    
  }
}
