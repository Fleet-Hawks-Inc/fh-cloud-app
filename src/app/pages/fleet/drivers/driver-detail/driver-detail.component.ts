import { Component, OnInit } from '@angular/core';
import { HereMapService } from '../../../../services';
import {ApiService} from '../../../../services';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer} from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.css']
})
export class DriverDetailComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  environment = environment.isFeatureEnabled;
  platform: any;
  profile: string;
  driverName: string;
  CDL: string;
  phone: string;
  email: string;
  homeTerminal: string;
  cycle: string;
  private driverID: string;
  private driverData: any;

  carrierID: any;

  driverType: any;
  employeeId: any;
  contractorId: any;
  companyId: any;
  ownerOperator: string;
  companyName: string;
  driverStatus: any;
  userName: any;
  startDate: string;
  terminationDate: string;
  contractStart: string;
  contractEnd: string;
  gender: any;
  aceID: any;
  aciID: any;
  fastID: any;
  fastExpiry: any;
  citizenship: any;
  csa: any;
  group: any;
  assignedVehicle: any;
  address: any;
  documents: any;

  liceIssueSate: any;
  liceIssueCountry: any;
  liceWCB: any;
  liceHealthCare: any;
  liceVehicleType: any;
  licenceExpiry: any;
  liceMedicalCardRenewal: any;
  liceContractStart: any;
  liceContractEnd: any;
  DOB: any;

  paymentType: any;
  loadedMiles: any;
  emptyMiles: any;
  loadedMilesUnit: string;
  loadedMilesTeam: string;
  loadedMilesTeamUnit: string;
  emptyMilesUnit: string;
  emptyMilesTeam: string;
  emptyMilesTeamUnit: string;
  calculateMiles: any;

  rate: string;
  waitingPay: string;
  waitingHourAfter: string;

  deliveryRate: string;

  SIN: any;
  loadPayPercentage: any;
  loadPayPercentageOf: any;
  payPeriod: any;
  federalTax: any;
  localTax: any;

  emerName: any;
  emergencyAddress: any;
  emerPhone: any;
  emerEmail: any;
  emerRelationship: any;

  hosStatus: any;
  hosRemarks: any;
  hosPcAllowed: boolean;
  hosYmAllowed: boolean;
  hosType: any;
  hosCycle: any;
  timezone: any;
  optzone: any;
  cycleObjects: any = {};
  yardsObjects: any = {};
  statesObject: any = {};
  countriesObject: any = {};
  citiesObject: any = {};
  groupsObjects: any = {};
  ownerOperatorsObjects: any = {};
  vehicleList: any = {};
  docs = [];
  assetsDocs = [];
  absDocs = [];
  documentTypeList: any = [];
  documentsTypesObects: any = {};

  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');
  constructor(
        private hereMap: HereMapService,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private domSanitizer: DomSanitizer,
        private httpClient: HttpClient,
      )
  {
    // this.getCarrierID();
  }

  ngOnInit() {
    // this.hereMap.mapSetAPI();
    // this.hereMap.mapInit();
    this.driverID = this.route.snapshot.params[`driverID`]; // get asset Id from URL
    this.fetchDriver();
    this.fetchCyclesbyIDs();
    this.fetchGroupsbyIDs();
    this.fetchAllOwnOperatorsIDs();
    this.fetchDocuments();
    this.fetchDriverTrips();
    this. fetchVehicleList();
    this.fetchDriverTrips();
  }
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
  fetchHomeTerminal(homeTerminal){
      if (homeTerminal && homeTerminal.length > 0) {
          if (homeTerminal[0].manual) {
            let combineAddress: any;
            if (homeTerminal[0].address != '') {
              combineAddress = `${homeTerminal[0].address}`;
            }
            if (homeTerminal[0].cityName != '') {
              combineAddress += `,` + `${homeTerminal[0].cityName}`;
            }
            if (homeTerminal[0].stateCode != '') {
              combineAddress += `,` + CountryStateCity.GetStateNameFromCode(homeTerminal[0].stateCode,homeTerminal[0].countryCode);
            }
            if (homeTerminal[0].countryCode != '') {
              combineAddress += `,` + CountryStateCity.GetSpecificCountryNameByCode(homeTerminal[0].countryCode);
            }
            if (homeTerminal[0].zipCode != '') {
              combineAddress += ` - ${homeTerminal[0].zipCode}`;
            }
            this.homeTerminal = combineAddress;
          }
          else {
            this.homeTerminal = homeTerminal[0].userLocation;
          }
        }
  }
   /**
   * fetch Asset data
   */
  fetchDriver() {
    this.spinner.show(); // loader init
    this.apiService
      .getData(`drivers/${this.driverID}`)
      .subscribe(async (result: any) => {
        if (result) {
          this.driverData = await result[`Items`][0];
          this.fetchHomeTerminal(this.driverData.hosDetails.homeTerminal);
          if (this.driverData.address !== undefined || this.driverData.address !== '') {
            this.fetchCompleteAdd(this.driverData.address);
          }
          this.cycle = this.driverData.hosDetails.hosCycle;
          this.email = this.driverData.email;
          this.phone = this.driverData.phone;
          this.DOB = this.driverData.DOB;
          this.CDL = this.driverData.CDL_Number;
          this.driverName = `${this.driverData.firstName} ${this.driverData.lastName}`;
          this.startDate = this.driverData.startDate;
          this.terminationDate = this.driverData.terminationDate;
          this.contractStart = this.driverData.contractStart;
          this.contractEnd = this.driverData.contractEnd;
          if (this.driverData.driverImage !== '' && this.driverData.driverImage !== undefined) {
            this.profile = `${this.Asseturl}/${this.driverData.carrierID}/${this.driverData.driverImage}`;
          } else {
            this.profile = 'assets/img/driver/driver.png';
          }
          if (this.driverData.abstractDocs !== undefined && this.driverData.abstractDocs.length > 0) {
            this.absDocs = this.driverData.abstractDocs.map(x => ({path: `${this.Asseturl}/${this.driverData.carrierID}/${x}`, name: x}));
          }
          this.driverType = this.driverData.driverType;
          this.employeeId = this.driverData.employeeContractorId;
          this.ownerOperator = this.driverData.ownerOperator;
          this.companyId = this.driverData.companyId;
          this.companyName = this.driverData.companyName;
          this.driverStatus = this.driverData.driverStatus;
          this.userName = this.driverData.userName;
          this.gender = this.driverData.gender;
          this.aceID = this.driverData.crossBorderDetails.ACE_ID;
          this.aciID = this.driverData.crossBorderDetails.ACI_ID;
          this.fastID = this.driverData.crossBorderDetails.fast_ID;
          this.fastExpiry = this.driverData.crossBorderDetails.fastExpiry;
          this.citizenship = CountryStateCity.GetSpecificCountryNameByCode(this.driverData.citizenship);
          this.csa = this.driverData.crossBorderDetails.csa;
          this.group = this.driverData.groupID;
          this.assignedVehicle = this.driverData.assignedVehicle;
          this.address = this.driverData.address;
          let newDocuments = [];
          for (let i = 0; i < this.driverData.documentDetails.length; i++) {
            let docmnt = []
            if(this.driverData.documentDetails[i].uploadedDocs != undefined && this.driverData.documentDetails[i].uploadedDocs.length > 0){
              docmnt = this.driverData.documentDetails[i].uploadedDocs;
            }
            newDocuments.push({
              documentType: this.driverData.documentDetails[i].documentType,
              document: this.driverData.documentDetails[i].document,
              issuingAuthority: this.driverData.documentDetails[i].issuingAuthority,
              issuingCountry: CountryStateCity.GetSpecificCountryNameByCode(this.driverData.documentDetails[i].issuingCountry),
              issuingState: CountryStateCity.GetStateNameFromCode(this.driverData.documentDetails[i].issuingState, this.driverData.documentDetails[i].issuingCountry),
              issueDate: this.driverData.documentDetails[i].issueDate,
              expiryDate: this.driverData.documentDetails[i].expiryDate,
              uploadedDocs: docmnt
            });
            if (this.driverData.documentDetails[i].uploadedDocs != undefined && this.driverData.documentDetails[i].uploadedDocs.length > 0) {
              this.assetsDocs[i] = this.driverData.documentDetails[i].uploadedDocs.map(x => ({path: `${this.Asseturl}/${this.driverData.carrierID}/${x}`, name: x}));
            }
          }
          this.documents = newDocuments;
          this.liceIssueSate = CountryStateCity.GetStateNameFromCode(this.driverData.licenceDetails.issuedState, this.driverData.licenceDetails.issuedCountry),
          this.liceIssueCountry = CountryStateCity.GetSpecificCountryNameByCode(this.driverData.licenceDetails.issuedCountry);
          this.licenceExpiry = this.driverData.licenceDetails.licenceExpiry;
          this.liceMedicalCardRenewal = this.driverData.licenceDetails.medicalCardRenewal;
          this.liceWCB = this.driverData.licenceDetails.WCB;
          this.liceHealthCare = this.driverData.licenceDetails.healthCare;
          this.liceVehicleType = this.driverData.licenceDetails.vehicleType;
          this.liceContractStart = this.driverData.licenceDetails.contractStart;
          this.liceContractEnd = this.driverData.licenceDetails.contractEnd;
          this.paymentType = this.driverData.paymentDetails.paymentType;
          this.loadedMiles = this.driverData.paymentDetails.loadedMiles;
          this.loadedMilesUnit = this.driverData.paymentDetails.loadedMilesUnit;
          this.loadedMilesTeam = this.driverData.paymentDetails.loadedMilesTeam;
          this.loadedMilesTeamUnit = this.driverData.paymentDetails.loadedMilesTeamUnit;

          this.emptyMiles = this.driverData.paymentDetails.emptyMiles;
          this.emptyMilesUnit = this.driverData.paymentDetails.emptyMilesUnit;
          this.emptyMilesTeam = this.driverData.paymentDetails.emptyMilesTeam;
          this.emptyMilesTeamUnit = this.driverData.paymentDetails.emptyMilesTeamUnit;

          this.rate = this.driverData.paymentDetails.rate + this.driverData.paymentDetails.rateUnit;
          this.waitingPay = this.driverData.paymentDetails.waitingPay + this.driverData.paymentDetails.waitingPayUnit;
          this.waitingHourAfter = this.driverData.paymentDetails.waitingHourAfter;
          this.deliveryRate = this.driverData.paymentDetails.deliveryRate + this.driverData.paymentDetails.deliveryRateUnit;
          this.SIN = this.driverData.SIN;
          this.loadPayPercentage = this.driverData.paymentDetails.loadPayPercentage;
          this.loadPayPercentageOf = this.driverData.paymentDetails.loadPayPercentageOf;
          this.payPeriod = this.driverData.paymentDetails.payPeriod;
        //  this.homeTerminal = this.driverData.hosDetails.homeTerminal;
          this.hosStatus = this.driverData.hosDetails.hosStatus;
          this.hosRemarks = this.driverData.hosDetails.hosRemarks;
          this.hosPcAllowed = this.driverData.hosDetails.pcAllowed;
          this.hosYmAllowed = this.driverData.hosDetails.ymAllowed;
          this.hosType = this.driverData.hosDetails.type;
          this.hosCycle = this.driverData.hosDetails.hosCycle;
          this.timezone = this.driverData.hosDetails.timezone;
          this.optzone = this.driverData.hosDetails.optZone;
          this.emerName = this.driverData.emergencyDetails.name;
          this.emergencyAddress = this.driverData.emergencyDetails.emergencyAddress;
          this.emerPhone = this.driverData.emergencyDetails.phone;
          this.emerEmail = this.driverData.emergencyDetails.email;
          this.emerRelationship = this.driverData.emergencyDetails.relationship;
          this.spinner.hide();

        }
      }, (err) => {

      });
  }

  fetchCompleteAdd(address: any) {
    if(address != ''){
      for(let a=0; a<address.length; a++){
        address.map((e: any) => {
            if(e.manual){
              e.countryName = CountryStateCity.GetSpecificCountryNameByCode(e.countryCode);
              e.stateName = CountryStateCity.GetStateNameFromCode(e.stateCode, e.countryCode);
            }
         });
       }
    }

  }
  fetchDocuments() {
    this.httpClient.get('assets/travelDocumentType.json').subscribe(data =>{
      this.documentTypeList = data;

      this.documentsTypesObects = this.documentTypeList.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
      }, {});

    })
  }


  fetchCyclesbyIDs() {
    this.apiService.getData('cycles/get/list')
      .subscribe((result: any) => {
        this.cycleObjects = result;
      });
  }

  fetchGroupsbyIDs() {
    this.apiService.getData('groups/get/list')
      .subscribe((result: any) => {
        this.groupsObjects = result;
      });
  }

  fetchAllOwnOperatorsIDs() {
    this.apiService.getData('ownerOperators/get/list')
      .subscribe((result: any) => {
        this.ownerOperatorsObjects = result;
      });
  }


  async getCarrierID(){
    this.carrierID = await this.apiService.getCarrierID();
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length-1];
    this.pdfSrc = '';
    if(ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  // delete uploaded images and documents
  delete(type: string, name: string, index: string){
    this.apiService.deleteData(`drivers/uploadDelete/${this.driverID}/${type}/${name}/${index}`).subscribe((result: any) => {
      this.fetchDriver();
    });
  }
  fetchDriverTrips() {
    this.apiService.getData(`trips/get/driver/active/${this.driverID}`).subscribe((result: any) => {
      
    });
  }
}
