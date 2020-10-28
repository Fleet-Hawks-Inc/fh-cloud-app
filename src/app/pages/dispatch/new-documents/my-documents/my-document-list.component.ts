import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { from, Subject } from 'rxjs';
import {AwsUploadService} from '../../../../services/aws-upload.service';
import { v4 as uuidv4 } from 'uuid';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { Auth } from 'aws-amplify';
declare var $: any;

@Component({
  selector: 'app-my-document-list',
  templateUrl: './my-document-list.component.html',
  styleUrls: ['./my-document-list.component.css']
})
export class MyDocumentListComponent implements OnInit {
  public documents = [];
  trips;
  currentUser;
  form;
  image;
  ifEdit = false;
  modalTitle: string = 'Add Document';
  docs: SafeResourceUrl;
  public documentsDocs = [];
  selectedFiles: FileList;
  private dtTrigger: Subject<any> = new Subject();
  selectedFileNames: Map<any, any>;
  documentMode: string = 'Manual';
  documentPrefix: string;
  documentSequence: string;
  allOptions: any = {};
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';
  errors = {};
  carrierID: any;
  documentData = {
    uploadedDocs: []
  };
  constructor(
    private apiService: ApiService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private awsUS: AwsUploadService
  ) {
    this.selectedFileNames = new Map<any, any>();
   }

  ngOnInit() {
    this.fetchDocuments();
    this.getCurrentuser();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  fetchDocuments = () => {
    // this.spinner.show(); // loader init
    this.apiService.getData('documents').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].isDeleted === 0) {
            this.documents.push(result.Items[i]);
          }
        }
        // this.spinner.hide(); // loader hide
        
        }
      });
  };
  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.currentUser = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    console.log(this.currentUser)
  }

  dataTableOptions = () => {
    this.allOptions = { // All list options
      pageLength: 10,
      processing: true,
      // select: {
      //     style:    'multi',
      //     selector: 'td:first-child'
      // },
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
         {
              extend: 'colvis',
              columns: ':not(.noVis)'
          }
      ],
      colReorder: true,
      columnDefs: [
        {
            targets: 1,
            className: 'noVis'
        },
        {
            targets: 2,
            className: 'noVis'
        },
        {
            targets: 3,
            className: 'noVis'
        },
        {
            targets: 4,
            className: 'noVis'
        },
    ],
    };
  }

  addDocument() {
    this.apiService.postData('documents', this.documentData).
    subscribe({
      complete : () => {},
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              // this.spinner.hide(); // loader hide
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Document Added successfully';
      }
    });
  }
  throwErrors() {
    this.form.showErrors(this.errors);
  }

  /*
   * Selecting files before uploading
   */
  selectDocuments(event) {
    this.selectedFiles = event.target.files;
    for (let i = 0; i <= this.selectedFiles.item.length; i++) {
      const randomFileGenerate = this.selectedFiles[i].name.split('.');
      const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;
      this.selectedFileNames.set(fileName, this.selectedFiles[i]);
      this.documentData.uploadedDocs.push(fileName);
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
   * Get all trips from api
   */
  fetchTrips() {
    this.apiService.getData('trips').subscribe((result: any) => {
      this.trips = result.Items;
      console.log('trips', this.trips);
    });
  }

  /*
    * Fetch Document details before updating
    */
  editDocument(id: any) {
    this.ifEdit = true;
    this.modalTitle = 'Edit Document';
    $('#addDocumentModal').modal('show');
    this.apiService
        .getData('documents/' + id)
        .subscribe((result: any) => {
          result = result.Items[0];
          this.getImages(result);
          console.log(result);
          this.documentData['docID'] = result.docID;
          this.documentData['documentNumber'] = result.documentNumber;
          this.documentData['documentName'] = result.documentName;
          this.documentData['docType'] = result.docType;
          this.documentData['description'] = result.description;
          this.documentData['uploadedDocs'] = result.uploadedDocs;
          this.documentData['tripID'] = result.tripID;
        });
  }
  
  updateDocument() {
    this.apiService.putData('documents', this.documentData).
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
        this.hasSuccess = true;
        this.Success = 'Document Updated successfully';
        $('#addDocumentModal').modal('hide');
        setTimeout(() => {
          this.fetchDocuments();
          this.dtTrigger.next();
        }, 1000);
      }
    });
  }

  getImages = async (result) => {
    this.carrierID = await this.apiService.getCarrierID();
    console.log("dfdf", result.uploadedDocs[0]);
    this.image = this.domSanitizer.bypassSecurityTrustUrl(
      await this.awsUS.getFiles(this.carrierID, result.uploadedDocs[0]));
      console.log('this.documentsDocs', this.image);
      this.documentsDocs = this.image;
  }

  deactivateAsset(value, docID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`documents/isDeleted/${docID}/${value}`)
      .subscribe((result: any) => {
        console.log('result', result);
        this.fetchDocuments();
      });
    }
  }
}
