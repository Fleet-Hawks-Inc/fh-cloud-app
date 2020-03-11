import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-edit-quantum',
  templateUrl: './edit-quantum.component.html',
  styleUrls: ['./edit-quantum.component.css']
})
export class EditQuantumComponent implements OnInit {

  /********** Form Fields ***********/
  serialNo = '';
  macId = '';
  status = '';
  year = '';
  model = '';
  carrierID = '';
  simSerial = '';
  phoneNumber = '';
  serviceProvider = '';
  currentFirmwareVersion = '';
  applicationVersion = '';
  lastCertificateRotation = '';
  apiURL = '';
  quantumId = '';

  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.quantumId = this.route.snapshot.params['quantumId'];

    this.apiService.getData('quantums/' + this.quantumId)
        .subscribe((result: any) => {
      console.log(result);
          result = result.Items[0];



          this.serialNo = result.sNo;
          this.macId =  result.macID;
          this.status =  result.currentStatus;
          this.year =  result.status.year;
          this.model = result.status.model;
          this.carrierID =  result.carrierID;
          this.simSerial =  result.simDetails.simNo;
          this.phoneNumber =  result.simDetails.phoneNo;
          this.currentFirmwareVersion =  result.currentFirmwareVersion;
          this.applicationVersion =  result.applicationVersion;
          this.lastCertificateRotation = result.lastCertificateRotation;
          this.apiURL =  result.apiURL;


          //this.quantum = result.quantum;
          //this.quantumSelected = result.quantumSelected;


          //console.log(result);
        });

  }


  updateQuantum() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      'quantumID': this.quantumId,
      "sNo": this.serialNo,
      "macID": this.macId,
      "status": {
        "year": this.year,
        "model": this.model
      },
      "carrierID": this.carrierID,
      "simDetails": {
        "simNo": this.simSerial,
        "phoneNo": this.phoneNumber
      },
      "currentFirmwareVersion": this.currentFirmwareVersion,
      "applicationVersion": this.applicationVersion,
      "lastCertificateRotation": this.lastCertificateRotation,
      "apiURL": this.apiURL,
      "currentStatus": this.status
    };


    this.apiService.putData('quantums', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Quantum Updated successfully';

      }
    });
  }



}
