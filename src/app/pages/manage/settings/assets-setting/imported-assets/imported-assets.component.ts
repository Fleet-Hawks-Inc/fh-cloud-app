import { Component, OnInit, ViewChild, TemplateRef, Input, ElementRef } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ParsedResults, ValidatorConfig } from 'csv-file-validator';
import CSVFileValidator from 'csv-file-validator';
import Constants from '../../../constants';
import { Table } from 'primeng/table';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
declare var $: any;

@Component({
  selector: 'app-imported-assets',
  templateUrl: './imported-assets.component.html',
  styleUrls: ['./imported-assets.component.css']
})
export class ImportedAssetsComponent implements OnInit {
  @ViewChild('dt') table: Table;
  @ViewChild('asstImporter') asstImporter: any;

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  display = false;

  loaded = false;
  dataMessage: string = Constants.FETCHING_DATA;
  uploadedDocs = [];
  error = {
    hasError: false,
    message: '',
    attributes: []
  }
  csvHeader: any = [];
  array: any = [];
  validData = {};
  isFileValid = false;
  inValidMessages = [];
  check: boolean = false;
  submitDisabled: boolean = true;
  importAssets = [];
  importModelRef: any;
  importData = {
    module: 'asset',
  }
  // columns of data table
  dataColumns = [
    { field: 'displayName', header: 'File Name', type: "text" },
    { field: 'timeCreated', header: 'Uploaded', type: "text" },
    { field: "module", header: 'Module', type: 'text' },
    { field: 'fileStatus', header: 'Status', type: "text" },

  ];
  _selectedColumns: any[];

  constructor(private apiService: ApiService, private location: Location, private toastr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.setToggleOptions();
    this.fetchAssetImport()
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

  selectDoc(event) {
    this.error.hasError = false
    this.error.message = ''
    this.error.attributes = []
    let files = event.target.files;
    let condition = true;
    if (condition) {
      this.uploadedDocs = []
      this.uploadedDocs = files
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        let csvdata = event.target.result;
      });
      reader.readAsBinaryString(event.target.files[0]);
    }
  }
  async fetchAssetImport() {

    let result = await this.apiService.getData('importer/get?type=asset').toPromise();
    if (result.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
      this.loaded = true;
    }
    if (result && result.length > 0) {
      this.importAssets = result;
    }
    this.loaded = true;
  }

  isStatusValid = (status) => {
    return status == 'active' || status == 'inActive';
  }


  validateCSV($event) {
    const data: ValidatorConfig = {
      headers: [
        {
          name: 'asset_name', inputName: 'assetname/number', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'vin', inputName: 'vin', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }, validate: function (name: string) {
            const vinformat = /^[a-zA-Z0-9]{17,18}$/;
            return vinformat.test(name)
          }
        },
        {
          name: 'start_date', inputName: 'startdate', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }, validate: function (date: string) {
            const dateformat = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;
            return dateformat.test(date)
          }
        },
        {
          name: 'status', inputName: 'status', required: true, validate: this.isStatusValid, requiredError: function (headerName, rowNumber, columnNumber) {
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
          name: 'licence_plate_number', inputName: 'licenceplatenumber', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }, validate: function (vin: string) {
            const vinformat = /^[A-Z0-9\s]/;
            return vinformat.test(vin)
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
            this.inValidMessages = [];
          }
          else {
            this.isFileValid = false;
            this.check = false;
            this.submitDisabled = true;
            for (let item of csvData.inValidMessages) {
              let joinStr = '';
              if (item.includes('start_date')) {
                joinStr = item + '. Please enter the date in the format: YYYY-MM-DD';
                this.inValidMessages.push(joinStr)
              } else if (item.includes('year')) {
                joinStr = item + '.  Please enter the year in the format: YYYY';
                this.inValidMessages.push(joinStr)
              } else if (item.includes('vin')) {
                joinStr = item + '. VIN must be between 17-18 alphanumeric characters eg.2G1WH55K5Y9322458.';
                this.inValidMessages.push(joinStr)
              } else if (item.includes('status')) {
                joinStr = item + '.  Status should be active or inActive';
                this.inValidMessages.push(joinStr)
              } else {
                this.inValidMessages.push(item)
              }
            }
          }
          csvData.data
        } else if (csvData.data.length == 0) {
          this.submitDisabled = true;
          this.toastr.error("There are no records in the file uploaded.")
        }
        else {
          this.submitDisabled = true;
          this.toastr.error("The file should contain a maximum of 200 records.")
        }
      })
      .catch(err => { })
  }


  openModal() {
    this.display = true;
  }

  refreshData() {
    this.importAssets = []
    this.fetchAssetImport();
    this.dataMessage = Constants.FETCHING_DATA;
  }

  modalClose() {
    $('#uploadedDocs').val('');
    this.inValidMessages = [];
  }
  /**
    * Clears the table filters
    * @param table Table 
    */
  clear(table: Table) {
    table.clear();
  }
  uploadImport() {

    if (this.check == true) {
      if (this.uploadedDocs.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < this.uploadedDocs.length; i++) {
          formData.append("uploadedDocs", this.uploadedDocs[i])
        }
        this.submitDisabled = true;
        //append other fields
        formData.append("data", JSON.stringify(this.importData));
        this.apiService.postData('importer', formData, true).subscribe({
          complete: () => { },
          error: (err: any) => {
            this.submitDisabled = true;
            $('#uploadedDocs').val('');
          },
          next: (res) => {
            this.submitDisabled = false;
            this.toastr.success("The file has been scheduled for processing and you will be notified via email once it is completed.")
            $('#uploadedDocs').val('');
            this.display = false;
            this.fetchAssetImport();
          }
        })
      }
    }
  }

  cancel() {
    this.inValidMessages = [];
    this.myInputVariable.nativeElement.value = "";
  }

}

