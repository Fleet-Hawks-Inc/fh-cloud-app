import { Component, OnInit, Injectable } from '@angular/core';
import { ApiService } from '../../../../../services';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbTimeStruct, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
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
  vehicleID: string;
  vehicleData = [];
  vehicles = [];
  assets = [];
  trips = [];
  drivers = [];
  //   truck: {
  //     number: '2013',
  //     type: 'TR',
  //     vinNumber: 'AG12XXXXXXXXXF',
  //     licensePlate: {
  //        number: 'TEMP5',
  //         stateProvince: 'ON'
  //     }
  // };
  vehicleNumber: string;
  vehicleType: string;
  vinNumber: string;
  LicencePlatenumber: string;
  vehicleLicenceProvince: string;
  vehicleSeals = [];
  tags = [];
  ETA: string;
  date: NgbDateStruct;
  // time: NgbTimeStruct;
  assetArray = [];
  assetSeals = [];
  assetTags = [];
  assetId = [];
  driverId = [];
  driverArray = [];
  // passengers = [
  //   {
  //   firstName: '',
  //   middleName: '',
  //   lastName: '',
  //   gender: '',
  //   dateOfBirth: '',
  //   citizenshipCountry: '',
  //   fastCardNumber: '',
  //   travelDocuments: [
  //   {
  //   number: '',
  //   type: '',
  //   stateProvince: '',
  //   country: ''
  //   },
  //   {
  //   number: '',
  //   type: '',
  //   stateProvince: '',
  //   country: ''
  //   }
  //   ]
  //   }
  //  ];
  time: '13:30:00';
  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  USports: any = [];
  USport: string;
  documentTypeList: any = [];
  shipmentTypeList: any = [];
  shipmentType: string;
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
  passengers = [{
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    countryOfCitizenship: '',
    fastNumber: '',
    // document: [{
    //   documentType: '',
    //   documentNumber: '',
    //   issuingCountry: '',
    //   issuingState: ''
    // }]
  }];
  passengerDocStates = [];
  commodities =
    [{
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
      c4ReleaseNumber: '',
      value: '',
      countryOfOrigin: '',
      hazmatDetails: {
        unCode: '',
        emergencyContactName: '',
        contactPhone: '',
        contactEmail: ''
      }
    }];
  marks1: string;
  marks2: string;
  marks3: string;
  marks4: string;
  marksArray = [];
  loadedType = 'TRAILER';
  constructor(private httpClient: HttpClient,
              private apiService: ApiService, private ngbCalendar: NgbCalendar,
              config: NgbTimepickerConfig, private dateAdapter: NgbDateAdapter<string>) {
              config.seconds = true;
              config.spinners = true;
  }

  ngOnInit() {
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchTrips();
    this.fetchDrivers();
    this.fetchCountries();
    this.getStates();
    this.httpClient.get('assets/USports.json').subscribe(data => {
      console.log('Data', data);
      this.USports = data;
    });
    this.httpClient.get('assets/ACEShipmentType.json').subscribe(data => {
      console.log('Shipment Data', data);
      this.shipmentTypeList = data;
    });
    this.httpClient.get('assets/packagingUnit.json').subscribe(data => {
      console.log('Packaging Data', data);
      this.packagingUnitsList = data;
    });
    this.httpClient.get('assets/travelDocumentType.json').subscribe(data => {
      console.log('Document  Data', data);
      this.documentTypeList = data;
    });
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  getMarksArray(e){
  //   this.commodities['marksAndNumbers'].forEach(element => {
  //    console.log('element', element);
  //  });
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  getStatesDoc() {
    const countryID = this.passengers['document']['issuingCountry'];
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
        dob: '',
        countryOfCitizenship: '',
        fastNumber: '',
        // document: [{
        //   documentType: '',
        //   documentNumber: '',
        //   issuingCountry: '',
        //   issuingState: ''
        // }]
    });
  }
  addDocument() {
    this.passengers['document'].push({
      documentType: '',
      documentNumber: '',
      issuingCountry: '',
      issuingState: ''
    });
    console.log(this.passengers['document']);
  }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
      //  console.log('assets', this.assets);
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
  fetchStateCode(ID) {
    let test: any = [];
    console.log('State Id', ID);
    this.apiService.getData('states/' + ID).subscribe((result: any) => {
      test = result.Items[0];
      console.log('state code in fn', test.stateCode);
      return test.stateCode;
    });
  }
  fetchVehicleData(ID) {
    this.apiService.getData('vehicles/' + ID).subscribe((result: any) => {
      this.vehicleData = result.Items;
      this.vehicleNumber = this.vehicleData[0].vehicleIdentification;
      this.vehicleType = this.vehicleData[0].vehicleType;
      this.vinNumber = this.vehicleData[0].VIN;
      this.LicencePlatenumber = this.vehicleData[0].plateNumber;
      this.vehicleLicenceProvince = this.vehicleData[0].stateID;
      this.fetchStateCode(this.vehicleData[0].stateID);
    });
  }
  // matchLoadedOnFn() {
  //   if(this.commodities.loadedOn.number === 'TRUCK')
  //     this.commodities.loadedOn.number = this.vehicleData[0].vehicleID;
  // }
  addPassenger(){
    console.log('add passenger', this.passengers);
  }
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }
  addCommodity() {
    this.commodities.push({
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
      c4ReleaseNumber: '',
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
  }
  onTagsChangedAsset(e) {
    if (e.change === 'add') {
      this.assetSeals.push(e.tag.displayValue);
    }
    else {
      for (let i = this.assetSeals.length; i--;) {
        if (this.assetSeals[i] === e.tag.displayValue) {
          this.assetSeals.splice(i, 1);
        }
      }
    }
    console.log('asset seals', this.assetSeals);
  }
  getAssetNumber(e) {
    let test = [];
    test = this.assets.filter(a => a.assetID === e);

    console.log('asset number', test[0].assetIdentification);
  }
  async getAssetData(e) {
    let testArray = [];
    this.assetArray = [];
    for (let i = 0; i < e.length; i++) {
      testArray = this.assets.filter(a => a.assetID === e[i]);
      console.log('asset in fn', testArray);
      const data = {
        number: testArray[0].assetIdentification,
        type: testArray[0].assetDetails.assetType,
        licensePlate: {
          number: testArray[0].assetDetails.licencePlateNumber,
          stateProvince: this.fetchStateCode(testArray[0].assetDetails.licenceStateID)
        }
      };
      this.assetArray.push(data);
    }
  }
  marksArrayFn() {
    //this.marksArray = [];
    this.commodities['marksAndNumbers'].push(this.marks1);
    this.commodities['marksAndNumbers'].push(this.marks2);
    this.commodities['marksAndNumbers'].push(this.marks3);
    this.commodities['marksAndNumbers'].push(this.marks4);
    // this.commodities.marksAndNumbers.push(this.marks1);
    // this.marksArray.push(this.marks2);
    // this.marksArray.push(this.marks3);
    // this.marksArray.push(this.marks4);
    console.log('marks', this.commodities)
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
          stateProvince: test1[j].issuingState
        };
        docsArray.push(docData);
      }
      const data = {
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
  showDate() {
    // console.log('Date', this.date);
    // console.log('Time', this.time);
    // console.log('VID', this.vehicleID);
    // await this.fetchVehicleData(this.vehicleID);
    this.ETA = this.date + ' ' + this.time;
    console.log('ETA', this.ETA);
    console.log('asset array', this.assetArray);
    const data = {
      data: 'ACE_TRIP',
      sendId: '001',
      companyKey: 'c-9000-2bcd8ae5954e0c48',
      operation: 'CREATE',
      tripNumber: this.tripNumber,
      usPortOfArrival: this.USport,
      estimatedArrivalDateTime: this.ETA,
      truck: {
        number: this.vehicleNumber,
        type: this.vehicleType,
        vinNumber: this.vinNumber,
        licensePlate: {
          number: this.LicencePlatenumber,
          stateProvince: this.vehicleLicenceProvince
        }
      },
      trailers: this.assetArray,
      drivers: this.driverArray,
      shipments: [
        {
          data: 'ACE_SHIPMENT',
          sendId: '001',
          companyKey: 'c-9000-2bcd8ae5954e0c48',
          operation: 'CREATE',
          type: this.shipmentType,
          shipmentControlNumber: this.shipmentControlNumber,
          provinceOfLoading: this.provinceOfLoading,
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
          commodities: this.commodities,
          // commodities: [
          //   {
          //     loadedOn: {
          //       type: 'TRAILER',
          //       number: '0456'
          //     },
          //     description: 'Books',
          //     quantity: 35,
          //     packagingUnit: 'BOX',
          //     weight: 1500,
          //     weightUnit: 'L'
          //   }
          // ]
          // commodities:
          // [{
          //   loadedOn: {
          //     type: this.commodities.loadedOn.type,
          //     number: this.commodities.loadedOn.type === 'TRUCK' ? this.vehicleNumber : 'hello'
          //   },
          //   description: this.commodities.description,
          //   quantity: this.commodities.quantity,
          //   packagingUnit: this.commodities.packagingUnit,
          //   weight: this.commodities.weight,
          //   weightUnit: this.commodities.weightUnit,
          //   marksAndNumbers: this.marksArray,
          //   c4ReleaseNumber: this.commodities.c4ReleaseNumber,
          //   value: this.commodities.value,
          //   countryOfOrigin: this.commodities.countryOfOrigin,
          //   hazmatDetails: {
          //     unCode: this.commodities.hazmatDetails.unCode,
          //     emergencyContactName: this.commodities.hazmatDetails.emergencyContactName,
          //     contactPhone: this.commodities.hazmatDetails.contactPhone,
          //     contactEmail: this.commodities.hazmatDetails.contactEmail
          //     }
          // }],
        }
      ],
    };
    console.log('Data', data);
  }
}
