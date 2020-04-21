import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";

@Component({
  selector: "app-edit-ticket",
  templateUrl: "./edit-ticket.component.html",
  styleUrls: ["./edit-ticket.component.css"],
})
export class EditTicketComponent implements OnInit {
  title = "Edit Ticket";
  users = [];
  /********** Form Fields ***********/

  ticketID = "";
  userName = "";
  ticketNumber = "";
  ticketTypeID = "";
  ticketValue = "";
  description = "";
  officeDetails = "";
  timeCreated = "";
  ticketTypes = [];
  /**
   * Form errors prop
   */
  validationErrors = {
    userName: {
      error: false,
    },
    ticketNumber: {
      error: false,
    },
    ticketTypeID: {
      error: false,
    },
    ticketValue: {
      error: false,
    },
    description: {
      error: false,
    },
    officeDetails: {
      error: false,
    },
  };

  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.ticketID = this.route.snapshot.params["ticketID"];
    this.fetchUsers();
    this.fetchTicketTypes();
    this.fetchTicket();
  }

  fetchTicketTypes(){
    this.apiService.getData('ticketTypes')
    .subscribe((result: any) => {
      this.ticketTypes = result.Items;
    });
  }


  fetchUsers() {
    this.apiService
      .getData("users/userType/driver")
      .subscribe((result: any) => {
        this.users = result.Items;
      });
  }

  fetchTicket() {
    this.apiService
      .getData("tickets/" + this.ticketID)
      .subscribe((result: any) => {
        result = result.Items[0];

        this.ticketID = result.ticketID;
        this.userName = result.userName;
        this.ticketTypeID = result.ticketTypeID;
        this.ticketValue = result.ticketValue;
        this.description = result.description;
        this.ticketNumber = result.ticketNumber;
        this.officeDetails = result.officeDetails;
        this.timeCreated = result.timeCreated;
      });
  }

  updateTicket() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      ticketID: this.ticketID,
      userName: this.userName,
      ticketTypeID: this.ticketTypeID,
      ticketValue: this.ticketValue,
      description: this.description,
      ticketNumber: this.ticketNumber,
      officeDetails: this.officeDetails,
      timeCreated: this.timeCreated
    };

    this.apiService.putData("tickets", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.mapErrors(err.error);
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Ticket Updated successfully";
      },
    });
  }

  mapErrors(errors) {
    for (var i = 0; i < errors.length; i++) {
      let key = errors[i].path;
      let length = key.length;

      //make array of message to remove the fieldName
      let message = errors[i].message.split(" ");
      delete message[0];

      //new message
      let modifiedMessage = `This field${message.join(" ")}`;

      if (length == 1) {
        //single object
        this.validationErrors[key[0]].error = true;
        this.validationErrors[key[0]].message = modifiedMessage;
      } else if (length == 2) {
        //two dimensional object
        this.validationErrors[key[0]][key[1]].error = true;
        this.validationErrors[key[0]][key[1]].message = modifiedMessage;
      }
    }
  }

  updateValidation(first, second = "") {
    if (second == "") {
      this.validationErrors[first].error = false;
    } else {
      this.validationErrors[first][second].error = false;
    }
  } 

}
