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
  issueName = '';
  unitID = '';
  unitType = '';
  unitName = '';
  status = '';
  reportedDate: '';
  description = '';
  odometer = '';
  reportedBy = '';
  assignedTo = '';
  carrierID;
  contactName = '';
  image;
  vehicles = [];
  assets = [];
  contacts = [];
  uploadedPhotos = [];
  docs: SafeResourceUrl;
  public issueImages = [];
  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private domSanitizer: DomSanitizer, private awsUS: AwsUploadService) { }

  ngOnInit() {
    this.issueID = this.route.snapshot.params['issueID'];
    this.fetchIssue();
  }
  fetchContacts(ID) {
    this.apiService.getData('contacts/' + ID).subscribe((result: any) => {
      this.contacts = result.Items;
      this.contactName = this.contacts[0].contactName;
    });
  }
  fetchVehicles(ID) {
    this.apiService.getData('vehicles/' + ID).subscribe((result: any) => {
      this.vehicles = result.Items;
      this.unitName =  this.vehicles[0].vehicleIdentification;
    });
  }
  fetchAssets(ID) {
    this.apiService.getData('assets/' + ID).subscribe((result: any) => {
      this.assets = result.Items;
      this.unitName =  this.assets[0].assetIdentification;
    });
  }
  // fetchAssets() {
  //   this.apiService.getData('assets').subscribe((result: any) => {
  //     this.assets = result.Items;
  //   });
  // }
  getContactName(){
    this.fetchContacts(this.reportedBy);
  }
  getUnitName() {
    console.log('hello');
    if (this.unitType === 'vehicle') {
      this.fetchVehicles(this.unitID);
    }
    else {
      this.fetchAssets(this.unitID);
    }
  }
  editIssue = () => {
      this.router.navigateByUrl('/fleet/maintenance/issues/edit-issue/' + this.issueID);
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
      this.status = result.status;
      this.unitType = result.unitType;
      this.reportedDate = result.reportedDate;
      this.description = result.description;
      this.odometer = result.odometer;
      this.reportedBy = result.reportedBy;
      this.assignedTo = result.assignedTo;
      this.uploadedPhotos = result.uploadedPhotos;
      this.getImages();
      this.getUnitName();
      this.getContactName();
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
}
