import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import Constants from '../../constants';

import * as _ from 'lodash'
import CSVFileValidator, { ValidatorConfig, } from 'csv-file-validator';
import { Table } from 'primeng/table';
declare var $: any;

@Component({
  selector: 'app-import-drivers',
  templateUrl: './import-drivers.component.html',
  styleUrls: ['./import-drivers.component.css']
})
export class ImportDriversComponent implements OnInit {
  @ViewChild('dt') table: Table;

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  display = false;

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

  next: any = 'null';

  // columns of data table
  dataColumns = [
    { field: 'displayName', header: 'File Name', type: "text" },
    { field: 'timeCreated', header: 'Uploaded', type: "text" },
    { field: "module", header: 'Module', type: 'text' },
    { field: 'fileStatus', header: 'Status', type: "text" },

  ];
  _selectedColumns: any[];


  statuses = [
    { label: 'Uploaded', value: 'uploaded' },
    { label: 'Partially Processed', value: 'partially_processed' },
    { label: 'Processed', value: 'processed' },
  ]

  constructor(private apiService: ApiService, private toastr: ToastrService
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

  isStatusValid = (status) => {
    return status == 'active' || status == 'inActive';
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
          name: 'cdl', inputName: 'cdl', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          },
        },
        {
          name: 'status', inputName: 'status', required: true, validate: this.isStatusValid, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
      ]
    };
    CSVFileValidator($event.srcElement.files[0], data)
      .then(csvData => {
        console.log('csvData.data', csvData)
        if (csvData.data.length !== 0 && csvData.data.length < 200) {
          if (csvData.inValidMessages.length === 0) {
            this.validData = csvData.data;
            this.check = true;
            this.submitDisabled = false;
          }
          else {
            this.isFileValid = false;
            this.check = false;
            this.submitDisabled = true;

            for (let item of csvData.inValidMessages) {
              let joinStr = '';
              if (item.includes('birth_date') || item.includes('start_date')) {
                joinStr = item + '. Please enter the date in the format: YYYY-MM-DD';
                this.inValidMessages.push(joinStr)
              } else if (item.includes('status')) {
                joinStr = item + '. Status should be active or inActive';
                this.inValidMessages.push(joinStr)
              } else if (item.includes('username')) {
                joinStr = item + '. Username should be at-least 6 characters long and can be a combination of numbers, letters and dot(.)';
                this.inValidMessages.push(joinStr)
              } else if (item.includes('phone')) {
                joinStr = item + '. Enter valid phone number eg. 2234567891';
                this.inValidMessages.push(joinStr)
              } else if (item.includes('email')) {
                joinStr = item + '. Enter valid email eg. johnsmith@gmail.com';
                this.inValidMessages.push(joinStr)
              } else {
                this.inValidMessages.push(item)
              }
            }
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
        this.submitDisabled = true;
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
            this.display = false;
            this.importDrivers = [];
            this.next = '';
            this.fetchDriverImport();
          }
        })
      }
    }
  }

  async fetchDriverImport() {
    if (this.next === 'end') {
      return;
    }
    let result = await this.apiService.getData(`importer/get?type=driver&key=${this.next}`).toPromise();
    if (result.data.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
      this.loaded = true;
    }
    if (result && result.data.length > 0) {
      result.data.forEach(elem => {
        elem.timeCreated = new Date(elem.timeCreated).toLocaleString('en-CA');
        this.importDrivers.push(elem);
      });

      if (result.nextPage != undefined) {
        this.next = result.nextPage.replace(/#/g, '--');
      } else {
        this.next = 'end';
      }
    }
    this.loaded = true;
  }

  onScroll() {
    if (this.loaded) {
      this.fetchDriverImport();
    }
    this.loaded = false;
  }

  openModal() {
    this.display = true;
  }

  cancel() {
    this.inValidMessages = [];
    this.myInputVariable.nativeElement.value = "";
  }

  /**
     * Clears the table filters
     * @param table Table 
     */
  clear(table: Table) {
    table.clear();
  }


  refreshData() {
    this.importDrivers = [];
    this.next = '';
    this.fetchDriverImport();
    this.dataMessage = Constants.FETCHING_DATA;
  }

}
