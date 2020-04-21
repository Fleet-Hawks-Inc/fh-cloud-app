import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  title = 'City List';
  cities;
  timeCreated;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchCities();

  }

  fetchCities() {
    this.apiService.getData('cities')
      .subscribe((result: any) => {
        this.cities = result.Items;
        this.timeCreated = result.timeCreated
      });
  }



  deleteCity(cityID) {
    this.apiService.deleteData('cities/' + cityID)
      .subscribe((result: any) => {
        this.fetchCities();
      })
  }
}
