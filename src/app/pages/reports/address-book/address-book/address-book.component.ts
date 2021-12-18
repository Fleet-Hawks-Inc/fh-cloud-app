import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {
  
    addressBookList = [];
    dataMessage: string;
    company: any = null;
    type: any = null;
    lastItemSK = "";
    loaded: boolean = false;
    

  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
  this.fetchAddressBook()
  }
  
  async fetchAddressBook(refresh?:boolean) {
    if (refresh === true) {
            this.lastItemSK = '';
            this.addressBookList = [];
        }
    if (this.lastItemSK !== 'end'){
    const result = await this.apiService.getData(`contacts/fetch/addressbookrecords?company=${this.company}&type=${this.type}&lastKey=${this.lastItemSK}`).toPromise();
      this.dataMessage = Constants.FETCHING_DATA
      if (result.Items.length === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND
            }
            if (result.Items.length > 0) {
                if (result.LastEvaluatedKey !== undefined) {
                    this.lastItemSK = encodeURIComponent(result.LastEvaluatedKey.contactSK);
                    // this.lastItemSK = encodeURIComponent(result.LastEvaluatedKey.updatedSK);
                }
                else {
                    this.lastItemSK = 'end'
                }
                this.addressBookList = this.addressBookList.concat(result.Items);
                this.loaded = true;
        }
       
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
    
  onScroll() {
    if (this.loaded) {
      this.fetchAddressBook();
    }
    this.loaded = false;
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

