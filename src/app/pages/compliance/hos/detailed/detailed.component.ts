import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { from, merge, of} from 'rxjs';
import { map, shareReplay, tap} from 'rxjs/operators';
import {  ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import * as _ from 'lodash';
import {split} from 'ts-node';
declare var $: any;

@Component({
  selector: 'app-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.css'],
})
export class DetailedComponent implements OnInit {
  //graph general props
  coordinates = 1292 / 24 / 60;
  types = {
    OFF: 40,
    SB: 117,
    D: 192,
    ON: 268,
  };

  title = 'Driver Logs';
  lastEvent: any = {};
  userName = '';
  eventDate = '';
  duties = [];
  eventList = [];
  accumulatedOFF = 0;
  accumulatedSB = 0;
  accumulatedD = 0;
  accumulatedON = 0;
  currentDate = moment().utc().format('DD-MM-YYYY');

  eventID = '';
  fromTime = '';
  toTime = '';
  eventType = '';


    /**
     * Driver props
     */
    driverName = '';

    /**
     * Carrier Props
     */
    carrierName = '';
    carrierAddress = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) {}

  ngOnInit() {
    this.userName = this.route.snapshot.params['userName'];
    this.eventDate = this.route.snapshot.params['eventDate'];

    this.fetchDriver();
    this.fetchEvents();
  }

  fetchDriver(){
    this.apiService.getData(`drivers/userName/${this.userName}`).subscribe((result) => {
      result = result.Items[0];
      this.driverName = result.firstName + ' ' + result.lastName;

      this.fetchCarrier(result.carrierID);
    });
  }

  fetchCarrier(carrierID){
    this.apiService.getData(`carriers/${carrierID}`).subscribe((result) => {
      result = result.Items[0];
      // this.carrierName = result.businessDetail.carrierName;
      // this.carrierAddress = result.addressDetail.address1;
    });
  }

  fetchEvents(){
    this.apiService
      .getData(`compliance/hosDetail?userName=${this.userName}&eventDate=${this.eventDate}`).subscribe((result) => {
        for (let i = 0; i < result.length; i++) {
          for (let key in result[i]) {
            if (result[i].hasOwnProperty(key)) {
              // Add event list localy
              this.eventList = result[i][key].eventList;
            }
          }
        }
      })
  }
}
