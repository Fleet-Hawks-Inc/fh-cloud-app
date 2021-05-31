import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotes-list',
  templateUrl: './quotes-list.component.html',
  styleUrls: ['./quotes-list.component.css']
})
export class QuotesListComponent implements OnInit {

  quotes = [];
  lastEvaluatedKey = '';
  quoteSearch = {
    searchValue: '',
    startDate: '',
    endDate: '',
    start: '',
    end: ''
  };
  totalRecords = 20;
  pageLength = 10;
  serviceUrl = '';
  quotesCount = 0;

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
        // this.quotes = result.Items;
        this.totalRecords = result.Count;
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


  filterSearch() {
    if(this.quoteSearch.startDate !== '' || this.quoteSearch.endDate !== '' || this.quoteSearch.searchValue !== '' ) {
      if(this.quoteSearch.startDate !== '') {
        let startDate:any = {};
        startDate[0] = '';
        startDate = this.quoteSearch.startDate.split('-');
        if(startDate[0] < 10) {
          if(startDate[0].charAt(0) !== '0'){
            startDate[0] = '0'+startDate[0]
          }
        }
        this.quoteSearch.start = startDate[2]+'-'+startDate[1]+'-'+startDate[0];
      }
      if(this.quoteSearch.endDate !== '') {
        let endDate:any = {};
        endDate[0] = '';

        endDate = this.quoteSearch.endDate.split('-');
        if(endDate[0] < 10) {
          if(endDate[0].charAt(0) !== '0'){
            endDate[0] = '0'+endDate[0]
          }
        }
        this.quoteSearch.end = endDate[2]+'-'+endDate[1]+'-'+endDate[1];
      }
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.quoteSearch.startDate !== '' || this.quoteSearch.endDate !== '' || this.quoteSearch.searchValue !== '' ) {
      this.quoteSearch.startDate = '';
      this.quoteSearch.endDate = '';
      this.quoteSearch.searchValue = '';
    }
    return false;
  }
}