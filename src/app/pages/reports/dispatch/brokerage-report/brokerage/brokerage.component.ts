import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services'

@Component({
  selector: 'app-brokerage',
  templateUrl: './brokerage.component.html',
  styleUrls: ['./brokerage.component.css']
})
export class BrokerageComponent implements OnInit {
  brokerage = [];
  constructor(
  private apiService: ApiService
  ) { }

  ngOnInit(): void {
  this.fetchBrokerageReport();
  }

    async fetchBrokerageReport() {
    const result = await this.apiService.getData('orders/report/getBrokerageReport').toPromise();
    this.brokerage = result;
    console.log('broker',this.brokerage);
    }
}
