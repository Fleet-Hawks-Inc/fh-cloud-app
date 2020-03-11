import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent implements OnInit {

  title = 'Add Ticket';

  /********** Form Fields ***********/

  userName = '';
  ticketType = '';
  ticketValue = '';
  description = '';
  ticketNo = '';
  officeDetails = '';
  documentID = '';
  expenseID = '';
  tripID = '';

  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}




  addTicket() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      'userName' : this.userName,
      'ticketType' : this.ticketType,
      'ticketValue' : this.ticketValue,
      'description' : this.description,
      'ticketNo' : this.ticketNo,
      'officeDetails' : this.officeDetails,
      'documentID' : this.documentID,
      'expenseID' : this.expenseID,
      'tripID' : this.tripID
    };


    this.apiService.postData('tickets', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Ticket Added successfully';
        this.userName = '';
        this.ticketType = '';
        this.ticketValue = '';
        this.description = '';
        this.ticketNo = '';
        this.officeDetails = '';
        this.documentID = '';
        this.expenseID = '';
        this.tripID = '';
      }
    });
  }
}
