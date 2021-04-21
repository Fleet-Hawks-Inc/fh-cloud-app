import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ActivatedRoute } from '@angular/router';
import { HereMapService } from '../../../../services';
import { Location } from '@angular/common';
import { from, Subject, throwError } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  companyID = '';
  carrierID = '';
  bankID = '';
  carriers: any = [];
  companyForm;
  Asseturl = this.apiService.AssetUrl;
  logoSrc  = '';
  CCC = '';
  DBAName = '';
  DOT = '';
  EIN = '';
  MC = '';
  SCAC = '';
  CSA = false;
  CTPAT = false;
  PIP = false;
  cargoInsurance = '';
  email = '';
  userName = '';
  carrierName = '';
  bizCountry = null;
  // carrierBusinessName = '';
  findingWay = '';
  firstName = '';
  lastName = '';
  liabilityInsurance = '';
  password = '';
  confirmPassword = '';
  phone = '';
  uploadedLogo = '';
  fleets = {
    curtainSide: 0,
    dryVans: 0,
    flatbed: 0,
    reefers: 0,
    totalFleets: 0,
    trailers: 0,
    trucks: 0,
  };
  addressDetails = [{
    addressType: 'yard',
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
  }];
  bank: any = {
    branchName: '',
    accountNumber: '',
    transitNumber: '',
    routingNumber: '',
    institutionNumber: '',
  };
  public searchTerm = new Subject<string>();
  public searchResults: any;
  userLocation: any;
  bankLocation: any;
  statesObject: any = {};
  countriesObject: any = {};
  citiesObject: any = {};
  newAddress = [];
  addressCountries = [];
  deletedAddress = [];
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  uploadedPhotos = [];
  showAddress = false;
  countries = [];
  states = [];
  cities = [];
  errors = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  existingPhotos = [];
   // front end validation
   errorEIN = false;
   errorMC = false;
   errorDOT = false;
   errorCCC =  false;
   errorSCAC = false;
   errorRouting = false;
   errorTransit = false;
   errorInstitution = false;
   errorAccount = false;
  constructor(private apiService: ApiService,private toaster: ToastrService, private route: ActivatedRoute, private location: Location, private HereMap: HereMapService) {
    this.selectedFileNames = new Map<any, any>();
  }

  ngOnInit() {
    this.fetchCountries();
    this.searchLocation(); // search location on keyup
    this.companyID = this.route.snapshot.params[`carrierID`];
    if(this.companyID){
      this.fetchCarrier();
    }
    $(document).ready(() => {
      this.companyForm = $('#companyForm').validate();
    });
  }
   fetchCarrier() {
    this.apiService.getData(`carriers/${this.companyID}`)
        .subscribe(async(result: any) => {
          this.carriers = result.Items[0];
          this.carrierID = this.carriers.carrierID;
          this.CCC = this.carriers.CCC;
          this.DBAName = this.carriers.DBAName;
          this.DOT = this.carriers.DOT;
          this.EIN = this.carriers.EIN;
          this.MC = this.carriers.MC;
          this.SCAC = this.carriers.SCAC;
          this.CSA = this.carriers.CSA;
          this.CTPAT = this.carriers.CTPAT;
          this.PIP = this.carriers.PIP;
          this.cargoInsurance = this.carriers.cargoInsurance;
          this.email = this.carriers.email;
          this.userName = this.carriers.userName;
          this.carrierName = this.carriers.carrierName;
          this.password = this.carriers.password,
          this.confirmPassword = this.carriers.password,
          // carrierBusinessName = '';
          this.findingWay = this.carriers.findingWay;
          this.firstName = this.carriers.firstName;
          this.lastName = this.carriers.lastName;
          this.liabilityInsurance = this.carriers.liabilityInsurance;
          this.phone = this.carriers.phone;
          this.bizCountry =  this.carriers.bizCountry;
          // uploadedLogo = '';
          this.fleets = {
            curtainSide: this.carriers.fleets.curtainSide,
            dryVans: this.carriers.fleets.dryVans,
            flatbed: this.carriers.fleets.flatbed,
            reefers: this.carriers.fleets.reefers,
            totalFleets: this.carriers.fleets.totalFleets,
            trailers: this.carriers.fleets.trailers,
            trucks: this.carriers.fleets.trucks,
          };
          for (let i = 0; i < this.carriers.address.length; i++) {
            await this.getStates(this.carriers.address[i].countryID);
            await this.getCities(this.carriers.address[i].stateID);
            if (this.carriers.address[i].manual) {
              this.newAddress.push({
                addressID: this.carriers.address[i].addressID,
                addressType: this.carriers.address[i].addressType,
                countryID: this.carriers.address[i].countryID,
                countryName: this.carriers.address[i].countryName,
                stateID: this.carriers.address[i].stateID,
                stateName: this.carriers.address[i].stateName,
                cityID: this.carriers.address[i].cityID,
                cityName: this.carriers.address[i].cityName,
                zipCode: this.carriers.address[i].zipCode,
                address1: this.carriers.address[i].address1,
                address2: this.carriers.address[i].address2,
                geoCords: {
                  lat: this.carriers.address[i].geoCords.lat,
                  lng: this.carriers.address[i].geoCords.lng
                },
                manual: this.carriers.address[i].manual
              })
            } else {
              this.newAddress.push({
                addressID: this.carriers.address[i].addressID,
                addressType: this.carriers.address[i].addressType,
                countryID: this.carriers.address[i].countryID,
                countryName: this.carriers.address[i].countryName,
                stateID: this.carriers.address[i].stateID,
                stateName: this.carriers.address[i].stateName,
                cityID: this.carriers.address[i].cityID,
                cityName: this.carriers.address[i].cityName,
                zipCode: this.carriers.address[i].zipCode,
                address1: this.carriers.address[i].address1,
                address2: this.carriers.address[i].address2,
                geoCords: {
                  lat: this.carriers.address[i].geoCords.lat,
                  lng: this.carriers.address[i].geoCords.lng
                },
                userLocation: this.carriers.address[i].userLocation
              });
            }
          }
          this.addressDetails = this.newAddress;
          this.bank = {
            branchName: this.carriers.bank.branchName ,
            accountNumber: this.carriers.bank.accountNumber,
            transitNumber: this.carriers.bank.transitNumber,
            routingNumber: this.carriers.bank.routingNumber,
            institutionNumber: this.carriers.bank.institutionNumber,
          };
          this.bankID = this.carriers.bank.bankID;
          this.uploadedLogo = this.carriers.uploadedLogo;
          this.logoSrc = `${this.Asseturl}/${this.carriers.carrierID}/${this.carriers.uploadedLogo}`;

        });
  }

