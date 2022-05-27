import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import CSVFileValidator, { ValidatorConfig } from 'csv-file-validator';
import { Table } from 'primeng/table';
import Constants from '../../constants';
import { ToastrService } from 'ngx-toastr';
import { Location } from "@angular/common";
import { ApiService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-imported-contacts',
  templateUrl: './imported-contacts.component.html',
  styleUrls: ['./imported-contacts.component.css']
})
export class ImportedContactsComponent implements OnInit {

  @ViewChild('dt') table: Table;

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  dataMessage: string = Constants.FETCHING_DATA;
  loaded = false;
  validData = [];
  importCustomers = [];

  isFileValid = false;
  inValidMessages = [];
  emailsErrs = [];
  importDocs = [];
  check: boolean = false;
  submitDisabled: boolean = true;

  importData = {
    module: 'contact',
    eType: 'customer'
  }
  entity: string;

  // columns of data table
  dataColumns = [
    { field: 'displayName', header: 'File Name', type: "text" },
    { field: 'timeCreated', header: 'Uploaded', type: "text" },
    { field: "module", header: 'Module', type: 'text' },
    { field: 'fileStatus', header: 'Status', type: "text" },

  ];
  _selectedColumns: any[];
  display = false;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private location: Location, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.importData.eType = params.entity;
      this.entity = params.entity.charAt(0).toUpperCase() + params.entity.slice(1).replace('_', ' ') + 's';
      if (this.entity == 'Fcs') {
        this.entity = 'Factoring Company';
      }

    });

    this.setToggleOptions();
    this.fetchCustomersImport()
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

  isStatusValid = (status) => {
    return status == 'active' || status == 'inActive' || status == 'sold' || status == 'outOfService'
  }
  isEmailDependsOnSomeDataInRow = (email, status) => {
    return false
  }


  validateCSV($event) {

    const data: ValidatorConfig = {
      headers: [
        {
          name: 'company_name', inputName: 'companyname', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
          }, validate: function (name: string) {
            const vname = /^[a-zA-Z0-9\s]+$/;
            return vname.test(name)
          }
        },
        {
          name: 'address', inputName: 'address', required: false
        },
        {
          name: 'city', inputName: 'city', required: false
        },
        {
          name: 'state', inputName: 'state', required: false
        },
        {
          name: 'zip', inputName: 'zip', required: false
        },
        {
          name: 'phone1', inputName: 'phone1', required: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }, validate: function (phoneno: string) {
            const phoneformat = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
            return phoneformat.test(phoneno)
          }
        },
        {
          name: 'phone2', inputName: 'phone2', required: false
        },
        {
          name: 'primary_email', inputName: 'primary_email', required: true, unique: true, requiredError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column.`;
          }, validate: function (email: string) {
            const reqExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
            return reqExp.test(email)
          }
        },
        {
          name: 'secondary_emails', inputName: 'secondary_emails', isArray: true,
        },

      ]
    };
    CSVFileValidator($event.srcElement.files[0], data)
      .then(csvData => {
        if (csvData.data.length !== 0 && csvData.data.length < 201) {
          let errors = [];
          for (let i = 0; i < csvData.data.length; i++) {
            const element = csvData.data[i];
            if (element.secondary_emails.length == 1 && element.secondary_emails[0] == '') {

              element.secondary_emails = [];
            }
            if (element.secondary_emails.length > 0) {
              for (let j = 0; j < element.secondary_emails.length; j++) {
                const email = element.secondary_emails[j];

                const reqExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
                let result = reqExp.test(email)
                if (!result) {
                  errors.push(`Email is not valid in the ${i + 1} row / 9 column.`)
                }
              }
            }

          }
          this.emailsErrs = errors;
          this.check = false;
          if (csvData.inValidMessages.length === 0 && this.emailsErrs.length === 0) {
            this.validData = csvData.data;
            this.check = true;

            this.submitDisabled = false;
          }
          else {

            this.isFileValid = false;
            this.check = false;
            this.submitDisabled = true;
            this.inValidMessages = csvData.inValidMessages
          }
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

  async fetchCustomersImport() {
    let result = await this.apiService.getData(`importer/get?type=contact&entity=${this.importData.eType}`).toPromise();
    if (result.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
      this.loaded = true;
    }
    if (result && result.length > 0) {
      this.importCustomers = result;
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
        this.submitDisabled = true;
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
            this.fetchCustomersImport();
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
    this.emailsErrs = [];
    this.myInputVariable.nativeElement.value = "";
  }

  refreshData() {
    this.importCustomers = []
    this.fetchCustomersImport();
    this.dataMessage = Constants.FETCHING_DATA;
  }

  /**
    * Clears the table filters
    * @param table Table 
    */
  clear(table: Table) {
    table.clear();
  }

  backPage() {
    this.location.back()
  }

}
