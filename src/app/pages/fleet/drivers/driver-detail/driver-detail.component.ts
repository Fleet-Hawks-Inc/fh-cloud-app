import { Component, OnInit } from '@angular/core';
import { HereMapService } from '../../../../services';
import {ApiService} from '../../../../services';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {AwsUploadService} from '../../../../services';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.css']
})
export class DriverDetailComponent implements OnInit {
  image;
  driverName;
  CDL;
  workPhone;
  workEmail;
  homeTerminal;
  cycle;
  private driverID;
  private driverData;
  carrierID;
  public driverImages = [];
  cdl;
  phone;
  email;
  cycleObjects: any = {};
  yardsObjects: any = {};

  constructor(
        private hereMap: HereMapService,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private domSanitizer: DomSanitizer,
        private awsUS: AwsUploadService
      )
  {}

  ngOnInit() {
    this.hereMap.mapInit();
    this.driverID = this.route.snapshot.params['driverID']; // get asset Id from URL
    this.fetchDriver();
    this.fetchCyclesbyIDs();
    this.fetchYardsByIDs();
  }

   /**
   * fetch Asset data
   */
  fetchDriver() {
    // this.spinner.show(); // loader init
    this.apiService
      .getData(`drivers/${this.driverID}`)
      .subscribe((result: any) => {
        if (result) {
          this.driverData = result['Items'][0];
          this.cycle = this.driverData.hosDetails.hosCycle;
          this.homeTerminal = this.driverData.hosDetails.homeTerminal;
          this.workEmail = this.driverData.workEmail;
          this.workPhone = this.driverData.workPhone;
          this.CDL = this.driverData.licenceDetails.CDL_Number;
          this.driverName = `${this.driverData.firstName} ${this.driverData.lastName}`;
          
          this.getImages();
          // this.spinner.hide(); // loader hide

        }
      }, (err) => {
        console.log('Driver detail', err);
      });
  }

  fetchCyclesbyIDs() {
    this.apiService.getData('cycles/get/list')
      .subscribe((result: any) => {
        this.cycleObjects = result;
      });
  }

  fetchYardsByIDs() {
    this.apiService.getData('yards/get/list')
    .subscribe((result: any) => {
      this.yardsObjects = result;
    });
  }

  

  getImages = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    
    this.image = this.domSanitizer.bypassSecurityTrustUrl(
      await this.awsUS.getFiles(this.carrierID, this.driverData.driverImage));
    this.driverImages.push(this.image);
  }

}
