import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import {SafeResourceUrl } from '@angular/platform-browser';
declare var $: any;
import * as moment from 'moment';
import { Auth } from 'aws-amplify';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-company-documents',
  templateUrl: './company-documents.component.html',
  styleUrls: ['./company-documents.component.css']
})
export class CompanyDocumentsComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  Asseturl = this.apiService.AssetUrl;
  public documents = [];
  trips;
  form;
  image;
  ifEdit = false;
  modalTitle = 'Add';
  docs: SafeResourceUrl;
  public documentsDocs = [];
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  documentMode: string = 'Manual';
  documentPrefix: string;
  documentSequence: string;
  allOptions: any = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  errors = {};
  carrierID: any;
  documentData = {
    categoryType: 'company',
    tripID: '',
    documentNumber: '',
    docType: '',
    documentName: '',
    description: '',
    uploadedDocs: []
  };
  totalRecords = 20;
  pageLength = 10;
  serviceUrl = '';
  filterValues = {
    docID: '',
    searchValue: '',
    startDate: '',
    endDate: '',
    start: <any>'',
    end: <any>''
  };
  lastEvaluatedKey = '';
  suggestions = [];
  currentID: string;
  uploadeddoc = [];
  newDoc: any;
  tripsObjects: any = {};
  currentUser;

  docNext = false;
  docPrev = true;
  docDraw = 0;
  docPrevEvauatedKeys = [''];
  docStartPoint = 1;
  docEndPoint = this.pageLength;

  constructor(
    private apiService: ApiService,
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

  selectDoc(event) {
    console.log('edd', event);
    let files = [...event.target.files];
    this.uploadeddoc = [];
    this.uploadeddoc.push(files[0])
  }

  fetchDocuments = () => {
    this.totalRecords = 0;
    this.apiService.getData('documents?categoryType=company').subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        console.log('doc result', result)
        this.totalRecords = result.Count;
      }
    });
  };

  saveDocumentMode() {
    if (this.documentMode !== 'Manual') {
      const prefixCode = `${this.documentPrefix}-${this.documentSequence}`;
      this.documentData['documentNumber'] = prefixCode;
    }
  }

  addDocument() {
    this.hideErrors();
    this.spinner.show();
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadeddoc.length; i++){
      formData.append('uploadedDocs', this.uploadeddoc[i]);
    }
    //append other fields
    formData.append('data', JSON.stringify(this.documentData));

    this.apiService.postData('documents', formData, true).

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
          this.spinner.hide();
          this.toastr.success('Document Added successfully');
          $('#addDocumentModal').modal('hide');
          this.fetchDocuments();
          this.initDataTable();
          this.documentData.documentNumber = '';
          this.documentData.docType = '';
          this.documentData.tripID = '';
          this.documentData.documentName = '';
          this.documentData.description = '';
        }
      });
  }

  throwErrors() {
    this.spinner.hide();
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error')
      });
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

  /*
    * Fetch Document details before updating
    */
  editDocument(id: any) {
    this.spinner.show();
    this.currentID = id;
    console.log('currentID', this.currentID);
    this.ifEdit = true;
    this.modalTitle = 'Edit';
    this.newDoc = '';
    this.apiService
      .getData(`documents/${this.currentID}`)
      .subscribe((result: any) => {
        console.log(result);
        result = result.Items[0];
        this.spinner.hide();
        this.documentData.tripID = result.tripID;
        this.documentData.documentNumber = result.documentNumber;
        this.documentData.documentName = result.documentName;
        this.documentData.docType = result.docType;
        this.documentData.description = result.description;
        this.documentData['uploadedDocs'] = result.uploadedDocs;
        this.newDoc = `${this.Asseturl}/${result.carrierID}/${result.uploadedDocs}`;
      });
    $('#addDocumentModal').modal('show');
  }

  updateDocument() {

    this.documentData['docID'] = this.currentID;
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadeddoc.length; i++){
      formData.append('uploadedDocs', this.uploadeddoc[i]);
    }
    //append other fields
    formData.append('data', JSON.stringify(this.documentData));

    this.apiService.putData('documents', formData, true).

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
          this.documentData.documentNumber = '';
          this.documentData.docType = '';
          this.documentData.tripID = '';
          this.documentData.documentName = '';
          this.documentData.description = '';
          this.initDataTable();
        }
      });
  }

  deactivateAsset(value, docID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
        .getData(`documents/isDeleted/${docID}/${value}`)
        .subscribe((result: any) => {
          this.fetchDocuments();
          this.initDataTable();
        });
    }
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('documents/fetch/records?categoryType=company&searchValue=' + this.filterValues.docID + "&from=" + this.filterValues.start +"&to=" + this.filterValues.end + '&lastKey=' + this.lastEvaluatedKey)
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

  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.currentUser = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }

  searchFilter() {
    if (this.filterValues.startDate !== '' || this.filterValues.endDate !== '' || this.filterValues.searchValue !== '') {
      if (this.filterValues.startDate !== '') {
        let start = this.filterValues.startDate;
        this.filterValues.start = moment(start + ' 00:00:01').format("X");
        this.filterValues.start = this.filterValues.start * 1000;
      }
      if (this.filterValues.endDate !== '') {
        let end = this.filterValues.endDate;
        this.filterValues.end = moment(end + ' 23:59:59').format("X");
        this.filterValues.end = this.filterValues.end * 1000;
      }
      this.pageLength = this.totalRecords;
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.filterValues.startDate !== '' || this.filterValues.endDate !== '' || this.filterValues.searchValue !== '') {
      this.filterValues = {
        docID: '',
        searchValue: '',
        startDate: '',
        endDate: '',
        start: <any>'',
        end: <any>''
      };
      this.pageLength = 10;
      this.initDataTable();
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
