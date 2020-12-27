import {  Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import {AwsUploadService} from '../../../../../services';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';
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
  odometer = '';
  reportedBy = '';
  assignedTo = '';
  carrierID;
  vehicles = [];
  assets = [];
  contacts = [];
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
  pdfSrc: any;

  alldocs = [];
  allImages = [];
  deletedImages = [];
  deletedDocs = [];

  // date: {year: number, month: number};
  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private awsUS: AwsUploadService, private toaster: ToastrService,
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
    this.fetchContacts();
    this.issueID = this.route.snapshot.params['issueID'];
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
    fetchContacts() {
      this.apiService.getData('contacts').subscribe((result: any) => {
        this.contacts = result.Items;
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

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append docs if any
    for(let j = 0; j < this.uploadedDocs.length; j++){
      formData.append('uploadedDocs', this.uploadedDocs[j]);
    }

    //append other fields
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
          // this.uploadFiles(); // upload selected files to bucket
          this.toaster.success('Issue Added successfully');
          this.router.navigateByUrl('/fleet/maintenance/issues/list');
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
    // this.vehicleForm.showErrors(this.errors);
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
   * Uploading files which selected
   */
  uploadFiles = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    this.selectedFileNames.forEach((fileData: any, fileName: string) => {
      this.awsUS.uploadFile(this.carrierID, fileName, fileData);
    });
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

      if(result.uploadedPhotos != undefined && result.uploadedPhotos.length > 0){
        this.allImages = result.uploadedPhotos;
        this.issueImages = result.uploadedPhotos.map(x => `${this.Asseturl}/${result.carrierID}/${x}`);
      }

      if(result.uploadedDocs != undefined && result.uploadedDocs.length > 0){
        this.alldocs = result.uploadedDocs;
        this.issueDocs = result.uploadedDocs.map(x => `${this.Asseturl}/${result.carrierID}/${x}`);
      }
    });
  this.spinner.hide();
}

deleteFile(i:number, fileType) {
  let fileName = '';
  if(fileType == 'document') {
    fileName = this.alldocs[i];
    this.deletedDocs.push(fileName);
    this.issueDocs.splice(i, 1);
    this.existingDocs.splice(i, 1);

  } else if(fileType == 'image'){
    fileName = this.allImages[i];
    this.deletedImages.push(fileName);
    this.issueImages.splice(i, 1);
    this.existingPhotos.splice(i, 1);
  }
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

    if(this.deletedImages.length > 0) {
      for (let i = 0; i < this.deletedImages.length; i++) {
        const element = this.deletedImages[i];
        this.apiService.getData('uploaded-file/delete/'+element).subscribe((result: any) => {
          console.log('Image Deleted Successfully!');
        });
      }
    }

    if(this.deletedDocs.length > 0) {
      for (let i = 0; i < this.deletedDocs.length; i++) {
        const element = this.deletedDocs[i];
        this.apiService.getData('uploaded-file/delete/'+element).subscribe((result: any) => {
          console.log('Doc Deleted Successfully!');
        });
      }
    }

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

    //append photos if any
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append docs if any
    for (let j = 0; j < this.uploadedDocs.length; j++) {
      formData.append('uploadedDocs', this.uploadedDocs[j]);
    }

    //append other fields
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
}
