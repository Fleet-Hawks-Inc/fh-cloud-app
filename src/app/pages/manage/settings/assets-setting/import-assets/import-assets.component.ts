import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ParsedResults, ValidatorConfig} from 'csv-file-validator';
import CSVFileValidator  from 'csv-file-validator';

declare var $: any;

@Component({
  selector: 'app-import-assets',
  templateUrl: './import-assets.component.html',
  styleUrls: ['./import-assets.component.css']
})
export class ImportAssetsComponent implements OnInit {
  uploadedDocs = [];
   error={
    hasError:false,
    message:'',
    attributes:[]
   }
    csvHeader: any = [];
    array: any = [];
    validData = {};
    isFileValid = false;
    inValidMessages = [];
    check:boolean = false;
    submitDisabled: boolean = true;

  constructor(private apiService: ApiService, private toastr: ToastrService) {  }

  ngOnInit(): void {
  }
  
  selectDoc(event) {
    this.error.hasError=false
    this.error.message=''
    this.error.attributes=[]
    let files = event.target.files;
    let condition = true;
    if (condition) {
      this.uploadedDocs = []
      this.uploadedDocs = files
      const reader = new FileReader();
      reader.addEventListener('load', (event:any) => {
        let csvdata = event.target.result;
      });
      reader.readAsBinaryString(event.target.files[0]);
    }
  }


  validateCSV($event) {
        const data: ValidatorConfig = {
      headers: [
        {
          name: 'Asset Name/Number', inputName: 'Asset Name/Number', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'VIN', inputName: 'VIN', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          },validate: function(vin: string){      
           const vinformat = /^[a-zA-Z0-9\s]{17,18}$/; 
           return vinformat.test(vin)
          }
        },
        {
          name: 'Start Date', inputName: 'Start Date', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          },validate: function(date: string){      
             const dateformat = /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$/; 
           return dateformat.test(date)
          }
        },
        {
          name: 'Asset Type', inputName: 'Asset Type', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'Status', inputName: 'Status', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'Year', inputName: 'Year', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          },validate: function(vin: string){      
           const vinformat = /^[0-9\s]{4}$/; 
           return vinformat.test(vin)
          }
        },
        {
          name: 'Licence Country', inputName: 'Licence Country', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'Licence Province/State', inputName: 'Licence Province/State', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'Licence Plate Number', inputName: 'Licence Plate Number', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          },validate: function(vin: string){      
           const vinformat = /^[A-Z0-9\s]/; 
           return vinformat.test(vin)
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
            this.inValidMessages = [];
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
         this.toastr.error("No of records in CSV can not more than 200.")}
      })
      .catch(err => { })
  }
  
  modalClose(){
   $('#uploadedDocs').val('');
   this.inValidMessages = [];
  }
  
  postDocument() {
    this.error.hasError=false
    this.error.message=''
    if(this.check == true){
    if (this.uploadedDocs.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < this.uploadedDocs.length; i++) {
        formData.append("uploadedDocs", this.uploadedDocs[i])
      }
      this.apiService.postData('assets/import/CSV', formData, true).subscribe({
        complete: () => { },
        error: (err: any) => {
          this.error.hasError=true
          this.error.message=err
          this.submitDisabled = true;
          $('#uploadedDocs').val('');
        },
        next: (res) => {
          this.error.hasError=false
          this.error.message=''
          this.error.attributes=[]
          this.submitDisabled = false;
          this.toastr.success("Imported Successfully")
          $('#uploadedDocs').val('');
          $('#importModel').modal('hide');
        }
      })
     }
    }
  }
}
