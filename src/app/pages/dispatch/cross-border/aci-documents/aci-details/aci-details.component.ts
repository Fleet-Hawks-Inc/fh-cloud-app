import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-aci-details',
  templateUrl: './aci-details.component.html',
  styleUrls: ['./aci-details.component.css']
})
export class AciDetailsComponent implements OnInit {

  public entryID;
  title = 'ACI e-Manifest Details';
  data: string;
  sendId: string;
  companyKey: string;
  operation: string;
  portOfEntry: string;
  subLocation: string;
  estimatedArrivalDate: string;
  estimatedArrivalTime: string;
  estimatedArrivalTimeZone: string;
  drivers = [];
  truck: any;
  trailers: any = [];
  shipments: any = [];
  shipmentArray: any = [];
  containers: any = [];
  passengers: any = [];
  currentStatus: string;
  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  shipmentType: string;
  tripNumber: string;
  CCC: string;
  provinceOfLoading: string;
  finalData: {
    data: string,
    operation: string,
    tripNumber: string,
    portOfEntry: string,
    estimatedArrivalDateTime: string,
    estimatedArrivalTimeZone: string,
    truck: {
      number: string,
      type: string,
      vinNumber: string,
      licensePlates: {
          number: string,
          stateProvince: string
        }
      
    },
    trailers: [
      {
        number: string,
        type: string,
        licensePlates: {
            number: string,
            stateProvince: string
          }
        
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
        ]
      }
    ],
     shipments: [
      {
        data: string,
        operation: string,
        shipmentType: string,
        loadedOn: {
          type: string,
          number: string
        },
        cargoControlNumber: string,
        referenceOnlyShipment: boolean,
        portOfEntry: string,
        releaseOffice: string,
        estimatedArrivalDate: string,
        estimatedArrivalTimeZone: string,
        cityOfLoading: {
          cityName: string,
          stateProvince: string
        },
        cityOfAcceptance: {
          cityName: string,
          stateProvince: string
        },
        consolidatedFreight: false,
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
        commodities: [
          {
            description: string,
            quantity: number,
            packagingUnit: string,
            weight: string,
            weightUnit: string
          }
        ],
        autoSend: boolean
      }
    ],
    autoSend: boolean
  };
  loadedType = 'TRAILER';
  finalTruckData: any = [];
  finalDrivers: any = [];
  finalTrailers: any = [];
  finalshipments: any = [];
  constructor(private apiService: ApiService, private route: ActivatedRoute,private toastr: ToastrService) { }

  ngOnInit() {
    this.entryID = this.route.snapshot.params['entryID'];
    this.fetchACEEntry();
  }
  modifyShipment() {

    for (let i = 0; i < this.shipments.length; i++) {
      let totalQty = 0;
      for (let j = 0; j < this.shipments[i].commodities.length; j++) {
        totalQty = totalQty + this.shipments[i].commodities[j].quantity;
      }
      this.shipmentArray.push({
        shipmentNumber: this.shipments[i].CCC.concat(this.shipments[i].cargoControlNumber.toString()),
        type: this.shipments[i].shipmentType,
        totalCommodities: this.shipments[i].commodities.length,
        totalQuantity: totalQty,
        loadedOnType: this.shipments[i].loadedOn.type,
        loadedOnNumber: this.shipments[i].loadedOn.number
      });
    }
  }

  finalTruckFn() {
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
    let test = {
      number: this.truck.number,
      type: this.truck.type,
      vinNumber: this.truck.vinNumber,
      licensePlate: {
        number: this.truck.licensePlate.number,
        stateProvince: this.truck.licensePlate.stateProvince
      },
      sealNumbers: sealsArray,
      cargoExemptions: this.truck.cargoExemptions
    };
    this.finalTruckData = test;
  }
  finalDriversArrayFn() {
    let test: any = [];
    for (let i = 0; i < this.drivers.length; i++) {
      let docArray = [];
      for (let j = 0; j < this.drivers[i].travelDocuments.length; j++) {
        let test1 = {
          number: this.drivers[i].travelDocuments[j].number,
          type: this.drivers[i].travelDocuments[j].type,
          stateProvince: this.drivers[i].travelDocuments[j].stateProvince,
          country: this.drivers[i].travelDocuments[j].country
        };
        docArray.push(test1);
      }
      test = {
        firstName: this.drivers[i].firstName,
        lastName: this.drivers[i].lastName,
        gender: this.drivers[i].gender,
        dateOfBirth: this.drivers[i].dateOfBirth,
        citizenshipCountry: this.drivers[i].citizenshipCountry,
        travelDocuments: docArray,
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
      test = {
        number: this.trailers[i].number,
        type: this.trailers[i].type,
        licensePlate: {
          number: this.truck.licensePlate.number,
          stateProvince: this.truck.licensePlate.stateProvince
        },
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
        let com = {
          description: this.shipments[i].commodities[j].description,
          quantity: this.shipments[i].commodities[j].quantity,
          packagingUnit: this.shipments[i].commodities[j].packagingUnit,
          weight: this.shipments[i].commodities[j].weight,
          weightUnit: this.shipments[i].commodities[j].weightUnit,
          marksAndNumbers: this.shipments[i].commodities[j].marksAndNumbers
        };
        testCommodity.push(com);
      }
      test = {
        data: this.shipments[i].data,
        operation: this.shipments[i].operation,
        shipmentType: this.shipments[i].shipmentType,
        loadedOn: {
          type: this.shipments[i].loadedOn.type,
          number: this.shipments[i].loadedOn.number
        },
        cargoControlNumber: this.shipments[i].CCC + this.shipments[i].cargoControlNumber,
        referenceOnlyShipment: false,
        portOfEntry: this.shipments[i].portOfEntry,
        releaseOffice: this.shipments[i].releaseOffice,
        estimatedArrivalDate: this.shipments[i].estimatedArrivalDate + this.shipments[i].estimatedArrivalTime,
        estimatedArrivalTimeZone: this.shipments[i].estimatedArrivalTimeZone,
        cityOfLoading: {
          cityName: this.shipments[i].cityOfLoading.cityName,
          stateProvince: this.shipments[i].cityOfLoading.stateProvince
        },
        cityOfAcceptance: {
          cityName: this.shipments[i].cityOfAcceptance.cityName,
          stateProvince: this.shipments[i].cityOfAcceptance.stateProvince
        },
        consolidatedFreight: false,
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
        commodities: testCommodity,
        autoSend: false
      };
      this.finalshipments.push(test);
    }
  }
  fetchACEEntry() {
    this.apiService
      .getData('ACIeManifest/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('Fetched Data', result);
        this.entryID = this.entryID;
        this.data = result.data;
        this.sendId = result.sendId;
        this.companyKey = result.companyKey;
        this.operation = result.operation;
        this.tripNumber = result.tripNumber;
        this.CCC = result.CCC;
        this.portOfEntry = result.portOfEntry;
        this.subLocation = result.subLocation;
        this.estimatedArrivalDate = result.estimatedArrivalDate;
        this.estimatedArrivalTime = result.estimatedArrivalTime;
        this.estimatedArrivalTimeZone = result.estimatedArrivalTimeZone,
        this.truck = result.truck;
        this.drivers = result.drivers;
        this.passengers = result.passengers;
        this.trailers = result.trailers;
        this.containers = result.containers,
        this.shipments = result.shipments;
        this.currentStatus = result.currentStatus;
        this.modifyShipment();
        setTimeout(() => {
         this.finalTruckFn();
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
      tripNumber: this.CCC + this.tripNumber,
      portOfEntry: this.portOfEntry,
      estimatedArrivalDateTime: this.estimatedArrivalDate + ' ' + this.estimatedArrivalTime,
      estimatedArrivalTimeZone: this.estimatedArrivalTimeZone,
      truck: this.finalTruckData,
      trailers: this.finalTrailers,
      drivers: this.finalDrivers,
      shipments: this.finalshipments,
      autoSend: false
    };
    console.log('final data', this.finalData);
  }
  setStatus(entryID, val) {
    this.apiService.getData('ACIeManifest/setStatus/' + entryID + '/' + val).subscribe((result: any) => {
      this.toastr.success('Status Updated Successfully!');
      this.currentStatus = val;
    });
  }
}
