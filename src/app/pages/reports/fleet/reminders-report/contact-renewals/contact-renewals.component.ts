import { Component, OnInit } from '@angular/core';
import { result } from 'lodash';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';

@Component({
  selector: 'app-contact-renewals',
  templateUrl: './contact-renewals.component.html',
  styleUrls: ['./contact-renewals.component.css']
})
export class ContactRenewalsComponent implements OnInit {
  empData = [];
  dataMessage: string = Constants.NO_RECORDS_FOUND;
  contactID = null;
  searchServiceTask = null;
  filterStatus = null;
  lastEvaluatedKey = "";
  lastItemSK = "";
  loaded = false
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchEmpData();
    this.fetchallitems();
  }


  fetchEmpData() {
    this.apiService.getData("contacts/employee/records").subscribe((result: any) => {
      this.empData = result.Items;
      console.log('empData', result)
    });
  }
  fetchallitems() {
    this.apiService.getData(`reminders/fetch/records?reminderIdentification=${this.contactID}&serviceTask=${this.searchServiceTask}&status=${this.filterStatus}&reminderType=contact&lastKey=${this.lastEvaluatedKey}`)
      .subscribe((result: any) => {
        this.dataMessage = Constants.FETCHING_DATA
        if (result.Items.length === 0) {

          this.dataMessage = Constants.NO_RECORDS_FOUND
        }
        if (result.Items.length > 0) {

          if (result.LastEvaluatedKey !== undefined) {
            this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].reminderSK);
          }
          else {
            this.lastItemSK = 'end'
          }
          this.empData = this.empData.concat(result.Items)

          this.loaded = true;
        }
      });
  }
}