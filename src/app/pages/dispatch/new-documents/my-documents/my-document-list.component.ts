import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import {AwsUploadService} from '../../../../services/aws-upload.service';
import { SafeResourceUrl} from '@angular/platform-browser';
import { Auth } from 'aws-amplify';
declare var $: any;
import * as moment from "moment";
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

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
    categoryType: 'user',
    tripID: '',
    documentNumber: '',
    docType: '',
    documentName: '',
    description: '',    
    uploadedDocs: ''
  };

  totalRecords = 20;
  pageLength = 10;
  serviceUrl = '';
  filterValues = {
    docID: '',
    searchValue: '',
    startDate: '',
    endDate: '',
    start: <any> '',
    end: <any> ''
  };
  lastEvaluatedKey = '';
  suggestions = [];
  tripsObjects: any = {};

  docNext = false;
  docPrev = true;
  docDraw = 0;
  docPrevEvauatedKeys = [''];
  docStartPoint = 1;
  docEndPoint = this.pageLength;

  constructor(
    private apiService: ApiService,
    private awsUS: AwsUploadService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.selectedFileNames = new Map<any, any>();
   }

  ngOnInit() {
    this.fetchDocuments();
    this.fetchTrips();
    this.fetchTripsByIDs();
    this.initDataTable();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  fetchDocuments = () => {
    // this.spinner.show(); // loader init
    // this.totalRecords = 0;
    this.apiService.getData('documents?userType=user').subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        console.log('result11', result);
        this.totalRecords = result.Count;
      }
    });
  };

  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.currentUser = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }

  /*
   * Get all trips from api
   */
  fetchTrips() {
    this.apiService.getData('trips').subscribe((result: any) => {
      this.trips = result.Items;
    });
  }

   /*
   * Get all trips from api
   */
  fetchTripsByIDs() {
    this.apiService.getData('trips/get/list').subscribe((result: any) => {
      this.tripsObjects = result;
    });
  }

  addDocument() {
    this.hideErrors();
    this.apiService.postData('documents', this.documentData).
    subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
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
          this.toastr.success('Document Added successfully');
          $('#addDocumentModal').modal('hide');
          this.initDataTable();
          this.documentData.documentNumber = '';
          this.documentData.docType = '';
          this.documentData.tripID = '';
          this.documentData.documentName = '';
          this.documentData.description = '';
          this.documentData.uploadedDocs = '';
          
        }
      });
  }
  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error')
      });
    // this.vehicleForm.showErrors(this.errors);
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label')
      });
    this.errors = {};
  }

  /*
   * Selecting files before uploading
   */
  // selectDocuments(event) {
  //   this.selectedFiles = event.target.files;
  //   for (let i = 0; i <= this.selectedFiles.item.length; i++) {
  //     const randomFileGenerate = this.selectedFiles[i].name.split('.');
  //     const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;
  //     this.selectedFileNames.set(fileName, this.selectedFiles[i]);
  //     this.documentData.uploadedDocs.push(fileName);
  //   }
  // }
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
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
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
        this.toastr.success('Document Updated successfully');
        $('#addDocumentModal').modal('hide');
       this.initDataTable();
      }
    });
  }

  deactivateDoc(value, docID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`documents/isDeleted/${docID}/${value}`)
      .subscribe((result: any) => {
        this.initDataTable();
      });
    }
  }

  // initDataTable() {
  //   let current = this;
  //   this.dtOptions = { // All list options
  //     pagingType: 'full_numbers',
  //     pageLength: current.pageLength,
  //     serverSide: true,
  //     processing: true,
  //     order: [],
  //     buttons: [
  //       {
  //         extend: 'colvis',
  //         columns: ':not(.noVis)'
  //       }
  //     ],
  //     columnDefs: [
  //       {
  //         targets: 0,
  //         className: 'noVis',
  //         "orderable": false
  //       },
  //       {
  //         targets: 1,
  //         className: 'noVis',
  //         "orderable": false
  //       },
  //       {
  //         targets: 2,
  //         className: 'noVis',
  //         "orderable": false
  //       },
  //       {
  //         targets: 3,
  //         className: 'noVis',
  //         "orderable": false
  //       },
  //       {
  //         targets: 4,
  //         className: 'noVis',
  //         "orderable": false
  //       },
  //       {
  //         targets: 5,
  //         "orderable": false
  //       },
  //       {
  //         targets: 6,
  //         "orderable": false
  //       },
  //       {
  //         targets: 7,
  //         "orderable": false
  //       },
  //     ],
  //     dom: 'Bfrtip',
  //     ajax: (dataTablesParameters: any, callback) => {
  //       current.apiService.getDatatablePostData('documents/fetch-records?categoryType=user&value1=' + current.lastEvaluatedKey +
  //         '&searchValue=' + this.filterValues.docID + "&from=" + this.filterValues.start + 
  //         "&to=" + this.filterValues.end, dataTablesParameters).subscribe(resp => {
  //           current.documents = resp['Items'];
  //           console.log('documents', current.documents)
  //           // console.log(resp)
  //           if (resp['LastEvaluatedKey'] !== undefined) {
  //             current.lastEvaluatedKey = resp['LastEvaluatedKey'].docID
  //           } else {
  //             current.lastEvaluatedKey = ''
  //           }

  //           callback({
  //             recordsTotal: current.totalRecords,
  //             recordsFiltered: current.totalRecords,
  //             data: []
  //           });
  //         });
  //     }
  //   };
  // }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('documents/fetch/records?categoryType=user&searchValue=' + this.filterValues.docID + "&from=" + this.filterValues.start +"&to=" + this.filterValues.end + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        this.documents = result['Items'];
        if (this.filterValues.docID !== '' || this.filterValues.start !== '' || this.filterValues.end !== '') {
          this.docStartPoint = 1;
          this.docEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.docNext = false;
          // for prev button
          if (!this.docPrevEvauatedKeys.includes(result['LastEvaluatedKey'].docID)) {
            this.docPrevEvauatedKeys.push(result['LastEvaluatedKey'].docID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].docID;
          
        } else {
          this.docNext = true;
          this.lastEvaluatedKey = '';
          this.docEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.docDraw > 0) {
          this.docPrev = false;
        } else {
          this.docPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  searchFilter() {
    if(this.filterValues.startDate !== '' || this.filterValues.endDate !== '' || this.filterValues.searchValue !== '') {
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
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.filterValues.startDate !== '' || this.filterValues.endDate !== '' || this.filterValues.searchValue !== '') {
      // this.spinner.show();
      this.filterValues = {
        docID: '',
        searchValue: '',
        startDate: '',
        endDate: '',
        start: <any> '',
        end: <any> ''
      };
      this.pageLength = 10;
      this.initDataTable();
      // this.spinner.hide();
    } else {
      return false;
    }
  }

  getSuggestions(searchvalue='') {
    this.suggestions = [];
    if(searchvalue !== '') {
      this.apiService.getData('documents/get/suggestions/'+searchvalue).subscribe({
        complete: () => {},
        error: () => { },
        next: (result: any) => {
          this.suggestions = [];
          for (let i = 0; i < result.Items.length; i++) {
            const element = result.Items[i];
  
            let obj = {
              id: element.docID,
              name: element.documentNumber
            };
            this.suggestions.push(obj)
          }
        }
      })
    }    
  }

  searchSelectedRoute(document) {
    this.filterValues.docID = document.id;
    this.filterValues.searchValue = document.name;
    this.suggestions = [];
  }

  getStartandEndVal() {
    this.docStartPoint = this.docDraw * this.pageLength + 1;
    this.docEndPoint = this.docStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.docDraw += 1;
    this.initDataTable();
    this.getStartandEndVal();
  }

  // prev button func
  prevResults() {
    this.docDraw -= 1;
    this.lastEvaluatedKey = this.docPrevEvauatedKeys[this.docDraw];
    this.initDataTable();
    this.getStartandEndVal();
  }

  resetCountResult() {
    this.docStartPoint = 1;
    this.docEndPoint = this.pageLength;
    this.docDraw = 0;
  }
}
