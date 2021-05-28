import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
@Component({
  selector: 'app-inspection-summary',
  templateUrl: './inspection-summary.component.html',
  styleUrls: ['./inspection-summary.component.css']
})
export class InspectionSummaryComponent implements OnInit {
  dailyInspections = [];

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.fetchDailyInspections();
  }

  fetchDailyInspections = () => {
    this.apiService.getData('dailyInspections').subscribe({
      complete: () => {
      },
      error: () => {},
      next: (result: any) => {
        this.dailyInspections = result.Items;
      },
    });
  }


}
