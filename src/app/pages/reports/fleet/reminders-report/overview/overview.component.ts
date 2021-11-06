import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  filterStatus = null;
  count = {
    total: '',
    overdue: '',
    dueSoon: '',
  }

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchReminderCount();
  }

  fetchReminderCount() {
    this.apiService.getData(`reminders/fetch/count?status=${this.filterStatus}&type=service`).subscribe((result: any) => {
      this.count = result;
    })
  }
}
