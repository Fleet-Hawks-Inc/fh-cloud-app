import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-ticket-type-list',
  templateUrl: './ticket-type-list.component.html',
  styleUrls: ['./ticket-type-list.component.css'],
})
export class TicketTypeListComponent implements OnInit {
  title = 'Ticket Type List';
  ticketTypes = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchTicketTypes();
  }

  fetchTicketTypes() {
    this.apiService.getData('ticketTypes').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.ticketTypes = result.Items;
      },
    });
  }

  deleteTicketType(ticketID) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData('ticketTypes/' + ticketID)
      .subscribe((result: any) => {
        this.fetchTicketTypes();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
