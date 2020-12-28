import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { AwsUploadService } from '../../../../../services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssueDetailComponent implements OnInit {
  photoSlides = [];
  docSlides = [];
  Asseturl = this.apiService.AssetUrl;
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
  pdfSrc: any;
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

        if (result.uploadedPhotos != undefined && result.uploadedPhotos.length > 0) {
          this.photoSlides = result.uploadedPhotos.map(x => `${this.Asseturl}/${result.carrierID}/${x}`);
        }

        if (result.uploadedDocs != undefined && result.uploadedDocs.length > 0) {
          this.docSlides = result.uploadedDocs.map(x => `${this.Asseturl}/${result.carrierID}/${x}`);
        }
      });
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
    this.apiService.putData('issues/', data).
      subscribe({
        complete: () => {
        }
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
