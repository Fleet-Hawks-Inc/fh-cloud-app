import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { map } from 'rxjs/operators';
import { from} from 'rxjs';
import {AwsUploadService} from '../../../../../services/aws-upload.service';
import { NgbCalendar, NgbDateAdapter,  NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


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

     unitType =  'vehicle';
     vehicleID = '';
     vehicleFuelQty = 0;
     vehicleFuelQtyUnit  = 'gallons';
     vehicleFuelQtyAmt  = 0;
     reeferID = '';
     reeferFuelQty = 0;
     reeferFuelQtyUnit  =  'gallons';
     reeferFuelQtyAmt  = 0;
     DEFFuelQty  = 0;
     DEFFuelQtyUnit  =  'gallons';
     DEFFuelQtyAmt  = 0;
     discount  = 0;
     totalAmount  = 0;
     costPerGallon  = 0;
     amountPaid  = 0;
     date: NgbDateStruct;
     fuelType = '';
     selectedFiles: FileList;
     selectedFileNames: Map<any, any>;
     uploadedFiles = [];
     costLabel  =  'Cost/gallon';
     carrierID;

  paidBy = '';
  paymentMode  = '';
  reference  = '';
  reimburseToDriver = false;
  deductFromPay  = false;

  vendorID  = '';
  countryID  = '';
  stateID  = '';
  cityID  = '';

   dispatchAssociate  = '';
   tripID  = '';

 additionalDetails = {
  avgGVW  : '',
  odometer  : '',
  description  : '',
  uploadedPhotos : [],
 }
 
 countries = [];
 states = [];
 cities = [];
 vendors = [];
 vehicles = [];
 assets = [];
 reeferArray =[];
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
      console.log('reefer', this.reeferArray);
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
        unitType : this.unitType,
        vehicleID: this.vehicleID,
        vehicleFuelQty : this.vehicleFuelQty,
        vehicleFuelQtyUnit : this.vehicleFuelQtyUnit,
        vehicleFuelQtyAmt : this.vehicleFuelQtyAmt,
        reeferID: this.reeferID,
        reeferFuelQty : this.reeferFuelQty,
        reeferFuelQtyUnit : this.reeferFuelQtyUnit,
        reeferFuelQtyAmt : this.reeferFuelQtyAmt,
        DEFFuelQty : this.DEFFuelQty,
        DEFFuelQtyUnit : this.DEFFuelQtyUnit,
        DEFFuelQtyAmt : this.DEFFuelQtyAmt,
        discount : this.discount,
        totalAmount : this.totalAmount,
        costPerGallon : this.costPerGallon,
        amountPaid : this.amountPaid,
        date: this.date,
        fuelType: this.fuelType,
        paidBy: this.paidBy,
        paymentMode: this.paymentMode,
        reference : this.reference,
        reimburseToDriver : this.reimburseToDriver,
        deductFromPay : this.deductFromPay,
        vendorID : this.vendorID,
        countryID : this.countryID,
        stateID : this.stateID,
        cityID : this.cityID,
        tripID : this.tripID,
        additionalDetails: {
          avgGVW : this.additionalDetails.avgGVW,
          odometer : this.additionalDetails.odometer,
          description : this.additionalDetails.description,
          uploadedPhotos: this.additionalDetails.uploadedPhotos,
        },
    };
    console.log(data);
    
    this.apiService.postData('fuelEntries', data).subscribe({
      complete: () => {},
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
        this.router.navigateByUrl('/fleet/expenses/fuel/Fuel-Entry-List');
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
      this.entryID = this.entryID;
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
        this.tripID = result.tripID,

        this.additionalDetails = {
          avgGVW : result.additionalDetails.avgGVW,
          odometer : result.additionalDetails.odometer,
          description : result.additionalDetails.description,
          uploadedPhotos : result.additionalDetails.uploadedPhotos,
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
    entryID : this.entryID,
    unitType : this.unitType,
    vehicleID: this.vehicleID,
    vehicleFuelQty : this.vehicleFuelQty,
    vehicleFuelQtyUnit : this.vehicleFuelQtyUnit,
    vehicleFuelQtyAmt : this.vehicleFuelQtyAmt,
    reeferID: this.reeferID,
    reeferFuelQty : this.reeferFuelQty,
    reeferFuelQtyUnit : this.reeferFuelQtyUnit,
    reeferFuelQtyAmt : this.reeferFuelQtyAmt,
    DEFFuelQty : this.DEFFuelQty,
    DEFFuelQtyUnit : this.DEFFuelQtyUnit,
    DEFFuelQtyAmt : this.DEFFuelQtyAmt,
    discount : this.discount,
    totalAmount : this.totalAmount,
    costPerGallon : this.costPerGallon,
    amountPaid : this.amountPaid,
    date: this.date,
    fuelType: this.fuelType,
    paidBy: this.paidBy,
    paymentMode: this.paymentMode,
    reference : this.reference,
    reimburseToDriver : this.reimburseToDriver,
    deductFromPay : this.deductFromPay,
    vendorID : this.vendorID,
    countryID : this.countryID,
    stateID : this.stateID,
    cityID : this.cityID,
    tripID : this.tripID,
    additionalDetails: {
      avgGVW : this.additionalDetails.avgGVW,
      odometer : this.additionalDetails.odometer,
      description : this.additionalDetails.description,
      uploadedPhotos: this.additionalDetails.uploadedPhotos,
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
      this.router.navigateByUrl('/fleet/expenses/fuel/Fuel-Entry-List');
    },
  });
}
  onChangeUnitType(value: any){
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
  calculate(){
    this.totalAmount = Number(this.vehicleFuelQtyAmt) + Number(this.DEFFuelQtyAmt) + Number(this.reeferFuelQtyAmt);
    const units = Number(this.vehicleFuelQty) + Number(this.DEFFuelQty) + Number(this.reeferFuelQty);
    // this.costPerGallon = Math.round(this.totalAmount/units);
    this.amountPaid = this.totalAmount - this.discount;
    this.costPerGallon = Math.round(this.amountPaid / units);
  }


}
