import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
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
  @ViewChild("importModel", { static: true })
  importModel: TemplateRef<any>;
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
  constructor(private apiService: ApiService, private location: Location, private toastr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.fetchAssetImport()
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
    this.loaded = true;
    let result = await this.apiService.getData('importer/get?type=asset').toPromise();
    if (result.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
      this.loaded = false;
    }
    if (result && result.length > 0) {
      this.importAssets = result;
    }
    this.loaded = false;
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
            // const dateformat = /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$/;
            const dateformat = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;
            return dateformat.test(date)
          }
        },
        {
          name: 'asset_type', inputName: 'assettype', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'status', inputName: 'status', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'year', inputName: 'year', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'licence_country', inputName: 'licencecountry', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }
        },
        {
          name: 'licence_province', inputName: 'licenceprovince/state', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
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
            this.inValidMessages = csvData.inValidMessages
            this.isFileValid = false;
            this.check = false;
            this.submitDisabled = true;
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
    let ngbModalOptions: NgbModalOptions = {
      keyboard: false,
      backdrop: "static",
      windowClass: "import-model--main",
    };
    this.importModelRef = this.modalService.open(this.importModel, ngbModalOptions)
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
  postDocument() {
    if (this.check == true) {
      if (this.uploadedDocs.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < this.uploadedDocs.length; i++) {
          formData.append("uploadedDocs", this.uploadedDocs[i])
        }
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
            this.importModelRef.close();
            this.fetchAssetImport();
          }
        })
      }
    }
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
}

