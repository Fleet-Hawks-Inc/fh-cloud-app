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
  fromDate: any = moment().format('YYYY-MM-DD') ;
  toDate: any = moment().format('YYYY-MM-DD');

  constructor(private apiService: ApiService,
              private parserFormatter: NgbDateParserFormatter,private toastr: ToastrService,
              private datePipe: DatePipe) {

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

   getLogs() {
     if((this.fromDate && !this.toDate) || (this.toDate && !this.fromDate)) {
      this.toastr.error('Both dates are required');
      return false;
     }

     let toDate = this.toDate;
     if(this.toDate){
      toDate =  moment(this.toDate).add(1, 'days').format("YYYY-MM-DD");
     }

     if(this.fromDate == null) this.fromDate = '';
     if(toDate == null) toDate = '';

    this.apiService
      .getData(`compliance/hosLogs?userName=${this.userName}&fromDate=${this.fromDate}&toDate=${toDate}`)
      .subscribe((result: any) => {
      this.logs = result;
    });
  }
}
