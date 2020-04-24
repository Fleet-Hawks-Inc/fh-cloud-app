import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: "app-countries",
  templateUrl: "./countries.component.html",
  styleUrls: ["./countries.component.css"],
})
export class CountriesComponent implements OnInit {
  title = "Country List";
  countries;
  timeCreated;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchCountries();
  }

  fetchCountries() {
    this.apiService.getData("countries").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.countries = result.Items;
      },
    });
  }

  deleteCountry(countryID) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData("countries/" + countryID)
      .subscribe((result: any) => {
        this.fetchCountries();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}
