import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { AwsUploadService } from '../../../../aws-upload.service';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-edit-fuel-entry',
  templateUrl: './edit-fuel-entry.component.html',
  styleUrls: ['./edit-fuel-entry.component.css'],
})
export class EditFuelEntryComponent implements OnInit {
  title = 'Edit Fuel Entry';

  imageError = '';
  fileName = '';

  /********** Form Fields ***********/

  unitType = 'Vehicle';
  vehicleID = '';
  vehicleFuelQty = 0;
  vehicleFuelQtyUnit = 'gallons';
  vehicleFuelQtyAmt = 0;
  reeferID = '';
  reeferFuelQty = 0;
  reeferFuelQtyUnit = 'gallons';
  reeferFuelQtyAmt = 0;
  DEFFuelQty = 0;
  DEFFuelQtyUnit = 'gallons';
  DEFFuelQtyAmt = 0;
  discount = 0;
  totalAmount = 0;
  costPerGallon = 0;
  amountPaid = 0;
  date: NgbDateStruct;
  fuelType = '';
  //  tripID: '';
  costLabel = 'Cost/gallon';




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
  dispatchID = ''


  avgGVW = '';
  odometer = '';
  description = '';
  // basic = {
  //   unitType: 'Vehicle',
  //   vehicleID: '',
  //   vehicleFuelQty: 0.0,
  //   vehicleFuelQtyUnit: '',
  //   vehicleFuelQtyAmt: 0.0,
  //   reeferID: '',
  //   reeferFuelQty: 0.0,
  //   reeferFuelQtyUnit: '',
  //   reeferFuelQtyAmt: 0.0,
  //   DEFFuelQty: 0.0,
  //   DEFFuelQtyUnit: 'gallons',
  //   DEFFuelQtyAmt: 0.0,
  //   discount: 0.0,
  //   totalAmount: 0.0,
  //   costPerGallon: 0.0,
  //   amountPaid: 0.0,
  //   date: '',
  //   fuelType: '',
  //   tripID: '',
  //   costLabel: 'Cost/gallon',
  // };
  // deductFromPay: boolean;
  // reimburseToDriver: boolean;
  // payment = {
  //   paidBy: '',
  //   paymentMode: '',
  //   reference: '',
  //   reimburseToDriver: false,
  //   deductFromPay: false,
  // };
  // fuelStop = {
  //   vendorID: '',
  //   countryID: '',
  //   stateID: '',
  //   cityID: '',
  // };
  // dispatch = {
  //   dispatchAssociate: '',
  //   dispatchID: ''
  // };
  // additional = {
  //   avgGVW: '',
  //   odometer: '',
  //   description: ''
  // };
  timeCreated: '';
  /******************/
  entryID = '';
  vehicles = [];
  vendors = [];
  trips = [];
  countries = [];
  states = [];
  cities = [];
  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';

  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private awsUS: AwsUploadService, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {
    this.entryID = this.route.snapshot.params['entryID'];

    this.fetchFuelEntry();
    this.fetchVehicles();
    this.fetchVendors();
    this.fetchTrips();
    this.fetchCountries();
  }
  getStates() {
    this.apiService
      .getData('states/country/' + this.countryID)
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

  fillCountry() {
    this.apiService
      .getData('states/' + this.stateID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.countryID = result.countryID;
      });

    setTimeout(() => {
      this.getStates();
    }, 1500);
    setTimeout(() => {
      this.getCities();
    }, 1500);
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
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

  fetchFuelEntry() {
    this.apiService
      .getData('fuelEntries/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.unitType = result.unitType;
        this.vehicleID = result.vehicleID,
        this.vehicleFuelQty = +result.vehicleFuelQty,
        this.vehicleFuelQtyUnit = result.vehicleFuelQtyUnit,
        this.vehicleFuelQtyAmt = +result.vehicleFuelQtyAmt,
        this.reeferID = result.reeferID,
        this.reeferFuelQty = result.reeferFuelQty,
        this.reeferFuelQtyUnit = result.reeferFuelQtyUnit,
        this.reeferFuelQtyAmt = result.reeferFuelQtyAmt,
        this.DEFFuelQty = +result.DEFFuelQty,
        this.DEFFuelQtyUnit = result.DEFFuelQtyUnit,
        this.DEFFuelQtyAmt = +result.DEFFuelQtyAmt,
        this.discount = +result.discount,
        this.totalAmount = result.totalAmount,
        this.costPerGallon = result.costPerGallon,
        this.amountPaid = result.amountPaid,
        this.date = result.date,
        this.fuelType = result.fuelType,
         // this. tripID = result.tripID,
        this.costLabel = result.costLabel,



          this.paidBy = result.paidBy,
          this.paymentMode = result.paymentMode,
          this.reference = result.reference,
          this.reimburseToDriver = result.reimburseToDriver,
          this.deductFromPay = result.deductFromPay,


          this.vendorID = result.vendorID,
          this.countryID = result.countryID,
          this.stateID = result.stateID,
          this.cityID = result.cityID,


          this.dispatchAssociate = result.dispatchAssociate,
          this.dispatchID = result.dispatchID,


        this.avgGVW = result.avgGVW,
          this.odometer = result.odometer,
          this.description = result.description,

        setTimeout(() => {
          this.fillCountry();
        }, 2000);

      });
  }

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
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
      vehicleFuelQty: this.vehicleFuelQty,
      vehicleFuelQtyUnit: this.vehicleFuelQtyUnit,
      vehicleFuelQtyAmt: this.vehicleFuelQtyAmt,
      reeferID: this.reeferID,
      reeferFuelQty: this.reeferFuelQty,
      reeferFuelQtyUnit: this.reeferFuelQtyUnit,
      reeferFuelQtyAmt: this.reeferFuelQtyAmt,
      DEFFuelQty: this.DEFFuelQty,
      DEFFuelQtyUnit: this.DEFFuelQtyUnit,
      DEFFuelQtyAmt: this.DEFFuelQtyAmt,
      discount: this.discount,
      totalAmount: this.totalAmount,
      costPerGallon: this.costPerGallon,
      amountPaid: this.amountPaid,
      date: this.date,
      fuelType: this.fuelType,
      // tripID: this.tripID, 
      paidBy: this.paidBy,
      paymentMode: this.paymentMode,
      reference: this.reference,
      reimburseToDriver: this.reimburseToDriver,
      deductFromPay: this.deductFromPay,
      vendorID: this.vendorID,
      countryID: this.countryID,
      stateID: this.stateID,
      cityID: this.cityID,
      dispatchAssociate: this.dispatchAssociate,
      dispatchID: this.dispatchID,
      avgGVW: this.avgGVW,
      odometer: this.odometer,
      description: this.description,
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
        this.hasSuccess = true;
        this.Success = 'Fuel entry updated successfully';
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
  onChangeUnitType(value: any) {
    this.unitType = value;
    this.vehicleFuelQtyAmt = 0;
    this.reeferFuelQtyAmt = 0;
    this.vehicleFuelQty = 0;
    this.reeferFuelQty = 0;
    this.calculate();
  }
  changeFuelUnit() {
    if ((this.vehicleFuelQtyUnit === 'gallons') || (this.reeferFuelQtyUnit === 'gallons')) {
      this.costLabel = 'Cost/gallon';
      this.DEFFuelQtyUnit = 'gallons';
    }
    if ((this.vehicleFuelQtyUnit === 'litres') || (this.reeferFuelQtyUnit === 'litres')) {
      this.costLabel = 'Cost/litre';
      this.DEFFuelQtyUnit = 'litres';
    }
  }
  calculate() {
    this.totalAmount = Number(this.vehicleFuelQtyAmt) + Number(this.DEFFuelQtyAmt) + Number(this.reeferFuelQtyAmt);
    const units = Number(this.vehicleFuelQty) + Number(this.DEFFuelQty) + Number(this.reeferFuelQty);
    // this.costPerGallon = Math.round(this.totalAmount/units);
    this.amountPaid = this.totalAmount - this.discount;
    this.costPerGallon = Math.round(this.amountPaid / units);
  }
  uploadFile(event) {
    this.imageError = '';
    if (this.awsUS.imageFormat(event.target.files.item(0)) !== -1) {
      this.fileName = this.awsUS.uploadFile('test', event.target.files.item(0));
    } else {
      this.fileName = '';
      this.imageError = 'Invalid Image Format';
    }
  }

}
