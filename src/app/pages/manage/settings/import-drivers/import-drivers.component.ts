import { Component, OnInit, ElementRef, ViewChild, Input, TemplateRef } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Constants from '../../constants';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment'
import * as _ from 'lodash'
import { ViewEncapsulation } from '@angular/core';
import { SelectionType, ColumnMode } from "@swimlane/ngx-datatable";
import CSVFileValidator, { ParsedResults, ValidatorConfig, } from 'csv-file-validator';
import { Router } from '@angular/router'
import { threadId } from 'worker_threads';
import { Table } from 'primeng/table';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-import-drivers',
  templateUrl: './import-drivers.component.html',
  styleUrls: ['./import-drivers.component.css']
})
export class ImportDriversComponent implements OnInit {
  @ViewChild('vehImporter') vehImporter: any;;
  @ViewChild('dt') table: Table;

  @ViewChild("importModel", { static: true })
  importModel: TemplateRef<any>;

  dataMessage: string = Constants.FETCHING_DATA;
  loaded = false;
  validData = [];
  importDrivers = [];

  isFileValid = false;
  inValidMessages = [];
  importDocs = [];
  importData = {
    module: 'driver',
  }
  check: boolean = false;
  submitDisabled: boolean = true;

  // columns of data table
  dataColumns = [
    { field: 'status', header: 'Status', type: "text" },
    { field: 'timeCreated', header: 'Uploaded', type: "text" },
    { field: 'docs[0].displayName', header: 'File Name', type: "text" },
    { field: "module", header: 'Module', type: 'text' },

  ];
  _selectedColumns: any[];
  importModelRef: any;

  constructor(private apiService: ApiService, private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.setToggleOptions();
    this.fetchDriverImport();
  }

  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));

  }

  validateCSV($event) {
    const data: ValidatorConfig = {
      headers: [
        {
          name: 'employee_id', inputName: 'employeeId', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }
        },
        {
          name: 'username', inputName: 'username', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }, validate: function (name: string) {
            const nameformat = /^(?=[a-zA-Z0-9.]{6,20}$)(?!.*[.]{2})[^.].*[^.]$/;
            return nameformat.test(name)
          }
        },
        {
          name: 'first_name', inputName: 'firstName', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }
        },
        {
          name: 'last_name', inputName: 'lastName', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }
        },
        {
          name: 'birth_date', inputName: 'birthDate', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }, validate: function (date: string) {
            const dateformat = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
            return dateformat.test(date)
          }
        },
        {
          name: 'phone', inputName: 'phone', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }, validate: function (phoneno: string) {
            const phoneformat = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
            return phoneformat.test(phoneno)
          }
        },
        {
          name: 'email', inputName: 'email', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }, validate: function (email: string) {
            const reqExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
            return reqExp.test(email)
          }
        },
        {
          name: 'start_date', inputName: 'startDate', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }, validate: function (date: string) {
            const dateformat = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
            return dateformat.test(date)
          }
        },
        {
          name: 'citizenship', inputName: 'citizenship', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          },
        },
        {
          name: 'cdl', inputName: 'cdl', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          },
        },
      ]
    };
    CSVFileValidator($event.srcElement.files[0], data)
      .then(csvData => {
        if (csvData.data.length !== 0 && csvData.data.length < 200) {
          if (csvData.inValidMessages.length === 0) {
            this.validData = csvData.data;
            this.check = true;
            this.submitDisabled = false;
          }
          else {
            this.inValidMessages = csvData.inValidMessages
            this.isFileValid = false;
            this.check = false;
            this.submitDisabled = true;
          }
          csvData.data
        } else if (csvData.data.length == 0) {
          this.submitDisabled = true;
          this.toastr.error("There are no records in the file uploaded")
        }
        else {
          this.submitDisabled = true;
          this.toastr.error("'The file should contain a maximum of 200 records'")
        }
      })
      .catch(err => { })
  }

  chooseFile(event) {
    let files = event.target.files;
    let condition = true;
    if (condition) {
      this.importDocs = []
      this.importDocs = files
      this.inValidMessages = [];
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        let csvdata = event.target.result;
      });
      reader.readAsBinaryString(event.target.files[0]);
    }
  }

  pwdModalClose() {
    $('#importDocs').val('');
    this.inValidMessages = [];
  }

  uploadImport() {
    if (this.check == true) {
      if (this.importDocs.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < this.importDocs.length; i++) {
          formData.append("importDocs", this.importDocs[i])
        }
        //append other fields
        formData.append("data", JSON.stringify(this.importData));

        this.apiService.postData('importer', formData, true).subscribe({
          complete: () => { },
          error: (err: any) => {
            this.submitDisabled = true;
            $('#importDocs').val('');
          },
          next: (res) => {
            this.submitDisabled = false;
            this.toastr.success("The file has been scheduled for processing and you will be notified via email once it is completed.")
            $('#importDocs').val('');
            this.importModelRef.close();
            this.fetchDriverImport();
          }
        })
      }
    }
  }

  async fetchDriverImport() {
    this.loaded = true;
    let result = await this.apiService.getData('importer/get?type=driver').toPromise();
    if (result.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
      this.loaded = false;
    }
    if (result && result.length > 0) {
      this.importDrivers = result;
    }
    this.loaded = false;
  }

  openModal() {
    let ngbModalOptions: NgbModalOptions = {
      keyboard: false,
      backdrop: "static",
      windowClass: "import-model--main",
    };
    this.importModelRef = this.modalService.open(this.importModel, ngbModalOptions)
  }

  /**
     * Clears the table filters
     * @param table Table 
     */
  clear(table: Table) {
    table.clear();
  }


  refreshData() {
    this.importDrivers = []
    this.fetchDriverImport();
    this.dataMessage = Constants.FETCHING_DATA;
  }

}
