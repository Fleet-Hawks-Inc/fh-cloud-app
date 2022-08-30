import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormConfig, RxFormBuilder, RxwebValidators } from '@rxweb/reactive-form-validators';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';
import { environment } from '../../../../../environments/environment';
import { ApiService, DashboardUtilityService } from '../../../../services';
import Constants from '../../constants';
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';
import { ELDService } from "src/app/services/eld.service";
import { MessageService } from 'primeng/api';
declare var $: any;



@Component({
    selector: 'app-vehicle-detail',
    templateUrl: './vehicle-detail.component.html',
    styleUrls: ['./vehicle-detail.component.css'],
})
export class VehicleDetailComponent implements OnInit {

    noRecordMsg = Constants.NO_RECORDS_FOUND;
    slides = [];
    docs = [];
    pDocs = [];
    lDocs = [];
    Asseturl = this.apiService.AssetUrl;
    public environment = environment;
    /**
     * Vehicle Prop
     */
    driversList: any = {};
    vehicleModelList: any = {};
    vehicleManufacturersList: any = {};
    groupsList: any = {};
    statesList: any = {};
    countriesList: any = {};
    vendors = {};

    iftaReporting = '';
    annualSafetyDate = '';
    vehicleID = '';
    vehicleIdentification = '';
    vehicleType = '';
    VIN = '';
    year = '';
    manufacturerID = '';
    uploadedDocs = [];
    existingDocs = [];
    modelID = '';
    plateNumber = '';
    stateID = '';
    countryID = '';
    driverID = '';
    teamDriverID = '';
    serviceProgramID: any = [];
    primaryMeter = '';
    repeatByTime = '';
    sessionID: string;
    repeatByTimeUnit = '';
    reapeatbyOdometerMiles = '';
    currentStatus = '';
    ownership = '';
    groupID = '';
    aceID = '';
    aciID = '';
    vehicleColor = '';
    bodyType = '';
    bodySubType = '';
    msrp = '';
    inspectionFormID = '';
    lifeCycle = {
        inServiceDate: '',
        inServiceOdometer: 0,
        estimatedServiceMonths: 0,
        estimatedServiceMiles: 0,
        estimatedResaleValue: '',
        outOfServiceDate: '',
        outOfServiceOdometer: 0,
        startDate: '',
        estimatedServiceYear: ''
    };
    specifications = {
        height: 0,
        heightUnit: '',
        length: 0,
        lengthUnit: '',
        width: 0,
        widthUnit: '',
        interiorVolume: '',
        passangerVolume: '',
        groundClearnce: 0,
        groundClearnceUnit: '',
        bedLength: 0,
        bedLengthUnit: '',
        cargoVolume: '',
        curbWeight: '',
        grossVehicleWeightRating: '',
        towingCapacity: '',
        maxPayload: '',
        EPACity: 0,
        EPACombined: 0,
        EPAHighway: 0,
        tareWeight: ''
    };
    insurance = {
        dateOfIssue: '',
        premiumAmount: 0,
        premiumCurrency: '',
        vendorID: '',
        dateOfExpiry: '',
        remiderEvery: '',
        policyNumber: '',
        amount: 0,
        amountCurrency: '',
        reminder: ''
    };
    fluid = {
        fuelType: '',
        fuelTankOneCapacity: 0,
        fuelQuality: '',
        fuelTankTwoCapacity: 0,
        oilCapacity: 0,
        fuelTankOneType: '',
        fuelTankTwoType: '',
        oilCapacityType: '',
        defType: '',
        def: ''
    };
    wheelsAndTyres = {
        numberOfTyres: 0,
        driveType: '',
        brakeSystem: '',
        wheelbase: '',
        rearAxle: '',
        frontTyreType: '',
        rearTyreType: '',
        frontTrackWidth: '',
        rearTrackWidth: '',
        frontWheelDiameter: '',
        rearWheelDiameter: '',
        frontTyrePSI: '',
        rearTyrePSI: '',
    };
    engine = {
        engineSummary: '',
        engineBrand: '',
        aspiration: '',
        blockType: '',
        bore: 0,
        camType: '',
        stroke: '',
        valves: '',
        compression: '',
        cylinders: '',
        displacement: '',
        fuelIndication: '',
        fuelQuality: '',
        maxHP: '',
        maxTorque: 0,
        readlineRPM: '',
        transmissionSummary: '',
        transmissionType: '',
        transmissonBrand: '',
        transmissionGears: '',
    };
    purchase = {
        purchaseVendorID: '',
        warrantyExpirationDate: '',
        purchasePrice: '',
        purchasePriceCurrency: '',
        warrantyExpirationMeter: '',
        purchaseDate: '',
        purchaseComments: '',
        purchaseOdometer: '',
        gstInc: false,
    };
    loan = {
        loanVendorID: '',
        amountOfLoan: '',
        amountOfLoanCurrency: '',
        aspiration: '',
        annualPercentageRate: '',
        downPayment: '',
        downPaymentCurrency: '',
        dateOfLoan: '',
        monthlyPayment: '',
        monthlyPaymentCurrency: '',
        firstPaymentDate: '',
        numberOfPayments: '',
        loadEndDate: '',
        accountNumber: '',
        generateExpenses: '',
        notes: '',
        loanDueDate: '',
        lReminder: false,
        gstInc: false,
    };
    settings = {
        primaryMeter: 'miles',
        fuelUnit: 'gallons(USA)',
        hardBreakingParams: 0,
        hardAccelrationParams: 0,
        turningParams: 0,
        measurmentUnit: 'imperial',
    };

