import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../../../services/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import {
  map,
} from "rxjs/operators";
import { NgForm } from "@angular/forms";
import { from, Subject, throwError } from 'rxjs';
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import * as _ from "lodash";
import { ModalService } from "../../../../services/modal.service";
import { ListService } from "../../../../services";

import { HttpClient } from "@angular/common/http";
import { CountryStateCityService } from "src/app/services/country-state-city.service";
import {RouteManagementServiceService} from 'src/app/services/route-management-service.service'

declare var $: any;

@Component({
  selector: "app-add-fuel-entry",
  templateUrl: "./add-fuel-entry.component.html",
  styleUrls: ["./add-fuel-entry.component.css"],
})
export class AddFuelEntryComponent implements OnInit {
  @ViewChild('fuelF') fuelF: NgForm;
  takeUntil$ = new Subject();


  title = "Add Fuel Entry";
  Asseturl = this.apiService.AssetUrl;
  public fuelID;
  /********** Form Fields ***********/

  fuelData = {
    timeCreated: 0,
    unitID: "",
    driverID: "",
    fuelProvider: "Manual",
    date: "",
    time: "",
    transID: "",
    data: {
      useType: "vehicle",
      currency: "CAD",
      uom: "L",
      amt: "0",
      qty: "0",
      discAmt: "0",
      ppu: "0",
      rPpu: "0",
      rAmt: "0",
      rBeforeTax:"0",
      type: "",
      country: "",
      state: "",
      city: "",
      site: "",
      tax: [
        {
          taxCode: "",
          amount: 0,
        },
      ],
      discRate: "0",
      cardNo: "",
      odometer: "",
      excRate: "0",
    },
  };
    isSubmitted = false;
  fetchedUnitID;
  fetcheduseType;
  date: NgbDateStruct;

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
  fuelTypes = ["Diesel", "Gasoline", "Propane"];
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
  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error = "";
  Success = "";
  submitDisabled = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  sessionID:string;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    private toaster: ToastrService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private listService: ListService,
    private modalService: NgbModal,
    private modalServiceOwn: ModalService,
    private httpClient: HttpClient,
    private countryStateCity: CountryStateCityService,
    private routeManagementService:RouteManagementServiceService

  ) {
  

  
    this.selectedFileNames = new Map<any, any>();
    const date = new Date();
    this.getcurrentDate = {
      year: date.getFullYear(),
      month: 12,
      day: date.getDate(),
    };
    this.sessionID=this.routeManagementService.fuelUpdateSessionID;
  }
  

  
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  async ngOnInit() {
    this.listService.fetchVehicles();
    //this.fetchTrips();
    this.fetchAssets();
    this.fetchDrivers();
    //this.fetchFuelTypes();
    this.fetchFuelTaxes();
    this.fetchFuelDiscounts();
    this.listService.fetchVendors();

    this.fuelID = this.route.snapshot.params[`fuelID`];
    if (this.fuelID) {
      this.title = "Edit Fuel Entry";
      await this.fetchFuelEntry();
    } else {
      this.title = "Add Fuel Entry";
    }
    $(document).ready(() => {
      // this.fuelForm = $('#fuelForm').validate();
    });

    let vendorList = new Array<any>();
    //this.getValidVendors(vendorList);
    this.vendors = vendorList;

    let vehicleList = new Array<any>();
    this.getValidVehicles(vehicleList);
    this.vehicles = vehicleList;

    // trips
    // assets
    // drivers
  }

  private getValidVehicles(vehicleList: any[]) {
    let ids = [];
    this.listService.vehicleList.forEach((element) => {
      element.forEach((element2) => {
        if (
          element2.vehicleIdentification &&
          element2.isDeleted === 1 &&
          element2.vehicleID === this.fuelData.unitID
        ) {
          this.fuelData.unitID = null;
          this.fetchedUnitID = null;
        }
        if (
          element2.vehicleIdentification &&
          element2.isDeleted === 0 &&
          !ids.includes(element2.vehicleID)
        ) {
          vehicleList.push(element2);
          ids.push(element2.vehicleID);
        }
      });
    });
  }

  // private getValidVendors(vendorList: any[]) {
  //   let ids = [];
  //   this.listService.vendorList.forEach((element) => {
  //     element.forEach((element2) => {
  //       if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
  //         vendorList.push(element2);
  //         ids.push(element2.contactID);
  //       }

  //       if (element2.isDeleted === 1 && this.fuelData.vendorID === element2.contactID) {
  //         this.fuelData.vendorID = null;
  //       }
  //     })
  //   })
  // }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  // fetchVehicles() {
  //   this.apiService.getData('vehicles').subscribe((result: any) => {
  //     this.vehicles = result.Items;
  //   });
  // }
  addFuelTaxRow() {
    this.fuelData.data.tax.push({
      taxCode: null,
      amount: 0,
    });
  }
  deleteTaxRow(t) {
    this.fuelData.data.tax.splice(t, 1);
  }
  // fetchFuelTypes() {
  //   this.apiService.getData('fuelTypes').subscribe((result: any) => {
  //     this.fuelTypes = result.Items;
  //   });
  // }
  async fetchFuelTaxes() {
    await this.httpClient
      .get("assets/jsonFiles/fuel/fuelTaxes.json")
      .subscribe((result: any) => {
        this.fuelTaxes = result.Items;
      });
  }
  async fetchFuelDiscounts() {
    await this.httpClient
      .get("assets/jsonFiles/fuel/fuelDiscounts.json")
      .subscribe((result: any) => {
        this.fuelDiscounts = result.Items;
      });
  }
  fetchDrivers() {
    this.apiService.getData("drivers").subscribe((result: any) => {
      // this.drivers = result.Items;
      result.Items.forEach((element) => {
        if (element.isDeleted === 0) {
          this.drivers.push(element);
        }
      });
    });
  }
  fetchAssets() {
    this.apiService.getData("assets").subscribe((result: any) => {
      result.Items.forEach((e: any) => {
        if (e.assetType == "reefer" && e.isDeleted === 0) {
          let obj = {
            assetID: e.assetID,
            assetIdentification: e.assetIdentification,
          };
          this.reeferArray.push(obj);
        }
      });
    });
  }
  async getStates(cntryCode) {
    this.fuelData.data.state = "";
    this.fuelData.data.city = "";
    this.states = await this.countryStateCity.GetStatesByCountryCode([
      cntryCode,
    ]);
  }
  async getCities(state: any, countryCode: any) {
    this.fuelData.data.city = "";
    this.cities = await this.countryStateCity.GetCitiesByStateCodes(
      countryCode,
      state
    );
  }
  fetchVendors() {
    this.apiService.getData("vendors").subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }
  onChangeHideErrors(fieldname = "") {
    $('[name="' + fieldname + '"]')
      .removeClass("error")
      .next()
      .remove("label");
  }

  async fillCountry(countryCode, state) {
    this.states = await this.countryStateCity.GetStatesByCountryCode([
      countryCode,
    ]);
    this.cities = await this.countryStateCity.GetCitiesByStateCodes(
      countryCode,
      state
    );
  }
  onChangeuseType(value: any) {
    if (this.fuelID) {
      if (value !== this.fetcheduseType) {
        this.fuelData.unitID = null;
        this.fuelData.data.useType = value;
      } else {
        this.fuelData.unitID = this.fetchedUnitID;
        this.fuelData.data.useType = this.fetcheduseType;
      }
    } else {
      this.fuelData.data.useType = value;
      this.fuelData.unitID = null;
    }
  }
  // changeuom() {
  //   if (this.qtyUnit === 'gallon') {
  //     this.DEFqtyUnit = 'gallon';
  //   } else {
  //     this.DEFqtyUnit = 'litre';
  //   }
  // }
  changeCurrency(val) {
    this.fuelData.data.currency = val;
  }
  addFuelEntry() {
    this.hideErrors();
    this.submitDisabled = true;
    if(Number(this.fuelData.data.ppu)&& Number(this.fuelData.data.ppu)>0){
    if (this.fuelData.data.useType == "def") {
      this.fuelData.data.type = "DEF";
    }
    this.fuelData.timeCreated = new Date(
      `${this.fuelData.date}T${this.fuelData.time}`
    ).getTime();
    // append other fields
    
    this.apiService.postData("fuelEntries", this.fuelData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.submitDisabled = false;
              // this.throwErrors();
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
        this.modalServiceOwn.triggerRedirect.next(true);
          this.takeUntil$.next();
          this.takeUntil$.complete();
                    this.isSubmitted = true;
        this.toaster.success("Fuel Entry Added Successfully.");
        this.location.back();
      },
    });
  }
  else{
    this.toaster.error(`Price Per ${this.fuelData.data.uom} must be greater than 0`)
    this.submitDisabled=false
  }
  }

  throwErrors() {
    from(Object.keys(this.errors)).subscribe((v) => {
      $('[name="' + v + '"]')
        .after(
          '<label id="' +
          v +
          '-error" class="error" for="' +
          v +
          '">' +
          this.errors[v] +
          "</label>"
        )
        .addClass("error");
    });
    // this.vehicleForm.showErrors(this.errors);
  }

  hideErrors() {
    from(Object.keys(this.errors)).subscribe((v) => {
      $('[name="' + v + '"]')
        .removeClass("error")
        .next()
        .remove("label");
    });
    this.errors = {};
  }
  /*
   * Selecting files before uploading
   */
  // selectDocuments(event, obj) {
  //   let files = [...event.target.files];

  //   if (obj === 'uploadedPhotos') {
  //     this.uploadedPhotos = [];
  //     for (let i = 0; i < files.length; i++) {
  //       this.uploadedPhotos.push(files[i])
  //     }
  //   }
  // }
  /*
   * Fetch Fuel Entry details before updating
   */
  async fetchFuelEntry() {
    let result = await this.apiService
      .getData("fuelEntries/" + this.fuelID)
      .toPromise();
    // .subscribe((result: any) => {
    result = result.Items[0];
    await this.fillCountry(result.data.country, result.data.state);
    this.fuelData["data"][`fuelID`] = this.fuelID;
    (this.fuelData.data.currency = result.data.currency),
      (this.fuelData.data.useType = result.data.useType);
    this.fuelData.unitID = result.unitID;
    this.fuelData.data.uom = result.data.uom;
    this.fuelData.data.qty = result.data.qty;
    this.fuelData.data.amt = result.data.amt;
    this.fuelData.data.discAmt = result.data.discAmt;
    this.fuelData.data.ppu = result.data.ppu;
    this.fuelData.data.tax = result.data.tax;
    this.fuelData.date = result.date;
    this.fuelData.time = result.time;
    this.fuelData.data.type = result.data.type;
    this.fuelData.data.rPpu = result.data.rPpu;
    this.fuelData.data.rAmt = result.data.rAmt;
    this.fuelData.data.rBeforeTax=result.data.rBeforeTax
    this.fuelData.driverID = result.driverID;
    this.fuelData.data.cardNo = result.data.cardNo;
    this.fuelData.transID = result.transID;
    this.fuelData.data.country = result.data.country;
    this.fuelData.data.state = result.data.state;
    this.fuelData.data.site=result.data.site;
    this.fuelData.data.city = result.data.city;
    this.fuelData.data.odometer = result.data.odometer;
    this.existingPhotos = result.data.uploadedPhotos;
    this.fetchedUnitID = result.unitID;
    this.fetcheduseType = result.data.useType;
  }
  // deleteImage(i: number) {
  //   this.fuelData.uploadedPhotos.splice(i, 1);
  //   this.fuelEntryImages.splice(i, 1);
  // }
  updateFuelEntry() {
    this.submitDisabled = true;
    this.hideErrors();
    this.fuelData.timeCreated = new Date(
      `${this.fuelData.date}T${this.fuelData.time}`
    ).getTime();
    this.apiService.putData("fuelEntries", this.fuelData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.submitDisabled = false;
              // this.throwErrors();
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
        
        this.modalServiceOwn.triggerRedirect.next(true);
          this.takeUntil$.next();
          this.takeUntil$.complete();
                    this.isSubmitted = true;
                    
        this.toaster.success("Fuel Entry Updated successfully");
        this.cancel();
      },
    });
  }

  // delete uploaded images and documents
  delete(name: string) {
    this.apiService
      .deleteData(`fuelEntries/uploadDelete/${this.fuelID}/${name}`)
      .subscribe((result: any) => {
        this.toaster.success("Successfully deleted");
      });
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem("isOpen", "true");
    this.listService.changeButton(false);
  }
  refreshVendorData() {
    this.listService.fetchVendors();
  }
}
