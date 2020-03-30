import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  title = 'Tickets List';
  tickets;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchTickets();

  }

  fetchTickets() {
    this.apiService.getData('tickets')
        .subscribe((result: any) => {
          this.tickets = result.Items;
        });
  }



  deleteTicket(ticketID) {
    this.apiService.deleteData('tickets/' + ticketID)
        .subscribe((result: any) => {
          this.fetchTickets();
        })
  }

}
