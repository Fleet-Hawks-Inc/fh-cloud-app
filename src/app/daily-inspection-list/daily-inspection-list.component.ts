import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-daily-inspection-list',
  templateUrl: './daily-inspection-list.component.html',
  styleUrls: ['./daily-inspection-list.component.css']
})
export class DailyInspectionListComponent implements OnInit {

  title = 'Daily Inspections List';
  dailyInspections;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchdailyInspections();

  }

  fetchdailyInspections() {
    this.apiService.getData('dailyInspections')
        .subscribe((result: any) => {
          this.dailyInspections = result.Items;
        });
  }



  deletedailyInspection(inspectionID) {
    this.apiService.deleteData('dailyInspections/' + inspectionID)
        .subscribe((result: any) => {
          this.fetchdailyInspections();
        })
  }

}
