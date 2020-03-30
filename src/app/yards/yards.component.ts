import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-yards',
  templateUrl: './yards.component.html',
  styleUrls: ['./yards.component.css']
})
export class YardsComponent implements OnInit {

  title = 'Yards List';
  yards;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchyards();

  }

  fetchyards() {
    this.apiService.getData('yards')
        .subscribe((result: any) => {
          this.yards = result.Items;
        });
  }



  deleteYard(YardId) {
    this.apiService.deleteData('yards/' + YardId)
        .subscribe((result: any) => {
          this.fetchyards();
        })
  }

}
