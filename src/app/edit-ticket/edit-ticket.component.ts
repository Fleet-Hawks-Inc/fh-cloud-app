import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-edit-ticket",
  templateUrl: "./edit-ticket.component.html",
  styleUrls: ["./edit-ticket.component.css"],
})
export class EditTicketComponent implements OnInit {
  title = "Edit Ticket";
  users = [];
  errors = {};
  form;
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
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  fetchTicketTypes() {
    this.apiService.getData("ticketTypes").subscribe((result: any) => {
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
      timeCreated: this.timeCreated,
    };

    this.apiService.putData("tickets", data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
             
              val.message = val.message.replace(/".*"/, "This Field");
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
        this.Success = "Ticket updated successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
