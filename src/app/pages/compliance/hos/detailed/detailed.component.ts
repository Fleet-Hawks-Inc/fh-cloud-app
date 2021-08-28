import {Component, OnInit} from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import {  ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import * as _ from 'lodash';

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
    driverID = '';
    driverName = '';
    driverLicense = '';
    driverCycle = '';
    /**
     * Carrier Props
     */
    carrierName = '';
    carrierAddress = '';
    carrierDot = '';
    carrierMainOffice = '';
    carrierHomeTerminalName = '';
    carrierHomeTerminalAddress = ''

    ELDProvider = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) {}

  ngOnInit() {
    this.userName = this.route.snapshot.params['userName'];
    this.eventDate = this.route.snapshot.params['eventDate'];

    this.fetchEvents();
    this.getOtherInfo();
  }

  getOtherInfo(){
    this.apiService.getData(`compliance/otherInfo/${this.userName}`).subscribe((result) => {
      let carrier = result.carrier;
      let driver = result.driver;

      this.driverID = driver.driverID;
      this.driverName = driver.firstName+ ' '+driver.lastName;
      this.driverLicense = driver.CDL_Number;
      this.driverCycle = driver.hosDetails.cycleInfo.cycleName;

      this.carrierName = carrier.carrierName;
      this.carrierDot = carrier.DOT;
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
