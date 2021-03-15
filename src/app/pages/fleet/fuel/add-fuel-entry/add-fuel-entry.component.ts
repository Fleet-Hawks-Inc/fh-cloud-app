import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { ListService } from '../../../../services';

declare var $: any;

@Component({
  selector: 'app-add-fuel-entry',
  templateUrl: './add-fuel-entry.component.html',
  styleUrls: ['./add-fuel-entry.component.css'],
})
export class AddFuelEntryComponent implements OnInit {
  title = 'Add Fuel Entry';
  Asseturl = this.apiService.AssetUrl;
  public entryID;
  /********** Form Fields ***********/

  fuelData = {
    unitType: 'vehicle',
    unitID: '',
    billingCurrency: 'CAD',
    fuelQtyAmt: 0,
    fuelQty: 0,
    DEFFuelQty: 0,
    DEFFuelQtyAmt: 0,
    totalAmount: 0,
    discType: '',
    discAmount: 0,
    amountPaid: 0,
    pricePerUnit: 0,
    fuelDate: '',
    fuelTime: '',
    fuelType: '',
    totalLitres: 0,
    countryID: '',
    stateID: '',
    cityID: '',
    reference: '',
    tripID: '',
    vendorID : '',
    paidBy: '',
    taxes : [
      {
      taxType: '',
      taxAmount: 0
      }
    ],
    paymentMode: '',
    fuelCardNumber: '',
    reimburseToDriver: false,
    deductFromPay: false,
     // avgGVW: '',
      odometer: 0,
      description: '',
       uploadedPhotos: [],

  };

  fuelQtyUnit = 'litre';
  DEFFuelQtyUnit = 'litre';
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



