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
 
  vehicles = [];
  assets = [];
  trips = [];
  drivers = [];
  shippers = [];
  consignees = [];
  brokers = [];
  data: string;
  sendId: string;
  companyKey: string;
  operation: string;
  usPortOfArrival: string;
  estimatedArrivalDateTime: string;
  addTruckSealBtn = true;
  truck = {
    truckID: '',
    sealNumbers: [{sealNumber: ''}]
  }
  assetsArray = [
    {
      assetID: '',
      sealNumbers: [{sealNumber:''}],
    }];
  addTrailerSealBtn = true;  
  vehicleNumber: string;
  vehicleType: string;
  vinNumber: string;
  LicencePlatenumber: string;
  truckSealDiv = false;
  truckIITDiv = false;  
  ETA: string;
  estimatedArrivalDate: string;
  estimatedArrivalTime: string;
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
  brokersList: any = [];
  timeList: any = [];
  tripNumber: string;
  SCAC: string; 
  
  shipmentInput: string;
  shipmentControlNumber: string;
  provinceOfLoading: string;
  states: any = [];
  countries: any = [];
  packagingUnitsList: any = [];
  addTrailerBtn = true;  
  timeCreated = '';
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
      type: '',
      shipmentControlNumber: '',
      provinceOfLoading: '',
      SCAC: '', 
        shipperID: '',
        consigneeID: '',
        broker: {
          filerCode: '',
          portLocation: ''
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
  ngOnInit() {
    this.entryID = this.route.snapshot.params[`entryID`];
    if (this.entryID) {
      this.title = 'Edit ACE e-Manifest';
      this.fetchACEEntry();
      this.getDocStates();
    } else {
      this.title = 'Add ACE e-Manifest';
    }
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.fetchCountries();
    this.fetchShippers();
    this.fetchConsignees();
    this.fetchBrokers();
    this.getStates();
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
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
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
    if(this.truck.sealNumbers.length <= 3){
      this.addTruckSealBtn = true;
    } 
    else  {
      this.addTruckSealBtn = false;
    }    
  }  
// TRAILER DATA
addTrailerSeal(i){
  if(this.assetsArray[i].sealNumbers.length <= 3) {
    this.assetsArray[i].sealNumbers.push({sealNumber: ''});
  }
       
}
 addTrailer() {
  this.assetsArray.push({
    assetID: '',
    sealNumbers: [{sealNumber:''}],
  });
  this.addTrailerBtn = true;

  if (this.assetsArray.length >= 9999) {
    this.addTrailerBtn = false;
  }
  else {
    this.addTrailerBtn = true;
  }
}
deleteTrailer(i: number) {
  this.assetsArray.splice(i, 1);
  this.addTrailerBtn = true;
}
  addShipment() {
    this.shipments.push({
      type: '',
      shipmentControlNumber: '',
      provinceOfLoading: '',
      SCAC: '',     
      shipperID: '', 
        consigneeID: '', 
        broker: {
          filerCode: '',
          portLocation: ''
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
    this.shipments[s].commodities[i].marksAndNumbers.push({markNumber: ''});
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
    // console.log('commodity', this.commodities);
  }
  deleteCommodity(i: number, s: number) {
    this.shipments[s].commodities.splice(i, 1);
  }
  getStates() {
    this.apiService.getData('states/getCanadianStates')
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  addACEManifest() {
    const data = {
      SCAC: this.SCAC,
      tripNumber: this.tripNumber,
      usPortOfArrival: this.usPortOfArrival,
      estimatedArrivalDate: this.estimatedArrivalDate,
      estimatedArrivalTime: this.estimatedArrivalTime,
      truck: this.truck,
      trailers: this.assetsArray,
      drivers: this.driverArray,
      passengers: this.passengers,
      shipments: this.shipments, 
      currentStatus: 'DRAFT'
    }; 
    console.log('Added Data', data);
    this.apiService.postData('ACEeManifest', data).subscribe({
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
  fetchACEEntry() {
    this.apiService
      .getData('ACEeManifest/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.entryID = this.entryID;
        this.timeCreated =  result.timeCreated;
          this.SCAC = result.SCAC;
          this.tripNumber = result.tripNumber;
          this.usPortOfArrival = result.usPortOfArrival;
          this.estimatedArrivalDate = result.estimatedArrivalDate;
          this.estimatedArrivalTime = result.estimatedArrivalTime;
          this.truck = result.truck;
          this.driverArray = result.drivers;
          this.assetsArray = result.trailers;
          this.passengers = result.passengers;
          this.shipments = result.shipments       
          setTimeout(() => {
            this.getStates();
          }, 2000);
      });
  }
  updateACEManifest() {
    const data = {
      entryID: this.entryID,
      timeCreated: this.timeCreated,
      SCAC: this.SCAC,
      tripNumber: this.tripNumber,
      usPortOfArrival: this.usPortOfArrival,
      estimatedArrivalDate: this.estimatedArrivalDate,
      estimatedArrivalTime: this.estimatedArrivalTime,
      truck: this.truck,
      trailers: this.assetsArray,
      drivers: this.driverArray,
      passengers: this.passengers,
      shipments: this.shipments, 
      currentStatus: 'DRAFT'
    };
    console.log('Updated Data', data);
    this.apiService.putData('ACEeManifest', data).subscribe({
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
        this.toastr.success('Manifest Updated successfully');
        this.router.navigateByUrl('/dispatch/cross-border/eManifests');

      },
    });
  }
}
