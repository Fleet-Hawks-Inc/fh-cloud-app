import { Component, OnInit, ViewChild, Input, TemplateRef } from '@angular/core';
import { ApiService } from 'src/app/services';
import { Router } from '@angular/router';
import Constants from 'src/app/pages/fleet/constants';
import { SelectionType, ColumnMode } from "@swimlane/ngx-datatable";
import { ToastrService } from 'ngx-toastr';
import { result } from 'lodash';
import * as html2pdf from "html2pdf.js";
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment'
import { Table } from 'primeng/table';
import Constant from "src/app/pages/fleet/constants";
import * as _ from "lodash";
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { NgSelectComponent } from '@ng-select/ng-select';
declare var $: any;

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {
     @ViewChild('myTable') table: any;
    @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
    @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
     environment = environment.isFeatureEnabled;
    
    addressBookList = []
    company: any = null;
    type: any = null;
    lastItemSK = "";
    loaded: boolean = false;
   _selectedColumns: any[];
    listView = true;
    visible = true;
    ColumnMode = ColumnMode;
    SelectionType = SelectionType;
    dataMessage: string = Constants.FETCHING_DATA;
    
     dataColumns = [
        {  field: 'cName', header: 'Company Name', type: "text" },
        {  field: 'workEmail', header: 'Email', type: "text" },
        { field: 'workPhone', header: 'Phone', type: "text" },
        {  field: 'eTypes', header: 'Type', type: "text" },
        {  field: 'ctyName', header: 'Address', type: "text" },
    ];
    

  constructor(private apiService: ApiService, 
  private toastr: ToastrService,
  private modalService: NgbModal,
  private spinner: NgxSpinnerService) { }

  async ngOnInit(): Promise<void> {
  this.fetchAddressBook()
  this.setToggleOptions();
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
   
   
   clear(table: Table) {
        table.clear();
    }
  
  fetchAddressBook() {
    if (this.lastItemSK !== 'end'){
    this.apiService.getData(`contacts/fetch/addressbookrecords?company=${this.company}&type=${this.type}&lastKey=${this.lastItemSK}`).subscribe((result:any) => {
      this.dataMessage = Constants.FETCHING_DATA
      if (result.Items.length === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND
            }
            if (result.Items.length > 0) {
                if (result.LastEvaluatedKey !== undefined) {
                    this.lastItemSK = encodeURIComponent(result.LastEvaluatedKey.contactSK);
                }
                else {
                    this.lastItemSK = 'end'
                }
                this.addressBookList = this.addressBookList.concat(result.Items);
                this.loaded = true;
            }
       });
    }   
  } 
 
  searchFilter() {
      if(this.company !== null || this.type !== null){
        this.dataMessage = Constants.FETCHING_DATA;
        this.addressBookList = [];
        this.lastItemSK = '';
        this.fetchAddressBook();
      }else{
        return false
      }
    }
    
  onScroll = async (event: any) => {
    if (this.loaded) {
      this.fetchAddressBook();
    }
    this.loaded = false;
  }
  
   refreshData(){
      this.company = null;
      this.type = null;
      this.lastItemSK = '';
      this.dataMessage = Constants.FETCHING_DATA;
      this.addressBookList = [];
      this.fetchAddressBook();
   }
    
  resetFilter() {
    if (this.company !== null || this.type !== null) {
      this.company = null;
      this.type = null;
      this.lastItemSK = '';
      this.dataMessage = Constants.FETCHING_DATA;
      this.addressBookList = [];
      this.fetchAddressBook();
    }
    else {
      return false;
    }
  }
  
  
  generateCSV() {
        if (this.addressBookList.length > 0) {
            let dataObject = []
            let csvArray = []
            this.addressBookList.forEach(element => {
                let obj = {}
                obj["Company Name"] = element.cName
                obj["Email"] = element.workEmail
                obj["Phone"] = element.workPhone
                obj["Type"] = element.eTypes.join(' ')
                obj["Address"] = element.adrs[0].manual === true ? (
                                        element.adrs[0].add1 + " "
                                        +
                                        element.adrs[0].add2 + " "
                                        +
                                        element.adrs[0].ctyName + " "
                                        +
                                        element.adrs[0].sName + " "
                                        +
                                        element.adrs[0].cName + " "
                                        +
                                        element.adrs[0].zip ) : 

                                        ( element.adrs[0].userLoc.replace(/, /g, ' ') + " "
                                        +
                                        element.adrs[0].zip )
                                        
                dataObject.push(obj)
            });
            let headers = Object.keys(dataObject[0]).join(',')
            headers += '\n'
            csvArray.push(headers)
            dataObject.forEach(element => {
                let obj = Object.values(element).join(',')
                obj += '\n'
                csvArray.push(obj)
            });
            const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Service-Program.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        else {
            this.toastr.error("No Records found")
        }
  }
  
  requiredExport() {
        this.apiService.getData(`contacts/get/getFull/export`).subscribe((result: any) => {
            this.addressBookList = result.Items;
            this.generateCSV();
        })
    }
    
    requiredCSV() {
        if (this.company !== null || this.type !== null) {
            this.generateCSV();
        } else {
            this.requiredExport();
        }
    }
}