import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-contact-renew-detail',
  templateUrl: './contact-renew-detail.component.html',
  styleUrls: ['./contact-renew-detail.component.css']
})
export class ContactRenewDetailComponent implements OnInit {
  public entryID;
  public reminderData = [];
  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.entryID = this.route.snapshot.params['entryID'];
    this.fetchRenewals();
  }
  fetchRenewals = () => {
    this.apiService.getData('contactRenewal/' + this.entryID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.reminderData = result.Items;
        console.log('Contact renewals Fetched Data in detail page', this.reminderData);
      },
    });
  }
}
