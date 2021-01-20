import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
declare var $: any;


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


      this.apiService.getData('cities').subscribe({
        complete: () => {
          this.initDataTable();
        },
        error: () => {},
        next: (result: any) => {
          console.log(result);
          this.cities = result.Items;
        },
      });
  }



  deleteCity(cityID) {
     /******** Clear DataTable ************/
     if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData('cities/' + cityID)
      .subscribe((result: any) => {
        this.fetchCities();
      })
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
