import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { ParsedResults, ValidatorConfig,  } from 'csv-file-validator';
import CSVFileValidator  from 'csv-file-validator';
import {Router} from '@angular/router'
import { threadId } from 'worker_threads';
declare var $: any;

@Component({
  selector: 'app-import-drivers',
  templateUrl: './import-drivers.component.html',
  styleUrls: ['./import-drivers.component.css']
})
export class ImportDriversComponent implements OnInit {
  @ViewChild('vehImporter') vehImporter: any

validData = [];
isFileValid = false;
inValidMessages = [];
importDocs = [];
check:boolean = false;
submitDisabled: boolean = true;

  constructor(private apiService: ApiService, private toastr: ToastrService
) { }

  ngOnInit(): void {
  }
 
 validateCSV($event) {
        const data: ValidatorConfig = {
      headers: [
        {
          name: 'Employee ID', inputName: 'employeeId', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }
        },
          {
          name: 'Username', inputName: 'username', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }, validate: function(name: string){      
           const nameformat = /^(?=[a-zA-Z0-9.]{6,20}$)(?!.*[.]{2})[^.].*[^.]$/;
           return nameformat.test(name)
          }
        },
        {
          name: 'First Name', inputName: 'firstName', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }
        },
        {
          name: 'Last Name', inputName: 'lastName', required: true, requiredError: function (headerName, rowNumber, columnNumber){
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }
        },
         {
          name: 'Birth Date', inputName: 'birthDate', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          },validate: function(date: string){      
           const dateformat = /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$/;
           return dateformat.test(date)
          }
        },
         {
          name: 'Phone', inputName: 'phone', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          },validate: function(phoneno: string){      
           const phoneformat = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
           return phoneformat.test(phoneno)
          }
        },
        {
          name: 'Email', inputName: 'email', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }, validate: function (email: string) {
            const reqExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
            return reqExp.test(email)
          }
        },
        {
          name: 'Start Date', inputName: 'startDate', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          },validate: function(date: string){      
           const dateformat = /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$/;  
           return dateformat.test(date)
          }
        },
         {
          name: 'Citizenship', inputName: 'citizenship', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          },
        },
         {
          name: 'CDL#', inputName: 'cdl', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          },
        },
      ]
    };
    CSVFileValidator($event.srcElement.files[0], data)
     .then(csvData => {
        if(csvData.data.length !== 0 && csvData.data.length < 200){
          if(csvData.inValidMessages.length === 0)
          {
            this.validData = csvData.data;
            this.check = true;
            this.submitDisabled = false;
          }
          else
          {
            this.inValidMessages = csvData.inValidMessages 
            this.isFileValid = false;
            this.check = false;
            this.submitDisabled = true;
          }
          csvData.data
        }else if(csvData.data.length == 0){
          this.submitDisabled = true;
          this.toastr.error("Don't upload empty CSV.") 
        }
       else {
         this.submitDisabled = true;
         this.toastr.error("'Recored should be less than 200'")}
      })
      .catch(err => { })
  }

chooseFile(event) {
    let files = event.target.files;
    let condition = true;
    if (condition) {
      this.importDocs = []
      this.importDocs = files
      const reader = new FileReader();
      reader.addEventListener('load', (event:any) => {
        let csvdata = event.target.result;
      });
      reader.readAsBinaryString(event.target.files[0]);
    }
  }
  
  pwdModalClose(){
   $('#importDocs').val('');
   this.inValidMessages = [];
  }

  uploadImport() {
    if(this.check == true){
    if (this.importDocs.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < this.importDocs.length; i++) {
        formData.append("importDocs", this.importDocs[i])
      }
      this.apiService.postData('drivers/import/updrivers', formData, true).subscribe({
        complete: () => { },
        error: (err: any) => {
          this.submitDisabled = true;
          $('#importDocs').val('');
        },
        next: (res) => {
          this.submitDisabled = false;
          this.toastr.success("Imported Successfully")
          $('#importDocs').val('');
          $('#importModel').modal('hide');
        }
      })
     }
    }
  }

}
