import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
  title = 'Edit Ticket';

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

  ticketID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.ticketID = this.route.snapshot.params['ticketID'];

    this.apiService.getData('tickets/' + this.ticketID)
        .subscribe((result: any) => {
          result = result.Items[0];

          this.userName = result.userName;
          this.ticketType = result.ticketType;
          this.ticketValue = result.ticketValue;
          this.description = result.description;
          this.ticketNo = result.ticketNo;
          this.officeDetails = result.officeDetails;
          this.documentID = result.documentID;
          this.expenseID = result.expenseID;
          this.tripID = result.tripID;
        });

  }




  updateTicket() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "ticketID": this.ticketID,
      "userName": this.userName,
      "ticketType": this.ticketType,
      "ticketValue": this.ticketValue,
      "description": this.description,
      "ticketNo": this.ticketNo,
      "officeDetails": this.officeDetails,
      "documentID": this.documentID,
      "expenseID": this.expenseID,
      "tripID": this.tripID

    };

    this.apiService.putData('tickets', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Ticket Updated successfully';

      }
    });
  }
}
