import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import * as moment from 'moment';
declare var $: any;
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
  providers: [DatePipe]
})
export class LogsComponent implements OnInit {
  title = 'Logs';
  logs = [];
  drivers = [];
  userName = '';
  fromDate: any = '' ;
  toDate: any = '' ;
  formattedFromDate: any = '';
  formattedToDate: any = '';

  constructor(private apiService: ApiService,
              private parserFormatter: NgbDateParserFormatter,private toastr: ToastrService,
              private datePipe: DatePipe) {

 //   this.formattedToDate = this.datePipe.transform(new Date(),  'dd-MM-yyyy');
   // this.formattedFromDate = moment(this.datePipe.transform(new Date(), 'yyyy-MM-dd').toString()).subtract(2 , 'days').format('DD-MM-YYYY');

    this.getInitialLogs();

  }

  ngOnInit() {
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.apiService.getData('drivers').subscribe((result: any) => {
      this.drivers = result.Items;
    });
  }

  getInitialLogs() {
    this.getLogs();
  }


  getFilteredLogs() {
    /**
     * this.fromDate and this.toDate are objects need to format them
     */
    this.formattedFromDate  = moment(this.parserFormatter.format(this.fromDate)).format('DD-MM-YYYY');
    this.formattedToDate = moment(this.parserFormatter.format(this.toDate)).format('DD-MM-YYYY');
    this.getLogs();
  }


   getLogs() {
     if((this.fromDate && !this.toDate) || (this.toDate && !this.fromDate)) {
      this.toastr.error('Both dates are required');
      return false;
     }

    this.apiService
      .getData(`compliance/hosLogs?userName=${this.userName}&fromDate=${this.fromDate}&toDate=${this.toDate}`)
      .subscribe((result: any) => {
      this.logs = result;
    });
    console.log(this.logs);
  }
}
