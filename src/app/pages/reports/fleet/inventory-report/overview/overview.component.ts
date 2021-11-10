import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import Constants from 'src/app/pages/fleet/constants';
import { result } from 'lodash';
import { timeStamp } from 'console';
import { ToastrService } from 'ngx-toastr';
import { ListService } from 'src/app/services';

import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
    dataMessage: string = Constants.FETCHING_DATA;
    items = [];
    vendors = [];
    warehouses = [];
    allVendors: any = [];
    allWarehouses = [];
    allCompanies: any = [];
    searchItems: any = [];
    suggestedVendors = [];
    suggestedItems = [];
    itemID = '';
    inventCount = {
        total: '',
    };
    itemName = '';
    companyName = '';
    lastItemSK = '';
    allItems = [];
    loaded = false;
    category = null;
    vendorID = null;
    constructor(private apiService: ApiService, private router: Router, private listService: ListService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }
    ngOnInit() {
        this.inventListReport();
        this.fetchVendors();
        this.listService.fetchVendors();
        this.fetchInventCount();
        this.fetchWarehouses();
        this.allVendors = this.listService.vendorList;
    }
    fetchInventCount() {
        this.apiService.getData('items/count/invent/list').subscribe((result: any) => {
            this.inventCount = result;
        })
    }
    async inventListReport(refresh?: boolean) {
        if (refresh === true) {
            this.lastItemSK = '';
            this.items = [];
        }
        if (this.lastItemSK !== 'end') {
            const result = await this.apiService.getData(`items/invent/list?name=${this.itemName}&category=${this.category}&vendorID=${this.vendorID}&lastKey=${this.lastItemSK}`).toPromise();
            if (result.Items.length === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND
            }
            if (result.Items.length > 0) {
                if (result.LastEvaluatedKey !== undefined) {
                    this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].warehouseSK);
                }
                else {
                    this.lastItemSK = 'end'
                }
                this.items = this.items.concat(result.Items);
                this.loaded = true;
            }
        }
    }
    onScroll() {
        if (this.loaded) {
            this.inventListReport();
        }
        this.loaded = false;
    }
    fetchVendors() {
        this.apiService.getData(`contacts/get/list/vendor`).subscribe((result: any) => {
            this.vendors = result;
        });
    }
    fetchWarehouses() {
        this.apiService.getData('items/get/list/warehouses').subscribe((result: any) => {
            this.warehouses = result;
        });
    }
    searchFilter() {
        if (this.itemName !== '' || this.vendorID !== null || this.category !== null) {
            this.itemName = this.itemName.toLowerCase();
            this.items = [];
            this.lastItemSK = '';
            this.dataMessage = Constants.FETCHING_DATA;
            this.suggestedItems = [];
            this.inventListReport();
        } else {
            return false;
        }
    }
    resetFilter() {
        if (this.itemName !== '' || this.category !== null || this.vendorID !== '' || this.lastItemSK !== '') {
            this.itemName = '';
            this.category = null;
            this.vendorID = null;
            this.items = [];
            this.lastItemSK = '';
            this.suggestedItems = [];
            this.inventListReport();
        }
        else {
            return false;
        }
    }
    getItemSuggestions = _.debounce(function (value, type) {
        if (value != '') {
            value = value.toLowerCase();
            if (type === 'inv') {
                this.apiService
                    .getData(`items/suggestion/${value}?type=inventory`)
                    .subscribe((result) => {
                        this.suggestedItems = result;
                    });
            } else {
                this.apiService
                    .getData(`items/suggestion/${value}?item=required`)
                    .subscribe((result) => {
                    });
            }
        } else {
            this.suggestedItems = [];
        }
    }, 800)

    getPartNumberSuggestions = _.debounce(function (value) {
        if (value != '') {
            value = value.toLowerCase();
            this.apiService
                .getData(`items/partNo/suggestion/${value}?item=required`)
                .subscribe((result) => {
                });
        }
    }, 800)
    setItem(itemID, itemName, type) {
        if (type == 'inv') {
            this.itemName = itemName;
            this.itemID = itemName;
            this.suggestedItems = [];
        }
    }
    generateInventCSV() {
        if (this.items.length > 0) {
            let dataObject = []
            let csvArray = []
            this.items.forEach(element => {
                let obj = {}
                obj['Part No'] = element.partNumber
                obj['Item Name'] = element.itemName
                obj['Category'] = element.category
                obj['Vendors'] = this.vendors[element.warehouseVendorID]
                obj['Quantity'] = element.quantity
                obj['Unit Cost'] = element.cost + ' ' + element.costUnitType
                obj['Warehouse Details'] = this.warehouses[element.warehouseID]
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
                link.setAttribute('download', `Inventory-Report.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        else {
            this.toastr.error('No Records found')
        }
    }
}