import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-fuel-entry-list',
  templateUrl: './fuel-entry-list.component.html',
  styleUrls: ['./fuel-entry-list.component.css']
})
export class FuelEntryListComponent implements OnInit {
  title = 'Fuel Entries List';
  fuelLists;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.fuelEntries();
  }

  fuelEntries() {
    this.apiService.getData('fuelEntries')
        .subscribe((result: any) => {
          this.fuelLists = result.Items;
        });
  }



  deleteFuelEntry(assetId) {
    this.apiService.deleteData('fuelEntries/' + assetId)
        .subscribe((result: any) => {
          this.fuelEntries();
        })
  }
}
