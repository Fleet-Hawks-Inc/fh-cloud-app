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

  quotes;
  lastEvaluated = {
    value1: '',
  };
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

    // if(filters === 'yes') {
    //   let startDatee:any = '';
    //   let endDatee:any = '';
    //   // if(this.tripsFiltr.startDate !== ''){
    //   //   startDatee = new Date(this.tripsFiltr.startDate).getTime();
    //   // }
    //   // if(this.tripsFiltr.endDate !== ''){
    //   //   endDatee = new Date(this.tripsFiltr.endDate+" 00:00:00").getTime();
    //   // }
    //   // this.quoteSearch.category = 'orderNumber';
    //   this.serviceUrl = this.serviceUrl+'&filter=true&searchValue='+this.quoteSearch.searchValue+"&startDate="+startDatee+"&endDate="+endDatee;
    // }
    // console.log(this.serviceUrl);

    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: current.pageLength,
      serverSide: true,
      processing: true,
      dom: 'lrtip',
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0],"orderable": false},
        {"targets": [1],"orderable": false},
        {"targets": [2],"orderable": false},
        {"targets": [3],"orderable": false},
        {"targets": [4],"orderable": false},
        {"targets": [5],"orderable": false},
        {"targets": [6],"orderable": false},
        {"targets": [7],"orderable": false},
        {"targets": [8],"orderable": false},
        {"targets": [9],"orderable": false},
        {"targets": [10],"orderable": false},
        {"targets": [11],"orderable": false},
      ],
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData(this.serviceUrl +current.lastEvaluated.value1 +'&searchValue='+this.quoteSearch.searchValue+
        "&startDate="+this.quoteSearch.start+"&endDate="+this.quoteSearch.end , dataTablesParameters).subscribe(resp => {
          this.quotes = resp['Items'];
          // console.log('resp')
          // console.log(resp)
          if (resp['LastEvaluatedKey'] !== undefined) {
            
            current.lastEvaluated = {
              value1: resp['LastEvaluatedKey'].quoteID,
            }

          } else {
            current.lastEvaluated = {
              value1: '',
            }
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
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
      
      this.rerender();
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