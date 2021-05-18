import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { ListService } from '../../../../services';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';

declare var $: any;

@Component({
  selector: 'app-add-fuel-entry',
  templateUrl: './add-fuel-entry.component.html',
  styleUrls: ['./add-fuel-entry.component.css'],
})
export class AddFuelEntryComponent implements OnInit {
  title = 'Add Fuel Entry';
  Asseturl = this.apiService.AssetUrl;
  public fuelID;
  /********** Form Fields ***********/

  fuelData = {
    unitType: 'vehicle',
    unitID: null,
    billingCurrency: 'CAD',
    fuelUnit: 'litre',
    fuelQtyAmt: 0,
    fuelQty: 0,
    DEFFuelQty: 0,
    DEFFuelQtyAmt: 0,
    subTotal: 0,
    discType: null,
    discAmount: 0,
    amountPaid: 0,
    pricePerUnit: 0,
    fuelDate: '',
    fuelTime: '',
    fuelType: null,
    totalUnits: 0,
    countryCode: null,
    stateCode: null,
    cityName: null,
    reference: '',
    tripID: null,
    vendorID: '',
    paidBy: null,
    taxes: [
      {
      taxType: null,
      taxAmount: 0
      }
    ],
    paymentMode: '',
    fuelCardNumber: '',
    reimburseToDriver: false,
    deductFromPay: false,
    odometer: '',
    description: '',
    uploadedPhotos: [],
    lineItems:  [],
  };
  fetchedUnitID;
  fetchedUnitType;
  // fuelQtyUnit = 'litre';
  // DEFFuelQtyUnit = 'litre';
  // costPerUnit = 0;
  fuelDate: NgbDateStruct;

  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  uploadedFiles = [];
  carrierID;
  countries: any = [];
  states: any = [];
  cities: any = [];
  vendors: any = [];
  vehicles = [];
  assets = [];
  drivers = [];
  reeferArray = [];
  trips = [];
  fuelEntryImages = [];
  fuelDiscounts = [];
  fuelTypes = [];
  fuelTaxes = [];
  image;
  vehicleData: any;
  LastOdometerMiles: number;
  MPG: number;
  costPerMile: number;
  getcurrentDate: any;
  miles: number;
  uploadedPhotos = [];
  existingPhotos = [];
  /******************/

