import { Component, OnInit, Injectable } from '@angular/core';
import { ApiService } from '../../../../../services';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbTimeStruct, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
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
    licensePlates: [{
      number: '',
      stateProvince: '',
    }],
    sealNumbers1: '',
    sealNumbers2: '',
    sealNumbers3: '',
    sealNumbers4: '',
      };
  vehicleNumber: string;
  vehicleType: string;
  vinNumber: string;
  LicencePlatenumber: string;
  vehicleLicenceProvince: string;
  truckSealDiv = false;
  truckIITDiv = false;
  tags = [];
  ETA: string;
  estimatedArrivalDate: string;
  estimatedArrivalTime: string;
  assetArray = [];
  assetSeals = [];
  trailerSeals: any = [];
  assetTags = [];
  assetId = [];
  driverIdArray = [];
  driverArray = [];
  
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
  truckSeals = [];
  assetsArray = [
    {
      assetId: '',
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
      aceId: '',
      licensePlates: [{
        number: '',
        stateProvince: ''
      }],
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
      broker: {
        filerCode: 'testBroker',
        portLocation: 'broker location'
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
        marksAndNumbers1: '',
        marksAndNumbers2: '',
        marksAndNumbers3: '',
        marksAndNumbers4: '',
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
      }],
      autoSend: false
    }
  ];
  ngOnInit() {
    this.entryID = this.route.snapshot.params[`entryID`];
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
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }
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
      broker: {
        filerCode: 'testBroker',
        portLocation: 'broker location'
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
        marksAndNumbers1: '',
        marksAndNumbers2: '',
        marksAndNumbers3: '',
        marksAndNumbers4: '',
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
      }],
      autoSend: false,
    });
  }
  deleteShipment(i: number) {
    this.shipments.splice(i, 1);
  }
  loadedType = 'TRAILER';
  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute, private toastr: ToastrService,
    private apiService: ApiService, private ngbCalendar: NgbCalendar, private location: Location,
    config: NgbTimepickerConfig, private dateAdapter: NgbDateAdapter<string>) {
    config.seconds = true;
    config.spinners = true;
  }

  
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  addTrailer() {
    this.assetsArray.push({
      assetId: '',
      sealNumbers1: '',
      sealNumbers2: '',
      sealNumbers3: '',
      sealNumbers4: '',
    });
    this.trailers.push({
      assetId: '',
      number: '',
      type: '',
      aceId: '',
      licensePlates: [{
        number: '',
        stateProvince: ''
      }],
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
  async fetchStateCode(ID) {
    const code = await this.apiService.getData('states/' + ID).toPromise();
    return code.Items[0].stateCode;
  }
  async fetchCountryCode(ID) {
    const code = await this.apiService.getData('countries/' + ID).toPromise();
    return code.Items[0].countryCode;
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
        licensePlates: [{
          number: this.vehicleData[0].plateNumber,
          stateProvince: await this.fetchStateCode(result.Items[0].stateID),
        }],
        sealNumbers1: this.truck.sealNumbers1,
        sealNumbers2: this.truck.sealNumbers2,
        sealNumbers3: this.truck.sealNumbers3,
        sealNumbers4: this.truck.sealNumbers4,
      };
      console.log(this.truck);
    });
  }
  truckSealArray() {
    this.truck.sealNumbers1 = this.truck.sealNumbers1;
    this.truck.sealNumbers2 = this.truck.sealNumbers2;
    this.truck.sealNumbers3 = this.truck.sealNumbers3;
    this.truck.sealNumbers4 = this.truck.sealNumbers4;
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
      marksAndNumbers1: '',
      marksAndNumbers2: '',
      marksAndNumbers3: '',
      marksAndNumbers4: '',
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
  async getAssetData(e, t) {
    console.log('e', e);
    console.log('t', t);
    let testArray = [];
    testArray = this.assets.filter(a => a.assetID === e);
    console.log('test asset', testArray);
    this.trailers[t].assetId = testArray[0].assetID,
      this.trailers[t].number = testArray[0].assetIdentification,
      this.trailers[t].type = testArray[0].assetDetails.assetType,
      this.trailers[t].aceId = testArray[0].crossBorderDetails.ACE_ID,
      this.trailers[t].licensePlates = [{
        number: testArray[0].assetDetails.licencePlateNumber,
        stateProvince: await this.fetchStateCode(testArray[0].assetDetails.licenceStateID)
      }];
    this.trailers[t].sealNumbers1 = this.assetsArray[t].sealNumbers1;
    this.trailers[t].sealNumbers2 = this.assetsArray[t].sealNumbers2;
    this.trailers[t].sealNumbers3 = this.assetsArray[t].sealNumbers3;
    this.trailers[t].sealNumbers4 = this.assetsArray[t].sealNumbers4;
  }
  trailerSealArray(t) {
    this.trailers[t].sealNumbers1 = this.assetsArray[t].sealNumbers1;
    this.trailers[t].sealNumbers2 = this.assetsArray[t].sealNumbers2;
    this.trailers[t].sealNumbers3 = this.assetsArray[t].sealNumbers3;
    this.trailers[t].sealNumbers4 = this.assetsArray[t].sealNumbers4;
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
    console.log('final driver object', this.driverArray);
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
      autoSend: false,
      currentStatus: 'DRAFT'
    };
    console.log('Added Data', data); return;
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
      };
      this.assetsArray.push(data);
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
              this.getDriverIdArray(result.drivers);
            this.getAssetArray(result.trailers);
            //  this.getShipmentData(result.shipments);
          }, 2000);

      });
  }
  updateACEManifest() {
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
      autoSend: false,
      currentStatus: 'DRAFT'
    };
    console.log('Updated Data', data);
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
