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

  constructor(private apiService: ApiService, private route: ActivatedRoute, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.entryID = this.route.snapshot.params['entryID'];
    this.fetchACIEntry();
  }
  fetchACIEntry() {
    this.apiService
      .getData('ACIeManifest/details/' + this.entryID)
      .subscribe((result: any) => {
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
        this.timeCreated = moment(result.timeCreated).format(`MMMM D YYYY, h:mm:ss a`);
        this.timeModified = moment(result.timeModified).format(`MMMM D YYYY, h:mm:ss a`);
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
    const fetchedShipmentData = this.shipments.filter((item: any) => item.shipmentID === shipmentID);
    this.shipmentData = {
      shipmentID: fetchedShipmentData[0].shipmentID,
      shipmentType: fetchedShipmentData[0].shipmentType,
      loadedOn: {
        type: fetchedShipmentData[0].loadedOn.type,
        number: fetchedShipmentData[0].loadedOn.number,
      },
      CCC: fetchedShipmentData[0].CCC,
      cargoControlNumber: fetchedShipmentData[0].cargoControlNumber,
      portOfEntry: fetchedShipmentData[0].portOfEntry,
      releaseOffice: fetchedShipmentData[0].releaseOffice,
      subLocation: fetchedShipmentData[0].subLocation,
      importerCsaBusinessNumber: fetchedShipmentData[0].importerCsaBusinessNumber,
      uniqueConsignmentReferenceNumber: fetchedShipmentData[0].uniqueConsignmentReferenceNumber,
      estimatedArrivalDate: fetchedShipmentData[0].estimatedArrivalDate,
      estimatedArrivalTimeZone: fetchedShipmentData[0].estimatedArrivalTimeZone,
      cityOfLoading: {
        cityName: fetchedShipmentData[0].cityOfLoading.cityName,
        stateProvince: fetchedShipmentData[0].cityOfLoading.stateProvince,
      },
      cityOfAcceptance: {
        cityName: fetchedShipmentData[0].cityOfAcceptance.cityName,
        stateProvince: fetchedShipmentData[0].cityOfAcceptance.stateProvince,
      },
      specialInstructions: fetchedShipmentData[0].specialInstructions,
      shipper: fetchedShipmentData[0].shipper.name,
      consignee: fetchedShipmentData[0].consignee.name,
      deliveryDestinations: fetchedShipmentData[0].deliveryDestinations,
      notifyParties: fetchedShipmentData[0].notifyParties,
      commodities: fetchedShipmentData[0].commodities
    }
  }
  showDriverDetails(driverID) {
    const fetchedDriverData: any = this.drivers.filter((item: any) => item.driverID === driverID);
    this.driverData = {
      driverID: fetchedDriverData[0].driverID,
      driverNumber: fetchedDriverData[0].driverNumber,
      firstName: fetchedDriverData[0].firstName,
      gender: fetchedDriverData[0].gender,
      lastName: fetchedDriverData[0].lastName,
      dateOfBirth: fetchedDriverData[0].dateOfBirth,
      citizenshipCountry: fetchedDriverData[0].citizenshipCountry,
      fastCardNumber: fetchedDriverData[0].fastCardNumber,
      travelDocuments: fetchedDriverData[0].travelDocuments
    }
  }
  showPassengerDetails(passengerID) {
    const fetchedPassengerData: any = this.passengers.filter((item: any) => item.passengerID === passengerID);
    this.passengerData = {
      passengerID: fetchedPassengerData[0].passengerID,
      firstName: fetchedPassengerData[0].firstName,
      gender: fetchedPassengerData[0].gender,
      lastName: fetchedPassengerData[0].lastName,
      dateOfBirth: fetchedPassengerData[0].dateOfBirth,
      citizenshipCountry: fetchedPassengerData[0].citizenshipCountry,
      fastCardNumber: fetchedPassengerData[0].fastCardNumber,
      travelDocuments: fetchedPassengerData[0].travelDocuments
    };
  }
  amendManifest() {
    const amend = true;
  this.router.navigateByUrl('/dispatch/cross-border/ACI-edit-eManifest/' + this.entryID + `?amendManifest=` + amend);
  }
  cancelManifest(entryID) {
    this.apiService.getData(`ACIeManifest/cancelManifest/` + entryID).subscribe();
  }
}
