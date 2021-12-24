import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';
declare var $: any;
import * as moment from 'moment';
import { Auth } from 'aws-amplify';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Constants from '../../../fleet/constants';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'app-company-documents',
  templateUrl: './company-documents.component.html',
  styleUrls: ['./company-documents.component.css']
})
export class CompanyDocumentsComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  environment = environment.isFeatureEnabled;
  Asseturl = this.apiService.AssetUrl;
  public documents = [];
  trips = [];
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
  submitDisabled = false;
  documentData = {
    categoryType: 'company',
    tripID: null,
    documentNumber: '',
    docType: null,
    // documentName: '',
    description: '',
    uploadedDocs: [],
    dateCreated: moment().format('YYYY-MM-DD')
  };
  totalRecords = 0;
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
  currentID = null;
  uploadeddoc = [];
  newDoc: any = [];
  tripsObjects: any = {};
  currentUser;
  docError = false; // to show error if doc is not uploaded
  docNext = false;
  docPrev = true;
  docDraw = 0;
  docPrevEvauatedKeys = [''];
  docStartPoint = 1;
  docEndPoint = this.pageLength;
  descriptionData = '';
  documentNumberDisabled = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  alltrips = [];

  getSuggestions = _.debounce(function (searchvalue) {
    this.suggestions = [];
    if (searchvalue !== '') {
      this.apiService.getData('documents/get/suggestions/' + searchvalue).subscribe({
        complete: () => { },
        error: () => { },
        next: (result: any) => {
          this.suggestions = [];
          for (let i = 0; i < result.length; i++) {
            const element = result[i];

            let obj = {
              id: element.docID,
              name: element.documentNumber
            };
            this.suggestions.push(obj);
          }
        }
      });
    }
  }, 800);
  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.selectedFileNames = new Map<any, any>();
  }

  ngOnInit() {
    this.fetchDocumentsCount();
    this.fetchTrips();
    this.fetchTripsByIDs();
    // this.fetchLastDocumentNumber();

    $(document).ready(() => {
      // this.form = $('#form_').validate();
    });
  }
  /*
   * Get all trips from api
   */
  fetchTrips() {
    this.apiService.getData('trips').subscribe((result: any) => {
      this.alltrips = result.Items;
      result.Items.forEach((element) => {
        if (element.isDeleted === 0) {
          this.trips.push(element);
        }

        if (element.isDeleted === 1 && element.tripID === this.documentData.tripID) {
          this.documentData.tripID = null;
        }
      });
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
  fetchDocumentsCount() {
    this.apiService.getData('documents/get/count?categoryType=company&searchValue=' + this.filterValues.searchValue + "&from=" + this.filterValues.start + "&to=" + this.filterValues.end).subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.totalRecords = result.Count;

        if (this.filterValues.searchValue != '' || this.filterValues.start != '' || this.filterValues.end != '') {
          this.docEndPoint = this.totalRecords;
        }
        this.initDataTable();
      },
    });
  }

  selectDoc(event) {
    let files = [...event.target.files];
    let condition = true;

    for (let i = 0; i < files.length; i++) {
      const element = files[i];
      let name = element.name.split('.');
      let ext = name[name.length - 1].toLowerCase();


      if (ext !== 'jpg' && ext !== 'pdf' && ext !== 'jpeg' && ext !== 'png') {
        $('#uploadedDocs').val('');
        condition = false;
        this.toastr.error('Only pdf, jpg, jpeg and png file formats are allowed');
        return false;
      }
    }

    if (condition) {
      this.uploadeddoc = [];

      this.uploadeddoc = files;
    }
  }

  fetchDocuments = () => {
    this.totalRecords = 0;
    this.apiService.getData('documents/get/count?categoryType=company&searchValue=' + this.filterValues.searchValue + "&from=" + this.filterValues.start + "&to=" + this.filterValues.end).subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {

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

  onAddDocument() {
    if (this.uploadeddoc.length > 0) {
      this.submitDisabled = true;
      this.hideErrors();
      this.spinner.show();
      // create form data instance
      const formData = new FormData();

      // append photos if any
      for (let i = 0; i < this.uploadeddoc.length; i++) {
        formData.append('uploadedDocs', this.uploadeddoc[i]);
      }

      // append other fields
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
                  this.submitDisabled = false;
                  // this.throwErrors();
                },
                error: () => { this.submitDisabled = false; },
                next: () => { },
              });
          },
          next: (res) => {
            this.spinner.hide();
            this.toastr.success('Document Added successfully');
            $('#addDocumentModal').modal('hide');
            this.documentData.documentNumber = '';
            this.documentData.docType = null;
            this.documentData.tripID = null;
            this.documentData.uploadedDocs = [];
            this.uploadeddoc = [];
            $('#uploadedDocs').val('');
            // this.documentData.documentName = '';
            this.documentData.description = '';
            this.lastEvaluatedKey = '';
            this.fetchDocumentsCount();
            this.submitDisabled = false;
          }
        });
    } else {
      this.docError = true;
    }

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
    * Fetch Document details before updating
    */
  editDocument(id: any) {

    this.spinner.show();
    this.currentID = id;
    this.docError = false;
    this.ifEdit = true;
    this.modalTitle = 'Edit';
    this.newDoc = [];
    
    this.apiService
      .getData(`documents/${this.currentID}`)
      .subscribe((result: any) => {

        result = result.Items[0];
        this.spinner.hide();
        this.documentData.tripID = result.tripID;
        this.alltrips.forEach((element) => {
          if (element.isDeleted === 1 && element.tripID === this.documentData.tripID) {
            this.documentData.tripID = null;
          }
        });
        this.documentData.documentNumber = result.documentNumber;
        // this.documentData.documentName = result.documentName;
        this.documentData.docType = result.docType;
        this.documentData.description = result.description;
        this.documentData[`timeCreated`] = result.timeCreated;
        this.documentData.dateCreated = result.dateCreated;
        this.documentData.uploadedDocs = result.uploadedDocs;
        // this.uploadeddoc = result.uploadedDocs;
                if (
          result.uploadedDocs !== undefined &&
          result.uploadedDocs.length > 0
        ) {
          result.uploadedDocs.forEach((x: any) => {
            if (
              x.storedName.split(".")[1] === "jpg" ||
              x.storedName.split(".")[1] === "png" ||
              x.storedName.split(".")[1] === "jpeg"
            ) {
              const obj = {
                imgPath: `${x.urlPath}`,
                docPath: `${x.urlPath}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
              this.newDoc.push(obj);
            } else {
              const obj = {
                imgPath: 'assets/img/icon-pdf.png',
                docPath: `${x.urlPath}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
              this.newDoc.push(obj);
            }
          });
        }
        
/*
        if (result.uploadedDocs.length > 0) {
          result.uploadedDocs.forEach((x: any) => {
            let obj: any = {};
            if (
              x.storedName.split(".")[1] === "jpg" ||
              x.storedName.split(".")[1] === "png" ||
              x.storedName.split(".")[1] === "jpeg"
            ) {
              obj = {
                imgPath: `${this.Asseturl}/${result.carrierID}/${x.storedName}`,
                docPath: `${this.Asseturl}/${result.carrierID}/${x.storedName}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
            } else {
              obj = {
                imgPath: "assets/img/icon-pdf.png",
                docPath: `${this.Asseturl}/${result.carrierID}/${x.storedName}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
            }
            this.newDoc.push(obj);
          });
        }
*/
      });
    $('#addDocumentModal').modal('show');
  }

  onUpdateDocument() {
    if (this.uploadeddoc.length > 0 || this.documentData.uploadedDocs.length > 0) {
      this.submitDisabled = true;
      this.documentData[`docID`] = this.currentID;
      // create form data instance
      const formData = new FormData();
      //append photos if any
      if (this.uploadeddoc.length > 0) {
        for (let i = 0; i < this.uploadeddoc.length; i++) {
          formData.append('uploadedDocs', this.uploadeddoc[i]);
        }
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
                  this.submitDisabled = false;
                  // this.throwErrors();
                },
                error: () => {
                  this.submitDisabled = false;
                },
                next: () => { },
              });
          },
          next: (res) => {

            this.toastr.success('Document Updated successfully');
            $('#addDocumentModal').modal('hide');
            this.documentData.documentNumber = '';
            this.documentData.docType = null;
            this.documentData.tripID = '';
            this.documentData.uploadedDocs = [];
            $('#uploadedDocs').val('');
            // this.documentData.documentName = '';
            this.documentData.description = '';
            this.lastEvaluatedKey = '';
            this.currentID = null;
            this.initDataTable();
            this.submitDisabled = false;
          }
        });
    } else {
      this.docError = true;
    }
  }

  deactivateAsset(value, docID, docNo: any) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
        .deleteData(`documents/isDeleted/${docID}/${docNo}/${value}`)
        .subscribe((result: any) => {
          this.documents = [];
          this.docDraw = 0;
          this.lastEvaluatedKey = '';
          this.dataMessage = Constants.FETCHING_DATA;

          this.toastr.success('Document deleted successfully.');
          this.fetchDocuments();
          this.initDataTable();
        });
    }
  }

  initDataTable() {
    this.spinner.show();

    this.apiService.getData('documents/fetch/records?categoryType=company&searchValue=' + this.filterValues.searchValue + "&from=" + this.filterValues.start + "&to=" + this.filterValues.end + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if (result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestions = [];
        this.getStartandEndVal();
        this.documents = result['Items'];
        if (this.filterValues.searchValue !== '' || this.filterValues.start !== '' || this.filterValues.end !== '') {
          this.docStartPoint = 1;
          this.docEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].docSK.replace(/#/g, '--');
          this.docNext = false;
          // for prev button
          if (!this.docPrevEvauatedKeys.includes(lastEvalKey)) {
            this.docPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKey = lastEvalKey;

        } else {
          this.docNext = true;
          this.lastEvaluatedKey = '';
          this.docEndPoint = this.totalRecords;
        }

        if (this.totalRecords < this.docEndPoint) {
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
    if (this.filterValues.startDate === null) this.filterValues.startDate = ''
    if (this.filterValues.endDate === null) this.filterValues.endDate = ''
    if (this.filterValues.startDate != '' || this.filterValues.endDate != '' || this.filterValues.searchValue != '') {
      if (this.filterValues.startDate != '' && this.filterValues.endDate == '') {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.filterValues.startDate == '' && this.filterValues.endDate != '') {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.filterValues.startDate > this.filterValues.endDate) {
        this.toastr.error('Start date should be less then end date');
        return false;
      } else {
        this.dataMessage = Constants.FETCHING_DATA;
        this.documents = [];
        this.suggestions = [];
        this.filterValues.searchValue = this.filterValues.searchValue.toLowerCase();
        if (this.filterValues.startDate !== '') {
          this.filterValues.start = this.filterValues.startDate;
        }
        if (this.filterValues.endDate !== '') {
          this.filterValues.end = this.filterValues.endDate;
        }
        // this.pageLength = this.totalRecords;
        this.fetchDocumentsCount();
      }
    } else {
      this.toastr.error('Please fill at least one field')
      return false;
    }
  }

  resetFilter() {
    if (this.filterValues.startDate !== '' || this.filterValues.endDate !== '' || this.filterValues.searchValue !== '') {
      this.dataMessage = Constants.FETCHING_DATA;
      this.documents = [];
      this.suggestions = [];
      this.filterValues = {
        docID: '',
        searchValue: '',
        startDate: '',
        endDate: '',
        start: <any>'',
        end: <any>''
      };
      this.resetCountResult();
      this.fetchDocumentsCount();

    } else {
      return false;
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
    this.docNext = true;
    this.docPrev = true;
    this.docDraw += 1;
    this.initDataTable();
  }

  // prev button func
  prevResults() {
    this.docPrev = true;
    this.docNext = true;
    this.docDraw -= 1;
    this.lastEvaluatedKey = this.docPrevEvauatedKeys[this.docDraw];
    this.initDataTable();
  }

  resetCountResult() {
    this.lastEvaluatedKey = '';
    this.docStartPoint = 1;
    this.docEndPoint = this.pageLength;
    this.docDraw = 0;
  }

  openDocumentModal() {
    this.fetchLastDocumentNumber();
    this.currentID = null;
    this.documentData = {
      categoryType: 'company',
      tripID: null,
      documentNumber: '',
      docType: null,
      // documentName: '',
      description: '',
      uploadedDocs: [],
      dateCreated: moment().format('YYYY-MM-DD')
    };
    this.newDoc = '';

    $("#addDocumentModal").modal('show');
  }

  showDescModal(description) {
    this.descriptionData = description;
    $("#routeNotes").modal('show');
  }

  fetchLastDocumentNumber() {
    this.apiService.getData('documents/get/last/number').subscribe((result) => {
      this.documentNumberDisabled = true;
      this.documentData.documentNumber = result.toString();
    });
  }

  refreshData() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.documents = [];
    this.suggestions = [];
    this.filterValues = {
      docID: '',
      searchValue: '',
      startDate: '',
      endDate: '',
      start: <any>'',
      end: <any>''
    };
    this.lastEvaluatedKey = '';
    this.resetCountResult();
    this.fetchDocumentsCount();
  }
}
