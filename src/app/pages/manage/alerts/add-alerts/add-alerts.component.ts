import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-alerts',
  templateUrl: './add-alerts.component.html',
  styleUrls: ['./add-alerts.component.css']
})
export class AddAlertsComponent implements OnInit {
  isTiming: boolean = false;
  isAlert: boolean = false;
  isEmail: boolean = false;
  isCustom: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
