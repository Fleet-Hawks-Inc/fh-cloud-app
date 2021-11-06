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
  countList = {
    total: ""
  }
  countData = {
    total: ""
  }

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchReminderCount();
    this.fetchRemiCount();
    this.fetchCount();
  }

  fetchReminderCount() {
    this.apiService.getData(`reminders/fetch/count?&type=service`).subscribe((result: any) => {
      this.count = result;
    })
  }
  fetchRemiCount() {
    this.apiService.getData("reminders/fetch/count?type=contact").subscribe((result: any) => {
      this.countList = result;
    })
  }
  fetchCount() {
    this.apiService.getData("reminders/fetch/count?type=vehicle").subscribe((result: any) => {
      this.countData = result;
    })
  }
}
