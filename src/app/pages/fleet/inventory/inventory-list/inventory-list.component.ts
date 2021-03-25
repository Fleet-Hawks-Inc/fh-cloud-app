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

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';
  partNo = [1, 2 , 3, 4, 5, 6, 7, 8, 9, 10];

  /**
   * search props
   */
  itemID = '';
  itemName = '';
  itemGroupID = '';
  groupName = '';
  vendorID = ''
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
  requiredItemID = '';
  requiredVendorID = '';
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
  totalRecordsRequired = 20;
  requiredLastEvaluatedKey = '';
  currentTab = 'inv';
  requiredSuggestedVendors = [];

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.fetchItemsCount();
    this.fetchVendors();
    this.fetchItemGroups();
    this.fetchWarehouses();
    // this.fetchRequiredItems();
    this.fetchAllItemsList();
    this.initDataTable();
    this.fetchRequiredItemsCount();
    this.initDataTableRequired();
  }

  getVendorSuggestions(value, type) {
    this.apiService
      .getData(`vendors/suggestion/${value}`)
      .subscribe((result) => {
        if(type == 'inv') {
          this.suggestedVendors = result.Items;
          if(this.suggestedVendors.length === 0) {
            this.vendorID = '';
          }
        } else {
          this.requiredSuggestedVendors = result.Items;
          if(this.requiredSuggestedVendors.length === 0) {
            this.requiredVendorID = '';
          }
        }
      });
  }

  setVendor (vendorID, companyName, type) {
    if(type == 'inv') {
      this.companyName = companyName;
      this.vendorID = vendorID;
      this.suggestedVendors = [];
    } else {
      this.requiredCompanyName = companyName;
      this.requiredVendorID = vendorID;
      this.requiredSuggestedVendors = [];
    }
  }

  getItemSuggestions(value, type) {
    if(type == 'inv') {
      this.apiService
      .getData(`items/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedItems = result.Items;
        if(this.suggestedItems.length === 0) {
          this.itemID = '';
        }
      });
    } else {
      this.apiService
      .getData(`requiredItems/suggestion/${value}`)
      .subscribe((result) => {
        this.requiredSuggestedItems = result.Items;
        console.log('requiredSuggestedItems', this.requiredSuggestedItems)
        if(this.requiredSuggestedItems.length === 0) {
          this.requiredItemID = '';
        }
      });
    }
  }

  setItem (itemID, itemName, type) {
    if(type == 'inv') {
      this.itemName = itemName;
      this.itemID = itemID;
      this.suggestedItems = [];
    } else {
      this.requiredItemName = itemName;
      this.requiredItemID = itemID;
      this.requiredSuggestedItems = [];
    }
  }

  getItemGroupSuggestions(value) {
    this.apiService
      .getData(`itemGroups/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedItemGroups = result.Items;
        if(this.suggestedItemGroups.length === 0) {
          this.itemGroupID = '';
        }
      });
  }

  setItemGroup (itemGroupID, groupName) {
    this.groupName = groupName;
    this.itemGroupID = itemGroupID;
    this.suggestedItemGroups = [];
  }
  resetFilter(){
    if (this.itemID !== '' || this.vendorID !== '' || this.itemGroupID !== '') {
      this.itemID = this.itemName = this.itemGroupID = this.groupName =  this.vendorID = this.companyName = '';
      this.fetchItemsCount();
      this.items = [];
      this.initDataTable();
      this.resetCountResult('inv');
    } else {
      return false;
    }
  }

  resetRequiredFilter(){
    if (this.requiredItemID !== '' || this.requiredItemName !== '' || this.requiredVendorID !== '' || this.requiredPartNumber !== '') {
      this.requiredItemID = this.requiredItemName = this.requiredVendorID = this.requiredCompanyName =  this.requiredPartNumber = '';
      this.fetchRequiredItemsCount();
      this.requiredItems = [];
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
    this.apiService.getData('items/get/count?itemID=' + this.itemID + '&vendorID=' + this.vendorID + '&category=' + this.itemGroupID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
      },
    });
  } 

  fetchRequiredItemsCount() {
    this.apiService.getData('requiredItems/get/count?itemID='+this.requiredItemID+'&vendorID='+this.requiredVendorID+'&partNo='+this.requiredPartNumber).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsRequired = result.Count;
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
        this.fetchItemsCount();
        this.initDataTable();
        this.toastr.success('Inventory Item Deleted Successfully!');
      });
    }
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('items/fetch/records?itemID='+this.itemID+'&vendorID='+this.vendorID+'&category='+this.itemGroupID+'&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedItems = [];
        this.suggestedVendors = [];
        this.suggestedItemGroups = [];
        this.getStartandEndVal('inv');
        
        this.items = result['Items'];
        if (this.vendorID != '') {
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
    this.apiService.getData('requiredItems/fetch/records?itemID='+this.requiredItemID+'&vendorID='+this.requiredVendorID+'&partNo='+this.requiredPartNumber+'&lastKey=' + this.requiredLastEvaluatedKey)
      .subscribe((result: any) => {
        this.requiredItems = result['Items'];
        if (this.requiredVendorID != '' || this.requiredItemID != '' || this.requiredPartNumber != '') {
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
    if (this.itemID !== '' || this.vendorID !== '' || this.itemGroupID !== '') {
      this.fetchItemsCount();
      this.items = [];
      this.initDataTable();
    } else {
      return false;
    }
  }

  searchRequiredFilter() {
    if (this.requiredItemID !== '' || this.requiredItemName !== '' || this.requiredVendorID !== '' || this.requiredPartNumber !== '') {
      this.fetchRequiredItemsCount();
      this.requiredItems = [];
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
          this.fetchRequiredItems();
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
}
