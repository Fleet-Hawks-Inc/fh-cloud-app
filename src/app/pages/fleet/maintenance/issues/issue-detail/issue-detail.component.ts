import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import {AwsUploadService} from '../../../../../services';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssueDetailComponent implements OnInit {

  public issueID;
  issueName: string;
  unitID: string;
  unitType: string;
  unitName: string;
  currentStatus: string;
  reportedDate: string;
  description: string;
  odometer: string;
  reportedBy: string;
  assignedTo: string;
  carrierID;
  contactName: string;
  image;
  vehicles = [];
  assets = [];
  contacts = [];
  vehicleList: any = {};
  contactList: any = {};
  assetList: any = {};
  uploadedPhotos = [];
  uploadedDocs = [];
  docs: SafeResourceUrl;
  public issueImages = [];
  public issueDocs = [];
  pdfSrc: string;
  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private domSanitizer: DomSanitizer, private awsUS: AwsUploadService) { }

  ngOnInit() {
    this.issueID = this.route.snapshot.params[`issueID`];
    this.fetchIssue();
    this.fetchVehicleList();
    this.fetchContactList();
    this.fetchAssetList();
  }
    fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
 
  fetchContactList() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.contactList = result;
    });
  }
  fetchAssetList() {
    this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetList = result;
    });
  }
  editIssue = () => {
      this.router.navigateByUrl('/fleet/maintenance/issues/edit/' + this.issueID);
      }
  fetchIssue() {
    // this.spinner.show(); // loader init
    this.apiService
    .getData('issues/' + this.issueID)
    .subscribe((result: any) => {
      result = result.Items[0];
      console.log('result', result);
      this.issueID = this.issueID;
      this.issueName = result.issueName;
      this.unitID = result.unitID;
      this.currentStatus = result.currentStatus;
      this.unitType = result.unitType;
      this.reportedDate = result.reportedDate;
      this.description = result.description;
      this.odometer = result.odometer;
      this.reportedBy = result.reportedBy;
      this.assignedTo = result.assignedTo;
      this.uploadedPhotos = result.uploadedPhotos;
      this.uploadedDocs = result.uploadedDocs;
      setTimeout(() => {
        this.getImages();
        this.getDocuments();
       }, 1500);
    });
  }
  getImages = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      this.image = this.domSanitizer.bypassSecurityTrustUrl(await this.awsUS.getFiles
      (this.carrierID, this.uploadedPhotos[i]));
      this.issueImages.push(this.image);
    }
  }
  deleteImage(i: number) {
    this.carrierID =  this.apiService.getCarrierID();
    this.awsUS.deleteFile(this.carrierID, this.uploadedPhotos[i]);
    this.uploadedPhotos.splice(i, 1);
    this.issueImages.splice(i, 1);
    this.updateIssue();
    this.toastr.success('Image Deleted Successfully!');
    // this.apiService.getData(`issues/updatePhotos?issueID=${this.issueID}&uploadedPhotos=${this.uploadedPhotos}`).subscribe((result: any) => {
    //   this.toastr.success('Image Deleted Successfully!');
    // });
  }
  getDocuments = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    for (let i = 0; i < this.uploadedDocs.length; i++) {
      this.docs = this.domSanitizer.bypassSecurityTrustResourceUrl(
              await this.awsUS.getFiles(this.carrierID, this.uploadedDocs[i]));
      this.issueDocs.push(this.docs);
    }
  }
  deleteDoc(i: number) {
    this.carrierID =  this.apiService.getCarrierID();
    this.awsUS.deleteFile(this.carrierID, this.uploadedDocs[i]);
    this.uploadedDocs.splice(i, 1);
    this.issueDocs.splice(i, 1);
    this.updateIssue();
    this.toastr.success('Document Deleted Successfully!');
    // this.apiService.getData(`issues/updateDocs?issueID=${this.issueID}&uploadedDocs=${this.uploadedDocs}`).subscribe((result: any) => {
    //   this.toastr.success('Document Deleted Successfully!');
    // });
  }
  deleteIssue(issueID) {
    this.apiService
      .deleteData('issues/' + issueID)
      .subscribe((result: any) => {
        this.toastr.success('Issue Deleted Successfully!');
        this.router.navigateByUrl('/fleet/maintenance/issues/list');
      });
  }
  setStatus(issueID) {
    const issueStatus = 'CLOSED';
    this.apiService.getData('issues/setStatus/' + issueID + '/' + issueStatus).subscribe((result: any) => {
      this.toastr.success('Issue Status Updated Successfully!');
      this.currentStatus = 'CLOSED';
    });
  }
  resolveIssue() {
    window.localStorage.setItem('vehicleLocalID', this.unitID);
  
    const unit = {
      unitID: this.unitID,
      unitType: this.unitType,
  }
  
  window.localStorage.setItem('unit', JSON.stringify(unit));
  this.router.navigateByUrl('/fleet/maintenance/service-log/add-service');
  }
  setPDFSrc(val) {
    this.pdfSrc = '';
    this.pdfSrc = val;
    console.log('pdf', this.pdfSrc);
  }
  updateIssue() {
    const data = {
      issueID: this.issueID,
      issueName: this.issueName,
      unitID: this.unitID,
      unitType: this.unitType,
      currentStatus: this.currentStatus,
      reportedDate: this.reportedDate,
      description: this.description,
      odometer: this.odometer,
      reportedBy: this.reportedBy,
      assignedTo: this.assignedTo,
      uploadedPhotos: this.uploadedPhotos,
      uploadedDocs: this.uploadedDocs
    };
    console.log('Issue data on console', data);
    this.apiService.putData('issues/', data).
  subscribe({
    complete : () => {
    }
  });
  }
}
