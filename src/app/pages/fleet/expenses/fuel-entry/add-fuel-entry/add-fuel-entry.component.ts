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
  public entryID;
  /********** Form Fields ***********/

  unitType = 'vehicle';
  unitID: string;
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
  fuelDate: NgbDateStruct;
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
  fuelForm;
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';



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
      this.fuel.totalGallons = +((totalUnits / 3.785).toFixed(2));
      this.fuel.costPerGallon = +((amountPaid / this.fuel.totalGallons).toFixed(2));
      this.fuel.totalLitres = totalUnits;
      this.fuel.costPerLitre = +((amountPaid / totalUnits).toFixed(2));
    }
    if (this.fuelQtyUnit === 'gallon') {
      this.fuel.totalLitres = +((totalUnits * 3.785).toFixed(2));
      this.fuel.costPerLitre = +((amountPaid / this.fuel.totalLitres).toFixed(2));
      this.fuel.totalGallons = totalUnits;
      this.fuel.costPerGallon = +((amountPaid / totalUnits).toFixed(2));
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
    this.hideErrors();
    const data = {
      unitType: this.unitType,
      unitID: this.unitID,
      fuelQty: this.fuelQty,
      fuelQtyUnit: this.fuelQtyUnit,
      fuelQtyAmt: this.fuelQtyAmt,
      DEFFuelQty: this.DEFFuelQty,
      DEFFuelQtyAmt: this.DEFFuelQtyAmt,
      discount: this.discount,
      totalAmount: this.totalAmount,
      costPerUnit: this.costPerUnit,
      amountPaid: this.amountPaid,
      currency: this.currency,
      fuelDate: this.fuelDate,
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
    console.log('filled data', data);
    this.apiService.postData('fuelEntries', data).subscribe({
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
        this.uploadFiles(); // upload selected files to bucket
        this.toaster.success('Fuel Entry Added successfully');
        this.router.navigateByUrl('/fleet/expenses/fuel/list');
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
  /*
  * Selecting files before uploading
  */
  selectDocuments(event, obj) {
    this.selectedFiles = event.target.files;
    //  console.log('selected files', this.selectedFiles[0].name);
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
        this.unitID = result.unitID;
        // this.vehicleID = result.vehicleID;
        // this.reeferID = result.reeferID;
        this.fuelQty = result.fuelQty;
        this.fuelQtyUnit = result.fuelQtyUnit;
        this.fuelQtyAmt = +result.fuelQtyAmt;
        this.DEFFuelQty = +result.DEFFuelQty;
        this.DEFFuelQtyUnit = result.fuelQtyUnit;
        this.DEFFuelQtyAmt = +result.DEFFuelQtyAmt;
        this.discount = +result.discount;
        this.totalAmount = result.totalAmount;
        this.costPerUnit = +result.costPerUnit;
        this.amountPaid = result.amountPaid;
        this.fuelDate = result.fuelDate;
        this.fuelType = result.fuelType;

        this.paidBy = result.paidBy;
        this.paymentMode = result.paymentMode;
        this.reference = result.reference;
        this.reimburseToDriver = result.reimburseToDriver;
        this.deductFromPay = result.deductFromPay;


        this.vendorID = result.vendorID;
        this.countryID = result.countryID;
        this.stateID = result.stateID;
        this.cityID = result.cityID;
        this.tripID = result.tripID;

        this.additionalDetails = {
          avgGVW: result.additionalDetails.avgGVW,
          odometer: result.additionalDetails.odometer,
          description: result.additionalDetails.description,
          uploadedPhotos: result.additionalDetails.uploadedPhotos,
        };
        this.fuel = {
          costPerGallon: result.fuel.costPerGallon,
          costPerLitre: result.fuel.costPerLitre,
          totalGallons: result.fuel.totalGallons,
          totalLitres: result.fuel.totalLitres
        };
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

    this.hideErrors();
    const data = {
      entryID: this.entryID,
      unitType: this.unitType,
      unitID: this.unitID,
      // vehicleID: this.vehicleID,
      fuelQty: this.fuelQty,
      fuelQtyUnit: this.fuelQtyUnit,
      fuelQtyAmt: this.fuelQtyAmt,
      // reeferID: this.reeferID,
      DEFFuelQty: this.DEFFuelQty,
      DEFFuelQtyAmt: this.DEFFuelQtyAmt,
      discount: this.discount,
      totalAmount: this.totalAmount,
      costPerUnit: this.costPerUnit,
      amountPaid: this.amountPaid,
      currency: this.currency,
      fuelDate: this.fuelDate,
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
    //  console.log(data);
    this.apiService.putData('fuelEntries', data).subscribe({
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
