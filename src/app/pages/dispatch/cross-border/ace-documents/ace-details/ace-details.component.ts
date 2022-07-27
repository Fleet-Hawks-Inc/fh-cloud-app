import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';

@Component({
  selector: 'app-ace-details',
  templateUrl: './ace-details.component.html',
  styleUrls: ['./ace-details.component.css']
})
export class AceDetailsComponent implements OnInit {
  public manifestID;
  usPortOfArrival: string;
  estimatedArrivalDateTime: string;
  tripNumber: string;
  currentStatus: string;
  countryCodeName: any = {};
  assetTypeCode: any = {};
  stateCodeToName: any = {};
  truck: any = {
    number: '',
    type: '',
    vinNumber: '',
    dotNumber: '',
    insurancePolicy: {
      insuranceCompanyName: '',
      policyNumber: '',
      issuedDate: '',
      policyAmount: '',
    },
    licensePlates: [
      {
        number: '',
        stateProvince: '',
        country: ''
      }
    ],
    sealNumbers: [],
    IIT: ''
  };

  mainDriver: any = {};
  drivers = [];
  createdDate: '';
  createdTime: '';
  trailers = [];
  shipments = [];
  passengers = [];
  result: any;
  timeModified: any;
  modifiedBy: any;
  createdBy: any;
  borderResponses = [];
  shipmentData = {
    shipmentControlNumber: '',
    type: '',
    shipperName: '',
    consigneeName: '',
    broker: { filerCode: '', portLocation: '' },
    provinceOfLoading: '',
    goodsAstrayDateOfExit: '',
    commodities: [
      {
        loadedOn: {
          type: '',
          number: '',
        },
        description: '',
        quantity: '',
        packagingUnit: '',
        weight: '',
        weightUnit: '',
        marksAndNumbers: [
          { markNumber: '' },
          { markNumber: '' },
          { markNumber: '' },
          { markNumber: '' },
        ],
        c4LineReleaseNumber: '',
        harmonizedCode: '',
        value: '',
        countryOfOrigin: '',
        hazmatDetails: {
          unCode: '',
          emergencyContactName: '',
          contactPhone: '',
          contactEmail: '',
        }
      }
    ],
    thirdParties: [],
    inBondDetails: {

      type: '',
      paperInBondNumber: '',
      usDestination: '',
      foreignDestination: '',
      onwardCarrierScac: '',
      irsNumber: '',
      estimatedDepartureDate: '',
      fda: false,

    }
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
    usAddress: {
      addressLine: '',
      state: '',
      city: '',
      zipCode: ''
    }
  };
  passengerData = {
    passengerID: '',
    firstName: '',
    gender: '',
    lastName: '',
    dateOfBirth: '',
    citizenshipCountry: '',
    fastCardNumber: '',
    travelDocuments: [],
  };
  documentTypeList: any = [];
  documentsTypesObects: any = {};
  packagingUnitsObects: any = {};
  packagingList: any = {};
  thirdPartyTypesList: any = {};
  thirdPartyTypesObects: any = {};
  vehicleTypeObjects: any = {};
  shipmentTypeObjects: any = {};
  inBondTypeObects: any = {};
  foreignDestinationListObjects: any = {};
  USportsListObjects: any = {};
  brokerCodeObject: any = {};
  sendBorderConnectOption = false;

  items = [

    {
      label: 'Send', icon: 'pi pi-send', command: () => {
        this.sendCBPFn();
      }
    },
    {
      label: 'Amend', icon: 'pi pi-user-edit', command: () => {
        this.amendManifest();
      }
    },
    {
      label: 'Cancel', icon: 'pi pi-exclamation-circle', command: () => {
        this.cancelManifest(this.manifestID);
      },
    }
  ];
  errorsDisplay = false;
  errors = [];
  constructor(private apiService: ApiService, private route: ActivatedRoute, private spinner: NgxSpinnerService,
    private httpClient: HttpClient, private toastr: ToastrService, private router: Router,
    private countryStateCity: CountryStateCityService) { }

