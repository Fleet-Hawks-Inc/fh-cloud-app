import { Component, OnInit, ViewChild } from '@angular/core';
import { HereMapService } from '../../../../services';
import { ApiService } from '../../../../services';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import Constants from '../../constants';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { passwordStrength } from 'check-password-strength';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';
declare var $: any;
@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.css']
})
export class DriverDetailComponent implements OnInit {
  @ViewChild('driverF') driverF: NgForm;
  Asseturl = this.apiService.AssetUrl;
  environment = environment.isFeatureEnabled;
  platform: any;
  driverName: string;
  CDL: string;
  phone: string;
  email: string;
  homeTerminal: string;
  cycle: string;
  public driverID: string;
  private driverData: any;
  private driverDataUpdate: any;
  carrierID: any;
  trips: any = [];
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
  licNotification: any;
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
  nullVar = null;
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
  rateUnit: string;
  waitingPay: string;
  waitingPayUnit: string;
  waitingHourAfter: string;

  deliveryRate: string;
  deliveryRateUnit: string;
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
  yardsObjects: any = {};
  statesObject: any = {};
  countriesObject: any = {};
  citiesObject: any = {};
  groupsObjects: any = {};
  contactsObject: any = {};
  vehicleList: any = {};
  driverList: any = {};
  assetList: any = {};
  docs = [];
  assetsDocs = [];
  absDocs = [];
  profile = [];
  documentTypeList: any = [];
  documentsTypesObects: any = {};
  dataMessage = Constants.NO_RECORDS_FOUND;
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');
  corporationType: any;
  vendor: any;
  corporation: any;
  fieldTextType: boolean;
  cpwdfieldTextType: boolean;
  passwordValidation = {
    upperCase: false,
    lowerCase: false,
    number: false,
    specialCharacters: false,
    length: false
  };
  submitDisabled = false;
  driverPwdData = { password: '', confirmPassword: '' };
  errors = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  constructor(
    private hereMap: HereMapService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private domSanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private countryStateCity: CountryStateCityService
  ) {

  }

