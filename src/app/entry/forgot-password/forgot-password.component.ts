import { Component, OnInit } from '@angular/core';
import {Auth} from 'aws-amplify'
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router'
import { passwordStrength } from 'check-password-strength'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public userName:any;
  public isEmailSent=false;
  public verifyCode:any;
  public newPassword;
  public confirmPassword;
  public fieldTextType=false;
  public fieldType=false;
  hasError = false;
  hasSuccess = false;
  submitDisabled=true;
  Error = '';
  Success = '';
  passwordValidation = {
    upperCase: false,
    lowerCase: false,
    number: false,
    specialCharacters: false,
    length: false
  }
  constructor(private toastr: ToastrService,private router: Router) { }

  ngOnInit() {
  }
sendCode(){
  Auth.forgotPassword(this.userName)
  .then(data=>{
    this.toastr.success("Verification Email has sent ")
    this.isEmailSent=true
  }
    )
  .catch(err=>console.log(err))
  }

resetPassword(){
  this.hasError = false;
  this.hasSuccess = false;
  this.submitDisabled = true;
  Auth.forgotPasswordSubmit(this.userName, this.verifyCode, this.newPassword)
    .then(data => {
      this.toastr.success("Password is Succesfully update")
      this.router.navigate(['/Login'])
      
    })
    .catch(err => console.log(err));
}

toggleFieldType(){
  this.fieldType=!this.fieldType
}
toggleFieldTextType() {
  this.fieldTextType = !this.fieldTextType;
}

validatePassword(password) {
  let passwordVerify = passwordStrength(password)
  if (passwordVerify.contains.includes('lowercase')) {
    this.passwordValidation.lowerCase = true;
  } else{
    this.passwordValidation.lowerCase = false;
  }

  if (passwordVerify.contains.includes('uppercase')) {
    this.passwordValidation.upperCase = true;
  } else{
    this.passwordValidation.upperCase = false;
  }
  if (passwordVerify.contains.includes('symbol')) {
    this.passwordValidation.specialCharacters = true;
  } else{
    this.passwordValidation.specialCharacters = false;
  }
  if (passwordVerify.contains.includes('number')) {
    this.passwordValidation.number = true;
  } else{
    this.passwordValidation.number = false;
  }
  if (passwordVerify.length >= 8) {
    this.passwordValidation.length = true
  } else{
    this.passwordValidation.length = false;

  
  }
  if(password.includes('.')|| password.includes('-')){
    this.passwordValidation.specialCharacters = true;
  }


}


}
