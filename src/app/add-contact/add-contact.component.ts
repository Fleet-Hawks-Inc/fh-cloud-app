import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {

  title = 'Add Contact';

  /********** Form Fields ***********/

  contactType = '';
  contactName = '';
  phone = '';
  email = '';
  fax = '';
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
      "contactType": this.contactType,
      "contactName": this.contactName,
      "phone": this.phone,
      "email": this.email,
      "fax": this.fax,
    };


    this.apiService.postData('contacts', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Contact Added successfully';
        this.contactType = '';
        this.contactName = '';
        this.phone = '';
        this.email = '';
        this.fax = '';
      }
    });
  }
}
