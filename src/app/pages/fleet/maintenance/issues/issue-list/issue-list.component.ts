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
  contactList: any;
  vehicleList: any;
  assetList: any;
  vehicleName: string;
  contactName: string;
  dtOptions: any = {};
  unitID = '';
  unitName = '';
  issueName = '';
  suggestedUnits = [];


  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }


  ngOnInit() {
    this.fetchAllIssues();
    this.fetchIssues();
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchVehicleList();
    this.fetchContactList();
    this.fetchAssetList();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
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
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
  fetchContactList() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.contactList = result;
      console.log('fetched contacts', this.contactList);
    });
  }
  fetchAssetList() {
    this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetList = result;
    });
  }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
      // this.assetName =  this.assets[0].assetIdentification;
    });
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
  fetchAllIssues() {
    this.apiService.getData(`issues/`).subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        this.issues = result.Items;
      // console.log('all issues Array', this.issues);
      },
    });
  }
  deleteIssue(issueID) {
    this.apiService
      .deleteData('issues/' + issueID)
      .subscribe((result: any) => {
        this.toastr.success('Issue Deleted Successfully!');
        this. fetchAllIssues();
      });
  }
  initDataTable() {
    this.dtOptions = {
      dom: 'lrtip', // lrtip to hide search field
      processing: true,
      columnDefs: [
          {
              targets: 0,
              className: 'noVis'
          },
          {
              targets: 1,
              className: 'noVis'
          },
          {
              targets: 2,
              className: 'noVis'
          },
          {
              targets: 3,
              className: 'noVis'
          },
          {
              targets: 4,
              className: 'noVis'
          }
      ],
      colReorder: {
        fixedColumnsLeft: 1
      },
      buttons: [
        'colvis',
      ],
    };
  }
}