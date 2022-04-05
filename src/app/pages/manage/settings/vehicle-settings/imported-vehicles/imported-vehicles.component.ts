import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
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
  @ViewChild('vehImporter') vehImporter: any;
  @ViewChild("importModel", { static: true })
  importModel: TemplateRef<any>;

  dataMessage: string = Constants.FETCHING_DATA;
  loaded = false;
  validData = [];
  importVehicles = [];

  isFileValid = false;
  inValidMessages = [];
  importDocs = [];
  check: boolean = false;
  submitDisabled: boolean = true;
  importModelRef: any;
  importData = {
    module: 'vehicle',
  }

  constructor(private apiService: ApiService, private toastr: ToastrService, private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.fetchVehicleImport()
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
            const dateformat = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
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

  pwdModalClose() {
    $('#importDocs').val('');
    this.inValidMessages = [];
  }

  async fetchVehicleImport() {
    this.loaded = true;
    let result = await this.apiService.getData('importer/get?type=vehicle').toPromise();
    if (result.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
      this.loaded = false;
    }
    if (result && result.length > 0) {
      this.importVehicles = result;
    }
    this.loaded = false;
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
            this.importModelRef.close();
            this.fetchVehicleImport();
          }
        })
      }
    }
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

  }

  /**
    * Clears the table filters
    * @param table Table 
    */
  clear(table: Table) {
    table.clear();
  }
}
