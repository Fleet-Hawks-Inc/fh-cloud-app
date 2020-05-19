import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: "app-tickets",
  templateUrl: "./tickets.component.html",
  styleUrls: ["./tickets.component.css"],
})
export class TicketsComponent implements OnInit {
  title = "Tickets List";
  tickets;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchTickets();
  }

  fetchTickets() {
    this.apiService.getData("tickets").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.tickets = result.Items;
      },
    });
  }

  deleteTicket(ticketID) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable("#datatable-default")) {
      $("#datatable-default").DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData("tickets/" + ticketID)
      .subscribe((result: any) => {
        this.fetchTickets();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}
