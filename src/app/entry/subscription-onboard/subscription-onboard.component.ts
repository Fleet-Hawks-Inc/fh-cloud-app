import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { alphaAsync, compare, numericAsync, password, pattern, prop, ReactiveFormConfig, required, RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Auth } from 'aws-amplify';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services';

@Component({
  selector: 'app-subscription-onboard',
  templateUrl: './subscription-onboard.component.html',
  styleUrls: ['./subscription-onboard.component.css']
})
export class SubscriptionOnboardComponent implements OnInit {
  userVerificationFormGroup: FormGroup;
  verificationInfo: VerificationInfo;
  userInfo: UserInfo;
  userInfoFormGroup: FormGroup
  userNameExists: boolean = false;
  userErrorMessage: string;
  subCustomerID: string;
  verificationCode: string;
  otpSubmitDisabled: boolean = true;
  otpCode: string;
  showVerification: boolean = false;
  fieldTextType: boolean;
  fieldTextType1: boolean;

  /**
   * Constructor
   * @param apiService 
   * @param route 
   * @param formBuilder 
   * @param toaster 
   * @param router 
   */
  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private formBuilder: RxFormBuilder,
    private toaster: ToastrService,
    private router: Router,
  ) {
    this.subCustomerID = this.route.snapshot.params.id;

    ReactiveFormConfig.set({
      'validationMessage': {
        "required": "This field is required",
        "email": "Email is invalid.",
        "compare": "Passwords does not match."
      }
    })
  }

  async ngOnInit() {
    this.userInfo = new UserInfo();
    this.verificationInfo = new VerificationInfo();
    const response = await this.apiService.getData(`carriers/getSubCarrier/${this.subCustomerID}`).toPromise();
    this.userInfo.email = response.email;
    this.userVerificationFormGroup = this.formBuilder.formGroup(this.verificationInfo);
    this.userInfoFormGroup = this.formBuilder.formGroup(this.userInfo);




  }
  async onFocusOutEvent(event: any) {

    await this.apiService.getData(`carriers/getSubCarrier/${this.subCustomerID}`).toPromise();

    const response = this.apiService.postData(`carriers/checkUser`, { userName: this.userInfo.username })
      .subscribe((data) => {

        this.userNameExists = false;
      }, (error) => {

        if (error.error && error.error.errorMessage) {
          this.userErrorMessage = error.error.errorMessage;
        }
        this.userNameExists = true;
      })

  }
  async register() {
    const data = {
      email: this.userInfo.email,
      password: this.userInfo.password,
      userName: this.userInfo.username,
    }
    const response: any = await this.apiService.postData('carriers/subRegister', data).subscribe((data) => {

      this.toaster.info('User Registered successfully!');
      this.showVerification = true;
    }, (error) => {

      this.toaster.error('Unable register user.')
    })

  }
  async confirmSignUp() {
    try {
      const response = await Auth.confirmSignUp(this.userInfo.username, this.otpCode);
      this.toaster.info("Thanks for confirming your email.")
      this.router.navigate(['/Login']);
    } catch (error) {
      if (error && error.message.includes('Current status is CONFIRMED')) {
        this.toaster.info("Your email is already verified.")
        this.router.navigate(['/Login']);
        return;
      }
      if (error && error.message) {
        this.toaster.error(error.message);
      } else {
        this.toaster.error("There was error confirming user.")
      }
    }
  }

  // Show password
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }


  async resendConfirmationCode() {
    try {
      await Auth.resendSignUp(this.userInfo.username);
      this.toaster.info("Verification code sent to your email successfully.")
    } catch (error) {

      if (error && error.message) {
        this.toaster.error(error.message);
      } else {
        this.toaster.error("Error sending code.Please try again.")
      }
    }
  }


  onOtpChange(code: any) {

    if (code.length === 6) {
      this.otpSubmitDisabled = false;
      this.otpCode = code;
    } else {
      this.otpSubmitDisabled = true;
    }
  }

}



class UserInfo {
  @required()
  @pattern({
    expression: { 'onlyAlpha': /^(?=[a-zA-Z0-9.]{6,20}$)(?!.*[.]{2})[^.].*[^.]$/ }, message: "Username should be at-least 6 characters long and can be a combination of numbers, letters  and dot(.)."
  })
  username: string;

  @required()
  @prop()
  email: string;

  @required()
  @prop()
  @password({ validation: { maxLength: 15, minLength: 8, upperCase: true, digit: true, alphabet: true, specialCharacter: true }, message: "Password must be of length 8 or more with combination of uppercase, lowercase, numbers & special characters." })
  password: string;

  @required()
  @compare({ fieldName: 'password', message: "Password does not match." })
  confirmPassword: string;


}

class VerificationInfo {

  @prop()
  @required({ message: "Verification code cannot be blank." })
  @numericAsync({ message: "Only numbers allowed.", allowDecimal: false })
  verificationCode: string;


}
