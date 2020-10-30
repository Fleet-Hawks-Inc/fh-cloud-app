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

  duty = 'all';
  SB = [];
  ON = [];
  OFF = [];
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchSummary();
  }

  fetchSummary() {
    this.apiService
      .getData(`eventLogs/HOSDriverSummary?userName=${this.userName}`)
      .subscribe((result: any) => {
        this.summary = result;
        this.SB = this.summary.filter((el) => {
          return el.HOSEventDescription == 'SB';
        });

        this.ON = this.summary.filter((el) => {
          return el.HOSEventDescription == 'ON';
        });

        this.OFF = this.summary.filter((el) => {
          return el.HOSEventDescription == 'OFF';
        });
      });
  }

  toggleData(duty) {
    console.log(duty);
    if (duty == 'all') {
      this.fetchSummary();
    } else if (duty == 'SB') {
      this.summary = this.SB;
    } else if (duty == 'ON') {
      this.summary = this.ON;
    } else if (duty == 'OFF') {
      this.summary = this.OFF;
    }
  }
}
