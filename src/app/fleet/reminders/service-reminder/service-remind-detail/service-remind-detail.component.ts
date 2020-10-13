import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-remind-detail',
  templateUrl: './service-remind-detail.component.html',
  styleUrls: ['./service-remind-detail.component.css']
})
export class ServiceRemindDetailComponent implements OnInit {
  reminderID;
  public reminderData: any;

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.reminderID = this.route.snapshot.params['reminderID']; // get reminderID from URL

    this.fetchAsset();
  }
  
  /**
   * fetch Asset data
   */
  fetchAsset() {
    this.apiService
      .getData(`serviceReminders/${this.reminderID}`)
      .subscribe((result: any) => {
        if (result) {
          this.reminderData = result['Items'];
          console.log("reminderData", this.reminderData)
        }
      }, (err) => {
        console.log('reminder detail', err);
      });
  }

}
