import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-ticket",
  templateUrl: "./add-ticket.component.html",
  styleUrls: ["./add-ticket.component.css"],
})
export class AddTicketComponent implements OnInit {
  title = "Add Ticket";
  users = [];
  /********** Form Fields ***********/

  userName = "";
  ticketNumber = "";
  ticketType = "";
  ticketValue = "";
  description = "";
  officeDetails = "";
  
  /**
   * Form errors prop
   */
  validationErrors = {
    userName: {
      error: false
    },
    ticketNumber: {
      error: false
    },
    ticketType: {
      error: false
    },
    ticketValue: {
      error: false
    },
    description: {
      error: false
    },
    officeDetails: {
      error: false
    }
  }

  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.apiService.getData('users/userType/driver')
        .subscribe((result: any) => {
          this.users = result.Items;
        });
  }

  addTicket() {
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
  
    this.apiService.postData("tickets", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.mapErrors(err.error);
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
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
