import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import  Constants  from '../../constants';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  dataMessageReq: string = Constants.FETCHING_DATA;
  items = [];
  itemGroups = {};
  vendors = {};
  warehouses = [];

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
    onHand: true,
    unitCost: true,
    warehouse: true,
    warranty: false,
    reorderPoint: false,
    reorderQuantity: false,
    preferredVendor: false,
  }

  totalRecords = 10;
  pageLength = 10;
  lastEvaluatedKey = '';
  partNo = [1, 2 , 3, 4, 5, 6, 7, 8, 9, 10];

  /**
   * search props
   */
  itemID = '';
  itemName = '';
  itemGroupID = null;
  groupName = '';
  vendorID = null
  companyName = '';
  suggestedVendors = [];
  suggestedItems = [];
  suggestedItemGroups = [];
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

  requiredItemName = '';
  requiredCompanyName = '';
  requiredPartNumber = '';
  requiredItemID = null;
  requiredVendorID = null;
  requiredSuggestedItems = [];

  inventoryNext = false;
  inventoryPrev = true;
  inventoryDraw = 0;
  inventoryPrevEvauatedKeys = [''];
  inventoryStartPoint = 1;
  inventoryEndPoint = this.pageLength;

  requiredInventoryNext = false;
  requiredInventoryPrev = true;
  requiredInventoryDraw = 0;
  requiredInventoryPrevEvauatedKeys = [''];
  requiredInventoryStartPoint = 1;
  requiredInventoryEndPoint = this.pageLength;
  totalRecordsRequired = 10;
  requiredLastEvaluatedKey = '';
  currentTab = 'inv';
  requiredSuggestedVendors = [];
  allVendors:any = [];
  allCompanies:any = [];
  searchItems:any = [];
  requiredSuggestedPartNo = [];

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.fetchItemsCount();
    this.fetchVendors();
    this.fetchItemGroups();
    this.fetchWarehouses();
    this.fetchAllItemsList();
    this.initDataTable();
    this.fetchRequiredItemsCount();
    this.initDataTableRequired();
    this.fetchAllVendors();
    this.fetchAllCompanies();
    this.fetchAllItems();
  }

  getItemSuggestions(value, type) {
    if(value != '') {
      value = value.toLowerCase();
      if(type == 'inv') {
        this.apiService
        .getData(`items/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestedItems = result.Items;
        });
      } else {
        this.apiService
        .getData(`items/suggestion/${value}`)
        .subscribe((result) => {
          this.requiredSuggestedItems = result.Items;
        });
      }
    } else {
      this.suggestedItems = [];
      this.requiredSuggestedItems = [];
    }
  }

  getPartNumberSuggestions(value) {
    if(value != '') {
      value = value.toLowerCase();
      this.apiService
      .getData(`requiredItems/suggestion/${value}`)
      .subscribe((result) => {
        this.requiredSuggestedPartNo = result.Items;
      });
    } else {
      this.requiredSuggestedPartNo = [];
    }
  }

  setPartNo (itemName) {
    this.requiredPartNumber = itemName;
    this.requiredSuggestedPartNo = [];
  }

  setItem (itemID, itemName, type) {
    if(type == 'inv') {
      this.itemName = itemName;
      this.itemID = itemName;
      this.suggestedItems = [];
    } else {
      this.requiredItemName = itemName;
      this.requiredItemID = itemName;
      this.requiredSuggestedItems = [];
    }
  }

  resetFilter(){
    if (this.itemName !== '' || this.vendorID !== null || this.itemGroupID !== null) {
      this.itemID = this.itemName = this.groupName = this.companyName = '';
      this.vendorID = null;
      this.itemGroupID = null;
      this.fetchItemsCount();
      this.items = [];
      this.suggestedItems = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.initDataTable();
      this.resetCountResult('inv');
    } else {
      return false;
    }
  }

  resetRequiredFilter(){
    if (this.requiredItemID !== null || this.requiredItemName !== '' || this.requiredVendorID !== null || this.requiredPartNumber !== '') {
      this.requiredItemName = this.requiredCompanyName =  this.requiredPartNumber = '';
      this.requiredItemID = null;
      this.requiredVendorID = null;
      this.fetchRequiredItemsCount();
      this.requiredSuggestedPartNo = [];
      this.requiredItems = [];
      this.dataMessageReq = Constants.FETCHING_DATA;
      this.initDataTableRequired();
      this.resetCountResult('req');
    } else {
      return false;
    }
  }

  fetchVendors(){
    this.apiService.getData(`vendors/get/list`).subscribe((result) => {
      this.vendors = result;
    });
  }

  fetchItemGroups(){
    this.apiService.getData(`itemGroups/get/list`).subscribe((result) => {
      this.itemGroups = result;
    });
  }

  openTransferModal(){
    $('#transferModal').modal('show');
  }

  fetchItemsCount() {
    this.apiService.getData('items/get/count?item=' + this.itemID + '&vendorID=' + this.vendorID + '&category=' + this.itemGroupID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;

        if(this.itemID != '' || this.vendorID != null || this.itemGroupID != null) {
          this.inventoryEndPoint = this.totalRecords;
        }
      },
    });
  } 

  fetchRequiredItemsCount() {
    this.apiService.getData('requiredItems/get/count?item='+this.requiredItemID+'&vendorID='+this.requiredVendorID+'&partNo='+this.requiredPartNumber).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsRequired = result.Count;

        if(this.requiredItemID != null || this.requiredVendorID != null || this.requiredPartNumber != '') {
          this.requiredInventoryEndPoint = this.totalRecords;
        }
      },
    });
  } 

  fetchWarehouses(){
    this.apiService.getData('warehouses/get/list').subscribe((result: any) => {
      this.warehouses = result;
    });
  }

  fetchRequiredItems(){
    this.apiService.getData('requiredItems').subscribe((result: any) => {
      this.requiredItems = result.Items;
    });
  }

  deleteItem(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`items/isDeleted/${entryID}/`+1)
      .subscribe((result: any) => {
        this.items = [];
        this.inventoryDraw = 0;
        this.lastEvaluatedKey = '';
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchItemsCount();
        this.initDataTable();
        this.toastr.success('Inventory Item Deleted Successfully!');
      });
    }
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('items/fetch/records?item='+this.itemID+'&vendorID='+this.vendorID+'&category='+this.itemGroupID+'&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedItems = [];
        this.suggestedVendors = [];
        this.suggestedItemGroups = [];
        this.getStartandEndVal('inv');
        
        this.items = result['Items'];
        if (this.vendorID != null || this.itemGroupID != null || this.itemID != null) {
          this.inventoryStartPoint = 1;
          this.inventoryEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.inventoryNext = false;
          // for prev button
          if (!this.inventoryPrevEvauatedKeys.includes(result['LastEvaluatedKey'].itemID)) {
            this.inventoryPrevEvauatedKeys.push(result['LastEvaluatedKey'].itemID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].itemID;
          
        } else {
          this.inventoryNext = true;
          this.lastEvaluatedKey = '';
          this.inventoryEndPoint = this.totalRecords;
        }

        if(this.totalRecords < this.inventoryEndPoint) {
          this.inventoryEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.inventoryDraw > 0) {
          this.inventoryPrev = false;
        } else {
          this.inventoryPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableRequired() {
    this.spinner.show();
    this.apiService.getData('requiredItems/fetch/records?item='+this.requiredItemID+'&vendorID='+this.requiredVendorID+'&partNo='+this.requiredPartNumber+'&lastKey=' + this.requiredLastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessageReq = Constants.NO_RECORDS_FOUND;
        }
        this.requiredSuggestedPartNo = [];
        this.getStartandEndVal('req');

        this.requiredItems = result['Items'];
        if (this.requiredVendorID != null || this.requiredItemID != null || this.requiredPartNumber != '') {
          this.requiredInventoryStartPoint = 1;
          this.requiredInventoryEndPoint = this.totalRecordsRequired;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.requiredInventoryNext = false;
          // for prev button
          if (!this.requiredInventoryPrevEvauatedKeys.includes(result['LastEvaluatedKey'].itemID)) {
            this.requiredInventoryPrevEvauatedKeys.push(result['LastEvaluatedKey'].itemID);
          }
          this.requiredLastEvaluatedKey = result['LastEvaluatedKey'].itemID;
          
        } else {
          this.requiredInventoryNext = true;
          this.requiredLastEvaluatedKey = '';
          this.requiredInventoryEndPoint = this.totalRecordsRequired;
        }

        if(this.totalRecordsRequired < this.requiredInventoryEndPoint) {
          this.requiredInventoryEndPoint = this.totalRecordsRequired;
        }

        // disable prev btn
        if (this.requiredInventoryDraw > 0) {
          this.requiredInventoryPrev = false;
        } else {
          this.requiredInventoryPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  hideShowColumn() {
    // for headers
    if(this.hideShow.part === false) {
      $('.col1').css('display', 'none');
    } else {
      $('.col1').css('display', '');
    }

    if(this.hideShow.name === false) {
      $('.col2').css('display', 'none');
    } else {
      $('.col2').css('display', '');
    }

    if(this.hideShow.category === false) {
      $('.col3').css('display', 'none');
    } else {
      $('.col3').css('display', '');
    }

    if(this.hideShow.vendor === false) {
      $('.col4').css('display', 'none');
    } else {
      $('.col4').css('display', '');
    }

    if(this.hideShow.quantity === false) {
      $('.col5').css('display', 'none');
    } else {
      $('.col5').css('display', '');
    }

    if(this.hideShow.onHand === false) {
      $('.col6').css('display', 'none');
    } else {
      $('.col6').css('display', '');
    }

    if(this.hideShow.unitCost === false) {
      $('.col7').css('display', 'none');
    } else {
      $('.col7').css('display', '');
    }

    if(this.hideShow.warehouse === false) {
      $('.col8').css('display', 'none');
    } else {
      $('.col8').css('display', '');
    }

    // extra columns
    if(this.hideShow.warranty === false) {
      $('.col9').css('display', 'none');
    } else {
      $('.col9').removeClass('extra');
      $('.col9').css('display', '');
    }

    if(this.hideShow.reorderPoint === false) {
      $('.col10').css('display', 'none');
    } else {
      $('.col10').removeClass('extra');
      $('.col10').css('display', '');
    }

    if(this.hideShow.reorderQuantity === false) {
      $('.col11').css('display', 'none');
    } else {
      $('.col11').removeClass('extra');
      $('.col11').css('display', '');
    }
    if(this.hideShow.preferredVendor === false) {
      $('.col12').css('display', 'none');
    } else {
      $('.col12').removeClass('extra');
      $('.col12').css('display', '');
    }
  }

  searchFilter() {
    if (this.itemName !== '' || this.vendorID !== null || this.itemGroupID !== null) {
      this.itemName = this.itemName.toLowerCase();
      if(this.itemID == '') {
        this.itemID = this.itemName;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchItemsCount();
      this.items = [];
      this.suggestedItems = [];
      this.suggestedVendors = [];
      this.suggestedItemGroups = [];
      this.initDataTable();
    } else {
      return false;
    }
  }

  searchRequiredFilter() {
    if (this.requiredItemID !== '' || this.requiredVendorID !== null || this.requiredPartNumber !== '') {
      this.requiredItems = [];
      this.requiredSuggestedPartNo = [];
      this.fetchRequiredItemsCount();
      this.dataMessageReq = Constants.FETCHING_DATA;
      this.requiredSuggestedPartNo = [];
      this.initDataTableRequired();
    } else {
      return false;
    }
  }

  fetchAllItemsList(){
    this.apiService.getData(`items/get/list`).subscribe((result) => {
      this.allItems = result;
    })
  }

  deleteRequiredItem(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
        .deleteData(`requiredItems/${entryID}`)
        .subscribe((result: any) => {
          this.requiredItems = [];
          this.requiredInventoryDraw = 0;
          this.requiredLastEvaluatedKey = '';
          this.dataMessageReq = Constants.FETCHING_DATA;
          this.fetchRequiredItemsCount();
          this.initDataTableRequired();
          this.toastr.success('Required Item Deleted Successfully!');
        });
    }
  }

  addInventory(partData) {
    this.apiService.getData('items/partNumber/details/'+partData.partNumber).subscribe((result: any) => {
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
          this.fetchRequiredItems();
          this.toastr.success('Inventory Updated Successfully');
        });
      },
    });
  }

  getStartandEndVal(type) {
    if(type == 'inv') {
      this.inventoryStartPoint = this.inventoryDraw * this.pageLength + 1;
      this.inventoryEndPoint = this.inventoryStartPoint + this.pageLength - 1;
    } else {
      this.requiredInventoryStartPoint = this.requiredInventoryDraw * this.pageLength + 1;
      this.requiredInventoryEndPoint = this.requiredInventoryStartPoint + this.pageLength - 1;
    }
  }

  // next button func
  nextResults(type) {
    if(type == 'inv') {
      this.inventoryNext = true;
      this.inventoryPrev = true;
      this.inventoryDraw += 1;
      this.initDataTable();
    } else {
      this.requiredInventoryNext = true;
      this.requiredInventoryPrev = true; 
      this.requiredInventoryDraw += 1;
      this.initDataTableRequired();
    }
  }

  // prev button func
  prevResults(type) {
    if(type == 'inv') {
      this.inventoryNext = true;
      this.inventoryPrev = true;
      this.inventoryDraw -= 1;
      this.lastEvaluatedKey = this.inventoryPrevEvauatedKeys[this.inventoryDraw];
      this.initDataTable();
    } else {
      this.requiredInventoryNext = true;
      this.requiredInventoryPrev = true; 
      this.requiredInventoryDraw -= 1;
      this.requiredLastEvaluatedKey = this.requiredInventoryPrevEvauatedKeys[this.requiredInventoryDraw];
      this.initDataTableRequired();
    }
  }

  resetCountResult(type) {
    if(type == 'inv') {
      this.inventoryStartPoint = 1;
      this.inventoryEndPoint = this.pageLength;
      this.inventoryDraw = 0;
    } else {
      this.requiredInventoryStartPoint = 1;
      this.requiredInventoryEndPoint = this.pageLength;
      this.requiredInventoryDraw = 0;
    }
  }

  tabChange(type) {
    this.currentTab = type;
  }

  fetchAllVendors() {
    this.apiService.getData('vendors').subscribe((result: any) => {
      this.allVendors = result.Items;
    });
  }

  fetchAllCompanies() {
    this.apiService.getData('itemGroups').subscribe((result: any) => {
      this.allCompanies = result.Items;
    });
  }

  fetchAllItems(){
    this.apiService.getData(`items`).subscribe((result) => {
      this.searchItems = result.Items;
    })
  }
}
