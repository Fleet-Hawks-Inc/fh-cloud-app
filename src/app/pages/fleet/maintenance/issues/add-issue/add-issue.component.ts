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
declare var $: any;
@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.css']
})
export class AddIssueComponent implements OnInit {
  title: string;
  imageError = '';
  fileName = '';
  public issueID;
  form;
  /**
   * Issue Prop
   */
  issueName = '';
  unitID = '';
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
  // date: {year: number, month: number};
  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private awsUS: AwsUploadService, private toaster: ToastrService,
              private spinner: NgxSpinnerService,
              private location: Location,
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
      this.form = $('#form_').validate();
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
  // selectToday() {
  //   this.model = this.calendar.getToday();
  // }
  addIssue() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    const data = {
      issueName: this.issueName,
      unitID: this.unitID,
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
    error: (err) => {
      from(err.error)
        .pipe(
          map((val: any) => {
            const path = val.path;
            // We Can Use This Method
            const key = val.message.match(/"([^']+)"/)[1];
            console.log(key);
            val.message = val.message.replace(/".*"/, 'This Field');
            this.errors[key] = val.message;
          })
        )
        .subscribe({
          complete: () => {
            this.throwErrors();
            this.Success = '';
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
  this.form.showErrors(this.errors);
}
 /*
   * Selecting files before uploading
   */
  selectDocuments(event, obj) {
    this.selectedFiles = event.target.files;
    console.log('selected files', this.selectedFiles[0].name);
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
      this.reportedDate = result.reportedDate;
      this.description = result.description;
      this.odometer = result.odometer;
      this.reportedBy = result.reportedBy;
      this.assignedTo = result.assignedTo;
    });
  this.spinner.hide();
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
  error: (err) => {
    from(err.error)
      .pipe(
        map((val: any) => {
          const path = val.path;
          // We Can Use This Method
          const key = val.message.match(/"([^']+)"/)[1];
          console.log(key);
          val.message = val.message.replace(/".*"/, 'This Field');
          this.errors[key] = val.message;
        })
      )
      .subscribe({
        complete: () => {
          this.throwErrors();
          this.Success = '';
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
