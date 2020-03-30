import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {

  title = 'Entries List';
  entries;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchEntries();

  }

  fetchEntries() {
    this.apiService.getData('entries')
        .subscribe((result: any) => {
          this.entries = result.Items;
        });
  }



  deleteEntry(documentId) {
    this.apiService.deleteData('entries/' + documentId)
        .subscribe((result: any) => {
          this.fetchEntries();
        })
  }

}
