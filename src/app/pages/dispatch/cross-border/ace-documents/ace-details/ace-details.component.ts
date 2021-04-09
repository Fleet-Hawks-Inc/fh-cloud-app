import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-ace-details',
  templateUrl: './ace-details.component.html',
  styleUrls: ['./ace-details.component.css']
})
export class AceDetailsComponent implements OnInit {
  public entryID;
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
        stateProvince: ''
      }
    ],
    sealNumbers: []
  };
  drivers = [];
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
    provinceOfLoading: '',
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
        fda: '',

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
    fastCardNumber:'',
    travelDocuments: [],
  };
  documentTypeList: any = [];
  documentsTypesObects: any = {};
  packagingUnitsObects: any  = {};
  packagingList: any = {};
  thirdPartyTypesList: any  = {};
  thirdPartyTypesObects: any  = {};
  vehicleTypeObects: any = {};
  shipmentTypeObects: any = {};
  inBondTypeObects: any = {};
  sendBorderConnectOption = false;
  constructor(private apiService: ApiService, private route: ActivatedRoute,private spinner: NgxSpinnerService,
              private httpClient: HttpClient, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.entryID = this.route.snapshot.params[`entryID`];
    this.fetchACEEntry();
    this.fetchCountriesCodeName();
    this.fetchAssetsCodeName();
    this.fetchStatesCodeName();
    this.fetchDocuments();
    this.fetchPackagingUnits();
    this.fetchThirdPartyTypes();
    this.fetchVehicleType();
    this.fetchShipmentType();
    this.fetchInBondType();
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
  fetchDocuments() {
    this.httpClient.get('assets/travelDocumentType.json').subscribe(data =>{
      this.documentTypeList = data;

      this.documentsTypesObects = this.documentTypeList.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
      }, {});
    });
  }
  fetchThirdPartyTypes() {
    this.httpClient.get('assets/jsonFiles/ACEthirdPartyTypes.json').subscribe(data =>{
      this.thirdPartyTypesList = data;

      this.thirdPartyTypesObects = this.thirdPartyTypesList.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
      }, {});
    });
  }
  fetchPackagingUnits() {
    this.httpClient.get('assets/packagingUnit.json').subscribe(data =>{
      this.packagingList = data;

      this.packagingUnitsObects = this.packagingList.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`name`], a;
      }, {});
    });
  }
  fetchStatesCodeName() {
    this.apiService.getData('states/get/state/codeToName').subscribe((result: any) => {
    this.stateCodeToName = result;
    });
  }
  fetchVehicleType() {
    this.httpClient.get('assets/vehicleType.json').subscribe((data: any) => {
      this.vehicleTypeObects =  data.reduce( (a: any, b: any) => {
        return a[b[`code`]] = b[`name`], a;
    }, {});
    });
  }

  fetchInBondType() {
    this.httpClient.get('assets/jsonFiles/ACEinbond-types.json').subscribe((data: any) => {
      this.inBondTypeObects =  data.reduce( (a: any, b: any) => {
        return a[b[`code`]] = b[`longDescription`], a;
    }, {});
    });
  }
  fetchShipmentType() {
    this.httpClient.get('assets/ACEShipmentType.json').subscribe((data: any) => {
      this.shipmentTypeObects =  data.reduce( (a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
    }, {});
    });
  }
  fetchACEEntry() {
    this.spinner.show(); // loader init
    this.apiService
      .getData('ACEeManifest/details/' + this.entryID)
      .subscribe((result: any) => {
        this.estimatedArrivalDateTime = result.estimatedArrivalDateTime;
        this.usPortOfArrival = result.usPortOfArrival;
        this.tripNumber = result.tripNumber;
        this.currentStatus = result.currentStatus;
        this.truck = result.truck;
        this.trailers = result.trailers;
        this.drivers = result.drivers;
        this.passengers = result.passengers;
        this.shipments = result.shipments;
        this.timeModified = moment(result.timeModified).format(`MMMM D YYYY, h:mm:ss a`);
        this.modifiedBy = result.modifiedBy;
        this.borderResponses = result.borderResponses;
        this.createdBy = result.createdBy;
        this.spinner.hide(); // loader hide
        console.log('this.driver', result.drivers);
      });
  }
  setStatus(entryID, val) {
    this.apiService.getData('ACEeManifest/setStatus/' + entryID + '/' + val).subscribe((result: any) => {
      this.toastr.success('Status Updated Successfully!');
      this.currentStatus = val;
    });
  }
  sendCBPFn() {
    this.apiService
      .getData('ACEeManifest/CBPdetails/' + this.entryID)
      .subscribe((result: any) => {
        // this.sendBorderConnectOption = result;
        // if (this.sendBorderConnectOption === true) {
        //   const val = 'Queued';
        //   const setStatus: any = this.apiService.getData('ACEeManifest/setStatus/' + this.entryID + '/' + val).subscribe((result: any) => {
        //     this.toastr.success('Status Updated Successfully!');
        //      this.currentStatus = val;
        //   });
        // }
      });
  }
  showShipmentDetails(shipmentID) {
    const shipmentDataFetched = this.shipments.filter((item: any) => item.shipmentID === shipmentID);
    this.shipmentData = {
      shipmentControlNumber: shipmentDataFetched[0].shipmentControlNumber,
      type: shipmentDataFetched[0].type,
      provinceOfLoading: shipmentDataFetched[0].provinceOfLoading,
      shipperName: shipmentDataFetched[0].shipper.name,
      consigneeName: shipmentDataFetched[0].consignee.name,
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
        fda: '',
      };
    }
  }
  showDriverDetails(driverID) {
    const driverDataFetched: any = this.drivers.filter((item: any) => item.driverID === driverID);
    this.driverData = {
      driverID: driverDataFetched[0].driverID,
      driverNumber: driverDataFetched[0].driverNumber,
      firstName: driverDataFetched[0].firstName,
      gender: driverDataFetched[0].gender,
      lastName: driverDataFetched[0].lastName,
      dateOfBirth: driverDataFetched[0].dateOfBirth,
      citizenshipCountry: driverDataFetched[0].citizenshipCountry,
      fastCardNumber: driverDataFetched[0].fastCardNumber,
      travelDocuments: driverDataFetched[0].travelDocuments,
      usAddress: driverDataFetched[0].usAddress
    };

  }
  showPassengerDetails(passengerID) {
    const passengerDataFetched: any = this.passengers.filter((item: any) => item.passengerID === passengerID);
    this.passengerData = {
      passengerID: passengerDataFetched[0].passengerID,
      firstName: passengerDataFetched[0].firstName,
      gender: passengerDataFetched[0].gender,
      lastName: passengerDataFetched[0].lastName,
      dateOfBirth: passengerDataFetched[0].dateOfBirth,
      citizenshipCountry: passengerDataFetched[0].citizenshipCountry,
      fastCardNumber: passengerDataFetched[0].fastCardNumber,
      travelDocuments: passengerDataFetched[0].travelDocuments
    };
  }

  cancelManifest(entryID){
    this.apiService.getData(`ACEeManifest/cancelManifest/` + entryID).subscribe();
  }

 amendManifest() {
   const amend = true;
 this.router.navigateByUrl('/dispatch/cross-border/ACE-edit-eManifest/' + this.entryID + `?amendManifest=` + amend);
 }
}
