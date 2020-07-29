import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-renew-add',
  templateUrl: './vehicle-renew-add.component.html',
  styleUrls: ['./vehicle-renew-add.component.css']
})
export class VehicleRenewAddComponent implements OnInit {
  reminderData = {}
  constructor() { }

  ngOnInit() {
  }

  addRenewal() {
    console.log(this.reminderData);
  }

}
