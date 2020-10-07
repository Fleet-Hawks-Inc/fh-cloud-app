import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';
import {AwsUploadService} from '../../../../../services';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';
import { from } from 'rxjs';
import {  map } from 'rxjs/operators';

declare var $: any;
@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.css']
})
export class AddIssueComponent implements OnInit {
  title = 'Add Issue';
  imageError = '';
  fileName = '';

  form;
  /**
   * Issue Prop
   */
  issueName = '';
  vehicleID = '';
  reportedDate: NgbDateStruct;
  description = '';
  odometer = '';
  reportedBy = '';
  assignedTo = '';
  carrierID;
  vehicles = [];
  fileToUpload = [];
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
              private awsUS: AwsUploadService, private toaster: ToastrService,
              private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) {
                this.selectedFileNames = new Map<any, any>();
              }
    get today() {
      return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
    }

  ngOnInit() {
    this.fetchVehicles();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }
  fetchVehicles() {
    // this.apiService.getData('vehicles').subscribe((result: any) => {
    //      this.vehicles = result.Items; });
    }
    getToday(): string {
      return new Date().toISOString().split('T')[0];
    }
  // selectToday() {
  //   this.model = this.calendar.getToday();
  // }
  addIssue(){
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    const data = {
      issueName: this.issueName,
      vehicleID: this.vehicleID,
      reportedDate: this.reportedDate,
      description: this.description,
      odometer: this.odometer,
      reportedBy: this.reportedBy,
      assignedTo: this.assignedTo,
      uploadedPhotos: this.uploadedPhotos,
      uploadedDocs: this.uploadedDocs
    }
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
            const key = val.message.match(/'([^']+)'/)[1];
            console.log(key);
            val.message = val.message.replace(/'.*'/, 'This Field');
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
}
