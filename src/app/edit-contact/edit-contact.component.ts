import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
  title = 'Edit Contact';

  /********** Form Fields ***********/

  contactType = '';
  contactName = '';
  phone = '';
  email = '';
  fax = '';
  /******************/

  contactID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.contactID = this.route.snapshot.params['contactID'];

    this.apiService.getData('contacts/' + this.contactID)
        .subscribe((result: any) => {
          result = result.Items[0];

          this.contactType = result.contactType;
          this.contactName = result.contactName;
          this.phone = result.phone;
          this.email = result.email;
          this.fax = result.fax;
        });

  }




  updateContact() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "contactID": this.contactID,
      "contactType": this.contactType,
      "contactName": this.contactName,
      "phone": this.phone,
      "email": this.email,
      "fax": this.fax
    };

    this.apiService.putData('contacts', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Contact Updated successfully';

      }
    });
  }
}