    issues = [];
    reminders = [];
    serviceReminders = [];
    renewalReminders = [];
    inspectionForms = {
        inspectionFormName: '',
        parameters: [],
        isDefaultInspectionType: '0',
        inspectionType: ''
    };
    fuelEntries = [];
    documents = [];
    servicePrograms = [];
    serviceHistory = [];
    devices = [];
    fuelTypes = {};

    slideConfig = {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
    };
    hosVehicleId = 0
    vehicleObj = {}


    contactsObjects: any = {};
    vehicleTypeObects: any = {};
    ownerOperatorName = '';
    pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');
    tasksList = [];
    usersList = [];
    countryName = '';
    stateName = '';
    vehicleLogs = [];
    groupsObjects: any = {};
    groupName: any = '';
    groupId: any = '';
    stateCode = ''
    deviceInfo = {
        deviceType: '',
        deviceId: '',
        deviceSrNo: '',
        email: ''
    }
    uploadedPhotos = [];
    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private httpClient: HttpClient,
        private domSanitizer: DomSanitizer,
        private countryStateCity: CountryStateCityService,
        private modalService: NgbModal,
        private formBuilder: RxFormBuilder,
        private routerMgmtService: RouteManagementServiceService,
        private eldService: ELDService,
        private messageService: MessageService,
        private util: DashboardUtilityService
    ) {
        this.sessionID = this.routerMgmtService.vehicleUpdateSessionID;
    }

    ngOnInit() {
        ReactiveFormConfig.set({
            'validationMessage': {
                "required": "This field is required",
                "email": "Email is invalid."
            }
        })


        this.vehicleID = this.route.snapshot.params['vehicleID'];
        this.getVehicle();
        this.fetchIssues();
        this.fetchReminders();
        this.fetchDriversList();
        // this.fetchVehicleModelList();
        // this.fetchVehicleManufacturerList();
        this.fetchGroupsList();
        this.fetchTasksList();
        this.fetchUsersList();
        this.fetchVehicleLogs();
        this.fetchContactsByIDs();
        this.httpClient.get('assets/vehicleType.json').subscribe((data: any) => {
            this.vehicleTypeObects = data.reduce((a: any, b: any) => {
                return a[b[`code`]] = b[`name`], a;
            }, {});
        });
        this.fetchGroups();
    }

    fetchContactsByIDs() {
        this.apiService.getData('contacts/get/list').subscribe((result: any) => {
            this.contactsObjects = result;
        });
    }
    fetchGroupsList() {
        this.apiService.getData("groups/get/list").subscribe((result: any) => {
            this.groupsList = result;
        });
    }

    fetchTasksList() {
        this.apiService.getData("tasks/get/list").subscribe((result: any) => {
            this.tasksList = result;
        });
    }

    fetchDriversList() {
        this.apiService.getData("drivers/get/list").subscribe((result: any) => {
            this.driversList = result;
        });
    }

    fetchUsersList() {
        this.apiService.getData("common/users/get/list").subscribe((result: any) => {
            this.usersList = result;
        });
    }

    fetchVehicleModelList() {
        this.apiService
            .getData("vehicleModels/get/list")
            .subscribe((result: any) => {
                this.vehicleModelList = result;
            });
    }
    fetchVehicleManufacturerList() {
        this.apiService
            .getData("manufacturers/get/list")
            .subscribe((result: any) => {
                this.vehicleManufacturersList = result;
            });
    }

    closeIssue(issueID) {
        this.apiService
            .getData(`issues/setStatus/${issueID}/CLOSE`)
            .subscribe((result) => {
                this.fetchIssues();
            });
    }

    fetchReminders() {
        this.apiService
            .getData(`reminders/vehicle/${this.vehicleID}`)
            .subscribe((result) => {
                this.reminders = result.Items;
                for (let i = 0; i < this.reminders.length; i++) {
                    const element = this.reminders[i];
                    if (element.type == 'service') {
                        this.serviceReminders.push(element);
                    } else {
                        this.renewalReminders.push(element);
                    }
                }
            });
    }

    fetchIssues() {
        this.apiService
            .getData(`issues/vehicle/${this.vehicleID}`)
            .subscribe((result) => {
                result.Items.map(elem => {
                    if (elem.currentStatus == 'OPEN') {
                        this.issues.push(elem);
                    }
                })
            });
    }

    getVehicle() {
        this.apiService
            .getData("vehicles/" + this.vehicleID)
            .subscribe(async (vehicleResult: any) => {
                vehicleResult = vehicleResult.Items[0];

                this.hosVehicleId = vehicleResult.hosVehicleId
                this.stateCode = vehicleResult.stateID;

                // Check if DashCam is added to enable Share Live location button
                if (vehicleResult.deviceInfo && vehicleResult.deviceInfo.length > 0) {
                    for (const device of vehicleResult.deviceInfo) {
                        if (device.deviceType === "DashCam") {
                            this.deviceInfo.deviceId = device.deviceId;
                            this.deviceInfo.deviceSrNo = device.deviceSrNo;
                            this.deviceInfo.deviceType = device.deviceType;

                        }
                    }
                }


                this.ownerOperatorName = vehicleResult.ownerOperatorID;
                if (vehicleResult.inspectionFormID != '' && vehicleResult.inspectionFormID != undefined) {
                    this.apiService.getData(`inspectionForms/${vehicleResult.inspectionFormID}`).subscribe((result1: any) => {
                        if (result1.Items.length > 0) {
                            if (result1.Items[0].isDefaultInspectionType === undefined) {
                                result1.Items[0].isDefaultInspectionType = '0';
                            }
                            this.inspectionForms = result1.Items[0];
                        }
                    });
                }
                this.annualSafetyDate = vehicleResult.annualSafetyDate;
                this.vehicleIdentification = vehicleResult.vehicleIdentification;
                this.vehicleType = vehicleResult.vehicleType;
                this.VIN = vehicleResult.VIN;
                this.year = vehicleResult.year;
                this.manufacturerID = vehicleResult.manufacturerID;
                this.modelID = vehicleResult.modelID;
                this.plateNumber = vehicleResult.plateNumber;
                this.countryName = vehicleResult.countryID ? await this.countryStateCity.GetSpecificCountryNameByCode(vehicleResult.countryID) : '';
                this.stateName = vehicleResult.stateID ? await this.countryStateCity.GetStateNameFromCode(vehicleResult.stateID, vehicleResult.countryID) : '';
                this.driverID = vehicleResult.driverID;
                this.teamDriverID = vehicleResult.teamDriverID;
                this.serviceProgramID = vehicleResult.servicePrograms;
                this.fetchProgramDetails();
                this.primaryMeter = vehicleResult.primaryMeter;
                this.repeatByTime = vehicleResult.repeatByTime;
                this.repeatByTimeUnit = vehicleResult.repeatByTimeUnit;
                this.reapeatbyOdometerMiles = vehicleResult.reapeatbyOdometerMiles;
                this.currentStatus = vehicleResult.currentStatus;
                this.ownership = vehicleResult.ownership;
                this.groupId = vehicleResult.groupID;
                this.aceID = vehicleResult.aceID;
                this.aciID = vehicleResult.aciID;
                this.vehicleColor = vehicleResult.vehicleColor;
                this.bodyType = vehicleResult.bodyType;
                this.bodySubType = vehicleResult.bodySubType;
                this.msrp = vehicleResult.msrp;
                this.inspectionFormID = vehicleResult.inspectionFormID;
                this.iftaReporting = vehicleResult.iftaReporting;
                this.lifeCycle = {
                    inServiceDate: vehicleResult.lifeCycle.inServiceDate,
                    inServiceOdometer: vehicleResult.lifeCycle.inServiceOdometer,
                    estimatedServiceMonths: vehicleResult.lifeCycle.estimatedServiceMonths,
                    estimatedServiceMiles: vehicleResult.lifeCycle.estimatedServiceMiles,
                    estimatedResaleValue: vehicleResult.lifeCycle.estimatedResaleValue,
                    outOfServiceDate: vehicleResult.lifeCycle.outOfServiceDate,
                    outOfServiceOdometer: vehicleResult.lifeCycle.outOfServiceOdometer,
                    startDate: vehicleResult.lifeCycle.startDate,
                    estimatedServiceYear: vehicleResult.lifeCycle.estimatedServiceYears,
                };
                this.specifications = {
                    height: vehicleResult.specifications.height,
                    heightUnit: vehicleResult.specifications.heightUnit,
                    width: vehicleResult.specifications.width,
                    widthUnit: vehicleResult.specifications.widthUnit,
                    length: vehicleResult.specifications.length,
                    lengthUnit: vehicleResult.specifications.lengthUnit,
                    interiorVolume: vehicleResult.specifications.interiorVolume,
                    passangerVolume: vehicleResult.specifications.passangerVolume,
                    groundClearnce: vehicleResult.specifications.groundClearnce,
                    groundClearnceUnit: vehicleResult.specifications.groundClearnceUnit,
                    bedLength: vehicleResult.specifications.bedLength,
                    bedLengthUnit: vehicleResult.specifications.bedLengthUnit,
                    cargoVolume: vehicleResult.specifications.cargoVolume,
                    curbWeight: vehicleResult.specifications.curbWeight,
                    grossVehicleWeightRating: vehicleResult.specifications.grossVehicleWeightRating,
                    towingCapacity: vehicleResult.specifications.towingCapacity,
                    maxPayload: vehicleResult.specifications.maxPayload,
                    EPACity: vehicleResult.specifications.EPACity,
                    EPACombined: vehicleResult.specifications.EPACombined,
                    EPAHighway: vehicleResult.specifications.EPAHighway,
                    tareWeight: vehicleResult.specifications.tareWeight,
                };
                if (vehicleResult.insurance.remiderEvery === 'weekly') {
                    vehicleResult.insurance.remiderEvery = 'Week(s)';
                } else if (vehicleResult.insurance.remiderEvery === 'monthly') {
                    vehicleResult.insurance.remiderEvery = 'Month(s)';
                } else if (vehicleResult.insurance.remiderEvery === 'yearly') {
                    vehicleResult.insurance.remiderEvery = 'Year(s)';
                }
                this.insurance = {
                    dateOfIssue: vehicleResult.insurance.dateOfIssue,
                    premiumAmount: vehicleResult.insurance.premiumAmount,
                    premiumCurrency: vehicleResult.insurance.premiumCurrency,
                    vendorID: vehicleResult.insurance.vendorID,
                    dateOfExpiry: vehicleResult.insurance.dateOfExpiry,
                    reminder: `${vehicleResult.insurance.reminder}`,
                    remiderEvery: `${vehicleResult.insurance.remiderEvery}`,
                    policyNumber: vehicleResult.insurance.policyNumber,
                    amount: vehicleResult.insurance.amount,
                    amountCurrency: vehicleResult.insurance.amountCurrency,
                };
                this.fluid = {
                    fuelType: vehicleResult.fluid.fuelType,
                    fuelTankOneCapacity: vehicleResult.fluid.fuelTankOneCapacity,
                    fuelTankOneType: vehicleResult.fluid.fuelTankOneType,
                    fuelQuality: vehicleResult.fluid.fuelQuality,
                    fuelTankTwoType: vehicleResult.fluid.fuelTankTwoType,
                    fuelTankTwoCapacity: vehicleResult.fluid.fuelTankTwoCapacity,
                    oilCapacity: vehicleResult.fluid.oilCapacity,
                    oilCapacityType: vehicleResult.fluid.oilCapacityType,
                    defType: vehicleResult.fluid.defType,
                    def: vehicleResult.fluid.def
                };
                this.wheelsAndTyres = {
                    numberOfTyres: vehicleResult.wheelsAndTyres.numberOfTyres,
                    driveType: vehicleResult.wheelsAndTyres.driveType,
                    brakeSystem: vehicleResult.wheelsAndTyres.brakeSystem,
                    wheelbase: vehicleResult.wheelsAndTyres.wheelbase,
                    rearAxle: vehicleResult.wheelsAndTyres.rearAxle,
                    frontTyreType: vehicleResult.wheelsAndTyres.frontTyreType,
                    rearTyreType: vehicleResult.wheelsAndTyres.rearTyreType,
                    frontTrackWidth: vehicleResult.wheelsAndTyres.frontTrackWidth,
                    rearTrackWidth: vehicleResult.wheelsAndTyres.rearTrackWidth,
                    frontWheelDiameter: vehicleResult.wheelsAndTyres.frontWheelDiameter,
                    rearWheelDiameter: vehicleResult.wheelsAndTyres.rearWheelDiameter,
                    frontTyrePSI: vehicleResult.wheelsAndTyres.frontTyrePSI,
                    rearTyrePSI: vehicleResult.wheelsAndTyres.rearTyrePSI,
                };
                this.engine = {
                    engineSummary: vehicleResult.engine.engineSummary,
                    engineBrand: vehicleResult.engine.engineBrand,
                    aspiration: vehicleResult.engine.aspiration,
                    blockType: vehicleResult.engine.blockType,
                    bore: vehicleResult.engine.bore,
                    camType: vehicleResult.engine.camType,
                    stroke: vehicleResult.engine.stroke,
                    valves: vehicleResult.engine.valves,
                    compression: vehicleResult.engine.compression,
                    cylinders: vehicleResult.engine.cylinders,
                    displacement: vehicleResult.engine.displacement,
                    fuelIndication: vehicleResult.engine.fuelIndication,
                    fuelQuality: vehicleResult.engine.fuelQuality,
                    maxHP: vehicleResult.engine.maxHP,
                    maxTorque: vehicleResult.engine.maxTorque,
                    readlineRPM: vehicleResult.engine.readlineRPM,
                    transmissionSummary: vehicleResult.engine.transmissionSummary,
                    transmissionType: vehicleResult.engine.transmissionType,
                    transmissonBrand: vehicleResult.engine.transmissonBrand,
                    transmissionGears: vehicleResult.engine.transmissionGears,
                };
                this.purchase = {
                    purchaseVendorID: vehicleResult.purchase.purchaseVendorID,
                    warrantyExpirationDate: vehicleResult.purchase.warrantyExpirationDate,
                    purchasePrice: vehicleResult.purchase.purchasePrice,
                    purchasePriceCurrency: vehicleResult.purchase.purchasePriceCurrency,
                    warrantyExpirationMeter: vehicleResult.purchase.warrantyExpirationMeter,
                    purchaseDate: vehicleResult.purchase.purchaseDate,
                    purchaseComments: vehicleResult.purchase.purchaseComments,
                    purchaseOdometer: vehicleResult.purchase.purchaseOdometer,
                    gstInc: vehicleResult.purchase.gstInc
                };
                this.loan = {
                    loanVendorID: vehicleResult.loan.loanVendorID,
                    amountOfLoan: vehicleResult.loan.amountOfLoan,
                    amountOfLoanCurrency: vehicleResult.loan.amountOfLoanCurrency,
                    aspiration: vehicleResult.loan.aspiration,
                    annualPercentageRate: vehicleResult.loan.annualPercentageRate,
                    downPayment: vehicleResult.loan.downPayment,
                    downPaymentCurrency: vehicleResult.loan.downPaymentCurrency,
                    monthlyPaymentCurrency: vehicleResult.loan.monthlyPaymentCurrency,
                    dateOfLoan: vehicleResult.loan.dateOfLoan,
                    monthlyPayment: vehicleResult.loan.monthlyPayment,
                    firstPaymentDate: vehicleResult.loan.firstPaymentDate,
                    numberOfPayments: vehicleResult.loan.numberOfPayments,
                    loadEndDate: vehicleResult.loan.loadEndDate,
                    accountNumber: vehicleResult.loan.accountNumber,
                    generateExpenses: vehicleResult.loan.generateExpenses,
                    loanDueDate: vehicleResult.loan.loanDueDate,
                    lReminder: vehicleResult.loan.lReminder,
                    gstInc: vehicleResult.loan.gstInc,
                    notes: vehicleResult.loan.notes,
                };
                this.settings = {
                    primaryMeter: vehicleResult.settings.primaryMeter,
                    fuelUnit: vehicleResult.settings.fuelUnit,
                    hardBreakingParams: vehicleResult.settings.hardBreakingParams,
                    hardAccelrationParams: vehicleResult.settings.hardAccelrationParams,
                    turningParams: vehicleResult.settings.turningParams,
                    measurmentUnit: vehicleResult.settings.measurmentUnit,
                };
                this.uploadedPhotos = vehicleResult.uploadedPhotos;

                //AWS S3
                this.slides = vehicleResult.uploadedPics;
                this.pDocs = vehicleResult.purchaseDocsUpload;
                this.lDocs = vehicleResult.loanDocsUpload;
                this.docs = vehicleResult.uploadDocument;

                this.fetchGroups();
            });
    }

    deleteVehicle() {
        this.apiService
            .deleteData("vehicles/" + this.vehicleID)
            .subscribe((result: any) => {
                this.showVehDltMess();
                this.router.navigateByUrl("/fleet/vehicles/list");
            });
    }

    setPDFSrc(val) {
        let pieces = val.split(/[\s.]+/);
        let ext = pieces[pieces.length - 1];
        this.pdfSrc = '';
        if (ext == 'doc' || ext == 'docx' || ext == 'xlsx' || ext == 'pdf') {
            this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
        } else {
            this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
        }
    }

    deleteDocument(value: string, name: string, index: string) {
        this.apiService.deleteData(`vehicles/uploadDelete/${this.vehicleID}/${value}/${name}`).subscribe((result: any) => {
            if(value == 'image') {
                this.slides = [];
                this.uploadedDocs = result.Attributes.uploadedPhotos;
                this.existingDocs = result.Attributes.uploadedPhotos;
                result.Attributes.uploadedPhotos.map((x) => {
                    let obj = {
                        name: x,
                        path: `${this.Asseturl}/${result.carrierID}/${x}`
                    }
                    this.slides.push(obj);
                })
            }
            else if (value == 'doc') {
                this.docs = [];
                this.uploadedDocs = result.Attributes.uploadedDocs;
                this.existingDocs = result.Attributes.uploadedDocs;
                result.Attributes.uploadedDocs.map((x) => {
                    let obj = {
                        name: x,
                        path: `${this.Asseturl}/${result.carrierID}/${x}`
                    }
                    this.docs.push(obj);
                })
            } else if (value == 'loan') {
                this.lDocs = [];

                this.uploadedDocs = result.Attributes.loanDocs;
                this.existingDocs = result.Attributes.loanDocs;
                result.Attributes.loanDocs.map((x) => {
                    let obj = {
                        name: x,
                        path: `${this.Asseturl}/${result.carrierID}/${x}`
                    }
                    this.lDocs.push(obj);
                })
            } else {
                this.pDocs = [];
                this.uploadedDocs = result.Attributes.purchaseDocs;
                this.existingDocs = result.Attributes.purchaseDocs;
                result.Attributes.purchaseDocs.map((x) => {
                    let obj = {
                        name: x,
                        path: `${this.Asseturl}/${result.carrierID}/${x}`
                    }
                    this.pDocs.push(obj);
                })
            }

        });
    }

    fetchProgramDetails() {
        if (this.serviceProgramID.length > 0) {
            let serviceProgramID = JSON.stringify(this.serviceProgramID);
            this.apiService.getData('servicePrograms/get/list?programID=' + serviceProgramID).subscribe((result: any) => {
                this.servicePrograms = result;

            })
        }
    }

    fetchVehicleLogs() {
        this.apiService.getData(`auditLogs/details/${this.vehicleID}`).subscribe((res: any) => {
            this.vehicleLogs = res.Items;
            if (this.vehicleLogs.length > 0) {
                this.vehicleLogs.map((a) => {
                    a.dateAndTime = `${a.createdDate} ${a.createTime}`;
                    if (a.eventParams.userName !== undefined) {
                        const newString = a.eventParams.userName.split("_");
                        a.userFirstName = newString[0];
                        a.userLastName = newString[1];
                    }
                    if (a.eventParams.name !== undefined) {
                        a.entityNumber = a.eventParams.name;
                    }
                    if (a.eventParams.name !== undefined) {
                        if (a.eventParams.name.includes("_")) {
                            const newString = a.eventParams.name.split("_");
                            a.firstName = newString[0];
                            a.lastName = newString[1];
                        }
                    }
                });
                this.vehicleLogs.sort((c, d) => {
                    return (new Date(d.dateAndTime).valueOf() -
                        new Date(c.dateAndTime).valueOf()
                    );
                })
            }
        })
    }

    locationDetails() {
        this.router.navigate([`/fleet/tracking/vehicle-dash-cam-tracker/${this.deviceInfo.deviceSrNo.split('#')[1]}`],
            { queryParams: { vehicleId: this.vehicleID } });
    }

    fetchGroups() {
        if (this.groupId !== '') {
            this.apiService.getData(`groups/get/list?type=vehicles&groupId=${this.groupId}`).subscribe((result: any) => {
                this.groupsObjects = result;
            });
        }
    }

    updateEldVehicle() {
        console.log('this.hosVehicleId-starting',this.hosVehicleId)
        if(this.hosVehicleId != 0){
            console.log('this.hosVehicleId-if',this.hosVehicleId)
            this.vehicleObj = {
                FhIdentifier: this.vehicleID,
                AssetId : 0,
                Number: this.vehicleIdentification,
                HOSHomeBaseId: '18',
                VIN: this.VIN,
                Plate: this.plateNumber,
                RegistrationState: this.stateCode,
                Type: '0',
                Active: '1'
    
            }
        }
      
        this.eldService.postData("assets", {
            Asset: this.vehicleObj
        }).subscribe(
            result => {
                this.showSuccess();
               this.getVehicle();
            },
            error => {
                console.log('error', error)
                this.showError(error);
            });
           
        }
       


    showError(error: any) {
        this.messageService.add({
            severity: 'error', summary: 'Error',
            detail: error.error.message
        });
    }

    showSuccess() {
        this.messageService.add({severity:'success',
         summary: 'Success', detail: 'Vehicle added successfully in ELD'});
    }

    showVehDltMess() {
        this.messageService.add({severity:'success',
         summary: 'Success', detail: 'Vehicle Deleted Successfully'});
    }

}
