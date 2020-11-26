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
  vehicleList: any;
  contactList: any;
  assetList: any;
  uploadedPhotos = [];
  docs: SafeResourceUrl;
  public issueImages = [];
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
      console.log('contact list', this.contactList);
    });
  }
  fetchAssetList() {
    this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetList = result;
      console.log('asset list', this.assetList);
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
      this.getImages();
    });
  }
  getImages = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      // this.docs = this.domSanitizer.bypassSecurityTrustResourceUrl(
      //await this.awsUS.getFiles(this.carrierID, this.assetData[0].uploadedDocs[i]));
      // this.assetsDocs.push(this.docs)
      this.image = this.domSanitizer.bypassSecurityTrustUrl(await this.awsUS.getFiles
      (this.carrierID, this.uploadedPhotos[i]));
      this.issueImages.push(this.image);
    }
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
    const issueStatus = 'CLOSE';
    this.apiService.getData('issues/setStatus/' + issueID + '/' + issueStatus).subscribe((result: any) => {
      this.toastr.success('Issue Status Updated Successfully!');
    });
  }
  resolveIssue() {
    window.localStorage.setItem('vehicleLocalID', this.unitID);
    this.router.navigateByUrl('/fleet/maintenance/service-log/add-service');
  }
}
