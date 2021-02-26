import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HereMapService } from '../../../../services';
import {ApiService} from '../../../../services';
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
  Asseturl = this.apiService.AssetUrl;
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
  lengthUnit: string;
  axle: string;
  GAWR: string;
  GAWR_Unit: string;
  GVWR: string;
  GVWR_Unit: string;
  ownerShip: string;
  remarks: string;

  dateOfIssue: string;
  dateOfExpiry: string;
  premiumAmount: string;
  premiumCurrency: string;
  reminderBefore: string;
  reminderBeforeUnit: string;
  vendor: string;
  
  devices: any;
  allDevices = [];

  errors = {};

  statesObject: any = {};
  uploadedDocs = [];
  uploadedPhotos = [];
  pdfSrc:any = this.domSanitizer.bypassSecurityTrustUrl('');

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

  manufacturersObjects: any = {};
  modelsObjects: any = {};

  constructor(public hereMap: HereMapService, private toastr: ToastrService,
              private domSanitizer: DomSanitizer, private apiService: ApiService, 
              private route: ActivatedRoute, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.hereMap.mapInit(); // Initialize map
    this.assetID = this.route.snapshot.params['assetID']; // get asset Id from URL
    this.fetchAsset();
    this.fetchDeviceInfo();
    this.fetchAllStatesIDs();
    this.fetchManufacturesByIDs();
    this.fetchModalsByIDs();
  }

  fetchManufacturesByIDs() {
    this.apiService.getData('manufacturers/get/list').subscribe((result: any) => {
      this.manufacturersObjects = result;
    });
  }

  fetchModalsByIDs() {
    this.apiService.getData('vehicleModels/get/list').subscribe((result: any) => {
      this.modelsObjects = result;
    });
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
          if (this.assetData.assetDetails.length != undefined || this.assetData.assetDetails.length != null) {
            this.length =  this.assetData.assetDetails.length + ' ' + this.assetData.assetDetails.lengthUnit;
          }
          if (this.assetData.assetDetails.lengthUnit != undefined || this.assetData.assetDetails.lengthUnit != null) {
            this.lengthUnit =   this.assetData.assetDetails.lengthUnit;
          }
          if (this.assetData.assetDetails.axle != undefined || this.assetData.assetDetails.axle != null) {
            this.axle =  this.assetData.assetDetails.axle;
          }
          if (this.assetData.assetDetails.GAWR != undefined || this.assetData.assetDetails.GAWR != null) {
            this.GAWR =  this.assetData.assetDetails.GAWR;
          }
          if (this.assetData.assetDetails.GAWR_Unit != undefined || this.assetData.assetDetails.GAWR_Unit != null) {
            this.GAWR_Unit =  this.assetData.assetDetails.GAWR_Unit;
          }
          if (this.assetData.assetDetails.GVWR != undefined || this.assetData.assetDetails.GVWR != null) {
            this.GVWR =  this.assetData.assetDetails.GVWR
          }
          if (this.assetData.assetDetails.GVWR_Unit != undefined || this.assetData.assetDetails.GVWR_Unit != null) {
            this.GVWR_Unit =  this.assetData.assetDetails.GVWR_Unit
          }
          this.ownerShip =  this.assetData.assetDetails.ownerShip;
          this.remarks =  this.assetData.assetDetails.remarks;

          if (this.assetData.insuranceDetails.dateOfIssue != undefined || this.assetData.insuranceDetails.dateOfIssue != null) {
            this.dateOfIssue =  this.assetData.insuranceDetails.dateOfIssue;
          }
          if (this.assetData.insuranceDetails.dateOfExpiry != undefined || this.assetData.insuranceDetails.dateOfExpiry != null) {
            this.dateOfExpiry =  this.assetData.insuranceDetails.dateOfExpiry;
          }
          if (this.assetData.insuranceDetails.premiumAmount != undefined || this.assetData.insuranceDetails.premiumAmount != null) {
            this.premiumAmount =  this.assetData.insuranceDetails.premiumAmount;
          }
          if (this.assetData.insuranceDetails.premiumCurrency != undefined || this.assetData.insuranceDetails.premiumCurrency != null) {
            this.premiumCurrency =  this.assetData.insuranceDetails.premiumCurrency;
          }
          if (this.assetData.insuranceDetails.reminderBefore != undefined || this.assetData.insuranceDetails.reminderBefore != null) {
            this.reminderBefore =  this.assetData.insuranceDetails.reminderBefore;
          }
          if (this.assetData.insuranceDetails.reminderBeforeUnit != undefined || this.assetData.insuranceDetails.reminderBeforeUnit != null) {
            this.reminderBeforeUnit =  this.assetData.insuranceDetails.reminderBeforeUnit;
          }
          if (this.assetData.insuranceDetails.vendor != undefined || this.assetData.insuranceDetails.vendor != null) {
            this.vendor = this.assetData.insuranceDetails.vendor;
          }                           
          
          if(this.assetData.uploadedPhotos != undefined && this.assetData.uploadedPhotos.length > 0){
            this.assetsImages = this.assetData.uploadedPhotos.map(x => ({
              path: `${this.Asseturl}/${this.assetData.carrierID}/${x}`, 
              name: x,
            }));
          }
          
          if(this.assetData.uploadedDocs != undefined && this.assetData.uploadedDocs.length > 0){
            this.assetsDocs = this.assetData.uploadedDocs.map(x => ({path: `${this.Asseturl}/${this.assetData.carrierID}/${x}`, name: x}));
          }
          this.spinner.hide(); // loader hide
        }
      }, (err) => {});
  }

  fetchDeviceInfo = () => {
    this.apiService
      .getData('devices')
      .subscribe((result: any) => {
        if (result) {
          this.deviceData = result['Items'];
          console.log("this.deviceData", this.deviceData);
        }
      }, (err) => {});
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
  }

  addDevice() {
    delete this.assetData.carrierID;
    delete this.assetData.timeModified;
    console.log('this.assetData', this.assetData);
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
          this.toastr.success('Device removed successfully');
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

  // delete uploaded images and documents 
  delete(type: string,name: string){
    this.apiService.deleteData(`assets/uploadDelete/${this.assetID}/${type}/${name}`).subscribe((result: any) => {
      this.fetchAsset();
    });
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length-1];
    this.pdfSrc = '';
    if(ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url='+val+'&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }
}
