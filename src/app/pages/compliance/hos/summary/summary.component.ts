import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  // summary = [];
  summary$: Observable<any>;
  testValue =  50;


  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchSummary();
  }

  fetchSummary() {
    // this.apiService.getData('eventLogs/HOSDriverSummary/').subscribe((result: any) => {
    //   this.summary(result);
    // });
    //console.log(this.drivers);
    this.summary$ = this.apiService.getData('eventLogs/HOSDriverSummary/');
  }

}
