import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { AwsUploadService } from '../../../../../services/aws-upload.service';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as _ from 'lodash';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-add-fuel-entry',
  templateUrl: './add-fuel-entry.component.html',
  styleUrls: ['./add-fuel-entry.component.css'],
})
export class AddFuelEntryComponent implements OnInit {
  title = 'Add Fuel Entry';
  public entryID;
  /********** Form Fields ***********/
  fuelData = {
    unitType: 'vehicle',
    currency: 'USD',
    fuelQtyAmt: 0,
    fuelQty: 0,
    DEFFuelQty: 0,
    DEFFuelQtyAmt: 0,
    totalAmount: 0,
    discount: 0,
    amountPaid: 0,
    costPerGallon: 0,
    fuelDate: '',
    totalGallons: 0,
    countryID: '',
    stateID: '',
    reimburseToDriver: false,
    deductFromPay: false,
    additionalDetails: {
      avgGVW: '',
      odometer: '',
      description: '',
      uploadedPhotos: [],
    }
  };
  fuelQtyUnit = 'gallon';
  DEFFuelQtyUnit = 'gallon';
  costPerUnit = 0;
  fuelDate: NgbDateStruct;

  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  uploadedFiles = [];
  carrierID;
  countries = [];
  states = [];
  cities = [];
  vendors = [];
  vehicles = [];
  assets = [];
  reeferArray = [];
  trips = [];
  fuelEntryImages = [];
  image;
  vehicleData: any;
  LastOdometerMiles: number;
  MPG: number;
  costPerMile: number;
  miles: number;
  /******************/

