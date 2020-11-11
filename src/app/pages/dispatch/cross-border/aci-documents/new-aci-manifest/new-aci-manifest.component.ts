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
  CANPorts: any = [];
  trips: any = [];
  vehicles: any = [];
  vehicleData: any = [];
  CCC: string;
  tripNo: string;
  date: NgbDateStruct;
  time: '13:30:00';
  ETA: string;
  data: string;
  sendId: string;
  companyKey: string;
  operation: string;
  tripNumber: string;
  portOfEntry: string;
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
      }
    };
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
    if (this.entryID) {
      this.title = 'Edit ACE e-Manifest';
     // this.fetchACEEntry();
    } else {
      this.title = 'Add ACE e-Manifest';
    }
    this.httpClient.get('assets/canadianPorts.json').subscribe(data => {
       this.CANPorts = data;
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
  fetchVehicleData(ID) {
    this.apiService.getData('vehicles/' + ID).subscribe((result: any) => {
      this.vehicleData = result.Items;
      this.fetchStateCode(this.vehicleData[0].stateID);
      this.truck = {
        number: this.vehicleData[0].vehicleIdentification,
        type: this.vehicleData[0].vehicleType,
        vinNumber: this.vehicleData[0].VIN,
        dotNumber: this.vehicleData[0].VIN,
        insurancePolicy: {
          insuranceCompanyName: this.vehicleData[0].VIN,
          policyNumber: this.vehicleData[0].VIN,
          issuedDate: this.vehicleData[0].VIN,
          policyAmount: this.vehicleData[0].VIN
      },
        licensePlate: {
          number: this.vehicleData[0].plateNumber,
          stateProvince: this.vehicleData[0].stateID
        }
      };
    });
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
  tripNumberFn() {
    this.tripNumber = this.CCC + this.tripNo;
  }
  addACIManifest() {
    this.ETA = this.date + ' ' + this.time;
    const data = {
      data : 'ACI_TRIP',
      sendId: '001',
      companyKey: 'c-9000-2bcd8ae5954e0c48',
      operation: 'CREATE',
      tripNumber: this.tripNumber,
      portOfEntry: this.portOfEntry,
      estimatedArrivalDateTime: this.ETA,
      truck: this.truck,
      // trailers: this.assetArray,
      // drivers: this.driverArray,
      // passengers: this.passengers,
      // shipments: [
      //   {
      //     data: 'ACE_SHIPMENT',
      //     sendId: '001',
      //     companyKey: 'c-9000-2bcd8ae5954e0c48',
      //     operation: 'CREATE',
      //     type: this.shipmentType,
      //     shipmentControlNumber: this.shipmentControlNumber,
      //     provinceOfLoading: this.provinceOfLoading,
      //     shipper: {
      //       name: 'Art place',
      //       address: {
      //         addressLine: '1234 Vancity',
      //         city: 'Vancouver',
      //         stateProvince: 'BC',
      //         postalCode: 'V6H 3J9'
      //       }
      //     },
      //     consignee: {
      //       name: 'Elk Corp of Texas',
      //       address: {
      //         addressLine: '401 Weavertown Rd',
      //         city: 'Myerstown',
      //         stateProvince: 'PA',
      //         postalCode: '17067'
      //       }
      //     },
      //     commodities: this.commodities,
      //   }
      // ],
      // autoSend: false
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
