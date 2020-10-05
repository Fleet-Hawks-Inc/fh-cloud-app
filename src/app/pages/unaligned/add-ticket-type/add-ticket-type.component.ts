import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";
import {catchError, map, mapTo, tap} from 'rxjs/operators';
import {from, of} from 'rxjs';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-add-ticket-type',
  templateUrl: './add-ticket-type.component.html',
  styleUrls: ['./add-ticket-type.component.css']
})
export class AddTicketTypeComponent implements OnInit {
  title = 'Add Ticket Type';

  errors = {};
  form;

  /********** Form Fields ***********/

  typeName ='';
  description = '';
  /******************/

  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {}


  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }


  addTicketType() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      typeName: this.typeName,
      description : this.description,
    };

    this.apiService.postData('ticketTypes', data)
      .subscribe({
        complete : () => {},
        error : (err) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.key] = val.message;
              }),
            )
            .subscribe((val) => {
              this.throwErrors();
            });

        },
        next: (res) => {
          this.typeName = '';
          this.description = '';
          this.response = res;
          this.hasSuccess = true;
          this.Success = 'Ticket Type Added successfully';
        }
      });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }


}
