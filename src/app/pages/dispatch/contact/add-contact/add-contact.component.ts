import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import {Router} from '@angular/router';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {

  title = 'Add Contact';
  errors = {};
  form;
  concatArrayKeys = '';
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

  ngOnInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }




  addContact() {
    this.errors= {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      contactType: this.contactType,
      contactName: this.contactName,
      phone: this.phone,
      email: this.email,
      fax: this.fax,
    };

  console.log(data);
    this.apiService.postData('contacts', data).
    subscribe({
      complete : () => {},
      error : (err) =>  {
        from(err.error)
          .pipe(
            map((val: any) => {
                const path = val.path;
                // We Can Use This Method
                const key = val.message.match(/'([^']+)'/)[1];
                val.message = val.message.replace(/'.*'/, 'This Field');
                this.errors[key] = val.message;
              })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => {},
            next: () => {},
          });
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

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  concatArray(path) {
    this.concatArrayKeys = '';
    for (const i in path) {
        this.concatArrayKeys += path[i] + '.';
    }
    this.concatArrayKeys = this.concatArrayKeys.substring(0, this.concatArrayKeys.length - 1);
    return this.concatArrayKeys;
  }
}
