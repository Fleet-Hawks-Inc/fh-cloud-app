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
import CSVFileValidator, { ParsedResults, ValidatorConfig, } from 'csv-file-validator';
import { Router } from '@angular/router'
import { threadId } from 'worker_threads';
declare var $: any;

@Component({
    selector: 'app-veh-import',
    templateUrl: './veh-import.component.html',
    styleUrls: ['./veh-import.component.css']
})
export class VehImportComponent implements OnInit {
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

chooseFile(event) {
    let files = event.target.files;
    let condition = true;
    if (condition) {
      this.importDocs = []
      this.importDocs = files
      this.inValidMessages = [];
      const reader = new FileReader();
      reader.addEventListener('load', (event:any) => {
        let csvdata = event.target.result;
      });
      reader.readAsBinaryString(event.target.files[0]);
    }
  }
    validateCSV($event) {
        console.log($event.srcElement.files[0]);
        const data: ValidatorConfig = {
            headers: [
                {
                    name: 'Vehicle Name/Number', inputName: 'vehiclename/number', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
                        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
                    },validate: function(name: string){      
                           const vname = /^[a-zA-Z0-9\s]+$/;
                            return vname.test(name)
                      }
                },
                {
                    name: 'Vehicle Type', inputName: 'vehicletype', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
                        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
                    }
                },
                {
                    name: 'VIN', inputName: 'vin', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
                        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
                    },validate: function(name: string){      
                           const vinno = /^[a-zA-Z0-9]{17,18}$/;
                            return vinno.test(name)
                      }
                },
                {
                    name: 'Plate Number', inputName: 'platenumber', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
                        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
                    }
                },
                {
                    name: 'Year', inputName: 'year', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
                        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
                    }
                },
                {
                    name: 'Make', inputName: 'make', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
                        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
                    }
                },
                {
                    name: 'Country', inputName: 'country', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
                        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
                    }
                },
                {
                    name: 'Province/State', inputName: 'provincestate', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
                        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
                    }
                },
                {
                    name: 'Status', inputName: 'status', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
                        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
                    }
                },
            ]
        };
 CSVFileValidator($event.srcElement.files[0], data)
     .then(csvData => {
        if(csvData.data.length !== 0 && csvData.data.length < 201){
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
          this.toastr.error("There are no records in the file uploaded") 
        }
       else {
         this.submitDisabled = true;
         this.toastr.error("'The file should contain a maximum of 200 records'")}
      })
      .catch(err => { })
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
      this.apiService.postData('vehicles/import/vehicle', formData, true).subscribe({
        complete: () => { },
        error: (err: any) => {
          this.submitDisabled = true;
          $('#importDocs').val('');
        },
        next: (res) => {
          this.submitDisabled = false;
          this.toastr.success("The file has been scheduled for processing and you will be notified via email once it is completed")
          $('#importDocs').val('');
          $('#importModel').modal('hide');
        }
      })
     }
    }
  }
}



    
    
