import { Component, OnInit, ElementRef, ViewChild, TemplateRef, Input } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import CSVFileValidator, { ParsedResults, ValidatorConfig, } from 'csv-file-validator';
import Constants from '../../../constants';
import { Table } from 'primeng/table';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-imported-vehicles',
  templateUrl: './imported-vehicles.component.html',
  styleUrls: ['./imported-vehicles.component.css']
})
export class ImportedVehiclesComponent implements OnInit {
  @ViewChild('dt') table: Table;

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  dataMessage: string = Constants.FETCHING_DATA;
  loaded = false;
  validData = [];
  importVehicles = [];

  isFileValid = false;
  inValidMessages = [];
  importDocs = [];
  check: boolean = false;
  submitDisabled: boolean = true;

  importData = {
    module: 'vehicle',
  }

  // columns of data table
  dataColumns = [
    { field: 'displayName', header: 'File Name', type: "text" },
    { field: 'timeCreated', header: 'Uploaded', type: "text" },
    { field: "module", header: 'Module', type: 'text' },
    { field: 'fileStatus', header: 'Status', type: "text" },

  ];
  _selectedColumns: any[];

  display = false;

  constructor(private apiService: ApiService, private toastr: ToastrService, private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.setToggleOptions();
    this.fetchVehicleImport();
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
  validateCSV($event) {

    const data: ValidatorConfig = {
      headers: [
        {
          name: 'vehicle_name', inputName: 'vehiclename/number', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }, validate: function (name: string) {
            const vname = /^[a-zA-Z0-9\s]+$/;
            return vname.test(name)
          }
        },
        {
          name: 'vehicle_type', inputName: 'vehicletype', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'vin', inputName: 'vin', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }, validate: function (name: string) {
            const vinno = /^[a-zA-Z0-9]{17,18}$/;
            return vinno.test(name)
          }
        },
        {
          name: 'plate_number', inputName: 'platenumber', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'year', inputName: 'year', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }, validate: function (date: string) {
            const dateformat = /^\d{4}$/;
            return dateformat.test(date)
          }
        },
        {
          name: 'make', inputName: 'make', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'country', inputName: 'country', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'province', inputName: 'provincestate', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'status', inputName: 'status', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
      ]
    };
    CSVFileValidator($event.srcElement.files[0], data)
      .then(csvData => {
        if (csvData.data.length !== 0 && csvData.data.length < 201) {
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
              if (item.includes('vin')) {
                joinStr = item + '. VIN must be between 17-18 alphanumeric characters eg.2G1WH55K5Y9322458.';
                this.inValidMessages.push(joinStr)
              } else if (item.includes('year')) {
                joinStr = item + '.  Please enter the year in the format: YYYY';
                this.inValidMessages.push(joinStr)
              } else {
                this.inValidMessages.push(item)
              }
            }
            console.log('this.inValidMessages', this.inValidMessages)
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

  pwdModalClose() {
    $('#importDocs').val('');
    this.inValidMessages = [];
  }

  async fetchVehicleImport() {
    let result = await this.apiService.getData('importer/get?type=vehicle').toPromise();
    if (result.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
      this.loaded = true;
    }
    if (result && result.length > 0) {
      this.importVehicles = result;
    }
    this.loaded = true;
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
            this.toastr.success("The file has been scheduled for processing and you will be notified via email once it is completed")
            $('#importDocs').val('');
            this.display = false;
            this.fetchVehicleImport();
          }
        })
      }
    }
  }

  openModal() {
    this.display = true;
  }

  cancel() {
    this.inValidMessages = [];
    this.myInputVariable.nativeElement.value = "";
  }

  refreshData() {
   this.importVehicles = []
   this.fetchVehicleImport();
   this.dataMessage = Constants.FETCHING_DATA;
  }

  /**
    * Clears the table filters
    * @param table Table 
    */
  clear(table: Table) {
    table.clear();
  }
}
