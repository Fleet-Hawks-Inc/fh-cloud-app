import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';

@Component({
  selector: 'app-quotes-list',
  templateUrl: './quotes-list.component.html',
  styleUrls: ['./quotes-list.component.css']
})
export class QuotesListComponent implements OnInit {
  quotes;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchQuotes();
  }

  fetchQuotes = () => {
    // this.spinner.show(); // loader init
    this.apiService.getData('quotes').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.quotes = result.Items;
        console.log("quotes", this.quotes);
        }
      });
  };

}
