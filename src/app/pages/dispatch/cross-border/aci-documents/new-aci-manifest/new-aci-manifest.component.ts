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
  timeCreated: string;
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
  shippers = [];
  consignees = [];
  ACIReleaseOfficeList: any = [];
  timeList: any = [];
  cityList: any = [];
  subLocationsList: any = [];
  vehicleSeals: any = [];
  cargoExemptionsList: any = [];
  documentTypeList: any = [];
  currentStatus: string;
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
  addTruckSealBtn = true;
  truck = {
    truckID: '',
    sealNumbers: [{sealNumber:''},{sealNumber: ''},{sealNumber: ''},{sealNumber: ''}],
    cargoExemptions: []
  };
  driverArray = []; 
  assetsArray = [
    {
      assetID: '',
      sealNumbers: [{sealNumber:''},{sealNumber: ''},{sealNumber: ''},{sealNumber: ''}],
      cargoExemptions: []
    }];
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
      sealNumbers: [{sealNumber:''},{sealNumber: ''},{sealNumber: ''},{sealNumber: ''}],
    }
  ];

  passengerDocStates = [];
  shipments = [
    {
      shipmentType: '',
      loadedOn: {
        type: '',
        number: ''
      },
      CCC: '',
      cargoControlNumber: '',
      referenceOnlyShipment: false,
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
      consolidatedFreight: false,
      specialInstructions: '',
      shipperID: '',
      consigneeID: '',
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
      this.getDocStates();
    } else {
      this.title = 'Add ACI e-Manifest';
    }
    this.fetchShippers();
    this.fetchConsignees();
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.fetchCountries();
    this.fetchUSStates();
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
    this.httpClient.get('assets/jsonFiles/ACIpackagingUnit.json').subscribe(data => {    
      this.packagingUnitsList = data;
    });
    this.httpClient.get('assets/travelDocumentType.json').subscribe(data => {
      this.documentTypeList = data;
    });
    this.httpClient.get('assets/ACIShipmentType.json').subscribe(data => {
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
    });
  }
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
        //console.log(this.countries);
      });
  }
  fetchUSStates() {
    this.apiService.getData('states/getUSStates')
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
  getDocStates(){
    this.apiService.getData('states')
    .subscribe((result: any) => {
      this.passengerDocStates = result.Items;
    });
  }
  fetchCities() {
    this.apiService.getData('cities')
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }
  fetchShippers(){
    this.apiService.getData('shippers').subscribe((result:any)=> {
      this.shippers = result.Items;
    });
    }
    fetchConsignees(){
      this.apiService.getData('receivers').subscribe((result:any)=> {
        this.consignees = result.Items;
      });
      }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
      console.log('vehicles in init', this.vehicles);
    });
  }
  // TRUCK DATA
  addTruckSeal(){
    this.truck.sealNumbers.push({sealNumber: ''});
    if(this.truck.sealNumbers.length <= 20){
      this.addTruckSealBtn = true;
    } 
    else  {
      this.addTruckSealBtn = false;
    }    
  }
  async fetchStateCode(ID) {
    const code = await this.apiService.getData('states/' + ID).toPromise();
    return code.Items[0].stateCode;
  }
 
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
    });
  }

  fetchDrivers() {
    this.apiService.getData('drivers').subscribe((result: any) => {
      this.drivers = result.Items;
    });
  }
  //container data
  addContainer() {
    this.containers.push({
      loadedOn: {
        type: '',
        number: ''
      },
      number: '',
      cargoExemptions: [],
      sealNumbers: [{sealNumber: ''}],
    });
  }
  deleteContainer(i: number) {
    this.containers.splice(i, 1);
  }
  addContainerSeal(i){
    if(this.containers[i].sealNumbers.length <= 19) {
      this.containers[i].sealNumbers.push({sealNumber: ''});
    }
         
  }
  // trailer data
  addTrailer() {
    this.assetsArray.push({
      assetID: '',
      cargoExemptions: [],
      sealNumbers: [{sealNumber: ''}],
    });
    this.addTrailerBtn = true;

    if (this.assetsArray.length >= 3) {
      this.addTrailerBtn = false;
    }
    else {
      this.addTrailerBtn = true;
    }
  }
  addTrailerSeal(i){
    if(this.assetsArray[i].sealNumbers.length <= 19) {
      this.assetsArray[i].sealNumbers.push({sealNumber: ''});
    }
         
  }
  deleteTrailer(i: number) {
    this.assetsArray.splice(i, 1);
    this.addTrailerBtn = true;
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
 
  getStatesDoc(i, j) {
    const countryID = this.passengers[i].travelDocuments[j].country; 
    this.apiService.getData('states/country/' + countryID)
      .subscribe((result: any) => {
        this.passengerDocStates = result.Items;
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
      shipmentType: '',
      loadedOn: {
        type: '',
        number: ''
      },
      CCC: '',
      cargoControlNumber: '',
      referenceOnlyShipment: false,
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
      consolidatedFreight: false,
      specialInstructions: '',
      shipperID: '',
      consigneeID: '',
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

  addACIManifest() {
    const data = {
      CCC: this.CCC.toUpperCase().replace(/o/gi, "0").replace(/i/gi,"1"),
      tripNumber: this.tripNumber.toUpperCase().replace(/o/gi, "0").replace(/i/gi,"1"),
      portOfEntry: this.portOfEntry,
      subLocation: this.subLocation,
      estimatedArrivalDate: this.estimatedArrivalDate,
      estimatedArrivalTime: this.estimatedArrivalTime,
      estimatedArrivalTimeZone: this.estimatedArrivalTimeZone,
      truck: this.truck,
       trailers: this.assetsArray,
       drivers: this.driverArray,
       passengers: this.passengers,
       containers: this.containers,
       shipments: this.shipments,
       currentStatus: 'DRAFT'
    };
    console.log('Data', data);
    this.apiService.postData('ACIeManifest', data).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.key] = val.message;
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
        this.toastr.success('Manifest added successfully');
        this.router.navigateByUrl('/dispatch/cross-border/eManifests');

      },
    });
  }
  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
    // this.vehicleForm.showErrors(this.errors);
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label');
      });
    this.errors = {};
  } 

  fetchACIEntry() {
    this.apiService
      .getData('ACIeManifest/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('Fetched Data', result);
        this.timeCreated = result.timeCreated;
        this.entryID = this.entryID;
          this.CCC = result.CCC,
          this.tripNumber = result.tripNumber,
          this.portOfEntry = result.portOfEntry,
          this.subLocation = result.subLocation,
          this.estimatedArrivalDate = result.estimatedArrivalDate,
          this.estimatedArrivalTime = result.estimatedArrivalTime,
          this.estimatedArrivalTimeZone = result.estimatedArrivalTimeZone,
          this.truck = result.truck,
          this.driverArray = result.drivers,
          this.assetsArray = result.trailers,
          this.containers = result.containers,
          this.passengers = result.passengers,
          this.shipments = result.shipments,
          this.currentStatus = result.currentStatus,
          setTimeout(() => {
            this.fetchUSStates();
          }, 2000);

      });
  }
  updateACIManifest()  {
    const data = {
      entryID: this.entryID,
      CCC: this.CCC.toUpperCase().replace(/o/gi, "0").replace(/i/gi,"1"),
      tripNumber: this.tripNumber.toUpperCase().replace(/o/gi, "0").replace(/i/gi,"1"),
      portOfEntry: this.portOfEntry,
      subLocation: this.subLocation,
      estimatedArrivalDate: this.estimatedArrivalDate,
      estimatedArrivalTime: this.estimatedArrivalTime,
      estimatedArrivalTimeZone: this.estimatedArrivalTimeZone,
      truck: this.truck,
       trailers: this.assetsArray,
       drivers: this.driverArray,
       passengers: this.passengers,
       containers: this.containers,
       shipments: this.shipments,
       currentStatus: 'DRAFT',
      timeCreated: this.timeCreated
    };
    console.log('Data', data);
    this.apiService.putData('ACIeManifest', data).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.key] = val.message;
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
        this.toastr.success('Manifest Updated Successfully');
        this.router.navigateByUrl('/dispatch/cross-border/eManifests');

      },
    });
  }
}
