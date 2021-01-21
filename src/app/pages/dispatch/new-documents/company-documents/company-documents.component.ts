import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { map } from 'rxjs/operators';
import { from, Subject } from 'rxjs';
import { AwsUploadService } from '../../../../services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var $: any;
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { Auth } from 'aws-amplify';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-documents',
  templateUrl: './company-documents.component.html',
  styleUrls: ['./company-documents.component.css']
})
export class CompanyDocumentsComponent implements AfterViewInit, OnDestroy, OnInit {
  Asseturl = this.apiService.AssetUrl;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

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


  constructor(
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    private awsUS: AwsUploadService,
    private toastr: ToastrService,
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
    // this.spinner.show(); // loader init
    this.totalRecords = 0;
    this.apiService.getData('documents?categoryType=company').subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        for (let i = 0; i < result.Items.length; i++) {
         this.totalRecords += 1;
        }
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

          this.toastr.success('Document Added successfully');
          $('#addDocumentModal').modal('hide');
          this.rerender();
          this.documentData.documentNumber = '';
          this.documentData.docType = '';
          this.documentData.tripID = '';
          this.documentData.documentName = '';
          this.documentData.description = ''

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
  //   console.log(this.selectedFiles)
  //   for (let i = 0; i <= this.selectedFiles.length; i++) {
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
    console.log(this.selectedFileNames)
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
          this.documentData.description = '',
          // this.documentData.uploadedDocs = '';
          this.rerender();
        }
      });
  }

  deactivateAsset(value, docID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
        .getData(`documents/isDeleted/${docID}/${value}`)
        .subscribe((result: any) => {
          this.rerender();
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
      buttons: [
        {
          extend: 'colvis',
          columns: ':not(.noVis)'
        }
      ],
      columnDefs: [
        {
          targets: 0,
          className: 'noVis',
          "orderable": false
        },
        {
          targets: 1,
          className: 'noVis',
          "orderable": false
        },
        {
          targets: 2,
          className: 'noVis',
          "orderable": false
        },
        {
          targets: 3,
          className: 'noVis',
          "orderable": false
        },
        {
          targets: 4,
          className: 'noVis',
          "orderable": false
        },
        {
          targets: 5,
          "orderable": false
        },
        {
          targets: 6,
          "orderable": false
        },
        {
          targets: 7,
          "orderable": false
        },
      ],
      dom: 'Bfrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('documents/fetch-records?categoryType=company&value1=' + current.lastEvaluatedKey +
          '&searchValue=' + this.filterValues.docID + "&from=" + this.filterValues.start +
          "&to=" + this.filterValues.end, dataTablesParameters).subscribe(resp => {
            current.documents = resp['Items'];
            console.log('docum', current.documents)
            if (resp['LastEvaluatedKey'] !== undefined) {
              current.lastEvaluatedKey = resp['LastEvaluatedKey'].docID
            } else {
              current.lastEvaluatedKey = ''
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

  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.currentUser = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(status=''): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      if(status === 'reset') {
        this.dtOptions.pageLength = this.totalRecords;
      } else {
        this.dtOptions.pageLength = 10;
      }
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  searchFilter() {
    if (this.filterValues.startDate !== '' || this.filterValues.endDate !== '' || this.filterValues.searchValue !== '') {
      if (this.filterValues.startDate !== '') {
        let start = this.filterValues.startDate.split('-').reverse().join('-');
        this.filterValues.start = moment(start + ' 00:00:01').format("X");
        this.filterValues.start = this.filterValues.start * 1000;
      }
      if (this.filterValues.endDate !== '') {
        let end = this.filterValues.endDate.split('-').reverse().join('-');
        this.filterValues.end = moment(end + ' 23:59:59').format("X");
        this.filterValues.end = this.filterValues.end * 1000;
      }
      this.pageLength = this.totalRecords;
      this.rerender('reset');
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.filterValues.startDate !== '' || this.filterValues.endDate !== '' || this.filterValues.searchValue !== '') {
      // this.spinner.show();
      this.filterValues = {
        docID: '',
        searchValue: '',
        startDate: '',
        endDate: '',
        start: <any>'',
        end: <any>''
      };
      this.pageLength = 10;
      this.rerender();
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
}
