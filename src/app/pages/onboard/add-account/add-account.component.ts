import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import {map, debounceTime, distinctUntilChanged, switchMap, catchError} from 'rxjs/operators';
import { from, Subject, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import {AwsUploadService} from '../../../services';
import { NgForm } from '@angular/forms';
import { HereMapService } from '../../../services';
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
    address: [{
      addressType: '',
      countryID: '',
      countryName: '',
      stateID: '',
      stateName: '',
      cityID: '',
      cityName: '',
      zipCode: '',
      address1: '',
      address2: '',
      geoCords: {
        lat: '',
        lng: ''
      },
      manual: false
    }],
    bank: {
      countryID: '',
    stateID: '',
    cityID: '',
    },
  };
  accountAddress = {   
    address: [],
  };
  manualAddress: boolean = false;
  public searchTerm = new Subject<string>();
  public searchResults: any;
  userLocation: any;
  statesObject: any;
  countriesObject: any;
  citiesObject: any;
  newAddress = [];
  addressCountries = [];
  deletedAddress = [];
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
  constructor(private apiService: ApiService, private toaster: ToastrService, private awsUS: AwsUploadService,private HereMap: HereMapService,){ 
             this.selectedFileNames = new Map<any, any>();
             }

  ngOnInit() {
    this.fetchCountries();
    this.searchLocation(); // search location on keyup
  }
  /**
   * address
   */
  clearUserLocation(i) {
    this.accountData.address[i]['userLocation'] = '';
    $('div').removeClass('show-search__result');
  }
  manAddress(event, i) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
      this.accountData.address[i]['userLocation'] = '';
    } else {
      $(event.target).closest('.address-item').removeClass('open');
    }
  }
  async getStates(id: any, oid = null) {
    if(oid != null) {
      this.accountData.address[oid].countryName = this.countriesObject[id];
    }

    this.apiService.getData('states/country/' + id)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  async getCities(id: any, oid = null) {
    if(oid != null) {
      this.accountData.address[oid].stateName = this.statesObject[id];
    }
    this.apiService.getData('cities/state/' + id)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }
  addAddress() {
    this.accountData.address.push({
      addressType: '',
      countryID: '',
      countryName: '',
      stateID: '',
      stateName: '',
      cityID: '',
      cityName: '',
      zipCode: '',
      address1: '',
      address2: '',
      geoCords: {
        lat: '',
        lng: ''
      },
      manual: false
    });
  }
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
        this.countries.map(elem => {
          if(elem.countryName == 'Canada' || elem.countryName == 'United States of America') {
            this.addressCountries.push({countryName: elem.countryName, countryID: elem.countryID})    
          }
        })
        
      });
  }
  async fetchCountriesByName(name: string, i) {
    let result = await this.apiService.getData(`countries/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getStates(result.Items[0].countryID, i);
      return result.Items[0].countryID;
    }
    return '';
  }

  async fetchStatesByName(name: string, i) {
    let result = await this.apiService.getData(`states/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getCities(result.Items[0].stateID, i);
      return result.Items[0].stateID;
    }
    return '';
  }

  async fetchCitiesByName(name: string) {
    let result = await this.apiService.getData(`cities/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      return result.Items[0].cityID;
    }
    return '';
  }
  remove(obj, i, addressID = null) {
    if (obj === 'address') {
      if (addressID != null) {
        this.deletedAddress.push(addressID)
      }
      this.accountData.address.splice(i, 1);
    }
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
    public searchLocation() {
      let target;
      this.searchTerm.pipe(
        map((e: any) => {
          $('.map-search__results').hide();
          $(e.target).closest('div').addClass('show-search__result');
          target = e;
          return e.target.value;
        }),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => {
          return this.HereMap.searchEntries(term);
        }),
        catchError((e) => {
          return throwError(e);
        }),
      ).subscribe(res => {
        this.searchResults = res;
      });
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
 // console.log('uploaded photos', this.accountData.basic.uploadedLogo);
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
