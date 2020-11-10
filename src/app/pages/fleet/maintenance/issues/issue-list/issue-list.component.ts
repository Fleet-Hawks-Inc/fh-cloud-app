import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;


@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
  title = 'Issues List';
  issues: [];
  vehicles: [];
  assets: [];
  contacts: [];
  vehicleName: string;
  contactName: string;

  unitID = '';
  unitName = '';
  issueName = '';
  suggestedUnits = [];


  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }


  ngOnInit() {
    this.fetchIssues();
    this.fetchContacts();
    this.fetchVehicles();
    this.fetchAssets();
  }

  setUnit(unitID, unitName) {
    this.unitName = unitName;
    this.unitID = unitID;

    this.suggestedUnits = [];
  }

  getSuggestions(value) {
    this.suggestedUnits = [];
    this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        result = result.Items;

        for(let i = 0; i < result.length; i++){
          this.suggestedUnits.push({
            unitID: result[i].vehicleID,
            unitName: result[i].vehicleIdentification
          });
        }
        
        this.getAssetsSugg(value);
      });
  }

  getAssetsSugg(value) {
    this.apiService
      .getData(`assets/suggestion/${value}`)
      .subscribe((result) => {
        result = result.Items;

        for(let i = 0; i < result.length; i++){
          this.suggestedUnits.push({
            unitID: result[i].assetID,
            unitName: result[i].assetIdentification
          });
        }
      });
      console.log(this.suggestedUnits);
      if(this.suggestedUnits.length == 0){
        this.unitID = '';
      }
  }

  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fetchContacts() {
    this.apiService.getData('contacts').subscribe((result: any) => {
      this.contacts = result.Items;
      console.log('Contacts', this.contacts);
    });
  }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
      console.log('ASSETS', this.assets);
      // this.assetName =  this.assets[0].assetIdentification;
    });
  }
  getContactName(ID: any) {
   let contact = [];
   contact = this.contacts.filter((c: any) => c.contactID === ID);
   let contactName = contact[0].contactName;
   return contactName;
  }
  getUnitName(ID: any, type: any) {
    if (type === 'vehicle') {
      let vehicle = [];
      vehicle = this.vehicles.filter((v: any) => v.vehicleID === ID);
      let vehicleName =  vehicle[0].vehicleIdentification;
      return vehicleName;
    }
    else {
      let asset = [];
      asset = this.assets.filter((a: any) => a.assetID === ID);
      let assetName = asset[0].assetIdentification;
      return assetName;
    }
  }
  fetchIssues() {
    this.apiService.getData(`issues?unitID=${this.unitID}&issueName=${this.issueName}`).subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        this.issues = result.Items;
      //  console.log('Array', this.issues);
      },
    });
  }
  deleteIssue(issueID) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/
    this.apiService
      .deleteData('issues/' + issueID)
      .subscribe((result: any) => {
        //   this.spinner.show();
        this.fetchIssues();
        this.toastr.success('Issue Deleted Successfully!');
      });
  }
  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