  ngOnInit() {

    this.driverID = this.route.snapshot.params[`driverID`]; // get asset Id from URL
    this.fetchDriver();

    this.fetchGroupsbyIDs();
    this.fetchAllContacts();
    this.fetchDocuments();
    this.fetchDriverTrips();
    this.fetchVehicleList();
    this.fetchDriverList();
    this.fetchAssetList();
  }
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
  fetchAssetList() {
    this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetList = result;
    });
  }
  fetchDriverList() {
    this.apiService.getData('drivers/get/list').subscribe((result: any) => {
      this.driverList = result;
    });
  }
  onChangeHideErrors(fieldname = '') {
    $('[name="' + fieldname + '"]')
      .removeClass('error')
      .next()
      .remove('label');
  }
  // Show password
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  togglecpwdfieldTextType() {
    this.cpwdfieldTextType = !this.cpwdfieldTextType;
  }
  validatePassword(password) {
    let passwordVerify = passwordStrength(password)
    if (passwordVerify.contains.includes('lowercase')) {
      this.passwordValidation.lowerCase = true;
    } else {
      this.passwordValidation.lowerCase = false;
    }

    if (passwordVerify.contains.includes('uppercase')) {
      this.passwordValidation.upperCase = true;
    } else {
      this.passwordValidation.upperCase = false;
    }
    if (passwordVerify.contains.includes('symbol')) {
      this.passwordValidation.specialCharacters = true;
    } else {
      this.passwordValidation.specialCharacters = false;
    }
    if (passwordVerify.contains.includes('number')) {
      this.passwordValidation.number = true;
    } else {
      this.passwordValidation.number = false;
    }
    if (passwordVerify.length >= 8) {
      this.passwordValidation.length = true
    } else {
      this.passwordValidation.length = false;
    }
    if (password.includes('.') || password.includes('-')) {
      this.passwordValidation.specialCharacters = true;
    }
  }
  onChangePassword() {
    this.submitDisabled = true;
    this.hideErrors();
    const data = {
      userName: this.userName,
      password: this.driverPwdData.password
    };
    this.apiService.postData('drivers/password', data).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
              this.submitDisabled = false;

            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.submitDisabled = false;
        this.toastr.success('Password updated successfully');
        $('#driverPasswordModal').modal('hide');
        this.driverPwdData = {
          password: '',
          confirmPassword: '',
        };
      },
    });
  }
  pwdModalClose() {
    $('#driverPasswordModal').modal('hide');
    this.driverPwdData = {
      password: '',
      confirmPassword: '',
    };
  }
  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
    // this.vehicleForm.showErrors(this.errors);
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label')
      });
    this.errors = {};
  }
  async fetchHomeTerminal(homeTerminal) {
    if (homeTerminal !== undefined) {
      if (homeTerminal.manual) {
        let combineAddress: any;
        if (homeTerminal.address !== '') {
          combineAddress = `${homeTerminal.address}`;
        }
        if (homeTerminal.cityName !== '') {
          combineAddress += `,` + `${homeTerminal.cityName}`;
        }
        if (homeTerminal.stateCode !== '') {
          combineAddress += `,` + await this.countryStateCity.GetStateNameFromCode(homeTerminal.stateCode, homeTerminal.countryCode);
        }
        if (homeTerminal.countryCode !== '') {
          combineAddress += `,` + await this.countryStateCity.GetSpecificCountryNameByCode(homeTerminal.countryCode);
        }
        if (homeTerminal.zipCode !== '') {
          combineAddress += ` - ${homeTerminal.zipCode}`;
        }
        this.homeTerminal = combineAddress;
      } else {
        this.homeTerminal = homeTerminal.userLocation;
      }
    }
  }
  fetchDriver() {
    this.spinner.show(); // loader init
    this.apiService
      .getData(`drivers/${this.driverID}`)
      .subscribe(async (result: any) => {
        if (result) {
          this.driverData = await result[`Items`][0];
          this.userName = this.driverData.userName;
          this.driverDataUpdate = await result[`Items`][0];
          await this.fetchHomeTerminal(this.driverData.hosDetails.homeTerminal);
          if (this.driverData.address !== undefined || this.driverData.address !== '') {
            this.fetchCompleteAdd(this.driverData.address);
          }
          this.cycle = this.driverData.hosDetails.hosCycleName;
          this.email = this.driverData.email;
          this.phone = this.driverData.phone;
          this.DOB = this.driverData.DOB;
          this.CDL = this.driverData.CDL_Number;
          if (this.driverData.middleName !== undefined && this.driverData.middleName !== null && this.driverData.middleName !== '') {
            this.driverName = `${this.driverData.firstName} ${this.driverData.middleName} ${this.driverData.lastName}`;
          } else {
            this.driverName = `${this.driverData.firstName} ${this.driverData.lastName}`;
          }

          this.startDate = this.driverData.startDate;
          this.terminationDate = this.driverData.terminationDate;
          this.contractStart = this.driverData.contractStart;
          this.contractEnd = this.driverData.contractEnd;
          /*
          if (this.driverData.driverImage !== '' && this.driverData.driverImage !== undefined) {
            this.profile = `${this.Asseturl}/${this.driverData.carrierID}/${this.driverData.driverImage}`;
          } else {
            this.profile = 'assets/img/driver/driver.png';
          }
          */  
          //Presigned URL Using AWS S3
          this.profile =  this.driverData.uploadImage;
          this.absDocs = this.driverData.docsAbs;
          /*
          if (this.driverData.abstractDocs !== undefined && this.driverData.abstractDocs.length > 0) {
            //this.absDocs = this.driverData.abstractDocs.map(x => ({ path: `${this.Asseturl}/${this.driverData.carrierID}/${x}`, name: x }));
          }
          */
          this.driverType = this.driverData.driverType;
          this.employeeId = this.driverData.employeeContractorId;
          this.corporationType = this.driverData.corporationType ? this.driverData.corporationType.replace('_', ' ') : '';
          this.vendor = this.driverData.vendor;
          this.corporation = this.driverData.corporation;
          this.ownerOperator = this.driverData.ownerOperator;
          this.companyId = this.driverData.companyId;
          this.companyName = this.driverData.companyName;
          this.driverStatus = this.driverData.driverStatus;
          this.gender = this.driverData.gender;
          this.aceID = this.driverData.crossBorderDetails.ACE_ID;
          this.aciID = this.driverData.crossBorderDetails.ACI_ID;
          this.fastID = this.driverData.crossBorderDetails.fast_ID;
          this.fastExpiry = this.driverData.crossBorderDetails.fastExpiry;
          this.citizenship = await this.countryStateCity.GetSpecificCountryNameByCode(this.driverData.citizenship);
          this.csa = this.driverData.crossBorderDetails.csa;
          this.group = this.driverData.groupID;
          this.assignedVehicle = this.driverData.assignedVehicle;
          this.address = this.driverData.address;
          let newDocuments = [];
          for (let i = 0; i < this.driverData.documentDetails.length; i++) {
            let docmnt = []
           if (this.driverData.documentDetails[i].uploadedDocs != undefined && this.driverData.documentDetails[i].uploadedDocs.length > 0) {
                this.assetsDocs[i] = this.driverData.docuementUpload;
             // docmnt = this.driverData.documentDetails[i].uploadedDocs;
            }
            newDocuments.push({
              documentType: this.driverData.documentDetails[i].documentType,
              document: this.driverData.documentDetails[i].document,
              issuingAuthority: this.driverData.documentDetails[i].issuingAuthority,
              issuingCountry: await this.countryStateCity.GetSpecificCountryNameByCode(this.driverData.documentDetails[i].issuingCountry),
              issuingState: await this.countryStateCity.GetStateNameFromCode(this.driverData.documentDetails[i].issuingState, this.driverData.documentDetails[i].issuingCountry),
              issueDate: this.driverData.documentDetails[i].issueDate,
              expiryDate: this.driverData.documentDetails[i].expiryDate,
              uploadedDocs: docmnt
            });
            if (this.driverData.documentDetails[i].uploadedDocs != undefined && this.driverData.documentDetails[i].uploadedDocs.length > 0) {
                this.assetsDocs[i] = this.driverData.docuementUpload;
              //this.assetsDocs[i] = this.driverData.documentDetails[i].uploadedDocs.map(x => ({ path: `${this.Asseturl}/${this.driverData.carrierID}/${x}`, name: x }));
            }
          }
          this.documents = newDocuments;
          this.liceIssueSate = await this.countryStateCity.GetStateNameFromCode(this.driverData.licenceDetails.issuedState, this.driverData.licenceDetails.issuedCountry),
            this.liceIssueCountry = await this.countryStateCity.GetSpecificCountryNameByCode(this.driverData.licenceDetails.issuedCountry);
          this.licenceExpiry = this.driverData.licenceDetails.licenceExpiry;
          this.liceMedicalCardRenewal = this.driverData.licenceDetails.medicalCardRenewal;
          this.licNotification = this.driverData.licenceDetails.licenceNotification;
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

          this.rate = this.driverData.paymentDetails.rate;
          this.rateUnit = this.driverData.paymentDetails.rateUnit;
          this.waitingPay = this.driverData.paymentDetails.waitingPay;
          this.waitingPayUnit = this.driverData.paymentDetails.waitingPayUnit;
          this.waitingHourAfter = this.driverData.paymentDetails.waitingHourAfter;
          this.deliveryRate = this.driverData.paymentDetails.deliveryRate;
          this.deliveryRateUnit = this.driverData.paymentDetails.deliveryRateUnit;
          this.SIN = this.driverData.SIN;
          this.loadPayPercentage = this.driverData.paymentDetails.loadPayPercentage;
          this.loadPayPercentageOf = this.driverData.paymentDetails.loadPayPercentageOf;
          this.payPeriod = this.driverData.paymentDetails.payPeriod.replace('_', ' ');
          //  this.homeTerminal = this.driverData.hosDetails.homeTerminal;
          this.hosStatus = this.driverData.hosDetails.hosStatus;
          this.hosRemarks = this.driverData.hosDetails.hosRemarks;
          this.hosPcAllowed = this.driverData.hosDetails.pcAllowed;
          this.hosYmAllowed = this.driverData.hosDetails.ymAllowed;
          this.hosType = this.driverData.hosDetails.type;
          this.hosCycle = this.driverData.hosDetails.hosCycleName;
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
    if (address != '') {
      for (let a = 0; a < address.length; a++) {
        address.map(async (e: any) => {
          if (e.manual) {
            e.countryName = await this.countryStateCity.GetSpecificCountryNameByCode(e.countryCode);
            e.stateName = await this.countryStateCity.GetStateNameFromCode(e.stateCode, e.countryCode);
          }
        });
      }
    }

  }
  fetchDocuments() {
    this.httpClient.get('assets/travelDocumentType.json').subscribe(data => {
      this.documentTypeList = data;
      this.documentsTypesObects = this.documentTypeList.reduce((a: any, b: any) => {
        return a[b[`code`]] = b[`description`], a;
      }, {});

    })
  }

  fetchGroupsbyIDs() {
    this.apiService.getData('groups/get/list')
      .subscribe((result: any) => {
        this.groupsObjects = result;
      });
  }

  fetchAllContacts() {
    this.apiService.getData('contacts/get/list')
      .subscribe((result: any) => {
        this.contactsObject = result;
      });
  }


  async getCarrierID() {
    this.carrierID = await this.apiService.getCarrierID();
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length - 1];
    this.pdfSrc = '';
    if (ext === 'doc' || ext === 'docx' || ext === 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  // delete uploaded images and documents
  delete(type: string, name: string, index: any, docIndex: any) {
    this.driverDataUpdate.hosDetails.homeTerminal = this.driverDataUpdate.hosDetails.homeTerminal.addressID;
    delete this.driverDataUpdate.isDelActiveSK;
    delete this.driverDataUpdate.driverSK;
    delete this.driverDataUpdate.hosDetails.cycleInfo;
    delete this.driverDataUpdate.carrierID;
    delete this.driverDataUpdate.timeModified;
    if (type === 'doc') {
      this.assetsDocs[index].splice(docIndex, 1);
      this.driverDataUpdate.documentDetails[index].uploadedDocs.splice(docIndex, 1);
      this.deleteUploadedFile(name);
      try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(this.driverDataUpdate));
        this.apiService.putData('drivers', formData, true).subscribe({
          complete: () => { this.fetchDriver(); }
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      this.absDocs.splice(index, 1);
      this.driverDataUpdate.abstractDocs.splice(index, 1);
      this.deleteUploadedFile(name);
      try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(this.driverDataUpdate));
        this.apiService.putData('drivers', formData, true).subscribe({
          complete: () => { this.fetchDriver(); }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
  deleteUploadedFile(name: string) { // delete from aws
    this.apiService.deleteData(`drivers/uploadDelete/${name}`).subscribe((result: any) => { });
  }
  fetchDriverTrips() {
    this.apiService.getData(`trips/get/driver/active/${this.driverID}`).subscribe((result: any) => {
      this.trips = result.Items;

    });
  }
}
