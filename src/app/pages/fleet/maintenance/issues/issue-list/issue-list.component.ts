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
  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }


  ngOnInit() {
    this.fetchIssues();
    this.fetchContacts();
    this.fetchVehicles();
    this.fetchAssets();
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
   // let contact = [];
   let contact: any = this.contacts.filter((c: any) => c.contactID === ID);
    return contact[0].contactName;
  }
  getUnitName(ID: any, type: any) {
    if (type === 'vehicle') {
      let vName = [];
      vName = this.vehicles.filter((v: any) => v.vehicleID === ID);
      return vName[0].vehicleIdentification;
    }
    else {
      let aName = [];
      aName = this.assets.filter((a: any) => a.assetID === ID);
      return aName[0].assetIdentification;
    }
  }
  fetchIssues() {
    this.apiService.getData('issues').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        console.log(result);
        this.issues = result.Items;
        console.log('Array', this.issues);
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