// UPDATE PART
 /**
   * address
   */
  clearUserLocation(i) {
    this.addressDetails[i][`userLocation`] = '';
    $('div').removeClass('show-search__result');
  }
  manAddress(event, i) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
      this.addressDetails[i][`userLocation`] = '';
    } else {
      $(event.target).closest('.address-item').removeClass('open');
    }
  }
  async getStates(id: any, oid = null) {
    if (oid != null) {
      this.addressDetails[oid].countryName = this.countriesObject[id];
    }
    this.apiService.getData('states/country/' + id)
      .subscribe((result: any) => {
        this.states = result.Items;
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
  async getCities(id: any, oid = null) {
    if (oid != null) {
      this.addressDetails[oid].stateName = this.statesObject[id];
    }
    this.apiService.getData('cities/state/' + id)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }
  getCityName(i, id: any) {
    const result = this.citiesObject[id];
    this.addressDetails[i].cityName = result;
  }
  addAddress() {
    if (this.addressDetails.length === 3) { // to restrict to add max 3 addresses, can increase in future by changing this value only
      this.toaster.warning('Maximum 3 addresses are allowed.');
    }
    else {
      this.addressDetails.push({
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
  }
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
        this.countries.map(elem => {
          if (elem.countryName === 'Canada' || elem.countryName === 'United States of America') {
            this.addressCountries.push({ countryName: elem.countryName, countryID: elem.countryID });
          }
        });
      });
  }
  async fetchCountriesByName(name: string, i) {
    const result = await this.apiService.getData(`countries/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getStates(result.Items[0].countryID, i);
      return result.Items[0].countryID;
    }
    return '';
  }

  async fetchStatesByName(name: string, i) {
    const result = await this.apiService.getData(`states/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getCities(result.Items[0].stateID, i);
      return result.Items[0].stateID;
    }
    return '';
  }

  async fetchCitiesByName(name: string) {
    const result = await this.apiService.getData(`cities/get/${name}`)
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
      this.addressDetails.splice(i, 1);
    }
  }
  public searchLocation() {
    let target;
    this.searchTerm.pipe(
      map((e: any) => {
        $('.map-search__results').hide();
        $(e.target).closest('div').addClass('show-search__result');
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
  async userAddress(i, item) {
    let result = await this.HereMap.geoCode(item.address.label);
    result = result.items[0];
    this.addressDetails[i][`userLocation`] = result.address.label;
    this.addressDetails[i].geoCords.lat = result.position.lat;
    this.addressDetails[i].geoCords.lng = result.position.lng;
    this.addressDetails[i].countryName = result.address.countryName;
    $('div').removeClass('show-search__result');
    this.addressDetails[i].stateName = result.address.state;
    this.addressDetails[i].cityName = result.address.city;
    this.addressDetails[i].countryID = ''; // empty the fields if manual is false (if manual was true IDs were stored)
    this.addressDetails[i].stateID = '';
    this.addressDetails[i].cityID = '';
    this.addressDetails[i].zipCode = result.address.postalCode;

    if (result.address.houseNumber === undefined) {
      result.address.houseNumber = '';
    }
    if (result.address.street === undefined) {
      result.address.street = '';
    }
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  async UpdateCarrier() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
    for (let i = 0; i < this.addressDetails.length; i++) {
      const element = this.addressDetails[i];
      if (element.countryID !== '' && element.stateID !== '' && element.cityID !== '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
    ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);
        if (result.items.length > 0) {
          result = result.items[0];
          element.geoCords.lat = result.position.lat;
          element.geoCords.lng = result.position.lng;
        }
      }
    }
    const data = {
      carrierID: this.carrierID,
      entityType: 'carrier',
      CCC: this.CCC,
      DBAName: this.DBAName,
      DOT: this.DOT,
      EIN: this.EIN,
      MC: this.MC,
      SCAC: this.SCAC,
      cargoInsurance: this.cargoInsurance,
      email: this.email,
      userName: this.userName,
      CTPAT: this.CTPAT,
      CSA: this.CSA,
      PIP: this.PIP,
      carrierName: this.carrierName.trim(),
      findingWay: this.findingWay,
      firstName: this.firstName,
      lastName: this.lastName,
      liabilityInsurance: this.liabilityInsurance,
      password: this.password,
      bizCountry: this.bizCountry,
      confirmPassword: this.confirmPassword,
      addressDetails: this.addressDetails,
      phone: this.phone,
      fleets: {
        curtainSide: this.fleets.curtainSide,
        dryVans: this.fleets.dryVans,
        flatbed: this.fleets.flatbed,
        reefers: this.fleets.reefers,
        totalFleets: this.fleets.totalFleets,
        trailers: this.fleets.trailers,
        trucks: this.fleets.trucks
      },
      bank: {
        branchName: this.bank.branchName ,
        accountNumber: this.bank.accountNumber,
        transitNumber: this.bank.transitNumber,
        routingNumber: this.bank.routingNumber,
        institutionNumber: this.bank.institutionNumber,
        bankID:  this.bankID
      },
      uploadedLogo: this.uploadedLogo

    };
    // create form data instance
    const formData = new FormData();

    // append photos if any
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }
    // append other fields
    formData.append('data', JSON.stringify(data));

    this.apiService.putData('carriers', formData, true).subscribe({
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
        this.toaster.success('Carrier updated successfully.');
        this.cancel();
      },
    });



  }
  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
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
  selectPhoto(event) {
    let files = [...event.target.files];
    this.uploadedPhotos = [];
    this.uploadedPhotos.push(files[0]);
  }

  deleteLogo() {
    this.apiService.deleteData(`carriers/uploadDelete/${this.carrierID}/${this.uploadedLogo}`).subscribe((result: any) => {
      this.toaster.success('Image Deleted Successfully');
      this.fetchCarrier();
    });
  }

  // FRONT END VALIDATION
  EINValidation(e) {
    const EIN = e.target.value;
    if (EIN.length == 0) {
      this.errorEIN = false;
    } else{
      if (EIN.length != 9) {
        this.errorEIN = true;
    }
    else{
      this.errorEIN = false;
    }
    }

   }
   MCValidation(e) {
    const MC = e.target.value;
    if (MC.length == 0) {
      this.errorMC = false;
    } else{
      if (MC.length != 6) {
        this.errorMC = true;
    }
    else{
      this.errorMC = false;
    }
    }
   }
   DOTValidation(e) {
    const DOT = e.target.value;
    if (DOT.length === 0) {
      this.errorDOT = false;
    } else{
      if (DOT.length !== 8) {
        this.errorDOT = true;
    }
    else{
      this.errorDOT = false;
    }
    }
   }

   CCCValidation(e) {
    const CCC = e.target.value;
    if (CCC.length === 0) {
      this.errorCCC = false;
    } else{
      if (CCC.length !== 4) {
        this.errorCCC = true;
    }
    else{
      this.errorCCC = false;
    }
    }
   }
   SCACValidation(e) {
    const SCAC = e.target.value;
    if (SCAC.length === 0) {
      this.errorSCAC = false;
    } else{
      if (SCAC.length !== 4) {
        this.errorSCAC = true;
    }
    else{
      this.errorSCAC = false;
    }
    }
   }
   routingValidation(e) {
    const routing = e.target.value;
    if (routing.length === 0) {
      this.errorRouting = false;
    } else {
      if (routing.length !== 9) {
        this.errorRouting = true;
      }
      else {
        this.errorRouting = false;
      }
    }
  }
  transitValidation(e) {
    const transit = e.target.value;
    if (transit.length === 0) {
      this.errorTransit = false;
    } else {
      if (transit.length !== 9) {
        this.errorTransit = true;
      }
      else {
        this.errorTransit = false;
      }
    }
  }
  institutionValidation(e) {
    const instiution = e.target.value;
    if (instiution.length === 0) {
      this.errorInstitution = false;
    } else {
      if (instiution.length !== 3) {
        this.errorInstitution = true;
      }
      else {
        this.errorInstitution = false;
      }
    }
  }
  accountValidation(e) {
    const account = e.target.value;
    if (account.length === 0) {
      this.errorAccount = false;
    } else {
      if (account.length > 12 || account.length < 7) {
        this.errorAccount = true;
      }
      else {
        this.errorAccount = false;
      }
    }
  }
}
