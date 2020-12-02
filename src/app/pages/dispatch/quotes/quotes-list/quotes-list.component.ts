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
    value2: ''
  };
  quoteSearch = {
    searchValue: '',
    startDate: '',
    endDate: '',
    category: ''
  };
  totalRecords = 20;
  pageLength = 10;
  serviceUrl = '';
  quotesCount = 0;

  constructor(private apiService: ApiService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    // this.fetchQuotes();
    this.initDataTable('all')
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

  initDataTable(filters:any = '') {
    let current = this;
    
    this.serviceUrl = 'quotes/fetch-records'+ "?value1=";

    if(filters === 'yes') {
      let startDatee:any = '';
      let endDatee:any = '';
      // if(this.tripsFiltr.startDate !== ''){
      //   startDatee = new Date(this.tripsFiltr.startDate).getTime();
      // }
      // if(this.tripsFiltr.endDate !== ''){
      //   endDatee = new Date(this.tripsFiltr.endDate+" 00:00:00").getTime();
      // }
      this.quoteSearch.category = 'orderNumber';
      this.serviceUrl = this.serviceUrl+'&filter=true&searchValue='+this.quoteSearch.searchValue+"&startDate="+startDatee+"&endDate="+endDatee;
    }
    // console.log(this.serviceUrl);

    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: current.pageLength,
      serverSide: true,
      processing: true,
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData(this.serviceUrl +current.lastEvaluated.value1 + 
        '&value2=' + current.lastEvaluated.value2, dataTablesParameters).subscribe(resp => {
          this.quotes = resp['Items'];
          console.log('resp')
          console.log(resp)
          if (resp['LastEvaluatedKey'] !== undefined) {
            if (resp['LastEvaluatedKey'].carrierID !== undefined) {
              current.lastEvaluated = {
                value1: resp['LastEvaluatedKey'].quoteID,
                value2: resp['LastEvaluatedKey'].carrierID
              }
            } else {
              current.lastEvaluated = {
                value1: resp['LastEvaluatedKey'].quoteID,
                value2: ''
              }
            }

          } else {
            current.lastEvaluated = {
              value1: '',
              value2: ''
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
    this.rerender();
    this.initDataTable('yes');
  }

}