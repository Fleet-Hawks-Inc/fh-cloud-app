import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
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
  ticketTypeID = "";
  ticketValue = "";
  description = "";
  officeDetails = "";

  ticketTypes = [];
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchUsers();
    this.fetchTicketTypes();
  }

  ngAfterViewInit() {
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

  addTicket() {
    this.errors = {};

    this.hasError = false;
    this.hasSuccess = false;

    let data = {
      userName: this.userName,
      ticketNumber: this.ticketNumber,
      ticketTypeID: this.ticketTypeID,
      ticketValue: this.ticketValue,
      description: this.description,
      officeDetails: this.officeDetails,
    };

    this.apiService.postData("tickets", data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              // this.errors[key] = val.message;
              // Or We Can Use This One To Extract Key
              // const key = this.concatArray(path);
              // this.errors[this.concatArray(path)] = val.message;
              // if (key.length === 2) {
              // this.errors[val.context.key] = val.message;
              // } else {
              // this.errors[key] = val.message;
              // }
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
        this.Success = "Ticket Added successfully";
        this.userName = "";
        this.ticketTypeID = "";
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
