import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css'],
})
export class StatesComponent implements OnInit {
  title = 'State List';
  states;
  timeCreated;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchStates();
  }

  fetchStates() {
    this.apiService.getData('states').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.states = result.Items;
      },
    });
  }

  deleteState(stateId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData('states/' + stateId).subscribe((result: any) => {
      this.fetchStates();
    });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
