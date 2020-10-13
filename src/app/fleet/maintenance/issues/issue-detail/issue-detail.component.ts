import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import {AwsUploadService} from '../../../../aws-upload.service';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssueDetailComponent implements OnInit {

  public issueID;
  issueName = '';
  vehicleID = '';
  reportedDate: '';
  description = '';
  odometer = '';
  reportedBy = '';
  assignedTo = '';
  carrierID;
  image;
  vehicles = [];
  uploadedPhotos = [];
  docs: SafeResourceUrl;
  public issueImages = [];
  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private domSanitizer: DomSanitizer, private awsUS: AwsUploadService) { }

  ngOnInit() {
    this.issueID = this.route.snapshot.params['issueID'];
    this.fetchIssue();
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
      this.vehicleID = result.vehicleID;
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
}
