import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-ticket-type-list",
  templateUrl: "./ticket-type-list.component.html",
  styleUrls: ["./ticket-type-list.component.css"],
})
export class TicketTypeListComponent implements OnInit {
  title = "Ticket Types List";
  ticketTypes = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchTicketTypes();
  }

  fetchTicketTypes() {
    this.apiService.getData("ticketTypes").subscribe((result: any) => {
      this.ticketTypes = result.Items;
    });
  }

  deleteTicketType(ticketID) {
    this.apiService
      .deleteData("ticketTypes/" + ticketID)
      .subscribe((result: any) => {
        this.fetchTicketTypes();
      });
  }
}
