import {  Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import {  map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.css']
})
export class AddIssueComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  title: string;
  fileName = '';
  public issueID;
  issueForm;
  /**
   * Issue Prop
   */
  issueName = '';
  unitID = '';
  unitType = 'vehicle';
  currentStatus = 'OPEN';
  reportedDate: NgbDateStruct;
  description = '';
  odometer: number;
  reportedBy = '';
  assignedTo = '';
  carrierID;
  vehicles = [];
  assets = [];
  contacts = [];
  drivers = [];
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  uploadedFiles = [];
  imageNameArray = [];
  uploadedPhotos = [];
  uploadedDocs = [];
  existingPhotos = [];
  existingDocs = [];
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  errors = {};
  Success  = '';
  docs: SafeResourceUrl;
  public issueImages = [];
  image;
  public issueDocs = [];
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');

  // date: {year: number, month: number};
  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private toaster: ToastrService,
              private spinner: NgxSpinnerService,
              private location: Location, private domSanitizer: DomSanitizer,
              private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) {
                this.selectedFileNames = new Map<any, any>();

              }
    get today() {
      return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
    }

  ngOnInit() {
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.issueID = this.route.snapshot.params[`issueID`];
    if (this.issueID) {
      this.title = 'Edit Issue';
      this.fetchIssueByID();
    } else {
      this.title = 'Add Issue';
    }
    $(document).ready(() => {
      this.issueForm = $('#issueForm').validate();
    });
  }
  cancel() {
    console.log('back', window.history)
    this.location.back(); // <-- go back to previous location on cancel
  }

  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
         this.vehicles = result.Items; });
    }
    fetchAssets() {
      this.apiService.getData('assets').subscribe((result: any) => {
        this.assets = result.Items;
      });
    }
    fetchDrivers() {
      this.apiService.getData('drivers').subscribe((result: any) => {
        this.drivers = result.Items;
      });
    }
    getToday(): string {
      return new Date().toISOString().split('T')[0];
    }
    onChangeUnitType(value: any) {
      this.unitType = value;
    }
  addIssue() {
    this.hideErrors();
    const data = {
      issueName: this.issueName,
      unitType: this.unitType,
      unitID: this.unitID,
      currentStatus: this.currentStatus,
      reportedDate: this.reportedDate,
      description: this.description,
      odometer: this.odometer,
      reportedBy: this.reportedBy,
      assignedTo: this.assignedTo,
      uploadedPhotos: this.uploadedPhotos,
      uploadedDocs: this.uploadedDocs
    };

    // create form data instance
    const formData = new FormData();

    // append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    // append docs if any
    for(let j = 0; j < this.uploadedDocs.length; j++){
      formData.append('uploadedDocs', this.uploadedDocs[j]);
    }

    // append other fields
    formData.append('data', JSON.stringify(data));

    // this.apiService.postData('issues/', data).subscribe({
    this.apiService.postData('issues', formData, true).subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.toaster.success('Issue Added successfully');
          this.cancel();
        }
      });
  }

  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
  }

hideErrors() {
  from(Object.keys(this.errors))
    .subscribe((v) => {
      $('[name="' + v + '"]')
        .removeClass('error')
        .next()
        .remove('label');
    });
  this.errors = {};
}

  /*
   * Selecting files before uploading
   */
  selectDocuments(event, obj) {
    let files = [...event.target.files];

    if (obj === 'uploadedDocs') {
      this.uploadedDocs = [];
      for (let i = 0; i < files.length; i++) {
        this.uploadedDocs.push(files[i])
      }
    } else {
      this.uploadedPhotos = [];
      for (let i = 0; i < files.length; i++) {
          this.uploadedPhotos.push(files[i])
      }
    }
  }


    /*
   * Fetch Issue details before updating
  */
 fetchIssueByID() {
  this.spinner.show(); // loader init
  this.apiService
    .getData('issues/' + this.issueID)
    .subscribe((result: any) => {
      result = result.Items[0];
      this.issueID = this.issueID;
      this.issueName = result.issueName;
      this.unitID = result.unitID;
      this.unitType = result.unitType;
      this.currentStatus = result.currentStatus;
      this.reportedDate = result.reportedDate;
      this.description = result.description;
      this.odometer = result.odometer;
      this.reportedBy = result.reportedBy;
      this.assignedTo = result.assignedTo;
      this.existingPhotos = result.uploadedPhotos;
      this.existingDocs = result.uploadedDocs;

      if (result.uploadedPhotos !== undefined && result.uploadedPhotos.length > 0) {
        this.issueImages = result.uploadedPhotos.map(x => ({path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x}));
      }

      if (result.uploadedDocs !== undefined && result.uploadedDocs.length > 0) {
        this.issueDocs = result.uploadedDocs.map(x => ({path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x}));
      }
    });
  this.spinner.hide();
}
setPDFSrc(val) {
  const pieces = val.split(/[\s.]+/);
  const ext = pieces[pieces.length - 1];
  this.pdfSrc = '';
  if(ext === 'doc' || ext === 'docx' || ext === 'xlsx') {
    this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
  } else {
    this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
  }
}

setSrcValue(){
  this.pdfSrc = '';
}
/*
   * Update Issue
  */
  updateIssue() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
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
      uploadedPhotos: this.existingPhotos,
      uploadedDocs: this.existingDocs
    };

    // create form data instance
    const formData = new FormData();

    // append photos if any
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    // append docs if any
    for (let j = 0; j < this.uploadedDocs.length; j++) {
      formData.append('uploadedDocs', this.uploadedDocs[j]);
    }

    // append other fields
    formData.append('data', JSON.stringify(data));

    this.apiService.putData('issues/', formData, true).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.toaster.success('Issue Updated Successfully');
        this.router.navigateByUrl('/fleet/maintenance/issues/list');
      }
    });
  }

  // delete uploaded images and documents
  delete(type: string,name: string) {
    this.apiService.deleteData(`issues/uploadDelete/${this.issueID}/${type}/${name}`).subscribe((result: any) => {
      this.fetchIssueByID();
      let alertmsg = '';
      if(type === 'doc') {
        alertmsg = 'Document';
      } else {
        alertmsg = 'Image';
      }
      this.toaster.success(alertmsg + ' Deleted Successfully');
    });
  }
}
