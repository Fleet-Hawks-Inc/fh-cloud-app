import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-quotes-list',
  templateUrl: './quotes-list.component.html',
  styleUrls: ['./quotes-list.component.css']
})
export class QuotesListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

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
    this.initDataTable('all')
  }

  fetchQuotes = () => {
    // this.spinner.show(); // loader init
    this.apiService.getData('quotes').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        // this.quotes = result.Items;
        // console.log("quotes", this.quotes);
        this.totalRecords = result.Count;
        }
      });
  };

  deleteQuote(quoteID) {
    this.apiService
      .deleteData('quotes/' + quoteID)
      .subscribe((result: any) => {
        this.toastr.success('Quote Deleted Successfully!');
        this.rerender();
        this.fetchQuotes();
      });
  }

  initDataTable(filters:any = '') {
    let current = this;
    this.serviceUrl = 'quotes/fetch-records'+ "?value1=";
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: current.pageLength,
      serverSide: true,
      processing: true,
      dom: 'lrtip',
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5,6,7,8,9,10,11],"orderable": false},
      ],
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData(this.serviceUrl +current.lastEvaluatedKey +'&searchValue='+this.quoteSearch.searchValue+
        "&startDate="+this.quoteSearch.start+"&endDate="+this.quoteSearch.end , dataTablesParameters).subscribe(resp => {
          this.quotes = resp['Items'];
          // console.log('resp')
          // console.log(resp)
          if (resp['LastEvaluatedKey'] !== undefined) {
            current.lastEvaluatedKey = resp['LastEvaluatedKey'].quoteID
          } else {
            current.lastEvaluatedKey = ''
          }

          callback({
            recordsTotal: current.totalRecords,
            recordsFiltered: current.totalRecords,
            data: []
          });
        });
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(status=''): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      if(status === 'reset') {
        this.dtOptions.pageLength = this.totalRecords;
      } else {
        this.dtOptions.pageLength = 10;
      }
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
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
      
      this.rerender('reset');
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.quoteSearch.startDate !== '' || this.quoteSearch.endDate !== '' || this.quoteSearch.searchValue !== '' ) {
      this.quoteSearch.startDate = '';
      this.quoteSearch.endDate = '';
      this.quoteSearch.searchValue = '';
      this.rerender();
    }
    return false;
  }
}