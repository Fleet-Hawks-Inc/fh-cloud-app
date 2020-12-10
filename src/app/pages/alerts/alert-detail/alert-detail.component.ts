import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-alert-detail',
  templateUrl: './alert-detail.component.html',
  styleUrls: ['./alert-detail.component.css']
})
export class AlertDetailComponent implements OnInit {
  
  alert = {};
   alertID: string;
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router,
     private spinner: NgxSpinnerService,) { }

  ngOnInit() {
    
    this.alertID = this.route.snapshot.params['alertID'];
    if(this.alertID){
      this.fetchAlertByID();
    }
  }
  fetchAlertByID() {
    this.spinner.show(); // loader init
    this.apiService
      .getData('alerts/' + this.alertID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('result', result);
        this.alert[`alertID`] = result.alertID;
        this.alert[`alertName`] = result.alertName;
        this.alert[`alertType`] = result.alertType;
        this.alert[`assets`] = result.assets;
        this.alert[`vehicles`] = result.vehicles;
        this.alert[`drivers`] = result.drivers;
        this.alert[`groups`] = result.groups;
        this.alert[`users`] = result.users;
        this.alert[`otherEmails`] = result.otherEmails;
      });
    this.spinner.hide();
  }

}
