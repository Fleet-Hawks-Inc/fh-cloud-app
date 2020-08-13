import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api.service';
import { Router } from '@angular/router';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {AwsUploadService} from '../../../../aws-upload.service';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { booleanObjectType } from 'aws-sdk/clients/iam';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';


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
    //  tripID: "";
     costLabel  =  'Cost/gallon';
     carrierID;
     selectedFiles: FileList;

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
   dispatchID  = '';


  avgGVW  = '';
  odometer  = '';
  description  = '';
  fileToUpload = [];
 countries = [];
 states = [];
 cities = [];
 vendors = [];
 vehicles = [];
 trips = [];
 uploadedFiles = [];
 imageNameArray = [];
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
              private awsUS: AwsUploadService, private toaster: ToastrService,
              private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) {}
              get today() {
                return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
              }

  ngOnInit() {
    this.fetchVehicles();
    this.fetchVendors();
    this.fetchTrips();
    this.fetchCountries();
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

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
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
        // tripID: this.tripID,
        paidBy: this.paidBy,
        paymentMode: this.paymentMode,
        reference : this.reference,
        reimburseToDriver : this.reimburseToDriver,
        deductFromPay : this.deductFromPay,
        vendorID : this.vendorID,
        countryID : this.countryID,
        stateID : this.stateID,
        cityID : this.cityID,
        dispatchAssociate : this.dispatchAssociate,
        dispatchID : this.dispatchID,
        avgGVW : this.avgGVW,
        odometer : this.odometer,
        description : this.description,
       // fileToUpload : this.fileToUpload,
         uploadedFiles : this.uploadedFiles,
         imageNameArray : this.imageNameArray,
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
              // this.errors[key] = val.message;
              // Or We Can Use This One To Extract Key
              // const key = this.concatArray(path);
              // this.errors[this.concatArray(path)] = val.message;
              // if (key.length === 2) {
              // this.errors[val.context.key] = val.message;
              // } else {
              // this.errors[key] = val.message;
              // }
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.toaster.success('Fuel Entry Added successfully');
        this.router.navigateByUrl('/fleet/expenses/fuel/Fuel-Entry-List');
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
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
 showFiles(file) {
      this.imageNameArray.push(file.name);
  }
  uploadFile = async (event) => {
    // Empty the array if user selects images again.
    this.imageNameArray = [];
    this.selectedFiles = event.target.files;
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.showFiles(this.selectedFiles[i]);
    }
    console.log('Name Array Files', this.imageNameArray);
    this.carrierID = await this.apiService.getCarrierID();
   // console.log('carrierID', this.carrierID);
    this.imageError = '';
    for (let j = 0; j < this.imageNameArray.length; j++) {
      if (this.awsUS.imageFormat(event.target.files.item(j)) !== -1) {
        this.uploadedFiles = this.awsUS.uploadFile(this.carrierID,
        event.target.files.item(j));
       // console.log('event target', event.target.files.item(j));
      } else {
        this.fileName = '';
        this.imageError = 'Invalid Image Format';
      }
    }
    console.log('service returned array' + this.uploadedFiles);
  }
 /*
   * Selecting files before uploading
   */
  // selectFiles(event) {
  //   this.selectedFiles = event.target.files;
  //   this.uploadedFiles = [];
  //   for (let i = 0; i < this.selectedFiles.length; i++) {
  //     this.uploadedFiles.push(this.selectedFiles[i].name);
  //   }
  //   console.log('uploaded Files', this.uploadedFiles);
  // }
  /*
   * Uploading files which selected
   */
  // uploadFile = async () => {
  //   this.carrierID = await this.apiService.getCarrierID();
  //   this.imageError = '';
  //   if (this.uploadedFiles.length >= 0) {
  //     for (let index = 0; index < this.uploadedFiles.length; index++) {
  //       this.fileName = this.awsUS.uploadFile(this.carrierID, this.uploadedFiles[index]);
  //     }
  //   } else {
  //     this.fileName = '';
  //     this.imageError = 'Invalid Document Format';
  //   }
  // }

}
