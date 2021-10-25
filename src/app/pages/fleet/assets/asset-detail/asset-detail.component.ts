import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import * as moment from 'moment';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import Constants from 'src/app/pages/manage/constants';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../../../services';


declare var $: any;

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.css']
})
export class AssetDetailComponent implements OnInit {
  // google maps config 
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 10;
  ColumnMode = ColumnMode;

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
  noRecordMsg: string = Constants.NO_RECORDS_FOUND;

  assetIdentification: string;
  VIN: string;
  assetType: string;
  licencePlateNumber: string;
  licenceStateName: string;
  licenceCountryName: string;
  groupID: string;
  year: string;
  manufacturer: string;
  model: string;
  length: string;
  lengthUnit: string;
  height: string;
  heightUnit: string;
  axle: string;
  GAWR: string;
  GAWR_Unit: string;
  GVWR: string;
  GVWR_Unit: string;
  ownerShip: string;
  remarks: string;
  rentCompany: string;
  startDate: string;
  currentStatus: string;
  annualSafetyDate: string;

  dateOfIssue: string;
  dateOfExpiry: string;
  premiumAmount: string;
  premiumCurrency: string;
  reminderBefore: string;
  reminderBeforeUnit: string;
  vendor: string;
  public assetDataDetail: any = [];
  devices: any;
  allDevices = [];

  pDocs = [];
  lDocs = [];

  purchase = {
    purchaseVendorID: '',
    warrantyExpirationDate: '',
    purchasePrice: '',
    purchasePriceCurrency: '',
    warrantyExpirationMeter: '',
    purchaseDate: '',
    purchaseComments: '',
    purchaseOdometer: '',
    gstInc: false,
  };
  loan = {
    loanVendorID: '',
    amountOfLoan: '',
    amountOfLoanCurrency: '',
    aspiration: '',
    annualPercentageRate: '',
    downPayment: '',
    downPaymentCurrency: '',
    dateOfLoan: '',
    monthlyPayment: '',
    monthlyPaymentCurrency: '',
    firstPaymentDate: '',
    numberOfPayments: '',
    loadEndDate: '',
    accountNumber: '',
    generateExpenses: '',
    notes: '',
    loanDueDate: '',
    lReminder: false,
    gstInc: false,
  };

  ACEID: string;
  ACIID: string;
  errors = {};
  assetObjects: any = {};
  groupsObjects: any = {};
  contactsObjects: any = {};
  uploadedDocs = [];
  existingDocs = [];
  uploadedPhotos = [];
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');

