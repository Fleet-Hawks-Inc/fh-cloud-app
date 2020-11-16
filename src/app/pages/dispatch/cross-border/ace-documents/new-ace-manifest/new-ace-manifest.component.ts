import { Component, OnInit, Injectable } from '@angular/core';
import { ApiService } from '../../../../../services';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbTimeStruct, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { from, Subject, throwError } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CostExplorer } from 'aws-sdk/clients/all';
declare var $: any;
/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '-';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}
const pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;
/**
 * Example of a String Time adapter
 */
@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {

  fromModel(value: string | null): NgbTimeStruct | null {
    if (!value) {
      return null;
    }
    const split = value.split(':');
    return {
      hour: parseInt(split[0], 10),
      minute: parseInt(split[1], 10),
      second: parseInt(split[2], 10)
    };
  }

  toModel(time: NgbTimeStruct | null): string | null {
    return time != null ? `${pad(time.hour)}:${pad(time.minute)}:${pad(time.second)}` : null;
  }
}
@Component({
  selector: 'app-new-ace-manifest',
  templateUrl: './new-ace-manifest.component.html',
  styleUrls: ['./new-ace-manifest.component.css'],
  providers: [
    { provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter },
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class NewAceManifestComponent implements OnInit {
  public entryID;
  title = 'Add ACE e-Manifest';
  vehicleID: string;
  vehicleData = [];
  vehicles = [];
  assets = [];
  trips = [];
  drivers = [];
  data: string;
  sendId: string;
  companyKey: string;
  operation: string;
  usPortOfArrival: string;
  estimatedArrivalDateTime: string;
  truck: {
    number: '',
    type: '',
    vinNumber: '',
    // insurancePolicy: {
    //   insuranceCompanyName: '',
    //   policyNumber: '',
    //   issuedDate: '',
    //   policyAmount: ''
    // },
    licensePlate: {
      number: '',
      stateProvince: any,
    },
    sealNumbers: [],
    cargoExemptions: []

  };
  vehicleNumber: string;
  vehicleType: string;
  vinNumber: string;
  LicencePlatenumber: string;
  vehicleLicenceProvince: string;
  vehicleSeals: any = [];
  tags = [];
  ETA: string;
  estimatedArrivalDate: string;
  // time: NgbTimeStruct;
  assetArray = [];
  assetSeals = [];
  trailerSeals: any = [];
  assetTags = [];
  assetId = [];
  driverIdArray = [];
  driverArray = [];
  estimatedArrivalTime: string;
  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  USports: any = [];
  documentTypeList: any = [];
  shipmentTypeList: any = [];
  timeList: any = [];
  cargoExemptionsList: any = [];
  truckcargoExemptions: [];
  tripNumber: string;
  SCAC: string;
  tripNo: string;
  SCACShipment: string;
  shipmentInput: string;
  shipmentControlNumber: string;
  provinceOfLoading: string;
  states: any = [];
  countries: any = [];
  packagingUnitsList: any = [];
  addTrailerBtn = true;
  assetsArray = [
    {
      assetId: '',
      cargoExemptions: [],
      sealNumbers: []
    }
  ];
  trailers = [
    {
      assetId: '',
      number: '',
      type: '',
      cargoExemptions: [],
      licensePlate: {
        number: '',
        stateProvince: ''
      },
      sealNumbers: []
    }
  ];
  passengers = [{
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    citizenshipCountry: '',
    fastCardNumber: '',
    travelDocuments: [{
      type: '',
      number: '',
      country: '',
      stateProvince: ''
    }]
  }];
  passengerDocStates = [];
  shipments = [
    {
      data: 'ACE_SHIPMENT',
      sendId: '001',
      companyKey: 'c-9000-2bcd8ae5954e0c48',
      operation: 'CREATE',
      type: '',
      shipmentControlNumber: '',
      provinceOfLoading: '',
      SCAC: '',
      shipper: {
        name: 'Art place',
        address: {
          addressLine: '1234 Vancity',
          city: 'Vancouver',
          stateProvince: 'BC',
          postalCode: 'V6H 3J9'
        }
      },
      consignee: {
        name: 'Elk Corp of Texas',
        address: {
          addressLine: '401 Weavertown Rd',
          city: 'Myerstown',
          stateProvince: 'PA',
          postalCode: '17067'
        }
      },
      commodities: [{
        loadedOn: {
          type: '',
          number: ''
        },
        description: '',
        quantity: '',
        packagingUnit: '',
        weight: '',
        weightUnit: '',
        marksAndNumbers: [],
        c4LineReleaseNumber: '',
        harmonizedCode: '',
        value: '',
        countryOfOrigin: '',
        hazmatDetails: {
          unCode: '',
          emergencyContactName: '',
          contactPhone: '',
          contactEmail: ''
        }
      }]
    }
  ];
  addShipment() {
    this.shipments.push({
      data: 'ACE_SHIPMENT',
      sendId: '001',
      companyKey: 'c-9000-2bcd8ae5954e0c48',
      operation: 'CREATE',
      type: '',
      shipmentControlNumber: '',
      provinceOfLoading: '',
      SCAC: '',
      shipper: {
        name: 'Art place',
        address: {
          addressLine: '1234 Vancity',
          city: 'Vancouver',
          stateProvince: 'BC',
          postalCode: 'V6H 3J9'
        }
      },
      consignee: {
        name: 'Elk Corp of Texas',
        address: {
          addressLine: '401 Weavertown Rd',
          city: 'Myerstown',
          stateProvince: 'PA',
          postalCode: '17067'
        }
      },
      commodities: [{
        loadedOn: {
          type: '',
          number: ''
        },
        description: '',
        quantity: '',
        packagingUnit: '',
        weight: '',
        weightUnit: '',
        marksAndNumbers: [],
        c4LineReleaseNumber: '',
        harmonizedCode: '',
        value: '',
        countryOfOrigin: '',
        hazmatDetails: {
          unCode: '',
          emergencyContactName: '',
          contactPhone: '',
          contactEmail: ''
        }
      }]
    });
  }
  deleteShipment(i: number) {
    this.shipments.splice(i, 1);
  }
  // commodities =
  //   [{
  //     loadedOn: {
  //       type: '',
  //       number: ''
  //     },
  //     description: '',
  //     quantity: '',
  //     packagingUnit: '',
  //     weight: '',
  //     weightUnit: '',
  //     marksAndNumbers: [],
  //     c4LineReleaseNumber: '',
  //     harmonizedCode: '',
  //     value: '',
  //     countryOfOrigin: '',
  //     hazmatDetails: {
  //       unCode: '',
  //       emergencyContactName: '',
  //       contactPhone: '',
  //       contactEmail: ''
  //     }
  //   }];
  marks1: string;
  marks2: string;
  marks3: string;
  marks4: string;
  marksArray = [];
  loadedType = 'TRAILER';
  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute, private toastr: ToastrService,
    private apiService: ApiService, private ngbCalendar: NgbCalendar, private location: Location,
    config: NgbTimepickerConfig, private dateAdapter: NgbDateAdapter<string>) {
    config.seconds = true;
    config.spinners = true;
  }

  ngOnInit() {
    this.entryID = this.route.snapshot.params['entryID'];
    if (this.entryID) {
      this.title = 'Edit ACE e-Manifest';
      this.fetchACEEntry();
    } else {
      this.title = 'Add ACE e-Manifest';
    }
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchTrips();
    this.fetchDrivers();
    this.fetchCountries();
    this.getStates();
    this.httpClient.get('assets/USports.json').subscribe(data => {
      // console.log('Data', data);
      this.USports = data;
    });
    this.httpClient.get('assets/manifestETA.json').subscribe(data => {
      this.timeList = data;
    });
    this.httpClient.get('assets/ACEShipmentType.json').subscribe(data => {
      // console.log('Shipment Data', data);
      this.shipmentTypeList = data;
    });
    this.httpClient.get('assets/packagingUnit.json').subscribe(data => {
      // console.log('Packaging Data', data);
      this.packagingUnitsList = data;
    });
    this.httpClient.get('assets/travelDocumentType.json').subscribe(data => {
      // console.log('Document  Data', data);
      this.documentTypeList = data;
    });
    this.httpClient.get('assets/ACIcargoExemption.json').subscribe(data => {
      this.cargoExemptionsList = data;
      console.log('cargoExemptionsList', this.cargoExemptionsList);
    });
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  getMarksArray(e) {
    //   this.commodities['marksAndNumbers'].forEach(element => {
    //    console.log('element', element);
    //  });
  }
  addTrailer() {
    this.assetsArray.push({
      assetId: '',
      cargoExemptions: [],
      sealNumbers: []
    });
    this.trailers.push({
      assetId: '',
      number: '',
      type: '',
      cargoExemptions: [],
      licensePlate: {
        number: '',
        stateProvince: ''
      },
      sealNumbers: []
    });
    this.addTrailerBtn = true;

    if (this.assetsArray.length >= 3) {
      this.addTrailerBtn = false;
    }
    else {
      this.addTrailerBtn = true;
    }
  }
  deleteTrailer(i: number) {
    this.trailers.splice(i, 1);
    this.assetsArray.splice(i, 1);
    this.addTrailerBtn = true;
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
      // console.log('vehicles in init', this.vehicles);
    });
  }
  getStatesDoc(i, j) {
    const countryID = this.passengers[i].travelDocuments[j].country;
    console.log('country Id', countryID);
    this.apiService.getData('states/country/' + countryID)
      .subscribe((result: any) => {
        this.passengerDocStates = result.Items;
        console.log('this.states', this.passengerDocStates);
      });
  }
  addMorePassenger() {
    this.passengers.push({
      firstName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      citizenshipCountry: '',
      fastCardNumber: '',
      travelDocuments: [{
        type: '',
        number: '',
        country: '',
        stateProvince: ''
      }]
    });
  }
  deletePassenger(i: number) {
    this.passengers.splice(i, 1);
  }
  addDocument(i) {
    this.passengers[i].travelDocuments.push({
      type: '',
      number: '',
      country: '',
      stateProvince: ''
    });
  }
  deleteDocument(i: number, p: number) {
    this.passengers[p].travelDocuments.splice(i, 1);
  }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
      console.log('assets', this.assets);
    });
  }
  fetchTrips() {
    this.apiService.getData('trips').subscribe((result: any) => {
      this.trips = result.Items;
      //  console.log('TRIPS', this.trips);
    });
  }
  fetchDrivers() {
    this.apiService.getData('drivers').subscribe((result: any) => {
      this.drivers = result.Items;
      //  console.log('Drivers', this.drivers);
    });
  }
  tripNumberFn() {
    this.tripNumber = this.SCAC + this.tripNo;
  }
  shipmentNumberFn() {
    this.shipmentControlNumber = this.SCACShipment + this.shipmentInput;
  }
  async fetchStateCode(ID) {
    const code = await this.apiService.getData('states/' + ID).toPromise();
    return code.Items[0].stateCode;
  }
  fetchVehicleData(ID) {
    this.apiService.getData('vehicles/' + ID).subscribe(async (result: any) => {
      this.vehicleData = result.Items;


      // let state =  
      // console.log(state);
      this.truck = {
        number: this.vehicleData[0].vehicleIdentification,
        type: this.vehicleData[0].vehicleType,
        vinNumber: this.vehicleData[0].VIN,
        // dotNumber: this.vehicleData[0].VIN,
        // insurancePolicy: {
        //   insuranceCompanyName: this.vehicleData[0].insurance.vendorID,
        //   policyNumber: this.vehicleData[0].insurance.vendorID,
        //   issuedDate: this.vehicleData[0].insurance.dateOfIssue,
        //   policyAmount: this.vehicleData[0].insurance.premiumAmount
        // },
        licensePlate: {
          number: this.vehicleData[0].plateNumber,
          stateProvince: await this.fetchStateCode(result.Items[0].stateID),
        },
        sealNumbers: this.vehicleSeals,
        cargoExemptions: this.truckcargoExemptions
      };
      console.log(this.truck);
    });
  }
  setTruckCargoExemption() {
    this.truck.cargoExemptions = this.truckcargoExemptions;
  }
  deleteCommodity(i: number, s: number) {
    this.shipments[s].commodities.splice(i, 1);
  }
  addPassenger() {
    console.log('add passenger', this.passengers);
  }
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }
  addCommodity(i) {
    this.shipments[i].commodities.push({
      loadedOn: {
        type: '',
        number: ''
      },
      description: '',
      quantity: '',
      packagingUnit: '',
      weight: '',
      weightUnit: '',
      marksAndNumbers: [],
      c4LineReleaseNumber: '',
      harmonizedCode: '',
      value: '',
      countryOfOrigin: '',
      hazmatDetails: {
        unCode: '',
        emergencyContactName: '',
        contactPhone: '',
        contactEmail: ''
      }
    });
    // console.log('commodity', this.commodities);
  }
  getStates() {
    // console.log('hello states');
    // console.log(this.countries);
    // let countryID = [];
    // countryID =  this.countries.filter(c => c.countryName === 'Canada');
    const countryID = '8e8a0700-8979-11ea-94e8-ddabdd2e57f0';
    this.apiService.getData('states/country/' + countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
        console.log('this.states', this.states);
      });
  }
  loadedOnFn(e) {
    if (e === 'TRUCK') {
      this.loadedType = 'TRUCK';
    }
    else {
      this.loadedType = 'TRAILER';
    }
  }
  onTagsChanged(e) {
    if (e.change === 'add') {
      this.vehicleSeals.push(e.tag.displayValue);
    }
    else {
      for (let i = this.vehicleSeals.length; i--;) {
        if (this.vehicleSeals[i] === e.tag.displayValue) {
          this.vehicleSeals.splice(i, 1);
        }
      }
    }
    console.log('vehicle seals', this.vehicleSeals);
    this.truck.sealNumbers = this.vehicleSeals;
    console.log('truck seals', this.tags);
  }
  onTagsChangedAsset(e, t) {
    if (e.change === 'add') {
      this.trailerSeals.push(e.tag.displayValue);
    }
    else {
      for (let i = this.trailerSeals.length; i--;) {
        if (this.trailerSeals[i] === e.tag.displayValue) {
          this.trailerSeals.splice(i, 1);
        }
      }
    }
    this.trailers[t].sealNumbers = this.trailerSeals;
    console.log('asset seals', this.trailers[t].sealNumbers);
  }
 
  trailerExemptionFn(t) {
    this.trailers[t].cargoExemptions = this.assetsArray[t].cargoExemptions;
  }
  async getAssetData(e, t) {
    console.log('e', e);
    console.log('t', t);
    let testArray = [];
    testArray = this.assets.filter(a => a.assetID === e);
    console.log('test asset', testArray);
    this.trailers[t].assetId = testArray[0].assetID,
      this.trailers[t].number = testArray[0].assetIdentification,
      this.trailers[t].type = testArray[0].assetDetails.assetType,
      this.trailers[t].licensePlate = {
        number: testArray[0].assetDetails.licencePlateNumber,
        stateProvince: await this.fetchStateCode(testArray[0].assetDetails.licenceStateID)
      };
  }
  marksArrayFn() {
    //this.marksArray = [];
    // this.commodities['marksAndNumbers'].push(this.marks1);
    // this.commodities['marksAndNumbers'].push(this.marks2);
    // this.commodities['marksAndNumbers'].push(this.marks3);
    // this.commodities['marksAndNumbers'].push(this.marks4);
    // // this.commodities.marksAndNumbers.push(this.marks1);
    // // this.marksArray.push(this.marks2);
    // // this.marksArray.push(this.marks3);
    // // this.marksArray.push(this.marks4);
    // console.log('marks', this.commodities)
  }
  async getDriverData(e) {
    let testArray = [];
    this.driverArray = [];
    for (let i = 0; i < e.length; i++) {
      let docsArray = [];
      testArray = this.drivers.filter(d => d.driverID === e[i]);
      console.log('driver data', testArray);
      for (let j = 0; j < testArray[0].documentDetails.length; j++) {
        const test1 = testArray[0].documentDetails;
        const docData = {
          number: test1[j].document,
          type: test1[j].documentType,
          stateProvince: await this.fetchStateCode(test1[j].issuingState),
          country: test1[j].issuingCountry
        };
        docsArray.push(docData);
      }
      const data = {
        driverId: testArray[0].driverID,
        driverNumber: testArray[0].employeeId !== ' ' ? testArray[0].employeeId : testArray[0].companyId,
        firstName: testArray[0].firstName,
        lastName: testArray[0].lastName,
        gender: testArray[0].gender,
        dateOfBirth: testArray[0].licenceDetails.DOB,
        citizenshipCountry: testArray[0].citizenship,
        fastCardNumber: testArray[0].crossBorderDetails.fast_ID,
        travelDocuments: docsArray
      };
      this.driverArray.push(data);
    }
  }
  addACEManifest() {
    console.log('asset array', this.assetArray);
    const data = {
      data: 'ACE_TRIP',
      sendId: '001',
      companyKey: 'c-9000-2bcd8ae5954e0c48',
      operation: 'CREATE',
      SCAC: this.SCAC,
      tripNumber: this.tripNumber,
      usPortOfArrival: this.usPortOfArrival,
      estimatedArrivalDate: this.estimatedArrivalDate,
      estimatedArrivalTime: this.estimatedArrivalTime,
      truck: this.truck,
      trailers: this.trailers,
      drivers: this.driverArray,
      passengers: this.passengers,
      shipments: this.shipments,
      autoSend: false
    };
    console.log('Data', data);return;
    this.apiService.postData('ACEeManifest', data).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              // this.spinner.hide(); // loader hide
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.toastr.success('Manifest added successfully');
        this.router.navigateByUrl('/dispatch/cross-border/eManifests');

      },
    });
  }
  throwErrors() {
    this.form.showErrors(this.errors);
  }
  getVehicleId(VIN) {
    let test = [];
    test = this.vehicles.filter(v => v.VIN === VIN);
    this.vehicleID = test[0].vehicleID;

  }
  getDriverIdArray(drivers: any) {
    let test1 = [];
    for (let i = 0; i < drivers.length; i++) {
      test1.push(drivers[i].driverId);
    }
    this.driverIdArray = test1;
  }
  getAssetArray(assets: any) {
    console.log('assets fetched', assets.length);

    for (let i = 0; i < assets.length; i++) {
      let sealArray = [];
      const seals = assets[i].sealNumbers.length;
      for (let j = 0; j < assets[i].sealNumbers.length; j++) {
       let seals = {
          displayValue: assets[i].sealNumbers[j]
        }
        sealArray.push(seals);
      }
      console.log('cargo exemption', assets[i].cargoExemptions);
      const test = {
        assetId: assets[i].assetId,
        cargoExemptions: assets[i].cargoExemptions,
        sealNumbers: sealArray
      };
      this.trailerSeals = assets[i].sealNumbers;
      this.assetsArray.push(test);

    }
    console.log('assets array fetched', this.assetsArray);
  }

  getTruckSeals(seals: any) {
    for (let i = 0; i < seals.length; i++) {
      this.tags.push({
        'displayValue': seals[i]
      });
    }
  }
  fetchACEEntry() {
    this.apiService
      .getData('ACEeManifest/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('Fetched Data', result);
        this.entryID = this.entryID;
        this.data = result.data,
          this.sendId = result.sendId,
          this.companyKey = result.companyKey,
          this.operation = result.operation,
          this.SCAC = result.SCAC,
          this.tripNumber = result.tripNumber,
          this.usPortOfArrival = result.usPortOfArrival,
          this.estimatedArrivalDate = result.estimatedArrivalDate,
          this.estimatedArrivalTime = result.estimatedArrivalTime,
          this.truck = result.truck,
          this.driverArray = result.drivers,
          this.trailers = result.trailers,
          this.passengers = result.passengers,
          this.shipments = result.shipments,
          setTimeout(() => {
            this.getVehicleId(result.truck.vinNumber);
            this.vehicleSeals = result.truck.sealNumbers,
            this.truckcargoExemptions = result.truck.cargoExemptions,
              this.getTruckSeals(result.truck.sealNumbers),
              this.getDriverIdArray(result.drivers);
            this.getAssetArray(result.trailers);
            //  this.getShipmentData(result.shipments);
          }, 2000);

      });
  }
  updateACEManifest() {
    console.log('asset array', this.assetArray);
    const data = {
      entryID: this.entryID,
      data: 'ACE_TRIP',
      sendId: '001',
      companyKey: 'c-9000-2bcd8ae5954e0c48',
      operation: 'UPDATE',
      SCAC: this.SCAC,
      tripNumber: this.tripNumber,
      usPortOfArrival: this.usPortOfArrival,
      estimatedArrivalDate: this.estimatedArrivalDate,
      estimatedArrivalTime: this.estimatedArrivalTime,
      truck: this.truck,
      trailers: this.trailers,
      drivers: this.driverArray,
      passengers: this.passengers,
      shipments: this.shipments,
      autoSend: false
    };
    console.log('Data', data);return;
    this.apiService.putData('ACEeManifest', data).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              // this.spinner.hide(); // loader hide
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.toastr.success('Manifest Updated successfully');
        this.router.navigateByUrl('/dispatch/cross-border/eManifests');

      },
    });
  }
}
