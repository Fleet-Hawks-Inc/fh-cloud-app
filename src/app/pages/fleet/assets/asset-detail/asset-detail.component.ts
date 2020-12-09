import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HereMapService } from '../../../../services';
import {ApiService} from '../../../../services';
import {AwsUploadService} from '../../../../services';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.css']
})
export class AssetDetailComponent implements OnInit {
  image;
  docs: SafeResourceUrl;
  public assetsImages = [];
  public assetsDocs = [];
  public assetID;
  public assetData: any;
  public deviceData;
  carrierID;

  assetIdentification: string;
  VIN: string;
  assetType: string;
  licencePlateNumber: string;
  licenceStateID: string;
  year: string;
  manufacturer: string;
  model: string;
  length: string;
  axle: string;
  GAWR: string;
  GVWR: string;
  ownerShip: string;
  remarks: string;

  dateOfIssue: string;
  dateOfExpiry: string;
  premiumAmount: string;
  reminderBefore: string;
  vendor: string;
  
  devices;
  allDevices = [];

  errors = {};

  statesObject: any = {};

  messageStatus: boolean = true;
  // Charts
  public chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
         // ticks: {beginAtZero:true},
         display: true,
         scaleLabel: {
            display: true,
            labelString: 'Temperature (F)'
         },
         ticks: {
            min: 0,
            // max: 80,
            stepSize: 5,
            suggestedMin: 0,
            // suggestedMax: 80,
            // Include a degree sign in the ticks
            callback: (value, index, values) => {
               return value + '°F';
            }
         }
      }]
   }
  };
  public chartLabels = ['31 July 12:00', '31 July 18:00', '1 Aug 00:00', '1 Aug 06:00',
              '1 Aug 12:00', '1 Aug 18:00', '2 Aug 00:00', '2 Aug 06:00', '2 Aug 12:00', '2 Aug 18:00'];
  public chartType = 'line';
  public chartLegend = true;
  public chartData = [
    { data: [12, 15, 17, 13, 15, 12, 18, 12, 18, 13, 10, 14, 12],
      label: 'Set',
      fill: false,
      backgroundColor: '#9c9ea1',
      borderColor: '#9c9ea1',
      pointBackgroundColor: '#9c9ea1',
      borderWidth: 1,
    },
    {
      data: [10, 14, 12, 11, 14, 11, 15, 12, 16, 14, 11, 13, 14],
      label: 'Actual',
      fill: false,
      backgroundColor: '#000',
      borderColor: '#000',
      pointBackgroundColor: '#000',
      borderWidth: 1,
    }
  ];
  constructor(public hereMap: HereMapService, private toastr: ToastrService,
              private domSanitizer: DomSanitizer, private awsUS: AwsUploadService,
              private apiService: ApiService, private route: ActivatedRoute, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.hereMap.mapInit(); // Initialize map
    this.assetID = this.route.snapshot.params['assetID']; // get asset Id from URL
    this.fetchAsset();
    this.fetchDeviceInfo();
    this.fetchAllStatesIDs();
  }

  /**
   * fetch Asset data
   */
  async fetchAsset() {
    this.spinner.show(); // loader init
    this.apiService
      .getData(`assets/${this.assetID}`)
      .subscribe((result: any) => {
        if (result) {
          this.assetData = result.Items[0];
          // console.log(this.assetData)
          if (!this.assetData.hasOwnProperty('devices')) {
            this.assetData['devices'] = [];
          }
          this.fetchDevicesByID();
          this.assetIdentification = this.assetData.assetIdentification;
          this.VIN = this.assetData.VIN;
          this.assetType =  this.assetData.assetDetails.assetType;
          this.licencePlateNumber =  this.assetData.assetDetails.licencePlateNumber;
          this.licenceStateID =  this.assetData.assetDetails.licenceStateID;
          this.year =  this.assetData.assetDetails.year;
          this.manufacturer =  this.assetData.assetDetails.manufacturer;
          this.model =  this.assetData.assetDetails.model;
          this.length =  this.assetData.assetDetails.length + ' ' + this.assetData.assetDetails.lengthUnit;
          this.axle =  this.assetData.assetDetails.axle;
          this.GAWR =  this.assetData.assetDetails.GAWR + ' ' + this.assetData.assetDetails.GAWR_Unit;
          this.GVWR =  this.assetData.assetDetails.GVWR + ' ' + this.assetData.assetDetails.GVWR_Unit;
          this.ownerShip =  this.assetData.assetDetails.ownerShip;
          this.remarks =  this.assetData.assetDetails.remarks;

          this.dateOfIssue =  this.assetData.insuranceDetails.dateOfIssue;
          this.dateOfExpiry =  this.assetData.insuranceDetails.dateOfExpiry;
          this.premiumAmount =  this.assetData.insuranceDetails.premiumAmount + ' ' + this.assetData.insuranceDetails.premiumCurrency;
          this.reminderBefore =  this.assetData.insuranceDetails.reminderBefore + ' ' + 
                                      this.assetData.insuranceDetails.reminderBeforeUnit;
          this.vendor = this.assetData.insuranceDetails.vendor;
          
          // this.getImages();
          this.spinner.hide(); // loader hide
        }
      }, (err) => {
        console.log('asset detail', err);
      });
  }

  fetchDeviceInfo = () => {
    this.apiService
      .getData('devices')
      .subscribe((result: any) => {
        if (result) {
          this.deviceData = result['Items'];
          console.log('deviceData', this.deviceData);
        }
      }, (err) => {
        console.log('asset detail', err);
      });
  }

  fetchAllStatesIDs() {
    this.apiService.getData('states/get/list')
      .subscribe((result: any) => {
        this.statesObject = result;
      });
  }

  fetchDevicesByID() {
    this.allDevices = [];
    if (this.assetData.devices) {
      this.assetData.devices.forEach( async element => {
        let result = await this.apiService.getData('devices/' + element).toPromise();
        this.allDevices.push(result.Items[0]);
      });
      console.log('allDevices', this.allDevices);
    }
  }

  getImages = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    for (let i = 0; i <= this.assetData.length; i++) {
      // this.docs = this.domSanitizer.bypassSecurityTrustResourceUrl(
      // await this.awsUS.getFiles(this.carrierID, this.assetData[0].uploadedDocs[i]));
      // this.assetsDocs.push(this.docs)
      this.image = this.domSanitizer.bypassSecurityTrustUrl(await this.awsUS.getFiles(this.carrierID, this.assetData[0].uploadedPhotos[i]));
      this.assetsImages.push(this.image);
    }

  }
  
  removeDevices(i) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.assetData.devices.splice(i, 1);
      this.allDevices.splice(i, 1);
      this.messageStatus = false;
      this.addDevice();
      // this.fetchAsset();
    }
    
  }
  addDevicesIDs() {
    if (!this.assetData.devices.includes(this.devices)) {
      this.assetData.devices.push(this.devices);
    } else {
      this.toastr.error("Device already selected");
    }
    this.fetchDevicesByID();
    // console.log('assetData', this.assetData);
  }

  addDevice() {
    delete this.assetData.carrierID;
    delete this.assetData.timeModified;
    console.log('assetData', this.assetData);
    this.apiService.postData('assets/' + this.assetID, this.assetData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.spinner.hide(); // loader hide
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        if (this.messageStatus) {
          this.toastr.success('Device added successfully');
        } else {
          this.toastr.success('Device updated successfully');
        }
        $('#attachDeviceModal').modal('hide');
      },
    });
  }

  throwErrors() {
    console.log(this.errors);
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
    // this.vehicleForm.showErrors(this.errors);
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label');
      });
    this.errors = {};
  }

}
