import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../api.service";
import { ActivatedRoute } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
import { AwsUploadService } from '../../../../aws-upload.service';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-edit-fuel-entry",
  templateUrl: "./edit-fuel-entry.component.html",
  styleUrls: ["./edit-fuel-entry.component.css"],
})
export class EditFuelEntryComponent implements OnInit {
  title = "Edit Fuel Entry";

  imageError = '';
  fileName = '';

  /********** Form Fields ***********/
  basic = {
    unitType: "Vehicle",
    vehicleID: "",
    vehicleFuelQty: 0.0,
    vehicleFuelQtyUnit: "",
    vehicleFuelQtyAmt: 0.0,
    reeferID: "",
    reeferFuelQty: 0.0,
    reeferFuelQtyUnit: "",
    reeferFuelQtyAmt: 0.0,
    DEFFuelQty: 0.0,
    DEFFuelQtyUnit: "gallons",
    DEFFuelQtyAmt: 0.0,
    discount: 0.0,
    totalAmount: 0.0,
    costPerGallon: 0.0,
    amountPaid: 0.0,
    date: "",
    fuelType: "",
    tripID: "",
    costLabel: "Cost/gallon",
  };
  deductFromPay: boolean;
  reimburseToDriver: boolean;
  payment = {
    paidBy: "",
    paymentMode: "",
    reference: "",
    reimburseToDriver: false,
    deductFromPay: false,
  };
  fuelStop = {
    vendorID: "",
    countryID: "",
    stateID: "",
    cityID: "",
  };
  dispatch = {
    dispatchAssociate: "",
    dispatchID: ""
  };
  additional = {
    avgGVW: "",
    odometer: "",
    description: ""
  };
  timeCreated: "";
  /******************/

