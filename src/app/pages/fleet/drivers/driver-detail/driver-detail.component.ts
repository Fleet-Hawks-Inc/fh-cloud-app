import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardUtilityService, HereMapService } from '../../../../services';
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
import * as moment from 'moment';
import { from } from 'rxjs';
import { passwordStrength } from 'check-password-strength';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';
import { ELDService } from "src/app/services/eld.service";
import { MessageService } from 'primeng/api';

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
    currency = ''
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
    csa: any = false;
    group: any;
    assignedVehicle: any;
    address: any = [];
    documents: any = [];
    licNotification: any = false;
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
    hosPcAllowed: boolean = false;
    hosYmAllowed: boolean = false;
    hosType: any;
    hosCycle: any;
    timezone: any;
    uploadLicence:any = [];
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
    start = null;
    end = null;
    absDocs = [];
    profile: any = [];
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
    driverLogs = [];
    groupName: any = '';
    groupId: any = '';
    sessionId: string;
    payPerMile = {
        pType: "ppm",
        loadedMiles: null,
        currency: null,
        emptyMiles: null,
        emptyMilesTeam: null,
        loadedMilesTeam: null,
        default: false
    }
    payPerHour = {
        pType: "pph",
        rate: null,
        currency: null,
        waitingPay: null,
        waitingHourAfter: null,
        default: false
    }
    payPercentage = {
        pType: "pp",
        loadPayPercentage: null,
        loadPayPercentageOf: null,
        default: false
    }
    payPerDelivery = {
        pType: "ppd",
        deliveryRate: null,
        currency: null,
        default: false
    }

    payFlatRate = {
        pType: "pfr",
        flatRate: null,
        currency: null,
        default: false
    }
    eldDriver = {
        driverId: '',
        driverFstName: '',
        driverMdlName: '',
        driverLstName: '',
        userName: '',
        licensePlateNo: '',
        startingTime: null,
        Jurisdiction: null,
        homeBase: null,
        units: null,
        active: true,
        personalUse: true,
        yardMove: true,
        exemption: true,
        exemptionReason:'',
        wifi: true,
        allowUseExemption: true,
        allowTakePhoto: true,
        ruleSet: null,
        licStateCode: '',
        issuedState: null,
        issuedCountry: null,
        cntryName: '',
        stateName: "",
        formStateCode: '',
        password: '',
        confirmPassword: '',
        homeBaseName: ''
    
    }
    homeBaseData = []
    driverErr = ''
    finalState = ''
    formStateName:any
    display: any;
    driverObj = {}
    startTimeCode: number
    jurisdictionC: number
    fuelCode: number
    persnlUse: number
    active: number
    yardM: number
    exemp: number
    wifi: number
    useExemp: number
    takePhoto: number
    ruleData:any
    stateCode = null;
    states: any = [];
    countryCode = null;
    HosDriverId: number
    ruleEvent:any
    constructor(
        private hereMap: HereMapService,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private domSanitizer: DomSanitizer,
        private httpClient: HttpClient,
        private toastr: ToastrService,
        private countryStateCity: CountryStateCityService,
        private routerMgmtService: RouteManagementServiceService,
        private eldService: ELDService,
        private messageService: MessageService,
        private dashboardUtil: DashboardUtilityService
    ) {
        this.sessionId = this.routerMgmtService.driverUpdateSessionID;

    }
    paymentOptions = [{ name: "Pay Per Mile", value: "ppm" }, { name: "Percentage", value: "pp" }, { name: "Pay Per Hour", value: "pph" }, { name: "Pay Per Delivery", value: "ppd" }, { name: "Flat Rate", value: "pfr" }]

    ngOnInit() {

        this.driverID = this.route.snapshot.params[`driverID`]; // get asset Id from URL
        this.fetchDriver();
        this.end = moment().format('YYYY-MM-DD');
        this.start = moment().subtract(15, 'days').format('YYYY-MM-DD');
        // this.fetchGroupsbyIDs();
        this.fetchAllContacts();
        this.fetchDocuments();
        this.fetchDriverTrips();
        this.fetchVehicleList();
        this.fetchDriverList();
        this.fetchAssetList();
        this.fetchDriverLogs();
        this.dashboardUtil.isHosEnableForCarrier()
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
                    this.HosDriverId = this.driverData.HosDriverId
                    console.log(' this.HosDriverId', this.HosDriverId)
                    this.userName = this.driverData.userName;
                    this.driverDataUpdate = await result[`Items`][0];
                    if (this.driverData.hosDetails.homeTerminal != '') {
                        await this.fetchHomeTerminal(this.driverData.hosDetails.homeTerminal);
                    }
                    if (this.driverData.address !== undefined && this.driverData.address !== '') {
                        this.fetchCompleteAdd(this.driverData.address);
                        this.address = this.driverData.address;
                    }
                    this.cycle = this.driverData.hosDetails.hosCycleName ? this.driverData.hosDetails.hosCycleName : '';
                    this.email = this.driverData.email;
                    this.phone = this.driverData.phone;
                    this.DOB = this.driverData.DOB;
                    this.CDL = this.driverData.CDL_Number;
                    this.payPeriod = this.driverData.payPeriod
                    if (this.driverData.paymentOption) {
                        this.driverData.paymentOption.forEach(element => {
                            if (element.default) {
                                const type = this.paymentOptions.find(el => el.value == element.pType)
                                this.paymentType = type.name
                            }

                            if (element.pType == "pph") {
                                this.payPerHour.currency = element.currency
                                this.payPerHour.rate = element.rate
                                this.payPerHour.waitingHourAfter = element.waitingHourAfter
                                this.payPerHour.waitingPay = element.waitingPay
                            }
                            if (element.pType == "pfr") {
                                this.payFlatRate.flatRate = element.flatRate
                                this.payFlatRate.currency = element.currency
                            }
                            if (element.pType == "ppm") {
                                this.payPerMile.loadedMiles = element.loadedMiles
                                this.payPerMile.currency = element.currency
                                this.payPerMile.emptyMiles = element.emptyMiles
                                this.payPerMile.emptyMilesTeam = element.emptyMilesTeam
                                this.payPerMile.loadedMilesTeam = element.loadedMilesTeam
                            }
                            if (element.pType == "pp") {
                                this.payPercentage.loadPayPercentage = element.loadPayPercentage
                                this.payPercentage.loadPayPercentageOf = element.loadPayPercentageOf
                            }
                            if (element.pType == "ppd") {
                                this.payPerDelivery.currency = element.currency
                                this.payPerDelivery.deliveryRate = element.deliveryRate
                            }
                        });
                    }
                    if (this.driverData.middleName !== undefined && this.driverData.middleName !== null && this.driverData.middleName !== '') {
                        this.driverName = `${this.driverData.firstName} ${this.driverData.middleName} ${this.driverData.lastName}`;
                    } else {
                        this.driverName = `${this.driverData.firstName} ${this.driverData.lastName}`;
                    }
                    this.startDate = this.driverData.startDate;
                    this.terminationDate = this.driverData.terminationDate;
                    this.contractStart = this.driverData.contractStart;
                    this.contractEnd = this.driverData.contractEnd;

                    if (this.driverData.driverImage !== '' && this.driverData.driverImage !== undefined) {
                        this.profile = this.driverData.uploadImage;
                    } else {
                        this.profile = 'assets/img/driver/driver.png';
                    }
                    if (this.driverData.abstractDocs !== undefined && this.driverData.abstractDocs.length > 0) {
                        this.absDocs = this.driverData.docsAbs;
                    }
                    if (this.driverData.uploadLicence !== undefined && this.driverData.uploadLicence.length > 0) {
                        this.uploadLicence = this.driverData.licDocs;
                    }
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
                    if (this.driverData.crossBorderDetails && this.driverData.crossBorderDetails != undefined) {

                        this.aceID = this.driverData.crossBorderDetails.ACE_ID;
                        this.aciID = this.driverData.crossBorderDetails.ACI_ID;
                        this.fastID = this.driverData.crossBorderDetails.fast_ID;
                        this.fastExpiry = this.driverData.crossBorderDetails.fastExpiry;
                        this.citizenship = await this.countryStateCity.GetSpecificCountryNameByCode(this.driverData.citizenship);
                        this.csa = this.driverData.crossBorderDetails.csa;
                    }
                    this.groupId = this.driverData.groupID;
                    if (this.groupId != null) {

                        this.groupName = this.fetchGroups(this.groupId)[0].groupName
                    }
                    this.assignedVehicle = this.driverData.assignedVehicle;

                    let newDocuments = [];
                    if (this.driverData.documentDetails.length > 0) {
                        for (let i = 0; i < this.driverData.documentDetails.length; i++) {
                            let docmnt = []
                            if (this.driverData.documentDetails[i].uploadedDocs != undefined && this.driverData.documentDetails[i].uploadedDocs.length > 0) {
                                docmnt = this.driverData.documentDetails[i].uploadedDocs;
                            }
                            newDocuments.push({
                                documentType: this.driverData.documentDetails[i].documentType ? this.driverData.documentDetails[i].documentType : '',
                                document: this.driverData.documentDetails[i].document ? this.driverData.documentDetails[i].document : '',
                                issuingAuthority: this.driverData.documentDetails[i].issuingAuthority ? this.driverData.documentDetails[i].issuingAuthority : '',
                                issuingCountry: (this.driverData.documentDetails[i].issuingCountry && this.driverData.documentDetails[i].issuingCountry != '') ? await this.countryStateCity.GetSpecificCountryNameByCode(this.driverData.documentDetails[i].issuingCountry) : '',
                                issuingState: (this.driverData.documentDetails[i].issuingCountry && this.driverData.documentDetails[i].issuingCountry != '') ? await this.countryStateCity.GetStateNameFromCode(this.driverData.documentDetails[i].issuingState, this.driverData.documentDetails[i].issuingCountry) : '',
                                issueDate: this.driverData.documentDetails[i].issueDate ? this.driverData.documentDetails[i].issueDate : '',
                                expiryDate: this.driverData.documentDetails[i].expiryDate ? this.driverData.documentDetails[i].expiryDate : '',
                                uploadedDocs: docmnt
                            });

                            //Presigned URL Using AWS S3
                            this.assetsDocs[i] = this.driverData.docuementUpload;
                        }
                        this.documents = newDocuments;
                    }
                    if (this.driverData.licenceDetails != undefined) {
                        this.liceIssueSate = (this.driverData.licenceDetails.issuedState && this.driverData.licenceDetails.issuedState != '') ? await this.countryStateCity.GetStateNameFromCode(this.driverData.licenceDetails.issuedState, this.driverData.licenceDetails.issuedCountry) : '',
                        
                        this.eldDriver.licStateCode = this.driverData.licenceDetails.issuedState
                            this.liceIssueCountry = (this.driverData.licenceDetails.issuedCountry && this.driverData.licenceDetails.issuedCountry != '') ? await this.countryStateCity.GetSpecificCountryNameByCode(this.driverData.licenceDetails.issuedCountry) : '';

                        this.licenceExpiry = this.driverData.licenceDetails.licenceExpiry;
                        this.liceMedicalCardRenewal = this.driverData.licenceDetails.medicalCardRenewal;
                        this.licNotification = this.driverData.licenceDetails.licenceNotification;
                        this.liceWCB = this.driverData.licenceDetails.WCB;
                        this.liceHealthCare = this.driverData.licenceDetails.healthCare;
                        this.liceVehicleType = this.driverData.licenceDetails.vehicleType;
                        this.liceContractStart = this.driverData.licenceDetails.contractStart;
                        this.liceContractEnd = this.driverData.licenceDetails.contractEnd;
                    }

                    this.SIN = this.driverData.SIN;
                    if (this.driverData.paymentDetails && this.driverData.paymentDetails != undefined) {
                        this.loadPayPercentage = this.driverData.paymentDetails.loadPayPercentage;
                        this.loadPayPercentageOf = this.driverData.paymentDetails.loadPayPercentageOf;
                        this.payPeriod = this.driverData.paymentDetails.payPeriod.replace('_', ' ');
                    }
                    this.hosStatus = this.driverData.hosDetails.hosStatus;
                    this.hosRemarks = this.driverData.hosDetails.hosRemarks;
                    this.hosPcAllowed = this.driverData.hosDetails.pcAllowed;
                    this.hosYmAllowed = this.driverData.hosDetails.ymAllowed;
                    this.hosType = this.driverData.hosDetails.type;
                    this.hosCycle = this.driverData.hosDetails.hosCycleName;
                    this.timezone = this.driverData.hosDetails.timezone;
                    this.optzone = this.driverData.hosDetails.optZone;
                    if (this.driverData.emergencyDetails && this.driverData.emergencyDetails != undefined) {

                        this.emerName = this.driverData.emergencyDetails.name;
                        this.emergencyAddress = this.driverData.emergencyDetails.emergencyAddress;
                        this.emerPhone = this.driverData.emergencyDetails.phone;
                        this.emerEmail = this.driverData.emergencyDetails.email;
                        this.emerRelationship = this.driverData.emergencyDetails.relationship;
                    }
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

    // fetchGroupsbyIDs() {
    //     this.apiService.getData('groups/get/list')
    //         .subscribe((result: any) => {
    //             this.groupsObjects = result;
    //         });
    // }

    fetchGroups(groupId) {
        this.apiService.getData(`groups/get/list?type=drivers&groupId=${groupId}`).subscribe((result: any) => {
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
        if(type === 'licDocs'){
           this.uploadLicence.splice(index, 1);
           this.driverData.uploadLicence.splice(index, 1);
           this.deleteUploadedFile(name);
           }
        else if (type === 'doc') {
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
        this.apiService.getData(`drivers/get/driver/active?driver=${this.driverID}&startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
            this.trips = result.Items;
        });
    }

    fetchDriverLogs() {
        this.apiService.getData(`auditLogs/details/${this.driverID}`)
            .subscribe((res: any) => {
                this.driverLogs = res.Items;
                if (this.driverLogs.length > 0) {
                    this.driverLogs.map((k) => {
                        k.dateAndTime = `${k.createdDate} ${k.createTime}`;
                        if (k.eventParams.userName !== undefined) {
                            const newString = k.eventParams.userName.split("_");
                            k.userFirstName = newString[0];
                            k.userLastName = newString[1];
                        }
                        if (k.eventParams.name !== undefined) {
                            k.entityNumber = k.eventParams.name;
                        }
                        if (k.eventParams.name !== undefined) {
                            if (k.eventParams.name.includes("_")) {
                                const newString = k.eventParams.name.split("_");
                                k.firstName = newString[0];
                                k.lastName = newString[1];
                            }
                        }
                    });
                    this.driverLogs.sort((a, b) => {
                        return (new Date(b.dateAndTime).valueOf() -
                            new Date(a.dateAndTime).valueOf()
                        );
                    });
                }
            });
    }

    showEldModel() {
        this.getRuleSetData()
        this.getHomeBaseData()
        this.eldDriver.driverId = this.driverID;
        this.eldDriver.driverFstName = `${this.driverData.firstName} `;
        this.eldDriver.driverLstName = this.driverData.lastName;
        this.eldDriver.userName = this.userName;
        this.display = true;
    }

  async   submitClick() {
    if(this.eldDriver.driverFstName  === '' || this.eldDriver.driverLstName === '' || this.eldDriver.userName === '' 
    || this.eldDriver.ruleSet  === null || this.eldDriver.Jurisdiction === null || this.eldDriver.startingTime === null 
    || this.eldDriver.units  === null  || this.eldDriver.password  === ''  || this.eldDriver.homeBaseName === ''){
        this.driverErr = "Please fill the required fields";
        return false;
    }else {
        this.driverErr = "";
      }
      if(!this.eldDriver.licStateCode){
        if(this.eldDriver.issuedCountry  === null || this.eldDriver.issuedState  === null ){
            this.driverErr = "Please fill the required fields";
              return false;
          }
      }
      
      if(this.driverData.licenceDetails.issuedState != ''){
        if(this.eldDriver.licStateCode === ''  ){
            this.driverErr = "Please fill the required fields";
              return false;
          }
      }
    
    if(this.eldDriver.exemption == true){
        if( this.eldDriver.exemptionReason === ''  ){
            this.driverErr = "Please fill the required fields";
              return false;
        }
    }
    
    
        if (this.eldDriver.startingTime == 'Midnight') {
            this.startTimeCode = 0
        }
        if (this.eldDriver.units == 'Km/Liters') {
            this.fuelCode = 2
        }
        else {
            this.fuelCode = 1
        }
        
        if (this.eldDriver.active == true) {
            this.active = 1
        }
        else {
            this.active = 0
        }

        if (this.eldDriver.personalUse == true) {
            this.persnlUse = 1
        }
        else {
            this.persnlUse = 0
        }

        if (this.eldDriver.yardMove == true) {
            this.yardM = 1
        }
        else {
            this.yardM = 0
        }

        if (this.eldDriver.exemption == true) {
            this.exemp = 1
        }
        else {
            this.exemp = 0
        }

        if (this.eldDriver.wifi == true) {
            this.wifi = 1
        }
        else {
            this.wifi = 0
        }


        if (this.eldDriver.allowUseExemption == true) {
            this.useExemp = 1
        }
        else {
            this.useExemp = 0
        }


        if (this.eldDriver.allowTakePhoto == true) {
            this.takePhoto = 1
        }
        else {
            this.takePhoto = 0
        }

        if (this.eldDriver.Jurisdiction == 'Canada North') {
            this.jurisdictionC = 2
        }
        else if (this.eldDriver.Jurisdiction == 'USA'){
            this.jurisdictionC = 3
        } 
        else{
            this.jurisdictionC = 1
        }

        this.formStateName = (this.eldDriver.issuedState && this.eldDriver.issuedState != '') ? await this.countryStateCity.GetStateNameFromCode(this.eldDriver.issuedState, this.eldDriver.issuedCountry) : '',
        console.log(' this.formStateName==', this.formStateName)   
        this.eldDriver.formStateCode = this.eldDriver.issuedState
        console.log('  this.eldDriver.formStateCode=',  this.eldDriver.formStateCode)   
        if(!this.eldDriver.licStateCode) {
            this.finalState = this.eldDriver.formStateCode
        }
        else{
            this.finalState = this.eldDriver.licStateCode
        }
        let driverIdDigit = this.driverID.match(/(\d+)/g)
        let digits = parseInt(driverIdDigit.join(''))

        if(this.HosDriverId !=0){
        this.driverObj = {
            HOSDriverId :  0,
            FhIdentifier: this.driverID,
            ExternalDriverId: digits,
            Name: this.eldDriver.driverFstName,
            LastName: this.eldDriver.driverLstName,
            HOSUserName: this.eldDriver.userName,
            HOSPassword:this.eldDriver.password,
            HOSHomeBaseId: this.eldDriver.homeBaseName,
            IsActive: this.active,
            HOSRuleSetId: this.eldDriver.ruleSet,
            PersonalUse: this.persnlUse,
            YardMove: this.yardM,
            Exemption: this.exemp,
            LicenseState:this.finalState,
            LicenseNumber: this.CDL,
            Wifi: this.wifi,
            DistanceUnitCode: this.fuelCode,
            FuelUnitCode: this.fuelCode,
            Starting24HTime: this.startTimeCode,
            AllowDriverExemptionSelection: this.useExemp,
            JurisdictionCode: this.jurisdictionC,
      
            // HOSHomeBaseId:,
            TakeDVIRPhotoEnabled: this.takePhoto,

        }
        if(this.eldDriver.exemptionReason){
            this.driverObj['ExemptionReason'] = `${this.eldDriver.exemptionReason}`
            console.log('this.driverObj===',this.driverObj)
        }

        console.log('this.driverObj--0--', this.driverObj)
        this.eldService.postData("drivers", {
            HOSDriver: this.driverObj
        }).subscribe(result => {
            this.showSuccess();
            // return result
        }, error => {
            console.log('error', error)
            this.showError(error)
        })
    }
    }
    getRuleDataCode($event) {
       this.ruleEvent = $event
       console.log(' this.ruleEvent', this.ruleEvent)
    }

    showError(error: any) {
        this.messageService.add({
            severity: 'error', summary: 'Error',
            detail: error.error.message
        });
    }

    showSuccess() {
        this.messageService.add({
            severity: 'success',
            summary: 'Success', detail: 'Driver added successfully in ELD'
        });


    }
    getRuleSetData() {
        this.httpClient.get('assets/jsonFiles/ruleset.json').subscribe((data) => {
            this.ruleData = data;
          });
        
    }

      async getLicStates(cntryCode: any) {
        this.eldDriver.issuedState = null;
        this.eldDriver.cntryName =
          await this.countryStateCity.GetSpecificCountryNameByCode(cntryCode);
    
        this.states = await this.countryStateCity.GetStatesByCountryCode([
          cntryCode,
        ]);
      }

      async getLicenseStateName() {
        if (
            this.eldDriver.issuedState &&
          this.eldDriver.issuedCountry
        ) {
          this.eldDriver.stateName =
            await this.countryStateCity.GetStateNameFromCode(
                this.eldDriver.issuedState,
                this.eldDriver.issuedCountry
            );
        }
      }

      getHomeBaseData() {
        this.eldService.getData('home-bases').subscribe((data) => {
            this.homeBaseData = data;
        console.log('this.homeBaseData',this.homeBaseData)
          });
      }
    
}