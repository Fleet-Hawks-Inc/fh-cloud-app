import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
@Component({
  selector: 'app-aci-details',
  templateUrl: './aci-details.component.html',
  styleUrls: ['./aci-details.component.css']
})
export class AciDetailsComponent implements OnInit {

  public manifestID;
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
  createdDate: '';
  createdTime: '';
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
      country: ''
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
    referenceOnlyShipment: '',
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
    this.manifestID = this.route.snapshot.params[`manifestID`];
    this.fetchACIEntry();
    this.fetchAssetsCodeName();
    this.fetchDocuments();
    this.fetchVehicleType();
    this.fetchCargoExemptionType();
    this.fetchPackagingUnits();
    this. fetchShipmentType();
    this.fetchCanadianPorts();
    this.fetchSublocationList();
    this.fetchReleaseOfficeList();
  }

  fetchAssetsCodeName() {
    this.httpClient.get('assets/jsonFiles/trailers.json').subscribe((data: any) => {
      this.assetTypeCode  =  data.reduce( (a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
    }, {});
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
      .getData('eManifests/ACIdetails/' + this.manifestID)
      .subscribe((result: any) => {
        this.manifestID = this.manifestID;
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
        this.truck = {
          number: result.truck.number,
          type: result.truck.type,
          vinNumber: result.truck.vinNumber,
          dotNumber: result.truck.dotNumber,
          insurancePolicy: {
            insuranceCompanyName: result.truck.insurancePolicy.insuranceCompanyName,
            policyNumber: result.truck.insurancePolicy.policyNumber,
            issuedDate: result.truck.insurancePolicy.issuedDate,
            policyAmount: result.truck.insurancePolicy.policyAmount,
            amountCurrency: result.truck.insurancePolicy.amountCurrency
          },
          licensePlate: {
              number: result.truck.licensePlate.number,
              stateProvince: CountryStateCity.GetStateNameFromCode(result.truck.licensePlate.stateProvince, result.truck.licensePlate.country),
              country: CountryStateCity.GetSpecificCountryNameByCode(result.truck.licensePlate.country)
            },
          sealNumbers: result.truck.sealNumbers,
          cargoExemptions: result.truck.cargoExemptions
          };
        this.mainDriver = result.mainDriver;
        this.drivers = result.drivers;
        this.passengers = result.passengers;
        this.trailers = result.trailers;
        this.containers = result.containers,
        this.shipments = result.shipments;
        this.fetchLoadingStateCities(result.shipments);
        this.currentStatus = result.currentStatus;
        this.timeCreated = moment(result.timeCreated).format(`MMMM D YYYY, h:mm:ss a`);
        this.timeModified = moment(result.timeModified).format(`MMMM D YYYY, h:mm:ss a`);
        this.createdBy = result.createdBy;
        this.modifiedBy = result.modifiedBy;
        this.borderResponses = result.borderResponses;
        this.createdDate = result.createdDate;
        this.createdTime = result.createdTime;
      });
  }
  fetchLoadingStateCities(shipments: any) {
    for(let s = 0; s < shipments.length; s++) {
      shipments.map((e: any) => {
      e.cityOfAcceptance.stateProvince = CountryStateCity.GetStateNameFromCode(e.cityOfAcceptance.stateProvince, e.cityOfAcceptance.country);
      e.cityOfLoading.stateProvince = CountryStateCity.GetStateNameFromCode(e.cityOfLoading.stateProvince, e.cityOfLoading.country);
      });
    }
  }
  setStatus(val) {
    let record = {
      date: this.createdDate,
      time: this.createdTime,
      eventID: this.manifestID,
      manifestType: 'ACI',
      status: val
    };
    this.apiService.postData('eManifests/setStatus', record).subscribe((result: any) => {
      this.toastr.success('Status Updated Successfully!');
      this.currentStatus = val;
      });
  }
  sendCBSAFn() {
    this.apiService
      .getData('eManifests/ACI/CBSAdetails/' + this.manifestID).subscribe((result: any) => {
        // this.sendBorderConnectOption = result;
        // if (this.sendBorderConnectOption === true) {
        //   const val = 'Queued';
        //   const setStatus: any = this.apiService.getData('ACIeManifest/setStatus/' + this.manifestID + '/' + val).subscribe((result: any) => {
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
      referenceOnlyShipment: fetchedShipmentData[0].referenceOnlyShipment,
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
    };
  }
  showDriverDetails(driverID: any) {
    const fetchedDriverData: any = this.drivers.filter((item: any) => item.driverID === driverID);
    this.driverData = {
      driverID: fetchedDriverData[0].driverID,
      driverNumber: fetchedDriverData[0].driverNumber,
      firstName: fetchedDriverData[0].firstName,
      gender: fetchedDriverData[0].gender,
      lastName: fetchedDriverData[0].lastName,
      dateOfBirth: fetchedDriverData[0].dateOfBirth,
      citizenshipCountry: CountryStateCity.GetSpecificCountryNameByCode(fetchedDriverData[0].citizenshipCountry),
      fastCardNumber: fetchedDriverData[0].fastCardNumber,
      travelDocuments: fetchedDriverData[0].travelDocuments
    };
    for(let d=0; d < fetchedDriverData[0].travelDocuments.length; d++) {
      fetchedDriverData[0].travelDocuments.map((e: any) => {
        e.stateProvince = CountryStateCity.GetStateNameFromCode(e.stateProvince, e.country);
        e.country = CountryStateCity.GetSpecificCountryNameByCode(e.country);
      });
    }
  }
  showMainDriverDetails() {
    this.driverData = {
      driverID: this.mainDriver.driverID,
      driverNumber: this.mainDriver.driverNumber,
      firstName: this.mainDriver.firstName,
      gender: this.mainDriver.gender,
      lastName: this.mainDriver.lastName,
      dateOfBirth: this.mainDriver.dateOfBirth,
      citizenshipCountry:  CountryStateCity.GetSpecificCountryNameByCode(this.mainDriver.citizenshipCountry),
      fastCardNumber: this.mainDriver.fastCardNumber,
      travelDocuments: this.mainDriver.travelDocuments
    };
    for(let d=0; d < this.mainDriver.travelDocuments.length; d++) {
      this.mainDriver.travelDocuments.map((e: any) => {
         e.stateProvince = CountryStateCity.GetStateNameFromCode(e.stateProvince, e.country);
         e.country = CountryStateCity.GetSpecificCountryNameByCode(e.country);
      });
    }
  }
  showPassengerDetails(passengerID: any) {
    const fetchedPassengerData: any = this.passengers.filter((item: any) => item.passengerID === passengerID);
    this.passengerData = {
      passengerID: fetchedPassengerData[0].passengerID,
      firstName: fetchedPassengerData[0].firstName,
      gender: fetchedPassengerData[0].gender,
      lastName: fetchedPassengerData[0].lastName,
      dateOfBirth: fetchedPassengerData[0].dateOfBirth,
      citizenshipCountry: CountryStateCity.GetSpecificCountryNameByCode(fetchedPassengerData[0].citizenshipCountry),
      fastCardNumber: fetchedPassengerData[0].fastCardNumber,
      travelDocuments: fetchedPassengerData[0].travelDocuments
    };
    for(let d=0; d < fetchedPassengerData[0].travelDocuments.length; d++) {
      fetchedPassengerData[0].travelDocuments.map((e: any) => {
        e.stateProvince = CountryStateCity.GetStateNameFromCode(e.stateProvince, e.country);
        e.country = CountryStateCity.GetSpecificCountryNameByCode(e.country);
      });
    }
  }
  amendManifest() {
    const amend = true;
    this.router.navigateByUrl('/dispatch/cross-border/ACI-edit-eManifest/' + this.manifestID + `?amendManifest=` + amend);
  }
  cancelManifest(manifestID) {
    this.apiService.getData(`eManifests/ACImanifest/cancelManifest/` + manifestID).subscribe();
  }
}
