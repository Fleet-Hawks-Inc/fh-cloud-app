import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
  driverID: any;
  driverData: any;
  driverType: any;

  employeeId: any;
  companyId: any;
  driverStatus: any;
  userName: any;
  driverName: any;
  gender: any;
  aceID: any;
  aciID: any;
  fastID: any;
  fastExpiry: any;
  citizenship: any;
  csa: any;
  group: any;
  workPhone: any;
  workEmail: any;

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
  
  liceIssueSate: any;
  licenceExpiry: any;
  liceMedicalCardRenewal: any;
  liceContractStart: any;
  liceContractEnd: any;
  liceDOB: any;

  paymentType: any;
  loadedMiles: any;
  emptyMiles: any;
  sinNumber: any;
  payPeriod: any;
  federalTax: any;
  localTax: any;

  docType: any;
  document: any;
  issuingAuthority: any;
  issuingCountry: any;
  issuingState: any;
  issueDate: any;
  expiryDate: any;

  CDL;
  
  homeTerminal;
  cycle;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.driverID = this.route.snapshot.params['driverID'];
    this.fetchDriver();
  }

  fetchDriver() {
    // this.spinner.show(); // loader init
    this.apiService
      .getData(`drivers/${this.driverID}`)
      .subscribe((result: any) => {
        if (result) {
          this.driverData = result['Items'][0];
          this.driverType = this.driverData.driverType;
          this.employeeId = this.driverData.employeeId;
          this.companyId = this.driverData.companyId;
          this.driverStatus = this.driverData.driverStatus;
          this.userName = this.driverData.userName;
          this.driverName = `${this.driverData.firstName} ${this.driverData.lastName}`;
          this.gender = this.driverData.gender;
          this.aceID = this.driverData.crossBorderDetails.ACE_ID;
          this.aciID = this.driverData.crossBorderDetails.ACI_ID;
          this.fastID = this.driverData.crossBorderDetails.fast_ID;
          this.fastExpiry = this.driverData.crossBorderDetails.fastExpiry;
          this.citizenship = this.driverData.citizenship;
          this.csa = this.driverData.crossBorderDetails.csa;
          this.workEmail = this.driverData.workEmail;
          this.workPhone = this.driverData.workPhone;
          this.group = this.driverData.groupID;
          this.CDL = this.driverData.licenceDetails.CDL_Number;

          this.emerName = this.driverData.emergencyDetails.name;
          this.emergencyAddress = this.driverData.emergencyDetails.emergencyAddress;
          this.emerPhone = this.driverData.emergencyDetails.phone;
          this.emerEmail = this.driverData.emergencyDetails.email;
          this.emerRelationship = this.driverData.emergencyDetails.relationship;

          this.hosStatus = this.driverData.hosDetails.hosStatus;
          this.hosRemarks = this.driverData.hosDetails.hosRemarks;
          this.hosPcAllowed = this.driverData.hosDetails.pcAllowed;
          this.hosYmAllowed = this.driverData.hosDetails.ymAllowed;
          this.hosType = this.driverData.hosDetails.type;

          this.liceIssueSate = this.driverData.licenceDetails.issuedState;
          this.licenceExpiry = this.driverData.licenceDetails.licenceExpiry;
          this.liceMedicalCardRenewal = this.driverData.licenceDetails.medicalCardRenewal;
          this.liceContractStart = this.driverData.licenceDetails.contractStart;
          this.liceContractEnd = this.driverData.licenceDetails.contractEnd;
          this.liceDOB = this.driverData.licenceDetails.DOB;

          this.paymentType = this.driverData.paymentDetails.paymentType;
          this.loadedMiles = this.driverData.paymentDetails.loadedMiles;
          this.emptyMiles = this.driverData.paymentDetails.emptyMiles;
          this.sinNumber = this.driverData.paymentDetails.SIN_Number;
          this.payPeriod = this.driverData.paymentDetails.payPeriod;
          this.federalTax = this.driverData.paymentDetails.federalTax;
          this.localTax = this.driverData.paymentDetails.localTax;

          this.docType = this.driverData.documentDetails[0].documentType;
          this.document = this.driverData.documentDetails[0].document;
          this.issuingAuthority = this.driverData.documentDetails[0].issuingAuthority;
          this.issuingCountry = this.driverData.documentDetails[0].issuingCountry;
          this.issuingState = this.driverData.documentDetails[0].issuingState;
          this.issueDate = this.driverData.documentDetails[0].issueDate;
          this.expiryDate = this.driverData.documentDetails[0].expiryDate;
          // //this.getImages();
          // // this.spinner.hide(); // loader hide
        }
      }, (err) => {
        console.log('Driver detail', err);
      });
  }

}
