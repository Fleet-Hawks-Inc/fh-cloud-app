import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-contact-renew',
  templateUrl: './list-contact-renew.component.html',
  styleUrls: ['./list-contact-renew.component.css']
})
export class ListContactRenewComponent implements OnInit {
  filterData = ['Conntact 1','Contact 2'];
  public remindersData = [];
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchRenewals();
  }
  fetchRenewals = () => {
    this.apiService.getData('contactRenewal').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.remindersData = result.Items;
        console.log('Contact renewals Fetched Data', this.remindersData);
      },
    });
  }
  deleteRenewal(entryID) {
    this.apiService
      .deleteData('contactRenewal/' + entryID)
      .subscribe((result: any) => {
        this.fetchRenewals ();
        this.toastr.success('Contact Renewal Reminder Deleted Successfully!');
      });
  }
}
