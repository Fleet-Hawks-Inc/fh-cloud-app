import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../../services';
import {Router} from '@angular/router';
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
  checked: any = false;
  isChecked = false;
  headCheckbox = false;
  selectedIssueID: any;
  issueCheckCount = null;
  vehicleName: string;
  contactName: string;
  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) {}


  ngOnInit() {
    this.fetchIssues();
   // this.fetchContacts();
    // this.fetchVehicles();
  }
  // fetchVehicles() {
  //   this.apiService.getData('vehicles').subscribe((result: any) => {
  //        this.vehicles = result.Items; });
  //   }
  //  fetchContacts() {
  //   this.apiService.getData('contacts').subscribe((result: any) => {
  //        this.contacts = result.Items;
  //        console.log('Contacts', this.contacts);
  //       });
  //   }
  fetchVehicles(ID) {
    this.apiService.getData('vehicles/' + ID).subscribe((result: any) => {
      this.vehicles = result.Items;
      console.log('VEHICLES', this.vehicles);
     // this.vehicleName =  this.vehicles[0].vehicleIdentification;
    });
  }
  fetchAssets(ID) {
    this.apiService.getData('assets/' + ID).subscribe((result: any) => {
      this.assets = result.Items;
      console.log('ASSETS', this.assets);
     // this.assetName =  this.assets[0].assetIdentification;
    });
  }
    getUnitIdentification(ID){
      // this.fetchVehicles(ID);
      // this.fetchAssets(ID);
    }
    getContactName(ID) {
       this.apiService.getData('contacts/' + ID).subscribe((result: any) => {
         this.contacts = result.Items;
         console.log('Contact by ID', this.contacts);
        // return this.contactName = this.contacts[0].contactName;
       });
    }
  fetchIssues() {
    this.apiService.getData('issues').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
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

