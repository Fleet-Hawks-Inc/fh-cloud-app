import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { DashboardUtilityService } from '../services';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import * as _ from 'lodash';
import Constants from '../pages/fleet/constants';
@Component({
  selector: 'app-toast-messages',
  templateUrl: './toast-messages.component.html',
  styleUrls: ['./toast-messages.component.css']
})
export class ToastMessagesComponent implements OnInit {
  subscription: Subscription;
  contactMsg = Constants.contactMsg;

  constructor(private dashboardService: DashboardUtilityService, private messageService: MessageService,
    private primengConfig: PrimeNGConfig) { this.primengConfig.ripple = true; }

  ngOnInit(): void {
    this.subscription = this.dashboardService.notificationRes
      .subscribe(notification => {
        let check = _.isEmpty(notification)
        if (!check) {
          let obj = {
            summary: notification.summary,
            detail: `${notification.detail} ${this.contactMsg}`,
            severity: notification.severity
          }
          this.showError(obj)
        }

      });


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clear() {
    this.messageService.clear();
  }

  showError(data) {
    this.messageService.add({
      severity: data.severity,
      summary: data.summary,
      detail: data.detail,
      sticky: true,
      closable: true,
    });
  }
}
