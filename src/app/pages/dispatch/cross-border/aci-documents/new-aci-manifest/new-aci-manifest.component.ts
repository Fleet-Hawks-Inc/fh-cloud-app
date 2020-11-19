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
  selector: 'app-new-aci-manifest',
  templateUrl: './new-aci-manifest.component.html',
  styleUrls: ['./new-aci-manifest.component.css'],
  providers: [
    { provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter },
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class NewAciManifestComponent implements OnInit {
  public entryID;
  title = 'Add ACI e-Manifest';
  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  countryID = '73cba1a0-8977-11ea-b61f-0996be58fec9';
  countries: any = [];
  stateID: string;
  states: any = [];
  cities: any = [];
  CANPorts: any = [];
  trips: any = [];
  vehicles: any = [];
  vehicleData: any = [];
  // assetArray: any = [];
  assets: any = [];
  drivers: any = [];
  driverIdArray: any = [];
  driverArray: any = [];
  ACIReleaseOfficeList: any = [];
  timeList: any = [];
  cityList: any = [];
  subLocationsList: any = [];
  vehicleSeals: any = [];
  cargoExemptionsList: any = [];
  documentTypeList: any = [];
  status: string;
  CCC: string;
  tripNo: string;
  truckcargoExemptions: [];
  assetSeals: any = [];
  addTrailerBtn = true;
  data: string;
  sendId: string;
  companyKey: string;
  operation: string;
  tripNumber: string;
  portOfEntry: string;
  subLocation: string;
  estimatedArrivalDate: '';
  estimatedArrivalTime: '';
  estimatedArrivalTimeZone: '';
  estimatedArrivalDateTime: string;
  truck = {
    truckId: '',
    number: '',
    type: '',
    vinNumber: '',
    dotNumber: '',
    insurancePolicy: {
      insuranceCompanyName: '',
      policyNumber: '',
      issuedDate: '',
      policyAmount: ''
    },
    licensePlate: {
      number: '',
      stateProvince: '',
    },
    sealNumbers1: '',
    sealNumbers2: '',
    sealNumbers3: '',
    sealNumbers4: '',
    cargoExemptions: []
      };
  assetsArray = [
    {
      assetId: '',
      cargoExemptions: [],
      sealNumbers1: '',
      sealNumbers2: '',
      sealNumbers3: '',
      sealNumbers4: '',
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
      sealNumbers1: '',
      sealNumbers2: '',
      sealNumbers3: '',
      sealNumbers4: '',
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
  containers = [
    {
      loadedOn: {
        type: '',
        number: ''
      },
      number: '',
      cargoExemptions: [],
      sealNumbers1: '',
      sealNumbers2: '',
      sealNumbers3: '',
      sealNumbers4: '',
    }
  ];

  passengerDocStates = [];
  shipments = [
    {
      data: 'ACI_SHIPMENT',
      sendId: '001',
      companyKey: '56eh67867jti678i9',
      operation: 'CREATE',
      shipmentType: '',
      loadedOn: {
        type: '',
        number: ''
      },
      CCC: '',
      cargoControlNumber: '',
      referenceOnlyShipment: 'ref',
      portOfEntry: '',
      releaseOffice: '',
      subLocation: '',
      importerCsaBusinessNumber: '',
      estimatedArrivalDate: '',
      estimatedArrivalTime: '',
      estimatedArrivalTimeZone: '',
      cityOfLoading: {
        cityName: '',
        stateProvince: ''
      },
      cityOfAcceptance: {
        cityName: '',
        stateProvince: ''
      },
      consolidatedFreight: 'hi',
      specialInstructions: '',
      shipper: {
        name: 'Elk Corp of Texas',
        address: {
          addressLine: '401 Weavertown Rd',
          city: 'Myerstown',
          stateProvince: 'PA',
          postalCode: '17067'
        },
        contactNumber: 'tytuy',
      },
      consignee: {
        name: 'Elk Corp of Texas',
        address: {
          addressLine: '401 Weavertown Rd',
          city: 'Myerstown',
          stateProvince: 'PA',
          postalCode: '17067'
        },
        contactNumber: 'ggry',
      },
      commodities: [
        {
          description: '',
          quantity: '',
          packagingUnit: '',
          weight: '',
          weightUnit: '',
          marksAndNumbers: '',
          hazmatDetails: {
            unCode: '',
            emergencyContactName: '',
            contactPhone: '',
            handlingInstructions: ''
          }
        }
      ]
    }
  ];
  packagingUnitsList: any = [];
  loadedType = 'TRAILER';
  containerLoaded = 'TRAILER';
  shipmentTypeList: any = [];
  CCCShipment: string;
  cargoControlNumberInput: string;
  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute, private toastr: ToastrService,
    private apiService: ApiService, private ngbCalendar: NgbCalendar, private location: Location,
    config: NgbTimepickerConfig, private dateAdapter: NgbDateAdapter<string>) {
    config.seconds = true;
    config.spinners = true;
  }

  ngOnInit() {
    this.entryID = this.route.snapshot.params['entryID'];
    if (this.entryID) {
      this.title = 'Edit ACI e-Manifest';
      this.fetchACIEntry();
    } else {
      this.title = 'Add ACI e-Manifest';
    }
    this.fetchTrips();
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.fetchCountries();
    this.fetchStates();
    this.fetchCities();
    if (this.entryID) {
      this.title = 'Edit ACE e-Manifest';
      // this.fetchACEEntry();
    } else {
      this.title = 'Add ACE e-Manifest';
    }
    this.httpClient.get('assets/canadianPorts.json').subscribe(data => {
      this.CANPorts = data;
    });
    this.httpClient.get('assets/packagingUnit.json').subscribe(data => {
      // console.log('Packaging Data', data);
      this.packagingUnitsList = data;
    });
    this.httpClient.get('assets/travelDocumentType.json').subscribe(data => {
      // console.log('Document  Data', data);
      this.documentTypeList = data;
    });
    this.httpClient.get('assets/ACIShipmentType.json').subscribe(data => {
      // console.log('Shipment Data', data);
      this.shipmentTypeList = data;
    });
    this.httpClient.get('assets/ACIReleaseOffice.json').subscribe(data => {
      this.ACIReleaseOfficeList = data;
    });
    this.httpClient.get('assets/manifestETA.json').subscribe(data => {
      this.timeList = data;
    });
    this.httpClient.get('assets/ACIsubLocations.json').subscribe(data => {
      this.subLocationsList = data;
    });
    this.httpClient.get('assets/ACIcargoExemption.json').subscribe(data => {
      this.cargoExemptionsList = data;
      console.log('cargoExemptionsList', this.cargoExemptionsList);
    });
  }
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
        //console.log(this.countries);
      });
  }
  fetchStates() {
    const countryID = '73cba1a0-8977-11ea-b61f-0996be58fec9';
    this.apiService.getData('states/country/' + countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
        // console.log(this.states);
      });
  }
  fetchCities() {
    this.apiService.getData('cities')
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }
  fetchTrips() {
    this.apiService.getData('trips').subscribe((result: any) => {
      this.trips = result.Items;
      //  console.log('TRIPS', this.trips);
    });
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
      console.log('vehicles in init', this.vehicles);
    });
  }
  truckSealArray() {
    this.truck.sealNumbers1 = this.truck.sealNumbers1;
    this.truck.sealNumbers2 = this.truck.sealNumbers2;
    this.truck.sealNumbers3 = this.truck.sealNumbers3;
    this.truck.sealNumbers4 = this.truck.sealNumbers4;
  }
  async fetchStateCode(ID) {
    const code = await this.apiService.getData('states/' + ID).toPromise();
    return code.Items[0].stateCode;
  }
  fetchVehicleData(ID) {
    this.apiService.getData('vehicles/' + ID).subscribe(async (result: any) => {
      this.vehicleData = result.Items;
      this.truck = {
        truckId : ID,
        number: this.vehicleData[0].vehicleIdentification,
        type: this.vehicleData[0].vehicleType,
        vinNumber: this.vehicleData[0].VIN,
        dotNumber: this.vehicleData[0].VIN,
        insurancePolicy: {
          insuranceCompanyName: this.vehicleData[0].insurance.vendorID,
          policyNumber: this.vehicleData[0].insurance.vendorID,
          issuedDate: this.vehicleData[0].insurance.dateOfIssue,
          policyAmount: this.vehicleData[0].insurance.premiumAmount
        },
        licensePlate: {
          number: this.vehicleData[0].plateNumber,
          stateProvince: await this.fetchStateCode(result.Items[0].stateID),
        },
        sealNumbers1: this.truck.sealNumbers1,
        sealNumbers2: this.truck.sealNumbers2,
        sealNumbers3: this.truck.sealNumbers3,
        sealNumbers4: this.truck.sealNumbers4,
        cargoExemptions: this.truckcargoExemptions
      };
      console.log(this.truck);
    });
  }
  setTruckCargoExemption() {
    this.truck.cargoExemptions = this.truckcargoExemptions;
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
     },
     this.trailers[t].sealNumbers1 = this.assetsArray[t].sealNumbers1,
     this.trailers[t].sealNumbers2 = this.assetsArray[t].sealNumbers2,
     this.trailers[t].sealNumbers3 = this.assetsArray[t].sealNumbers3,
     this.trailers[t].sealNumbers4 = this.assetsArray[t].sealNumbers4,
     this.trailers[t].cargoExemptions = this.assetsArray[t].cargoExemptions;
 }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
      console.log('assets', this.assets);
    });
  }
  trailerSealArray(t) {
    this.trailers[t].sealNumbers1 = this.assetsArray[t].sealNumbers1;
    this.trailers[t].sealNumbers2 = this.assetsArray[t].sealNumbers2;
    this.trailers[t].sealNumbers3 = this.assetsArray[t].sealNumbers3;
    this.trailers[t].sealNumbers4 = this.assetsArray[t].sealNumbers4;
  }
  fetchDrivers() {
    this.apiService.getData('drivers').subscribe((result: any) => {
      this.drivers = result.Items;
      //  console.log('Drivers', this.drivers);
    });
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
  addContainer() {
    this.containers.push({
      loadedOn: {
        type: '',
        number: ''
      },
      number: '',
      cargoExemptions: [],
      sealNumbers1: '',
      sealNumbers2: '',
      sealNumbers3: '',
      sealNumbers4: '',
    });
  }
  deleteContainer(i: number) {
    this.containers.splice(i, 1);
  }
  addTrailer() {
    this.assetsArray.push({
      assetId: '',
      cargoExemptions: [],
      sealNumbers1: '',
      sealNumbers2: '',
      sealNumbers3: '',
      sealNumbers4: '',
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
      sealNumbers1: '',
    sealNumbers2: '',
    sealNumbers3: '',
    sealNumbers4: '',
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


  trailerExemptionFn(t) {
    this.trailers[t].cargoExemptions = this.assetsArray[t].cargoExemptions;
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
  addPassenger() {
    console.log('add passenger', this.passengers);
  }
  deletePassenger(i: number) {
    this.passengers.splice(i, 1);
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
  addCommodity(i) {
    this.shipments[i].commodities.push({
      description: '',
      quantity: '',
      packagingUnit: '',
      weight: '',
      weightUnit: '',
      marksAndNumbers: '',
      hazmatDetails: {
        unCode: '',
        emergencyContactName: '',
        contactPhone: '',
        handlingInstructions: '',
      }
    });
    // console.log('commodity', this.commodities); 
  }
  deleteCommodity(i: number, s: number) {
    this.shipments[s].commodities.splice(i, 1);
  }
  addShipment() {
    this.shipments.push({
      data: 'ACI_SHIPMENT',
      sendId: '001',
      companyKey: '56eh67867jti678i9',
      operation: 'CREATE',
      shipmentType: '',
      loadedOn: {
        type: '',
        number: ''
      },
      CCC: '',
      cargoControlNumber: '',
      referenceOnlyShipment: 'false',
      portOfEntry: '',
      releaseOffice: '',
      subLocation: '',
      importerCsaBusinessNumber: '',
      estimatedArrivalDate: '',
      estimatedArrivalTime: '',
      estimatedArrivalTimeZone: '',
      cityOfLoading: {
        cityName: '',
        stateProvince: ''
      },
      cityOfAcceptance: {
        cityName: '',
        stateProvince: ''
      },
      consolidatedFreight: 'false',
      specialInstructions: '',
      shipper: {
        name: 'Elk Corp of Texas',
        address: {
          addressLine: '401 Weavertown Rd',
          city: 'Myerstown',
          stateProvince: 'PA',
          postalCode: '17067'
        },
        contactNumber: 'tytuy',
      },
      consignee: {
        name: 'Elk Corp of Texas',
        address: {
          addressLine: '401 Weavertown Rd',
          city: 'Myerstown',
          stateProvince: 'PA',
          postalCode: '17067'
        },
        contactNumber: 'ggry',
      },
      commodities: [
        {
          description: '',
          quantity: '',
          packagingUnit: '',
          weight: '',
          weightUnit: '',
          marksAndNumbers: '',
          hazmatDetails: {
            unCode: '',
            emergencyContactName: '',
            contactPhone: '',
            handlingInstructions: '',
          }
        }
      ]
    });
  }
  deleteShipment(i: number) {
    this.shipments.splice(i, 1);
  }
  loadedOnFn(e) {
    if (e === 'TRUCK') {
      this.loadedType = 'TRUCK';
    }
    else if (e === 'CONTAINER') {
      this.loadedType = 'CONTAINER';
    }
    else {
      this.loadedType = 'TRAILER';
    }
  }
  loadedOnContainerFn(e, c) {
    console.log('loaded on in fn', e);
    if (e === 'TRUCK') {
      this.containers[c].loadedOn.type = 'TRUCK';
      this.containerLoaded = this.containers[c].loadedOn.type;
    }
    else {
      this.containers[c].loadedOn.type = 'TRAILER';
      this.containerLoaded = this.containers[c].loadedOn.type;
    }
  }

  addACIManifest() {
    const data = {
      data: 'ACI_TRIP',
      sendId: '001',
      companyKey: 'c-9000-2bcd8ae5954e0c48',
      operation: 'CREATE',
      CCC: this.CCC,
      tripNumber: this.tripNumber,
      portOfEntry: this.portOfEntry,
      subLocation: this.subLocation,
      estimatedArrivalDate: this.estimatedArrivalDate,
      estimatedArrivalTime: this.estimatedArrivalTime,
      estimatedArrivalTimeZone: this.estimatedArrivalTimeZone,
      truck: this.truck,
      trailers: this.trailers,
      drivers: this.driverArray,
      passengers: this.passengers,
      containers: this.containers,
      shipments: this.shipments,
      status: 'Draft'
    };
    console.log('Data', data);
    this.apiService.postData('ACIeManifest', data).subscribe({
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
  getDriverIdArray(drivers: any) {
    let test1 = [];
    for (let i = 0; i < drivers.length; i++) {
      test1.push(drivers[i].driverId);
    }
    this.driverIdArray = test1;
  }
  getAssetArray(assets: any) {
    console.log('assets fetched', assets.length);
    this.assetsArray = [];
    for(let i=0; i< assets.length; i++){
      const data =  {
        assetId: assets[i].assetId,
        sealNumbers1: assets[i].sealNumbers1,
        sealNumbers2: assets[i].sealNumbers2,
        sealNumbers3: assets[i].sealNumbers3,
        sealNumbers4: assets[i].sealNumbers4,
        cargoExemptions: assets[i].cargoExemptions
      };
      this.assetsArray.push(data);
    }
  }
  fetchACIEntry() {
    this.apiService
      .getData('ACIeManifest/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('Fetched Data', result);
        this.entryID = this.entryID;
        this.data = result.data,
          this.sendId = result.sendId,
          this.companyKey = result.companyKey,
          this.operation = result.operation,
          this.CCC = result.CCC,
          this.tripNumber = result.tripNumber,
          this.portOfEntry = result.portOfEntry,
          this.subLocation = result.subLocation,
          this.estimatedArrivalDate = result.estimatedArrivalDate,
          this.estimatedArrivalTime = result.estimatedArrivalTime,
          this.estimatedArrivalTimeZone = result.estimatedArrivalTimeZone,
          this.truck = result.truck,
          this.truckcargoExemptions = result.truck.cargoExemptions,
          this.driverArray = result.drivers,
          this.trailers = result.trailers,
          this.containers = result.containers,
          this.passengers = result.passengers,
          this.shipments = result.shipments,
          this.status = result.status,
          setTimeout(() => {
              this.getDriverIdArray(result.drivers);
              this.getAssetArray(result.trailers);
          }, 2000);

      });
  }
  updateACIManifest()  {
    const data = {
      entryID: this.entryID,
      data: 'ACI_TRIP',
      sendId: '001',
      companyKey: 'c-9000-2bcd8ae5954e0c48',
      operation: 'UPDATE',
      CCC: this.CCC,
      tripNumber: this.tripNumber,
      portOfEntry: this.portOfEntry,
      subLocation: this.subLocation,
      estimatedArrivalDate: this.estimatedArrivalDate,
      estimatedArrivalTime: this.estimatedArrivalTime,
      estimatedArrivalTimeZone: this.estimatedArrivalTimeZone,
      truck: this.truck,
      trailers: this.trailers,
      drivers: this.driverArray,
      passengers: this.passengers,
      containers: this.containers,
      shipments: this.shipments
    };
    console.log('Data', data);
    this.apiService.putData('ACIeManifest', data).subscribe({
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
        this.toastr.success('Manifest Updated Successfully');
        this.router.navigateByUrl('/dispatch/cross-border/eManifests');

      },
    });
  }
}
