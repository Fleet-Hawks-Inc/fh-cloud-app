import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../api.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-daily-inspection',
  templateUrl: './daily-inspection.component.html',
  styleUrls: ['./daily-inspection.component.css']
})
export class DailyInspectionComponent implements OnInit {
  dailyInspections = "";

  constructor(private apiService: ApiService,
    private router: Router) { }

  ngOnInit() {
    this.fetchDailyInspections();
  }

  fetchDailyInspections = () => {
    this.apiService.getData("dailyInspections").subscribe({
      complete: () => {
      },
      error: () => {},
      next: (result: any) => {
        this.dailyInspections = result.Items;
        console.log(this.dailyInspections);

      },
    });
  }

}
