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
    this.spinner.show(); // loader init
    this.apiService
      .getData(`drivers/${this.driverID}`)
      .subscribe((result: any) => {
        if (result) {
          this.driverData = result['Items'][0];
          console.log('driverData', this.driverData)
          //this.getImages();
          this.spinner.hide(); // loader hide
        }
      }, (err) => {
        console.log('Driver detail', err);
      });
  }

  // getImages = async () => {
  //   this.carrierID = await this.apiService.getCarrierID();
  //   for (let i = 0; i <= this.driverData.length; i++) {
  //     this.image = this.domSanitizer.bypassSecurityTrustUrl(
  //       await this.awsUS.getFiles(this.carrierID, this.driverData[0].uploadedPhotos[i]));
  //     this.driverImages.push(this.image);
  //   }
  // }

}
