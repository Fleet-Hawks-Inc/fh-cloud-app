import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { NgSelectComponent } from "@ng-select/ng-select";
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';
import Constants from '../../constants';
import { ListService } from '../../../../services';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-inventory-list',
    templateUrl: './inventory-list.component.html',
    styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {
    @ViewChild('dt') table: Table;
    @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
    environment = environment.isFeatureEnabled;
    dataMessage: string = Constants.FETCHING_DATA;
    dataMessageReq: string = Constants.FETCHING_DATA;
    items = [];
    itemGroups = {};
    vendors = {};
    warehouses = [];
    allWarehouses = [];
    partNumber = '';
    partDetails = '';
    quantity = '';
    date = '';
    warehouseID1: any = '';
    warehouseID2: any = '';

    hideShow = {
        part: true,
        name: true,
        category: true,
        vendor: true,
        quantity: true,
        unitCost: true,
        warehouse: true,
        warranty: false,
        preferredVendor: false,
    }

    totalRecords = 10;
    pageLength = 10;
    lastEvaluatedKey = '';
    partNo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    partQuantity;
    itemID = '';
    itemName = '';
    category = null;
    groupName = '';
    vendorID = null;
    companyName = '';
    suggestedVendors = [];
    suggestedItems = [];
    requiredItems = [];
    allItems = [];
    itemDetail = {
        itemID: '',
        reqItemID: '',
        partNumber: '',
        itemName: '',
        prevQuantity: '',
        reqQuantity: '',
        totalQuantity: ''
    };
    itemPrevData = {
        quantity: ''
    };
    transfer = {
        partNumber: '',
        itemID: '',
        quantity: 0,
        notes: '',
        transferQuantity: 0,
        warehouseID1: '',
        warehouseID2: '',
        vendorID: '',
        date: ''
    };
    requiredItemName = '';
    requiredCompanyName = '';
    requiredPartNumber = null;
    requiredItemID = null;
    requiredVendorID = null;
    requiredSuggestedItems = [];

    totalRecordsRequired = 10;
    requiredLastEvaluatedKey = '';
    currentTab = 'inv';
    requiredSuggestedVendors = [];
    allVendors: any = [];
    allCompanies: any = [];
    searchItems: any = [];
    requiredSuggestedPartNo = [];
    quantityError = false;
    loaded = false
    lastItemSK = '';
    lastSK = '';
    dateMinLimit = { year: 1950, month: 1, day: 1 };
    date1: any = new Date();
    futureDatesLimit = { year: this.date1.getFullYear() + 30, month: 12, day: 31 };
    employeeOptions: any[];
    _selectedColumns: any[];
    get = _.get;


   
        // columns of data table
    dataColumns = [
        { field: 'firstName', header: 'First Name', type: "text" },
        { field: 'lastName', header: 'Last Name', type: "text" },
        { field: 'email', header: 'Email', type: "text" },
        { field: 'phone', header: 'Phone', type: "text" },
        { field: 'userName', header: 'Username', type: "text" },
        { field: 'driverType', header: 'Type', type: "text" },
        { field: 'companyName', header: 'Company', type: "text" },
        { field: 'startDate', header: 'Start Date', type: "text" },
        { field: 'CDL_Number', header: 'CDL#', type: "text" },
        { field: 'licenceExpiry', header: 'CDL Expiry', type: "text" },
        { field: 'isImport', header: 'Added By', type: "text" },
        { field: "driverStatus", header: 'Status', type: 'text' },

    ];
  
    constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private listService: ListService) { }

    ngOnInit() {
        this.setToggleOptions();
        this.setEmployeeOptions();
        this.fetchWarehouses();
        this.fetchAllItemsList();
        this.initDataTable();
        this.initDataTableRequired();
        this.fetchVendors();
        this.listService.fetchVendors();
        this.disableButton();
        this.allVendors = this.listService.vendorList;
    }
    
    
        setToggleOptions() {
        this.selectedColumns = this.dataColumns;
    }
    setEmployeeOptions() {
        this.employeeOptions = [{ "value": "contractor", "name": "Contractor" }, { "name": "Employee", "value": "employee" }, { "name": "All", "value": "null" }];
    }
    @Input() get selectedColumns(): any[] {
        return this._selectedColumns;
    }

    set selectedColumns(val: any[]) {
        //restore original order
        this._selectedColumns = this.dataColumns.filter(col => val.includes(col));

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
        } else {
            this.requiredSuggestedPartNo = [];
        }
    }, 800)

    setPartNo(itemName) {
        this.requiredPartNumber = itemName;
        this.requiredSuggestedPartNo = [];
    }

    setItem(itemID, itemName, type) {
        if (type == 'inv') {
            this.itemName = itemName;
            this.itemID = itemName;
            this.suggestedItems = [];
        } else {
            this.requiredItemName = itemName;
            this.requiredItemID = itemName;
            this.requiredSuggestedItems = [];
        }
    }
    
    clearInput() {
       // this.suggestedDrivers = null;
    }

    clearSuggestions() {
       // this.driverName = null;
    }

    resetFilter() {
        if (this.itemName !== '' || this.vendorID !== null || this.category !== null) {
            this.itemID = this.itemName = this.groupName = this.companyName = '';
            this.vendorID = null;
            this.category = null;
            this.lastItemSK = '';
            this.items = [];
            this.suggestedItems = [];
            this.suggestedVendors = [];
            this.initDataTable();
            this.dataMessage = Constants.FETCHING_DATA;

        } else {
            return false;
        }
    }

    resetRequiredFilter() {
        if (this.requiredItemID !== null || this.requiredItemName !== '' || this.requiredVendorID !== null || this.requiredPartNumber !== '') {
            this.requiredItemName = this.requiredCompanyName = this.requiredPartNumber = '';
            this.requiredItemID = null;
            this.requiredVendorID = null;
            this.lastSK = "";
            this.requiredSuggestedPartNo = [];
            this.requiredItems = [];
            this.initDataTableRequired();
            this.dataMessageReq = Constants.FETCHING_DATA;

        } else {
            return false;
        }
    }

    fetchVendors() {
        this.apiService.getData(`contacts/get/list`).subscribe((result) => {
            this.vendors = result;
        });
    }



    openTransferModal() {
        $('#transferModal').modal('show');
    }

    

    fetchWarehouses() {
        this.apiService.getData('items/get/list/warehouses').subscribe((result: any) => {
            this.warehouses = result;
        });
    }

    deleteItem(eventData) {
        if (confirm('Are you sure you want to delete?') === true) {
            let record = {
                date: eventData.createdDate,
                time: eventData.createdTime,
                eventID: eventData.itemID
            }
            this.apiService.deleteData(`items/delete/item/${eventData.itemID}/${eventData.itemName}`).subscribe((result: any) => {
                this.items = [];
                this.dataMessage = Constants.FETCHING_DATA;
                this.lastEvaluatedKey = '';
                this.initDataTable();
                this.toastr.success('Inventory Item Deleted Successfully!');
            });
        }
    }
    initDataTable() {
        if (this.lastItemSK !== 'end') {
            this.apiService.getData('items/fetch/records?item=' + this.itemID + "&vendorID=" + this.vendorID + "&category=" + this.category + "&lastKey=" + this.lastItemSK).subscribe((result: any) => {
                if (result.Items.length === 0) {
                    this.dataMessage = Constants.NO_RECORDS_FOUND
                }
                if (result.Items.length > 0) {
                    if (result.LastEvaluatedKey !== undefined) {
                        this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].warehouseSK);
                    } else {
                        this.lastItemSK = 'end'
                    }
                    this.items = this.items.concat(result.Items);
                    this.loaded = true;
                }
            });
        }
    }

    initDataTableRequired() {
        if (this.lastSK !== 'end') {
            this.apiService.getData('items/fetch/required/records?item=' + this.requiredItemID + '&vendorID=' + this.requiredVendorID + '&partNo=' + this.requiredPartNumber + '&lastKey=' + this.lastSK).subscribe((result: any) => {
                if (result.Items.length === 0) {
                    this.dataMessage = Constants.NO_RECORDS_FOUND
                }
                if (result.Items.length > 0) {
                    if (result.LastEvaluatedKey !== undefined) {
                        this.lastSK = encodeURIComponent(result.Items[result.Items.length - 1].warehouseSK);
                    } else {
                        this.lastSK = 'end'
                    }
                    this.requiredItems = this.requiredItems.concat(result.Items);
                    this.loaded = true;
                }
            });
        }
    }

    hideShowColumn() {
        // for headers
        if (this.hideShow.part === false) {
            $('.col1').css('display', 'none');
        } else {
            $('.col1').css('display', '');
        }

        if (this.hideShow.name === false) {
            $('.col2').css('display', 'none');
        } else {
            $('.col2').css('display', '');
        }

        if (this.hideShow.category === false) {
            $('.col3').css('display', 'none');
        } else {
            $('.col3').css('display', '');
        }

        if (this.hideShow.vendor === false) {
            $('.col4').css('display', 'none');
        } else {
            $('.col4').css('display', '');
        }

        if (this.hideShow.quantity === false) {
            $('.col5').css('display', 'none');
        } else {
            $('.col5').css('display', '');
        }



        if (this.hideShow.unitCost === false) {
            $('.col7').css('display', 'none');
        } else {
            $('.col7').css('display', '');
        }

        if (this.hideShow.warehouse === false) {
            $('.col8').css('display', 'none');
        } else {
            $('.col8').css('display', '');
        }

        // extra columns
        if (this.hideShow.warranty === false) {
            $('.col9').css('display', 'none');
        } else {
            $('.col9').removeClass('extra');
            $('.col9').css('display', '');
        }


        if (this.hideShow.preferredVendor === false) {
            $('.col12').css('display', 'none');
        } else {
            $('.col12').removeClass('extra');
            $('.col12').css('display', '');
        }
    }

    searchFilter() {
        if (this.itemName !== '' || this.vendorID !== null || this.category !== null) {
            this.itemName = this.itemName.toLowerCase();
            if (this.itemID == '') {
                this.itemID = this.itemName;
            }
            this.dataMessage = Constants.FETCHING_DATA;
            this.lastItemSK = "";
            this.items = [];
            this.suggestedItems = [];
            this.suggestedVendors = [];
            this.initDataTable();
        } else {
            return false;
        }
    }

    searchRequiredFilter() {
        if (this.requiredItemID !== '' || this.requiredVendorID !== null || this.requiredPartNumber !== '') {
            this.requiredItems = [];
            this.requiredSuggestedPartNo = [];
            this.lastSK = "";
            this.dataMessageReq = Constants.FETCHING_DATA;
            this.initDataTableRequired();
        } else {
            return false;
        }
    }

    fetchAllItemsList() {
        this.apiService.getData(`items/get/list`).subscribe((result) => {
            this.allItems = result;
        })
    }

    deleteRequiredItem(eventData) {
        if (confirm('Are you sure you want to delete?') === true) {
            let record = {
                // date: eventData.createdDate,
                // time: eventData.createdTime,
                eventID: eventData.itemID
            }
            this.apiService.deleteData(`items/delete/required/item/${eventData.itemID}/${eventData.itemName}`).subscribe((result: any) => {

                this.requiredItems = [];
                this.requiredLastEvaluatedKey = '';
                this.dataMessage = Constants.FETCHING_DATA;
                this.initDataTableRequired();
                this.toastr.success('Required Inventory Item Deleted Successfully!');
            });
        }
    }

    addInventory(partData) {
        this.apiService.getData('items/partNumber/details/' + partData.partNumber).subscribe((result: any) => {
            const data = result.Items[0];
            this.itemPrevData = result.Items[0];
            const actualQuantity = result.Items[0].quantity;
            this.itemDetail.itemID = data.itemID;
            this.itemDetail.reqItemID = partData.itemID;
            this.itemDetail.partNumber = data.partNumber;
            this.itemDetail.itemName = data.itemName;
            this.itemDetail.prevQuantity = data.quantity;
            this.itemDetail.reqQuantity = partData.quantity;
            this.itemDetail.totalQuantity = partData.quantity + data.quantity;
            this.itemPrevData.quantity = this.itemDetail.totalQuantity;
            if (actualQuantity > 0) {
                $('#existingInvModal').modal('show');
            } else {
                this.updateItem(this.itemDetail.reqItemID);
            }
        });
    }

    updateItem(reqItemID) {
        this.apiService.putData('items/update/item', this.itemPrevData).subscribe({
            complete: () => { },
            error: (err) => { },
            next: (res) => {
                $('#existingInvModal').modal('hide');
                this.apiService.deleteData(`requiredItems/${reqItemID}`).subscribe((result: any) => {
                    this.requiredItems = [];
                    this.toastr.success('Inventory Updated Successfully');
                });
            },
        });
    }

    onScroll() {
        if (this.loaded) {
            this.initDataTable();
            this.initDataTableRequired();
        }
        this.loaded = false;
    }

    tabChange(type) {
        this.currentTab = type;
    }

    getWarehouseItems(id: any) {
        this.allWarehouses = [];
        if (id != undefined) {
            this.apiService.getData(`items/warehouseParts/${id}`).subscribe(result => {
                this.allWarehouses = result;
            })
        }
    }

    getQuanity(id: any) {
        if (id != undefined) {
            var result = this.allWarehouses.filter(item => {
                return item.partNumber === id;
            })
            this.partQuantity = result[0].quantity;
            this.transfer.vendorID = result[0].warehouseVendorID;
            this.transfer.itemID = result[0].itemID;
            this.transfer.quantity = result[0].quantity;
        }
    }

    checkQuanity(value: any) {
        if (value > this.partQuantity) {
            this.quantityError = true;
            this.transfer.transferQuantity = this.partQuantity;
        } else {
            this.quantityError = false;
        }
    }

    transferInventory() {
        this.apiService.postData('items/transfer/', this.transfer).subscribe((result: any) => {
            this.transfer = {
                itemID: '',
                quantity: 0,
                partNumber: '',
                notes: '',
                transferQuantity: 0,
                warehouseID1: '',
                warehouseID2: '',
                vendorID: '',
                date: ''
            };
            $('#transferModal').modal('hide');
            this.toastr.success('Inventory Transferred Successfully.');
            this.lastEvaluatedKey = '';
        });
    }


    disableButton() {
        if (this.transfer.warehouseID1 == '' || this.transfer.warehouseID1 == null ||
            this.transfer.warehouseID2 == '' || this.transfer.warehouseID2 == null ||
            this.transfer.partNumber == '' || this.transfer.partNumber == null ||
            this.transfer.transferQuantity <= 0 || this.transfer.transferQuantity == null ||
            this.transfer.date == '' || this.transfer.date == null || this.quantityError || this.transfer.notes.length > 500
        ) {

            return true
        } else {
            return false
        }
    }
    refreshData() {
        this.itemID = '';
        this.itemName = '';
        this.groupName = '';
        this.companyName = '';
        this.vendorID = null;
        this.category = null;
        this.lastItemSK = "";
        this.items = [];
        this.suggestedItems = [];
        this.initDataTable();
        this.dataMessage = Constants.FETCHING_DATA;
    }

    refreshReqData() {
        this.requiredItemName = '';
        this.requiredCompanyName = '';
        this.requiredPartNumber = '';
        this.requiredItemID = null;
        this.lastSK = "";
        this.requiredVendorID = null;
        this.requiredSuggestedPartNo = [];
        this.requiredItems = [];
        this.dataMessageReq = Constants.FETCHING_DATA;
        this.initDataTableRequired();
    }
    
    
        /**
     * Clears the table filters
     * @param table Table 
     */
    clear(table: Table) {
        table.clear();
    }

}