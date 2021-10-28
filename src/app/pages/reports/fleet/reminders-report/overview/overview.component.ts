import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  totalCount = 10;
  dataMessage: string = Constants.NO_RECORDS_FOUND
  deletedCount = 0;
  OverdueService = 0;
  due = 0;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchReminderCount();
  }
  async fetchReminderCount() {
    const result = await this.apiService.getData('reminders').toPromise()
    this.totalCount = result.Count
    if (this.totalCount == 0) this.dataMessage = Constants.NO_RECORDS_FOUND
    result.Items.forEach(element => {
      if (element.isDeleted == 1) this.deletedCount++
      if (element.status == "overdue") this.OverdueService++
      if (element.status == "dueSoon") this.due++
    });
  }
}
