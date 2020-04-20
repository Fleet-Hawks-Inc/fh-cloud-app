import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  title = 'Country List';
  countries;
  timeCreated;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchCountries();

  }

  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
        this.timeCreated = result.timeCreated
      });
  }



  deleteCountry(countryID) {
    this.apiService.deleteData('countries/' + countryID)
      .subscribe((result: any) => {
        this.fetchCountries();
      })
  }
}
