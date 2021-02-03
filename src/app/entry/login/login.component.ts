import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../services';
import {AuthService} from '../../services';
import {Role, User} from '../../models/objects';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName: string;
  email: string;
  password: string;
  response: any = '';
  hasError  = false;
  Error = '';
  showSigupCode = true;
  signUpCode = '';
  error  = '';

  vehicle = {
    vehicleIdentification: '',
    vehicleType: '',
    VIN: '',
    DOT: '',
    year: '',
    manufacturerID: '',
    modelID: '',
    plateNumber: '',
    countryID: '',
    stateID: '',
    driverID: '',
    teamDriverID: '',
    serviceProgramID: '',
    repeatByTime: '',
    repeatByTimeUnit: '',
    reapeatbyOdometerMiles: '',
    annualSafetyDate: '',
    annualSafetyReminder: false,
    currentStatus: '',
    ownership: '',
    ownerOperator: '',
    groupID: '',
    aceID: '',
    aciID: '',
    iftaReporting: false,
    vehicleColor: '',
    bodyType: '',
    bodySubType: '',
    msrp: '',
    inspectionFormID: '',
    lifeCycle: {
      inServiceDate: '',
      startDate: '',
      inServiceOdometer: '',
      estimatedServiceYears: '',
      estimatedServiceMonths: '',
      estimatedServiceMiles: '',
      estimatedResaleValue: '',
      outOfServiceDate: '',
      outOfServiceOdometer: '',
    },
    specifications: {
      height: '',
      heightUnit: 'Centimeters',
      length: '',
      lengthUnit: '',
      width: '',
      widthUnit: '',
      interiorVolume: '',
      passangerVolume: '',
      groundClearnce: '',
      groundClearnceUnit: 'Centimeters',
      bedLength: '',
      bedLengthUnit: '',
      cargoVolume: '',
      tareWeight: '',
      grossVehicleWeightRating: '',
      towingCapacity: '',
      maxPayload: '',
      EPACity: '',
      EPACombined: '',
      EPAHighway: '',
    },
    insurance: {
      dateOfIssue: '',
      premiumAmount: '',
      premiumCurrency: 'CAD',
      vendorID: '',
      dateOfExpiry: '',
      reminder: '',
      remiderEvery: '',
      policyNumber: '',
      amount: 0,
      amountCurrency: 'CAD'
    },
    fluid: {
      fuelType: '',
      fuelTankOneCapacity: '',
      fuelTankOneType: 'Liters',
      fuelQuality: '',
      fuelTankTwoCapacity: '',
      fuelTankTwoType: 'Liters',
      oilCapacity: '',
      oilCapacityType: 'Liters',
      def: '',
      defType: 'Liters'
    },
    wheelsAndTyres: {
      numberOfTyres: '',
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
    },
    engine: {
      engineSummary: '',
      engineBrand: '',
      aspiration: '',
      blockType: '',
      bore: '',
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
    },
    purchase: {
      purchaseVendorID: '',
      warrantyExpirationDate: '',
      purchasePrice: '',
      purchasePriceCurrency: 'CAD',
      warrantyExpirationMeter: '',
      purchaseDate: '',
      purchaseComments: '',
      purchaseOdometer: '',
    },
    loan: {
      loanVendorID: '',
      amountOfLoan: '',
      amountOfLoanCurrency: 'CAD',
      aspiration: '',
      annualPercentageRate: '',
      downPayment: '',
      downPaymentCurrency: 'CAD',
      dateOfLoan: '',
      monthlyPayment: '',
      monthlyPaymentCurrency: 'CAD',
      firstPaymentDate: '',
      numberOfPayments: '',
      loadEndDate: '',
      accountNumber: '',
      generateExpenses: '',
      notes: '',
    },
    settings: {
      primaryMeter: 'miles',
      fuelUnit: 'gallons(CA)',
      hardBreakingParams: 0,
      hardAccelrationParams: 0,
      turningParams: 0,
      measurmentUnit: 'imperial',
    },
  }


  driver = {
    driverType: 'employee',
    entityType: 'driver',
    employeeId: '',
    // ownerOperator: '',
    driverStatus: '',
    userName: '',
    firstName: '',
    middleName: '',
    lastName: '',
    startDate: '',
    terminationDate: '',
    //contractStart: '',
    //contractEnd: '',
    password: '',
    confirmPassword: '',
    citizenship: '',
    assignedVehicle: '',
    groupID: '',
    abstractDocs: [],
    driverImage: '',
    gender: 'M',
    DOB: '',
    workPhone: '',
    workEmail: '',
    address: [{
      addressType: '',
      userLocation: '',
      countryID: '',
      countryName: '',
      stateID: '',
      stateName: '',
      cityID: '',
      cityName: '',
      zipCode: '',
      address1: '',
      address2: '',
      geoCords : {
        lat: null,
        lng: null
      },
      manual: false,
    }],
    documentDetails: [{
      documentType: '',
      document: '',
      issuingAuthority: '',
      issuingCountry: '',
      issuingState: '',
      issueDate: '',
      expiryDate: '',
      uploadedDocs: [],
    }],
    crossBorderDetails: {
      ACI_ID: '',
      ACE_ID: '',
      fast_ID: '',
      fastExpiry: '',
      csa: false,
    },
    paymentDetails: {
      paymentType: '',
      loadedMiles: '',
      loadedMilesTeam: '',
      loadedMilesUnit: '',
      loadedMilesTeamUnit: '',
      emptyMiles: '',
      emptyMilesTeam: '',
      emptyMilesUnit: '',
      emptyMilesTeamUnit: '',
      loadPayPercentage: '',
      loadPayPercentageOf: '',
      rate: '',
      rateUnit: '',
      waitingPay: '',
      waitingPayUnit: '',
      waitingHourAfter: '',
      deliveryRate: '',
      deliveryRateUnit: '',
      SIN_Number: '',
      payPeriod: '',
    },
    licenceDetails: {
      CDL_Number: '',
      issuedCountry: '',
      issuedState: '',
      licenceExpiry: '',
      licenceNotification: false,
      WCB: '',
      medicalCardRenewal: '',
      healthCare: '',
      vehicleType: '',
    },
    hosDetails: {
      hosStatus: '',
      type: '',
      hosRemarks: '',
      hosCycle: '',
      homeTerminal: '',
      pcAllowed: false, 
      ymAllowed: false,
    },
    emergencyDetails: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
      emergencyAddress: '',
    },
  }

  constructor(private apiService: ApiService,
              private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/Map-Dashboard']);
    }
  }

  LoginAction() {
    this.hasError = false;
    const data = JSON.stringify({'userName': this.email ,
      'password': this.password });
    this.apiService.getJwt('auth', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
        console.log(this.Error);
       // console.log("clickes");
      },
      next: (res) => {
        const user: User =   { id: '1',
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          role: Role.FleetManager };

        this.response = res;
        localStorage.setItem('jwt', this.response.jwt);
        localStorage.setItem('LoggedIn', 'true');
        /************set the role from server **********/
        localStorage.setItem('user', JSON.stringify(user) );
        this.router.navigate(['/Map-Dashboard']);
      }
    });
  }




  /** Cognito user action */
  resendSignUpCode = async () => {
    try {
      await Auth.resendSignUp(this.userName);

    } catch (err) {
      this.hasError = true;
      this.error = `Error occured while sending code ${err}`;
      this.showSigupCode = true;
    }
  }
  /** Cognito user action */
  loginAction1 = async () => {
    try {
      // This should go in Register component
      // await Auth.signUp({
      //   password: this.password,
      //   username: this.userName,
      //   attributes: {
      //     email: 'kunal@fleethawks.com',
      //     phone_number: '+919860766659'
      //   }
      // });
      await Auth.signIn(this.userName, this.password);
      const isActivatedUser = (await Auth.currentSession()).getIdToken().payload;
      // if (!isActivatedUser.carrierID) {
      if (!isActivatedUser.carrierID) {
        this.hasError = true;
        this.Error = 'User has not active devices';

      } else {
        console.log('user logged In');

        /**
         * For the Role Management
         * @type {{id: string; username: string; firstName: string; lastName: string; role: Role}}
         */
        const user: User = {
          id: '1',
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          role: Role.FleetManager
        };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('vehicle', JSON.stringify(this.vehicle));
        localStorage.setItem('driver', JSON.stringify(this.driver));
        


        /**
         * set local and redirect
         **/
        localStorage.setItem('LoggedIn', 'true');
        await this.router.navigate(['/Map-Dashboard']);
      }
    } catch (err) {


      this.hasError = true;
      this.Error = err.message || 'Error during login';
    }

  }
  submitConfirmationCode = async () => {
    if (this.signUpCode !== '') {
      await Auth.verifyCurrentUserAttributeSubmit('email', this.signUpCode);
    } else {
      this.Error = 'Invalid Sigup Code';
    }
  }



}
