import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import * as moment from 'moment';
declare var $: any;
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';

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
              private parserFormatter: NgbDateParserFormatter,
              private datePipe: DatePipe) {

 //   this.formattedToDate = this.datePipe.transform(new Date(),  'dd-MM-yyyy');
   // this.formattedFromDate = moment(this.datePipe.transform(new Date(), 'yyyy-MM-dd').toString()).subtract(2 , 'days').format('DD-MM-YYYY');

    this.getInitialLogs();

  }

  ngOnInit() {
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.apiService.getData('users/userType/driver').subscribe((result: any) => {
      this.drivers = result.Items;
    });
    // console.log(this.drivers);
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


  private getLogs() {
    this.apiService
      .getData(`eventLogs/HOSLogs?userName=${this.userName}&fromDate=${this.formattedFromDate}&toDate=${this.formattedToDate}`)
      .subscribe((result: any) => {
      this.logs = result;
    });
    console.log(this.logs);
  }
}
