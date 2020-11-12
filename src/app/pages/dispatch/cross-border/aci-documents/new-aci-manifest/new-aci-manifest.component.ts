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
  assetArray: any = [];
  assets: any = [];
  drivers: any = [];
  driverId: any = [];
  driverArray: any = [];
  ACIReleaseOfficeList: any = [];
  timeList: any = [];
  cityList: any = [];
  subLocationsList: any = [];
  vehicleSeals: any = [];
  cargoExemptionsList: any = [];
  CCC: string;
  tripNo: string;
  truckcargoExemptions: [];
  data: string;
  sendId: string;
  companyKey: string;
  operation: string;
  tripNumber: string;
  portOfEntry: string;
  subLocation: string;
  tripDate: '';
  tripTime: '';
  estimatedArrivalTimeZone: '';
  estimatedArrivalDateTime: string;
  truck: {
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
        stateProvince: ''
      },
      sealNumbers: [],
      cargoExemptions: []

    };
    trailers = [
      {
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
          referenceOnlyShipment: '',
          portOfEntry: '',
          releaseOffice: '',
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
          consolidatedFreight: '',
          shipper: {
              name: '',
              address: {
                  addressLine: '',
                  city: '',
                  stateProvince: '',
                  postalCode: ''
              },
              contactNumber: '',
          },
          consignee: {
              name: '',
              address: {
                  addressLine: '',
                  city: '',
                  stateProvince: '',
                  postalCode: ''
              },
              contactNumber: '',
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
  shipmentTypeList: any = [];
  CCCShipment: string;
  cargoControlNumberInput: string;
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
    }];
  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute, private toastr: ToastrService,
    private apiService: ApiService, private ngbCalendar: NgbCalendar, private location: Location,
    config: NgbTimepickerConfig, private dateAdapter: NgbDateAdapter<string>) {
    config.seconds = true;
    config.spinners = true;
  }

  ngOnInit() {
    this.entryID = this.route.snapshot.params['entryID'];
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
   // console.log('tags', this.tags);
  }
  fetchVehicleData(ID) {
    this.apiService.getData('vehicles/' + ID).subscribe((result: any) => {
      this.vehicleData = result.Items;
      console.log('vehicledata', this.vehicleData);
      this.fetchStateCode(this.vehicleData[0].stateID);
      this.truck = {
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
          stateProvince: this.vehicleData[0].stateID
        },
        sealNumbers : this.vehicleSeals,
        cargoExemptions: this.truckcargoExemptions
      };
    });
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
          stateProvince: testArray[0].assetDetails.licenceStateID
        }
      };
      this.assetArray.push(data);
    }
  }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
        console.log('assets', this.assets);
    });
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
          stateProvince: test1[j].issuingState,
          country: test1[j].issuingCountry
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
  addPassenger() {
    console.log('add passenger', this.passengers);
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
  addShipment() {
    this.shipments.push( {
      data: '',
      sendId: '',
      companyKey: '',
      operation: '',
      shipmentType: '',
      loadedOn: {
          type: '',
          number: ''
      },
      CCC: '',
      cargoControlNumber: '',
      referenceOnlyShipment: '',
      portOfEntry: '',
      releaseOffice: '',
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
      shipper: {
          name: '',
          address: {
              addressLine: '',
              city: '',
              stateProvince: '',
              postalCode: ''
          },
          contactNumber: '',
      },
      consignee: {
          name: '',
          address: {
              addressLine: '',
              city: '',
              stateProvince: '',
              postalCode: ''
          },
          contactNumber: '',
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
  cargoControlNumberFn(s){
    this.shipments[s].cargoControlNumber = this.CCCShipment + this.cargoControlNumberInput;
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
  addACIManifest() {
    const data = {
      data : 'ACI_TRIP',
      sendId: '001',
      companyKey: 'c-9000-2bcd8ae5954e0c48',
      operation: 'CREATE',
      CCC: this.CCC,
      tripNumber: this.tripNumber,
      portOfEntry: this.portOfEntry,
      subLocation: this.subLocation,
      tripDate: this.tripDate,
      tripTime: this.tripTime,
      estimatedArrivalTimeZone: this.estimatedArrivalTimeZone,
      truck: this.truck,
      trailers: this.assetArray,
      drivers: this.driverArray,
      passengers: this.passengers,
      shipments: this.shipments
    };
    console.log('Data', data);return;
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
}
