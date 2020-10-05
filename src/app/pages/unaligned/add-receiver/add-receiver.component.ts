import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-receiver',
  templateUrl: './add-receiver.component.html',
  styleUrls: ['./add-receiver.component.css']
})
export class AddReceiverComponent implements OnInit {

  title = 'Add Receiver';

  /********** Form Fields ***********/

  receiverName = '';
  address = '';
  phone = '';
  fax = '';
  email = '';
  taxID = '';

  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}




  addDocument() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "receiverName": this.receiverName,
      "address": this.address,
      "phone": this.phone,
      "fax": this.fax,
      "email": this.email,
      "taxID": this.taxID,
    };


    this.apiService.postData('receivers', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Receiver Added successfully';
        this.receiverName = '';
        this.address = '';
        this.phone = '';
        this.fax = '';
        this.email = '';
        this.taxID = '';
      }
    });
  }
}
