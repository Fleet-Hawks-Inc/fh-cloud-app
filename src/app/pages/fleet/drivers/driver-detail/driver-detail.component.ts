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
          console.log('driverData', this.driverData);
          this.getCycleByID(this.driverData.hosDetails.hosCycle);
          this.fetchYardByID(this.driverData.hosDetails.homeTerminal);
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

  getCycleByID(cycleID:any) {
    this.apiService.getData('cycles/' + cycleID)
      .subscribe((result: any) => {
        this.cycle = result.Items[0].cycleName;
        return this.cycle;
      });
  }

  fetchYardByID(yardID: any) {
    this.apiService.getData('yards/' + yardID)
      .subscribe((result: any) => {
        this.homeTerminal = result.Items[0].yardName;
        return this.homeTerminal;
      });
  }

  

  getImages = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    
    this.image = this.domSanitizer.bypassSecurityTrustUrl(
      await this.awsUS.getFiles(this.carrierID, this.driverData.driverImage));
    this.driverImages.push(this.image);
    
    console.log(' this.driverImages',  this.driverImages);
  }

}