  constructor(private apiService: ApiService,
              private router: Router,
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
    this.listService.fetchCountries();
    this.listService.fetchStates();
    this.listService.fetchCities();

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

    this.vendors = this.listService.vendorList;
    this.states = this.listService.stateList;
    this.cities = this.listService.cityList;
    this.countries = this.listService.countryList;
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
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  addFuelTaxRow() {
    this.fuelData.taxes.push({
        taxType: '',
        taxAmount: 0
    });
  }
  deleteTaxRow(t){
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
  }


  onChangeUnitType(value: any) {
    this.fuelData.unitType = value;
    this.fuelData.fuelQtyAmt = 0;
    this.fuelData.fuelQty = 0;
    this.calculate();
    if (isNaN(this.fuelData.pricePerUnit)) {
      this.fuelData.pricePerUnit = 0;
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
    this.fuelData.billingCurrency = val;
  }
  calculate() {
    this.fuelData.totalAmount = 0;
    this.fuelData.pricePerUnit = 0;
    this.fuelData.totalAmount = Number(this.fuelData.fuelQtyAmt) + Number(this.fuelData.DEFFuelQtyAmt);
    const units = Number(this.fuelData.fuelQty) + Number(this.fuelData.DEFFuelQty);
    this.fuelData.amountPaid = this.fuelData.totalAmount - this.fuelData.discAmount;
    this.fuelData.pricePerUnit = (this.fuelData.amountPaid / units);

  }
  addFuelEntry() {
    // if (this.fileName === '') {
    //   this.imageError = 'Please Choose Image To Upload';
    //   return;
    // }
    this.hideErrors();
    if (this.fuelQtyUnit === 'litre') {
      this.fuelData.fuelQty = this.fuelData.fuelQty;
      this.fuelData.DEFFuelQty = this.fuelData.DEFFuelQty;
      this.fuelData.totalLitres = this.fuelData.fuelQty + this.fuelData.DEFFuelQty;
      this.fuelData.pricePerUnit = +((this.fuelData.amountPaid / this.fuelData.totalLitres).toFixed(2));
    } else {
      this.fuelData.fuelQty = +((this.fuelData.fuelQty * 3.785).toFixed(2));
      this.fuelData.DEFFuelQty = +((this.fuelData.DEFFuelQty * 3.785).toFixed(2));
      this.fuelData.totalLitres = this.fuelData.fuelQty + this.fuelData.DEFFuelQty;
      this.fuelData.pricePerUnit = +((this.fuelData.amountPaid / this.fuelData.totalLitres).toFixed(2));
    }
      // create form data instance
    const formData = new FormData();
      // append photos if any
      for(let i = 0; i < this.uploadedPhotos.length; i++){
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
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
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
      .getData('fuelEntries/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.fuelData[`entryID`] = this.entryID;
        this.fuelData.billingCurrency = result.billingCurrency,
        this.fuelData.unitType = result.unitType;
        this.fuelData.unitID = result.unitID;
        this.fuelData.fuelQty = result.fuelQty;
        this.fuelData.fuelQtyAmt = +result.fuelQtyAmt;
        this.fuelData.DEFFuelQty = +result.DEFFuelQty;
        this.fuelData.DEFFuelQtyAmt = result.DEFFuelQtyAmt;
        this.fuelData.discType = result.discType;
        this.fuelData.discAmount = result.discAmount;
        this.fuelData.totalAmount = result.totalAmount;
        this.fuelData.pricePerUnit = result.pricePerUnit;
        this.fuelData.taxes = result.taxes;
        this.fuelData.totalLitres = result.totalLitres;
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
        this.fuelData.countryID = result.countryID;
        this.fuelData.stateID = result.stateID;
        this.fuelData.cityID = result.cityID;
        this.fuelData.tripID = result.tripID;
        this.fuelData.odometer = result.odometer;
        this.fuelData.description = result.description;
        this.fuelData.uploadedPhotos = result.uploadedPhotos;
        this.fuelData[`timeCreated`] = result.timeCreated;
        this.existingPhotos = result.uploadedPhotos;
        if(result.uploadedPhotos !== undefined && result.uploadedPhotos.length > 0){
          this.fuelEntryImages = result.uploadedPhotos.map(x => ({path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x}));
        }
        setTimeout(() => {
          this.fillCountry();
        }, 2000);
      });
  }
   deleteImage(i: number) {
     this.fuelData.uploadedPhotos.splice(i, 1);
     this.fuelEntryImages.splice(i, 1);
 }
  updateFuelEntry() {

    this.hideErrors();
    if (this.fuelQtyUnit === 'gallon') {
      this.fuelData.fuelQty = this.fuelData.fuelQty;
      this.fuelData.DEFFuelQty = this.fuelData.DEFFuelQty;
      this.fuelData.totalLitres = this.fuelData.fuelQty + this.fuelData.DEFFuelQty;
      this.fuelData.pricePerUnit = this.fuelData.amountPaid / this.fuelData.totalLitres;
    } else {
      this.fuelData.fuelQty = +((this.fuelData.fuelQty / 3.785).toFixed(2));
      this.fuelData.DEFFuelQty = +((this.fuelData.DEFFuelQty / 3.785).toFixed(2));
      this.fuelData.totalLitres = this.fuelData.fuelQty + this.fuelData.DEFFuelQty;
      this.fuelData.pricePerUnit = +((this.fuelData.amountPaid / this.fuelData.totalLitres).toFixed(2));
    }
     this.fuelData.uploadedPhotos = this.existingPhotos;
    if (this.fuelData.fuelDate !== '') {
      //date in Y-m-d format
      this.fuelData.fuelDate = this.fuelData.fuelDate.split('-').reverse().join('-');
    }
     // create form data instance
     const formData = new FormData();

     //append photos if any
     for(let i = 0; i < this.uploadedPhotos.length; i++){
       formData.append('uploadedPhotos', this.uploadedPhotos[i]);
     }

     //append other fields
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
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.toaster.success('Fuel Entry Updated successfully');
        this.router.navigateByUrl('/fleet/expenses/fuel/list');
      },
    });
  }

 // delete uploaded images and documents
 delete(name: string){
  this.apiService.deleteData(`fuelEntries/uploadDelete/${this.entryID}/${name}`).subscribe((result: any) => {
    this.fetchFuelEntry();
  });
}

}
