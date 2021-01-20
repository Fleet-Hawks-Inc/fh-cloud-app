import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  summary = [];
  uncertified = [];
  userName = '';


  duty = 'all';
  SB = [];
  ON = [];
  OFF = [];
  D = [];
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchSummary();
    this.fetchUncertified();
  }

  fetchUncertified(){
    this.apiService.getData(`eventLogs/HOSUncertified`).subscribe((result) => {
      this.uncertified = result;

      console.log(this.uncertified);
    });
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

        this.D = this.summary.filter((el) => {
          return el.HOSEventDescription == 'D';
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
