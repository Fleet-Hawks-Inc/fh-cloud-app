import {  Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-edit-ticket-type',
  templateUrl: './edit-ticket-type.component.html',
  styleUrls: ['./edit-ticket-type.component.css'],
})
export class EditTicketTypeComponent implements OnInit {
  title = 'Edit Ticket Type';

  errors = {};
  form;

  /********** Form Fields ***********/
  typeID = '';
  typeName = '';
  description = '';
  timeCreated = '';
  /******************/

  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.typeID = this.route.snapshot.params['typeID'];
    this.fetchTicketType();
  }

  fetchTicketType() {
    this.apiService
      .getData('ticketTypes')
      .subscribe((result: any) => {
        result = result.Items[0];
        this.typeName = result.typeName;
        this.description = result.description;
        this.timeCreated = result.timeCreated;
      });
  }



  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  updateTicketType() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      typeID:  this.typeID,
      typeName: this.typeName,
      description: this.description,
      timeCreated: this.timeCreated
    };

    this.apiService.putData('ticketTypes', data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe((val) => {
            this.throwErrors();
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Ticket Type updated successfully';
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
