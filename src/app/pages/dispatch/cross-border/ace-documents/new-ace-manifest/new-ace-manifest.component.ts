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
import { BooleanNullable } from 'aws-sdk/clients/glue';
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
  sendId;
  title = 'Add ACE e-Manifest'; 
  modalTitle = 'Add';
  vehicles = [];
  assets = [];
  fetchedDrivers = [];
  shippers = [];
  consignees = [];
  brokers = [];
  inbondTypesList: any = [];
  foreignPortsList: any =[];
  countriesList: any = [];
  thirdPartiesList : any = [];
  thirdPartyStates: any  = [];
  thirdPartyCities: any = [];
  carriers: any = [];
  usPortOfArrival: string;
  estimatedArrivalDateTime: string;
  addTruckSealBtn = true;
  truck = {
    truckID: '',
    sealNumbers: [{sealNumber:''},{sealNumber: ''},{sealNumber: ''},{sealNumber: ''}]
  }
  trailers = [
    {
      assetID: '',
      sealNumbers: [{sealNumber:''},{sealNumber: ''},{sealNumber: ''},{sealNumber: ''}],
    }];
  addTrailerSealBtn = true;    
  drivers: any  = [];
  estimatedArrivalDate: string;
  estimatedArrivalTime: string; 
  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  USports: any = [];
  addressStates:any = [];
  addressCities: any = [];
  documentTypeList: any = [];
  shipmentTypeList: any = [];
  brokersList: any = [];
  timeList: any = [];
  tripNumber: string = '';
  SCAC: string;  
  shipmentControlNumber: string;
  currentStatus: string;
  provinceOfLoading: string;
  states: any = [];
  countries: any = [];
  packagingUnitsList: any = [];
  addTrailerBtn = true;  
  timeCreated = '';
  passengers = [];
  passengerDocStates = [];
  shipments = [
    {
      shipmentType: '',
      shipmentControlNumber: '',
      provinceOfLoading: '',
      goodsAstrayDateOfExit: '',
      inBondDetails: {
        type: '',
        paperInBondNumber: '',
        usDestination:'',
        foreignDestination: '',
        onwardCarrierScac: '',
        irsNumber: '',
        estimatedDepartureDate: '',
        fda: '',
       },
      SCAC: '', 
        shipperID: '',
        consigneeID: '',
        broker: {
          filerCode: '',
          portLocation: ''
         },
         thirdParties:[],
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
        marksAndNumbers: [{markNumber: ''}], 
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
  usAddress = {
    addressLine: '',
    city: '',
    state: '',
    zipCode: ''
    }
  /**
   * for front end validation of US address
   */
  errorClassState: boolean = false;
errorClassCity: boolean = false;
errorClassAddress: boolean = false;
errorClassZip: boolean = false;
address:boolean = false;
  ngOnInit() {
    this.entryID = this.route.snapshot.params[`entryID`];
    if (this.entryID) {
      this.title = 'Edit ACE e-Manifest';
      this.modalTitle = 'Edit';
      this.fetchACEEntry();
      this.getDocStates();
      this.getThirdPartyStatesCities(); // for edit purpose
    } else {
      this.title = 'Add ACE e-Manifest';
      this.modalTitle = 'Add';
    }
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.fetchCountries();
    this.fetchShippers();
    this.fetchConsignees();
    this.fetchBrokers();
    this.getStates();
    this.getUSStates();
    this.fetchCarrier();
    this.httpClient.get('assets/USports.json').subscribe(data => {
      this.USports = data;
    });
    this.httpClient.get('assets/manifestETA.json').subscribe(data => {
      this.timeList = data;
    });
    this.httpClient.get('assets/ACEShipmentType.json').subscribe(data => {
      this.shipmentTypeList = data;
    });
    this.httpClient.get('assets/packagingUnit.json').subscribe(data => {  
      this.packagingUnitsList = data;
    });
    this.httpClient.get('assets/travelDocumentType.json').subscribe(data => {  
      this.documentTypeList = data;
    });
    this.httpClient.get('assets/ACEBrokersList.json').subscribe(data => {  
      this.brokersList = data;
    });
    this.httpClient.get('assets/jsonFiles/ACEinbond-types.json').subscribe(data => {  
      this.inbondTypesList = data;
    });
    this.httpClient.get('assets/jsonFiles/ACEforeignPorts.json').subscribe(data => {  
      this.foreignPortsList = data;
    });
    this.httpClient.get('assets/jsonFiles/worldCountries.json').subscribe(data => {  
      this.countriesList = data;
    });
    this.httpClient.get('assets/jsonFiles/ACEthirdPartyTypes.json').subscribe(data => {  
      this.thirdPartiesList = data;
    });
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
    });
  }
  getStates() {
    this.apiService.getData('states/getCanadianStates')
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
getUSStates(){
  this.apiService.getData('states/getUSStates')
  .subscribe((result: any) => {
    this.addressStates = result.Items;
  });
}
getAddressCities() { 
  this.apiService.getData('cities/state/' + this.usAddress.state)
    .subscribe((result: any) => {
      this.addressCities = result.Items;
    });
}
getThirdPartyStatesCities(){
  this.apiService.getData('states')
  .subscribe((result: any) => {
    this.thirdPartyStates = result.Items;
  });
  this.apiService.getData('cities')
  .subscribe((result: any) => {
    this.thirdPartyCities = result.Items;
  });
}
getThirdPartyStates(s,p){
  const countryID = this.shipments[s].thirdParties[p].address.country;
  this.apiService.getData('states/country/' + countryID)
  .subscribe((result: any) => {
    this.thirdPartyStates = result.Items;
  });
  }
  getThirdPartyCities(s,p){
    const stateID = this.shipments[s].thirdParties[p].address.stateProvince;
    this.apiService.getData('cities/state/' + stateID)
    .subscribe((result: any) => {
      this.thirdPartyCities = result.Items;
    });
    }
  getStatesDoc(i, j) { //document issuing states
    const countryID = this.passengers[i].travelDocuments[j].country;
    this.apiService.getData('states/country/' + countryID)
      .subscribe((result: any) => {
        this.passengerDocStates = result.Items;
      });
  }
  getDocStates(){
    this.apiService.getData('states')
    .subscribe((result: any) => {
      this.passengerDocStates = result.Items;
    });
  }
  fetchDrivers() {
    this.apiService.getData('drivers').subscribe((result: any) => {
      this.fetchedDrivers = result.Items;
    });
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }
  fetchCarrier(){
    this.apiService.getData('carriers/getCarrier')
    .subscribe((result: any) => {
      this.carriers = result.Items;
    });    
  }v
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
    fetchBrokers(){
      this.apiService.getData('brokers').subscribe((result:any)=> {
        this.brokers = result.Items;
      });
      }
  // TRUCK DATA
  addTruckSeal(){
    this.truck.sealNumbers.push({sealNumber: ''});
    if(this.truck.sealNumbers.length <= 2){
      this.addTruckSealBtn = true;
    } 
    else  {
      this.addTruckSealBtn = false;
    }    
  }  
// TRAILER DATA
addTrailerSeal(i){
  if(this.trailers[i].sealNumbers.length <= 3) {
    this.trailers[i].sealNumbers.push({sealNumber: ''});
  }
       
}
 addTrailer() {
  this.trailers.push({
    assetID: '',
    sealNumbers: [{sealNumber:''}],
  });
  this.addTrailerBtn = true;

  if (this.trailers.length >= 9999) {
    this.addTrailerBtn = false;
  }
  else {
    this.addTrailerBtn = true;
  }
}
deleteTrailer(i: number) {
  this.trailers.splice(i, 1);
  this.addTrailerBtn = true;
}
  addShipment() {
    this.shipments.push({
      shipmentType: '',
      shipmentControlNumber: '',
      provinceOfLoading: '',
      goodsAstrayDateOfExit: '',
      inBondDetails: {
        type: '',
        paperInBondNumber: '',
        usDestination:'',
        foreignDestination: '',
        onwardCarrierScac: '',
        irsNumber: '',
        estimatedDepartureDate: '',
        fda: '',
       },
      SCAC: '',     
      shipperID: '', 
        consigneeID: '', 
        broker: {
          filerCode: '',
          portLocation: ''
         },
         thirdParties:[],
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
        marksAndNumbers: [{markNumber: ''}],
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

  addMarksAndNumbers(s,i){
    if(this.shipments[s].commodities[i].marksAndNumbers.length <=3) {
      this.shipments[s].commodities[i].marksAndNumbers.push({markNumber: ''});
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
      marksAndNumbers: [{markNumber: ''}],
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
  }
  deleteCommodity(i: number, s: number) {
    this.shipments[s].commodities.splice(i, 1);
  }
 addThirdParty(p){
   if(this.shipments[p].thirdParties.length <= 20){
   this.shipments[p].thirdParties.push({
    type: '',
    name:'',
    address: {
    addressLine: '',
    city: '',
    stateProvince: '',
    country: '',
    postalCode: '',
    }
    });}
 }
 deleteThirdParty(i: number, s: number) {
  this.shipments[s].thirdParties.splice(i, 1);
}

  addACEManifest() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
    if(this.shipments.length == 0){ // to show error on empty US address
      if(this.usAddress.state == ''){
        this.errorClassState = true; 
      }
      else{
        this.errorClassState = false; 
      }
      if(this.usAddress.city == ''){
        this.errorClassCity = true; 
      }else{
        this.errorClassCity = false;
      }
      if(this.usAddress.addressLine == ''){
        this.errorClassAddress = true; 
      }else{
        this.errorClassAddress = false; 
      }
      if(this.usAddress.zipCode == ''){
        this.errorClassZip = true; 
      }else{
        this.errorClassZip = false; 
      }
      if(this.usAddress.state !== '' && this.usAddress.city !== '' && this.usAddress.addressLine !== '' && this.usAddress.zipCode !== ''){
        this.address = true;
      }
    }
    if(this.shipments.length > 0 || this.address){  
    const data = {
      SCAC: this.SCAC,
      tripNumber: this.tripNumber,
      usPortOfArrival: this.usPortOfArrival,
      estimatedArrivalDate: this.estimatedArrivalDate,
      estimatedArrivalTime: this.estimatedArrivalTime,
      truck: this.truck,
      trailers: this.trailers,
      drivers: this.drivers,
      usAddress: this.usAddress,
      passengers: this.passengers,
      shipments: this.shipments, 
      currentStatus: 'Draft'
    };  
    this.apiService.postData('ACEeManifest', data).subscribe({
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
  }
  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error')
      });
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label')
      });
    this.errors = {};
  }
  fetchACEEntry() {
    this.apiService
      .getData('ACEeManifest/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.entryID = this.entryID;
        this.sendId = result.sendId;
        this.timeCreated =  result.timeCreated;
          this.SCAC = result.SCAC;
          // this.tripNumber = result.tripNumber.substring(4,(result.tripNumber.length));
          this.tripNumber = result.tripNumber;
          this.usPortOfArrival = result.usPortOfArrival;
          this.estimatedArrivalDate = result.estimatedArrivalDate;
          this.estimatedArrivalTime = result.estimatedArrivalTime;
          this.truck = result.truck;
          this.drivers = result.drivers;
          this.trailers = result.trailers;
          this.passengers = result.passengers;
          this.shipments = result.shipments;
          this.currentStatus = result.currentStatus,
          this.usAddress[`addressLine`] = result.usAddress.addressLine,
          this.usAddress[`state`] = result.usAddress.state,
          this.usAddress[`city`] = result.usAddress.city,
          this.usAddress[`zipCode`] = result.usAddress.zipCode,
          setTimeout(() => {
            this.getStates();
            this.getAddressCities();
          }, 2000);
      });
  }
  updateACEManifest() {
    this.hideErrors();
    if(this.shipments.length == 0){ // to show error on empty US address
      if(this.usAddress.state == ''){
        this.errorClassState = true; 
      }
      else{
        this.errorClassState = false; 
      }
      if(this.usAddress.city == ''){
        this.errorClassCity = true; 
      }else{
        this.errorClassCity = false;
      }
      if(this.usAddress.addressLine == ''){
        this.errorClassAddress = true; 
      }else{
        this.errorClassAddress = false; 
      }
      if(this.usAddress.zipCode == ''){
        this.errorClassZip = true; 
      }else{
        this.errorClassZip = false; 
      }
      if(this.usAddress.state !== '' && this.usAddress.city !== '' && this.usAddress.addressLine !== '' && this.usAddress.zipCode !== ''){
        this.address = true;
      }
    }
    if(this.shipments.length > 0 || this.address){  
    const data = {
      entryID: this.entryID,
      timeCreated: this.timeCreated,
      sendId: this.sendId,
      SCAC: this.SCAC,
      tripNumber:this.SCAC+this.tripNumber,
      usPortOfArrival: this.usPortOfArrival,
      estimatedArrivalDate: this.estimatedArrivalDate,
      estimatedArrivalTime: this.estimatedArrivalTime,
      truck: this.truck,
      trailers: this.trailers,
      drivers: this.drivers,
      passengers: this.passengers,
      shipments: this.shipments, 
      currentStatus: this.currentStatus,
      usAddress: this.usAddress
    };
    console.log('ata',data);
    this.apiService.putData('ACEeManifest', data).subscribe({
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
        this.toastr.success('Manifest Updated successfully.');
        this.router.navigateByUrl('/dispatch/cross-border/eManifests');

      },
    });
  }
}
}
