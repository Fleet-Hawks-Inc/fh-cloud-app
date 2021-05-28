import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../../../services';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import Constants from '../../../constants';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  logurl = this.apiService.AssetUrl;
  noRecordMessage: string = Constants.NO_RECORDS_FOUND;
  private logID;
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

  pdfSrc:any = this.domSanitizer.bypassSecurityTrustResourceUrl('');

  constructor(
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private route: ActivatedRoute,
      private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.logID = this.route.snapshot.params['logID'];
    this.fetchProgramByID();
    this.fetchAllVehiclesIDs();
    this.fetchAllVendorsIDs();
    // this.fetchAllIssuesIDs();
    this.fetchAllAssetsIDs();
    this.fetchUsers();
  }

  fetchProgramByID() {
    this.spinner.show(); // loader init
    this.apiService.getData(`serviceLogs/${this.logID}`).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.logsData = result.Items[0];
        

        this.fetchSelectedIssues(this.logsData.selectedIssues);
       
        result = result.Items[0];
        this.vehicle = result.unitID;
        this.assetID = result.unitID;
        this.vendorID = result.vendorID;
        this.completionDate = result.completionDate;
        this.odometer = result.odometer;
        this.reference = result.reference;
        this.description = result.description;
        this.startDate = result.timeCreated;
        this.allServiceTasks = result.allServiceTasks.serviceTaskList;
        this.allServiceParts = result.allServiceParts.servicePartsList;

        this.taskSubTotal = result.allServiceTasks.subTotal;
        this.taskDiscountAmount = result.allServiceTasks.discountAmount;
        this.taskDiscountPercent = result.allServiceTasks.discountPercent;
        this.taskTaxAmount = result.allServiceTasks.taxAmount;
        this.taskTaxPercent = result.allServiceTasks.taxPercent;
        this.taskTotal = result.allServiceTasks.total;

        this.partsSubTotal = result.allServiceParts.subTotal;
        this.partsQuantity = result.allServiceParts.totalQuantity;
        this.partsDiscountAmount = result.allServiceParts.discountAmount;
        this.partsDiscountPercent = result.allServiceParts.discountPercent;
        this.partsTaxAmount = result.allServiceParts.taxAmount;
        this.partsTaxPercent = result.allServiceParts.taxPercent;
        this.partsTotal = result.allServiceParts.total;

        this.currency = result.allServiceParts.currency;
        
       if(result.uploadedPhotos !== undefined && result.uploadedPhotos.length > 0){
          this.logImages = result.uploadedPhotos.map(x => ({
            path: `${this.logurl}/${result.carrierID}/${x}`,
            name: x,
          }));
        }

        if(result.uploadedDocs !== undefined && result.uploadedDocs.length > 0){
          this.logDocs = result.uploadedDocs.map(x => ({path: `${this.logurl}/${result.carrierID}/${x}`, name: x}));
        }
        this.spinner.hide(); // loader init
      },
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
        console.log('result vendor', result)
        this.vendorsObject = result; 
      });
  }

  fetchSelectedIssues(issueIDs) {
    if(issueIDs.length > 0) {
      issueIDs = JSON.stringify(issueIDs);
      this.apiService.getData('issues/fetch/selected?issueIds='+issueIDs)
      .subscribe((result: any) => {
        this.issuesObject = result;
      });
    }
  }

  fetchUsers(){
    this.apiService.getData('users/get/list').subscribe((result: any) => {
      this.users = result;
      
    });
  }

  fetchAllAssetsIDs() {
    this.apiService.getData('assets/get/list')
      .subscribe((result: any) => {
        this.assetsObject = result;
      });
  }

  // delete uploaded images and documents 
  delete(type: string,name: string){
    this.apiService.deleteData(`serviceLogs/uploadDelete/${this.logID}/${type}/${name}`).subscribe((result: any) => {
      this.fetchProgramByID();
    });
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length-1];
    this.pdfSrc = '';
    if(ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url='+val+'&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }
}
