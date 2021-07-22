import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Constants from '../../constants';
import { ListService } from '../../../../services';
import * as _ from 'lodash';

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
  /**
   * search props
   */
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
  allVendors: any = [];
  allCompanies: any = [];
  searchItems: any = [];
  requiredSuggestedPartNo = [];
  quantityError = false;

  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date1: any = new Date();
  futureDatesLimit = { year: this.date1.getFullYear() + 30, month: 12, day: 31 };

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private listService: ListService) { }

  ngOnInit() {
    this.fetchItemsCount();
    this.fetchWarehouses();
    this.fetchAllItemsList();
    this.fetchVendors();
    this.fetchRequiredItemsCount();
    this.listService.fetchVendors();
    this.disableButton();
    this.allVendors = this.listService.vendorList;
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

  resetFilter() {
    if (this.itemName !== '' || this.vendorID !== null || this.category !== null) {
      this.itemID = this.itemName = this.groupName = this.companyName = '';
      this.vendorID = null;
      this.category = null;
      this.fetchItemsCount();
      this.items = [];
      this.suggestedItems = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.resetCountResult('inv');
    } else {
      return false;
    }
  }

  resetRequiredFilter() {
    if (this.requiredItemID !== null || this.requiredItemName !== '' || this.requiredVendorID !== null || this.requiredPartNumber !== '') {
      this.requiredItemName = this.requiredCompanyName = this.requiredPartNumber = '';
      this.requiredItemID = null;
      this.requiredVendorID = null;
      this.fetchRequiredItemsCount();
      this.requiredSuggestedPartNo = [];
      this.requiredItems = [];
      this.dataMessageReq = Constants.FETCHING_DATA;
      this.resetCountResult('req');
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

  fetchItemsCount() {
    this.apiService.getData('items/get/count?item=' + this.itemID + '&vendorID=' + this.vendorID + '&category=' + this.category).subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.totalRecords = result.Count;

        if (this.itemID !== '' || this.vendorID !== null || this.category !== null) {
          this.inventoryEndPoint = this.totalRecords;
        }

        this.initDataTable();
      },
    });
  }

  fetchRequiredItemsCount() {
    this.apiService.getData('items/get/required/count?item=' + this.requiredItemID + '&vendorID=' + this.requiredVendorID + '&partNo=' + this.requiredPartNumber).subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.totalRecordsRequired = result.Count;
        if (this.requiredItemID != null || this.requiredVendorID != null || this.requiredPartNumber != '') {
          this.requiredInventoryEndPoint = this.totalRecords;
        }

        this.initDataTableRequired();
      },
    });
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
      this.apiService.deleteData(`items/delete/item/${eventData.itemID}` ).subscribe((result: any) => {

        this.items = [];
        this.inventoryDraw = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        this.fetchItemsCount();
        this.toastr.success('Inventory Item Deleted Successfully!');
      });
    }
  }
  initDataTable() {
    this.spinner.show();
    this.apiService.getData('items/fetch/records?item=' + this.itemID + '&vendorID=' + this.vendorID + '&category=' + this.category + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedItems = [];
        this.suggestedVendors = [];
        this.getStartandEndVal('inv');

        this.items = result[`Items`];
        if (this.vendorID != null || this.category != null || this.itemID != null) {
          this.inventoryStartPoint = 1;
          this.inventoryEndPoint = this.totalRecords;
        }

        if (result[`LastEvaluatedKey`] !== undefined) {
          const lastEvalKey = result[`LastEvaluatedKey`].warehouseSK.replace(/#/g, '--');
          this.inventoryNext = false;
          // for prev button
          if (!this.inventoryPrevEvauatedKeys.includes(lastEvalKey)) {
            this.inventoryPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKey = lastEvalKey;

        } else {
          this.inventoryNext = true;
          this.lastEvaluatedKey = '';
          this.inventoryEndPoint = this.totalRecords;
        }

        if (this.totalRecords < this.inventoryEndPoint) {
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
    this.apiService.getData('items/fetch/required/records?item=' + this.requiredItemID + '&vendorID=' + this.requiredVendorID + '&partNo=' + this.requiredPartNumber + '&lastKey=' + this.requiredLastEvaluatedKey)
      .subscribe((result: any) => {
        if (result.Items.length == 0) {
          this.dataMessageReq = Constants.NO_RECORDS_FOUND;
        }
        this.requiredSuggestedItems = [];
        this.requiredSuggestedPartNo = [];
        this.getStartandEndVal('req');

        this.requiredItems = result[`Items`];
        if (this.requiredVendorID != null || this.requiredItemID != null || this.requiredPartNumber != '') {
          this.requiredInventoryStartPoint = 1;
          this.requiredInventoryEndPoint = this.totalRecordsRequired;
        }

        if (result[`LastEvaluatedKey`] !== undefined) {
          const lastEvalKey = result[`LastEvaluatedKey`].warehouseSK.replace(/#/g, '--');
          this.requiredInventoryNext = false;
          // for prev button
          if (!this.requiredInventoryPrevEvauatedKeys.includes(lastEvalKey)) {
            this.requiredInventoryPrevEvauatedKeys.push(lastEvalKey);
          }
          this.requiredLastEvaluatedKey = lastEvalKey;

        } else {
          this.requiredInventoryNext = true;
          this.requiredLastEvaluatedKey = '';
          this.requiredInventoryEndPoint = this.totalRecordsRequired;
        }

        if (this.totalRecordsRequired < this.requiredInventoryEndPoint) {
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
      this.fetchItemsCount();
      this.items = [];
      this.suggestedItems = [];
      this.suggestedVendors = [];
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
      this.apiService.deleteData(`items/delete/required/item/${eventData.itemID}`).subscribe((result: any) => {

        this.requiredItems = [];
        this.requiredInventoryDraw = 0;
        this.requiredLastEvaluatedKey = '';
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchRequiredItemsCount();
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
         // this.fetchRequiredItems();
          this.toastr.success('Inventory Updated Successfully');
        });
      },
    });
  }

  getStartandEndVal(type) {
    if (type == 'inv') {
      this.inventoryStartPoint = this.inventoryDraw * this.pageLength + 1;
      this.inventoryEndPoint = this.inventoryStartPoint + this.pageLength - 1;
    } else {
      this.requiredInventoryStartPoint = this.requiredInventoryDraw * this.pageLength + 1;
      this.requiredInventoryEndPoint = this.requiredInventoryStartPoint + this.pageLength - 1;
    }
  }

  // next button func
  nextResults(type) {
    if (type == 'inv') {
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
    if (type == 'inv') {
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
    if (type == 'inv') {
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


  getWarehouseItems(id: any) {
    this.allWarehouses = [];
    if(id != undefined) {
      this.apiService.getData(`items/warehouseParts/${id}`).subscribe(result => {
        this.allWarehouses = result;
      })
    }
  }

  getQuanity(id: any) {
    if(id != undefined) {
      var result = this.allWarehouses.filter(item => {
        return item.partNumber === id;
      })
      this.partQuantity = result[0].quantity;
      this.transfer.vendorID = result[0].warehouseVendorID;
      this.transfer.itemID = result[0].itemID;
      this.transfer.quantity = result[0].quantity;
      
    }
    
  }

  checkQuanity (value: any){
    if(value > this.partQuantity ) {
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
        this.fetchItemsCount();
      });
  }

  
  disableButton() {
    if(this.transfer.warehouseID1 == '' || this.transfer.warehouseID1 == null || 
    this.transfer.warehouseID2 == '' || this.transfer.warehouseID2 == null || 
    this.transfer.partNumber == '' || this.transfer.partNumber == null ||
    this.transfer.transferQuantity <= 0 || this.transfer.transferQuantity == null ||
    this.transfer.date == '' || this.transfer.date == null || this.quantityError || this.transfer.notes.length > 500
    ){

      return true
    } else {
      return false
    }
    
    
    
  }
}
