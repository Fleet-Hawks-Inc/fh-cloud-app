import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {
  carrierID = '560';
  actName: '';
  actType: '';
  actNo: '';
  actDesc: '';
  actBal: '';
  actBalCurrency: '';
  actDash: '';
  actDate: '';
  constructor( private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>,private accountService: AccountService, private toaster: ToastrService) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  ngOnInit() {
  }
 addAccount() {
  const data = {
    name: 'hap',
    actName: this.actName,
    // actType: this.actType,
    // actNo: this.actNo,
    // actDesc: this.actDesc,
    // actBal: this.actBal,
    // actBalCurrency: this.actBalCurrency,
    // actDash: this.actDash,
    // actDate: this.actDate
  };
  console.log('data', data);
  this.accountService.postData(`sample/${this.carrierID}`, data).subscribe((res: any) => {

    this.toaster.success('Account Added Successfully.');

});
 }
}