  errors = {};
  fuelForm;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';



  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService, private domSanitizer: DomSanitizer,
    private location: Location,
    private awsUS: AwsUploadService, private toaster: ToastrService,
    private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) {
    this.selectedFileNames = new Map<any, any>();
  }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {
    this.fetchVehicles();
    this.fetchVendors();
    this.fetchTrips();
    this.fetchCountries();
    this.fetchAssets();
    this.entryID = this.route.snapshot.params[`entryID`];
    if (this.entryID) {
      this.title = 'Edit Fuel Entry';
      this.fetchFuelEntry();
    } else {
      this.title = 'Add Fuel Entry';
    }
    $(document).ready(() => {
      this.fuelForm = $('#fuelForm').validate();
    });
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }
  getStates() {
    this.apiService.getData('states/country/' + this.fuelData.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
  getCities() {
    this.apiService.getData('cities/state/' + this.fuelData.stateID)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
      for (let i = 0; i < result.Items.length; i++) {
        if (result.Items[i].assetDetails.assetType === 'CZ') {
          this.reeferArray.push(this.assets[i]);
        }
      }
    });
  }
  fetchTrips() {
    this.apiService.getData('trips').subscribe((result: any) => {
      this.trips = result.Items;
    });
  }
  fetchVendors() {
    this.apiService.getData('vendors').subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }
  fillCountry() {
    this.apiService
      .getData('states/' + this.fuelData.stateID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.fuelData.countryID = result.countryID;
      });

    setTimeout(() => {
      this.getStates();
    }, 2000);
    setTimeout(() => {
      this.getCities();
    }, 2000);
  }


  onChangeUnitType(value: any) {
    this.fuelData.unitType = value;
    this.fuelData.fuelQtyAmt = 0;
    this.fuelData.fuelQty = 0;
    this.calculate();
    if (isNaN(this.costPerUnit)) {
      this.costPerUnit = 0;
    }
  }
  changeFuelUnit() {
    if (this.fuelQtyUnit === 'gallon') {
      this.DEFFuelQtyUnit = 'gallon';
    } else {
      this.DEFFuelQtyUnit = 'litre';
    }
  }
  changeCurrency(val) {
    this.fuelData.currency = val;
  }
  calculate() {
    this.fuelData.totalAmount = 0;
    this.costPerUnit = 0;
    this.fuelData.totalAmount = Number(this.fuelData.fuelQtyAmt) + Number(this.fuelData.DEFFuelQtyAmt);
    let units = Number(this.fuelData.fuelQty) + Number(this.fuelData.DEFFuelQty);
    this.fuelData.amountPaid = this.fuelData.totalAmount - this.fuelData.discount;
    const test = (this.fuelData.amountPaid / units);
    this.costPerUnit = +(test.toFixed(2));
  }
  addFuelEntry() {
    // if (this.fileName === '') {
    //   this.imageError = 'Please Choose Image To Upload';
    //   return;
    // }
    this.hideErrors();
    if (this.fuelQtyUnit === 'gallon') {
      this.fuelData.fuelQty = this.fuelData.fuelQty;
      this.fuelData.DEFFuelQty = this.fuelData.DEFFuelQty;
      this.fuelData.totalGallons = this.fuelData.fuelQty + this.fuelData.DEFFuelQty;
      this.fuelData.costPerGallon = +((this.fuelData.amountPaid / this.fuelData.totalGallons).toFixed(2));
    }
    else {
      this.fuelData.fuelQty = +((this.fuelData.fuelQty / 3.785).toFixed(2));
      this.fuelData.DEFFuelQty = +((this.fuelData.DEFFuelQty / 3.785).toFixed(2));
      this.fuelData.totalGallons = this.fuelData.fuelQty + this.fuelData.DEFFuelQty;
      this.fuelData.costPerGallon = +((this.fuelData.amountPaid / this.fuelData.totalGallons).toFixed(2));
    }

    if (this.fuelData.fuelDate !== '') {
      //date in Y-m-d format 
      this.fuelData.fuelDate = this.fuelData.fuelDate.split('-').reverse().join('-');
    }
    this.apiService.postData('fuelEntries', this.fuelData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        // this.uploadFiles(); // upload selected files to bucket
        this.toaster.success('Fuel Entry Added successfully');
        this.router.navigateByUrl('/fleet/expenses/fuel/list');
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
  /*
  * Selecting files before uploading
  */
  selectDocuments(event, obj) {
    this.selectedFiles = event.target.files;
    if (obj === 'uploadedPhotos') {
      for (let i = 0; i <= this.selectedFiles.item.length; i++) {
        const randomFileGenerate = this.selectedFiles[i].name.split('.');
        const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;

        this.selectedFileNames.set(fileName, this.selectedFiles[i]);
        this.fuelData.additionalDetails.uploadedPhotos.push(fileName);
      }
    }
  }
  /*
   * Uploading files which selected
   */
  uploadFiles = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    this.selectedFileNames.forEach((fileData: any, fileName: string) => {
      this.awsUS.uploadFile(this.carrierID, fileName, fileData);
    });
  }

  /*
 * Fetch Fuel Entry details before updating
*/
  fetchFuelEntry() {
    this.apiService
      .getData('fuelEntries/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.fuelData[`entryID`] = this.entryID;
        this.fuelData[`currency`] = result.currency,
          this.fuelData[`unitType`] = result.unitType;
        this.fuelData[`unitID`] = result.unitID;
        this.fuelData[`fuelQty`] = result.fuelQty;
        this.fuelData[`fuelQtyAmt`] = +result.fuelQtyAmt;
        this.fuelData[`DEFFuelQty`] = +result.DEFFuelQty;
        this.fuelData[`DEFFuelQtyUnit`] = result.fuelQtyUnit;
        this.fuelData[`DEFFuelQtyAmt`] = result.DEFFuelQtyAmt;
        this.fuelData[`discount`] = result.discount;
        this.fuelData[`totalAmount`] = result.totalAmount;
        this.fuelData[`costPerGallon`] = result.costPerGallon;
        this.costPerUnit = result.costPerGallon;
        this.fuelData[`totalGallons`] = result.totalGallons;
        this.fuelData[`amountPaid`] = result.amountPaid;
        this.fuelData[`fuelDate`] = result.fuelDate.split('-').reverse().join('-');
        this.fuelData[`fuelTime`] = result.fuelTime;
        this.fuelData[`fuelType`] = result.fuelType;

        this.fuelData[`paidBy`] = result.paidBy;
        this.fuelData[`paymentMode`] = result.paymentMode;
        this.fuelData[`reference`] = result.reference;
        this.fuelData[`reimburseToDriver`] = result.reimburseToDriver;
        this.fuelData[`deductFromPay`] = result.deductFromPay;

        this.fuelData[`vendorID`] = result.vendorID;
        this.fuelData[`countryID`] = result.countryID;
        this.fuelData[`stateID`] = result.stateID;
        this.fuelData[`cityID`] = result.cityID;
        this.fuelData[`tripID`] = result.tripID;

        this.fuelData[`additionalDetails`][`avgGVW`] = result.additionalDetails.avgGVW;
        this.fuelData[`additionalDetails`][`odometer`] = result.additionalDetails.odometer;
        this.fuelData[`additionalDetails`][`description`] = result.additionalDetails.description;
        this.fuelData[`additionalDetails`][`uploadedPhotos`] = result.additionalDetails.uploadedPhotos;
        setTimeout(() => {
          this.fillCountry();
        }, 2000);
      });
  }
  getImages = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    for (let i = 0; i < this.fuelData.additionalDetails.uploadedPhotos.length; i++) {
      this.image = this.domSanitizer.bypassSecurityTrustUrl(await this.awsUS.getFiles
        (this.carrierID, this.fuelData.additionalDetails.uploadedPhotos[i]));
      this.fuelEntryImages.push(this.image);
    }
  }
  deleteImage(i: number) {
    this.carrierID = this.apiService.getCarrierID();
    this.awsUS.deleteFile(this.carrierID, this.fuelData.additionalDetails.uploadedPhotos[i]);
    this.fuelData.additionalDetails.uploadedPhotos.splice(i, 1);
    this.fuelEntryImages.splice(i, 1);
    // this.apiService.getData('fuelEntries//updatePhotos/' + this.entryID + '/' + this.additionalDetails.uploadedPhotos).subscribe((result: any) => {
    //   this.toastr.success('Image Deleted Successfully!');
    // });
  }
  updateFuelEntry() {

    // if (this.fileName === '') {
    //   this.imageError = 'Please Choose Image To Upload';
    //   return;
    // }

    this.hideErrors();
    if (this.fuelQtyUnit === 'gallon') {
      this.fuelData.fuelQty = this.fuelData.fuelQty;
      this.fuelData.DEFFuelQty = this.fuelData.DEFFuelQty;
      this.fuelData.totalGallons = this.fuelData.fuelQty + this.fuelData.DEFFuelQty;
      this.fuelData.costPerGallon = this.fuelData.amountPaid / this.fuelData.totalGallons;
    }
    else {
      this.fuelData.fuelQty = +((this.fuelData.fuelQty / 3.785).toFixed(2));
      this.fuelData.DEFFuelQty = +((this.fuelData.DEFFuelQty / 3.785).toFixed(2));
      this.fuelData.totalGallons = this.fuelData.fuelQty + this.fuelData.DEFFuelQty;
      this.fuelData.costPerGallon = +((this.fuelData.amountPaid / this.fuelData.totalGallons).toFixed(2));
    }

    if (this.fuelData.fuelDate !== '') {
      //date in Y-m-d format 
      this.fuelData.fuelDate = this.fuelData.fuelDate.split('-').reverse().join('-');
    }
    this.apiService.putData('fuelEntries', this.fuelData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        //  this.uploadFiles(); // upload selected files to bucket
        this.toaster.success('Fuel Entry Updated successfully');
        // this.router.navigateByUrl('/fleet/expenses/fuel/list');
      },
    });
  }



}
