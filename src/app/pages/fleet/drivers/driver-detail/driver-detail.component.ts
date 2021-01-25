import { Component, OnInit } from '@angular/core';
import { HereMapService } from '../../../../services';
import {ApiService} from '../../../../services';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {AwsUploadService} from '../../../../services';
import { DomSanitizer} from '@angular/platform-browser';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.css']
})
export class DriverDetailComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  
  profile: string;
  driverName: string;
  CDL: string;
  workPhone: string;
  workEmail: string;
  homeTerminal: string;
  cycle: string;
  private driverID: string;
  private driverData: any;

  carrierID: any;
  
  driverType: any;
  employeeId: any;
  companyId: any;
  driverStatus: any;
  userName: any;
  gender: any;
  aceID: any;
  aciID: any;
  fastID: any;
  fastExpiry: any;
  citizenship: any;
  csa: any;
  group: any;

  address: any;
  documents: any;

  liceIssueSate: any;
  liceIssueCountry: any;
  liceWCB: any;
  liceHealthCare: any;
  liceVehicleType: any
  licenceExpiry: any;
  liceMedicalCardRenewal: any;
  liceContractStart: any;
  liceContractEnd: any;
  liceDOB: any;

  paymentType: any;
  loadedMiles: any;
  emptyMiles: any;
  calculateMiles: any;
  sinNumber: any;
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
  hosPcAllowed: any;
  hosYmAllowed: any;
  hosType: any;
  hosCycle: any;
  
  cycleObjects: any = {};
  yardsObjects: any = {};
  statesObject: any = {};
  countriesObject: any = {};
  citiesObject: any = {};
  groupsObjects: any = {};

  docs = [];

  constructor(
        private hereMap: HereMapService,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private domSanitizer: DomSanitizer,
        private awsUS: AwsUploadService
      )
  {
    this.getCarrierID();
  }

  ngOnInit() {
   
    this.hereMap.mapInit();
    this.driverID = this.route.snapshot.params['driverID']; // get asset Id from URL
    this.fetchDriver();
    this.fetchCyclesbyIDs();
    this.fetchYardsByIDs();
    this.fetchAllCountriesIDs();
    this.fetchAllStatesIDs();
    this.fetchAllCitiesIDs();
    this.fetchGroupsbyIDs();
  }

   /**
   * fetch Asset data
   */
  fetchDriver() {
    // this.spinner.show(); // loader init
    this.apiService
      .getData(`drivers/${this.driverID}`)
      .subscribe(async (result: any) => {
        if (result) {
          this.driverData = await result['Items'][0];
          this.cycle = this.driverData.hosDetails.hosCycle;
          this.homeTerminal = this.driverData.hosDetails.homeTerminal;
          this.workEmail = this.driverData.workEmail;
          this.workPhone = this.driverData.workPhone;
          this.CDL = this.driverData.licenceDetails.CDL_Number;
          this.driverName = `${this.driverData.firstName} ${this.driverData.lastName}`;
          if(this.driverData.driverImage != '') {
            this.profile = `${this.Asseturl}/${this.driverData.carrierID}/${this.driverData.driverImage}`;
          } else {
            this.profile = 'assets/img/driver/driver.png';
          }
          
          this.driverType = this.driverData.driverType;
          this.employeeId = this.driverData.employeeId;
          this.companyId = this.driverData.companyId;
          this.driverStatus = this.driverData.driverStatus;
          this.userName = this.driverData.userName;
          this.gender = this.driverData.gender;
          this.aceID = this.driverData.crossBorderDetails.ACE_ID;
          this.aciID = this.driverData.crossBorderDetails.ACI_ID;
          this.fastID = this.driverData.crossBorderDetails.fast_ID;
          this.fastExpiry = this.driverData.crossBorderDetails.fastExpiry;
          this.citizenship = this.driverData.citizenship;
          this.csa = this.driverData.crossBorderDetails.csa;
          this.group = this.driverData.groupID;
          
          this.address = this.driverData.address;
          this.documents = this.driverData.documentDetails
          
          this.liceIssueSate = this.driverData.licenceDetails.issuedState;
          this.liceIssueCountry = this.driverData.licenceDetails.issuedCountry;
          this.licenceExpiry = this.driverData.licenceDetails.licenceExpiry;
          this.liceMedicalCardRenewal = this.driverData.licenceDetails.medicalCardRenewal;
          this.liceWCB = this.driverData.licenceDetails.WCB;
          this.liceHealthCare = this.driverData.licenceDetails.healthCare;
          this.liceVehicleType = this.driverData.licenceDetails.vehicleType;
          this.liceContractStart = this.driverData.licenceDetails.contractStart;
          this.liceContractEnd = this.driverData.licenceDetails.contractEnd;
          this.liceDOB = this.driverData.licenceDetails.DOB;

          this.paymentType = this.driverData.paymentDetails.paymentType;
          this.loadedMiles = this.driverData.paymentDetails.loadedMiles;
          this.emptyMiles = this.driverData.paymentDetails.emptyMiles;
          this.calculateMiles = this.driverData.paymentDetails.calculateMiles;
          this.sinNumber = this.driverData.paymentDetails.SIN_Number;
          this.loadPayPercentage = this.driverData.paymentDetails.loadPayPercentage;
          this.loadPayPercentageOf = this.driverData.paymentDetails.loadPayPercentageOf;
          this.payPeriod = this.driverData.paymentDetails.payPeriod;
          this.federalTax = this.driverData.paymentDetails.federalTax;
          this.localTax = this.driverData.paymentDetails.localTax;

          this.hosStatus = this.driverData.hosDetails.hosStatus;
          this.hosRemarks = this.driverData.hosDetails.hosRemarks;
          this.hosPcAllowed = this.driverData.hosDetails.pcAllowed;
          this.hosYmAllowed = this.driverData.hosDetails.ymAllowed;
          this.hosType = this.driverData.hosDetails.type;
          this.hosCycle = this.driverData.hosDetails.hosCycle;

          this.emerName = this.driverData.emergencyDetails.name;
          this.emergencyAddress = this.driverData.emergencyDetails.emergencyAddress;
          this.emerPhone = this.driverData.emergencyDetails.phone;
          this.emerEmail = this.driverData.emergencyDetails.email;
          this.emerRelationship = this.driverData.emergencyDetails.relationship;

          
        }
      }, (err) => {
        
      });
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

  fetchYardsByIDs() {
    this.apiService.getData('yards/get/list')
    .subscribe((result: any) => {
      this.yardsObjects = result;
    });
  }

  fetchAllStatesIDs() {
    this.apiService.getData('states/get/list')
      .subscribe((result: any) => {
        this.statesObject = result;
      });
  }

  fetchAllCountriesIDs() {
    this.apiService.getData('countries/get/list')
      .subscribe((result: any) => {
        this.countriesObject = result;
      });
  }

  fetchAllCitiesIDs() {
    this.apiService.getData('cities/get/list')
      .subscribe((result: any) => {
        this.citiesObject = result;
      });
  }

  async getCarrierID(){
    this.carrierID = await this.apiService.getCarrierID();
  }

}
