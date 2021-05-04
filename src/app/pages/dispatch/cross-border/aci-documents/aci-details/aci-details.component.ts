import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
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
  countryCodeName: any = {};
  assetTypeCode: any = {};
  stateCodeToName: any = {};
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
      amountCurrency: ''
    },
    licensePlate: {
      number: '',
      stateProvince: '',
    },
    sealNumbers: []
  };
  mainDriver : any  = {};
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
    fastCardNumber: '',
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
  documentTypeList: any = [];
  documentsTypesObjects: any = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';

  sendBorderConnectOption = false;
  packagingUnitsObjects: any = {};
  vehicleTypeObjects: any = {};
  cargoExemptionTypeObjects: any = {};
  shipmentTypeObjects: any = {};
  canadianPortsObjects: any = {};
  subLocationObjects: any = {};
  releaseOfficeObjects: any = {};
  constructor(private apiService: ApiService, private route: ActivatedRoute, private toastr: ToastrService, private router: Router, private httpClient: HttpClient) { }

  ngOnInit() {
    this.entryID = this.route.snapshot.params[`entryID`];
    this.fetchACIEntry();
    this.fetchCountriesCodeName();
    this.fetchAssetsCodeName();
    this.fetchStatesCodeName();
    this.fetchDocuments();
    this.fetchVehicleType();
    this.fetchCargoExemptionType();
    this.fetchPackagingUnits();
    this. fetchShipmentType();
    this.fetchCanadianPorts();
    this.fetchSublocationList();
    this.fetchReleaseOfficeList();
  }
  fetchCountriesCodeName() {
    this.apiService.getData('countries/get/country/CodeToName').subscribe((result: any) => {
    this.countryCodeName = result;
    });
  }
  fetchAssetsCodeName() {
    this.apiService.getData('borderAssetTypes/get/list').subscribe((result: any) => {
    this.assetTypeCode = result;
    });
  }
  fetchVehicleType() {
    this.httpClient.get('assets/vehicleType.json').subscribe((data: any) => {
      this.vehicleTypeObjects =  data.reduce( (a: any, b: any) => {
        return a[b[`code`]] = b[`name`], a;
    }, {});
    });
  }
  fetchSublocationList() {
    this.httpClient.get('assets/ACIsubLocations.json').subscribe((data: any) => {
      this.subLocationObjects =  data.reduce( (a: any, b: any) => {
        return a[b[`code`]] = b[`name`], a;
    }, {});
    });
  }

  fetchCargoExemptionType() {
    this.httpClient.get('assets/ACIcargoExemption.json').subscribe((data: any) => {
      this.cargoExemptionTypeObjects =  data.reduce( (a: any, b: any) => {
        return a[b[`code`]] = b[`name`], a;
    }, {});
    });
  }
  fetchReleaseOfficeList() {
    this.httpClient.get('assets/ACIReleaseOffice.json').subscribe((data: any) => {
      this.releaseOfficeObjects =  data.reduce( (a: any, b: any) => {
        return a[b[`number`]] = b[`name`], a;
    }, {});
    });
  }

  fetchShipmentType() {
    this.httpClient.get('assets/jsonFiles/ACIShipmentType.json').subscribe((data: any) => {
      this.shipmentTypeObjects =  data.reduce( (a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
    }, {});
    });
  }
  fetchDocuments() {
    this.httpClient.get('assets/travelDocumentType.json').subscribe(data => {
      this.documentTypeList = data;

      this.documentsTypesObjects = this.documentTypeList.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
      }, {});
    });
  }
  fetchStatesCodeName() {
    this.apiService.getData('states/get/state/codeToName').subscribe((result: any) => {
    this.stateCodeToName = result;
    });
  }
  fetchPackagingUnits() {
    this.httpClient.get('assets/jsonFiles/ACIpackagingUnit.json').subscribe((data: any) =>{

      this.packagingUnitsObjects = data.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`name`], a;
      }, {});
    });
  }
  fetchCanadianPorts() {
    this.httpClient.get('assets/canadianPorts.json').subscribe((data: any) => {
      this.canadianPortsObjects = data.reduce((a: any, b: any) => {
        return a[b[`number`]] = b[`name`], a;
      }, {});
    });
  }
  fetchACIEntry() {
    this.apiService
      .getData('ACIeManifest/details/' + this.entryID)
      .subscribe((result: any) => {
        console.log('result', result);
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
        this.estimatedArrivalTimeZone = result.estimatedArrivalTimeZone;
        this.truck = result.truck;
        this.mainDriver = result.mainDriver;
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
      .getData('ACIeManifest/CBSAdetails/' + this.entryID).subscribe((result: any) => {
        // this.sendBorderConnectOption = result;
        // if (this.sendBorderConnectOption === true) {
        //   const val = 'Queued';
        //   const setStatus: any = this.apiService.getData('ACIeManifest/setStatus/' + this.entryID + '/' + val).subscribe((result: any) => {
        //     this.toastr.success('Status Updated Successfully!');
        //      this.currentStatus = val;
        //   });
        // }
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
    };
  }
  showMainDriverDetails() {
    this.driverData = {
      driverID: this.mainDriver.driverID,
      driverNumber: this.mainDriver.driverNumber,
      firstName: this.mainDriver.firstName,
      gender: this.mainDriver.gender,
      lastName: this.mainDriver.lastName,
      dateOfBirth: this.mainDriver.dateOfBirth,
      citizenshipCountry: this.mainDriver.citizenshipCountry,
      fastCardNumber: this.mainDriver.fastCardNumber,
      travelDocuments: this.mainDriver.travelDocuments
    };
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
