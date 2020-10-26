import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-unidentified',
  templateUrl: './unidentified.component.html',
  styleUrls: ['./unidentified.component.css']
})
export class UnidentifiedComponent implements OnInit {

  logs = [];
  fromDate = "";
  toDate = "";
  constructor(private apiService: ApiService) {
 
  }

  ngOnInit() {
    this.fetchUnIdentifiedLogs();
  }
  fetchUnIdentifiedLogs(){
    this.apiService.getData(`eventLogs/HOSUnIdentified`).subscribe((result) => {
      this.logs = result;
    })
  }

}