  vehicles = [];
  vendors = [];
  trips = [];
  countries = [];
  states = [];
  cities = [];
  errors = {};
  form;
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  mockData = {
    basic: {
      DEFFuelQty: "12",
      DEFFuelQtyAmt: "1200",
      DEFFuelQtyUnit: "gallons",
      amountPaid: 2100,
      costPerGallon: 88,
      date: "5-8-2020",
      discount: "100",
      fuelType: "Bio Diesel",
      reeferFuelQty: 0,
      reeferFuelQtyAmt: 0,
      reeferFuelQtyUnit: "",
      reeferID: "",
      totalAmount: 2200,
      tripID: "",
      unitType: "Vehicle",
      vehicleFuelQty: "12",
      vehicleFuelQtyAmt: "1000",
      vehicleFuelQtyUnit: "gallons",
      vehicleID: "28460da0-c285-11ea-a7a0-935b4b2d3f74",
      costLabel: "Cost/gallon",
    },
    payment: {
      deductFromPay: true,
      paidBy: "Person 1",
      paymentMode: "Check",
      reference: "111111",
      reimburseToDriver: false
    },
    additional: {
      avgGVW: "10-15,000 lbs",
      description: "this is a description of fuel entry",
      odometer: "12000"
    },
    fuelStop: {
      cityID: "",
      countryID: "8e8a0700-8979-11ea-94e8-ddabdd2e57f0",
      stateID: "51a0ce90-897a-11ea-94e8-ddabdd2e57f0",
      vendorID: "12ac0c10-9139-11ea-a5bf-c1c713a14945"
    },
    dispatch: {
      dispatchAssociate: "Yes",
      dispatchID: "DIS-2536"
    }

  }
  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private awsUS: AwsUploadService, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {
    // this.entryID = this.route.snapshot.params["entryID"];

    this.fetchFuelEntry();
    this.fetchVehicles();
    this.fetchVendors();
    this.fetchTrips();
    this.fetchCountries();
  }
  getStates() {
    this.apiService
      .getData("states/country/" + this.fuelStop.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  fillCountry() {
    this.apiService
      .getData("states/" + this.fuelStop.stateID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.fuelStop.countryID = result.countryID;
      });

    setTimeout(() => {
      this.getStates();
    }, 2000);

  }
  fetchVehicles() {
    this.apiService.getData("vehicles").subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fetchCountries() {
    this.apiService.getData("countries").subscribe((result: any) => {
      this.countries = result.Items;
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

  fetchFuelEntry() {
    // this.apiService
    //   .getData("fuelEntries/" + this.entryID)
    //   .subscribe((result: any) => {
    //     result = result.Items[0];
    this.basic = {
      unitType: this.mockData.basic.unitType,
      vehicleID: this.mockData.basic.vehicleID,
      vehicleFuelQty: +this.mockData.basic.vehicleFuelQty,
      vehicleFuelQtyUnit: this.mockData.basic.vehicleFuelQtyUnit,
      vehicleFuelQtyAmt: +this.mockData.basic.vehicleFuelQtyAmt,
      reeferID: this.mockData.basic.reeferID,
      reeferFuelQty: this.mockData.basic.reeferFuelQty,
      reeferFuelQtyUnit: this.mockData.basic.reeferFuelQtyUnit,
      reeferFuelQtyAmt: this.mockData.basic.reeferFuelQtyAmt,
      DEFFuelQty: +this.mockData.basic.DEFFuelQty,
      DEFFuelQtyUnit: this.mockData.basic.DEFFuelQtyUnit,
      DEFFuelQtyAmt: +this.mockData.basic.DEFFuelQtyAmt,
      discount: +this.mockData.basic.discount,
      totalAmount: this.mockData.basic.totalAmount,
      costPerGallon: this.mockData.basic.costPerGallon,
      amountPaid: this.mockData.basic.amountPaid,
      date: this.mockData.basic.date,
      fuelType: this.mockData.basic.fuelType,
      tripID: this.mockData.basic.tripID,
      costLabel: this.mockData.basic.costLabel

    };
    this.payment = {
      paidBy: this.mockData.payment.paidBy,
      paymentMode: this.mockData.payment.paymentMode,
      reference: this.mockData.payment.reference,
      reimburseToDriver: this.mockData.payment.reimburseToDriver,
      deductFromPay: this.mockData.payment.deductFromPay,
    };
    this.fuelStop = {
      vendorID: this.mockData.fuelStop.vendorID,
      countryID: this.mockData.fuelStop.countryID,
      stateID: this.mockData.fuelStop.stateID,
      cityID: this.mockData.fuelStop.cityID,
    };
    this.dispatch = {
      dispatchAssociate: this.mockData.dispatch.dispatchAssociate,
      dispatchID: this.mockData.dispatch.dispatchID
    };
    this.additional = {
      avgGVW: this.mockData.additional.avgGVW,
      odometer: this.mockData.additional.odometer,
      description: this.mockData.additional.description
    };
    setTimeout(() => {
      this.fillCountry();
    }, 2000);

    // });
  }

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $("#form_").validate();
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
      basic: {
        unitType: this.basic.unitType,
        vehicleID: this.basic.vehicleID,
        vehicleFuelQty: this.basic.vehicleFuelQty,
        vehicleFuelQtyUnit: this.basic.vehicleFuelQtyUnit,
        vehicleFuelQtyAmt: this.basic.vehicleFuelQtyAmt,
        reeferID: this.basic.reeferID,
        reeferFuelQty: this.basic.reeferFuelQty,
        reeferFuelQtyUnit: this.basic.reeferFuelQtyUnit,
        reeferFuelQtyAmt: this.basic.reeferFuelQtyAmt,
        DEFFuelQty: this.basic.DEFFuelQty,
        DEFFuelQtyUnit: this.basic.DEFFuelQtyUnit,
        DEFFuelQtyAmt: this.basic.DEFFuelQtyAmt,
        discount: this.basic.discount,
        totalAmount: this.basic.totalAmount,
        costPerGallon: this.basic.costPerGallon,
        amountPaid: this.basic.amountPaid,
        date: this.basic.date,
        fuelType: this.basic.fuelType,
        tripID: this.basic.tripID,

      },
      payment: {
        paidBy: this.payment.paidBy,
        paymentMode: this.payment.paymentMode,
        reference: this.payment.reference,
        reimburseToDriver: this.payment.reimburseToDriver,
        deductFromPay: this.payment.deductFromPay,
      },
      fuelStop: {
        vendorID: this.fuelStop.vendorID,
        countryID: this.fuelStop.countryID,
        stateID: this.fuelStop.stateID,
        cityID: this.fuelStop.cityID,
      },
      dispatch: {
        dispatchAssociate: this.dispatch.dispatchAssociate,
        dispatchID: this.dispatch.dispatchID
      },
      additional: {
        avgGVW: this.additional.avgGVW,
        odometer: this.additional.odometer,
        description: this.additional.description,
      }
    };
    console.log(data); return;
    this.apiService.putData("fuelEntries", data).subscribe({
      complete: () => { },
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              val.message = val.message.replace(/".*"/, "This Field");
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
        this.Success = "Fuel entry updated successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
  onChangeUnitType(value: any) {
    this.basic.unitType = value;
    this.basic.vehicleFuelQtyAmt = 0;
    this.basic.reeferFuelQtyAmt = 0;
    this.basic.vehicleFuelQty = 0;
    this.basic.reeferFuelQty = 0;
    this.calculate();
  }
  changeFuelUnit() {
    if ((this.basic.vehicleFuelQtyUnit == "gallons") || (this.basic.reeferFuelQtyUnit == "gallons")) {
      this.basic.costLabel = "Cost/gallon";
      this.basic.DEFFuelQtyUnit = "gallons";
    }
    else if ((this.basic.vehicleFuelQtyUnit == "litres") || (this.basic.reeferFuelQtyUnit == "litres")) {
      this.basic.costLabel = "Cost/litre";
      this.basic.DEFFuelQtyUnit = "litres";
    }
  }
  calculate() {
    this.basic.totalAmount = Number(this.basic.vehicleFuelQtyAmt) + Number(this.basic.DEFFuelQtyAmt) + Number(this.basic.reeferFuelQtyAmt);
    var units = Number(this.basic.vehicleFuelQty) + Number(this.basic.DEFFuelQty) + Number(this.basic.reeferFuelQty);
    // this.basic.costPerGallon = Math.round(this.basic.totalAmount/units);
    this.basic.amountPaid = this.basic.totalAmount - this.basic.discount;
    this.basic.costPerGallon = Math.round(this.basic.amountPaid / units);
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
