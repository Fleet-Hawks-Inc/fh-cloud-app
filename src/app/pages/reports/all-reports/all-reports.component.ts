import { Component, OnInit } from '@angular/core';
import { environment } from "../../../../environments/environment";
import {ApiService} from "../../../services/api.service"
@Component({
  selector: 'app-all-reports',
  templateUrl: './all-reports.component.html',
  styleUrls: ['./all-reports.component.css']
})
export class AllReportsComponent implements OnInit {

  constructor() { }
  environment = environment.isFeatureEnabled;

  isFleetEnabled = environment.isFleetEnabled;
  isDispatchEnabled = environment.isDispatchEnabled;
  isComplianceEnabled = environment.isComplianceEnabled;
  isManageEnabled = environment.isManageEnabled;
  isSafetyEnabled = environment.isSafetyEnabled;
  isAccountsEnabled = environment.isAccountsEnabled;
  isReportsEnabled = environment.isReportsEnabled;

  ngOnInit() {
    this.initRoles();
  }
  initRoles(){
    this.isFleetEnabled = environment.isFleetEnabled;
    this.isDispatchEnabled = localStorage.getItem("isDispatchEnabled")
      ? JSON.parse(localStorage.getItem("isDispatchEnabled"))
      : environment.isDispatchEnabled;
    this.isComplianceEnabled = localStorage.getItem("isComplianceEnabled")
      ? JSON.parse(localStorage.getItem("isComplianceEnabled"))
      : environment.isComplianceEnabled;
    this.isManageEnabled = localStorage.getItem("isManageEnabled")
      ? JSON.parse(localStorage.getItem("isManageEnabled"))
      : environment.isManageEnabled;
    this.isSafetyEnabled = localStorage.getItem("isSafetyEnabled")
      ? JSON.parse(localStorage.getItem("isSafetyEnabled"))
      : environment.isSafetyEnabled;
    this.isAccountsEnabled = localStorage.getItem("isAccountsEnabled")
      ? JSON.parse(localStorage.getItem("isAccountsEnabled"))
      : environment.isAccountsEnabled;
    environment.isAccountsEnabled;
    this.isReportsEnabled = environment.isReportsEnabled;
  }

}
