import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HereMapService } from '../../../../services';
import {ApiService} from '../../../../services';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import {environment} from '../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.css']
})
export class AssetDetailComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  environment = environment.isFeatureEnabled;
  platform: any;
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
  licenceCountryID: string;
  groupID: string;
  year: string;
  manufacturer: string;
  model: string;
  length: string;
  lengthUnit: string;
  height: string;
  axle: string;
  GAWR: string;
  GAWR_Unit: string;
  GVWR: string;
  GVWR_Unit: string;
  ownerShip: string;
  remarks: string;
  startDate: string;
  status: string;
  annualSafetyDate: string;

  dateOfIssue: string;
  dateOfExpiry: string;
  premiumAmount: string;
  premiumCurrency: string;
  reminderBefore: string;
  reminderBeforeUnit: string;
  vendor: string;

  devices: any;
  allDevices = [];

  ACEID: string;
  ACIID: string;
  errors = {};

  statesObject: any = {};
  assetObjects: any = {};
  vendorObjects: any = {};
  groupsObjects: any = {};
  countriesObject: any = {};

  uploadedDocs = [];
  uploadedPhotos = [];
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');

  messageStatus = true;
  ownerOperatorName = '';
  inspectionFormName = '';
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
    this.hereMap.mapSetAPI();
    this.hereMap.mapInit(); // Initialize map
    this.assetID = this.route.snapshot.params[`assetID`]; // get asset Id from URL
    this.fetchAsset();
    this.fetchDeviceInfo();
    this.fetchAllStatesIDs();
    this.fetchManufacturesByIDs();
    this.fetchModalsByIDs();
   // this.fetchAssetsTypes();
    this.fetchVendorsByIDs();
    this.fetchGroups();
    this.fetchAllCountriesIDs();
  }

  fetchManufacturesByIDs() {
    this.apiService.getData('assetManufacturers/get/list').subscribe((result: any) => {
      this.manufacturersObjects = result;
    });
  }

  fetchModalsByIDs() {
    this.apiService.getData('assetModels/get/list').subscribe((result: any) => {
      this.modelsObjects = result;
    });
  }

  fetchVendorsByIDs() {
    this.apiService.getData('vendors/get/list').subscribe((result: any) => {
      this.vendorObjects = result;
    });
  }

  /**
   * fetch Asset data
   */
  async fetchAsset() {
    this.spinner.show(); // loader init
    this.apiService
      .getData(`assets/${this.assetID}`)
      .subscribe((res: any) => {
        if (res) {
          let result = res.Items[0];
          // if (!result.hasOwnProperty('devices')) {
          //   result['devices'] = [];
          // }

          if(result.assetDetails.ownerShip == 'Owner Operator'){
            this.apiService.getData('ownerOperators/'+ result.assetDetails.ownerOperator).subscribe((result: any) => {
              let res = result.Items[0];
              this.ownerOperatorName = res.firstName + ' ' + res.lastName;
            });
          }

          if(result.inspectionFormID != '' && result.inspectionFormID != undefined){
            this.apiService.getData('inspectionForms/'+result.inspectionFormID).subscribe((result: any) => {
              let res = result.Items[0];
              this.inspectionFormName = res.inspectionFormName;
            });
          }

          // this.fetchDevicesByID();
          this.assetIdentification = result.assetIdentification;
          this.VIN = result.VIN;
          this.assetType =  result.assetType;
          this.groupID =  result.groupID;
          this.startDate =  result.startDate;
          this.status =  result.status;
          this.annualSafetyDate =  result.assetDetails.annualSafetyDate;
          this.licencePlateNumber =  result.assetDetails.licencePlateNumber;
          this.licenceCountryID = result.assetDetails.licenceCountryID;
          this.licenceStateID =  result.assetDetails.licenceStateID;
          this.year =  result.assetDetails.year;
          this.manufacturer =  result.assetDetails.manufacturer;
          this.model =  result.assetDetails.model;
          this.length = result.assetDetails.length + ' ' + result.assetDetails.lengthUnit;
          this.height = result.assetDetails.height + ' ' + result.assetDetails.heightUnit;
          this.lengthUnit = result.assetDetails.lengthUnit;
          this.axle = result.assetDetails.axle;
          this.GAWR = result.assetDetails.GAWR;
          this.GAWR_Unit = result.assetDetails.GAWR_Unit;
          this.GVWR = result.assetDetails.GVWR;
          this.GVWR_Unit = result.assetDetails.GVWR_Unit;
          this.ownerShip = result.assetDetails.ownerShip;
          this.remarks = result.assetDetails.remarks;
          this.dateOfIssue = result.insuranceDetails.dateOfIssue;
          this.dateOfExpiry = result.insuranceDetails.dateOfExpiry;
          this.premiumAmount = result.insuranceDetails.premiumAmount;
          this.premiumCurrency = result.insuranceDetails.premiumCurrency;
          this.reminderBefore = result.insuranceDetails.reminderBefore;
          this.reminderBeforeUnit = result.insuranceDetails.reminderBeforeUnit;
          this.vendor = result.insuranceDetails.vendor;

          this.ACEID = result.crossBorderDetails.ACE_ID;
          this.ACIID = result.crossBorderDetails.ACI_ID;

          if(result.uploadedPhotos != undefined && result.uploadedPhotos.length > 0){
            this.assetsImages = result.uploadedPhotos.map(x => ({
              path: `${this.Asseturl}/${result.carrierID}/${x}`,
              name: x,
            }));
          }

          if(result.uploadedDocs != undefined && result.uploadedDocs.length > 0){
            this.assetsDocs = result.uploadedDocs.map(x => ({path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x}));
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
          this.deviceData = result[`Items`];
        }
      }, (err) => {});
  }

  fetchAllStatesIDs() {
    this.apiService.getData('states/get/list')
      .subscribe((result: any) => {
        this.statesObject = result;
      });
  }
  fetchAllCountriesIDs() {
    this.apiService.getData('countries/get/list')
      .subscribe((result: any) => {
        this.countriesObject = result;
      });
  }
  fetchGroups() {
    this.apiService.getData('groups/get/list')
      .subscribe((result: any) => {
        this.groupsObjects = result;
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
      this.toastr.error(`Device already selected`);
    }
    this.fetchDevicesByID();
  }

  addDevice() {
    delete this.assetData.carrierID;
    delete this.assetData.timeModified;
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
    let ext = pieces[pieces.length - 1];
    this.pdfSrc = this.domSanitizer.bypassSecurityTrustUrl('');
    if(ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }
}
