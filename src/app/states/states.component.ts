import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css']
})
export class StatesComponent implements OnInit {

  title = 'State List';
  states;
  timeCreated;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchStates();

  }

  fetchStates() {
    this.apiService.getData('states')
      .subscribe((result: any) => {
        this.states = result.Items;
        this.timeCreated = result.timeCreated
      });
  }



  deleteState(stateId) {
    this.apiService.deleteData('states/' + stateId)
      .subscribe((result: any) => {
        this.fetchStates();
      })
  }
}
