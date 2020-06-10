import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-carrier-register",
  templateUrl: "./carrier-register.component.html",
  styleUrls: ["./carrier-register.component.css"],
})
export class CarrierRegisterComponent implements OnInit {
  activeTab = 1;
  businessDetail = {
    businessType: "",
    businessName: "",
    dbaName: "",
    EIN: "",
  }
  addressDetail = {
    addressType: "",
    countryID: "",
    stateID: "",
    cityID: "",
    zipCode: "",
    address1: "",
    address2: "",
    geoLocation: {
      lat: "",
      lng: ""
    }
  }
  contactDetail = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    fax: ""
  }
  superAdmin = {
    userName: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    language: ""
  }
  socialNetwork: {
    facebook: "",
    twitter: "",
    linkedin: "",
    googlePlus: "",
    blog: "",
    tumblr: "",  
  }
  notes: ""


  constructor() {}

  ngOnInit() {}

  toggleTab(tab) {
    this.activeTab = tab;
  }

  next() {
    if (this.activeTab == 5) return;
    this.activeTab++;
  }

  previous() {
    if (this.activeTab == 1) return;
    this.activeTab--;
  }
}
