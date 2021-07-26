import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService, ListService } from 'src/app/services';

@Component({
  selector: 'app-driver-payments-list',
  templateUrl: './driver-payments-list.component.html',
  styleUrls: ['./driver-payments-list.component.css']
})
export class DriverPaymentsListComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  drivers = [];
  contacts = [];
  payments = [];
  settlements = [];

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToastrService,
    private accountService: AccountService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.fetchDrivers();
    this.fetchContactsList();
    this.fetchDriverPayments();
    this.fetchSettlement();
  }

  fetchDrivers() {
    this.apiService.getData(`drivers/get/list`).subscribe((result: any) => {
      this.drivers = result;
    });
  }

  fetchContactsList() {
    this.apiService
      .getData(`contacts/get/list`)
      .subscribe((result: any) => {
        this.contacts = result;
      });
  }

  fetchDriverPayments() {
    this.accountService.getData(`driver-payments`).subscribe((result: any) => {
      this.payments = result;
      this.payments.map((v) => {
        if(v.payMode) {
          v.payMode = v.payMode.replace("_"," ");
        } else {
          v.payMode = '-';
        }
        v.paymentTo = v.paymentTo.replace("_", " ");
      })
      console.log('this.payments lsts', this.payments);
    });
  }

  fetchSettlement() {
    this.accountService.getData(`settlement/get/list`).subscribe((result: any) => {
      this.settlements = result;
      console.log('this.settlements lsts', this.settlements);
    });
  }

}
