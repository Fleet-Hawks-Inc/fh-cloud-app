import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../environments/environment';
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssueDetailComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  photoSlides = [];
  docSlides = [];
  Asseturl = this.apiService.AssetUrl;
  public issueID;
  issueName: string;
  unitID: string;
  unitType: string;
  sessionID: string;
  unitName: string;
  currentStatus: string;
  reportedDate: string;
  description: string;
  odometer: string;
  reportedBy: string;
  assignedTo: string;
  carrierID;
  contactName: string;
  usersList: any = {};
  image;
  vehicles = [];
  assets = [];
  contacts = [];
  vehicleList: any = {};
  contactList: any = {};
  assetList: any = {};
  driverList: any = {};
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
    private domSanitizer: DomSanitizer,
    private routerMgmtService: RouteManagementServiceService
    ) {
    this.sessionID = this.routerMgmtService.maintainanceSessionID;
    }

  ngOnInit() {
    this.issueID = this.route.snapshot.params[`issueID`];
    this.fetchIssue();
    this.fetchVehicleList();
    this.fetchUsersList();
    this.fetchAssetList();
    // if(localStorage.getItem('issueID') != null) {
    //   this.route.paramMap.subscribe(res=> {

    //   })
    // }
  }
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }

  fetchUsersList() {
    this.apiService.getData('common/users/get/list').subscribe((result: any) => {
      this.usersList = result;
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
        result = result[0];
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
        this.issueImages = result.uploadedPics;
        this.issueDocs = result.uploadDocument;
        /*
        if (result.uploadedPhotos !== undefined && result.uploadedPhotos.length > 0) {
          this.issueImages = result.uploadedPhotos.map((x: any) => ({path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x}));
        }

        if (result.uploadedDocs !== undefined && result.uploadedDocs.length > 0) {
          this.issueDocs = result.uploadedDocs.map((x: any) => ({path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x}));
        }
        */
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
  setStatus(issueID: any, issueName: any) {
    const issueStatus = 'CLOSED';
    this.apiService.getData(`issues/setStatus/${issueID}/${issueName}/${issueStatus}`).subscribe((result: any) => {
      this.toastr.success('Issue Status Updated Successfully!');
      this.currentStatus = 'CLOSED';
    });
  }
  resolveIssue() {
    window.localStorage.setItem('vehicleLocalID', this.unitID);
    const unit = {
      unitID: this.unitID,
      unitType: this.unitType,
    };
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
    const pieces = val.split(/[\s.]+/);
    const ext = pieces[pieces.length - 1];
    this.pdfSrc = '';
    if (ext === 'doc' || ext === 'docx' || ext === 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }
  // delete uploaded image or document
  delete(type: string, name: string, index: any) {
    if (confirm('Are you sure you want to delete?') === true) {
      if (type === 'image') {
        this.issueImages.splice(index, 1);
            } else {
              this.issueDocs.splice(index, 1);
            }
      this.apiService.deleteData(`issues/uploadDelete/${this.issueID}/${type}/${name}`).subscribe((result: any) => {
        this.fetchIssue();
      });
    }
  }
}
