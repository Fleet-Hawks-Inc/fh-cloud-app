import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  summary = [];
  userName = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchSummary();
  }

  fetchSummary() {
    this.apiService
      .getData(`eventLogs/HOSDriverSummary?userName=${this.userName}`)
      .subscribe((result: any) => {
        this.summary = result;
      });
  }
}
