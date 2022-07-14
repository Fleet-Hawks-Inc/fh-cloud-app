import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, ListService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import Constants from 'src/app/pages/fleet/constants';
import { result } from 'lodash';
import { timeStamp } from 'console';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
declare var $: any;
import { NgSelectComponent } from '@ng-select/ng-select';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
    @ViewChild('dt') table: Table;
    @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
    environment = environment.isFeatureEnabled;
    dataMessage: string = Constants.FETCHING_DATA;
    dataMessageReq: string = Constants.FETCHING_DATA;
    items = [];
    vendors = [];
    warehouses = [];
    allVendors: any = [];
    allWarehouses = [];
    allCompanies: any = [];
    searchItems: any = [];
    requiredItemName = '';
    requiredCompanyName = '';
    requiredPartNumber = null;
    requiredItemID = null;
    requiredVendorID = null;
    requiredSuggestedItems = [];
    requiredSuggestedVendors = [];
    existingExportList: any = [];
    requiredExportList: any = [];
    suggestedVendors = [];
    suggestedItems = [];
    requiredItems = [];
    itemID = '';
    inventCount = {
        total: '',
    };
    requiredInventoryData = {
        totalRequired: '',
    }
    itemName = '';
    currentTab = 'inv';
    lastSK = '';
    companyName = '';
    lastItemSK = '';
    allItems = [];
    loaded = false;
    category = null;
    vendorID = null;
    isSearch = false;
    _selectedColumns: any[];
    _reqSelectedColumns: any[];
    driverOptions: any[];
    listView = true;
    visible = true;
    get = _.get;
    
  
     dataColumns = [
        {  field: 'partNumber', header: 'Part', type: "text" },
        {  field: 'itemName', header: 'Item Name', type: "text" },
        { field: 'category', header: 'Category', type: "text" },
        {  field: 'warehouseVendorID', header: 'Vendor', type: "text" },
        {  field: 'quantity', header: 'Quantity', type: "text" },
        {  field: 'costUnitType', header: 'Unit Cost', type: "text" },
        {  field: 'warehouseID', header: 'Warehouse Details', type: "text" },
    ];
    reqDataColumns = [
        { field: 'partNumber', header: 'Part#', type: "text" },
        { field: 'itemName', header: 'Item Name', type: "text" },
        { field: 'warehouseVendorID', header: 'Vendor', type: "text" },
        { field: 'quantity', header: 'Quantity', type: "text" },
    ];
    
    constructor(private apiService: ApiService, 
    private router: Router, 
    private listService: ListService,
    private toastr: ToastrService, 
    private spinner: NgxSpinnerService) { }
    
    async ngOnInit(): Promise<void> {
        this.existingInventoryList();
        this.fetchVendors();
        this.setToggleOptions();
        this.setreqToggleOptions();
        this.listService.fetchVendors();
        this.fetchExistingInventoryCount();
        this.fetchRequiredInventoryCount();
        this.requiredInventoryListReport();
        this.fetchWarehouses();
       
        this.allVendors = this.listService.vendorList;
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
  
     //Required Inventory
     setreqToggleOptions() {
        this.reqSelectedColumns = this.reqDataColumns;
    }
        @Input() get reqSelectedColumns(): any[] {
        return this._reqSelectedColumns;
    }
    
    set reqSelectedColumns(val: any[]) {
        //restore original order
        this._reqSelectedColumns = this.reqDataColumns.filter(col => val.includes(col));
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
    
     clear(table: Table) {
        table.clear();
    }
    
     openTransferModal() {
        $('#transferModal').modal('show');
    }

    // For Existing Inventory

    async existingInventoryList(refresh?: boolean) {
        if (refresh === true) {
            this.lastItemSK = '';
            this.items = [];
        }
        if (this.lastItemSK !== 'end') {
            const result = await this.apiService.getData(`items/invent/list?name=${this.itemName}&category=${this.category}&vendorID=${this.vendorID}&lastKey=${this.lastItemSK}`).toPromise();
            if (result.Items.length === 0) {
                this.dataMessage = Constants.NO_RECORDS_FOUND
                this.loaded = true;
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

    fetchExistingInventoryCount() {
        this.apiService.getData('items/count/invent/list').subscribe((result: any) => {
            this.inventCount = result;
        })
    }

    searchExistingInventory() {
        if (this.itemName !== '' || this.vendorID !== null || this.category !== null) {
            this.itemName = this.itemName.toLowerCase();
            this.items = [];
            this.lastItemSK = '';
            this.dataMessage = Constants.FETCHING_DATA;
            this.suggestedItems = [];
            this.existingInventoryList();
        } else {
            return false;
        }
    }

    resetExistingInventory() {
        if (this.itemName !== '' || this.category !== null || this.vendorID !== '' || this.lastItemSK !== '') {
            this.itemName = '';
            this.category = null;
            this.vendorID = null;
            this.items = [];
            this.lastItemSK = '';
            this.suggestedItems = [];
            this.existingInventoryList();
        }
        else {
            return false;
        }
    }
  
   refreshInventoryData(){
            this.itemName = '';
            this.category = null;
            this.vendorID = null;
            this.items = [];
            this.lastItemSK = '';
            this.suggestedItems = [];
            this.existingInventoryList();   
   }

    generateInventCSV() {
        if (this.existingExportList.length > 0) {
            let dataObject = []
            let csvArray = []
            this.existingExportList.forEach(element => {
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
            this.toastr.error("No Records found")
        }
    }

    existingExport() {
        this.apiService.getData(`items/get/existingInventory/export?type=itemName`).subscribe((result: any) => {
            this.existingExportList = result.Items;
            this.generateInventCSV();
        })
    }

    existingCSV() {
        if (this.itemName !== '' || this.vendorID !== null || this.category !== null) {
            this.existingExportList = this.items
            this.generateInventCSV();
        } else {
            this.existingExport();
        }
    }



    // For Required Inventory

    async requiredInventoryListReport(refresh?: boolean) {
        if (refresh === true) {
            this.lastSK = '';
            this.requiredItems = [];
        }
        if (this.lastSK !== 'end') {
            const result = await this.apiService.getData(`items/requiredInventory/invent/list?name=${this.requiredItemName}&vendorID=${this.requiredVendorID}&lastKey=${this.lastSK}`).toPromise();
            if (result.Items.length === 0) {
                this.dataMessageReq = Constants.NO_RECORDS_FOUND
                this.loaded = true;
            }
            if (result.Items.length > 0) {
                if (result.LastEvaluatedKey !== undefined) {
                    this.lastSK = encodeURIComponent(result.Items[result.Items.length - 1].warehouseSK);
                }
                else {
                    this.lastSK = 'end'
                }
                this.requiredItems = this.requiredItems.concat(result.Items);
                this.loaded = true;
            }
        }
    }

    fetchRequiredInventoryCount() {
        this.apiService.getData('items/count/requiredInventory/list').subscribe((result: any) => {
            this.requiredInventoryData = result;
        })
    }

    searchRequiredFilter() {
        if (this.requiredItemName !== '' || this.requiredVendorID !== null) {
            this.itemName = this.itemName.toLowerCase();
            this.requiredItems = [];
            this.lastSK = '';
            this.dataMessageReq = Constants.FETCHING_DATA;
            this.suggestedItems = [];
            this.requiredInventoryListReport();

        } else {
            return false;
        }
    }

    resetRequiredFilter() {
        if (this.requiredItemName !== '' || this.requiredVendorID !== null) {
            this.requiredItemName = this.itemName.toLowerCase();
            this.requiredItemName = '';
            this.requiredVendorID = null;
            this.requiredItems = [];
            this.lastSK = '';
            this.dataMessageReq = Constants.FETCHING_DATA;
            this.suggestedItems = [];
            this.requiredInventoryListReport();

        } else {
            return false;
        }
    }
    
    refreshRequiredData(){
            this.requiredItemName = '';
            this.requiredVendorID = null;
            this.requiredItems = [];
            this.lastSK = '';
            this.dataMessageReq = Constants.FETCHING_DATA;
            this.suggestedItems = [];
            this.requiredInventoryListReport(); 
   }

    generateRequiredCSV() {
        if (this.requiredExportList.length > 0) {
            let reqDataObject = []
            let reqCsvArray = []
            this.requiredExportList.forEach(element => {
                let obj = {}
                obj['Part No'] = element.partNumber
                obj['Item Name'] = element.itemName
                obj['Category'] = element.category
                obj['Vendors'] = this.vendors[element.warehouseVendorID]
                obj['Quantity'] = element.quantity
                reqDataObject.push(obj)
            });
            let headers = Object.keys(reqDataObject[0]).join(',')
            headers += '\n'
            reqCsvArray.push(headers)
            reqDataObject.forEach(element => {
                let obj = Object.values(element).join(',')
                obj += '\n'
                reqCsvArray.push(obj)
            });
            const blob = new Blob(reqCsvArray, { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `Required-Inventory-Report.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        else {
            this.toastr.error('No Records found');
        }
    }

    requiredExport() {
        this.apiService.getData(`items/get/requiredInventory/export?type=requiredItemName`).subscribe((result: any) => {
            this.requiredExportList = result.Items;
            this.generateRequiredCSV();
        })
    }

    requiredCSV() {
        if (this.requiredItemName !== '' || this.requiredVendorID !== null) {
            this.requiredExportList = this.requiredItems
            this.generateRequiredCSV();
        } else {
            this.requiredExport();
        }
    }


    //Common For Both Existing and Required


     onScroll = async (event: any) =>{
        if (this.loaded) {
            this.existingInventoryList();
            this.requiredInventoryListReport();
        }
        this.loaded = false;
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
                        this.requiredSuggestedItems = result;
                    });
            }
        } else {
            this.suggestedItems = [];
            this.requiredSuggestedItems = [];
        }
    }, 800)
    getPartNumberSuggestions = _.debounce(function (value) {
        if (value != '') {
            value = value.toLowerCase();
            this.apiService
                .getData(`items/partNo/suggestion/${value}?item=required`)
                .subscribe((result) => {
                    this.requiredSuggestedPartNo = result;
                });
        }
        else {
            this.requiredSuggestedPartNo = [];
        }
    }, 800)
    setItem(itemID, itemName, type) {
        if (type == 'inv') {
            this.itemName = itemName;
            this.itemID = itemName;
            this.suggestedItems = [];
        }
        else {
            this.requiredItemName = itemName;
            this.requiredItemID = itemName;
            this.requiredSuggestedItems = [];
        }
    }
    tabChange(type) {
        this.currentTab = type;
    }
    
    
}