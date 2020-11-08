import { Component, OnInit, Injectable } from '@angular/core';
import { ApiService } from '../../../../../services';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbTimeStruct, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
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
  stateData: string;
  // time: NgbTimeStruct;
  assetSeals = [];
  assetTags = [];
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
  tripNumber: string;
  SCAC: string;
  tripNo: string;
  constructor(private httpClient: HttpClient,
    private apiService: ApiService,
    private ngbCalendar: NgbCalendar,
    config: NgbTimepickerConfig, private dateAdapter: NgbDateAdapter<string>) {
    config.seconds = true;
    config.spinners = true;
  }

  ngOnInit() {
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchTrips();
    this.fetchDrivers();
    this.httpClient.get('assets/USports.json').subscribe(data => {
      console.log('Data', data);
      this.USports = data;
    });
  }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
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
  fetchStateCode(ID) {
    console.log('State Id', ID);
    this.apiService.getData('states/' + ID).subscribe((result: any) => {
      this.stateData = result.Items;
      console.log('state', this.stateData);
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
  onTagsChanged(e){
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
  showDate() {
    // console.log('Date', this.date);
    // console.log('Time', this.time);
    // console.log('VID', this.vehicleID);
    // await this.fetchVehicleData(this.vehicleID);
    this.ETA = this.date + ' ' + this.time;
    console.log('ETA', this.ETA);
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
      }
    };
    console.log('Data', data);
  }
}
