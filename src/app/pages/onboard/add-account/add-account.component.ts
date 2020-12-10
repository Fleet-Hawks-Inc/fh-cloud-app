import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import {AwsUploadService} from '../../../services';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {
  carrierID: string;
  activeTab = 1;
  accountData = {
    basic: {
      password: '',
      fleets: {},
      contractPeriod: '',
      uploadedLogo: [],
    },
    address: {
      countryID: '',
      stateID: '',
      cityID: '',
    },
    bank: {
      countryID: '',
    stateID: '',
    cityID: '',
    },
  };
  confirmPassword: string;
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  uploadedDocs = [];
  showAddress = false;
  contractNumber: number;
  contractType: string;
  countries = [];
  states = [];
  cities = [];
  countryID: string;
  stateID: string;
  errors = {};
  onboardForm;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  constructor(private apiService: ApiService, private toaster: ToastrService, private awsUS: AwsUploadService,){ 
             this.selectedFileNames = new Map<any, any>();
             }

  ngOnInit() {
    this.fetchCountries();
  }
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }
  getStates() {
    this.apiService.getData('states/country/' + this.accountData.address.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
  getCities() {
    this.apiService.getData('cities/state/' + this.accountData.address.stateID)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }
  getBankStates() {
    this.apiService.getData('states/country/' + this.accountData.bank.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
  getBankCities() {
    this.apiService.getData('cities/state/' + this.accountData.bank.stateID)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
    }

  setCarrierContractPeriod() {
  this.accountData.basic.contractPeriod = this.contractNumber + this.contractType;
  }
  showAddressControls(){
    this.showAddress = !this.showAddress;
  }
   showValue(accountForm: NgForm){
     console.log(accountForm);
   }
addAccount() {
this.hideErrors();
console.log('account data', this.accountData);
this.apiService.postData('carriers', this.accountData).subscribe({
  complete: () => { },
  error: (err: any) => {
    from(err.error)
      .pipe(
        map((val: any) => {
          val.message = val.message.replace(/".*"/, 'This Field');
          this.errors[val.context.key] = val.message;
        })
      )
      .subscribe({
        complete: () => {
          this.throwErrors();
        },
        error: () => { },
        next: () => { },
      });
  },
  next: (res) => {
    this.response = res;
    this.uploadFiles(); // upload selected files to bucket
    this.toaster.success('Account Added successfully');
  },
});
}
throwErrors() {
  console.log(this.errors);
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
        .remove('label');
    });
  this.errors = {};
}

selectDocuments(event, obj) {
  this.selectedFiles = event.target.files;
  console.log('selected files', this.selectedFiles);
  if (obj === 'uploadedDocs') {
    for (let i = 0; i <= this.selectedFiles.item.length; i++) {
      const randomFileGenerate = this.selectedFiles[i].name.split('.');
      const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;
      this.selectedFileNames.set(fileName, this.selectedFiles[i]);
      this.uploadedDocs.push(fileName);
    }
  } else {
    for (let i = 0; i <= this.selectedFiles.item.length; i++) {
      const randomFileGenerate = this.selectedFiles[i].name.split('.');
      const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;

      this.selectedFileNames.set(fileName, this.selectedFiles[i]);
      this.accountData.basic.uploadedLogo.push(fileName);
    }
  }
  console.log('uploaded photos', this.accountData.basic.uploadedLogo);
}
/*
 * Uploading files which selected
 */
uploadFiles = async () => {
  this.carrierID = await this.apiService.getCarrierID();
  this.selectedFileNames.forEach((fileData: any, fileName: string) => {
    this.awsUS.uploadFile(this.carrierID, fileName, fileData);
  });
}


next(){
  this.activeTab++;
  console.log('active tab',this.activeTab);
}

previous(){
  this.activeTab--;
  console.log('active tab',this.activeTab);
}

changeTab(value){
  this.activeTab = value;
  console.log('active tab',this.activeTab);
}
}