  messageStatus = true;
  ownerOperatorName = '';
  inspectionFormName = '';
  inspectionForms = {
    inspectionFormName: '',
    parameters: [],
    isDefaultInspectionType: '',
    inspectionType: ''
  };
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
    {
      data: [12, 15, 17, 13, 15, 12, 18, 12, 18, 13, 10, 14, 12],
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


  /**
   * Get location of the devices attached to asset variable declarations
   */
  rows = [];
  cols: any;
  loadingIndicator = true;
  reorderable = false;
  swapColumns = false;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  SelectionType = SelectionType;
  selected = [];
  noDevices = false;

  manufacturersObjects: any = {};
  modelsObjects: any = {};

  constructor(private toastr: ToastrService,
    private domSanitizer: DomSanitizer, private apiService: ApiService,
    private route: ActivatedRoute, private spinner: NgxSpinnerService,
    private countryStateCity: CountryStateCityService) { }

  ngOnInit() {

    this.assetID = this.route.snapshot.params[`assetID`]; // get asset Id from URL
    this.fetchAsset();
    this.fetchDeviceInfo();
    // this.fetchManufacturesByIDs();
    // this.fetchModalsByIDs();
    this.fetchGroups();
    this.fetchContactsByIDs();


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
  fetchContactsByIDs() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.contactsObjects = result;
    });
  }
  /**
   * fetch Asset data
   */
  async fetchAsset() {
    this.spinner.show(); // loader init
    this.apiService
      .getData(`assets/${this.assetID}`)
      .subscribe(async (res: any) => {
        if (res) {
          let result = res.Items[0];
          this.assetDataDetail = res.Items[0];
          // if (!result.hasOwnProperty('devices')) {
          //   result['devices'] = [];
          // }
          result.assetType = result.assetType.replace("_", " ");
          if (result.inspectionFormID !== '' && result.inspectionFormID !== undefined) {
            this.apiService.getData('inspectionForms/' + result.inspectionFormID).subscribe((result: any) => {
              let res = result.Items[0];
              this.inspectionForms = res;
              this.inspectionFormName = res.inspectionFormName;
            });
          }
          this.ownerOperatorName = result.assetDetails.ownerOperator;
          // this.fetchDevicesByID();
          this.assetIdentification = result.assetIdentification;
          this.VIN = result.VIN;
          this.assetType = result.assetType;
          this.groupID = result.groupID;
          this.startDate = result.startDate;
          this.currentStatus = result.currentStatus;
          this.annualSafetyDate = result.assetDetails.annualSafetyDate;
          this.licencePlateNumber = result.assetDetails.licencePlateNumber;
          this.licenceCountryName = await this.countryStateCity.GetSpecificCountryNameByCode(result.assetDetails.licenceCountryCode);
          this.licenceStateName = await this.countryStateCity.GetStateNameFromCode(result.assetDetails.licenceStateCode, result.assetDetails.licenceCountryCode);
          this.year = result.assetDetails.year;
          this.manufacturer = result.assetDetails.manufacturer;
          this.model = result.assetDetails.model;
          this.length = result.assetDetails.length;
          this.height = result.assetDetails.height;
          this.lengthUnit = result.assetDetails.lengthUnit;
          this.heightUnit = result.assetDetails.heightUnit;
          this.axle = result.assetDetails.axle;
          this.GAWR = result.assetDetails.GAWR;
          this.GAWR_Unit = result.assetDetails.GAWR_Unit;
          this.GVWR = result.assetDetails.GVWR;
          this.GVWR_Unit = result.assetDetails.GVWR_Unit;
          this.ownerShip = result.assetDetails.ownerShip;
          this.rentCompany = result.assetDetails.rentCompany;
          this.remarks = result.assetDetails.remarks;
          this.dateOfIssue = result.insuranceDetails.dateOfIssue;
          this.dateOfExpiry = result.insuranceDetails.dateOfExpiry;
          this.premiumAmount = result.insuranceDetails.premiumAmount;
          this.premiumCurrency = result.insuranceDetails.premiumCurrency;
          this.reminderBefore = result.insuranceDetails.reminderBefore;
          this.reminderBeforeUnit = result.insuranceDetails.reminderBeforeUnit;
          this.vendor = result.insuranceDetails.vendor;
          console.log('result', result);
          this.purchase = {
            purchaseVendorID: result.purchase.purchaseVendorID,
            warrantyExpirationDate: result.purchase.warrantyExpirationDate,
            purchasePrice: result.purchase.purchasePrice,
            purchasePriceCurrency: result.purchase.purchasePriceCurrency,
            warrantyExpirationMeter: result.purchase.warrantyExpirationMeter,
            purchaseDate: result.purchase.purchaseDate,
            purchaseComments: result.purchase.purchaseComments,
            purchaseOdometer: result.purchase.purchaseOdometer,
            gstInc: result.purchase.gstInc
          };
          this.loan = {
            loanVendorID: result.loan.loanVendorID,
            amountOfLoan: result.loan.amountOfLoan,
            amountOfLoanCurrency: result.loan.amountOfLoanCurrency,
            aspiration: result.loan.aspiration,
            annualPercentageRate: result.loan.annualPercentageRate,
            downPayment: result.loan.downPayment,
            downPaymentCurrency: result.loan.downPaymentCurrency,
            monthlyPaymentCurrency: result.loan.monthlyPaymentCurrency,
            dateOfLoan: result.loan.dateOfLoan,
            monthlyPayment: result.loan.monthlyPayment,
            firstPaymentDate: result.loan.firstPaymentDate,
            numberOfPayments: result.loan.numberOfPayments,
            loadEndDate: result.loan.loadEndDate,
            accountNumber: result.loan.accountNumber,
            generateExpenses: result.loan.generateExpenses,
            loanDueDate: result.loan.loanDueDate,
            lReminder: result.loan.lReminder,
            gstInc: result.loan.gstInc,
            notes: result.loan.notes,
          };

          this.ACEID = result.crossBorderDetails.ACE_ID;
          this.ACIID = result.crossBorderDetails.ACI_ID;

          if (result.uploadedPhotos != undefined && result.uploadedPhotos.length > 0) {
            this.assetsImages = result.uploadedPhotos.map(x => ({
              path: `${this.Asseturl}/${result.carrierID}/${x}`,
              name: x,
            }));
          }
          if (
            result.purchaseDocs != undefined &&
            result.purchaseDocs.length > 0
          ) {
            this.pDocs = [];
            result.purchaseDocs.map((x) => {
              let obj = {
                name: x,
                path: `${this.Asseturl}/${result.carrierID}/${x}`
              }
              this.pDocs.push(obj);
            });
          }


          if (
            result.loanDocs != undefined &&
            result.loanDocs.length > 0
          ) {
            this.lDocs = [];
            result.loanDocs.map((x) => {
              let obj = {
                name: x,
                path: `${this.Asseturl}/${result.carrierID}/${x}`
              }
              this.lDocs.push(obj);
            });
          }

          if (result.uploadedDocs != undefined && result.uploadedDocs.length > 0) {
            this.assetsDocs = result.uploadedDocs.map(x => ({ path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x }));
          }
          this.spinner.hide(); // loader hide
        }

        // Load devices information 
        this.getDeviceEventsFor24Hours(this.assetIdentification);
      }, (err) => { });
  }

  fetchDeviceInfo = () => {
    this.apiService
      .getData('devices')
      .subscribe((result: any) => {
        if (result) {
          this.deviceData = result[`Items`];
        }
      }, (err) => { });
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
      this.assetData.devices.forEach(async element => {
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
  // delete(type: string, name: string, index: any) {

  //   delete this.assetDataDetail.carrierID;
  //   delete this.assetDataDetail.timeModified;
  //   delete this.assetDataDetail.isDelActiveSK;
  //   delete this.assetDataDetail.assetSK;
  //   delete this.assetDataDetail.carrierID;
  //   delete this.assetDataDetail.timeModified;
  //   if (type === 'doc') {
  //     this.assetsDocs.splice(index, 1);
  //     this.assetDataDetail.uploadedDocs.splice(index, 1);
  //     this.deleteUploadedFile(type, name);
  //     try {
  //       const formData = new FormData();
  //       formData.append('data', JSON.stringify(this.assetDataDetail));
  //       this.apiService.putData('assets', formData, true).subscribe({
  //         complete: () => { this.fetchAsset(); }
  //       });
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } else {
  //     this.assetsImages.splice(index, 1);
  //     this.assetDataDetail.uploadedPhotos.splice(index, 1);
  //     this.deleteUploadedFile(type, name);
  //     try {
  //       const formData = new FormData();
  //       formData.append('data', JSON.stringify(this.assetDataDetail));
  //       this.apiService.putData('assets', formData, true).subscribe({
  //         complete: () => { this.fetchAsset(); }
  //       });
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // }
  deleteDocument(type: string, name: string) { // delete from aws
    this.apiService.deleteData(`assets/uploadDelete/${this.assetID}/${type}/${name}`).subscribe((result: any) => {
      if (type == 'doc') {
        this.assetsDocs = [];
        this.uploadedDocs = result.Attributes.uploadedDocs;
        this.existingDocs = result.Attributes.uploadedDocs;
        result.Attributes.uploadedDocs.map((x) => {
          let obj = {
            name: x,
            path: `${this.Asseturl}/${result.carrierID}/${x}`
          }
          this.assetsDocs.push(obj);
        })
      } else if (type == 'loan') {
        this.lDocs = [];
        console.log('loan')
        this.uploadedDocs = result.Attributes.loanDocs;
        this.existingDocs = result.Attributes.loanDocs;
        result.Attributes.loanDocs.map((x) => {
          let obj = {
            name: x,
            path: `${this.Asseturl}/${result.carrierID}/${x}`
          }
          this.lDocs.push(obj);
        })
      } else {
        this.pDocs = [];
        this.uploadedDocs = result.Attributes.purchaseDocs;
        this.existingDocs = result.Attributes.purchaseDocs;
        result.Attributes.purchaseDocs.map((x) => {
          let obj = {
            name: x,
            path: `${this.Asseturl}/${result.carrierID}/${x}`
          }
          this.pDocs.push(obj);
        })
      }
    });
  }
  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length - 1];
    this.pdfSrc = this.domSanitizer.bypassSecurityTrustUrl('');
    if (ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  //Google Maps methods

  /**
   * Move to center
   * @param event mouse event
   */
  moveMap(event: google.maps.MapMouseEvent) {
    this.center = (event.latLng.toJSON());
  }



  /**
   * Get Devices data if attached for last 24 hours
   */
  async getDeviceEventsFor24Hours(assetIdentification: string) {

    this.apiService.getData(`assetTrackers/getLast24HoursData/${assetIdentification}`).subscribe((data) => {

      if (data && data.length > 0) {
        for (const item of data) {
          const stillUtc = moment.utc(item.time).toDate();
          const localTime = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
          item.time = localTime;
        }
        this.rows = data;
        this.loadingIndicator = false;
        const cords = data[0].cords.split(',');
        console.log(cords);

        this.center = { lng: parseFloat(cords[0]), lat: parseFloat(cords[1]) };
        this.markerPositions.push({ lng: parseFloat(cords[0]), lat: parseFloat(cords[1]) });
      } else {
        this.noDevices = true;
      }

    });
  }

  /** when row is clicked updated map */
  onLocationRowSelected({ selected }) {
    console.log('Select Event', selected, this.selected);
    for (const sel of this.selected) {
      console.log(sel.cords);
      this.updatePosition(sel.cords);
    }
  }

  /**Updates marker position on map */
  updatePosition(cordsInput: any) {
    const cords = cordsInput.split(',');
    console.log(cords);
    this.center = { lng: parseFloat(cords[0]), lat: parseFloat(cords[1]) };
    this.markerPositions = [];
    this.markerPositions.push({ lng: parseFloat(cords[0]), lat: parseFloat(cords[1]) });


  }
}
