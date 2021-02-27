import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
 // import * as AwsIot from 'aws-iot-device-sdk';
// declare var fs: any;
// import { mqtt, io, iot } from 'aws-crt';
// import * as awsIot from 'aws-iot-device-sdk-v2';
// import { TextDecoder } from 'util';
// window.AwsIot = AwsIot; // make it global

// declare var AwsIot: any;
 // declare var AWS: any;
// (window as any).global = window;
// declare var window : any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  device;
  constructor(private router: Router) {

    // this.device = new AwsIot.device({
    //   keyPath: "./certs/db04d92e19-private.pem.key",
    //   certPath: "./certs/db04d92e19-certificate.pem.crt",
    //   caPath: "./certs/AmazonRootCA1.pem",
    //   clientId: "sdff",
    //   host: "allq1msxtunt6-ats.iot.ap-south-1.amazonaws.com",
    //   port: 8883,
    //   debug: false,
    //   resubscribe: true,
    //   keepalive: 300
    // });

  }

  ngOnInit() {

    this.router.navigate(['/Map-Dashboard']);

    // this.device.on("connect", function() {
    //   console.log("connect");
    //   this.device.subscribe("gps/kunal");
    // });

  }



}
