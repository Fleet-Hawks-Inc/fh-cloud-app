import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../../services/api.service';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
  title = 'Edit Contact';
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
  this.getContact();


  }

getContact()
{
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
      contactID : this.contactID,
      contactType: this.contactType,
      contactName: this.contactName,
      phone: this.phone,
      email: this.email,
      fax: this.fax,
    };

    console.log(data);
    this.apiService.putData('contacts', data).
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
              }),
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => {},
            next: () => {}
          });
        },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Contact Updated successfully';
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
