import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-fuel-entry-list',
  templateUrl: './fuel-entry-list.component.html',
  styleUrls: ['./fuel-entry-list.component.css'],
})
export class FuelEntryListComponent implements OnInit {
  title = 'Fuel Entries List';
  fuelLists;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fuelEntries();
  }

  fuelEntries() {
    this.apiService.getData('fuelEntries').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.fuelLists = result.Items;
      },
    });
  }

  deleteFuelEntry(assetId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData('fuelEntries/' + assetId)
      .subscribe((result: any) => {
        this.fuelEntries();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
