import { Component, OnInit } from '@angular/core';
import { ApiService, ListService } from '../../../../../services';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-log-detail-pdf',
  templateUrl: './log-detail-pdf.component.html',
  styleUrls: ['./log-detail-pdf.component.css']
})
export class LogDetailPdfComponent implements OnInit {
  programs;
  logsData: any = {
    unitType: '-'
  };
  allServiceTasks: any = [];
  allServiceParts: any = [];
  vehicle: any;
  assetID: any;
  completionDate: any;
  startDate: any;
  odometer: any;
  reference: any;
  vendorID: any;
  description: any;
  vehiclesObject: any = {};
  vendorsObject: any = {};
  issuesObject: any = [];
  assetsObject: any = {};

  taskSubTotal: number;
  taskDiscountAmount: number;
  taskDiscountPercent: number;
  taskTaxAmount: number;
  taskTaxPercent: number;
  taskTotal: number;

  partsSubTotal: number;
  partsQuantity: number;
  partsDiscountAmount: number;
  partsDiscountPercent: number;
  partsTaxAmount: number;
  partsTaxPercent: number;
  partsTotal: number;

  currency: any;
  photos: any = [];
  docs: any = [];
  users: any = [];

  logImages = []
  logDocs = [];
  expPayRef: any;
  showModal = false;
  downloadDisabledpdf = true;
  private logID;
  constructor(private apiService: ApiService, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.logID = this.route.snapshot.params['logID'];
    this.fetchProgramByID();
    this.fetchAllVehiclesIDs();
    this.fetchAllVendorsIDs();
    // this.fetchAllIssuesIDs();
    this.fetchAllAssetsIDs();
    this.fetchUsers();
  }
  fetchProgramByID() {

    this.apiService.getData(`serviceLogs/${this.logID}`).subscribe((result: any) => {
      this.logsData = result.Items[0];
      // this.fetchSelectedIssues(this.logsData.selectedIssues);
      // result = result.Items[0];
    });

  }
  fetchSelectedIssues(issueIDs) {
    if (issueIDs.length > 0) {
      issueIDs = JSON.stringify(issueIDs);
      this.apiService.getData('issues/fetch/selected?issueIds=' + issueIDs)
        .subscribe((result: any) => {
          this.issuesObject = result;
        });
    }
  }

  fetchUsers() {
    this.apiService.getData('common/users/get/list').subscribe((result: any) => {
      this.users = result;

    });
  }
  fetchAllAssetsIDs() {
    this.apiService.getData('assets/get/list')
      .subscribe((result: any) => {
        this.assetsObject = result;
      });
  }
  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/get/list')
      .subscribe((result: any) => {
        this.vehiclesObject = result;
      });
  }

  fetchAllVendorsIDs() {
    this.apiService.getData('contacts/get/list/vendor')
      .subscribe((result: any) => {
        this.vendorsObject = result;
      });
  }
}
