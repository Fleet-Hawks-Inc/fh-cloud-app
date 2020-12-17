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
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import * as moment from "moment";


@Component({
  selector: 'app-my-document-list',
  templateUrl: './my-document-list.component.html',
  styleUrls: ['./my-document-list.component.css']
})
export class MyDocumentListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

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

  totalRecords = 20;
  pageLength = 10;
  serviceUrl = '';
  filterValues = {
    searchValue: '',
    startDate: '',
    endDate: '',
    start: <any> '',
    end: <any> ''
  };
  lastEvaluated = {
    value1: '',
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
    this.initDataTable();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  fetchDocuments = () => {
    // this.spinner.show(); // loader init
    this.totalRecords = 0;
    this.apiService.getData('documents').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].isDeleted === 0) {
            // this.documents.push(result.Items[i]);
            this.totalRecords += 1 ;
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
      dom: 'Bfrtip',
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

  initDataTable() {
    let current = this;
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: current.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0],"orderable": false},
        {"targets": [1],"orderable": false},
        {"targets": [2],"orderable": false},
        {"targets": [3],"orderable": false},
        {"targets": [4],"orderable": false},
        {"targets": [5],"orderable": false},
        {"targets": [6],"orderable": false},
        {"targets": [7],"orderable": false},
      ],
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('documents/fetch-records?value1=' + current.lastEvaluated.value1 +
          '&searchValue=' + this.filterValues.searchValue + "&from=" + this.filterValues.start + 
          "&to=" + this.filterValues.end, dataTablesParameters).subscribe(resp => {
            // current.fetchTrips(resp)
            current.documents = resp['Items'];
            // console.log(resp)
            if (resp['LastEvaluatedKey'] !== undefined) {
              current.lastEvaluated = {
                value1: resp['LastEvaluatedKey'].docID,
              }
            } else {
              current.lastEvaluated = {
                value1: '',
              }
            }

            callback({
              recordsTotal: current.totalRecords,
              recordsFiltered: current.totalRecords,
              data: []
            });
          });
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  searchFilter() {
    if(this.filterValues.startDate !== '' || this.filterValues.endDate !== '') {
      if(this.filterValues.startDate !== '') {
        let start = this.filterValues.startDate.split('-').reverse().join('-');
        this.filterValues.start = moment(start+' 00:00:01').format("X");
        this.filterValues.start = this.filterValues.start*1000;
      }
      if(this.filterValues.endDate !== '') {
        let end = this.filterValues.endDate.split('-').reverse().join('-');
        this.filterValues.end = moment(end+' 23:59:59').format("X");
        this.filterValues.end = this.filterValues.end*1000;
      }
      this.pageLength = this.totalRecords;
      this.rerender();
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.filterValues.startDate !== '' || this.filterValues.endDate !== '') {
      // this.spinner.show();
      this.filterValues = {
        searchValue: '',
        startDate: '',
        endDate: '',
        start: <any> '',
        end: <any> ''
      };
      this.pageLength = 10;
      this.rerender();
      // this.spinner.hide();
    } else {
      return false;
    }
    
  }
}
