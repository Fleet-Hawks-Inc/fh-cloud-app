import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.css']
})
export class PaymentReportComponent implements OnInit {

  constructor() { }

  allPayments=[]
  lastEavaluatedKey=''

  ngOnInit(): void {
  }

  onScroll(){

  }
}
