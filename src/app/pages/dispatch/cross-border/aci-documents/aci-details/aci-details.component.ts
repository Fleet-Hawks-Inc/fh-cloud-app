import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
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
  estimatedArrivalDateTime: string;
  estimatedArrivalTimeZone: string;
  truck: any = {
    number: '',
    type: '',
    vinNumber: '',
    dotNumber: '',
    cargoExemptions: [],
    insurancePolicy: {
      insuranceCompanyName: '',
      policyNumber: '',
      issuedDate: '',
      policyAmount: '',
    },
    licensePlate: {
      number: '',
      stateProvince: '',
    },
    sealNumbers: []  
  };
  drivers = [];
  shipmentType: string;
  tripNumber: string;
  CCC: string;
  trailers: any = [];
  shipments: any = [];
  shipmentArray: any = [];
  containers: any = [];
  passengers: any = [];
  currentStatus: string;
  timeCreated: any;
  timeModified: any;
  createdBy = '';
  modifiedBy = '';
  shipmentData = {
    shipmentID: '',
    shipmentType: '',
    loadedOn: {
      type: '',
      number: ''
    },
    CCC: '',
    cargoControlNumber: '',
    portOfEntry: '',
    releaseOffice: '',
    subLocation: '',
    importerCsaBusinessNumber: '',
    uniqueConsignmentReferenceNumber: '',
    estimatedArrivalDate: '',
    estimatedArrivalTimeZone: '',
    cityOfLoading: {
      cityName: '',
      stateProvince: ''
    },
    cityOfAcceptance: {
      cityName: '',
      stateProvince: ''
    },
    specialInstructions: '',
    shipper: '',
    consignee: '',
    deliveryDestinations: [],
    notifyParties: [],
    commodities: []
  };
  driverData = {
    driverID: '',
    driverNumber: '',
    firstName: '',
    gender: '',
    lastName: '',
    dateOfBirth: '',
    citizenshipCountry: '',
    fastCardNumber:'',
    travelDocuments: [],
  };
  passengerData = {
    passengerID: '',
    firstName: '',
    gender: '',
    lastName: '',
    dateOfBirth: '',
    citizenshipCountry: '',
    fastCardNumber:'',
    travelDocuments: [],
  };
  borderResponses = [];
  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit() {
    this.entryID = this.route.snapshot.params['entryID'];
    this.fetchACIEntry();
  }
  fetchACIEntry() {
    this.apiService
      .getData('ACIeManifest/details/' + this.entryID)
      .subscribe((result: any) => {
        console.log('result',result);
        this.entryID = this.entryID;
        this.data = result.data;
        this.sendId = result.sendId;
        this.companyKey = result.companyKey;
        this.operation = result.operation;
        this.tripNumber = result.tripNumber;
        this.CCC = result.CCC;
        this.portOfEntry = result.portOfEntry;
        this.subLocation = result.subLocation;
        this.estimatedArrivalDateTime = result.estimatedArrivalDateTime;
        this.estimatedArrivalTimeZone = result.estimatedArrivalTimeZone,
        this.truck = result.truck;
        this.drivers = result.drivers;
        this.passengers = result.passengers;
        this.trailers = result.trailers;
        this.containers = result.containers,
        this.shipments = result.shipments;
        this.currentStatus = result.currentStatus;
        this.timeCreated = moment(result.timeCreated).format("MMMM D YYYY, h:mm:ss a");
        this.timeModified = moment(result.timeModified).format("MMMM D YYYY, h:mm:ss a");
        this.createdBy = result.createdBy;
        this.modifiedBy = result.modifiedBy;
        this.borderResponses = result.borderResponses;

      });
  }

  setStatus(entryID, val) {
    this.apiService.getData('ACIeManifest/setStatus/' + entryID + '/' + val).subscribe((result: any) => {
      this.toastr.success('Status Updated Successfully!');
      this.currentStatus = val;
    });
  }
  sendCBSAFn() {
    this.apiService
      .getData('ACIeManifest/CBSAdetails/' + this.entryID)
      .subscribe((result: any) => {
      });
  }

  showShipmentDetails(shipmentID) {
    let shipmentData = this.shipments.filter((item: any) => item.shipmentID === shipmentID); 
    this.shipmentData = {
      shipmentID: shipmentData[0].shipmentID,
      shipmentType: shipmentData[0].shipmentType,
      loadedOn: {
        type: shipmentData[0].loadedOn.type,
        number: shipmentData[0].loadedOn.number,
      },
      CCC: shipmentData[0].CCC,
      cargoControlNumber: shipmentData[0].cargoControlNumber,
      portOfEntry: shipmentData[0].portOfEntry,
      releaseOffice: shipmentData[0].releaseOffice,
      subLocation: shipmentData[0].subLocation,
      importerCsaBusinessNumber: shipmentData[0].importerCsaBusinessNumber,
      uniqueConsignmentReferenceNumber: shipmentData[0].uniqueConsignmentReferenceNumber,
      estimatedArrivalDate: shipmentData[0].estimatedArrivalDate,
      estimatedArrivalTimeZone: shipmentData[0].estimatedArrivalTimeZone,
      cityOfLoading: {
        cityName: shipmentData[0].cityOfLoading.cityName,
        stateProvince: shipmentData[0].cityOfLoading.stateProvince,
      },
      cityOfAcceptance: {
        cityName: shipmentData[0].cityOfAcceptance.cityName,
        stateProvince: shipmentData[0].cityOfAcceptance.stateProvince,
      },
      specialInstructions: shipmentData[0].specialInstructions,
      shipper: shipmentData[0].shipper.name,
      consignee: shipmentData[0].consignee.name,
      deliveryDestinations: shipmentData[0].deliveryDestinations,
      notifyParties: shipmentData[0].notifyParties,
      commodities: shipmentData[0].commodities
    }
  }
  showDriverDetails(driverID) {
    let driverData: any = this.drivers.filter((item: any) => item.driverID === driverID);
    this.driverData = {
      driverID: driverData[0].driverID,
      driverNumber: driverData[0].driverNumber,
      firstName: driverData[0].firstName,
      gender: driverData[0].gender,
      lastName: driverData[0].lastName,
      dateOfBirth: driverData[0].dateOfBirth,
      citizenshipCountry: driverData[0].citizenshipCountry,
      fastCardNumber: driverData[0].fastCardNumber,
      travelDocuments: driverData[0].travelDocuments
    }
  }
  showPassengerDetails(passengerID) {
    let passengerData: any = this.passengers.filter((item: any) => item.passengerID === passengerID);
    this.passengerData = {
      passengerID: passengerData[0].passengerID,
      firstName: passengerData[0].firstName,
      gender: passengerData[0].gender,
      lastName: passengerData[0].lastName,
      dateOfBirth: passengerData[0].dateOfBirth,
      citizenshipCountry: passengerData[0].citizenshipCountry,
      fastCardNumber: passengerData[0].fastCardNumber,
      travelDocuments: passengerData[0].travelDocuments
    }
  }
}