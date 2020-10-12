import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../../services/api.service';
import { from } from 'rxjs';
import {map} from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-edit-receiver',
  templateUrl: './edit-receiver.component.html',
  styleUrls: ['./edit-receiver.component.css']
})
export class EditReceiverComponent implements OnInit {
  title = 'Edit Receiver';
  errors = {};
  form;
  concatArrayKeys = '';


  /********** Form Fields ***********/
  receiverID = '';
  name = '';
  phone = '';
  email = '';
  fax = '';
  taxID = '';
  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';



  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.receiverID = this.route.snapshot.params['receiverID'];
    this.fetchReceiver();
     $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  fetchReceiver()
  {
    this.apiService.getData('receivers/' + this.receiverID)
    .subscribe((result: any) => {
      result = result.Items[0];

      this.name = result.name;
      this.phone = result.phone;
      this.fax = result.fax;
      this.email = result.email;
      this.taxID = result.taxID;
    });

  }
  updateReceiver() {
    this.errors= {};
    this.hasError = false;
    this.hasSuccess = false;

    const dataReceiver = {
      name: this.name,
      phone: this.phone,
      fax: this.fax,
      email: this.email,
      taxID: this.taxID
    };
    console.log('Receiver Data',dataReceiver);

    this.apiService.putData('receivers', dataReceiver).
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
            error: () => { },
            next: () => { }
          });
        },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Receiver Updated successfully';
        this.name = '';
        this.phone = '';
        this.fax = '';
        this.email = '';
        this.taxID = '';
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
