import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  userID: string = '';
  groupList:any = {};
  countryList: any = {};
  stateList: any = {};
  cityList: any = {};
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
      public userProfileSrc: any = 'assets/img/driver/driver.png';
  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    this.userID = this.route.snapshot.params['userID'];
    this.fetchCountryList();
      this.fetchStateList();
      this.fetchCityList();
      this.fetchGroupList();
    if(this.userID){
      this.fetchUser();  
      
    }
    
  }
  fetchGroupList(){
    this.apiService.getData('groups/get/list').subscribe( (result:any) => {
      this.groupList = result;
    })
  }
  fetchCountryList() {
    this.apiService.getData('countries/get/list').subscribe((result: any) => {
      this.countryList = result;
    });
  }
  fetchStateList() {
    this.apiService.getData('states/get/code').subscribe((result: any) => {// to get state code against stateID
      this.stateList = result;
    });
  }
  fetchCityList() {
    this.apiService.getData('cities/get/list').subscribe((result: any) => {
      this.cityList = result;
    });
  }
fetchUser(){
  this.apiService.getData('users/'+ this.userID).subscribe((result:any)=>{
    result = result.Items[0];
    this.firstName= result.firstName;
    this.lastName= result.lastName;
    this.employeeID= result.employeeID;
    this.dateOfBirth= result.dateOfBirth;
    this.phone= result.phone;
    this.email = result.email;
    this.currentStatus = result.currentStatus;
    this.addressDetails = result.addAddress;   
    this.departmentName = result.departmentName;
    this.userType = result.userType;
    this.groupID = result.groupID;
    this.userName = result.userName;
    this.addressDetails = result.addressDetails;
    if(result.userImage != '' && result.userImage != undefined) {
      this.userProfileSrc = `${this.Asseturl}/${result.carrierID}/${result.userImage}`;
    }
  });
}
}
