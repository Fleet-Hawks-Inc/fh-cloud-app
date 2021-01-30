import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../../../services';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import {Router, ActivatedRoute, RouterStateSnapshot, RouterState} from '@angular/router';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { HereMapService } from '../../../../services';
import { NgForm} from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  @ViewChild('userForm',null) userForm: NgForm;
  Asseturl = this.apiService.AssetUrl;
  pageTitle = "Add User";
  userID: string;
  currentTab = 1;
  nextTab: any;
  countries = [];
  states = [];
  cities = [];
  users: [];
  groups = [];
 /**
  * form data
  */

      firstName= '';
      lastName= '';
      employeeID= '';
      dateOfBirth= '';
      phone= '';
      email = '';
      currentStatus = '';
    addressDetails = [{
      addressType:'',
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
   
      departmentName = '';
      userType = '';
      groupID = '';
      userName = '';
      timeCreated = '';
 /**
  * Photo data
  *  */  
 profileTitle ='Add';
 selectedFiles: FileList;
 selectedFileNames: Map<any, any>;   
 public userProfileSrc: any = 'assets/img/driver/driver.png';
 uploadedPhotos = [];
 selectPhoto(event) {
  let files = [...event.target.files];
  const reader = new FileReader();
  reader.onload = e => this.userProfileSrc = reader.result;
  reader.readAsDataURL(files[0]);
  this.uploadedPhotos = [];
  this.uploadedPhotos.push(files[0])
  
  if(this.uploadedPhotos.length > 0) {
    this.profileTitle = 'Change';
  }
  
}
removeProfile() {
  this.userProfileSrc = 'assets/img/driver/driver.png';
  this.uploadedPhotos = [];
  this.profileTitle = 'Add';
}
  /**
 *Group Properties
*/
  groupData = {
    groupType: Constants.GROUP_USERS
  };
  /**
   * address
   */
  userLocation: any;
  addressField = -1;
  public searchTerm = new Subject<string>();
  public searchResults: any;
  statesObject: any = {};
  countriesObject: any = {};
  citiesObject: any = {};
  entityType: 'user';
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  errors = {};
  Success = '';
  constructor(private location: Location,
    private HereMap: HereMapService, private apiService: ApiService, private toastr: ToastrService, private router: Router,private route: ActivatedRoute) { }

  ngOnInit() {
    this.userID = this.route.snapshot.params['userID'];
    if (this.userID) {
      this.pageTitle = 'Edit User';     
      this.fetchAddress();
      this.fetchUser();
    } else {
      this.pageTitle = 'Add User';
    }
    this.fetchCountries();
    this.fetchUsers();
    this.fetchGroups();
    this.searchLocation(); // search location on keyup
    $(document).ready(() => {
      this.form = $('#userForm, #groupForm').validate();
    });
  }
  nextStep() {
    this.currentTab++;
  }
  prevStep() {
    this.currentTab--;
  }
  tabChange(value) {
    this.currentTab = value;
  }  
  fetchAddress() {
    this.apiService.getData('addresses')
      .subscribe((result: any) => {
    });
  }
  manAddress(event, i) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
      this.addressDetails[i]['userLocation'] = '';
    } else {
      $(event.target).closest('.address-item').removeClass('open');
    }
  }
  fetchUsers() {
    this.apiService.getData('users').subscribe((result: any) => {
      this.users = result.Items;
    })
  }
  fetchGroups() {
    this.apiService.getData(`groups?groupType=${this.groupData.groupType}`).subscribe((result: any) => {
      this.groups = result.Items;
    });
  }
  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
    });
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

  async getCities(id: any, oid = null) {
    if (oid != null) {
      this.addressDetails[oid].stateName = this.statesObject[id];
    }

    this.apiService.getData('cities/state/' + id)
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
  /**
   * address part
   */
  addAddress() {
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
  remove(obj, i) {
    if (obj === 'address') {
      this.addressDetails.splice(i, 1);
    }
  }
  getCityName(i, id: any) {
    let result = this.citiesObject[id];
    this.addressDetails[i].cityName = result;
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
  async userAddress(i, item) {
    let result = await this.HereMap.geoCode(item.address.label);
    result = result.items[0];

    this.addressDetails[i]['userLocation'] = result.address.label;
    this.addressDetails[i].geoCords.lat = result.position.lat;
    this.addressDetails[i].geoCords.lng = result.position.lng;
    
    // let countryID = await this.fetchCountriesByName(result.address.countryName, i);
    // this.addressDetails[i].countryID = countryID;
    this.addressDetails[i].countryName = result.address.countryName;

    $('div').removeClass('show-search__result');

    //let stateID = await this.fetchStatesByName(result.address.state, i);
    // this.addressDetails[i].stateID = stateID;
    this.addressDetails[i].stateName = result.address.state;

    //let cityID = await this.fetchCitiesByName(result.address.city);
    // this.addressDetails[i].cityID = cityID;
    this.addressDetails[i].cityName = result.address.city;

    // this.addressDetails[i].zipCode = result.address.postalCode;
    if (result.address.houseNumber === undefined) {
      result.address.houseNumber = '';
    }
    if (result.address.street === undefined) {
      result.address.street = '';
    }
    // this.addressDetails[i].address1 = `${result.title}, ${result.address.houseNumber} ${result.address.street}`;    
  }
  clearUserLocation(i) {
    this.addressDetails[i]['userLocation'] = '';
    $('div').removeClass('show-search__result');
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

  /**
   * cancel function to go to previous location
   */
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  /**
   * edit time filling of input
   */
  // fillCountry() {
  //   this.apiService
  //     .getData('states/' + this.addressDetails.stateID)
  //     .subscribe((result: any) => {
  //       result = result.Items[0];
  //       this.addressDetails.countryID = result.countryID;
  //     });

  //   setTimeout(() => {
  //     this.getStates();
  //   }, 2000);
  //   setTimeout(() => {
  //     this.getCities();
  //   }, 2000);
  // }
  async onSubmit() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
    for (let i = 0; i < this.addressDetails.length; i++) {
      const element = this.addressDetails[i];
      if (element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);
        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;
      }
    }
    const data = {      
      firstName: this.firstName,
      lastName: this.lastName,
      entityType: this.entityType,
      employeeID: this.employeeID,
      dateOfBirth: this.dateOfBirth,
      phone: this.phone,
      email: this.email,  
      currentStatus: this.currentStatus,       
      departmentName: this.departmentName,
      userType: this.userType,
      groupID: this.groupID,
      userName: this.userName,     
    addressDetails: this.addressDetails
  };
    
      // create form data instance
      const formData = new FormData();

      //append photos if any
      for(let i = 0; i < this.uploadedPhotos.length; i++){
        formData.append('uploadedPhotos', this.uploadedPhotos[i]);
      }
       //append other fields
    formData.append('data', JSON.stringify(data));
   
    this.apiService.postData('users',formData, true).subscribe({
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
              this.hasError = true;
              this.toastr.error('Please see the errors');
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.toastr.success('User Added Successfully.');
        // this.location.back();
      }
    })
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
  /**
   * Edit funcationality
   */
  fetchUser(){
    this.apiService.getData('users'+ this.userName).subscribe((result:any) => {
      result = result.Items[0];
      console.log('result',result);
      this.firstName = result.firstName,
      this.lastName = result.lastName,
      this.entityType = result.entityType,
      this.employeeID = result.employeeID,
      this.dateOfBirth = result.dateOfBirth,
      this.phone = result.phone,
      this. email = result.email,  
      this.currentStatus = result.currentStatus,       
      this.departmentName = result.departmentName,
      this.userType = result.userType,
      this.groupID = result.groupID,
      this.userName = result.userName,
      this.timeCreated = result.timeCreated,
      this.addressDetails = result.addressDetails
      if(result.userImage != '' && result.userImage != undefined) {
        this.userProfileSrc = `${this.Asseturl}/${result.carrierID}/${result.userImage}`;
      }
    });
  }
  /**
   * update user
   */
 async updateUser() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
    for (let i = 0; i < this.addressDetails.length; i++) {
      const element = this.addressDetails[i];
      if (element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);
        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;
      }
    }
    const data = {      
      firstName: this.firstName,
      lastName: this.lastName,
      entityType : this.entityType,
      employeeID: this.employeeID,
      dateOfBirth: this.dateOfBirth,
      phone: this.phone,
      email: this.email,  
      currentStatus: this.currentStatus,       
      departmentName: this.departmentName,
      userType: this.userType,
      groupID: this.groupID,
      userName: this.userName,   
      timeCreated : this.timeCreated,  
    addressDetails: this.addressDetails
  };
    
      // create form data instance
      const formData = new FormData();

      //append photos if any
      for(let i = 0; i < this.uploadedPhotos.length; i++){
        formData.append('uploadedPhotos', this.uploadedPhotos[i]);
      }
       //append other fields
    formData.append('data', JSON.stringify(data));
   
    this.apiService.putData('users',formData, true).subscribe({
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
              this.hasError = true;
              this.toastr.error('Please see the errors');
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.toastr.success('User Updated Successfully.');
        this.location.back();
      }
    })
  }
  // GROUP MODAL
  addGroup() {
    this.apiService.postData('groups', this.groupData).subscribe({
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
        this.fetchGroups();
        this.toastr.success('Group added successfully.');
        $('#addGroupModal').modal('hide');
        this.fetchGroups();

      },
    });
  }
}