  errors = {};
  fuelForm;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  submitDisabled = false;


  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private location: Location, private toaster: ToastrService,
              private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>, private listService: ListService) {

    this.selectedFileNames = new Map<any, any>();
    const date = new Date();
    this.getcurrentDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {
    this.fetchVehicles();
    this.fetchTrips();
    this.fetchAssets();
    this.fetchDrivers();
    this.fetchFuelTypes();
    this.fetchFuelTaxes();
    this.fetchFuelDiscounts();
    this.listService.fetchVendors();

    this.fuelID = this.route.snapshot.params[`fuelID`];
    if (this.fuelID) {
      this.title = 'Edit Fuel Entry';
      this.fetchFuelEntry();
    } else {
      this.title = 'Add Fuel Entry';
    }
    $(document).ready(() => {
      this.fuelForm = $('#fuelForm').validate();
    });

    this.vendors = this.listService.vendorList;
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  addFuelTaxRow() {
    this.fuelData.taxes.push({
        taxType: null,
        taxAmount: 0
    });
  }
  deleteTaxRow(t) {
    this.fuelData.taxes.splice(t, 1);
  }
  fetchFuelTypes() {
    this.apiService.getData('fuelTypes').subscribe((result: any) => {
      this.fuelTypes = result.Items;
    });
  }
  fetchFuelTaxes() {
    this.apiService.getData('fuelTaxes').subscribe((result: any) => {
      this.fuelTaxes = result.Items;
    });
  }
  fetchFuelDiscounts() {
    this.apiService.getData('fuelDiscounts').subscribe((result: any) => {
      this.fuelDiscounts = result.Items;
    });
  }
  fetchDrivers() {
    this.apiService.getData('drivers').subscribe((result: any) => {
      this.drivers = result.Items;
    });
  }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      result.Items.forEach((e: any) => {
        if (e.assetType == 'reefer') {
          let obj = {
            assetID: e.assetID,
            assetIdentification: e.assetIdentification
          };
          this.reeferArray.push(obj);
        }
      });
    });
  }
  fetchTrips() {
    this.apiService.getData('trips').subscribe((result: any) => {
      this.trips = result.Items;
    });
  }
  getStates(cntryCode) {
    this.fuelData.stateCode = '';
    this.fuelData.cityName = '';
    this.states = CountryStateCity.GetStatesByCountryCode([cntryCode]);
  }
  getCities(stateCode: any, countryCode: any) {
    this.fuelData.cityName = '';
    this.cities = CountryStateCity.GetCitiesByStateCodes(countryCode,stateCode);
 }
  fetchVendors() {
    this.apiService.getData('vendors').subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }
  onChangeHideErrors(fieldname = '') {
    $('[name="' + fieldname + '"]')
      .removeClass('error')
      .next()
      .remove('label');
  }

  fillCountry(countryCode, stateCode) {
    this.states = CountryStateCity.GetStatesByCountryCode([countryCode]);
    this.cities = CountryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
  }
  onChangeUnitType(value: any) {
    if (this.fuelID) {
      if (value !== this.fetchedUnitType) {
        this.fuelData.unitID = '';
        this.fuelData.unitType = value;
      } else {
        this.fuelData.unitID = this.fetchedUnitID;
        this.fuelData.unitType = this.fetchedUnitType;
      }
    } else {
      this.fuelData.unitType = value;
      this.fuelData.unitID = '';
    }

  }
  // changeFuelUnit() {
  //   if (this.fuelQtyUnit === 'gallon') {
  //     this.DEFFuelQtyUnit = 'gallon';
  //   } else {
  //     this.DEFFuelQtyUnit = 'litre';
  //   }
  // }
  changeCurrency(val) {
    this.fuelData.billingCurrency = val;
  }
  addFuelEntry() {
    this.hideErrors();
    this.submitDisabled = true;
    this.fuelData.totalUnits = this.fuelData.fuelQty + this.fuelData.DEFFuelQty;
    // create form data instance
    const formData = new FormData();
    // append photos if any
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }
    // append other fields
    formData.append('data', JSON.stringify(this.fuelData));
    this.apiService.postData('fuelEntries', formData, true).subscribe({
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
              this.submitDisabled = false;
              this.throwErrors();
            },
            error: () => {
              this.submitDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toaster.success('Fuel Entry Added Successfully.');
        this.location.back();
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
    let files = [...event.target.files];

    if (obj === 'uploadedPhotos') {
      this.uploadedPhotos = [];
      for (let i = 0; i < files.length; i++) {
        this.uploadedPhotos.push(files[i])
      }
    }
  }
  /*
  * Fetch Fuel Entry details before updating
 */
  fetchFuelEntry() {
    this.apiService
      .getData('fuelEntries/' + this.fuelID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.fillCountry(result.countryCode, result.stateCode);
        this.fuelData[`fuelID`] = this.fuelID;
        this.fuelData.billingCurrency = result.billingCurrency,
        this.fuelData.unitType = result.unitType;
        this.fuelData.unitID = result.unitID;
        this.fuelData.fuelUnit = result.fuelUnit;
        this.fuelData.fuelQty = result.fuelQty;
        this.fuelData.fuelQtyAmt = +result.fuelQtyAmt;
        this.fuelData.DEFFuelQty = +result.DEFFuelQty;
        this.fuelData.DEFFuelQtyAmt = result.DEFFuelQtyAmt;
        this.fuelData.discType = result.discType;
        this.fuelData.discAmount = result.discAmount;
        this.fuelData.subTotal = result.subTotal;
        this.fuelData.pricePerUnit = result.pricePerUnit;
        this.fuelData.taxes = result.taxes;
        this.fuelData.totalUnits = result.totalUnits;
        this.fuelData.amountPaid = result.amountPaid;
        this.fuelData.fuelDate = result.fuelDate;
        this.fuelData.fuelTime = result.fuelTime;
        this.fuelData.fuelType = result.fuelType;

        this.fuelData.paidBy = result.paidBy;
        this.fuelData.paymentMode = result.paymentMode;
        this.fuelData.fuelCardNumber = result.fuelCardNumber;
        this.fuelData.reference = result.reference;
        this.fuelData.reimburseToDriver = result.reimburseToDriver;
        this.fuelData.deductFromPay = result.deductFromPay;

        this.fuelData.vendorID = result.vendorID;
        this.fuelData.countryCode = result.countryCode;
        this.fuelData.stateCode = result.stateCode;
        this.fuelData.cityName = result.cityName;
        this.fuelData.tripID = result.tripID;
        this.fuelData.odometer = result.odometer;
        this.fuelData.description = result.description;
        this.fuelData.uploadedPhotos = result.uploadedPhotos;
        this.fuelData[`timeCreated`] = result.timeCreated;
        this.existingPhotos = result.uploadedPhotos;
        this.fetchedUnitID = result.unitID;
        this.fetchedUnitType = result.unitType;
        this.fuelData.lineItems = result.lineItems;
        this.fuelData[`createdDate`] = result.createdDate;
        this.fuelData[`createdTime`] = result.createdTime;
        if (result.uploadedPhotos !== undefined && result.uploadedPhotos.length > 0) {
          this.fuelEntryImages = result.uploadedPhotos.map(x => ({ path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x }));
        }
      });
  }
  deleteImage(i: number) {
    this.fuelData.uploadedPhotos.splice(i, 1);
    this.fuelEntryImages.splice(i, 1);
  }
  updateFuelEntry() {
    this.submitDisabled = true;
    this.hideErrors();
    this.fuelData.totalUnits = this.fuelData.fuelQty + this.fuelData.DEFFuelQty;
    this.fuelData.uploadedPhotos = this.existingPhotos;
    this.fuelData.lineItems = this.fuelData.lineItems;
    // create form data instance
    const formData = new FormData();
    // append photos if any
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }
    // append other fields
    formData.append('data', JSON.stringify(this.fuelData));
    this.apiService.putData('fuelEntries', formData, true).subscribe({
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
              this.submitDisabled = false;
              this.throwErrors();
            },
            error: () => {
              this.submitDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toaster.success('Fuel Entry Updated successfully');
        this.cancel();
      },
    });
  }

  // delete uploaded images and documents
  delete(name: string) {
    this.apiService.deleteData(`fuelEntries/uploadDelete/${this.fuelID}/${name}`).subscribe((result: any) => {
      this.fetchFuelEntry();
    });
  }

}
