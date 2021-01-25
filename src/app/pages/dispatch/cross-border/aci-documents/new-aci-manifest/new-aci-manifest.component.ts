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
  timeCreated: string;
  countries: any = [];
  stateID: string;
  states: any = [];
  cities: any = [];
  CANPorts: any = [];
  vehicles: any = [];
  vehicleData: any = [];
  loadingCities : any = [];
  acceptanceCities : any = [];
  assets: any = [];
  drivers: any = [];
  shippers = [];
  consignees = [];
  ACIReleaseOfficeList: any = [];
  timeList: any = [];
  cityList: any = [];
  notifyPartyCities : any = [];
  notifyPartyStates: any = [];
  deliveryDestinationCities: any = [];
  deliveryDestinationStates: any = [];
  subLocationsList: any = [];
  cargoExemptionsList: any = [];
  documentTypeList: any = [];
  countriesList: any = [];
  currentStatus: string;
  CCC: string;
  addTrailerBtn = true;
  data: string;
  sendId: string;
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
  trailers = [
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
      uniqueConsignmentReferenceNumber: '',
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
      deliveryDestinations: [],
      notifyParties: [],
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
      this.fetchCities();
      this.getNotifyPartyStatesCities();
      this.getDeliveryDestinationStatesCities();
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
    this.httpClient.get('assets/canadianPorts.json').subscribe(data => {
      this.CANPorts = data;
    });
    this.httpClient.get('assets/jsonFiles/ACIpackagingUnit.json').subscribe(data => {    
      this.packagingUnitsList = data;
    });
    this.httpClient.get('assets/travelDocumentType.json').subscribe(data => {
      this.documentTypeList = data;
    });
    this.httpClient.get('assets/jsonFiles/ACIShipmentType.json').subscribe(data => {
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
    this.httpClient.get('assets/jsonFiles/worldCountries.json').subscribe(data => {  
      this.countriesList = data;
    });
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
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
  getLoadingCities(s) {
    let stateID = this.shipments[s].cityOfLoading.stateProvince;
    this.apiService.getData('cities/state/'+ stateID)
      .subscribe((result: any) => {
        this.loadingCities = result.Items;
      });
  }
  getAcceptanceCities(s) {
    let stateID = this.shipments[s].cityOfAcceptance.stateProvince;
    this.apiService.getData('cities/state/'+ stateID)
      .subscribe((result: any) => {
        this.acceptanceCities = result.Items;
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
        this.acceptanceCities = result.Items;
        this.loadingCities = result.Items;
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
    });
  }
  // TRUCK DATA
  addTruckSeal(){
    this.truck.sealNumbers.push({sealNumber: ''});
    if(this.truck.sealNumbers.length <= 19){
      this.addTruckSealBtn = true;
    } 
    else  {
      this.addTruckSealBtn = false;
    }    
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
    if(this.containers.length <=4){
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
   else{
    this.toastr.warning('Only 5 containers are allowed in ACI manifest!');
   }
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
    this.trailers.push({
      assetID: '',
      cargoExemptions: [],
      sealNumbers: [{sealNumber: ''}],
    });
    this.addTrailerBtn = true;

    if (this.trailers.length >= 3) {
      this.addTrailerBtn = false;
    }
    else {
      this.addTrailerBtn = true;
    }
  }
  addTrailerSeal(i){
    if(this.trailers[i].sealNumbers.length <= 19) {
      this.trailers[i].sealNumbers.push({sealNumber: ''});
    }
         
  }
  deleteTrailer(i: number) {
    this.trailers.splice(i, 1);
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
    if(this.passengers[i].travelDocuments.length <= 2){
      this.passengers[i].travelDocuments.push({
        type: '',
        number: '',
        country: '',
        stateProvince: ''
      });
    }else{
      this.toastr.warning('Only 3 travel documents of passenger are allowed in ACI manifest');
    }   
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
  //delivery destinations
  getDeliveryDestinationStatesCities(){
    this.apiService.getData('states')
    .subscribe((result: any) => {
      this.deliveryDestinationStates = result.Items;
    });
    this.apiService.getData('cities')
    .subscribe((result: any) => {
      this.deliveryDestinationCities = result.Items;
    });
  }
  getDeliveryDestinationStates(s,p){
    const countryID = this.shipments[s].deliveryDestinations[p].address.country;
    this.apiService.getData('states/country/' + countryID)
    .subscribe((result: any) => {
      this.deliveryDestinationStates = result.Items;
    });
    }
    getDeliveryDestinationCities(s,p){
      const stateID = this.shipments[s].deliveryDestinations[p].address.stateProvince;
      this.apiService.getData('cities/state/' + stateID)
      .subscribe((result: any) => {
        this.deliveryDestinationCities = result.Items;
      });
      }
  addDeliveryDestination(p){
    if(this.shipments[p].deliveryDestinations.length <= 96){
    this.shipments[p].deliveryDestinations.push({   
     name:'',
     contactNumber: '',
     address: {
     addressLine: '',
     city: '',
     stateProvince: '',
     country: '',
     postalCode: '',
     }
     });}
  }
  deleteDeliveryDestination(i: number, s: number) {
   this.shipments[s].deliveryDestinations.splice(i, 1);
 }
  // notify parties
  getNotifyPartyStatesCities(){
    this.apiService.getData('states')
    .subscribe((result: any) => {
      this.notifyPartyStates = result.Items;
    });
    this.apiService.getData('cities')
    .subscribe((result: any) => {
      this.notifyPartyCities = result.Items;
    });
  }
  getNotifyPartyStates(s,p){
    const countryID = this.shipments[s].notifyParties[p].address.country;
    this.apiService.getData('states/country/' + countryID)
    .subscribe((result: any) => {
      this.notifyPartyStates = result.Items;
    });
    }
    getNotifyPartyCities(s,p){
      const stateID = this.shipments[s].notifyParties[p].address.stateProvince;
      this.apiService.getData('cities/state/' + stateID)
      .subscribe((result: any) => {
        this.notifyPartyCities = result.Items;
      });
      }
  addNotifyParty(p){
    if(this.shipments[p].notifyParties.length <= 97){
    this.shipments[p].notifyParties.push({   
     name:'',
     contactNumber: '',
     address: {
     addressLine: '',
     city: '',
     stateProvince: '',
     country: '',
     postalCode: '',
     }
     });}
  }
  deleteNotifyParty(i: number, s: number) {
   this.shipments[s].notifyParties.splice(i, 1);
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
      uniqueConsignmentReferenceNumber: '',
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
      notifyParties: [],
      deliveryDestinations: [],
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

  addACIManifest() {
    const data = {
      CCC: this.CCC,
      tripNumber: this.CCC+this.tripNumber,
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
       currentStatus: 'Draft'
    };
    this.apiService.postData('ACIeManifest', data).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
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
        this.toastr.success('Manifest added successfully.');
        this.location.back(); // <-- go back to previous location

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
        this.timeCreated = result.timeCreated;
        this.entryID = this.entryID;
        this.sendId = result.sendId;
          this.CCC = result.CCC,
          this.tripNumber = result.tripNumber.substring(4,result.tripNumber.length),
          this.portOfEntry = result.portOfEntry,
          this.subLocation = result.subLocation,
          this.estimatedArrivalDate = result.estimatedArrivalDate,
          this.estimatedArrivalTime = result.estimatedArrivalTime,
          this.estimatedArrivalTimeZone = result.estimatedArrivalTimeZone,
          this.truck = result.truck,
          this.driverArray = result.drivers,
          this.trailers = result.trailers,
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
      sendId: this.sendId,
      CCC: this.CCC,
      tripNumber: this.CCC+this.tripNumber,
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
       currentStatus: this.currentStatus,
      timeCreated: this.timeCreated
    };
    this.apiService.putData('ACIeManifest', data).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
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
        this.toastr.success('Manifest Updated Successfully.');
        this.location.back(); // <-- go back to previous location
      },
    });
  }
}
