import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-certificate',
  templateUrl: './add-certificate.component.html',
  styleUrls: ['./add-certificate.component.css']
})
export class AddCertificateComponent implements OnInit {

  title = 'Add Certificate';

  /********** Form Fields ***********/

  rootCA = '';
  certificate = '';
  privateKey = '';
  publicKey = '';
  certificateType = '';
  currentStatus = '';
  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}




  addCertificate() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "rootCA": this.rootCA,
      "certificate": this.certificate,
      "privateKey": this.privateKey,
      "publicKey" : this.publicKey,
      "certificateType": this.certificateType,
      "currentStatus": this.currentStatus 
    };


    this.apiService.postData('certificates', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Certificate Added successfully';
        this.rootCA = '';
        this.certificate = '';
        this.privateKey = '';
        this.publicKey = '';
        this.certificateType = '';
        this.currentStatus = '';
      }
    });
  }
}
