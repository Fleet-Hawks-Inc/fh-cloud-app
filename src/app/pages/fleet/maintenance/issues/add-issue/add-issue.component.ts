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
  pdfSrc: string;
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
        console.log('assets', this.assets);
      });
    }
    fetchContacts() {
      this.apiService.getData('contacts').subscribe((result: any) => {
        this.contacts = result.Items;
        console.log('CONTACTS', this.contacts);
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
    console.log('Issue data on console', data);
    this.apiService.postData('issues/', data).
  subscribe({
    complete : () => {},
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
      this.uploadFiles(); // upload selected files to bucket
      this.toaster.success('Issue Added successfully');
      this.router.navigateByUrl('/fleet/maintenance/issues/list');
    }
  });
}
throwErrors() {
  console.log(this.errors);
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
    this.selectedFiles = event.target.files;
    console.log('selected files', this.selectedFiles);
    if (obj === 'uploadedDocs') {
      for (let i = 0; i <= this.selectedFiles.item.length; i++) {
        const randomFileGenerate = this.selectedFiles[i].name.split('.');
        const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;
        this.selectedFileNames.set(fileName, this.selectedFiles[i]);
        this.uploadedDocs.push(fileName);
      }
    } else {
      for (let i = 0; i <= this.selectedFiles.item.length; i++) {
        const randomFileGenerate = this.selectedFiles[i].name.split('.');
        const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;

        this.selectedFileNames.set(fileName, this.selectedFiles[i]);
        this.uploadedPhotos.push(fileName);
      }
    }
    console.log('uploaded photos', this.uploadedPhotos);
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
      console.log('result', result);
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
      this.uploadedPhotos = result.uploadedPhotos;
      this.uploadedDocs = result.uploadedDocs;
      setTimeout(() => {
        this.getImages();
        this.getDocuments();
       }, 1500);
    });
  this.spinner.hide();
}
getImages = async () => {
  this.carrierID = await this.apiService.getCarrierID();
  for (let i = 0; i < this.uploadedPhotos.length; i++) {
    this.image = this.domSanitizer.bypassSecurityTrustUrl(await this.awsUS.getFiles
    (this.carrierID, this.uploadedPhotos[i]));
    this.issueImages.push(this.image);
  }
  console.log('fetched images', this.issueImages);
}
deleteImage(i: number) {
  this.carrierID =  this.apiService.getCarrierID();
  this.awsUS.deleteFile(this.carrierID, this.uploadedPhotos[i]);
  this.uploadedPhotos.splice(i, 1);
  this.issueImages.splice(i, 1);
  console.log('new array' ,this.uploadedPhotos);
  this.toaster.success('Image Deleted Successfully!');
  // this.apiService.getData(`issues/updatePhotos?issueID=${this.issueID}&uploadedPhotos=${this.uploadedPhotos}`).subscribe((result: any) => {
  //   this.toaster.success('Image Deleted Successfully!');
  // });
}
getDocuments = async () => {
  this.carrierID = await this.apiService.getCarrierID();
  for (let i = 0; i < this.uploadedDocs.length; i++) {
    this.docs = this.domSanitizer.bypassSecurityTrustResourceUrl(
            await this.awsUS.getFiles(this.carrierID, this.uploadedDocs[i]));
    this.issueDocs.push(this.docs);
  }
  console.log('docs', this.issueDocs);
}
deleteDoc(i: number) {
  this.carrierID =  this.apiService.getCarrierID();
  this.awsUS.deleteFile(this.carrierID, this.uploadedDocs[i]);
  this.uploadedDocs.splice(i, 1);
  this.issueDocs.splice(i, 1);
  console.log('new array',this.uploadedDocs);
  // this.apiService.getData(`issues/updateDocs?issueID=${this.issueID}&uploadedDocs=${this.uploadedDocs}`).subscribe((result: any) => {
  //   this.toaster.success('Document Deleted Successfully!');
  // });
}
setPDFSrc(val) {
  this.pdfSrc = '';
  this.pdfSrc = val;
  console.log('pdf', this.pdfSrc);
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
    uploadedPhotos: this.uploadedPhotos,
    uploadedDocs: this.uploadedDocs
  };
  console.log('Issue data on console', data);
  this.apiService.putData('issues/', data).
subscribe({
  complete : () => {},
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
    this.uploadFiles(); // upload selected files to bucket
    this.toaster.success('Issue Updated Successfully');
    this.router.navigateByUrl('/fleet/maintenance/issues/list');
  }
});
}
}
