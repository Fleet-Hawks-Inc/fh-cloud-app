import { Component, OnInit } from "@angular/core";
import {ApiService} from "../api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-carrier-register",
  templateUrl: "./carrier-register.component.html",
  styleUrls: ["./carrier-register.component.css"],
})
export class CarrierRegisterComponent implements OnInit {
  activeTab = 1;
  carrierId ='testing';
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
  superAdminInfo = {
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
  notes: "";

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) {
    //this.carrierId = this.route.snapshot.params["carrierId"];

  }

  ngOnInit() {
    this.getInfo();
  }

  toggleTab(tab) {
    this.activeTab = tab;
  }

  next() {
    if (this.activeTab === 5) return;
    this.activeTab++;
  }

  previous() {
    if (this.activeTab === 1) return;
    this.activeTab--;
  }

  getInfo() {
    this.apiService.getData('carriers/register/' + this.carrierId)
        .subscribe((result: any) => {
      console.log(result);
        });

  }


}
