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

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-add-fuel-entry',
  templateUrl: './add-fuel-entry.component.html',
  styleUrls: ['./add-fuel-entry.component.css'],
})
export class AddFuelEntryComponent implements OnInit {
  title = 'Add Fuel Entry';
  imageError = '';
  fileName = '';
  public entryID;
  /********** Form Fields ***********/

  unitType = 'vehicle';
  currency = 'USD';
  vehicleID = '';
  fuelQtyAmt = 0;
  fuelQty = 0;
  fuelQtyUnit = 'gallon';
  reeferID = '';
  DEFFuelQty = 0;
  DEFFuelQtyUnit = 'gallon';
  DEFFuelQtyAmt = 0;
  discount = 0;
  totalAmount = 0;
  costPerUnit = 0;
  amountPaid = 0;
  date: NgbDateStruct;
  fuelType = '';
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  uploadedFiles = [];
  carrierID;

  paidBy = '';
  paymentMode = '';
  reference = '';
  reimburseToDriver = false;
  deductFromPay = false;

  vendorID = '';
  countryID = '';
  stateID = '';
  cityID = '';

  dispatchAssociate = '';
  tripID = '';

  additionalDetails = {
    avgGVW: '',
    odometer: '',
    description: '',
    uploadedPhotos: [],
  };
  fuel = {
    totalLitres: 0,
    totalGallons: 0,
    costPerLitre: 0,
    costPerGallon: 0
  };
  countries = [];
  states = [];
  cities = [];
  vendors = [];
  vehicles = [];
  assets = [];
  reeferArray = [];
  trips = [];
  /******************/

  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';



  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
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
    this.entryID = this.route.snapshot.params['entryID'];
    if (this.entryID) {
      this.title = 'Edit Fuel Entry';
      this.fetchFuelEntry();
    } else {
      this.title = 'Add Fuel Entry';
    }
    $(document).ready(() => {
      this.form = $('#form_').validate();
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
    this.apiService.getData('states/country/' + this.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
  getCities() {
    this.apiService.getData('cities/state/' + this.stateID)
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
      console.log('asets', this.assets);
      for (let i = 0; i < result.Items.length; i++) {
        if (result.Items[i].assetDetails.assetType === 'Reefer') {
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
  calculateGalLit(totalUnits, amountPaid) {
    if (this.fuelQtyUnit === 'litre') {
      console.log('hello litre');
      console.log('amount paid', amountPaid);
      console.log('total units', totalUnits);
      this.fuel.totalGallons = +((totalUnits / 3.785).toFixed(2));
      this.fuel.costPerGallon = +((amountPaid / this.fuel.totalGallons).toFixed(2));
      this.fuel.totalLitres = totalUnits;
      this.fuel.costPerLitre = +((amountPaid / totalUnits).toFixed(2));
      console.log('total gallons', this.fuel.totalGallons);
      console.log('total littres', this.fuel.totalLitres);
      console.log('cost per gallon', this.fuel.costPerGallon);
      console.log('cost per litre', this.fuel.costPerLitre);
    }
    if (this.fuelQtyUnit === 'gallon') {
      console.log('hello gallon');
      console.log('amount paid', amountPaid);
      console.log('total units', totalUnits);
      this.fuel.totalLitres = +((totalUnits * 3.785).toFixed(2));
      this.fuel.costPerLitre = +((amountPaid / this.fuel.totalLitres).toFixed(2));
      this.fuel.totalGallons = totalUnits;
      this.fuel.costPerGallon = +((amountPaid / totalUnits).toFixed(2));
      console.log('total littres', this.fuel.totalLitres);
      console.log('cost per litre', this.fuel.costPerLitre);
      console.log('total gallons', this.fuel.totalGallons);
      console.log('cost per gallon', this.fuel.costPerGallon);
    }
  }
  fillCountry() {
    this.apiService
      .getData('states/' + this.stateID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.countryID = result.countryID;
      });

    setTimeout(() => {
      this.getStates();
    }, 2000);
    setTimeout(() => {
      this.getCities();
    }, 2000);
  }
  addFuelEntry() {
    // if (this.fileName === '') {
    //   this.imageError = 'Please Choose Image To Upload';
    //   return;
    // }

    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    const data = {
      unitType: this.unitType,
      vehicleID: this.vehicleID,
      fuelQty: this.fuelQty,
      fuelQtyUnit: this.fuelQtyUnit,
      fuelQtyAmt: this.fuelQtyAmt,
      reeferID: this.reeferID,
      DEFFuelQty: this.DEFFuelQty,
      DEFFuelQtyAmt: this.DEFFuelQtyAmt,
      discount: this.discount,
      totalAmount: this.totalAmount,
      costPerUnit: this.costPerUnit,
      amountPaid: this.amountPaid,
      currency: this.currency,
      date: this.date,
      fuelType: this.fuelType,
      paidBy: this.paidBy,
      paymentMode: this.paymentMode,
      reference: this.reference,
      reimburseToDriver: this.reimburseToDriver,
      deductFromPay: this.deductFromPay,
      vendorID: this.vendorID,
      countryID: this.countryID,
      stateID: this.stateID,
      cityID: this.cityID,
      tripID: this.tripID,
      additionalDetails: {
        avgGVW: this.additionalDetails.avgGVW,
        odometer: this.additionalDetails.odometer,
        description: this.additionalDetails.description,
        uploadedPhotos: this.additionalDetails.uploadedPhotos,
      },
      fuel: {
        totalLitres: this.fuel.totalLitres,
        totalGallons: this.fuel.totalGallons,
        costPerLitre: this.fuel.costPerLitre,
        costPerGallon: this.fuel.costPerGallon
      },
    };
    console.log('filed data', data);
    this.apiService.postData('fuelEntries', data).subscribe({
      complete: () => { },
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              console.log(key);
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
              this.Success = '';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.uploadFiles(); // upload selected files to bucket
        this.toaster.success('Fuel Entry Added successfully');
        this.router.navigateByUrl('/fleet/expenses/fuel/list');
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
  /*
  * Selecting files before uploading
  */
  selectDocuments(event, obj) {
    this.selectedFiles = event.target.files;
    console.log('selected files', this.selectedFiles[0].name);
    if (obj === 'uploadedPhotos') {
      for (let i = 0; i <= this.selectedFiles.item.length; i++) {
        const randomFileGenerate = this.selectedFiles[i].name.split('.');
        const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;

        this.selectedFileNames.set(fileName, this.selectedFiles[i]);
        this.additionalDetails.uploadedPhotos.push(fileName);
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
        console.log('Fetched Data', result);
        this.entryID = this.entryID;
        this.currency = result.currency,
          this.unitType = result.unitType;
        this.vehicleID = result.vehicleID,
          this.reeferID = result.reeferID,
          this.fuelQty = result.fuelQty,
          this.fuelQtyUnit = result.fuelQtyUnit,
          this.fuelQtyAmt = +result.fuelQtyAmt,
          this.DEFFuelQty = +result.DEFFuelQty,
          this.DEFFuelQtyUnit = result.fuelQtyUnit,
          this.DEFFuelQtyAmt = +result.DEFFuelQtyAmt,
          this.discount = +result.discount,
          this.totalAmount = result.totalAmount,
          this.costPerUnit = +result.costPerUnit,
          this.amountPaid = result.amountPaid,
          this.date = result.date,
          this.fuelType = result.fuelType,

          this.paidBy = result.paidBy,
          this.paymentMode = result.paymentMode,
          this.reference = result.reference,
          this.reimburseToDriver = result.reimburseToDriver,
          this.deductFromPay = result.deductFromPay,


          this.vendorID = result.vendorID,
          this.countryID = result.countryID,
          this.stateID = result.stateID,
          this.cityID = result.cityID,
          this.tripID = result.tripID,

          this.additionalDetails = {
            avgGVW: result.additionalDetails.avgGVW,
            odometer: result.additionalDetails.odometer,
            description: result.additionalDetails.description,
            uploadedPhotos: result.additionalDetails.uploadedPhotos,
          },
          this.fuel = {
            costPerGallon: result.fuel.costPerGallon,
            costPerLitre: result.fuel.costPerLitre,
            totalGallons: result.fuel.totalGallons,
            totalLitres: result.fuel.totalLitres
          },
          setTimeout(() => {
            this.fillCountry();
          }, 2000);
      });
  }
  updateFuelEntry() {

    // if (this.fileName === '') {
    //   this.imageError = 'Please Choose Image To Upload';
    //   return;
    // }

    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    const data = {
      entryID: this.entryID,
      unitType: this.unitType,
      vehicleID: this.vehicleID,
      fuelQty: this.fuelQty,
      fuelQtyUnit: this.fuelQtyUnit,
      fuelQtyAmt: this.fuelQtyAmt,
      reeferID: this.reeferID,
      DEFFuelQty: this.DEFFuelQty,
      DEFFuelQtyAmt: this.DEFFuelQtyAmt,
      discount: this.discount,
      totalAmount: this.totalAmount,
      costPerUnit: this.costPerUnit,
      amountPaid: this.amountPaid,
      currency: this.currency,
      date: this.date,
      fuelType: this.fuelType,
      paidBy: this.paidBy,
      paymentMode: this.paymentMode,
      reference: this.reference,
      reimburseToDriver: this.reimburseToDriver,
      deductFromPay: this.deductFromPay,
      vendorID: this.vendorID,
      countryID: this.countryID,
      stateID: this.stateID,
      cityID: this.cityID,
      tripID: this.tripID,
      additionalDetails: {
        avgGVW: this.additionalDetails.avgGVW,
        odometer: this.additionalDetails.odometer,
        description: this.additionalDetails.description,
        uploadedPhotos: this.additionalDetails.uploadedPhotos,
      },
      fuel: {
        totalLitres: this.fuel.totalLitres,
        totalGallons: this.fuel.totalGallons,
        costPerLitre: this.fuel.costPerLitre,
        costPerGallon: this.fuel.costPerGallon
      },
    };
    console.log(data);
    this.apiService.putData('fuelEntries', data).subscribe({
      complete: () => { },
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/'([^']+)'/)[1];
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[key] = val.message;
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
        this.uploadFiles(); // upload selected files to bucket
        this.toaster.success('Fuel Entry Updated successfully');
        this.router.navigateByUrl('/fleet/expenses/fuel/list');
      },
    });
  }
  onChangeUnitType(value: any) {
    this.unitType = value;
    this.fuelQtyAmt = 0;
    this.fuelQty = 0;
    this.calculate();
  }
  changeFuelUnit() {
    if (this.fuelQtyUnit === 'gallon') {
      this.DEFFuelQtyUnit = 'gallon';
    }
    else {
      this.DEFFuelQtyUnit = 'litre';
    }
  }
  changeCurrency(val) {
    this.currency = val;
  }
  calculate() {
    this.totalAmount = Number(this.fuelQtyAmt) + Number(this.DEFFuelQtyAmt);
    const units = Number(this.fuelQty) + Number(this.DEFFuelQty);
    this.amountPaid = this.totalAmount - this.discount;
    let test = (this.amountPaid / units);
    this.costPerUnit = +(test.toFixed(2));
    this.calculateGalLit(units, this.amountPaid);
  }


}
