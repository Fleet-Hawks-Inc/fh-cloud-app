import {AfterViewInit, Component, OnInit} from '@angular/core';
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import {catchError, map, mapTo, tap} from 'rxjs/operators';
import {from, of} from 'rxjs';
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-add-ticket",
  templateUrl: "./add-ticket.component.html",
  styleUrls: ["./add-ticket.component.css"],
})
export class AddTicketComponent implements OnInit, AfterViewInit {
  title = "Add Ticket";
  users = [];
  /********** Form Fields ***********/

  errors = {};
  form;

  userName = "";
  ticketNumber = "";
  ticketType = "";
  ticketValue = "";
  description = "";
  officeDetails = "";
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchUsers();

    }

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  fetchUsers() {
    this.apiService.getData('users/userType/driver')
        .subscribe((result: any) => {
          this.users = result.Items;
        });
  }

  addTicket() {
    this.errors = {};

    this.hasError = false;
    this.hasSuccess = false;

    let data = {
      userName: this.userName,
      ticketNumber: this.ticketNumber,
      ticketType: this.ticketType,
      ticketValue: this.ticketValue,
      description: this.description,
      officeDetails: this.officeDetails
    };

    const handleError = this.apiService.postData("tickets", data)
      .pipe(
        catchError((err) => {
          return from(err.error)
        }),
        tap((val) => console.log(val)),
        map((val: any) => {
            val.message = val.message.replace(/".*"/, 'This Field');
            this.errors[val.path[0]] = val.message ;
        }),
        )
      .subscribe({
      complete: () => {},
      error: (err) => {
        console.log(err);
        // this.mapErrors(err.error);
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        if (!$.isEmptyObject(this.errors)) {
         return this.throwErrors();
        }
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Ticket Added successfully";
        this.userName = "";
        this.ticketType = "";
        this.ticketValue = "";
        this.description = "";
        this.ticketNumber = "";
        this.officeDetails = "";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
    }


}