  ngOnInit() {
    this.manifestID = this.route.snapshot.params[`mID`];
    this.fetchACEEntry();
    this.fetchAssetsCodeName();
    this.fetchDocuments();
    this.fetchPackagingUnits();
    this.fetchThirdPartyTypes();
    this.fetchVehicleType();
    this.fetchShipmentType();
    this.fetchInBondType();
    this.fetchforeignDestinationList();
    this.fetchUSportsList();
    this.fetchBrokerList();
  }
  fetchforeignDestinationList() {
    this.httpClient.get('assets/jsonFiles/ACEforeignPorts.json').subscribe((data: any) => {
      this.foreignDestinationListObjects = data.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`portOfEntry`], a;
      }, {});
    });
  }

  fetchUSportsList() {
    this.httpClient.get('assets/USports.json').subscribe((data: any) => {
      this.USportsListObjects = data.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`portOfEntry`], a;
      }, {});
    });
  }


  fetchAssetsCodeName() {
    this.httpClient.get('assets/jsonFiles/trailers.json').subscribe((data: any) => {
      this.assetTypeCode = data.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
      }, {});
    });
  }
  fetchDocuments() {
    this.httpClient.get('assets/travelDocumentType.json').subscribe(data => {
      this.documentTypeList = data;

      this.documentsTypesObects = this.documentTypeList.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
      }, {});
    });
  }
  fetchThirdPartyTypes() {
    this.httpClient.get('assets/jsonFiles/ACEthirdPartyTypes.json').subscribe(data => {
      this.thirdPartyTypesList = data;

      this.thirdPartyTypesObects = this.thirdPartyTypesList.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
      }, {});
    });
  }
  fetchPackagingUnits() {
    this.httpClient.get('assets/packagingUnit.json').subscribe(data => {
      this.packagingList = data;
      this.packagingUnitsObects = this.packagingList.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`name`], a;
      }, {});
    });
  }
  fetchBrokerList() {
    this.httpClient.get('assets/ACEBrokersList.json').subscribe((data: any) => {
      this.brokerCodeObject = data.reduce((a: any, b: any) => {
        return a[b[`filerCode`]] = b[`brokerName`], a;
      }, {});
    });
  }
  fetchVehicleType() {
    this.httpClient.get('assets/vehicleType.json').subscribe((data: any) => {
      this.vehicleTypeObjects = data.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`name`], a;
      }, {});
    });
  }

  fetchInBondType() {
    this.httpClient.get('assets/jsonFiles/ACEinbond-types.json').subscribe((data: any) => {
      this.inBondTypeObects = data.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`longDescription`], a;
      }, {});
    });
  }
  fetchShipmentType() {
    this.httpClient.get('assets/ACEShipmentType.json').subscribe((data: any) => {
      this.shipmentTypeObjects = data.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
      }, {});
    });
  }
  fetchACEEntry() {
    this.apiService
      .getData('eManifests/ace-detail/' + this.manifestID)
      .subscribe(async (result: any) => {

        this.estimatedArrivalDateTime = result.estimatedArrivalDateTime;
        this.usPortOfArrival = result.usPortOfArrival;
        this.tripNumber = result.tripNumber;
        this.currentStatus = result.status;
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
          licensePlates: [
            {
              number: result.truck.licensePlates[0].number,
              stateProvince: await this.countryStateCity.GetStateNameFromCode(result.truck.licensePlates[0].stateProvince, result.truck.licensePlates[0].country),
              country: await this.countryStateCity.GetSpecificCountryNameByCode(result.truck.licensePlates[0].country)
            }
          ],
          sealNumbers: result.truck.sealNumbers,
          IIT: result.truck.IIT
        };
        this.trailers = result.trailers;
        this.getTrailerLicState(result.trailers);
        this.mainDriver = result.mainDriver;
        this.drivers = result.drivers;
        this.passengers = result.passengers;
        this.shipments = result.shipments;
        // this.timeModified = moment(result.timeModified).format(`MMMM D YYYY, h:mm:ss a`);
        this.modifiedBy = result.modifiedBy;
        this.borderResponses = result.borderResponses;
        this.createdBy = result.createdBy;
        // this.createdDate = result.createdDate;
        // this.createdTime = result.createdTime;
      });
  }
  async setStatus(val) {
    let record = {
      date: this.createdDate,
      time: this.createdTime,
      eventID: this.manifestID,
      manifestType: 'ACE',
      status: val
    };
    let result = await this.apiService.postData('eManifests/setStatus', record).toPromise();
    if (result) {
      this.toastr.success('Status Updated Successfully!');
      this.currentStatus = val;
    }

  }
  getTrailerLicState(trailers: any) {
    if (trailers !== undefined || trailers !== '') {
      for (let t = 0; t < trailers.length; t++) {
        trailers.map(async (e: any) => {
          let countryCode = e.licensePlates[0].country;
          e.licensePlates[0].stateProvince = await this.countryStateCity.GetStateNameFromCode(e.licensePlates[0].stateProvince, countryCode);
          e.licensePlates[0].country = await this.countryStateCity.GetSpecificCountryNameByCode(countryCode);
        });
      }
    }

  }
  sendCBPFn() {
    this.apiService
      .getData('eManifests/ACE/CBPdetails/' + this.manifestID).toPromise().then(result => {

      }).catch(err => {
        this.errorsDisplay = true;
        this.errors = err.error;
        console.log('erro', this.errors)
      })
    // this.sendBorderConnectOption = result;
    // if (this.sendBorderConnectOption === true) {
    //   const val = 'Queued';
    //   const setStatus: any = this.apiService.getData('ACEeManifest/setStatus/' + this.manifestID + '/' + val).subscribe((result: any) => {
    //     this.toastr.success('Status Updated Successfully!');
    //      this.currentStatus = val;
    //   });
    // }

  }
  async showShipmentDetails(shipmentID) {
    const shipmentDataFetched = this.shipments.filter((item: any) => item.shipmentID === shipmentID);
    this.shipmentData = {
      shipmentControlNumber: shipmentDataFetched[0].shipmentControlNumber,
      type: shipmentDataFetched[0].type,
      provinceOfLoading: await this.countryStateCity.GetStateNameFromCode(shipmentDataFetched[0].provinceOfLoading, 'CA'),
      goodsAstrayDateOfExit: shipmentDataFetched[0].goodsAstrayDateOfExit,
      shipperName: shipmentDataFetched[0].shipper.name,
      consigneeName: shipmentDataFetched[0].consignee.name,
      broker: shipmentDataFetched[0].broker,
      commodities: shipmentDataFetched[0].commodities,
      thirdParties: shipmentDataFetched[0].thirdParties,
      inBondDetails: shipmentDataFetched[0].inBondDetails
    };
    for (let c = 0; c < this.shipmentData.commodities.length; c++) {
      if (shipmentDataFetched[0].commodities[c].hazmatDetails === undefined) {
        this.shipmentData.commodities[c][`hazmatDetails`] = {
          unCode: '',
          emergencyContactName: '',
          contactPhone: '',
          contactEmail: ''
        };
      }
    }
    if (shipmentDataFetched[0][`inBondDetails`] === undefined) {
      this.shipmentData.inBondDetails = {
        type: '',
        paperInBondNumber: '',
        usDestination: '',
        foreignDestination: '',
        onwardCarrierScac: '',
        irsNumber: '',
        estimatedDepartureDate: '',
        fda: false,
      };
    }
  }
  async showMainDriverDetails() {
    const countryCode = 'US';
    const stateCode = this.mainDriver.usAddress.state;
    this.driverData = {
      driverID: this.mainDriver.driverID,
      driverNumber: this.mainDriver.driverNumber,
      firstName: this.mainDriver.firstName,
      gender: this.mainDriver.gender,
      lastName: this.mainDriver.lastName,
      dateOfBirth: this.mainDriver.dateOfBirth,
      citizenshipCountry: await this.countryStateCity.GetSpecificCountryNameByCode(this.mainDriver.citizenshipCountry),
      fastCardNumber: this.mainDriver.fastCardNumber,
      travelDocuments: this.mainDriver.travelDocuments,
      usAddress: {
        addressLine: this.mainDriver.usAddress.addressLine,
        state: await this.countryStateCity.GetStateNameFromCode(stateCode, countryCode),
        city: this.mainDriver.usAddress.city,
        zipCode: this.mainDriver.usAddress.zipCode
      }
    };
    for (let d = 0; d < this.mainDriver.travelDocuments.length; d++) {
      this.mainDriver.travelDocuments.map(async (e: any) => {
        e.stateProvince = await this.countryStateCity.GetStateNameFromCode(e.stateProvince, e.country);
        e.country = await this.countryStateCity.GetSpecificCountryNameByCode(e.country);
      });
    }

  }
  async showDriverDetails(driverID) {
    const driverDataFetched: any = this.drivers.filter((item: any) => item.driverID === driverID);
    this.driverData = {
      driverID: driverDataFetched[0].driverID,
      driverNumber: driverDataFetched[0].driverNumber,
      firstName: driverDataFetched[0].firstName,
      gender: driverDataFetched[0].gender,
      lastName: driverDataFetched[0].lastName,
      dateOfBirth: driverDataFetched[0].dateOfBirth,
      citizenshipCountry: await this.countryStateCity.GetSpecificCountryNameByCode(driverDataFetched[0].citizenshipCountry),
      fastCardNumber: driverDataFetched[0].fastCardNumber,
      travelDocuments: driverDataFetched[0].travelDocuments,
      usAddress: {
        addressLine: this.mainDriver.usAddress.addressLine,
        state: await this.countryStateCity.GetStateNameFromCode(driverDataFetched[0].usAddress.state, 'US'),
        city: this.mainDriver.usAddress.city,
        zipCode: this.mainDriver.usAddress.zipCode
      }
    };
    for (let d = 0; d < driverDataFetched[0].travelDocuments.length; d++) {
      driverDataFetched[0].travelDocuments.map(async (e: any) => {
        e.stateProvince = await this.countryStateCity.GetStateNameFromCode(e.stateProvince, e.country);
        e.country = await this.countryStateCity.GetSpecificCountryNameByCode(e.country);
      });
    }

  }
  async showPassengerDetails(passengerID) {
    const passengerDataFetched: any = this.passengers.filter((item: any) => item.passengerID === passengerID);
    this.passengerData = {
      passengerID: passengerDataFetched[0].passengerID,
      firstName: passengerDataFetched[0].firstName,
      gender: passengerDataFetched[0].gender,
      lastName: passengerDataFetched[0].lastName,
      dateOfBirth: passengerDataFetched[0].dateOfBirth,
      citizenshipCountry: await this.countryStateCity.GetSpecificCountryNameByCode(passengerDataFetched[0].citizenshipCountry),
      fastCardNumber: passengerDataFetched[0].fastCardNumber,
      travelDocuments: passengerDataFetched[0].travelDocuments
    };
    for (let d = 0; d < passengerDataFetched[0].travelDocuments.length; d++) {
      passengerDataFetched[0].travelDocuments.map(async (e: any) => {
        e.stateProvince = await this.countryStateCity.GetStateNameFromCode(e.stateProvince, e.country);
        e.country = await this.countryStateCity.GetSpecificCountryNameByCode(e.country);
      });
    }
  }
  // getPassengerDocData(travelDocuments: any){

  // }
  cancelManifest(manifestID) {
    this.apiService.getData(`eManifests/ace/cancel-request/` + manifestID).subscribe();
  }

  amendManifest() {
    const amend = true;
    this.router.navigateByUrl('/dispatch/cross-border/ace-manifest/' + this.manifestID + `?amendManifest=` + amend);
  }
}
