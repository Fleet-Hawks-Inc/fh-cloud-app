import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';

@Component({
  selector: 'app-subscription-onboard',
  templateUrl: './subscription-onboard.component.html',
  styleUrls: ['./subscription-onboard.component.css']
})
export class SubscriptionOnboardComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  async ngOnInit() {
    this.apiService.getData()
  }

}
