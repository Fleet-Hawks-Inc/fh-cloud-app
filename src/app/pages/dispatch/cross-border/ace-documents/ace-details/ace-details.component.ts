import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Subject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-ace-details',
  templateUrl: './ace-details.component.html',
  styleUrls: ['./ace-details.component.css']
})
export class AceDetailsComponent implements OnInit {
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
  estimatedArrivalDate: string;
  estimatedArrivalTime: string;
  status: string;
  vehicleNumber: string;
  vehicleType: string;
  vinNumber: string;  
  vehicleLicenceProvince: string;

  truck: any = [];
  assetArray = []; 
  assetId = [];
  driverId = [];
  driverArray = [];
  trailers = [];
  shipments = [];
  finalData: {
    data: string,
    operation: string,
    tripNumber: string,
    usPortOfArrival: string,
    estimatedArrivalDateTime: string,
    truck: {
      number: string,
      type: string,
      vinNumber: string,
      licensePlates: [
        {
          number: string,
          stateProvince: string
        }
      ]
    },
    trailers: [
      {
        number: string,
        type: string,
        licensePlates: [
          {
            number: string,
            stateProvince: string
          }
        ]
      }
    ],
    drivers: [
      {
        firstName: string,
        lastName: string,
        gender: string,
        dateOfBirth: string,
        citizenshipCountry: string,
        travelDocuments: [
          {
            number: string,
            type: string,
            stateProvince: string,
            country: string
          }
        ],
        usAddress: {
          addressLine: string,
          city: string,
          state: string,
          zipCode: string
        }
      }
    ],
    shipments: [
      {
        data: string,
        operation: string,
        type: string,
        shipmentControlNumber: string,
        provinceOfLoading: string,
        shipper: {
          name: string,
          address: {
            addressLine: string,
            city: string,
            stateProvince: string,
            postalCode: string
          }
        },
        consignee: {
          name: string,
          address: {
            addressLine: string,
            city: string,
            stateProvince: string,
            postalCode: string
          }
        },
        broker: {
          filerCode: string,
          portLocation: string
        },
        commodities: [
          {
            loadedOn: {
              type: string,
              number: string
            },
            description: string,
            quantity: number,
            packagingUnit: string,
            weight: number,
            weightUnit: string
          }
        ],
        autoSend: boolean
      }
    ],
    autoSend: boolean
  };
  finalTruckData: any;
  finalDrivers: any = [];
  finalTrailers: any = [];
  finalshipments: any = [];
  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = ''; 
  shipmentArray: any = [];
  shipmentType: string;
  tripNumber: string;
  SCAC: string;
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
  loadedType = 'TRAILER';
  constructor(private apiService: ApiService, private route: ActivatedRoute,private toastr: ToastrService) { }

