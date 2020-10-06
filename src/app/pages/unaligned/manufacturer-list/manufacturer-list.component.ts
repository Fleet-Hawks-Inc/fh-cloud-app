import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-manufacturer-list',
  templateUrl: './manufacturer-list.component.html',
  styleUrls: ['./manufacturer-list.component.css'],
})
export class ManufacturerListComponent implements OnInit {
  title = 'Manufacturer List';
  manufacturers = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchManufacturers();
  }

  fetchManufacturers() {
    this.apiService.getData('manufacturers').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.manufacturers = result.Items;
      },
    });
  }

  deleteManufacturer(manufacturerID) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData('manufacturers/' + manufacturerID)
      .subscribe((result: any) => {
        this.fetchManufacturers();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
