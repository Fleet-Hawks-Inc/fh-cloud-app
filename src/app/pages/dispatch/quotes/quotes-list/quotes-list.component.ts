import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quotes-list',
  templateUrl: './quotes-list.component.html',
  styleUrls: ['./quotes-list.component.css']
})
export class QuotesListComponent implements OnInit {
  quotes;
  constructor(private apiService: ApiService,
              private router: Router,
              private toastr: ToastrService) { }

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

  deleteQuote(quoteID) {
    this.apiService
      .deleteData('quotes/' + quoteID)
      .subscribe((result: any) => {
        this.toastr.success('Quote Deleted Successfully!');
        this.fetchQuotes();
      });
  }

}