  ngOnInit() {
    this.entryID = this.route.snapshot.params['entryID'];
    this.fetchACEEntry();
  }
  finalTruckFn() {
    console.log('truck array', this.truck);
    let licenseArray: any = [];
    let sealsArray = [];
    if (this.truck.sealNumbers1) {
      sealsArray.push(this.truck.sealNumbers1);
    }
    if (this.truck.sealNumbers2) {
      sealsArray.push(this.truck.sealNumbers2);
    }
    if (this.truck.sealNumbers3) {
      sealsArray.push(this.truck.sealNumbers3);
    }
    if (this.truck.sealNumbers4) {
      sealsArray.push(this.truck.sealNumbers4);
    }
    for (let i = 0; i < this.truck.licensePlates.length; i++) {
      let test1 = {
        number: this.truck.licensePlates[i].number,
        stateProvince: this.truck.licensePlates[i].stateProvince
      };
      licenseArray.push(test1);
    }
    let test = {
      number: this.truck.number,
      type: this.truck.type,
      vinNumber: this.truck.vinNumber,
      licensePlates: licenseArray,
      sealNumbers: sealsArray
    }
    this.finalTruckData = test;
  }
  modifyShipment() {

    for (let i = 0; i < this.shipments.length; i++) {
      let totalQty = 0;
      for (let j = 0; j < this.shipments[i].commodities.length; j++) {
        totalQty = totalQty + this.shipments[i].commodities[j].quantity;
      }
      this.shipmentArray.push({
        shipmentNumber: this.shipments[i].SCAC.concat(this.shipments[i].shipmentControlNumber.toString()),
        type: this.shipments[i].type,
        totalCommodities: this.shipments[i].commodities.length,
        totalQuantity: totalQty
      });
    }
  }
  finalDriversArrayFn() {
    let test: any = [];
    for (let i = 0; i < this.driverArray.length; i++) {
      let docArray = [];
      for (let j = 0; j < this.driverArray[i].travelDocuments.length; j++) {
        let test1 = {
          number: this.driverArray[i].travelDocuments[j].number,
          type: this.driverArray[i].travelDocuments[j].type,
          stateProvince: this.driverArray[i].travelDocuments[j].stateProvince,
          country: this.driverArray[i].travelDocuments[j].country
        };
        docArray.push(test1);
      }
      test = {
        firstName: this.driverArray[i].firstName,
        lastName: this.driverArray[i].lastName,
        gender: this.driverArray[i].gender,
        dateOfBirth: this.driverArray[i].dateOfBirth,
        citizenshipCountry: this.driverArray[i].citizenshipCountry,
        travelDocuments: docArray,
        usAddress: {
          addressLine: 'test address',
          city: 'test city',
          state: 'test city',
          zipCode: 'test zip code'
        }
      };
      this.finalDrivers.push(test);
    }
    // console.log('final drivers array', this.finalDrivers);
  }
  finalTrailersArrayFn() {
    let test: any = [];
    for (let i = 0; i < this.trailers.length; i++) {
      let sealsArray = [];
      let docArray: any = [];
      if (this.trailers[i].sealNumbers1) {
        sealsArray.push(this.trailers[i].sealNumbers1);
      }
      if (this.trailers[i].sealNumbers2) {
        sealsArray.push(this.trailers[i].sealNumbers2);
      }
      if (this.trailers[i].sealNumbers3) {
        sealsArray.push(this.trailers[i].sealNumbers3);
      }
      if (this.trailers[i].sealNumbers4) {
        sealsArray.push(this.trailers[i].sealNumbers4);
      }
      for (let j = 0; j < this.trailers[i].licensePlates.length; j++) {
        let test = {
          number: this.trailers[i].licensePlates[j].number,
          stateProvince: this.trailers[i].licensePlates[j].stateProvince
        };
        docArray.push(test);
      }
      test = {
        number: this.trailers[i].number,
        type: this.trailers[i].type,
        licensePlates: docArray,
        sealNumbers: sealsArray
      };
      this.finalTrailers.push(test);
    }
  }
  finalShipmentsArrayFn() {
    console.log('shipments in fn', this.shipments);
    let test: any = [];
    for (let i = 0; i < this.shipments.length; i++) {
      let testCommodity: any = [];
      for (let j = 0; j < this.shipments[i].commodities.length; j++) {
        let marksArray = [];
        //  Check Marks Array if not empty
        if (this.shipments[i].commodities[j].marksAndNumbers1) {
          marksArray.push(this.shipments[i].commodities[j].marksAndNumbers1);
        }
        if (this.shipments[i].commodities[j].marksAndNumbers2) {
          marksArray.push(this.shipments[i].commodities[j].marksAndNumbers2);
        }
        if (this.shipments[i].commodities[j].marksAndNumbers3) {
          marksArray.push(this.shipments[i].commodities[j].marksAndNumbers3);
        }
        if (this.shipments[i].commodities[j].marksAndNumbers4) {
          marksArray.push(this.shipments[i].commodities[j].marksAndNumbers4);
        }
        let com = {
          loadedOn: {
            type: this.shipments[i].commodities[j].loadedOn.type,
            number: this.shipments[i].commodities[j].loadedOn.number
          },
          description: this.shipments[i].commodities[j].description,
          quantity: this.shipments[i].commodities[j].quantity,
          packagingUnit: this.shipments[i].commodities[j].packagingUnit,
          weight: this.shipments[i].commodities[j].weight,
          weightUnit: this.shipments[i].commodities[j].weightUnit,
          marksAndNumbers: marksArray
        };
        testCommodity.push(com);
      }
      test = {
        data: this.shipments[i].data,
        operation: this.shipments[i].operation,
        type: this.shipments[i].type,
        shipmentControlNumber: this.shipments[i].SCAC + this.shipments[i].shipmentControlNumber,
        provinceOfLoading: this.shipments[i].provinceOfLoading,
        shipper: {
          name: this.shipments[i].shipper.name,
          address: {
            addressLine: this.shipments[i].shipper.address.addressLine,
            city: this.shipments[i].shipper.address.city,
            stateProvince: this.shipments[i].shipper.address.stateProvince,
            postalCode: this.shipments[i].shipper.address.postalCode
          }
        },
        consignee: {
          name: this.shipments[i].consignee.name,
          address: {
            addressLine: this.shipments[i].consignee.address.addressLine,
            city: this.shipments[i].consignee.address.city,
            stateProvince: this.shipments[i].consignee.address.stateProvince,
            postalCode: this.shipments[i].consignee.address.postalCode
          }
        },
        broker: {
          filerCode: this.shipments[i].broker.filerCode,
          portLocation: this.shipments[i].broker.portLocation
        },
        commodities: testCommodity,
        autoSend: false
      };
      this.finalshipments.push(test);
    }
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
        this.SCAC = result.SCAC;
        this.tripNumber = result.tripNumber;
        this.usPortOfArrival = result.usPortOfArrival;
        this.estimatedArrivalDate = result.estimatedArrivalDate;
        this.estimatedArrivalTime = result.estimatedArrivalTime;
        this.truck = result.truck;
        this.driverArray = result.drivers;
        this.passengers = result.passengers;
        this.trailers = result.trailers;
        this.shipments = result.shipments;
        this.status = result.status,
        setTimeout(() => {
          this.finalTruckFn();
          this.modifyShipment();
          this.finalDriversArrayFn();
          this.finalTrailersArrayFn();
          this.finalShipmentsArrayFn();
        }, 2000);
      });
  }

  finalDataFn() {
    this.finalData = {
      data: 'ACE_TRIP',
      operation: 'CREATE',
      tripNumber: this.SCAC + this.tripNumber,
      usPortOfArrival: this.usPortOfArrival,
      estimatedArrivalDateTime: this.estimatedArrivalDate + ' ' + this.estimatedArrivalTime,
      truck: this.finalTruckData,
      trailers: this.finalTrailers,
      drivers: this.finalDrivers,
      shipments: this.finalshipments,
      autoSend: false
    };
    console.log('final data', this.finalData);
  }
  setStatusFn(val) {
    const data = {
      entryID: this.entryID,
      status: val
    };
    // this.apiService.putData('ACEeManifest', data).subscribe({
    //   next: (res) => {
    //     this.response = res;
    //     this.hasSuccess = true;
    //     this.toastr.success('Status Updated successfully');
    //   },
    // });
  }

}
