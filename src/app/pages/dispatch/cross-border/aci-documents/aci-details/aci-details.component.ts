import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-aci-details',
  templateUrl: './aci-details.component.html',
  styleUrls: ['./aci-details.component.css']
})
export class AciDetailsComponent implements OnInit {

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
  truck: {
    number: '',
    type: '',
    vinNumber: '',
    licensePlate: {
      number: '',
      stateProvince: ''
    }
  };
  vehicleNumber: string;
  vehicleType: string;
  vinNumber: string;
  LicencePlatenumber: string;
  vehicleLicenceProvince: string;
  vehicleSeals = [];
  tags = [];
  ETA: string;
 // date: NgbDateStruct;
  // time: NgbTimeStruct;
  assetArray = [];
  assetSeals = [];
  assetTags = [];
  assetId = [];
  driverId = [];
  driverArray = [];
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
  // ]
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
  marks1: string;
  marks2: string;
  marks3: string;
  marks4: string;
  marksArray = [];
  loadedType = 'TRAILER';
  constructor(private apiService: ApiService, private route: ActivatedRoute,) { }

  ngOnInit() {
    this.entryID = this.route.snapshot.params['entryID'];
    this.fetchACEEntry();
  }
  fetchACEEntry() {
    this.apiService
      .getData('ACEeManifest/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('Fetched Data', result);
        this.entryID = this.entryID;
        this.data = result.data;
        this.sendId = result.sendId;
        this.companyKey = result.companyKey;
        this.operation = result.operation;
        this.tripNumber = result.tripNumber;
        this.usPortOfArrival = result.usPortOfArrival;
        this.estimatedArrivalDateTime = result.estimatedArrivalDateTime;
        this.truck = {
          number: result.truck.number,
          type: result.truck.type,
          vinNumber: result.truck.vinNumber,
          licensePlate: {
            number: result.truck.licensePlate.number,
            stateProvince: result.truck.licensePlate.stateProvince
          }
        };
        this.driverArray = result.drivers;
        this.passengers = result.passengers;
      //  setTimeout(() => {
      //   this.getVehicleId(result.truck.vinNumber);
      //   this.getDriverIdArray(result.drivers);
      //   this.getAssetIdArray(result.trailers);
      //   this.getShipmentData(result.shipments);
      // }, 2000);

      });
  }

}
