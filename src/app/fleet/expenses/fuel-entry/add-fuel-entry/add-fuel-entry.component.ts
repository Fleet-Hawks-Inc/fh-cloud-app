import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
import {AwsUploadService} from '../../../../aws-upload.service';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-add-fuel-entry",
  templateUrl: "./add-fuel-entry.component.html",
  styleUrls: ["./add-fuel-entry.component.css"],
})
export class AddFuelEntryComponent implements OnInit {
  title = "Add Fuel Entry";
  date: NgbDateStruct;
  imageError = '';
  fileName = '';

  /********** Form Fields ***********/
 basic = {
     unitType : "",
     vehicleID: "",
     vehicleFuelQty : 0.0,   
     vehicleFuelQtyUnit : "",
     vehicleFuelQtyAmt : 0.0,  
     reeferID: "",
     reeferFuelQty : 0.0,
     reeferFuelQtyUnit : "",
     reeferFuelQtyAmt : 0.0,   
     DEFFuelQty : 0.0,
     DEFFuelQtyUnit : "gallons",
     DEFFuelQtyAmt : 0.0,
     discount : 0.0,
     totalAmount : 0.0,
     costPerGallon : 0.0,
     amountPaid : 0.0,
     date: "",
     fuelType: "",
     tripID: "",    
     costLabel : "Cost/gallon", 
 };
 payment = {
  paidBy: "",
  paymentMode : "",
  reference : "",
  reimburseToDriver : "",
  deductFromPay : "",
 };
 fuelStop = {  
  vendorID : "",
  countryID : "",
  stateID : "",
  cityID : "",
 };
 additional ={
  avgGVW : "",
  odometer : "",
  description : ""
 };
 countries = [];
 states = [];
 cities = [];
 vendors = [];
 vehicles = []; 
 trips = [];
  /******************/

  errors = {};
  form;
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService,
              private router: Router,
              private awsUS: AwsUploadService) {}

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
    this.apiService.getData('states/country/' + this.fuelStop.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
   getCities() {
    this.apiService.getData('cities/state' + this.fuelStop.stateID)
    .subscribe((result: any) => {
      this.cities = result.Items;
    });
   }
  fetchVehicles() {
    this.apiService.getData("vehicles").subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }

  fetchTrips() {
    this.apiService.getData("trips").subscribe((result: any) => {
      this.trips = result.Items;
    });
  }

  fetchVendors() {
    this.apiService.getData("vendors").subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $("#form_").validate();
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
      basic : {
        unitType : this.basic.unitType,
        vehicleID: this.basic.vehicleID,
        vehicleFuelQty : this.basic.vehicleFuelQty,   
        vehicleFuelQtyUnit : this.basic.vehicleFuelQtyUnit,
        vehicleFuelQtyAmt : this.basic.vehicleFuelQtyAmt,  
        reeferID: this.basic.reeferID,
        reeferFuelQty : this.basic.reeferFuelQty,
        reeferFuelQtyUnit : this.basic.reeferFuelQtyUnit,
        reeferFuelQtyAmt : this.basic.reeferFuelQtyAmt,   
        DEFFuelQty : this.basic.DEFFuelQty,
        DEFFuelQtyUnit : this.basic.DEFFuelQtyUnit,
        DEFFuelQtyAmt : this.basic.DEFFuelQtyAmt,
        discount : this.basic.discount,
        totalAmount : this.basic.totalAmount,
        costPerGallon : this.basic.costPerGallon,
        amountPaid : this.basic.amountPaid,
        date: this.basic.date,
        fuelType: this.basic.fuelType,
        tripID: this.basic.tripID,  
           
    },     
      payment:{
        paidBy: this.payment.paidBy,
        paymentMode: this.payment.paymentMode,
        reference : this.payment.reference,
        reimburseToDriver : this.payment.reimburseToDriver,
        deductFromPay : this.payment.deductFromPay,
      },
      fuelStop : {      
        vendorID : this.fuelStop.vendorID,
        countryID : this.fuelStop.countryID,
        stateID : this.fuelStop.stateID,
        cityID : this.fuelStop.cityID,
       },
       additional : {
        avgGVW : this.additional.avgGVW,
        odometer : this.additional.odometer,
        description : this.additional.description,
       }
    };
console.log(data);
return;
    this.apiService.postData("fuelEntries", data).subscribe({
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
              val.message = val.message.replace(/".*"/, "This Field");
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
        this.hasSuccess = true;
        this.Success = "Fuel entry Added successfully";
        this.basic.vehicleID = "";
        // this.vendorID = "";
        // this.location = "";
        // this.odometer = "";
        // this.fuelType = "";
        // this.tripID = "";
        // this.date = "";
        // this.price = "";
        // this.volume = "";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
  onChangeUnitType(value: any){
    this.basic.unitType = value;  
  }
  changeFuelUnit(){
    if((this.basic.vehicleFuelQtyUnit == "gallons") || (this.basic.reeferFuelQtyUnit == "gallons")){
         this.basic.costLabel = "Cost/gallon";
         this.basic.DEFFuelQtyUnit = "gallons";
    }
   else if((this.basic.vehicleFuelQtyUnit == "litres") || (this.basic.reeferFuelQtyUnit == "litres")){
      this.basic.costLabel = "Cost/litre";
      this.basic.DEFFuelQtyUnit = "litres";
 }
  }
  calculate(){
    this.basic.totalAmount = Number(this.basic.vehicleFuelQtyAmt) + Number(this.basic.DEFFuelQtyAmt) + Number(this.basic.reeferFuelQtyAmt);
    var units = Number(this.basic.vehicleFuelQty) + Number(this.basic.DEFFuelQty) + Number(this.basic.reeferFuelQty);
    // this.basic.costPerGallon = Math.round(this.basic.totalAmount/units);
    this.basic.amountPaid = this.basic.totalAmount - this.basic.discount;
    this.basic.costPerGallon = Math.round(this.basic.amountPaid/units);
  }
  // calculateTotal()
  // {
  //   var units = Number(this.basic.vehicleFuelQty) + Number(this.basic.DEFFuelQty) + Number(this.basic.reeferFuelQty);
  //   this.basic.amountPaid = this.basic.totalAmount - this.basic.discount;
  //   this.basic.costPerGallon = Math.round(this.basic.amountPaid/units);
  // }
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
