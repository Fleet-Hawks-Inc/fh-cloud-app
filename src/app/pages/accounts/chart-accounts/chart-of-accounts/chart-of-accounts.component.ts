import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css']
})
export class ChartOfAccountsComponent implements OnInit {

  carrierID = '5078';
  http: any;
  constructor(private accountService: AccountService, private toaster: ToastrService) { }

  ngOnInit() {
  }
  addAccount() {
    const data = {
      name: 'harp'
    };
    this.accountService.postData(`sample/${this.carrierID}`, data).subscribe((res: any) => {

        this.toaster.success('Account Added Successfully.');

    });
  }
}
