import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-driver-hos',
  templateUrl: './driver-hos.component.html',
  styleUrls: ['./driver-hos.component.css']
})
export class DriverHosComponent implements OnInit {
  activeTab = 'all';
  data = [
    {
      name: 'Aman',
      location: 'Winnipeg',
      status: 'ON',
      HOS: 12,
      currentVehice: 'Truck',
      assetsAttached: 'Truck',
      phone: 9999999999,
      dlState: 'Alberta',
      dlNumber: 'CA216846'  
    },
    {
      name: 'Gaurav',
      location: 'Ontario',
      status: 'ON',
      HOS: 12,
      currentVehice: 'Truck',
      assetsAttached: 'Truck',
      phone: 9999999999,
      dlState: 'Alberta',
      dlNumber: 'CA216846'  
    },
    {
      name: 'Gagan',
      location: 'Calgary',
      status: 'ON',
      HOS: 12,
      currentVehice: 'Truck',
      assetsAttached: 'Truck',
      phone: 9999999999,
      dlState: 'Alberta',
      dlNumber: 'CA216846'  
    },
    {
      name: 'Amrit',
      location: 'Regina',
      status: 'ON',
      HOS: 12,
      currentVehice: 'Truck',
      assetsAttached: 'Truck',
      phone: 9999999999,
      dlState: 'Alberta',
      dlNumber: 'CA216846'  
    },
    {
      name: 'Pankaj',
      location: 'Toranto',
      status: 'OFF',
      HOS: 12,
      currentVehice: 'Truck',
      assetsAttached: 'Truck',
      phone: 9999999999,
      dlState: 'Alberta',
      dlNumber: 'CA216846'  
    },
    {
      name: 'Param',
      location: 'Quebec',
      status: 'OFF',
      HOS: 12,
      currentVehice: 'Truck',
      assetsAttached: 'Truck',
      phone: 9999999999,
      dlState: 'Alberta',
      dlNumber: 'CA216846'  
    },
    {
      name: 'Harpreet',
      location: 'Alberta',
      status: 'OFF',
      HOS: 12,
      currentVehice: 'Truck',
      assetsAttached: 'Truck',
      phone: 9999999999,
      dlState: 'Alberta',
      dlNumber: 'CA216846'  
    },
    {
      name: 'Kunal',
      location: 'Winnipeg',
      status: 'OFF',
      HOS: 12,
      currentVehice: 'Truck',
      assetsAttached: 'Truck',
      phone: 9999999999,
      dlState: 'Alberta',
      dlNumber: 'CA216846'  
    },
  ]

  allData = [];
  constructor() { }

  ngOnInit() {
    this.allData = this.data;
  }

  showAll(){
    this.activeTab = 'all';
    this.allData = this.data.filter(data => data.status == 'OFF' || data.status == 'ON');

  }

  showOffDuty(){
    this.activeTab = 'offDuty';
    this.allData = this.data.filter(data => data.status == 'OFF');

  }

  showOnDuty(){
    this.activeTab = 'onDuty';
    this.allData = this.data.filter(data => data.status == 'ON');
  }

}
